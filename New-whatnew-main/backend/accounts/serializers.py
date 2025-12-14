from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import models
from .models import CustomUser, BuyerProfile, SellerProfile, Address

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'phone_number', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class BuyerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(max_length=10, required=False, allow_blank=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone_number', 'referral_code']
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value, is_active=True).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate_referral_code(self, value):
        if value and value.strip():
            from .referral_models import ReferralCode
            try:
                referral_code = ReferralCode.objects.get(code=value.upper(), is_active=True)
                return value.upper()
            except ReferralCode.DoesNotExist:
                raise serializers.ValidationError("Invalid or inactive referral code.")
        return value
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'buyer'
        
        # Check if user already exists (inactive user from OTP flow)
        email = validated_data['email']
        existing_user = CustomUser.objects.filter(email=email, is_active=False).first()
        
        if existing_user:
            # Update existing inactive user with full registration data
            for field, value in validated_data.items():
                if field != 'email':  # Don't update email
                    setattr(existing_user, field, value)
            
            # Hash the password properly
            existing_user.set_password(validated_data['password'])
            existing_user.save()
            
            # Create or get buyer profile
            BuyerProfile.objects.get_or_create(user=existing_user)
            user = existing_user
        else:
            # Create new inactive user for OTP verification
            validated_data['is_active'] = False
            user = CustomUser.objects.create_user(**validated_data)
            BuyerProfile.objects.create(user=user)
        
        # Handle referral code if provided
        if referral_code and referral_code.strip():
            self._apply_referral_code(user, referral_code.strip())
        
        return user
    
    def _apply_referral_code(self, user, referral_code_text):
        from .referral_models import ReferralCode, Referral, ReferralStats, ReferralReward, ReferralCampaign
        from django.db import transaction
        from django.utils import timezone
        
        try:
            with transaction.atomic():
                # Get the referral code
                referral_code = ReferralCode.objects.get(code=referral_code_text, is_active=True)
                
                # Check if user is trying to use their own code (shouldn't happen due to validation)
                if referral_code.user == user:
                    return
                
                # Check if user has already used a referral code (shouldn't happen for new users)
                if Referral.objects.filter(referred_user=user).exists():
                    return
                
                # Create referral relationship
                referral = Referral.objects.create(
                    referrer=referral_code.user,
                    referred_user=user,
                    referral_code=referral_code
                )
                
                # Update referral stats for referrer
                referrer_stats, created = ReferralStats.objects.get_or_create(
                    user=referral_code.user
                )
                referrer_stats.total_referrals += 1
                referrer_stats.last_referral_date = timezone.now()
                referrer_stats.save()
                
                # Create initial rewards
                self._create_referral_rewards(referral)
                
        except Exception as e:
            # Log the error but don't fail the registration
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to apply referral code {referral_code_text} for user {user.username}: {str(e)}")
    
    def _create_referral_rewards(self, referral):
        from .referral_models import ReferralReward, ReferralCampaign
        from django.utils import timezone
        
        # Get active campaign or use default rewards
        active_campaign = ReferralCampaign.objects.filter(
            status='active',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).first()
        
        if active_campaign:
            referrer_amount = active_campaign.referrer_reward_amount
            referred_amount = active_campaign.referred_user_reward_amount
            reward_type = active_campaign.reward_type
        else:
            # Default rewards
            referrer_amount = 50  # ₹50 or 50 credits
            referred_amount = 25  # ₹25 or 25 credits
            reward_type = 'credits'
        
        # Create reward for referrer
        ReferralReward.objects.create(
            referral=referral,
            recipient=referral.referrer,
            reward_type=reward_type,
            amount=referrer_amount,
            description=f'Referral reward for inviting {referral.referred_user.username}'
        )
        
        # Create reward for referred user
        ReferralReward.objects.create(
            referral=referral,
            recipient=referral.referred_user,
            reward_type=reward_type,
            amount=referred_amount,
            description=f'Welcome reward for joining via referral from {referral.referrer.username}'
        )
        
        # Update referrer's level progress and generate promo codes if needed
        self._update_referrer_level_progress(referral.referrer)

    def _update_referrer_level_progress(self, referrer_user):
        """Update referrer's level progress and generate promo codes for reached levels"""
        try:
            from .promo_models import ReferralLevelProgress
            from .referral_models import ReferralStats
            
            # Get or create level progress
            progress, created = ReferralLevelProgress.objects.get_or_create(
                user=referrer_user
            )
            
            # Get current referral count
            stats, _ = ReferralStats.objects.get_or_create(user=referrer_user)
            
            # Update progress and generate promo codes
            progress.update_progress(stats.total_referrals)
            
        except Exception as e:
            # Log the error but don't fail the registration
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to update level progress for user {referrer_user.username}: {str(e)}")

class SellerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    shop_name = serializers.CharField()
    shop_address = serializers.CharField()
    aadhar_number = serializers.CharField(max_length=12)
    pan_number = serializers.CharField(max_length=10)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 
                 'phone_number', 'shop_name', 'shop_address', 'aadhar_number', 'pan_number']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        seller_data = {
            'shop_name': validated_data.pop('shop_name'),
            'shop_address': validated_data.pop('shop_address'),
            'aadhar_number': validated_data.pop('aadhar_number'),
            'pan_number': validated_data.pop('pan_number'),
        }
        validated_data.pop('password_confirm')
        validated_data['user_type'] = 'seller'
        # Keep account active so sellers can login to see their verification status
        validated_data['is_active'] = True
        
        user = CustomUser.objects.create_user(**validated_data)
        # Create seller profile with pending verification status
        SellerProfile.objects.create(
            user=user, 
            verification_status='pending',
            is_account_active=False,  # Account functionality is disabled until verified
            **seller_data
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        from .error_codes import get_error_message
        
        username = data['username']
        password = data['password']
        
        if username and password:
            # Try to authenticate with username first
            user = authenticate(username=username, password=password)
            
            # If username authentication fails, try email authentication
            if not user:
                try:
                    # Find user by email (including inactive sellers)
                    user_by_email = CustomUser.objects.filter(email=username).first()
                    if user_by_email:
                        user = authenticate(username=user_by_email.username, password=password)
                except CustomUser.DoesNotExist:
                    user = None
            
            if not user:
                # Check if user exists but password is wrong
                user_exists = CustomUser.objects.filter(
                    models.Q(username=username) | models.Q(email=username)
                ).first()
                
                if user_exists:
                    raise serializers.ValidationError({
                        'code': 'LOGIN_INVALID_CREDENTIALS',
                        'message': get_error_message('LOGIN_INVALID_CREDENTIALS')
                    })
                else:
                    raise serializers.ValidationError({
                        'code': 'LOGIN_INVALID_CREDENTIALS', 
                        'message': get_error_message('LOGIN_INVALID_CREDENTIALS')
                    })
            
            # Special handling for sellers - allow inactive accounts if they are pending verification
            if not user.is_active:
                if user.user_type == 'seller':
                    seller_profile = getattr(user, 'seller_profile', None)
                    if seller_profile and seller_profile.verification_status == 'pending':
                        # Allow login for sellers with pending verification
                        pass
                    else:
                        raise serializers.ValidationError({
                            'code': 'LOGIN_ACCOUNT_INACTIVE',
                            'message': get_error_message('LOGIN_ACCOUNT_INACTIVE')
                        })
                else:
                    # Check if user needs email verification
                    raise serializers.ValidationError({
                        'code': 'LOGIN_EMAIL_NOT_VERIFIED',
                        'message': get_error_message('LOGIN_EMAIL_NOT_VERIFIED')
                    })
            
            data['user'] = user
        return data

class BuyerProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = BuyerProfile
        fields = ['user', 'date_of_birth']

class SellerProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = SellerProfile
        fields = ['user', 'shop_name', 'shop_address', 'aadhar_number', 'pan_number', 
                 'verification_status', 'credits', 'is_account_active', 'verified_at']
        read_only_fields = ['verification_status', 'is_account_active', 'verified_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'address_type', 'full_name', 'phone_number', 'address_line_1', 
                 'address_line_2', 'city', 'state', 'postal_code', 'country', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        # If this is set as default, make other addresses non-default
        if validated_data.get('is_default', False):
            Address.objects.filter(user=user).update(is_default=False)
        
        return super().create(validated_data)

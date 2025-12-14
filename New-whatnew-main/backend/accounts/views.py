from rest_framework import generics, viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from .models import CustomUser, BuyerProfile, SellerProfile, Address
from .otp_models import OTP
from .otp_emails import send_forgot_password_otp, send_registration_otp
from .serializers import (
    BuyerRegistrationSerializer, SellerRegistrationSerializer, LoginSerializer,
    CustomUserSerializer, BuyerProfileSerializer, SellerProfileSerializer,
    AddressSerializer
)

class BuyerRegistrationView(generics.CreateAPIView):
    serializer_class = BuyerRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        from .error_codes import get_error_message, get_success_message
        
        try:
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                # Handle specific validation errors
                errors = serializer.errors
                
                if 'email' in errors:
                    if 'already exists' in str(errors['email']):
                        return Response({
                            'error': get_error_message('REGISTER_EMAIL_EXISTS'),
                            'code': 'REGISTER_EMAIL_EXISTS'
                        }, status=status.HTTP_400_BAD_REQUEST)
                        
                if 'username' in errors:
                    if 'already exists' in str(errors['username']):
                        return Response({
                            'error': get_error_message('REGISTER_USERNAME_EXISTS'),
                            'code': 'REGISTER_USERNAME_EXISTS'
                        }, status=status.HTTP_400_BAD_REQUEST)
                        
                if 'referral_code' in errors:
                    return Response({
                        'error': get_error_message('REFERRAL_INVALID_CODE'),
                        'code': 'REFERRAL_INVALID_CODE'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
                if 'non_field_errors' in errors:
                    if 'Passwords don\'t match' in str(errors['non_field_errors']):
                        return Response({
                            'error': get_error_message('REGISTER_PASSWORD_MISMATCH'),
                            'code': 'REGISTER_PASSWORD_MISMATCH'
                        }, status=status.HTTP_400_BAD_REQUEST)
                
                # Generic validation error
                return Response({
                    'error': get_error_message('REGISTER_GENERAL_ERROR'),
                    'code': 'REGISTER_GENERAL_ERROR',
                    'details': errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save()
            
            # Only create token if user is active (after OTP verification)
            response_data = {
                'user': CustomUserSerializer(user).data,
                'message': 'Registration submitted successfully. Please verify your email.' if not user.is_active else get_success_message('REGISTER_SUCCESS')
            }
            
            if user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                response_data['token'] = token.key
                
                # Add referral success message if referral code was applied
                referral_code = request.data.get('referral_code')
                if referral_code and referral_code.strip():
                    response_data['referral_message'] = get_success_message('REFERRAL_APPLIED')
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': get_error_message('REGISTER_GENERAL_ERROR'),
                'code': 'REGISTER_GENERAL_ERROR',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SellerRegistrationView(generics.CreateAPIView):
    serializer_class = SellerRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': CustomUserSerializer(user).data,
            'message': 'Seller account created successfully. Please wait for verification.'
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        from .error_codes import get_error_message, get_success_message
        
        try:
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                errors = serializer.errors
                
                # Handle non-field errors (authentication errors)
                if 'non_field_errors' in errors:
                    error_data = errors['non_field_errors'][0]
                    if isinstance(error_data, dict) and 'code' in error_data:
                        return Response({
                            'error': error_data['message'],
                            'code': error_data['code']
                        }, status=status.HTTP_401_UNAUTHORIZED)
                    else:
                        return Response({
                            'error': get_error_message('LOGIN_INVALID_CREDENTIALS'),
                            'code': 'LOGIN_INVALID_CREDENTIALS'
                        }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Handle field-specific errors
                return Response({
                    'error': get_error_message('LOGIN_INVALID_CREDENTIALS'),
                    'code': 'LOGIN_INVALID_CREDENTIALS',
                    'details': errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.validated_data['user']
            
            # Check seller account verification status
            if user.user_type == 'seller':
                seller_profile = getattr(user, 'seller_profile', None)
                if not seller_profile:
                    return Response({
                        'error': 'Seller profile not found. Please contact support.',
                        'code': 'LOGIN_SELLER_PROFILE_MISSING'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Handle different verification statuses
                if seller_profile.verification_status == 'pending':
                    return Response({
                        'error': 'account_under_review',
                        'message': 'We are reviewing your account details. You will receive an email notification of your account status within 3 to 5 business days.',
                        'verification_status': 'pending',
                        'code': 'LOGIN_SELLER_PENDING'
                    }, status=status.HTTP_403_FORBIDDEN)
                elif seller_profile.verification_status == 'rejected':
                    return Response({
                        'error': 'account_rejected',
                        'message': 'Your seller account verification was rejected. Please contact support for more information.',
                        'verification_status': 'rejected',
                        'code': 'LOGIN_SELLER_REJECTED'
                    }, status=status.HTTP_403_FORBIDDEN)
                elif not seller_profile.is_account_active:
                    return Response({
                        'error': 'account_inactive',
                        'message': 'Your seller account is inactive. Please contact support.',
                        'verification_status': seller_profile.verification_status,
                        'code': 'LOGIN_SELLER_INACTIVE'
                    }, status=status.HTTP_403_FORBIDDEN)
            
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'user': CustomUserSerializer(user).data,
                'token': token.key,
                'message': get_success_message('LOGIN_SUCCESS')
            })
            
        except Exception as e:
            return Response({
                'error': get_error_message('SYSTEM_ERROR'),
                'code': 'SYSTEM_ERROR',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        logout(request)
        return Response({'message': 'Logout successful'})

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user_data = CustomUserSerializer(user).data
        
        if user.user_type == 'buyer':
            profile = getattr(user, 'buyer_profile', None)
            if profile:
                user_data['profile'] = BuyerProfileSerializer(profile).data
        elif user.user_type == 'seller':
            profile = getattr(user, 'seller_profile', None)
            if profile:
                user_data['profile'] = SellerProfileSerializer(profile).data
        
        return Response(user_data)

class UpdateProfileView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        user_serializer = CustomUserSerializer(user, data=request.data, partial=True)
        
        if user_serializer.is_valid():
            user_serializer.save()
            
            # Update profile based on user type
            if user.user_type == 'buyer':
                profile = getattr(user, 'buyer_profile', None)
                if profile:
                    profile_serializer = BuyerProfileSerializer(
                        profile, data=request.data, partial=True
                    )
                    if profile_serializer.is_valid():
                        profile_serializer.save()
            
            elif user.user_type == 'seller':
                profile = getattr(user, 'seller_profile', None)
                if profile:
                    # Only allow updating certain fields
                    allowed_fields = ['shop_name', 'shop_address']
                    profile_data = {k: v for k, v in request.data.items() if k in allowed_fields}
                    profile_serializer = SellerProfileSerializer(
                        profile, data=profile_data, partial=True
                    )
                    if profile_serializer.is_valid():
                        profile_serializer.save()
            
            return Response({'message': 'Profile updated successfully'})
        
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellerVerificationStatusView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        profile = getattr(request.user, 'seller_profile', None)
        if not profile:
            return Response({'error': 'Seller profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'verification_status': profile.verification_status,
            'is_account_active': profile.is_account_active,
            'verified_at': profile.verified_at,
            'credits': profile.credits
        })

class SellerCreditsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        profile = getattr(request.user, 'seller_profile', None)
        if not profile:
            return Response({'error': 'Seller profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'credits': profile.credits,
            'message': f'You have {profile.credits} credits remaining'
        })

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        address = self.get_object()
        # Make all other addresses non-default
        Address.objects.filter(user=request.user).update(is_default=False)
        # Set this address as default
        address.is_default = True
        address.save()
        
        return Response({'message': 'Address set as default'})
    
@api_view(['POST'])
@permission_classes([AllowAny])
def send_forgot_password_otp_view(request):
    """Send OTP for forgot password"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the most recent active user with this email
        # If there are multiple users, prioritize active ones, then most recent
        users = CustomUser.objects.filter(email=email).order_by('-is_active', '-date_joined')
        if not users.exists():
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the first user (most recent active or most recent if none are active)
        user = users.first()
        
        # If user is not active, they haven't completed registration
        if not user.is_active:
            return Response({'error': 'Please complete your registration first'}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': 'User lookup failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Generate new OTP using the class method
    otp = OTP.generate_otp(user, email, 'forgot_password')
    
    # Send OTP email
    try:
        send_forgot_password_otp(user, otp.otp_code)
        return Response({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_forgot_password_otp_view(request):
    """Verify OTP and allow password reset"""
    print(f"🔍 DEBUG: Forgot password OTP verification request data: {request.data}")
    
    email = request.data.get('email')
    otp_code = request.data.get('otp_code')
    new_password = request.data.get('new_password')
    
    print(f"🔍 DEBUG: Extracted email: {email}")
    print(f"🔍 DEBUG: Extracted otp_code: {otp_code}")
    print(f"🔍 DEBUG: Extracted new_password: {'***' if new_password else None}")
    
    if not all([email, otp_code, new_password]):
        print(f"❌ DEBUG: Missing required fields - email: {email}, otp_code: {otp_code}, new_password: {'provided' if new_password else 'missing'}")
        return Response({'error': 'Email, OTP code, and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the most recent active user with this email
        users = CustomUser.objects.filter(email=email).order_by('-is_active', '-date_joined')
        if not users.exists():
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        user = users.first()
        
        # If user is not active, they haven't completed registration
        if not user.is_active:
            return Response({'error': 'Please complete your registration first'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': 'User lookup failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Find valid OTP
    try:
        otp = OTP.objects.get(
            user=user,
            email=email,
            otp_code=otp_code,
            otp_type='forgot_password',
            is_used=False,
            expires_at__gt=timezone.now()
        )
    except OTP.DoesNotExist:
        return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update password
    user.password = make_password(new_password)
    user.save()
    
    # Mark OTP as used
    otp.is_used = True
    otp.save()
    
    return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_registration_otp_view(request):
    """Send OTP for registration verification"""
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists and is verified
    try:
        # Get the most recent user with this email
        users = CustomUser.objects.filter(email=email).order_by('-is_active', '-date_joined')
        
        if users.exists():
            user = users.first()
            if user.is_active:
                return Response({'error': 'User with this email is already registered and verified'}, status=status.HTTP_400_BAD_REQUEST)
            # User exists but not verified, we can send OTP for verification
        else:
            # User doesn't exist, create a temporary inactive user for OTP verification
            user = CustomUser.objects.create_user(
                email=email,
                username=email,  # temporary username
                is_active=False  # inactive until OTP verification
            )
    except Exception as e:
        return Response({'error': 'Failed to process registration request'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Generate new OTP using the class method
    otp = OTP.generate_otp(user, email, 'registration')
    
    # Send OTP email
    try:
        send_registration_otp(
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            user_type=user.user_type,
            otp_code=otp.otp_code
        )
        return Response({'message': 'OTP sent to your email for verification'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_registration_otp_view(request):
    """Verify registration OTP and activate account"""
    print(f"🔍 DEBUG: Registration OTP verification request data: {request.data}")
    print(f"🔍 DEBUG: Request method: {request.method}")
    print(f"🔍 DEBUG: Request headers: {dict(request.headers)}")
    
    email = request.data.get('email')
    otp_code = request.data.get('otp_code')
    
    print(f"🔍 DEBUG: Extracted email: '{email}' (type: {type(email)})")
    print(f"🔍 DEBUG: Extracted otp_code: '{otp_code}' (type: {type(otp_code)})")
    
    if not email:
        print(f"❌ DEBUG: Email is missing or empty")
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not otp_code:
        print(f"❌ DEBUG: OTP code is missing or empty")
        return Response({'error': 'OTP code is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not all([email, otp_code]):
        print(f"❌ DEBUG: Missing required fields - email: {email}, otp_code: {otp_code}")
        return Response({'error': 'Email and OTP code are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get the most recent inactive user with this email
        users = CustomUser.objects.filter(email=email, is_active=False).order_by('-date_joined')
        if not users.exists():
            return Response({'error': 'No pending registration found for this email'}, status=status.HTTP_404_NOT_FOUND)
        
        user = users.first()
    except Exception as e:
        return Response({'error': 'User lookup failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Check if user is already verified (shouldn't happen but just in case)
    if user.is_active:
        return Response({'error': 'User is already verified'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Find valid OTP
    try:
        otp = OTP.objects.get(
            user=user,
            email=email,
            otp_code=otp_code,
            otp_type='registration',
            is_used=False,
            expires_at__gt=timezone.now()
        )
    except OTP.DoesNotExist:
        return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Activate user account
    user.is_active = True
    user.save()
    
    # Mark OTP as used
    otp.is_used = True
    otp.save()
    
    # Create token for the user
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'message': 'Registration verified successfully',
        'user': CustomUserSerializer(user).data,
        'token': token.key
    }, status=status.HTTP_200_OK)

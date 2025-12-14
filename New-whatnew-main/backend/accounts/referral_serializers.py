from rest_framework import serializers
from django.db import models
from django.utils import timezone
from .referral_models import ReferralCode, Referral, ReferralReward, ReferralStats, ReferralCampaign

class ReferralCodeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ReferralCode
        fields = ['id', 'user', 'user_name', 'code', 'is_active', 'created_at']
        read_only_fields = ['id', 'user', 'code', 'created_at']

class ReferralSerializer(serializers.ModelSerializer):
    referrer_name = serializers.CharField(source='referrer.username', read_only=True)
    referred_user_name = serializers.CharField(source='referred_user.username', read_only=True)
    referral_code_text = serializers.CharField(source='referral_code.code', read_only=True)
    
    class Meta:
        model = Referral
        fields = ['id', 'referrer', 'referrer_name', 'referred_user', 'referred_user_name', 
                 'referral_code', 'referral_code_text', 'status', 'created_at', 'completed_at']
        read_only_fields = ['id', 'created_at', 'completed_at']

class ReferralRewardSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)
    referral_data = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralReward
        fields = ['id', 'referral', 'referral_data', 'recipient', 'recipient_name', 
                 'reward_type', 'amount', 'description', 'status', 'created_at', 
                 'credited_at', 'expires_at']
        read_only_fields = ['id', 'created_at', 'credited_at']
    
    def get_referral_data(self, obj):
        return {
            'referrer': obj.referral.referrer.username,
            'referred_user': obj.referral.referred_user.username,
            'code': obj.referral.referral_code.code,
        }

class ReferralStatsSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ReferralStats
        fields = ['user', 'user_name', 'total_referrals', 'successful_referrals', 
                 'total_earnings', 'total_credits_earned', 'current_streak', 'best_streak', 
                 'last_referral_date', 'updated_at']
        read_only_fields = ['user', 'updated_at']

class ReferralCampaignSerializer(serializers.ModelSerializer):
    is_active_now = serializers.BooleanField(source='is_active', read_only=True)
    
    class Meta:
        model = ReferralCampaign
        fields = ['id', 'name', 'description', 'referrer_reward_amount', 
                 'referred_user_reward_amount', 'reward_type', 'minimum_referrals', 
                 'status', 'is_active_now', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['id', 'created_at']

class ApplyReferralCodeSerializer(serializers.Serializer):
    referral_code = serializers.CharField(max_length=10)
    
    def validate_referral_code(self, value):
        try:
            referral_code = ReferralCode.objects.get(code=value.upper(), is_active=True)
        except ReferralCode.DoesNotExist:
            raise serializers.ValidationError("Invalid or inactive referral code")
        
        user = self.context['request'].user
        
        # Check if user is trying to use their own code
        if referral_code.user == user:
            raise serializers.ValidationError("You cannot use your own referral code")
        
        # Check if user has already used a referral code
        if Referral.objects.filter(referred_user=user).exists():
            raise serializers.ValidationError("You have already used a referral code")
        
        # Check if this referral relationship already exists
        if Referral.objects.filter(referrer=referral_code.user, referred_user=user).exists():
            raise serializers.ValidationError("This referral relationship already exists")
        
        return value

class ShareReferralSerializer(serializers.Serializer):
    platform = serializers.ChoiceField(
        choices=['whatsapp', 'telegram', 'sms', 'email', 'copy', 'general'], 
        default='general'
    )
    
class ReferralHistorySerializer(serializers.ModelSerializer):
    referred_user_details = serializers.SerializerMethodField()
    reward_details = serializers.SerializerMethodField()
    days_since_referral = serializers.SerializerMethodField()
    
    class Meta:
        model = Referral
        fields = ['id', 'referred_user_details', 'status', 'created_at', 'completed_at', 
                 'reward_details', 'days_since_referral']
    
    def get_referred_user_details(self, obj):
        return {
            'username': obj.referred_user.username,
            'first_name': obj.referred_user.first_name,
            'last_name': obj.referred_user.last_name,
            'joined_date': obj.referred_user.date_joined,
        }
    
    def get_reward_details(self, obj):
        try:
            # Get the first reward for this referral (there might be multiple)
            reward = obj.rewards.first()
            if reward:
                return {
                    'reward_type': reward.reward_type,
                    'amount': reward.amount,
                    'status': reward.status,
                    'credited_at': reward.credited_at,
                }
            return None
        except Exception:
            return None
    
    def get_days_since_referral(self, obj):
        return (timezone.now() - obj.created_at).days

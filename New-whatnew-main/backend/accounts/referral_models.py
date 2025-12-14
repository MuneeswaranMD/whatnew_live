from django.db import models
from django.conf import settings
import uuid
import string
import random

class ReferralCode(models.Model):
    """Model to store unique referral codes for users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_code')
    code = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Referral code {self.code} for {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_unique_code()
        super().save(*args, **kwargs)
    
    @classmethod
    def generate_unique_code(cls):
        """Generate a unique referral code"""
        while True:
            # Create a 8-character code: LIVE + 4 random chars
            code = 'LIVE' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            if not cls.objects.filter(code=code).exists():
                return code

class Referral(models.Model):
    """Model to track referral relationships"""
    REFERRAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referrals_made')
    referred_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_received')
    referral_code = models.ForeignKey(ReferralCode, on_delete=models.CASCADE, related_name='referrals')
    status = models.CharField(max_length=15, choices=REFERRAL_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['referrer', 'referred_user']
    
    def __str__(self):
        return f"{self.referrer.username} referred {self.referred_user.username}"

class ReferralReward(models.Model):
    """Model to track referral rewards"""
    REWARD_TYPE_CHOICES = [
        ('credits', 'Credits'),
        ('cash', 'Cash'),
        ('discount', 'Discount'),
        ('bonus', 'Bonus'),
    ]
    
    REWARD_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('credited', 'Credited'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='rewards')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_rewards')
    reward_type = models.CharField(max_length=15, choices=REWARD_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=15, choices=REWARD_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    credited_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.reward_type} reward of ₹{self.amount} for {self.recipient.username}"

class ReferralStats(models.Model):
    """Model to track user referral statistics"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='referral_stats')
    total_referrals = models.PositiveIntegerField(default=0)
    successful_referrals = models.PositiveIntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_credits_earned = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)  # For gamification
    best_streak = models.PositiveIntegerField(default=0)
    last_referral_date = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Referral stats for {self.user.username}"

class ReferralCampaign(models.Model):
    """Model for referral campaigns (for future gamification)"""
    CAMPAIGN_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    referrer_reward_amount = models.DecimalField(max_digits=10, decimal_places=2)
    referred_user_reward_amount = models.DecimalField(max_digits=10, decimal_places=2)
    reward_type = models.CharField(max_length=15, choices=ReferralReward.REWARD_TYPE_CHOICES, default='credits')
    minimum_referrals = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=15, choices=CAMPAIGN_STATUS_CHOICES, default='active')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Campaign: {self.name}"
    
    @property
    def is_active(self):
        from django.utils import timezone
        now = timezone.now()
        return self.status == 'active' and self.start_date <= now <= self.end_date

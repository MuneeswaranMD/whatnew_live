from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import string
import random

User = get_user_model()

class PromoCode(models.Model):
    """
    Promo codes that users can earn through referrals
    """
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    
    LEVEL_CHOICES = [
        (1, 'Level 1 (0-5 referrals) - 5% discount'),
        (2, 'Level 2 (5-15 referrals) - 13% discount'),
        (3, 'Level 3 (15-25 referrals) - 20% discount'),
        (4, 'Level 4 (25-35 referrals) - 22% discount'),
        (5, 'Level 5 (35-60 referrals) - 25% discount'),
    ]
    
    code = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='promo_codes')
    level = models.IntegerField(choices=LEVEL_CHOICES)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    maximum_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    used_for_order = models.CharField(max_length=100, null=True, blank=True)  # Order ID
    
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.code} - Level {self.level} ({self.discount_value}% off) - {'Used' if self.is_used else 'Available'}"
    
    @classmethod
    def generate_code(cls, user, level):
        """Generate a unique promo code for a user and level"""
        while True:
            # Generate code format: LEVEL{level}_{random_string}
            random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            code = f"LEVEL{level}_{random_part}"
            
            if not cls.objects.filter(code=code).exists():
                return code
    
    def get_discount_amount(self, order_amount):
        """Calculate discount amount for given order amount"""
        if self.is_used or not self.is_active:
            return 0
        
        if order_amount < self.minimum_order_amount:
            return 0
        
        if self.discount_type == 'percentage':
            discount = (order_amount * self.discount_value) / 100
            if self.maximum_discount:
                discount = min(discount, self.maximum_discount)
            return discount
        else:
            return min(self.discount_value, order_amount)
    
    def mark_as_used(self, order_id=None):
        """Mark promo code as used"""
        self.is_used = True
        self.used_at = timezone.now()
        if order_id:
            self.used_for_order = str(order_id)
        self.save()

class ReferralLevelProgress(models.Model):
    """
    Track user's progress through referral levels and promo code generation
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_level_progress')
    current_referrals = models.IntegerField(default=0)
    current_level = models.IntegerField(default=0)
    
    # Track which level promo codes have been generated
    level_1_promo_generated = models.BooleanField(default=False)  # 5 referrals
    level_2_promo_generated = models.BooleanField(default=False)  # 15 referrals
    level_3_promo_generated = models.BooleanField(default=False)  # 25 referrals
    level_4_promo_generated = models.BooleanField(default=False)  # 35 referrals
    level_5_promo_generated = models.BooleanField(default=False)  # 60 referrals
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Referral Level Progress"
        verbose_name_plural = "Referral Level Progress"
    
    def __str__(self):
        return f"{self.user.username} - {self.current_referrals} referrals (Level {self.current_level})"
    
    def update_progress(self, referral_count):
        """Update progress and generate promo codes for reached levels"""
        self.current_referrals = referral_count
        
        # Define level thresholds and discount percentages
        levels = [
            {'threshold': 5, 'level': 1, 'discount': 5, 'generated_field': 'level_1_promo_generated'},
            {'threshold': 15, 'level': 2, 'discount': 13, 'generated_field': 'level_2_promo_generated'},
            {'threshold': 25, 'level': 3, 'discount': 20, 'generated_field': 'level_3_promo_generated'},
            {'threshold': 35, 'level': 4, 'discount': 22, 'generated_field': 'level_4_promo_generated'},
            {'threshold': 60, 'level': 5, 'discount': 25, 'generated_field': 'level_5_promo_generated'},
        ]
        
        # Check each level threshold
        for level_info in levels:
            if (referral_count >= level_info['threshold'] and 
                not getattr(self, level_info['generated_field'])):
                
                # Generate promo code for this level
                code = PromoCode.generate_code(self.user, level_info['level'])
                PromoCode.objects.create(
                    code=code,
                    user=self.user,
                    level=level_info['level'],
                    discount_type='percentage',
                    discount_value=level_info['discount'],
                    minimum_order_amount=0,  # No minimum for referral rewards
                )
                
                # Mark as generated
                setattr(self, level_info['generated_field'], True)
                self.current_level = level_info['level']
        
        self.save()
        return self.current_level

class PromoCodeUsage(models.Model):
    """
    Track promo code usage in orders
    """
    promo_code = models.ForeignKey(PromoCode, on_delete=models.CASCADE, related_name='usages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100)
    order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    used_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-used_at']
    
    def __str__(self):
        return f"{self.promo_code.code} used for order {self.order_id} by {self.user.username}"

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
import uuid

# Import referral models to register them
from .referral_models import ReferralCode, Referral, ReferralReward, ReferralStats, ReferralCampaign

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.user_type})"

class BuyerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='buyer_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Buyer: {self.user.username}"

class SellerProfile(models.Model):
    VERIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='seller_profile')
    shop_name = models.CharField(max_length=200)
    shop_address = models.TextField()
    aadhar_number = models.CharField(
        max_length=12,
        validators=[RegexValidator(regex=r'^\d{12}$', message='Aadhar number must be 12 digits')]
    )
    pan_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', message='Invalid PAN format')]
    )
    verification_status = models.CharField(
        max_length=10, 
        choices=VERIFICATION_STATUS_CHOICES, 
        default='pending'
    )
    credits = models.IntegerField(default=1)  # 1 free credit on registration
    is_account_active = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Seller: {self.shop_name} - {self.user.username}"

class Address(models.Model):
    ADDRESS_TYPE_CHOICES = [
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES, default='home')
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Addresses"
    
    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.state}"

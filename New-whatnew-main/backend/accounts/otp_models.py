from django.db import models
from django.conf import settings
from django.utils import timezone
import random
import string
from datetime import timedelta

class OTP(models.Model):
    OTP_TYPE_CHOICES = [
        ('forgot_password', 'Forgot Password'),
        ('registration', 'Registration Verification'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otps')
    email = models.EmailField()
    otp_code = models.CharField(max_length=10)
    otp_type = models.CharField(max_length=20, choices=OTP_TYPE_CHOICES)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            if self.otp_type == 'forgot_password':
                # 15 minutes expiry for forgot password
                self.expires_at = timezone.now() + timedelta(minutes=15)
            else:
                # 30 minutes expiry for registration
                self.expires_at = timezone.now() + timedelta(minutes=30)
        super().save(*args, **kwargs)
    
    @classmethod
    def generate_otp(cls, user, email, otp_type):
        """Generate OTP based on type"""
        if otp_type == 'forgot_password':
            # 7 character alphanumeric for forgot password
            otp_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
        else:
            # 5 character alphanumeric for registration
            otp_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        
        # Deactivate any existing OTPs for this user and type
        cls.objects.filter(
            user=user, 
            otp_type=otp_type, 
            is_used=False
        ).update(is_used=True)
        
        # Create new OTP
        otp = cls.objects.create(
            user=user,
            email=email,
            otp_code=otp_code,
            otp_type=otp_type
        )
        
        return otp
    
    def is_valid(self):
        """Check if OTP is valid (not used and not expired)"""
        return not self.is_used and timezone.now() < self.expires_at
    
    def mark_used(self):
        """Mark OTP as used"""
        self.is_used = True
        self.save()
    
    def __str__(self):
        return f"OTP {self.otp_code} for {self.email} ({self.otp_type})"

class RegistrationOTP(models.Model):
    """Temporary storage for registration data with OTP verification"""
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=255)  # Hashed password
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    user_type = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=10)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # 30 minutes expiry
            self.expires_at = timezone.now() + timedelta(minutes=30)
        super().save(*args, **kwargs)
    
    @classmethod
    def create_pending_registration(cls, registration_data):
        """Create pending registration with OTP"""
        # Generate 5-character alphanumeric OTP
        otp_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        
        # Remove any existing pending registration for this email
        cls.objects.filter(email=registration_data['email']).delete()
        
        # Create new pending registration
        pending_reg = cls.objects.create(
            email=registration_data['email'],
            username=registration_data['username'],
            password=registration_data['password'],  # Should be hashed
            first_name=registration_data.get('first_name', ''),
            last_name=registration_data.get('last_name', ''),
            user_type=registration_data['user_type'],
            phone_number=registration_data['phone_number'],
            otp_code=otp_code
        )
        
        return pending_reg
    
    def is_valid(self):
        """Check if pending registration is valid (not expired)"""
        return timezone.now() < self.expires_at
    
    def verify_otp(self, entered_otp):
        """Verify the entered OTP"""
        if self.otp_code == entered_otp and self.is_valid():
            self.is_verified = True
            self.save()
            return True
        return False
    
    def __str__(self):
        return f"Pending registration for {self.email}"

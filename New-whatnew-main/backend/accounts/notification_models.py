from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class Notification(models.Model):
    """Model for in-app notifications"""
    
    NOTIFICATION_TYPES = [
        ('order', 'Order'),
        ('payment', 'Payment'),
        ('referral', 'Referral'),
        ('system', 'System'),
        ('promotion', 'Promotion'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    data = models.JSONField(null=True, blank=True)  # Additional data for the notification
    is_read = models.BooleanField(default=False)
    image_url = models.URLField(null=True, blank=True)
    action_url = models.CharField(max_length=500, null=True, blank=True)  # Deep link or action
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def is_expired(self):
        """Check if notification has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @classmethod
    def create_order_notification(cls, user, order, title, message, action_url=None):
        """Create an order-related notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            type='order',
            data={
                'order_id': str(order.id),
                'order_number': order.order_number,
                'status': order.status,
                'total_amount': str(order.total_amount),
            },
            action_url=action_url or f'/orders/{order.id}',
        )
    
    @classmethod
    def create_payment_notification(cls, user, order, title, message, payment_status, action_url=None):
        """Create a payment-related notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            type='payment',
            data={
                'order_id': str(order.id),
                'order_number': order.order_number,
                'payment_status': payment_status,
                'total_amount': str(order.total_amount),
            },
            action_url=action_url or f'/orders/{order.id}',
        )
    
    @classmethod
    def create_referral_notification(cls, user, title, message, referral_data=None, action_url=None):
        """Create a referral-related notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            type='referral',
            data=referral_data or {},
            action_url=action_url or '/referrals',
        )
    
    @classmethod
    def create_system_notification(cls, user, title, message, action_url=None, image_url=None, expires_at=None):
        """Create a system notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            type='system',
            action_url=action_url,
            image_url=image_url,
            expires_at=expires_at,
        )
    
    @classmethod
    def create_promotion_notification(cls, user, title, message, promo_data=None, action_url=None, image_url=None, expires_at=None):
        """Create a promotion notification"""
        return cls.objects.create(
            user=user,
            title=title,
            message=message,
            type='promotion',
            data=promo_data or {},
            action_url=action_url,
            image_url=image_url,
            expires_at=expires_at,
        )

class NotificationPreference(models.Model):
    """User notification preferences"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Notification type preferences
    order_notifications = models.BooleanField(default=True)
    payment_notifications = models.BooleanField(default=True)
    referral_notifications = models.BooleanField(default=True)
    system_notifications = models.BooleanField(default=True)
    promotion_notifications = models.BooleanField(default=True)
    
    # Push notification preferences
    push_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Quiet hours
    quiet_hours_enabled = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Notification Preference"
        verbose_name_plural = "Notification Preferences"
    
    def __str__(self):
        return f"Notification preferences for {self.user.username}"
    
    def should_send_notification(self, notification_type):
        """Check if user wants to receive notifications of this type"""
        type_mapping = {
            'order': self.order_notifications,
            'payment': self.payment_notifications,
            'referral': self.referral_notifications,
            'system': self.system_notifications,
            'promotion': self.promotion_notifications,
        }
        return type_mapping.get(notification_type, True)
    
    def is_quiet_time(self):
        """Check if current time is within quiet hours"""
        if not self.quiet_hours_enabled or not self.quiet_hours_start or not self.quiet_hours_end:
            return False
        
        now = timezone.now().time()
        start = self.quiet_hours_start
        end = self.quiet_hours_end
        
        if start <= end:
            return start <= now <= end
        else:  # Quiet hours cross midnight
            return now >= start or now <= end

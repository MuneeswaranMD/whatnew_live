from rest_framework import serializers
from .notification_models import Notification, NotificationPreference

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    
    time_ago = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'type', 'data', 'is_read', 
            'image_url', 'action_url', 'created_at', 'read_at', 
            'expires_at', 'time_ago', 'is_expired'
        ]
        read_only_fields = ['id', 'created_at', 'read_at', 'time_ago', 'is_expired']
    
    def get_time_ago(self, obj):
        """Get human-readable time ago string"""
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"
    
    def get_is_expired(self, obj):
        """Check if notification is expired"""
        return obj.is_expired()

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for NotificationPreference model"""
    
    class Meta:
        model = NotificationPreference
        fields = [
            'order_notifications', 'payment_notifications', 'referral_notifications',
            'system_notifications', 'promotion_notifications', 'push_notifications',
            'email_notifications', 'sms_notifications', 'quiet_hours_enabled',
            'quiet_hours_start', 'quiet_hours_end'
        ]

class MarkAsReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read"""
    notification_ids = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of notification IDs to mark as read. If not provided, all notifications will be marked as read."
    )

class NotificationStatsSerializer(serializers.Serializer):
    """Serializer for notification statistics"""
    total_count = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    
    # Counts by type
    order_count = serializers.IntegerField()
    payment_count = serializers.IntegerField()
    referral_count = serializers.IntegerField()
    system_count = serializers.IntegerField()
    promotion_count = serializers.IntegerField()
    
    # Recent activity
    today_count = serializers.IntegerField()
    this_week_count = serializers.IntegerField()
    this_month_count = serializers.IntegerField()

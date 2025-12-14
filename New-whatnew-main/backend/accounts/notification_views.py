from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta

from .notification_models import Notification, NotificationPreference
from .notification_serializers import (
    NotificationSerializer, NotificationPreferenceSerializer,
    MarkAsReadSerializer, NotificationStatsSerializer
)

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filter by type if provided
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        
        # Exclude expired notifications unless specifically requested
        include_expired = self.request.query_params.get('include_expired', 'false')
        if include_expired.lower() != 'true':
            queryset = queryset.filter(
                Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'Notification marked as read'})
    
    @action(detail=False, methods=['patch'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        count = Notification.objects.filter(
            user=request.user, 
            is_read=False
        ).update(
            is_read=True, 
            read_at=timezone.now()
        )
        return Response({
            'status': f'{count} notifications marked as read',
            'count': count
        })
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all notifications for the user"""
        count, _ = Notification.objects.filter(user=request.user).delete()
        return Response({
            'status': f'{count} notifications cleared',
            'count': count
        })
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(
            user=request.user, 
            is_read=False
        ).exclude(
            expires_at__lte=timezone.now()
        ).count()
        
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get notification statistics"""
        user = request.user
        now = timezone.now()
        
        # Base queryset
        notifications = Notification.objects.filter(user=user)
        
        # Total counts
        total_count = notifications.count()
        unread_count = notifications.filter(is_read=False).count()
        read_count = total_count - unread_count
        
        # Counts by type
        type_counts = notifications.values('type').annotate(count=Count('type'))
        type_dict = {item['type']: item['count'] for item in type_counts}
        
        # Time-based counts
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)
        month_start = today_start - timedelta(days=30)
        
        today_count = notifications.filter(created_at__gte=today_start).count()
        this_week_count = notifications.filter(created_at__gte=week_start).count()
        this_month_count = notifications.filter(created_at__gte=month_start).count()
        
        stats_data = {
            'total_count': total_count,
            'unread_count': unread_count,
            'read_count': read_count,
            'order_count': type_dict.get('order', 0),
            'payment_count': type_dict.get('payment', 0),
            'referral_count': type_dict.get('referral', 0),
            'system_count': type_dict.get('system', 0),
            'promotion_count': type_dict.get('promotion', 0),
            'today_count': today_count,
            'this_week_count': this_week_count,
            'this_month_count': this_month_count,
        }
        
        serializer = NotificationStatsSerializer(stats_data)
        return Response(serializer.data)

class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    """View for managing notification preferences"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        preferences, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return preferences

# Utility functions for creating notifications

def create_order_status_notification(user, order, new_status):
    """Create notification for order status change"""
    status_messages = {
        'confirmed': 'Your order has been confirmed and is being prepared.',
        'shipped': 'Your order has been shipped and is on its way!',
        'delivered': 'Your order has been delivered successfully.',
        'cancelled': 'Your order has been cancelled.',
        'refunded': 'Your order has been refunded.',
    }
    
    status_titles = {
        'confirmed': 'Order Confirmed',
        'shipped': 'Order Shipped',
        'delivered': 'Order Delivered',
        'cancelled': 'Order Cancelled',
        'refunded': 'Order Refunded',
    }
    
    title = status_titles.get(new_status, 'Order Update')
    message = status_messages.get(new_status, f'Your order status has been updated to {new_status}.')
    
    return Notification.create_order_notification(
        user=user,
        order=order,
        title=title,
        message=message
    )

def create_payment_notification(user, order, payment_status, payment_method=None):
    """Create notification for payment events"""
    if payment_status == 'success':
        title = 'Payment Successful'
        message = f'Payment of ₹{order.total_amount} has been processed successfully.'
    elif payment_status == 'failed':
        title = 'Payment Failed'
        message = f'Payment of ₹{order.total_amount} could not be processed. Please try again.'
    elif payment_status == 'pending':
        title = 'Payment Pending'
        message = f'Payment of ₹{order.total_amount} is being processed.'
    else:
        title = 'Payment Update'
        message = f'Payment status updated to {payment_status}.'
    
    return Notification.create_payment_notification(
        user=user,
        order=order,
        title=title,
        message=message,
        payment_status=payment_status
    )

def create_referral_success_notification(referrer, referred_user, reward_amount):
    """Create notification when someone joins using referral code"""
    title = 'New Referral Success!'
    message = f'{referred_user.first_name or referred_user.username} joined using your referral code. You earned ₹{reward_amount} credits!'
    
    return Notification.create_referral_notification(
        user=referrer,
        title=title,
        message=message,
        referral_data={
            'referred_user': referred_user.username,
            'reward_amount': str(reward_amount),
            'referred_user_name': f'{referred_user.first_name} {referred_user.last_name}'.strip() or referred_user.username
        }
    )

def create_promo_code_earned_notification(user, promo_code, level):
    """Create notification when user earns a new promo code"""
    title = f'New Promo Code Earned! 🎉'
    message = f'Congratulations! You\'ve reached Level {level} and earned a {promo_code.discount_value}% discount code: {promo_code.code}'
    
    return Notification.create_referral_notification(
        user=user,
        title=title,
        message=message,
        referral_data={
            'promo_code': promo_code.code,
            'level': level,
            'discount_value': str(promo_code.discount_value),
            'discount_type': promo_code.discount_type,
        }
    )

def create_welcome_notification(user):
    """Create welcome notification for new users"""
    title = 'Welcome to whatnew! 🎉'
    message = 'Thanks for joining whatnew! Explore live shopping, share your referral code to earn rewards, and enjoy amazing deals.'
    
    return Notification.create_system_notification(
        user=user,
        title=title,
        message=message,
        action_url='/home'
    )

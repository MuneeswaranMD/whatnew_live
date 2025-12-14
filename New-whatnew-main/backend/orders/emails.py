from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

def send_order_confirmation_email(order):
    """Send order confirmation email to customer"""
    try:
        subject = f'Order Confirmation - {order.order_number}'
        
        html_message = render_to_string('emails/order_confirmation.html', {
            'order': order,
        })
        
        send_mail(
            subject=subject,
            message=f'Your order {order.order_number} has been confirmed. Total amount: ₹{order.total_amount}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Order confirmation email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send order confirmation email for order {order.order_number}: {e}')
        return False

def send_payment_success_email(order, payment_id):
    """Send payment success email to customer"""
    try:
        subject = f'Payment Successful - {order.order_number}'
        
        html_message = render_to_string('emails/payment_success.html', {
            'order': order,
            'payment_id': payment_id,
            'payment_date': timezone.now(),
        })
        
        send_mail(
            subject=subject,
            message=f'Payment successful for order {order.order_number}. Payment ID: {payment_id}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Payment success email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send payment success email for order {order.order_number}: {e}')
        return False

def send_invoice_email(order):
    """Send invoice email to customer"""
    try:
        subject = f'Invoice - {order.order_number}'
        
        html_message = render_to_string('emails/invoice.html', {
            'order': order,
        })
        
        send_mail(
            subject=subject,
            message=f'Invoice for your order {order.order_number}. Total amount: ₹{order.total_amount}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Invoice email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send invoice email for order {order.order_number}: {e}')
        return False

def send_order_notification_to_sellers(order):
    """Send order notification emails to all sellers involved in the order"""
    try:
        # Group items by seller
        sellers_items = {}
        for item in order.items.all():
            seller = item.seller
            if seller not in sellers_items:
                sellers_items[seller] = []
            sellers_items[seller].append(item)
        
        # Send email to each seller
        for seller, items in sellers_items.items():
            subject = f'New Order Received - {order.order_number}'
            
            total_seller_amount = sum(item.total_price for item in items)
            
            message = f'''
            Dear {seller.username},

            You have received a new order!

            Order Number: {order.order_number}
            Customer: {order.user.username}
            Your Items Value: ₹{total_seller_amount}

            Items:
            '''
            
            for item in items:
                message += f'- {item.product_name} x {item.quantity} = ₹{item.total_price}\n'
            
            message += f'''
            
            Customer Address:
            {order.shipping_address.get('full_name', '')}
            {order.shipping_address.get('address_line_1', '')}
            {order.shipping_address.get('city', '')}, {order.shipping_address.get('state', '')} {order.shipping_address.get('pincode', '')}
            Phone: {order.shipping_address.get('phone_number', '')}

            Please log into your seller dashboard to manage this order.

            Best regards,
            WhatNew Team
            '''
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[seller.email],
                fail_silently=False,
            )
            
            logger.info(f'Order notification email sent to seller {seller.email} for order {order.order_number}')
        
        return True
        
    except Exception as e:
        logger.error(f'Failed to send seller notification emails for order {order.order_number}: {e}')
        return False

def send_payment_failed_email(order, error_reason=None):
    """Send payment failed email to customer"""
    try:
        subject = f'Payment Failed - Order {order.order_number}'
        
        html_message = render_to_string('emails/payment_failed.html', {
            'order': order,
            'error_reason': error_reason or 'Payment could not be processed',
            'retry_url': f'{settings.FRONTEND_URL}/orders/{order.id}/retry-payment',
        })
        
        send_mail(
            subject=subject,
            message=f'Payment failed for order {order.order_number}. You can retry payment from your orders page.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Payment failed email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send payment failed email for order {order.order_number}: {e}')
        return False

def send_payment_verification_failed_email(order, payment_id):
    """Send payment verification failed email to customer"""
    try:
        subject = f'Payment Verification Issue - Order {order.order_number}'
        
        html_message = render_to_string('emails/payment_verification_failed.html', {
            'order': order,
            'payment_id': payment_id,
            'support_email': 'support@whatnew.com',
            'support_phone': '+91-12345-67890',
        })
        
        send_mail(
            subject=subject,
            message=f'Payment verification failed for order {order.order_number}. Payment ID: {payment_id}. Please contact support.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Payment verification failed email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send payment verification failed email for order {order.order_number}: {e}')
        return False

def send_payment_receipt_email(order, payment_id, payment_method='Razorpay'):
    """Send payment receipt email to customer"""
    try:
        subject = f'Payment Receipt - Order {order.order_number}'
        
        html_message = render_to_string('emails/payment_receipt.html', {
            'order': order,
            'payment_id': payment_id,
            'payment_method': payment_method,
            'payment_date': timezone.now(),
        })
        
        send_mail(
            subject=subject,
            message=f'Payment receipt for order {order.order_number}. Payment ID: {payment_id}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Payment receipt email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send payment receipt email for order {order.order_number}: {e}')
        return False

def send_order_status_update_email(order, new_status, notes=None, tracking_context=None):
    """Send order status update email to customer"""
    try:
        status_messages = {
            'confirmed': 'Your order has been confirmed and is being prepared',
            'processing': 'Your order is now being processed',
            'shipped': 'Your order has been shipped and is on its way',
            'delivered': 'Your order has been delivered successfully',
            'cancelled': 'Your order has been cancelled'
        }
        
        subject = f'Order Update - {order.order_number}'
        
        # Prepare email context
        email_context = {
            'order': order,
            'new_status': new_status,
            'status_message': status_messages.get(new_status, f'Order status updated to {new_status}'),
            'notes': notes,
            'update_date': timezone.now(),
        }
        
        # Add tracking information if provided
        if tracking_context:
            email_context.update(tracking_context)
        
        html_message = render_to_string('emails/order_status_update.html', email_context)
        
        send_mail(
            subject=subject,
            message=f'Order {order.order_number} status updated to {new_status}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Order status update email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send order status update email for order {order.order_number}: {e}')
        return False

def send_order_placed_awaiting_payment_email(order):
    """Send order placed awaiting payment email to customer"""
    try:
        subject = f'Order Placed - {order.order_number} (Payment Pending)'
        
        html_message = render_to_string('emails/order_placed_awaiting_payment.html', {
            'order': order,
        })
        
        send_mail(
            subject=subject,
            message=f'Your order {order.order_number} has been placed successfully. Please complete payment to confirm your order. Total amount: ₹{order.total_amount}',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Order placed awaiting payment email sent to {order.user.email} for order {order.order_number}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send order placed awaiting payment email for order {order.order_number}: {e}')
        return False

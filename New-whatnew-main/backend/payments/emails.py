from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import CreditPurchase

def send_credit_purchase_success_email(credit_purchase, razorpay_payment_id):
    """Send credit purchase success email with invoice"""
    user = credit_purchase.seller
    
    subject = f'Credit Purchase Successful - {credit_purchase.credits_purchased} Credits'
    
    context = {
        'user': user,
        'credit_purchase': credit_purchase,
        'razorpay_payment_id': razorpay_payment_id,
        'purchase_date': timezone.now(),
        'company_name': 'WhatNew',
        'company_email': settings.DEFAULT_FROM_EMAIL,
    }
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #28a745; margin: 0; }}
            .success-icon {{ font-size: 48px; color: #28a745; margin-bottom: 15px; }}
            .invoice-box {{ background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }}
            .invoice-row {{ display: flex; justify-content: space-between; margin: 10px 0; }}
            .total-row {{ font-weight: bold; font-size: 18px; border-top: 2px solid #dee2e6; padding-top: 10px; }}
            .footer {{ text-align: center; margin-top: 30px; color: #6c757d; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="success-icon">✅</div>
                <h1>Payment Successful!</h1>
                <p>Your credits have been added to your account</p>
            </div>
            
            <div class="invoice-box">
                <h3 style="margin-top: 0; color: #495057;">Purchase Invoice</h3>
                <div class="invoice-row">
                    <span>Payment ID:</span>
                    <span><strong>{razorpay_payment_id}</strong></span>
                </div>
                <div class="invoice-row">
                    <span>Purchase Date:</span>
                    <span>{timezone.now().strftime('%B %d, %Y at %I:%M %p')}</span>
                </div>
                <div class="invoice-row">
                    <span>Customer:</span>
                    <span>{user.get_full_name() or user.username}</span>
                </div>
                <div class="invoice-row">
                    <span>Email:</span>
                    <span>{user.email}</span>
                </div>
                <hr style="margin: 15px 0;">
                <div class="invoice-row">
                    <span>Credits Purchased:</span>
                    <span><strong>{credit_purchase.credits_purchased} Credits</strong></span>
                </div>
                <div class="invoice-row">
                    <span>Price per Credit:</span>
                    <span>₹{credit_purchase.price_per_credit:.2f}</span>
                </div>
                <div class="invoice-row total-row">
                    <span>Total Amount:</span>
                    <span><strong>₹{credit_purchase.total_amount}</strong></span>
                </div>
            </div>
            
            <div style="text-align: center;">
                <p><strong>Your credits are now available in your account!</strong></p>
                <p>You can start using them for your livestreams immediately.</p>
                <a href="{settings.FRONTEND_URL}/seller/credits" class="button">View My Credits</a>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing WhatNew!</p>
                <p>If you have any questions, contact us at {settings.DEFAULT_FROM_EMAIL}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    text_message = f"""
    Credit Purchase Successful!
    
    Dear {user.get_full_name() or user.username},
    
    Your credit purchase has been completed successfully.
    
    Purchase Details:
    - Payment ID: {razorpay_payment_id}
    - Credits Purchased: {credit_purchase.credits_purchased}
    - Amount Paid: ₹{credit_purchase.total_amount}
    - Purchase Date: {timezone.now().strftime('%B %d, %Y at %I:%M %p')}
    
    Your credits are now available in your account and can be used for livestreaming.
    
    Thank you for choosing WhatNew!
    
    Best regards,
    WhatNew Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False
        )
        print(f"Credit purchase success email sent to {user.email}")
        return True
    except Exception as e:
        print(f"Error sending credit purchase success email: {e}")
        return False

def send_credit_purchase_failed_email(user, credits, amount, razorpay_payment_id=None):
    """Send credit purchase failure email"""
    
    subject = 'Credit Purchase Failed - Payment Issue'
    
    context = {
        'user': user,
        'credits': credits,
        'amount': amount,
        'razorpay_payment_id': razorpay_payment_id,
        'failure_date': timezone.now(),
        'company_name': 'WhatNew',
        'company_email': settings.DEFAULT_FROM_EMAIL,
    }
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #dc3545; margin: 0; }}
            .error-icon {{ font-size: 48px; color: #dc3545; margin-bottom: 15px; }}
            .details-box {{ background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }}
            .footer {{ text-align: center; margin-top: 30px; color: #6c757d; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .support-box {{ background-color: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="error-icon">❌</div>
                <h1>Payment Failed</h1>
                <p>We couldn't process your credit purchase</p>
            </div>
            
            <div class="details-box">
                <h3 style="margin-top: 0; color: #495057;">Failed Purchase Details</h3>
                <p><strong>Customer: </strong> {user.get_full_name() or user.username}</p>
                <p><strong>Credits Attempted: </strong> {credits}</p>
                <p><strong>Amount: </strong> ₹{amount}</p>
                {f'<p><strong>Payment ID: </strong> {razorpay_payment_id}</p>' if razorpay_payment_id else ''}
                <p><strong>Failure Date:</strong> {timezone.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
            
            <div style="text-align: center;">
                <p><strong>Don't worry - no money has been deducted from your account.</strong></p>
                <p>You can try purchasing credits again or contact our support team for assistance.</p>
                <a href="{settings.FRONTEND_URL}/seller/credits" class="button">Try Again</a>
            </div>
            
            <div class="support-box">
                <h4 style="margin-top: 0;">Need Help?</h4>
                <p>If you continue to face issues with payment, please contact our support team:</p>
                <p><strong>Email:</strong> {settings.DEFAULT_FROM_EMAIL}</p>
                <p><strong>Support Hours:</strong> Monday to Friday, 9 AM - 6 PM IST</p>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing WhatNew!</p>
                <p>We're here to help you succeed with your livestreaming business.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    text_message = f"""
    Credit Purchase Failed
    
    Dear {user.get_full_name() or user.username},
    
    We couldn't process your credit purchase due to a payment issue.
    
    Failed Purchase Details:
    - Credits Attempted: {credits}
    - Amount: ₹{amount}
    {f'- Payment ID: {razorpay_payment_id}' if razorpay_payment_id else ''}
    - Failure Date: {timezone.now().strftime('%B %d, %Y at %I:%M %p')}
    
    Don't worry - no money has been deducted from your account.
    
    You can try purchasing credits again or contact our support team at {settings.DEFAULT_FROM_EMAIL}
    
    Best regards,
    WhatNew Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False
        )
        print(f"Credit purchase failed email sent to {user.email}")
        return True
    except Exception as e:
        print(f"Error sending credit purchase failed email: {e}")
        return False

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

def send_forgot_password_otp(user, otp_code):
    """Send forgot password OTP email"""
    try:
        # Debug: Print OTP to console for testing
        print(f"🔐 OTP DEBUG: Sending OTP {otp_code} to {user.email}")
        
        subject = 'Reset Your Password - OTP Verification'
        
        html_message = render_to_string('emails/forgot_password_otp.html', {
            'user': user,
            'otp_code': otp_code,
        })
        
        plain_message = f'''
        Hello {user.first_name},

        We received a request to reset your password for your WhatNew account.

        Your OTP: {otp_code}

        This OTP is valid for 15 minutes only.
        
        If you didn't request this, please ignore this email.

        Best regards,
        WhatNew Team
        '''
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Forgot password OTP email sent to {user.email}')
        print(f"✅ Email sent successfully to {user.email} with OTP: {otp_code}")
        return True
        
    except Exception as e:
        logger.error(f'Failed to send forgot password OTP email to {user.email}: {e}')
        print(f"❌ Failed to send email to {user.email}: {e}")
        return False

def send_registration_otp(email, username, first_name, user_type, otp_code):
    """Send registration verification OTP email"""
    try:
        subject = 'Verify Your WhatNew Account'
        
        # Use a more user-friendly approach for the email template
        display_username = "Will be set during registration" if username == email else username
        display_user_type = user_type.title() if user_type else "Will be set during registration"
        display_first_name = first_name if first_name else "New User"
        
        html_message = render_to_string('emails/registration_otp.html', {
            'email': email,
            'username': display_username,
            'first_name': display_first_name,
            'user_type': display_user_type,
            'otp_code': otp_code,
        })
        
        plain_message = f'''
        Hello {display_first_name},

        Thank you for registering with WhatNew!

        To complete your registration, please verify your email address using this OTP:

        {otp_code}

        Account Details:
        - Email: {email}
        - Username: {display_username}
        - Account Type: {display_user_type}

        This OTP is valid for 30 minutes only.

        Welcome to WhatNew!
        WhatNew Team
        '''
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Registration OTP email sent to {email}')
        return True
        
    except Exception as e:
        logger.error(f'Failed to send registration OTP email to {email}: {e}')
        return False

def send_seller_verification_success_email(user, seller_profile):
    """Send seller account verification success email"""
    try:
        subject = '🎉 Your Seller Account is Verified - Welcome to WhatNew!'
        
        html_message = render_to_string('emails/seller_account_verified.html', {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'username': user.username,
            'email': user.email,
            'shop_name': seller_profile.shop_name,
            'verified_date': seller_profile.verified_at.strftime('%B %d, %Y') if seller_profile.verified_at else timezone.now().strftime('%B %d, %Y'),
            'current_year': timezone.now().year,
        })
        
        plain_message = f'''
        Dear {user.first_name} {user.last_name},

        🎉 Great news! Your seller account for "{seller_profile.shop_name}" has been successfully verified and activated.

        Account Details:
        - Shop Name: {seller_profile.shop_name}
        - Username: {user.username}
        - Email: {user.email}
        - Verification Date: {seller_profile.verified_at.strftime('%B %d, %Y') if seller_profile.verified_at else timezone.now().strftime('%B %d, %Y')}
        - Free Credits Awarded: 1 Credit

        Next Steps:
        1. Login to your seller dashboard at: https://seller.whatnew.in/login
        2. Complete your profile setup
        3. Add your first products
        4. Set up payment details
        5. Start selling and creating livestreams

        Important Tips for Success:
        • Upload clear, high-quality product images
        • Write detailed product descriptions
        • Respond promptly to customer inquiries
        • Maintain accurate inventory levels
        • Provide excellent customer service

        If you need assistance, contact us:
        - Email: sellers@whatnew.in
        - Support Portal: Available through your dashboard

        Welcome to the WhatNew seller community!

        Best regards,
        The WhatNew Team

        ---
        This email was sent to {user.email} because your seller account was verified.
        WhatNew © {timezone.now().year}. All rights reserved.
        '''
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f'Seller verification success email sent to {user.email}')
        print(f"✅ Seller verification email sent successfully to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f'Failed to send seller verification email to {user.email}: {e}')
        print(f"❌ Failed to send seller verification email to {user.email}: {e}")
        return False

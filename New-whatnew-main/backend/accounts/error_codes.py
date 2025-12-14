"""
Error codes and user-friendly messages for authentication and referral system
"""

# Authentication Error Codes and Messages
AUTH_ERROR_CODES = {
    # Login Errors
    'LOGIN_INVALID_CREDENTIALS': {
        'code': 'LOGIN_001',
        'message': 'Invalid email/username or password. Please check your credentials and try again.',
        'description': 'The provided credentials do not match any active account'
    },
    'LOGIN_ACCOUNT_INACTIVE': {
        'code': 'LOGIN_002',
        'message': 'Your account is not active. Please check your email for verification instructions.',
        'description': 'User account exists but is not activated'
    },
    'LOGIN_ACCOUNT_SUSPENDED': {
        'code': 'LOGIN_003',
        'message': 'Your account has been suspended. Please contact support for assistance.',
        'description': 'User account has been suspended by admin'
    },
    'LOGIN_TOO_MANY_ATTEMPTS': {
        'code': 'LOGIN_004',
        'message': 'Too many failed login attempts. Please try again after 15 minutes.',
        'description': 'Account temporarily locked due to multiple failed login attempts'
    },
    'LOGIN_EMAIL_NOT_VERIFIED': {
        'code': 'LOGIN_005',
        'message': 'Please verify your email address before logging in. Check your inbox for verification link.',
        'description': 'User has not verified their email address'
    },
    
    # Registration Errors
    'REGISTER_EMAIL_EXISTS': {
        'code': 'REG_001',
        'message': 'An account with this email address already exists. Please use a different email or try logging in.',
        'description': 'Email address is already registered'
    },
    'REGISTER_USERNAME_EXISTS': {
        'code': 'REG_002',
        'message': 'This username is already taken. Please choose a different username.',
        'description': 'Username is already registered'
    },
    'REGISTER_INVALID_EMAIL': {
        'code': 'REG_003',
        'message': 'Please enter a valid email address.',
        'description': 'Email format is invalid'
    },
    'REGISTER_WEAK_PASSWORD': {
        'code': 'REG_004',
        'message': 'Password must be at least 8 characters long and contain letters and numbers.',
        'description': 'Password does not meet security requirements'
    },
    'REGISTER_PASSWORD_MISMATCH': {
        'code': 'REG_005',
        'message': 'Passwords do not match. Please make sure both password fields are identical.',
        'description': 'Password confirmation does not match password'
    },
    'REGISTER_INVALID_PHONE': {
        'code': 'REG_006',
        'message': 'Please enter a valid 10-digit phone number.',
        'description': 'Phone number format is invalid'
    },
    'REGISTER_PHONE_EXISTS': {
        'code': 'REG_007',
        'message': 'This phone number is already registered. Please use a different number.',
        'description': 'Phone number is already associated with another account'
    },
    'REGISTER_INVALID_NAME': {
        'code': 'REG_008',
        'message': 'Please enter your full name using only letters and spaces.',
        'description': 'First name or last name contains invalid characters'
    },
    'REGISTER_REQUIRED_FIELD': {
        'code': 'REG_009',
        'message': 'Please fill in all required fields marked with *',
        'description': 'Required field is missing'
    },
    'REGISTER_GENERAL_ERROR': {
        'code': 'REG_010',
        'message': 'Registration failed. Please check your information and try again.',
        'description': 'General registration error'
    },
    
    # OTP Errors
    'OTP_INVALID': {
        'code': 'OTP_001',
        'message': 'Invalid verification code. Please check the code and try again.',
        'description': 'OTP code is incorrect'
    },
    'OTP_EXPIRED': {
        'code': 'OTP_002',
        'message': 'Verification code has expired. Please request a new code.',
        'description': 'OTP has exceeded its validity period'
    },
    'OTP_ALREADY_USED': {
        'code': 'OTP_003',
        'message': 'This verification code has already been used. Please request a new one.',
        'description': 'OTP has already been consumed'
    },
    'OTP_TOO_MANY_ATTEMPTS': {
        'code': 'OTP_004',
        'message': 'Too many failed verification attempts. Please request a new code.',
        'description': 'Maximum OTP attempts exceeded'
    },
    'OTP_SEND_FAILED': {
        'code': 'OTP_005',
        'message': 'Failed to send verification code. Please check your email and try again.',
        'description': 'OTP email delivery failed'
    },
    'OTP_TOO_FREQUENT': {
        'code': 'OTP_006',
        'message': 'Please wait before requesting another verification code.',
        'description': 'OTP requested too frequently'
    },
}

# Referral Error Codes and Messages
REFERRAL_ERROR_CODES = {
    'REFERRAL_INVALID_CODE': {
        'code': 'REF_001',
        'message': 'Invalid referral code. Please check the code and try again.',
        'description': 'Referral code does not exist or is inactive'
    },
    'REFERRAL_OWN_CODE': {
        'code': 'REF_002',
        'message': 'You cannot use your own referral code.',
        'description': 'User attempted to use their own referral code'
    },
    'REFERRAL_ALREADY_USED': {
        'code': 'REF_003',
        'message': 'You have already used a referral code. Each user can only use one referral code.',
        'description': 'User has already applied a referral code previously'
    },
    'REFERRAL_CODE_EXPIRED': {
        'code': 'REF_004',
        'message': 'This referral code has expired. Please get a new code from your friend.',
        'description': 'Referral code campaign has ended'
    },
    'REFERRAL_MAX_USES_REACHED': {
        'code': 'REF_005',
        'message': 'This referral code has reached its maximum usage limit.',
        'description': 'Referral code has been used maximum allowed times'
    },
    'REFERRAL_USER_INELIGIBLE': {
        'code': 'REF_006',
        'message': 'Your account is not eligible for referral rewards.',
        'description': 'User account type or status makes them ineligible'
    },
    'REFERRAL_REWARD_FAILED': {
        'code': 'REF_007',
        'message': 'Referral code applied successfully, but reward processing failed. Contact support if needed.',
        'description': 'Referral relationship created but reward creation failed'
    },
    'REFERRAL_ONLY_DURING_REGISTRATION': {
        'code': 'REF_008',
        'message': 'Referral codes can only be applied during registration. Create a new account to use a referral code.',
        'description': 'Existing user trying to apply referral code after registration'
    },
}

# General System Error Codes
SYSTEM_ERROR_CODES = {
    'NETWORK_ERROR': {
        'code': 'SYS_001',
        'message': 'Network error. Please check your internet connection and try again.',
        'description': 'Network connectivity issues'
    },
    'SERVER_ERROR': {
        'code': 'SYS_002',
        'message': 'Server temporarily unavailable. Please try again in a few minutes.',
        'description': 'Internal server error'
    },
    'MAINTENANCE': {
        'code': 'SYS_003',
        'message': 'System is under maintenance. Please try again later.',
        'description': 'System maintenance mode'
    },
    'RATE_LIMIT_EXCEEDED': {
        'code': 'SYS_004',
        'message': 'Too many requests. Please wait a moment before trying again.',
        'description': 'API rate limit exceeded'
    },
    'INVALID_REQUEST': {
        'code': 'SYS_005',
        'message': 'Invalid request. Please refresh the page and try again.',
        'description': 'Malformed request data'
    },
}

# Success Messages
SUCCESS_MESSAGES = {
    'REGISTER_SUCCESS': 'Account created successfully! Welcome to whatnew!',
    'LOGIN_SUCCESS': 'Welcome back! You have successfully logged in.',
    'OTP_SENT': 'Verification code sent to your email. Please check your inbox.',
    'OTP_VERIFIED': 'Email verified successfully!',
    'REFERRAL_APPLIED': 'Referral code applied successfully! You and your friend will receive rewards.',
    'PASSWORD_RESET': 'Password reset successfully. You can now login with your new password.',
}

def get_error_message(error_code):
    """Get user-friendly error message for a given error code"""
    all_errors = {**AUTH_ERROR_CODES, **REFERRAL_ERROR_CODES, **SYSTEM_ERROR_CODES}
    error_info = all_errors.get(error_code)
    if error_info:
        return error_info['message']
    return 'An unexpected error occurred. Please try again.'

def get_success_message(success_code):
    """Get success message for a given success code"""
    return SUCCESS_MESSAGES.get(success_code, 'Operation completed successfully!')

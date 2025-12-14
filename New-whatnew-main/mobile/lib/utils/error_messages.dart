class ErrorMessages {
  // Authentication Error Codes (matching backend codes)
  static const Map<String, String> authErrors = {
    // Login errors
    'LOGIN_INVALID_CREDENTIALS': 'Invalid email/username or password. Please check your credentials and try again.',
    'LOGIN_ACCOUNT_INACTIVE': 'Your account is not active. Please check your email for verification instructions.',
    'LOGIN_ACCOUNT_SUSPENDED': 'Your account has been suspended. Please contact support for assistance.',
    'LOGIN_TOO_MANY_ATTEMPTS': 'Too many failed login attempts. Please try again after 15 minutes.',
    'LOGIN_EMAIL_NOT_VERIFIED': 'Please verify your email address before logging in. Check your inbox for verification link.',
    
    // Legacy error codes for backwards compatibility
    'INVALID_CREDENTIALS': 'Invalid email/username or password. Please check your credentials and try again.',
    'USER_NOT_FOUND': 'No account found with this email. Please check your email or create a new account.',
    'ACCOUNT_DISABLED': 'Your account has been disabled. Please contact support for assistance.',
    'EMAIL_NOT_VERIFIED': 'Please verify your email address before logging in. Check your inbox for verification email.',
    'ACCOUNT_PENDING': 'Your seller account is pending verification. You\'ll receive an email once approved.',
    'INVALID_PASSWORD': 'Password must be at least 8 characters long and contain letters and numbers.',
    'PASSWORDS_DONT_MATCH': 'The passwords you entered don\'t match. Please check and try again.',
    'WEAK_PASSWORD': 'Password is too weak. Please use a combination of letters, numbers, and special characters.',
    'PASSWORD_TOO_SHORT': 'Password must be at least 8 characters long.',
    'INVALID_EMAIL_FORMAT': 'Please enter a valid email address (e.g., user@example.com).',
    'EMAIL_ALREADY_EXISTS': 'An account with this email already exists. Try logging in or use a different email.',
    'USERNAME_ALREADY_EXISTS': 'This username is already taken. Please choose a different username.',
    'USERNAME_TOO_SHORT': 'Username must be at least 3 characters long.',
    'USERNAME_INVALID_CHARS': 'Username can only contain letters, numbers, and underscores.',
    'PHONE_INVALID': 'Please enter a valid 10-digit phone number.',
    'PHONE_ALREADY_EXISTS': 'This phone number is already registered. Please use a different number.',
    'REQUIRED_FIELD_MISSING': 'Please fill in all required fields marked with *.',
    'SERVER_ERROR': 'Something went wrong on our end. Please try again in a moment.',
    'NETWORK_ERROR': 'Please check your internet connection and try again.',
    'TIMEOUT_ERROR': 'Request timed out. Please check your connection and try again.',
  };

  // Registration Specific Errors (matching backend codes)
  static const Map<String, String> registrationErrors = {
    // Backend registration error codes
    'REGISTER_EMAIL_EXISTS': 'An account with this email address already exists. Please use a different email or try logging in.',
    'REGISTER_USERNAME_EXISTS': 'This username is already taken. Please choose a different username.',
    'REGISTER_INVALID_EMAIL': 'Please enter a valid email address.',
    'REGISTER_WEAK_PASSWORD': 'Password must be at least 8 characters long and contain letters and numbers.',
    'REGISTER_PASSWORD_MISMATCH': 'Passwords do not match. Please make sure both password fields are identical.',
    'REGISTER_INVALID_PHONE': 'Please enter a valid 10-digit phone number.',
    'REGISTER_PHONE_EXISTS': 'This phone number is already registered. Please use a different number.',
    'REGISTER_INVALID_NAME': 'Please enter your full name using only letters and spaces.',
    'REGISTER_REQUIRED_FIELD': 'Please fill in all required fields marked with *',
    'REGISTER_GENERAL_ERROR': 'Registration failed. Please check your information and try again.',
    
    // Legacy error codes
    'REGISTRATION_FAILED': 'Registration failed. Please check your information and try again.',
    'OTP_EXPIRED': 'Verification code has expired. Please request a new code.',
    'OTP_INVALID': 'Invalid verification code. Please check and try again.',
    'OTP_ALREADY_USED': 'This verification code has already been used. Please request a new one.',
    'EMAIL_VERIFICATION_FAILED': 'Email verification failed. Please try sending the code again.',
    'REGISTRATION_INCOMPLETE': 'Registration is incomplete. Please fill in all required information.',
    
    // Backend OTP error codes
    'OTP_TOO_MANY_ATTEMPTS': 'Too many failed verification attempts. Please request a new code.',
    'OTP_SEND_FAILED': 'Failed to send verification code. Please check your email and try again.',
    'OTP_TOO_FREQUENT': 'Please wait before requesting another verification code.',
  };

  // Referral Code Errors (matching backend codes)
  static const Map<String, String> referralErrors = {
    // Backend referral error codes
    'REFERRAL_INVALID_CODE': 'Invalid referral code. Please check the code and try again.',
    'REFERRAL_OWN_CODE': 'You cannot use your own referral code.',
    'REFERRAL_ALREADY_USED': 'You have already used a referral code. Each user can only use one referral code.',
    'REFERRAL_CODE_EXPIRED': 'This referral code has expired. Please get a new code from your friend.',
    'REFERRAL_MAX_USES_REACHED': 'This referral code has reached its maximum usage limit.',
    'REFERRAL_USER_INELIGIBLE': 'Your account is not eligible for referral rewards.',
    'REFERRAL_REWARD_FAILED': 'Referral code applied successfully, but reward processing failed. Contact support if needed.',
    'REFERRAL_ONLY_DURING_REGISTRATION': 'Referral codes can only be applied during registration. Create a new account to use a referral code.',
    
    // Legacy error codes
    'REFERRAL_CODE_INVALID': 'Invalid referral code. Please check the code and try again.',
    'REFERRAL_CODE_USED': 'You have already used a referral code. Each user can only use one referral code.',
    'REFERRAL_CODE_OWN': 'You cannot use your own referral code. Please use a code from a friend.',
    'REFERRAL_CODE_INACTIVE': 'This referral code is no longer active. Please get a new code.',
    'REFERRAL_CODE_NOT_FOUND': 'Referral code not found. Please check the code and try again.',
  };

  // Generic Error Messages (matching backend codes)
  static const Map<String, String> genericErrors = {
    // Backend system error codes
    'NETWORK_ERROR': 'Network error. Please check your internet connection and try again.',
    'SERVER_ERROR': 'Server temporarily unavailable. Please try again in a few minutes.',
    'MAINTENANCE': 'System is under maintenance. Please try again later.',
    'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment before trying again.',
    'INVALID_REQUEST': 'Invalid request. Please refresh the page and try again.',
    
    // Legacy error codes
    'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.',
    'API_ERROR': 'Unable to connect to server. Please try again later.',
    'VALIDATION_ERROR': 'Please check your input and try again.',
    'PERMISSION_DENIED': 'You don\'t have permission to perform this action.',
    'RESOURCE_NOT_FOUND': 'The requested resource was not found.',
  };

  /// Get user-friendly error message from error code or raw message
  static String getErrorMessage(String errorCodeOrMessage) {
    // First try to extract error code from backend response if it's in the format {"error_code": "CODE", "message": "..."}
    if (errorCodeOrMessage.contains('"error_code"')) {
      try {
        // Try to extract error code from JSON response
        RegExp codeRegex = RegExp(r'"error_code"\s*:\s*"([^"]+)"');
        Match? match = codeRegex.firstMatch(errorCodeOrMessage);
        if (match != null) {
          String extractedCode = match.group(1)!;
          return getErrorMessage(extractedCode);
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal processing
      }
    }
    
    // Try to match exact error codes first
    String errorCode = errorCodeOrMessage.toUpperCase().replaceAll(' ', '_');
    
    // Check in all error categories
    if (authErrors.containsKey(errorCode)) {
      return authErrors[errorCode]!;
    }
    if (registrationErrors.containsKey(errorCode)) {
      return registrationErrors[errorCode]!;
    }
    if (referralErrors.containsKey(errorCode)) {
      return referralErrors[errorCode]!;
    }
    if (genericErrors.containsKey(errorCode)) {
      return genericErrors[errorCode]!;
    }

    // Try to match common error patterns
    String lowerMessage = errorCodeOrMessage.toLowerCase();
    
    // Login error patterns
    if (lowerMessage.contains('invalid') && (lowerMessage.contains('credential') || lowerMessage.contains('password'))) {
      return authErrors['LOGIN_INVALID_CREDENTIALS']!;
    }
    if (lowerMessage.contains('account') && lowerMessage.contains('inactive')) {
      return authErrors['LOGIN_ACCOUNT_INACTIVE']!;
    }
    if (lowerMessage.contains('email') && lowerMessage.contains('not') && lowerMessage.contains('verified')) {
      return authErrors['LOGIN_EMAIL_NOT_VERIFIED']!;
    }
    
    // Registration error patterns
    if (lowerMessage.contains('email') && lowerMessage.contains('already')) {
      return registrationErrors['REGISTER_EMAIL_EXISTS']!;
    }
    if (lowerMessage.contains('username') && lowerMessage.contains('already')) {
      return registrationErrors['REGISTER_USERNAME_EXISTS']!;
    }
    if (lowerMessage.contains('password') && lowerMessage.contains('match')) {
      return registrationErrors['REGISTER_PASSWORD_MISMATCH']!;
    }
    if (lowerMessage.contains('phone') && (lowerMessage.contains('invalid') || lowerMessage.contains('format'))) {
      return registrationErrors['REGISTER_INVALID_PHONE']!;
    }
    if (lowerMessage.contains('phone') && lowerMessage.contains('already')) {
      return registrationErrors['REGISTER_PHONE_EXISTS']!;
    }
    
    // OTP error patterns
    if (lowerMessage.contains('otp') && lowerMessage.contains('invalid')) {
      return registrationErrors['OTP_INVALID']!;
    }
    if (lowerMessage.contains('otp') && lowerMessage.contains('expired')) {
      return registrationErrors['OTP_EXPIRED']!;
    }
    if (lowerMessage.contains('otp') && lowerMessage.contains('used')) {
      return registrationErrors['OTP_ALREADY_USED']!;
    }
    
    // Referral error patterns
    if (lowerMessage.contains('referral') && lowerMessage.contains('invalid')) {
      return referralErrors['REFERRAL_INVALID_CODE']!;
    }
    if (lowerMessage.contains('referral') && lowerMessage.contains('used')) {
      return referralErrors['REFERRAL_ALREADY_USED']!;
    }
    if (lowerMessage.contains('referral') && lowerMessage.contains('own')) {
      return referralErrors['REFERRAL_OWN_CODE']!;
    }
    if (lowerMessage.contains('referral') && lowerMessage.contains('registration')) {
      return referralErrors['REFERRAL_ONLY_DURING_REGISTRATION']!;
    }
    
    // Network and system error patterns
    if (lowerMessage.contains('network') || lowerMessage.contains('connection')) {
      return genericErrors['NETWORK_ERROR']!;
    }
    if (lowerMessage.contains('timeout')) {
      return authErrors['TIMEOUT_ERROR']!;
    }
    if (lowerMessage.contains('server') && lowerMessage.contains('error')) {
      return genericErrors['SERVER_ERROR']!;
    }
    if (lowerMessage.contains('rate') && lowerMessage.contains('limit')) {
      return genericErrors['RATE_LIMIT_EXCEEDED']!;
    }
    if (lowerMessage.contains('maintenance')) {
      return genericErrors['MAINTENANCE']!;
    }

    // Return the original message if no pattern matches, but clean it up
    return _cleanErrorMessage(errorCodeOrMessage);
  }

  /// Clean up raw error messages to be more user-friendly
  static String _cleanErrorMessage(String rawMessage) {
    String cleaned = rawMessage.trim();
    
    // Remove common technical prefixes
    cleaned = cleaned.replaceAll(RegExp(r'^(Error: |Exception: |ValidationError: |Bad Request: )'), '');
    
    // Capitalize first letter
    if (cleaned.isNotEmpty) {
      cleaned = cleaned[0].toUpperCase() + cleaned.substring(1);
    }
    
    // Add period if missing
    if (cleaned.isNotEmpty && !cleaned.endsWith('.')) {
      cleaned += '.';
    }
    
    return cleaned.isEmpty ? genericErrors['UNKNOWN_ERROR']! : cleaned;
  }

  /// Validate email format
  static String? validateEmail(String? email) {
    if (email == null || email.trim().isEmpty) {
      return 'Email is required';
    }
    
    email = email.trim();
    
    // Basic email format validation
    if (!RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(email)) {
      return authErrors['INVALID_EMAIL_FORMAT'];
    }
    
    return null;
  }

  /// Validate username format
  static String? validateUsername(String? username) {
    if (username == null || username.trim().isEmpty) {
      return 'Username is required';
    }
    
    username = username.trim();
    
    if (username.length < 3) {
      return authErrors['USERNAME_TOO_SHORT'];
    }
    
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(username)) {
      return authErrors['USERNAME_INVALID_CHARS'];
    }
    
    return null;
  }

  /// Validate password strength
  static String? validatePassword(String? password) {
    if (password == null || password.isEmpty) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return authErrors['PASSWORD_TOO_SHORT'];
    }
    
    // Check for at least one letter and one number
    if (!RegExp(r'^(?=.*[a-zA-Z])(?=.*\d)').hasMatch(password)) {
      return authErrors['INVALID_PASSWORD'];
    }
    
    return null;
  }

  /// Validate phone number
  static String? validatePhone(String? phone) {
    if (phone == null || phone.trim().isEmpty) {
      return 'Phone number is required';
    }
    
    phone = phone.trim().replaceAll(RegExp(r'[^\d]'), ''); // Remove non-digits
    
    if (phone.length != 10) {
      return authErrors['PHONE_INVALID'];
    }
    
    return null;
  }

  /// Validate referral code format
  static String? validateReferralCode(String? code) {
    if (code == null || code.trim().isEmpty) {
      return null; // Referral code is optional
    }
    
    code = code.trim().toUpperCase();
    
    if (code.length < 4) {
      return 'Referral code must be at least 4 characters';
    }
    
    if (code.length > 10) {
      return 'Referral code cannot be more than 10 characters';
    }
    
    if (!RegExp(r'^[A-Z0-9]+$').hasMatch(code)) {
      return 'Referral code can only contain letters and numbers';
    }
    
    return null;
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../../providers/auth_provider.dart';
import '../../constants/app_theme.dart';
import '../../widgets/custom_button.dart';

// Custom formatter to convert text to uppercase
class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    return TextEditingValue(
      text: newValue.text.toUpperCase(),
      selection: newValue.selection,
    );
  }
}

class OtpVerificationScreen extends StatefulWidget {
  final String email;
  final String otpType; // 'registration' or 'forgot_password'
  final String? newPassword; // For forgot password flow
  final VoidCallback? onVerificationSuccess;

  const OtpVerificationScreen({
    super.key,
    required this.email,
    required this.otpType,
    this.newPassword,
    this.onVerificationSuccess,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen>
    with TickerProviderStateMixin {
  final TextEditingController _otpController = TextEditingController();
  final FocusNode _otpFocusNode = FocusNode();
  bool _isLoading = false;
  
  // Dynamic OTP length based on type
  int get _otpLength {
    return widget.otpType == 'registration' ? 5 : 7;
  }
  
  String get _otpHint {
    return widget.otpType == 'registration' ? 'A1B2C' : 'A1B2C3D';
  }
  
  String get _otpDescription {
    return 'We have sent a ${_otpLength}-character verification code to';
  }
  
  // Timer for resend functionality
  Timer? _timer;
  int _countDown = 60;
  bool _canResend = false;
  
  // Animation controllers
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _startCountdown();
    _setupAnimations();
  }

  void _setupAnimations() {
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeInOut),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOutBack));
    
    _fadeController.forward();
    _slideController.forward();
  }

  void _startCountdown() {
    _canResend = false;
    _countDown = 60;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countDown > 0) {
        setState(() {
          _countDown--;
        });
      } else {
        setState(() {
          _canResend = true;
        });
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _fadeController.dispose();
    _slideController.dispose();
    _otpController.dispose();
    _otpFocusNode.dispose();
    super.dispose();
  }

  void _onOtpChanged(String value) {
    setState(() {});
    
    // Auto verify when all required digits are entered
    if (value.length == _otpLength) {
      Future.delayed(const Duration(milliseconds: 300), () {
        _verifyOtp();
      });
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.length != _otpLength) {
      _showError('Please enter complete ${_otpLength}-character OTP');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      bool success = false;

      if (widget.otpType == 'registration') {
        success = await authProvider.verifyRegistrationOtp(
          email: widget.email,
          otp: otp,
        );
      } else if (widget.otpType == 'forgot_password' && widget.newPassword != null) {
        success = await authProvider.verifyForgotPasswordOtp(
          email: widget.email,
          otp: otp,
          newPassword: widget.newPassword!,
        );
      }

      if (success && mounted) {
        _showSuccess();
        await Future.delayed(const Duration(seconds: 2));
        
        if (widget.onVerificationSuccess != null) {
          widget.onVerificationSuccess!();
        } else {
          Navigator.of(context).pop(true);
        }
      } else if (mounted) {
        _showError(authProvider.error ?? 'OTP verification failed');
      }
    } catch (e) {
      if (mounted) {
        _showError('An error occurred: $e');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _resendOtp() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = context.read<AuthProvider>();
      bool success = false;

      if (widget.otpType == 'registration') {
        success = await authProvider.sendRegistrationOtp(email: widget.email);
      } else if (widget.otpType == 'forgot_password') {
        success = await authProvider.sendForgotPasswordOtp(email: widget.email);
      }

      if (success && mounted) {
        _startCountdown();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Text('OTP sent successfully!'),
              ],
            ),
            backgroundColor: AppColors.successColor,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
        );
      } else if (mounted) {
        _showError(authProvider.error ?? 'Failed to resend OTP');
      }
    } catch (e) {
      if (mounted) {
        _showError('An error occurred: $e');
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.error, color: Colors.white),
            SizedBox(width: 8),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: AppColors.errorColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _showSuccess() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 8),
            Text(
              widget.otpType == 'registration' 
                ? 'Email verified successfully!' 
                : 'Password reset successfully!'
            ),
          ],
        ),
        backgroundColor: AppColors.successColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Widget _buildOtpField() {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.surfaceColor,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: _otpFocusNode.hasFocus 
            ? AppColors.primaryColor 
            : AppColors.borderColor,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor,
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: TextField(
        controller: _otpController,
        focusNode: _otpFocusNode,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimaryColor,
          letterSpacing: 8,
        ),
        keyboardType: TextInputType.text,
        maxLength: _otpLength,
        textCapitalization: TextCapitalization.characters,
        inputFormatters: [
          FilteringTextInputFormatter.allow(RegExp(r'[A-Za-z0-9]')),
          UpperCaseTextFormatter(),
        ],
        decoration: InputDecoration(
          counterText: '',
          border: InputBorder.none,
          hintText: _otpHint,
          hintStyle: TextStyle(
            color: AppColors.textHintColor,
            fontSize: 24,
            letterSpacing: 8,
          ),
          contentPadding: EdgeInsets.symmetric(vertical: 18),
        ),
        onChanged: _onOtpChanged,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.surfaceColor,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: AppColors.shadowColor,
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Icon(Icons.arrow_back, color: AppColors.textPrimaryColor, size: 20),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: SlideTransition(
          position: _slideAnimation,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                
                // Icon
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.primaryColor, AppColors.primaryLightColor],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(50),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryColor.withOpacity(0.3),
                        blurRadius: 20,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Icon(
                    widget.otpType == 'registration' ? Icons.email : Icons.lock_reset,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Title
                Text(
                  widget.otpType == 'registration' 
                    ? 'Verify Your Email' 
                    : 'Reset Your Password',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: AppColors.textPrimaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                
                const SizedBox(height: 12),
                
                // Subtitle
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    _otpDescription,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondaryColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Email
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    widget.email,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.primaryColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // OTP Field
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: _buildOtpField(),
                ),
                
                const SizedBox(height: 40),
                
                // Verify Button
                Container(
                  width: double.infinity,
                  height: 56,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryColor.withOpacity(0.3),
                        blurRadius: 12,
                        offset: Offset(0, 6),
                      ),
                    ],
                  ),
                  child: CustomButton(
                    text: _isLoading ? 'Verifying...' : 'Verify OTP',
                    onPressed: _isLoading || _otpController.text.length != _otpLength ? null : _verifyOtp,
                    isLoading: _isLoading,
                  ),
                ),
                
                const SizedBox(height: 30),
                
                // Resend Section
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Didn't receive the code? ",
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.textSecondaryColor,
                      ),
                    ),
                    if (_canResend)
                      GestureDetector(
                        onTap: _isLoading ? null : _resendOtp,
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Resend',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.primaryColor,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                    else
                      Text(
                        'Resend in ${_countDown}s',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textHintColor,
                        ),
                      ),
                  ],
                ),
                
                const SizedBox(height: 40),
                
                // Info Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.shadowColor,
                        blurRadius: 8,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.infoColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Icon(
                          Icons.info_outline,
                          color: AppColors.infoColor,
                          size: 20,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Check your email inbox and spam folder for the verification code. The code will expire in 10 minutes.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textSecondaryColor,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

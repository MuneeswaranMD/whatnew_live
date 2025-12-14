import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../utils/error_messages.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _isAuthenticated = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _isAuthenticated;

  // Initialize - check if user is already logged in
  Future<void> init() async {
    try {
      final token = StorageService.getAuthToken();
      // print('AuthProvider init: token = $token');
      
      if (token != null && token.isNotEmpty) {
        // Try to get profile to validate token
        // print('AuthProvider init: Getting profile to validate token');
        final success = await getProfile();
        if (success) {
          _isAuthenticated = true;
          // print('AuthProvider init: Token valid, user authenticated');
        } else {
          // Token is invalid, clear it
          // print('AuthProvider init: Token invalid, clearing auth');
          await logout();
        }
      } else {
        // print('AuthProvider init: No token found');
      }
    } catch (e) {
      // print('Error initializing auth: $e');
      await logout();
    }
  }

  // Register buyer
  Future<bool> registerBuyer({
    required String username,
    required String email,
    required String password,
    required String passwordConfirm,
    required String firstName,
    required String lastName,
    required String phoneNumber,
    String? referralCode,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.registerBuyer(
        username: username,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        referralCode: referralCode,
      );

      // Save token if provided
      if (response['token'] != null) {
        await StorageService.saveAuthToken(response['token']);
        _isAuthenticated = true;
      }

      // Set user data if provided
      if (response['id'] != null) {
        _user = User.fromJson(response);
        await StorageService.saveUserId(_user!.id);
      }

      _setLoading(false);
      return true;
    } catch (e) {
      // Handle API exceptions with error codes
      if (e is ApiException && e.errorCode != null) {
        _error = ErrorMessages.getErrorMessage(e.errorCode!);
      } else {
        _error = ErrorMessages.getErrorMessage(e.toString());
      }
      _setLoading(false);
      return false;
    }
  }

  // Login
  Future<bool> login({
    required String username,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.login(
        username: username,
        password: password,
      );

      // Save token
      await StorageService.saveAuthToken(response['token']);
      
      // Set user data - the response has a 'user' object
      _user = User.fromJson(response['user']);
      await StorageService.saveUserId(_user!.id);
      
      _isAuthenticated = true;
      _setLoading(false);
      return true;
    } catch (e) {
      // Handle API exceptions with error codes
      if (e is ApiException && e.errorCode != null) {
        _error = ErrorMessages.getErrorMessage(e.errorCode!);
      } else {
        _error = ErrorMessages.getErrorMessage(e.toString());
      }
      _setLoading(false);
      return false;
    }
  }

  // Get profile
  Future<bool> getProfile() async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.getProfile();
      _user = User.fromJson(response);
      _isAuthenticated = true;
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _isAuthenticated = false;
      _setLoading(false);
      return false;
    }
  }

  // Update profile
  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
    String? phoneNumber,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.updateProfile(
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      );

      _user = User.fromJson(response);
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // OTP methods
  Future<bool> sendRegistrationOtp({required String email}) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.sendRegistrationOtp(email: email);
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> verifyRegistrationOtp({
    required String email,
    required String otp,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.verifyRegistrationOtp(email: email, otp: otp);
      
      // OTP verification returns user data and token - user is now registered and logged in
      if (response['token'] != null) {
        await StorageService.saveAuthToken(response['token']);
        _isAuthenticated = true;
      }

      if (response['user'] != null) {
        _user = User.fromJson(response['user']);
        await StorageService.saveUserId(_user!.id);
      }
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> sendForgotPasswordOtp({required String email}) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.sendForgotPasswordOtp(email: email);
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> verifyForgotPasswordOtp({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.verifyForgotPasswordOtp(
        email: email,
        otp: otp,
        newPassword: newPassword,
      );
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      await StorageService.clearAll();
      _user = null;
      _isAuthenticated = false;
      _error = null;
      notifyListeners();
    } catch (e) {
      // print('Error during logout: $e');
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Helper method to set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}

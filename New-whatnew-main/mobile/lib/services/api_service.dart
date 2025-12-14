import 'dart:convert';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  // static const String baseUrl = 'https://api.addagram.in';
  static const String baseUrl = 'http://10.92.201.154:8000';

  static Map<String, String> get _headers {
    final token = StorageService.getAuthToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Token $token',
    };
  }

  // Auth endpoints
  static Future<Map<String, dynamic>> registerBuyer({
    required String username,
    required String email,
    required String password,
    required String passwordConfirm,
    required String firstName,
    required String lastName,
    required String phoneNumber,
    String? referralCode,
  }) async {
    final body = {
      'username': username,
      'email': email,
      'password': password,
      'password_confirm': passwordConfirm,
      'first_name': firstName,
      'last_name': lastName,
      'phone_number': phoneNumber,
    };
    
    // Only include referral code if it's provided and not empty
    if (referralCode != null && referralCode.trim().isNotEmpty) {
      body['referral_code'] = referralCode.trim().toUpperCase();
    }
    
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/register/buyer/'),
      headers: _headers,
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }

  // OTP endpoints
  static Future<Map<String, dynamic>> sendRegistrationOtp({
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/registration/send-otp/'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> verifyRegistrationOtp({
    required String email,
    required String otp,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/registration/verify-otp/'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'otp_code': otp,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> sendForgotPasswordOtp({
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/forgot-password/send-otp/'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> verifyForgotPasswordOtp({
    required String email,
    required String otp,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/forgot-password/verify-otp/'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'otp_code': otp,
        'new_password': newPassword,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login/'),
      headers: _headers,
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/profile/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> updateProfile({
    String? firstName,
    String? lastName,
    String? phoneNumber,
  }) async {
    final body = <String, dynamic>{};
    if (firstName != null) body['first_name'] = firstName;
    if (lastName != null) body['last_name'] = lastName;
    if (phoneNumber != null) body['phone_number'] = phoneNumber;

    final response = await http.patch(
      Uri.parse('$baseUrl/api/auth/profile/update/'),
      headers: _headers,
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }

  // Product endpoints
  static Future<Map<String, dynamic>> getProducts({
    int? category,
    String? search,
    double? minPrice,
    double? maxPrice,
    int? page,
  }) async {
    final queryParams = <String, String>{};
    if (category != null) queryParams['category'] = category.toString();
    if (search != null) queryParams['search'] = search;
    if (minPrice != null) queryParams['min_price'] = minPrice.toString();
    if (maxPrice != null) queryParams['max_price'] = maxPrice.toString();
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/products/products/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<List<dynamic>> getCategories() async {
    // print('ApiService.getCategories: Starting request');
    // print('ApiService.getCategories: URL: $baseUrl/api/products/categories/');
    // print('ApiService.getCategories: Headers: $_headers');
    
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/products/categories/'),
        headers: _headers,
      );
      
      // print('ApiService.getCategories: Response status: ${response.statusCode}');
      // print('ApiService.getCategories: Response body: ${response.body}');
      
      final data = _handleResponse(response);
      // print('ApiService.getCategories: Parsed data type: ${data.runtimeType}');
      // print('ApiService.getCategories: Parsed data: $data');
      
      // Handle both paginated response (with 'results') and direct list
      if (data is Map<String, dynamic> && data.containsKey('results')) {
        final results = data['results'];
        if (results is List) {
          // print('ApiService.getCategories: Found paginated results with ${results.length} items');
          return List<dynamic>.from(results);
        }
      } else if (data is List) {
        // print('ApiService.getCategories: Found direct list with ${data.length} items');
        return List<dynamic>.from(data);
      }
      
      // print('ApiService.getCategories: No valid data found, returning empty list');
      return <dynamic>[];
    } catch (e) {
      // print('ApiService.getCategories: Exception caught: $e');
      throw e;
    }
  }

  static Future<Map<String, dynamic>> getProduct(int productId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/products/products/$productId/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Livestream endpoints
  static Future<dynamic> getLivestreams({
    String? status,
    int? seller,
    String? category,
    int? page,
  }) async {
    final queryParams = <String, String>{};
    if (status != null) queryParams['status'] = status;
    if (seller != null) queryParams['seller'] = seller.toString();
    if (category != null) queryParams['category'] = category;
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/livestreams/livestreams/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    final data = _handleResponse(response);
    // The Django REST framework returns paginated results or direct list
    // Ensure we return a consistent format
    if (data is List) {
      return {'results': data};
    }
    return data;
  }

  static Future<List<dynamic>> getLiveNow() async {
    // print('ApiService.getLiveNow: Starting request');
    // print('ApiService.getLiveNow: URL: $baseUrl/api/livestreams/livestreams/live_now/');
    // print('ApiService.getLiveNow: Headers: $_headers');
    
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/livestreams/livestreams/live_now/'),
        headers: _headers,
      );
      
      // print('ApiService.getLiveNow: Response status: ${response.statusCode}');
      // print('ApiService.getLiveNow: Response body: ${response.body}');
      
      final data = _handleResponse(response);
      // print('ApiService.getLiveNow: Parsed data type: ${data.runtimeType}');
      // print('ApiService.getLiveNow: Parsed data: $data');
      
      // live_now endpoint returns a direct list
      if (data is List) {
        // print('ApiService.getLiveNow: Returning direct list with ${data.length} items');
        return List<dynamic>.from(data);
      }
      
      // print('ApiService.getLiveNow: Data is not a list, returning empty list');
      return <dynamic>[];
    } catch (e) {
      // print('ApiService.getLiveNow: Exception caught: $e');
      throw e;
    }
  }

  static Future<Map<String, dynamic>> getLivestream(String livestreamId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/livestreams/livestreams/$livestreamId/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> joinLivestream(String livestreamId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/livestreams/livestreams/$livestreamId/join/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> leaveLivestream(String livestreamId) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/livestreams/livestreams/$livestreamId/leave/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getAgoraToken(String livestreamId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/livestreams/livestreams/$livestreamId/agora-token/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Product and Category endpoints

  // Bidding endpoints
  static Future<Map<String, dynamic>> getBiddings({
    String? livestream,
    String? status,
    int? page,
  }) async {
    final queryParams = <String, String>{};
    if (livestream != null) queryParams['livestream'] = livestream;
    if (status != null) queryParams['status'] = status;
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/livestreams/biddings/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getBidding(String biddingId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/livestreams/biddings/$biddingId/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> placeBid(String biddingId, double amount) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/livestreams/biddings/$biddingId/place-bid/'),
      headers: _headers,
      body: jsonEncode({
        'amount': amount.toString(),
      }),
    );
    
    return _handleResponse(response);
  }

  // Cart endpoints
  static Future<Map<String, dynamic>> getCart() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/orders/cart/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> addToCart(String productId, int quantity, {double? price}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/orders/cart/add/'),
      headers: _headers,
      body: jsonEncode({
        'product_id': productId, // Changed from 'product' to 'product_id'
        'quantity': quantity,
        if (price != null) 'price': price,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> removeFromCart(int cartItemId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/orders/cart/remove/'),
      headers: _headers,
      body: jsonEncode({
        'cart_item_id': cartItemId, // Changed from 'product' to 'cart_item_id'
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> clearCart() async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/orders/cart/clear/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Order endpoints
  static Future<Map<String, dynamic>> getOrders({int? page}) async {
    final queryParams = <String, String>{};
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/orders/orders/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> createOrder({
    required Map<String, dynamic> shippingAddress,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/orders/orders/create/'),
      headers: _headers,
      body: jsonEncode({
        'shipping_address': shippingAddress,
      }),
    );
    
    return _handleResponse(response);
  }

  // Address endpoints
  static Future<Map<String, dynamic>> getAddresses() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/addresses/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> addAddress({
    required String fullName,
    required String phoneNumber,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
    bool isDefault = false,
  }) async {
    // print('ApiService.addAddress: Starting request');
    // print('ApiService.addAddress: Base URL: $baseUrl');
    // print('ApiService.addAddress: Headers: $_headers');
    
    // Build request body, only include address_line_2 if it's not null/empty
    final Map<String, dynamic> requestBody = {
      'full_name': fullName,
      'phone_number': phoneNumber,
      'address_line_1': addressLine1,
      'city': city,
      'state': state,
      'postal_code': pincode,
      'is_default': isDefault,
    };
    
    // Only add address_line_2 if it's not null and not empty
    if (addressLine2 != null && addressLine2.isNotEmpty) {
      requestBody['address_line_2'] = addressLine2;
    }
    
    // print('ApiService.addAddress: Request body: $requestBody');
    
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/addresses/'),
        headers: _headers,
        body: jsonEncode(requestBody),
      );
      
      // print('ApiService.addAddress: Response status: ${response.statusCode}');
      // print('ApiService.addAddress: Response headers: ${response.headers}');
      // print('ApiService.addAddress: Response body: ${response.body}');
      
      return _handleResponse(response);
    } catch (e) {
      // print('ApiService.addAddress: Exception caught: $e');
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> updateAddress(int addressId, {
    String? fullName,
    String? phoneNumber,
    String? addressLine1,
    String? addressLine2,
    String? city,
    String? state,
    String? pincode,
    bool? isDefault,
  }) async {
    final body = <String, dynamic>{};
    if (fullName != null) body['full_name'] = fullName;
    if (phoneNumber != null) body['phone_number'] = phoneNumber;
    if (addressLine1 != null) body['address_line_1'] = addressLine1;
    if (addressLine2 != null && addressLine2.isNotEmpty) body['address_line_2'] = addressLine2;
    if (city != null) body['city'] = city;
    if (state != null) body['state'] = state;
    if (pincode != null) body['postal_code'] = pincode;
    if (isDefault != null) body['is_default'] = isDefault;

    final response = await http.put(
      Uri.parse('$baseUrl/api/auth/addresses/$addressId/'),
      headers: _headers,
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> deleteAddress(int addressId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/auth/addresses/$addressId/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> setDefaultAddress(int addressId) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/auth/addresses/$addressId/set-default/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Payment endpoints
  static Future<Map<String, dynamic>> getWallet() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/payments/wallet/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> createPaymentOrder({
    required int amount,
    required String currency,
    required String receipt,
    String? orderId,
  }) async {
    final body = {
      'amount': amount / 100,  // Convert paise back to rupees for backend
      'purpose': 'order_payment',
    };
    
    // Include orderId if provided to link payment to order
    if (orderId != null) {
      body['order_id'] = orderId;
    }
    
    final response = await http.post(
      Uri.parse('$baseUrl/api/payments/create-order/'),
      headers: _headers,
      body: jsonEncode(body),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String orderId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/payments/verify-payment/'),
      headers: _headers,
      body: jsonEncode({
        'razorpay_order_id': razorpayOrderId,
        'razorpay_payment_id': razorpayPaymentId,
        'razorpay_signature': razorpaySignature,
        'order_id': orderId,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> reportPaymentFailure({
    required String orderId,
    required String errorCode,
    required String errorMessage,
    String? razorpayOrderId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/payments/payment-failed/'),
      headers: _headers,
      body: jsonEncode({
        'order_id': orderId,
        'error_code': errorCode,
        'error_message': errorMessage,
        'razorpay_order_id': razorpayOrderId,
      }),
    );
    
    return _handleResponse(response);
  }

  // Chat endpoints
  static Future<Map<String, dynamic>> getChatMessages(String livestreamId, {int? page}) async {
    final queryParams = <String, String>{};
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/chat/messages/$livestreamId/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> sendChatMessage(String livestreamId, String message) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/chat/messages/$livestreamId/send/'),
      headers: _headers,
      body: jsonEncode({
        'content': message,
        'message_type': 'text',
      }),
    );
    
    return _handleResponse(response);
  }

  // Referral endpoints
  static Future<Map<String, dynamic>> getReferralCode() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/referral/code/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> shareReferral({String platform = 'general'}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/referral/share/'),
      headers: _headers,
      body: jsonEncode({
        'platform': platform,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getReferralHistory({int? page}) async {
    final queryParams = <String, String>{};
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/auth/referral/history/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getReferralStats() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/referral/stats/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getReferralRewards({int? page}) async {
    Map<String, String> queryParams = {};
    if (page != null) {
      queryParams['page'] = page.toString();
    }
    
    final uri = Uri.parse('$baseUrl/api/auth/referral/rewards/').replace(queryParameters: queryParams);
    
    final response = await http.get(uri, headers: _headers);
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getReferralProgress() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/referral/progress/'),
      headers: _headers,
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getActiveCampaigns() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/referral/campaigns/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Promo Code endpoints
  static Future<Map<String, dynamic>> getUserPromoCodes({int? page}) async {
    final queryParams = <String, String>{};
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/auth/promo-codes/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> validatePromoCode(String code, {double orderAmount = 50.0}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/promo-codes/validate/'),
      headers: _headers,
      body: jsonEncode({
        'promo_code': code.trim().toUpperCase(),
        'order_amount': orderAmount,
      }),
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> usePromoCode(String code, {double orderAmount = 50.0}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/promo-codes/apply/'),
      headers: _headers,
      body: jsonEncode({
        'promo_code': code.trim().toUpperCase(),
        'order_amount': orderAmount,
      }),
    );
    
    return _handleResponse(response);
  }

  // Notification endpoints
  static Future<Map<String, dynamic>> getNotifications({int? page}) async {
    final queryParams = <String, String>{};
    if (page != null) queryParams['page'] = page.toString();

    final uri = Uri.parse('$baseUrl/api/auth/notifications/').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _headers);
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> markNotificationAsRead(String notificationId) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/auth/notifications/$notificationId/read/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> markAllNotificationsAsRead() async {
    final response = await http.patch(
      Uri.parse('$baseUrl/api/auth/notifications/mark-all-read/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> deleteNotification(String notificationId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/auth/notifications/$notificationId/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> clearAllNotifications() async {
    final response = await http.delete(
      Uri.parse('$baseUrl/api/auth/notifications/clear-all/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> getUnreadNotificationCount() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/auth/notifications/unread-count/'),
      headers: _headers,
    );
    
    return _handleResponse(response);
  }

  // Helper method to handle responses
  static dynamic _handleResponse(http.Response response) {
    // print('ApiService._handleResponse: Processing response');
    // print('ApiService._handleResponse: Status code: ${response.statusCode}');
    // print('ApiService._handleResponse: Response body: ${response.body}');
    
    try {
      final data = jsonDecode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        // For successful responses, return the parsed data as-is
        // Don't wrap lists in a Map - this was causing the issue
        // print('ApiService._handleResponse: Returning parsed data directly');
        return data;
      } else {
        final errorData = data is Map<String, dynamic> ? data : {'message': data.toString()};
        // print('ApiService._handleResponse: Error data: $errorData');
        
        // Handle structured error responses from backend
        Map<String, dynamic>? errors = null;
        String message = 'An error occurred';
        String? errorCode = null;
        
        if (errorData.containsKey('error')) {
          // New structured error format from backend
          message = errorData['error'];
          errorCode = errorData['code'];
          errors = errorData['details'];
        } else if (errorData.containsKey('message')) {
          message = errorData['message'];
          errors = errorData['errors'];
        } else if (errorData.containsKey('detail')) {
          message = errorData['detail'];
        } else {
          // If no specific message field, treat the entire response as validation errors
          errors = errorData;
          message = 'Validation failed';
        }
        
        throw ApiException(
          message: message,
          statusCode: response.statusCode,
          errors: errors,
          errorCode: errorCode,
        );
      }
    } catch (e) {
      // print('ApiService._handleResponse: Exception in processing: $e');
      if (e is ApiException) {
        rethrow;
      }
      // Handle JSON decode errors
      throw ApiException(
        message: 'Failed to parse response: ${e.toString()}',
        statusCode: response.statusCode,
        errors: null,
      );
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  final Map<String, dynamic>? errors;
  final String? errorCode;

  ApiException({
    required this.message,
    required this.statusCode,
    this.errors,
    this.errorCode,
  });

  @override
  String toString() {
    if (errorCode != null) {
      return 'ApiException: $message (Status: $statusCode, Code: $errorCode)';
    }
    return 'ApiException: $message (Status: $statusCode)';
  }
}

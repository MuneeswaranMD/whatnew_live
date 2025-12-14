import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'api_service.dart';

class PaymentService {
  static Razorpay? _razorpay;
  static Function(Map<String, dynamic>)? _onSuccess;
  static Function(Map<String, dynamic>)? _onError;

  static void initialize() {
    _razorpay = Razorpay();
    _razorpay!.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay!.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay!.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  static void _handlePaymentSuccess(PaymentSuccessResponse response) {
    // print('Payment successful: ${response.paymentId}');
    if (_onSuccess != null) {
      _onSuccess!({
        'payment_id': response.paymentId,
        'order_id': response.orderId,
        'signature': response.signature,
      });
    }
  }

  static void _handlePaymentError(PaymentFailureResponse response) {
    // print('Payment failed: ${response.message}');
    if (_onError != null) {
      _onError!({
        'code': response.code,
        'message': response.message,
      });
    }
  }

  static void _handleExternalWallet(ExternalWalletResponse response) {
    // print('External wallet: ${response.walletName}');
    // Handle external wallet if needed
  }

  static Future<bool> startPayment({
    required double amount,
    required String orderId,
    required String razorpayKeyId,
    required String razorpayOrderId,
    required Function(Map<String, dynamic>) onSuccess,
    required Function(Map<String, dynamic>) onError,
    String? userEmail,
    String? userPhone,
    String? userName,
  }) async {
    // Use real Razorpay for all payments
    if (_razorpay == null) {
      initialize();
    }

    _onSuccess = onSuccess;
    _onError = onError;

    var options = {
      'key': razorpayKeyId,
      'amount': (amount * 100).toInt(), // Convert to paise
      'name': 'WhatNew',
      'description': 'Order Payment',
      'order_id': razorpayOrderId,
      'prefill': {
        'contact': userPhone ?? '9999999999',
        'email': userEmail ?? 'customer@example.com',
        'name': userName ?? 'Customer'
      },
      'theme': {
        'color': '#3366cc'
      }
    };

    try {
      _razorpay!.open(options);
      return true;
    } catch (e) {
      // print('Error opening Razorpay: $e');
      return false;
    }
  }

  static Future<Map<String, dynamic>?> createPaymentOrder({
    required double amount,
    String? orderId,
  }) async {
    try {
      final response = await ApiService.createPaymentOrder(
        amount: (amount * 100).toInt(), // Convert to paise
        currency: 'INR',
        receipt: orderId ?? 'order_${DateTime.now().millisecondsSinceEpoch}',
        orderId: orderId, // Pass orderId to link payment to order
      );
      return response;
    } catch (e) {
      // print('Error creating payment order: $e');
      return null;
    }
  }

  static Future<bool> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String orderId,
  }) async {
    try {
      // Verify real Razorpay payment
      final response = await ApiService.verifyPayment(
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        orderId: orderId,
      );
      return response['payment_status'] == 'completed';
    } catch (e) {
      // print('Error verifying payment: $e');
      return false;
    }
  }

  static Future<bool> reportPaymentFailure({
    required String orderId,
    required String errorCode,
    required String errorMessage,
    String? razorpayOrderId,
  }) async {
    try {
      final response = await ApiService.reportPaymentFailure(
        orderId: orderId,
        errorCode: errorCode,
        errorMessage: errorMessage,
        razorpayOrderId: razorpayOrderId,
      );
      return response['success'] == true;
    } catch (e) {
      // print('Error reporting payment failure: $e');
      return false;
    }
  }

  static void dispose() {
    _razorpay?.clear();
    _razorpay = null;
    _onSuccess = null;
    _onError = null;
  }
}

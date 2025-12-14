import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/app_theme.dart';
import '../../models/order.dart';
import '../../models/address.dart' as addr;
import '../../services/payment_service.dart';
import '../../providers/order_provider.dart';

class PaymentScreen extends StatefulWidget {
  final Order order;
  final addr.Address shippingAddress;

  const PaymentScreen({
    Key? key,
    required this.order,
    required this.shippingAddress,
  }) : super(key: key);

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool _isProcessing = false;
  String? _errorMessage;
  String? _razorpayOrderId;

  @override
  void initState() {
    super.initState();
    PaymentService.initialize();
  }

  @override
  void dispose() {
    PaymentService.dispose();
    super.dispose();
  }

  void _startPayment() async {
    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      // Create payment order
      final paymentOrder = await PaymentService.createPaymentOrder(
        amount: widget.order.totalAmount,
        orderId: widget.order.id,
      );

      if (paymentOrder == null) {
        throw Exception('Failed to create payment order. Please check your internet connection.');
      }

      // Store razorpay order ID for potential failure reporting
      _razorpayOrderId = paymentOrder['razorpay_order_id'];

      // Start Razorpay payment
      final success = await PaymentService.startPayment(
        amount: widget.order.totalAmount,
        orderId: widget.order.id,
        razorpayKeyId: paymentOrder['key'],
        razorpayOrderId: paymentOrder['razorpay_order_id'],
        onSuccess: _handlePaymentSuccess,
        onError: _handlePaymentError,
      );

      if (!success) {
        throw Exception('Unable to launch payment gateway. Please try again.');
      }
    } catch (e) {
      setState(() {
        _isProcessing = false;
        _errorMessage = e.toString();
      });
      
      // Show error dialog for payment start failures
      _showPaymentErrorDialog(
        'Payment Error',
        'Unable to start payment: ${e.toString()}',
      );
      
      // Return failure information to checkout screen
      Navigator.of(context).pop({
        'success': false,
        'error': 'Unable to start payment: ${e.toString()}',
      });
    }
  }

  void _retryPayment() {
    setState(() {
      _errorMessage = null;
    });
    _startPayment();
  }

  void _handlePaymentSuccess(Map<String, dynamic> response) async {
    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      // print('Payment successful, verifying with backend...');
      // print('Payment details: ${response.toString()}');
      
      // Verify payment with backend
      final success = await PaymentService.verifyPayment(
        razorpayOrderId: response['order_id'],
        razorpayPaymentId: response['payment_id'],
        razorpaySignature: response['signature'],
        orderId: widget.order.id.toString(),  // Ensure string conversion
      );

      if (success) {
        // print('Payment verification successful');
        
        // Update the order in local state by refreshing orders from server
        try {
          // Import order provider and refresh orders
          final orderProvider = Provider.of<OrderProvider>(context, listen: false);
          await orderProvider.getOrders();
          // print('Orders refreshed after payment verification');
        } catch (e) {
          // print('Failed to refresh orders after payment: $e');
        }
        
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Text('Payment successful! Order confirmed.'),
              ],
            ),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 3),
          ),
        );
        
        // Wait a moment for user to see the message
        await Future.delayed(Duration(seconds: 1));
        
        // Return detailed success information to checkout screen
        Navigator.of(context).pop({
          'success': true,
          'payment_id': response['payment_id'],
          'order_status': 'confirmed',
          'payment_status': 'completed',
          'message': 'Payment successful! Order confirmed.',
          'order_updated': true,
        });
      } else {
        // print('Payment verification failed');
        setState(() {
          _isProcessing = false;
          _errorMessage = 'Payment verification failed. Please contact support if money was deducted.';
        });
        
        // Show error dialog for verification failure
        _showPaymentErrorDialog(
          'Payment Verification Failed',
          'Your payment was processed but could not be verified. Please contact support if money was deducted from your account. Payment ID: ${response['payment_id']}',
        );
        
        // Return failure information to checkout screen
        Navigator.of(context).pop({
          'success': false,
          'error': 'Payment verification failed. Please contact support if money was deducted.',
          'payment_id': response['payment_id'],
        });
      }
    } catch (e) {
      // print('Payment verification error: $e');
      setState(() {
        _isProcessing = false;
        _errorMessage = 'Payment verification failed: ${e.toString()}';
      });        // Show error dialog for network/server errors
        _showPaymentErrorDialog(
          'Verification Error',
          'Unable to verify payment due to network issues. Please check your internet connection or contact support. Payment ID: ${response['payment_id'] ?? 'Unknown'}',
        );
        
        // Return failure information to checkout screen
        Navigator.of(context).pop({
          'success': false,
          'error': 'Payment verification failed due to network issues. Please contact support.',
          'payment_id': response['payment_id'],
        });
    }
  }

  void _handlePaymentError(Map<String, dynamic> error) {
    setState(() {
      _isProcessing = false;
      _errorMessage = error['message'] ?? 'Payment failed';
    });

    // Report payment failure to backend
    _reportPaymentFailure(error);

    // Determine error type and show appropriate message
    String title = 'Payment Failed';
    String message = error['message'] ?? 'Payment failed';
    
    if (error['code'] != null) {
      switch (error['code']) {
        case 'PAYMENT_CANCELLED':
          title = 'Payment Cancelled';
          message = 'You cancelled the payment. You can try again when ready.';
          break;
        case 'INSUFFICIENT_FUNDS':
          title = 'Insufficient Funds';
          message = 'Your account doesn\'t have sufficient balance. Please try a different payment method.';
          break;
        case 'NETWORK_ERROR':
          title = 'Network Error';
          message = 'Please check your internet connection and try again.';
          break;
        default:
          title = 'Payment Failed';
          message = error['message'] ?? 'Payment failed. Please try again.';
      }
    }

    _showPaymentErrorDialog(title, message);
    
    // Return failure information to checkout screen  
    Navigator.of(context).pop({
      'success': false,
      'error': message,
      'error_code': error['code'],
    });
  }

  Future<void> _reportPaymentFailure(Map<String, dynamic> error) async {
    try {
      await PaymentService.reportPaymentFailure(
        orderId: widget.order.id.toString(),
        errorCode: error['code']?.toString() ?? 'UNKNOWN',
        errorMessage: error['message'] ?? 'Payment failed',
        razorpayOrderId: _razorpayOrderId,
      );
      // print('Payment failure reported to backend');
    } catch (e) {
      // print('Failed to report payment failure: $e');
      // Don't show error to user as the payment already failed
    }
  }

  void _showPaymentErrorDialog(String title, String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Row(
            children: [
              Icon(Icons.error_outline, color: Colors.red),
              SizedBox(width: 8),
              Text(title),
            ],
          ),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
            if (title.contains('Verification')) ...[
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navigate to support or help screen
                  _contactSupport();
                },
                child: Text('Contact Support'),
              ),
            ],
          ],
        );
      },
    );
  }

  void _contactSupport() {
    // Show support contact options
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Contact Support'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('For payment issues, please contact us:'),
              SizedBox(height: 12),
              Text('Email: support@whatnew.com'),
              Text('Phone: +91-12345-67890'),
              SizedBox(height: 12),
              Text('Order ID: ${widget.order.orderNumber}'),
              Text('Amount: ₹${widget.order.totalAmount.toStringAsFixed(2)}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
        backgroundColor: AppColors.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Order Summary
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Order Summary',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ...widget.order.items.map((item) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    '${item.quantity}x ${item.product['name'] ?? item.productName}',
                                    style: const TextStyle(fontWeight: FontWeight.w500),
                                  ),
                                ),
                                Text(
                                  '₹${item.totalPrice.toStringAsFixed(2)}',
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          )),
                          const Divider(),
                          Row(
                            children: [
                              const Expanded(
                                child: Text(
                                  'Total Amount',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              Text(
                                '₹${widget.order.totalAmount.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                    color: AppColors.primaryColor,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Shipping Address
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Shipping Address',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            widget.shippingAddress.fullName,
                            style: const TextStyle(fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 4),
                          Text(widget.shippingAddress.addressLine1),
                          if (widget.shippingAddress.addressLine2?.isNotEmpty == true) ...[
                            Text(widget.shippingAddress.addressLine2!),
                          ],
                          Text('${widget.shippingAddress.city}, ${widget.shippingAddress.state}'),
                          Text('PIN: ${widget.shippingAddress.pincode}'),
                          const SizedBox(height: 4),
                          Text('Phone: ${widget.shippingAddress.phoneNumber}'),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Payment Method
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Payment Method',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(
                                Icons.credit_card,
                                color: AppColors.primaryColor,
                                size: 24,
                              ),
                              const SizedBox(width: 12),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Razorpay',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w500,
                                        fontSize: 16,
                                      ),
                                    ),
                                    Text(
                                      'Credit/Debit Card, UPI, Net Banking, Wallets',
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  if (_errorMessage != null) ...[
                    const SizedBox(height: 16),
                    Card(
                      color: Colors.red.shade50,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Icon(
                              Icons.error_outline,
                              color: Colors.red.shade700,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: TextStyle(
                                  color: Colors.red.shade700,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),

          // Pay Now Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // Error message display
                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        border: Border.all(color: Colors.red.shade200),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.error_outline, color: Colors.red),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: TextStyle(color: Colors.red.shade700),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                  
                  // Payment button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isProcessing ? null : (_errorMessage != null ? _retryPayment : _startPayment),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: _isProcessing
                          ? const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                ),
                                SizedBox(width: 12),
                                Text('Processing...'),
                              ],
                            )
                          : Text(
                              _errorMessage != null 
                                  ? 'Retry Payment ₹${widget.order.totalAmount.toStringAsFixed(2)}'
                                  : 'Pay ₹${widget.order.totalAmount.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

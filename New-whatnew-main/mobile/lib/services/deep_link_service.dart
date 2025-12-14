import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';

class DeepLinkService {
  static const MethodChannel _channel = MethodChannel('deep_link_channel');
  
  static StreamController<String>? _deepLinkStreamController;
  static Stream<String>? _deepLinkStream;
  
  /// Initialize deep link service
  static void initialize() {
    _deepLinkStreamController = StreamController<String>.broadcast();
    _deepLinkStream = _deepLinkStreamController!.stream;
    
    // Listen for incoming deep links
    _channel.setMethodCallHandler(_handleMethodCall);
  }
  
  /// Handle method calls from native platform
  static Future<dynamic> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'onDeepLink':
        final String link = call.arguments;
        _deepLinkStreamController?.add(link);
        break;
    }
  }
  
  /// Get the deep link stream
  static Stream<String>? get deepLinkStream => _deepLinkStream;
  
  /// Parse deep link and extract parameters
  static Map<String, String> parseDeepLink(String link) {
    final uri = Uri.parse(link);
    final params = <String, String>{};
    
    // Handle different deep link formats
    if (uri.scheme == 'whatnew') {
      // Custom scheme: whatnew://referral?code=ABC123
      params['type'] = uri.host;
      params.addAll(uri.queryParameters);
    } else if (uri.scheme == 'https' && uri.host == 'app.whatnew.in') {
      // Universal link: https://app.whatnew.in/share?ref=ABC123
      if (uri.path.startsWith('/share')) {
        params.addAll(uri.queryParameters);
        
        // Determine type based on parameters
        if (uri.queryParameters.containsKey('ref')) {
          params['type'] = 'referral';
          params['code'] = uri.queryParameters['ref']!;
        } else if (uri.queryParameters.containsKey('product')) {
          params['type'] = 'product';
          params['id'] = uri.queryParameters['product']!;
        } else if (uri.queryParameters.containsKey('livestream')) {
          params['type'] = 'livestream';
          params['id'] = uri.queryParameters['livestream']!;
        }
      }
    }
    
    return params;
  }
  
  /// Handle deep link navigation
  static void handleDeepLink(BuildContext context, String link) {
    final params = parseDeepLink(link);
    final type = params['type'];
    
    switch (type) {
      case 'referral':
        final code = params['code'];
        if (code != null) {
          _navigateToReferral(context, code);
        }
        break;
        
      case 'product':
        final productId = params['id'];
        if (productId != null) {
          _navigateToProduct(context, productId);
        }
        break;
        
      case 'livestream':
        final livestreamId = params['id'];
        if (livestreamId != null) {
          _navigateToLivestream(context, livestreamId);
        }
        break;
        
      default:
        // Navigate to home if no specific type
        _navigateToHome(context);
        break;
    }
  }
  
  /// Navigate to referral screen with code
  static void _navigateToReferral(BuildContext context, String code) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/home',
      (route) => false,
    );
    
    // Show referral dialog or navigate to referral screen
    Future.delayed(const Duration(milliseconds: 500), () {
      _showReferralDialog(context, code);
    });
  }
  
  /// Navigate to product detail screen
  static void _navigateToProduct(BuildContext context, String productId) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/home',
      (route) => false,
    );
    
    // Navigate to product detail
    Future.delayed(const Duration(milliseconds: 500), () {
      Navigator.pushNamed(
        context,
        '/product-detail',
        arguments: productId,
      );
    });
  }
  
  /// Navigate to livestream screen
  static void _navigateToLivestream(BuildContext context, String livestreamId) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/home',
      (route) => false,
    );
    
    // Navigate to livestream
    Future.delayed(const Duration(milliseconds: 500), () {
      Navigator.pushNamed(
        context,
        '/livestream-detail',
        arguments: livestreamId,
      );
    });
  }
  
  /// Navigate to home screen
  static void _navigateToHome(BuildContext context) {
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/home',
      (route) => false,
    );
  }
  
  /// Show referral code dialog
  static void _showReferralDialog(BuildContext context, String code) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Referral Code'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('You received a referral code! Referral codes can only be used during registration.'),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Text(
                  code,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'To use this code, create a new account and enter it during registration.',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Got it'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                // Navigate to referral screen to see how referrals work
                Navigator.pushNamed(
                  context,
                  '/referral',
                );
              },
              child: const Text('Learn More'),
            ),
          ],
        );
      },
    );
  }
  
  /// Dispose resources
  static void dispose() {
    _deepLinkStreamController?.close();
    _deepLinkStreamController = null;
    _deepLinkStream = null;
  }
}

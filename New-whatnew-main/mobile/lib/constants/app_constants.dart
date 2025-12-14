class AppConstants {
  // API Configuration
  static const String baseUrl = 'https://api.addagram.in';
  static const String apiUrl = '$baseUrl/api';
  static const String websocketUrl = 'wss://api.addagram.in';
  
  // API Endpoints
  static const String authEndpoint = '/auth';
  static const String productsEndpoint = '/products';
  static const String livestreamsEndpoint = '/livestreams';
  static const String ordersEndpoint = '/orders';
  static const String paymentsEndpoint = '/payments';
  static const String chatEndpoint = '/chat';
  
  // WebSocket Events
  static const String viewerJoined = 'viewer_joined';
  static const String viewerLeft = 'viewer_left';
  static const String chatMessage = 'chat_message';
  static const String bidPlaced = 'bid_placed';
  static const String bidEnded = 'bid_ended';
  static const String userBanned = 'user_banned';
  static const String connectionStatus = 'connection_status';
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String cartKey = 'cart_items';
  static const String addressKey = 'saved_addresses';
  
  // App Configuration
  static const String appName = 'LiveShop';
  static const String appVersion = '1.0.0';
  static const String supportEmail = 'support@liveshop.com';
  static const String supportPhone = '+91-8888888888';
  
  // Razorpay Configuration
  static const String razorpayKeyId = 'rzp_test_your_key_id'; // Replace with actual key
  static const String razorpayKeySecret = 'your_key_secret'; // Replace with actual secret
  
  // Agora Configuration
  static const String agoraAppId = 'your_agora_app_id'; // Replace with actual app ID
  
  // Error Messages
  static const String networkError = 'Network connection error. Please check your internet connection.';
  static const String serverError = 'Server error. Please try again later.';
  static const String unknownError = 'An unknown error occurred. Please try again.';
  static const String authError = 'Authentication failed. Please login again.';
  
  // Success Messages
  static const String loginSuccess = 'Login successful!';
  static const String registerSuccess = 'Registration successful!';
  static const String orderPlaced = 'Order placed successfully!';
  static const String paymentSuccess = 'Payment completed successfully!';
  
  // Validation Messages
  static const String emailRequired = 'Email is required';
  static const String emailInvalid = 'Please enter a valid email';
  static const String passwordRequired = 'Password is required';
  static const String passwordLength = 'Password must be at least 8 characters';
  static const String nameRequired = 'Name is required';
  static const String phoneRequired = 'Phone number is required';
  static const String phoneInvalid = 'Please enter a valid phone number';
  static const String addressRequired = 'Address is required';
  
  // UI Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double borderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 16.0;
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // Page Sizes
  static const int defaultPageSize = 20;
  static const int productsPageSize = 10;
  static const int ordersPageSize = 15;
  
  // Media Constraints
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Bidding Configuration
  static const int defaultBidIncrement = 50; // ₹50
  static const int minBidAmount = 100; // ₹100
  static const int maxBidAmount = 100000; // ₹1,00,000
  
  // Order Status
  static const String orderPending = 'pending';
  static const String orderConfirmed = 'confirmed';
  static const String orderProcessing = 'processing';
  static const String orderShipped = 'shipped';
  static const String orderDelivered = 'delivered';
  static const String orderCancelled = 'cancelled';
  
  // Payment Status
  static const String paymentPending = 'pending';
  static const String paymentCompleted = 'completed';
  static const String paymentFailed = 'failed';
  static const String paymentRefunded = 'refunded';
  
  // Livestream Status
  static const String livestreamScheduled = 'scheduled';
  static const String livestreamLive = 'live';
  static const String livestreamEnded = 'ended';
  static const String livestreamCancelled = 'cancelled';
  
  // User Types
  static const String userTypeBuyer = 'buyer';
  static const String userTypeSeller = 'seller';
  
  // Categories (Popular ones for India)
  static const List<String> popularCategories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Beauty & Personal Care',
    'Sports & Fitness',
    'Books & Media',
    'Toys & Games',
    'Automotive',
    'Health & Wellness',
    'Food & Beverages'
  ];
  
  // Indian States for Address
  static const List<String> indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Puducherry',
    'Jammu and Kashmir',
    'Ladakh',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Andaman and Nicobar Islands'
  ];
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/livestream_provider.dart';
import 'providers/order_provider.dart';
import 'providers/category_provider.dart';
import 'providers/address_provider.dart';
import 'providers/product_provider.dart';
import 'services/notification_service.dart';
import 'screens/auth/splash_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/livestream/live_streams_screen.dart';
import 'screens/orders/order_history_screen.dart';
import 'screens/orders/order_detail_screen.dart';
import 'screens/orders/order_success_screen.dart';
import 'screens/referral/referral_screen.dart';
import 'screens/notifications/notification_screen.dart';
import 'models/order.dart' as order_model;
import 'services/storage_service.dart';
import 'services/payment_service.dart';
import 'services/websocket_service.dart';
import 'services/deep_link_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize storage
  await StorageService.init();

  // Initialize payment service
  PaymentService.initialize();

  // Initialize deep link service
  DeepLinkService.initialize();

  // Initialize notification service
  final notificationService = NotificationService();
  await notificationService.initialize();
  
  // Add some test notifications for demo purposes
  notificationService.createTestNotification(
    title: 'Welcome to Live Shopping!',
    message: 'Start exploring live streams and amazing deals.',
    type: 'system',
  );
  
  notificationService.createTestNotification(
    title: 'New Live Stream Started',
    message: 'Fashion Week Sale is now live! Don\'t miss out.',
    type: 'promotion',
  );

  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const LivestreamEcommerceApp());
}

class LivestreamEcommerceApp extends StatefulWidget {
  const LivestreamEcommerceApp({super.key});

  @override
  State<LivestreamEcommerceApp> createState() => _LivestreamEcommerceAppState();
}

class _LivestreamEcommerceAppState extends State<LivestreamEcommerceApp> {
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();

  @override
  void initState() {
    super.initState();
    _listenForDeepLinks();
  }

  void _listenForDeepLinks() {
    DeepLinkService.deepLinkStream?.listen((link) {
      final context = _navigatorKey.currentContext;
      if (context != null) {
        DeepLinkService.handleDeepLink(context, link);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => LivestreamProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => AddressProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => NotificationService()),
        // Add WebSocket service as a provider
        Provider<WebSocketService>(
          create: (_) => WebSocketService(),
          dispose: (_, service) => service.dispose(),
        ),
      ],
      child: MaterialApp(
        navigatorKey: _navigatorKey,
        title: 'Livestream Shopping',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const SplashScreen(),
        routes: {
          '/home': (context) => const HomeScreen(),
          '/order-history': (context) => const OrderHistoryScreen(),
          '/live-streams': (context) => const LiveStreamsScreen(),
          '/referral': (context) => const ReferralScreen(),
          '/notifications': (context) => const NotificationScreen(),
        },
        onGenerateRoute: (settings) {
          final args = settings.arguments;

          switch (settings.name) {
            case '/order-detail':
              if (args is order_model.Order) {
                return MaterialPageRoute(
                  builder: (context) => OrderDetailScreen(order: args),
                );
              }
              break;
            case '/order-success':
              if (args is String) {
                return MaterialPageRoute(
                  builder: (context) => OrderSuccessScreen(orderId: args),
                );
              }
              break;
          }

          return null;
        },
      ),
    );
  }
}

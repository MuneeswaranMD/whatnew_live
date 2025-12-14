import 'package:share_plus/share_plus.dart';
import '../models/product.dart';
import '../models/livestream.dart';

class SharingService {
  /// Share a product with a link that opens the mobile app
  static Future<void> shareProduct(Product product) async {
    try {
      final String shareUrl = 'https://app.whatnew.in/share?product=${product.id}';
      final String shareText = '''
🛍️ Check out this amazing product on whatnew!

${product.name}
💰 Price: ₹${product.price.toStringAsFixed(0)}${product.hasDiscount ? ' (${product.discountPercentage.round()}% OFF!)' : ''}
📦 Category: ${product.categoryName}

${product.description?.isNotEmpty == true ? '${product.description}\n\n' : ''}Shop now: $shareUrl

#whatnew #Shopping #LiveShopping
''';

      await Share.share(
        shareText,
        subject: 'Check out ${product.name} on whatnew',
      );
    } catch (e) {
      // print('SharingService: Error sharing product: $e');
      rethrow;
    }
  }

  /// Share a livestream with a link that opens the mobile app
  static Future<void> shareLivestream(LiveStream livestream) async {
    try {
      final String shareUrl = 'https://app.whatnew.in/share?livestream=${livestream.id}';
      final String shareText = '''
🔴 LIVE NOW on whatnew!

${livestream.title}
👥 ${livestream.viewerCount} viewers watching
📺 Category: ${livestream.categoryName}

${livestream.description.isNotEmpty ? '${livestream.description}\n\n' : ''}Join the live shopping experience: $shareUrl

#whatnew #LiveShopping #LiveStream
''';

      await Share.share(
        shareText,
        subject: 'Join ${livestream.title} LIVE on whatnew',
      );
    } catch (e) {
      // print('SharingService: Error sharing livestream: $e');
      rethrow;
    }
  }

  /// Share the app with a general invitation link
  static Future<void> shareApp() async {
    try {
      const String shareUrl = 'https://app.whatnew.in';
      const String shareText = '''
🚀 Join me on whatnew - The ultimate live shopping experience!

✨ Watch live streams while shopping
🛍️ Get exclusive deals and discounts
💎 Participate in live auctions
🎯 Discover amazing products

Download now: $shareUrl

#whatnew #LiveShopping #Shopping #App
''';

      await Share.share(
        shareText,
        subject: 'Join whatnew - Live Shopping Experience',
      );
    } catch (e) {
      // print('SharingService: Error sharing app: $e');
      rethrow;
    }
  }

  /// Share a custom message with optional subject
  static Future<void> shareCustom({
    required String text,
    String? subject,
  }) async {
    try {
      await Share.share(text, subject: subject);
    } catch (e) {
      // print('SharingService: Error sharing custom content: $e');
      rethrow;
    }
  }

  /// Generate a shareable deep link for a product
  static String generateProductLink(String productId) {
    return 'https://app.whatnew.in/share?product=$productId';
  }

  /// Generate a shareable deep link for a livestream
  static String generateLivestreamLink(String livestreamId) {
    return 'https://app.whatnew.in/share?livestream=$livestreamId';
  }
}

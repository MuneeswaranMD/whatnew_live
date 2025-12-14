import '../services/api_service.dart';

class ImageUtils {
  /// Converts a relative image URL to an absolute URL
  /// If the URL is already absolute (starts with http), returns it as is
  static String getFullImageUrl(String? imageUrl) {
    if (imageUrl == null || imageUrl.isEmpty) {
      // print('❌ ImageUtils: Empty or null imageUrl');
      return '';
    }
    
    // Debug log the original URL
    // print('🖼️ ImageUtils: Processing URL: $imageUrl');
    
    // If URL is already absolute, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      // print('✅ ImageUtils: URL is already absolute: $imageUrl');
      return imageUrl;
    }
    
    // If URL starts with /, it's a relative URL from the server
    if (imageUrl.startsWith('/')) {
      final fullUrl = '${ApiService.baseUrl}$imageUrl';
      // print('✅ ImageUtils: Converted relative URL: $imageUrl -> $fullUrl');
      return fullUrl;
    }
    
    // If URL doesn't start with /, prepend /media/ (common media path)
    final fullUrl = '${ApiService.baseUrl}/media/$imageUrl';
    // print('✅ ImageUtils: Added media prefix: $imageUrl -> $fullUrl');
    return fullUrl;
  }
  
  /// Get placeholder image URL for when images fail to load
  static String get placeholderImage {
    // Return a local placeholder or empty string for built-in placeholder
    return '';
  }
  
  /// Check if an image URL is valid (not null, not empty)
  static bool isValidImageUrl(String? imageUrl) {
    final isValid = imageUrl != null && imageUrl.isNotEmpty;
    // print('🖼️ ImageUtils: URL validity check: $imageUrl -> $isValid');
    return isValid;
  }

  /// Get the primary image URL from a product object
  /// Supports both Product model and Map<String, dynamic> format
  static String getProductImageUrl(dynamic product) {
    // print('🖼️ ImageUtils: Getting product image URL for: ${product.runtimeType}');
    
    if (product == null) {
      // print('❌ ImageUtils: Product is null');
      return '';
    }

    // Handle Product model
    if (product.toString().contains('Product')) {
      try {
        // Try primary image first
        if (product.primaryImage != null && product.primaryImage.image.isNotEmpty) {
          final url = getFullImageUrl(product.primaryImage.image);
          // print('✅ ImageUtils: Using primary image from Product model: $url');
          return url;
        }
        
        // Try first image in images array
        if (product.images != null && product.images.isNotEmpty && product.images.first.image.isNotEmpty) {
          final url = getFullImageUrl(product.images.first.image);
          // print('✅ ImageUtils: Using first image from Product model: $url');
          return url;
        }
      } catch (e) {
        // print('❌ ImageUtils: Error accessing Product model properties: $e');
      }
    }

    // Handle Map<String, dynamic> format (e.g., from cart items)
    if (product is Map<String, dynamic>) {
      try {
        // Try primary_image field
        if (product['primary_image'] != null && product['primary_image']['image'] != null) {
          final url = getFullImageUrl(product['primary_image']['image']);
          // print('✅ ImageUtils: Using primary_image from Map: $url');
          return url;
        }
        
        // Try images array
        if (product['images'] != null && product['images'] is List && product['images'].isNotEmpty) {
          final firstImage = product['images'][0];
          if (firstImage is Map && firstImage['image'] != null) {
            final url = getFullImageUrl(firstImage['image']);
            // print('✅ ImageUtils: Using first image from Map: $url');
            return url;
          }
        }

        // Try image field directly (for some API responses)
        if (product['image'] != null) {
          final url = getFullImageUrl(product['image']);
          // print('✅ ImageUtils: Using direct image field from Map: $url');
          return url;
        }
      } catch (e) {
        // print('❌ ImageUtils: Error accessing Map properties: $e');
      }
    }
    
    // No image found
    // print('❌ ImageUtils: No valid image found for product');
    return '';
  }

  /// Log image loading attempt for debugging
  static void logImageLoad(String? originalUrl, String fullUrl) {
    // print('🖼️ ImageUtils: Loading - Original: $originalUrl, Full: $fullUrl');
  }

  /// Log image loading success
  static void logImageSuccess(String url) {
    // print('✅ ImageUtils: Successfully loaded image: $url');
  }

  /// Log image loading error
  static void logImageError(String url, dynamic error) {
    // print('❌ ImageUtils: Failed to load image: $url, Error: $error');
  }
}

import 'package:flutter/material.dart';
import 'image_utils.dart';

/// Extension on Image widget to provide convenient methods for loading network images
/// with proper URL handling for relative paths from the backend
extension NetworkImageExtension on Image {
  /// Creates a network image widget that automatically handles relative URLs
  /// by converting them to absolute URLs using the base URL from ApiService
  static Widget networkWithFallback(
    String? imageUrl, {
    double? width,
    double? height,
    BoxFit? fit,
    Widget? errorWidget,
  }) {
    final fullUrl = ImageUtils.getFullImageUrl(imageUrl);
    
    // Log the image loading attempt
    ImageUtils.logImageLoad(imageUrl, fullUrl);
    
    if (fullUrl.isEmpty) {
      // print('❌ Empty image URL, showing placeholder');
      return _buildPlaceholder(width, height);
    }
    
    return Image.network(
      fullUrl,
      width: width,
      height: height,
      fit: fit ?? BoxFit.cover,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) {
          // Log successful load
          ImageUtils.logImageSuccess(fullUrl);
          return child;
        }
        return Container(
          width: width,
          height: height,
          color: Colors.grey[100],
          child: Center(
            child: CircularProgressIndicator(
              value: loadingProgress.expectedTotalBytes != null
                  ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                  : null,
              strokeWidth: 2.0,
            ),
          ),
        );
      },
      errorBuilder: (context, error, stackTrace) {
        // Log the error
        ImageUtils.logImageError(fullUrl, error);
        return errorWidget ?? _buildPlaceholder(width, height);
      },
    );
  }
  
  static Widget _buildPlaceholder(double? width, double? height) {
    return Container(
      width: width,
      height: height,
      color: Colors.grey[200],
      child: Icon(
        Icons.image,
        color: Colors.grey[400],
        size: (width != null && height != null) 
            ? (width < height ? width : height) * 0.4 
            : 24,
      ),
    );
  }
}

/// Extension for CircleAvatar to handle profile images
extension CircleAvatarExtension on CircleAvatar {
  static CircleAvatar networkImage(
    String? imageUrl, {
    double radius = 20,
    Color backgroundColor = Colors.grey,
    Widget? child,
  }) {
    final fullUrl = ImageUtils.getFullImageUrl(imageUrl);
    
    return CircleAvatar(
      radius: radius,
      backgroundColor: backgroundColor,
      backgroundImage: fullUrl.isNotEmpty ? NetworkImage(fullUrl) : null,
      child: fullUrl.isEmpty ? child : null,
    );
  }
}

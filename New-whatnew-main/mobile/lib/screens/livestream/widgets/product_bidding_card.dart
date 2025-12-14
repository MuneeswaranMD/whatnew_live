import 'package:flutter/material.dart';
import '../../../models/product.dart';
import '../../../models/livestream.dart';
import '../../../constants/app_theme.dart';
import '../../../utils/image_widgets.dart';

class ProductBiddingCard extends StatelessWidget {
  final Product product;
  final ProductBidding? bidding;
  final VoidCallback? onTap;

  const ProductBiddingCard({
    super.key,
    required this.product,
    this.bidding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Product image
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: NetworkImageExtension.networkWithFallback(
                  _getProductImageUrl(),
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Product details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    
                    const SizedBox(height: 4),
                    
                    if (product.description != null) ...[
                      Text(
                        product.description!,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    
                    const SizedBox(height: 8),
                    
                    Row(
                      children: [
                        Text(
                          '₹${product.basePrice}',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryColor,
                          ),
                        ),
                        
                        const SizedBox(width: 8),
                        
                        if (product.availableQuantity > 0) ...[
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'In Stock',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: Colors.green[700],
                              ),
                            ),
                          ),
                        ] else ...[
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.red[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Out of Stock',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: Colors.red[700],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    
                    if (bidding != null) ...[
                      const SizedBox(height: 8),
                      _buildBiddingStatus(bidding!),
                    ],
                  ],
                ),
              ),
              
              // Action indicator
              Icon(
                Icons.chevron_right,
                color: Colors.grey[400],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBiddingStatus(ProductBidding bidding) {
    Widget statusWidget;
    
    if (bidding.isActive) {
      statusWidget = Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.liveColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.gavel,
              color: Colors.white,
              size: 12,
            ),
            const SizedBox(width: 4),
            Text(
              'LIVE BIDDING',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    } else if (bidding.isEnded) {
      statusWidget = Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.grey[400],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.timer_off,
              color: Colors.white,
              size: 12,
            ),
            const SizedBox(width: 4),
            Text(
              'ENDED',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    } else {
      statusWidget = Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.scheduledColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.schedule,
              color: Colors.white,
              size: 12,
            ),
            const SizedBox(width: 4),
            Text(
              'PENDING',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        statusWidget,
        if (bidding.currentHighestBid != null) ...[
          const SizedBox(height: 4),
          Text(
            'Current bid: ₹${bidding.currentHighestBid!.toStringAsFixed(0)}',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.primaryColor,
            ),
          ),
        ],
        if (bidding.isActive) ...[
          const SizedBox(height: 4),
          Row(
            children: [
              Icon(
                Icons.timer,
                size: 12,
                color: Colors.red[600],
              ),
              const SizedBox(width: 2),
              Text(
                _formatTime(bidding.timeRemaining),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.red[600],
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  String _getProductImageUrl() {
    // print('🖼️ Getting image URL for product: ${product.name}');
    // print('🖼️ Primary image: ${product.primaryImage?.image}');
    // print('🖼️ Images count: ${product.images.length}');
    
    // Use primary image first, then fallback to first image, then empty string
    if (product.primaryImage != null && product.primaryImage!.image.isNotEmpty) {
      final url = product.primaryImage!.fullImageUrl;
      // print('✅ Using primary image URL: $url');
      return url;
    } else if (product.images.isNotEmpty && product.images.first.image.isNotEmpty) {
      final url = product.images.first.fullImageUrl;
      // print('⚠️ Using first image URL: $url');
      return url;
    } else {
      // print('❌ No images available for product: ${product.name}');
      return '';
    }
  }

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}

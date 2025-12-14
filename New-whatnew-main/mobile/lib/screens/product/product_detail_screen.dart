import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/product.dart';
import '../../providers/product_provider.dart';
import '../../providers/livestream_provider.dart';
import '../../constants/app_theme.dart';
import '../../utils/image_utils.dart';
import '../../services/api_service.dart';
import '../../services/sharing_service.dart';
import '../livestream/livestream_detail_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  final Product? product; // Optional - if already have product data

  const ProductDetailScreen({
    super.key,
    required this.productId,
    this.product,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  bool _isLoading = true;
  String? _error;
  int _selectedImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    if (widget.product != null) {
      _product = widget.product;
      _isLoading = false;
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final productProvider = context.read<ProductProvider>();
    final product = await productProvider.getProductById(widget.productId);

    if (mounted) {
      setState(() {
        _product = product;
        _isLoading = false;
        _error = product == null ? 'Failed to load product details' : null;
      });
    }
  }

  Future<void> _findAndNavigateToLivestream() async {
    if (_product == null) return;

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(),
      ),
    );

    try {
      // Get livestreams and find one with this product
      final livestreamProvider = context.read<LivestreamProvider>();
      await livestreamProvider.getLiveNow();
      
      // Look for a livestream that might have this product
      final livestreams = livestreamProvider.liveNow;
      
      // For now, find livestream by category match or seller
      final matchingLivestream = livestreams.firstWhere(
        (stream) => 
          stream.categoryName.toLowerCase() == _product!.categoryName.toLowerCase() ||
          (stream.sellerName != null && _product!.sellerName != null && 
           stream.sellerName!.toLowerCase() == _product!.sellerName!.toLowerCase()),
        orElse: () => livestreams.isNotEmpty ? livestreams.first : throw Exception('No livestreams available'),
      );

      // Close loading dialog
      if (mounted) Navigator.pop(context);

      // Navigate to livestream
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LivestreamDetailScreen(
              livestreamId: matchingLivestream.id,
            ),
          ),
        );
      }
    } catch (e) {
      // print('Error finding livestream: $e');
      
      // Close loading dialog
      if (mounted) Navigator.pop(context);
      
      // Show error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('No live streams available for this product'),
            backgroundColor: AppColors.errorColor,
          ),
        );
      }
    }
  }

  Future<void> _addToCart() async {
    if (_product == null) return;

    try {
      await ApiService.addToCart(_product!.id, 1);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${_product!.name} added to cart'),
            backgroundColor: AppColors.successColor,
          ),
        );
      }
    } catch (e) {
      // print('Error adding to cart: $e');
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add to cart'),
            backgroundColor: AppColors.errorColor,
          ),
        );
      }
    }
  }

  Future<void> _shareProduct() async {
    if (_product == null) return;

    try {
      await SharingService.shareProduct(_product!);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to share product'),
            backgroundColor: AppColors.errorColor,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppColors.primaryColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          _product?.name ?? 'Product Details',
          style: const TextStyle(color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Colors.white),
            onPressed: () => _shareProduct(),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: AppColors.textSecondaryColor,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _error!,
                        style: TextStyle(
                          color: AppColors.textSecondaryColor,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadProduct,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _product == null
                  ? const Center(child: Text('Product not found'))
                  : SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Images
                          _buildImageGallery(),
                          
                          // Product Info
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Product Name
                                Text(
                                  _product!.name,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textPrimaryColor,
                                  ),
                                ),
                                
                                const SizedBox(height: 8),
                                
                                // Category
                                Text(
                                  _product!.categoryName,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: AppColors.textSecondaryColor,
                                  ),
                                ),
                                
                                const SizedBox(height: 16),
                                
                                // Price
                                Row(
                                  children: [
                                    Text(
                                      '₹${_product!.price.toStringAsFixed(0)}',
                                      style: const TextStyle(
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primaryColor,
                                      ),
                                    ),
                                    if (_product!.discountPrice != null) ...[
                                      const SizedBox(width: 12),
                                      Text(
                                        '₹${_product!.basePrice.toStringAsFixed(0)}',
                                        style: TextStyle(
                                          fontSize: 18,
                                          color: AppColors.textSecondaryColor,
                                          decoration: TextDecoration.lineThrough,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.successColor,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          '${((((_product!.basePrice - _product!.discountPrice!) / _product!.basePrice) * 100).round())}% OFF',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                
                                const SizedBox(height: 16),
                                
                                // Stock Status
                                Row(
                                  children: [
                                    Icon(
                                      _product!.availableQuantity > 0 
                                          ? Icons.check_circle 
                                          : Icons.cancel,
                                      color: _product!.availableQuantity > 0 
                                          ? AppColors.successColor 
                                          : AppColors.errorColor,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _product!.availableQuantity > 0
                                          ? 'In Stock (${_product!.availableQuantity} available)'
                                          : 'Out of Stock',
                                      style: TextStyle(
                                        color: _product!.availableQuantity > 0 
                                            ? AppColors.successColor 
                                            : AppColors.errorColor,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                
                                const SizedBox(height: 24),
                                
                                // Description
                                if (_product!.description != null && _product!.description!.isNotEmpty) ...[
                                  const Text(
                                    'Description',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimaryColor,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    _product!.description!,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: AppColors.textSecondaryColor,
                                      height: 1.5,
                                    ),
                                  ),
                                  const SizedBox(height: 24),
                                ],
                                
                                // Seller Info
                                if (_product!.sellerName != null) ...[
                                  const Text(
                                    'Sold By',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimaryColor,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    _product!.sellerName!,
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: AppColors.textSecondaryColor,
                                    ),
                                  ),
                                  const SizedBox(height: 100), // Space for bottom buttons
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
      bottomNavigationBar: _product != null && _product!.isActive
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Share Button
                  OutlinedButton.icon(
                    onPressed: () => _shareProduct(),
                    icon: const Icon(Icons.share, size: 20),
                    label: const Text('Share'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primaryColor,
                      side: BorderSide(color: AppColors.primaryColor),
                      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                  
                  const SizedBox(width: 12),
                  
                  // Buy Now / Watch Live Button
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _product!.availableQuantity > 0 ? _findAndNavigateToLivestream : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Watch Live',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : null,
    );
  }

  Widget _buildImageGallery() {
    final List<String> imageUrls = [];
    
    // Add primary image
    if (_product!.primaryImage != null && _product!.primaryImage!.image.isNotEmpty) {
      imageUrls.add(ImageUtils.getFullImageUrl(_product!.primaryImage!.image));
    }
    
    // Add other images
    for (final image in _product!.images) {
      if (image.image.isNotEmpty) {
        final fullUrl = ImageUtils.getFullImageUrl(image.image);
        if (!imageUrls.contains(fullUrl)) {
          imageUrls.add(fullUrl);
        }
      }
    }
    
    // If no images, use placeholder
    if (imageUrls.isEmpty) {
      return Container(
        height: 300,
        color: AppColors.backgroundColor,
        child: const Center(
          child: Icon(
            Icons.image,
            size: 80,
            color: AppColors.textSecondaryColor,
          ),
        ),
      );
    }

    return Column(
      children: [
        // Main Image Display
        Container(
          height: 300,
          width: double.infinity,
          color: Colors.white,
          child: PageView.builder(
            itemCount: imageUrls.length,
            onPageChanged: (index) {
              setState(() {
                _selectedImageIndex = index;
              });
            },
            itemBuilder: (context, index) {
              return Image.network(
                imageUrls[index],
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return const Center(
                    child: Icon(
                      Icons.broken_image,
                      size: 80,
                      color: AppColors.textSecondaryColor,
                    ),
                  );
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator());
                },
              );
            },
          ),
        ),
        
        // Image Indicators
        if (imageUrls.length > 1)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                imageUrls.length,
                (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _selectedImageIndex == index
                        ? AppColors.primaryColor
                        : AppColors.textSecondaryColor.withOpacity(0.3),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

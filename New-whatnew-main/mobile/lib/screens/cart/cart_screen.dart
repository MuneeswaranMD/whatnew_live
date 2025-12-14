import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../core/theme/app_colors.dart';
import '../orders/checkout_screen.dart';
import '../../utils/image_widgets.dart';
import '../../utils/image_utils.dart';
import '../../services/api_service.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _promoCodeController = TextEditingController();
  String? _appliedPromoCode;
  double _discountAmount = 0.0;
  bool _isValidatingPromo = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final cartProvider = Provider.of<CartProvider>(context, listen: false);
      cartProvider.loadCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pureWhite,
      appBar: AppBar(
        title: const Text(
          'Shopping Cart',
          style: TextStyle(
            color: AppColors.pureWhite,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: AppColors.pureWhite),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.pureWhite),
            onPressed: () {
              final cartProvider = Provider.of<CartProvider>(context, listen: false);
              cartProvider.refreshCart();
            },
            tooltip: 'Refresh Cart',
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.crimsonRed.withOpacity(0.05),
              AppColors.pureWhite,
            ],
          ),
        ),
        child: Consumer<CartProvider>(
        builder: (context, cartProvider, child) {
          if (cartProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (cartProvider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.slateGray,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading cart',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.charcoalBlack,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    cartProvider.error!,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.slateGray,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  CustomButton(
                    text: 'Retry',
                    onPressed: () => cartProvider.loadCart(),
                  ),
                ],
              ),
            );
          }

          if (cartProvider.items.isEmpty) {
            return RefreshIndicator(
              onRefresh: () => cartProvider.refreshCart(),
              child: _buildEmptyCart(),
            );
          }

          return RefreshIndicator(
            onRefresh: () => cartProvider.refreshCart(),
            child: Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: cartProvider.items.length,
                    itemBuilder: (context, index) {
                      final item = cartProvider.items[index];
                      return _buildCartItem(item, cartProvider);
                    },
                  ),
                ),
                _buildBottomSection(cartProvider),
              ],
            ),
          );
        },
        ),
      ),
    );
  }

  Widget _buildEmptyCart() {
    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: SizedBox(
        height: MediaQuery.of(context).size.height - 200, // Account for app bar
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.shopping_cart_outlined,
                size: 80,
                color: AppColors.slateGray,
              ),
              const SizedBox(height: 16),
              Text(
                'Your cart is empty',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoalBlack,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Add items from livestreams to get started',
                style: const TextStyle(
                  fontSize: 16,
                  color: AppColors.slateGray,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Pull down to refresh',
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.slateGray,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 24),
              CustomButton(
                text: 'Browse Livestreams',
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navigate to home tab or livestreams
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCartItem(CartItem item, CartProvider cartProvider) {
    final product = item.product;
    final quantity = item.quantity;
    final price = item.price;
    final totalPrice = item.total;
    final bidding = item.bidding;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 3,
      shadowColor: AppColors.shadowLight,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.pureWhite,
              AppColors.offWhite,
            ],
          ),
        ),
        child: Column(
          children: [
            Row(
              children: [
                // Product image
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: NetworkImageExtension.networkWithFallback(
                    ImageUtils.getProductImageUrl(product),
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
                        product['name'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.charcoalBlack,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      
                      const SizedBox(height: 4),
                      
                      if (bidding != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.emeraldGreen.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Won in Bidding',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppColors.emeraldGreen,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                      ],
                      
                      Row(
                        children: [
                          Text(
                            '₹$price',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.crimsonRed,
                            ),
                          ),
                          if (bidding != null) ...[
                            const SizedBox(width: 8),
                            Text(
                              '(Winning bid)',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.slateGray,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                
                // Remove button
                IconButton(
                  onPressed: () => _removeFromCart(item, cartProvider),
                  icon: const Icon(
                    Icons.delete_outline,
                    color: AppColors.crimsonRed,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Quantity and total
            Row(
              children: [
                Text(
                  'Quantity: $quantity',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.slateGray,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(),
                Text(
                  'Total: ₹$totalPrice',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.charcoalBlack,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomSection(CartProvider cartProvider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowLight,
            spreadRadius: 1,
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            // Promo code section
            _buildPromoCodeSection(),
            
            const SizedBox(height: 16),
            
            // Order summary
            _buildOrderSummary(cartProvider),
            
            const SizedBox(height: 16),
            
            // Checkout button
            _buildCheckoutButton(cartProvider),
          ],
        ),
      ),
    );
  }

  Future<void> _removeFromCart(CartItem item, CartProvider cartProvider) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Remove Item',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const Text(
          'Are you sure you want to remove this item from your cart?',
          style: TextStyle(
            color: AppColors.slateGray,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.slateGray,
            ),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.crimsonRed,
            ),
            child: const Text('Remove'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await cartProvider.removeFromCart(item.id); // Use item.id instead of item['product']['id']
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text(
              'Item removed from cart',
              style: TextStyle(
                color: AppColors.pureWhite,
                fontWeight: FontWeight.w600,
              ),
            ),
            backgroundColor: AppColors.emeraldGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              cartProvider.error ?? 'Failed to remove item',
              style: const TextStyle(
                color: AppColors.pureWhite,
                fontWeight: FontWeight.w600,
              ),
            ),
            backgroundColor: AppColors.crimsonRed,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }
  }

  Widget _buildPromoCodeSection() {
    return Column(
      children: [
        // Promo code input
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _promoCodeController,
                decoration: InputDecoration(
                  hintText: 'Enter promo code',
                  hintStyle: TextStyle(
                    color: AppColors.slateGray,
                    fontSize: 14,
                  ),
                  filled: true,
                  fillColor: AppColors.offWhite,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                style: const TextStyle(
                  fontSize: 16,
                  color: AppColors.charcoalBlack,
                ),
                enabled: _appliedPromoCode == null,
              ),
            ),
            
            const SizedBox(width: 8),
            
            // Apply/Remove button
            ElevatedButton(
              onPressed: _appliedPromoCode == null ? _applyPromoCode : _removePromoCode,
              style: ElevatedButton.styleFrom(
                backgroundColor: _appliedPromoCode == null 
                    ? AppColors.crimsonRed 
                    : AppColors.slateGray,
                foregroundColor: AppColors.pureWhite,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 3,
                shadowColor: AppColors.crimsonRed.withOpacity(0.3),
              ),
              child: _isValidatingPromo 
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.pureWhite),
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      _appliedPromoCode == null ? 'Apply' : 'Remove',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ],
        ),
        
        // Applied promo code display
        if (_appliedPromoCode != null && _discountAmount > 0) ...[
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.emeraldGreen.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: AppColors.emeraldGreen.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.check_circle,
                  color: AppColors.emeraldGreen,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Promo code $_appliedPromoCode applied',
                    style: TextStyle(
                      color: AppColors.emeraldGreen,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
                Text(
                  '-₹${_discountAmount.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: AppColors.emeraldGreen,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildOrderSummary(CartProvider cartProvider) {
    final subtotal = cartProvider.totalAmount;
    const shippingFee = 50.0; // Default shipping fee
    final discountedShippingFee = _appliedPromoCode != null 
        ? (shippingFee - _discountAmount).clamp(0.0, shippingFee)
        : shippingFee;
    final total = subtotal + discountedShippingFee;

    return Column(
      children: [
        Row(
          children: [
            Text(
              'Total Items: ${cartProvider.totalItems}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.charcoalBlack,
              ),
            ),
            const Spacer(),
            Text(
              'Subtotal: ₹${subtotal.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.charcoalBlack,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 8),
        
        // Shipping fee row
        Row(
          children: [
            const Text(
              'Shipping Fee:',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.slateGray,
              ),
            ),
            const Spacer(),
            if (_appliedPromoCode != null && _discountAmount > 0) ...[
              Text(
                '₹${shippingFee.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.slateGray,
                  decoration: TextDecoration.lineThrough,
                ),
              ),
              const SizedBox(width: 8),
            ],
            Text(
              '₹${discountedShippingFee.toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: _appliedPromoCode != null && _discountAmount > 0
                    ? AppColors.emeraldGreen
                    : AppColors.charcoalBlack,
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 8),
        
        // Total row
        Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: const BoxDecoration(
            border: Border(
              top: BorderSide(color: AppColors.offWhite, width: 1),
            ),
          ),
          child: Row(
            children: [
              const Text(
                'Total:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.charcoalBlack,
                ),
              ),
              const Spacer(),
              Text(
                '₹${total.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.crimsonRed,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCheckoutButton(CartProvider cartProvider) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: cartProvider.items.isNotEmpty 
            ? () => _proceedToCheckout(cartProvider)
            : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.crimsonRed,
          foregroundColor: AppColors.pureWhite,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 3,
          shadowColor: AppColors.crimsonRed.withOpacity(0.3),
        ),
        child: const Text(
          'Proceed to Checkout',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Future<void> _applyPromoCode() async {
    final code = _promoCodeController.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Please enter a promo code',
            style: TextStyle(color: AppColors.pureWhite),
          ),
          backgroundColor: AppColors.vibrantPurple,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
      return;
    }

    setState(() {
      _isValidatingPromo = true;
    });

    try {
      const shippingFee = 50.0; // Default shipping fee to apply discount to
      final response = await ApiService.validatePromoCode(code, orderAmount: shippingFee);
      
      if (response['valid'] == true) {
        // Use the promo code
        await ApiService.usePromoCode(code, orderAmount: shippingFee);
        
        setState(() {
          _appliedPromoCode = code.toUpperCase();
          _discountAmount = double.parse(response['discount_amount'].toString());
          _isValidatingPromo = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Promo code applied! You saved ₹${_discountAmount.toStringAsFixed(2)}',
              style: const TextStyle(color: AppColors.pureWhite),
            ),
            backgroundColor: AppColors.emeraldGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      } else {
        setState(() {
          _isValidatingPromo = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              response['message'] ?? 'Invalid promo code',
              style: const TextStyle(color: AppColors.pureWhite),
            ),
            backgroundColor: AppColors.crimsonRed,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isValidatingPromo = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Error applying promo code: ${e.toString()}',
            style: const TextStyle(color: AppColors.pureWhite),
          ),
          backgroundColor: AppColors.crimsonRed,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  void _removePromoCode() {
    setState(() {
      _appliedPromoCode = null;
      _discountAmount = 0.0;
      _promoCodeController.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Promo code removed',
          style: TextStyle(color: AppColors.pureWhite),
        ),
        backgroundColor: AppColors.slateGray,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  void _proceedToCheckout(CartProvider cartProvider) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isAuthenticated) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Please login to proceed to checkout',
            style: TextStyle(
              color: AppColors.pureWhite,
              fontWeight: FontWeight.w600,
            ),
          ),
          backgroundColor: AppColors.vibrantPurple,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const CheckoutScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _promoCodeController.dispose();
    super.dispose();
  }
}

import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class CartItem {
  final int id;
  final Map<String, dynamic> product;
  final int quantity;
  final double price;
  final double total;
  final String? bidding; // Add bidding field

  CartItem({
    required this.id,
    required this.product,
    required this.quantity,
    required this.price,
    required this.total,
    this.bidding,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    // Use product_data if available, otherwise create a fallback object
    final productData = json['product_data'] as Map<String, dynamic>?;
    final product = productData ?? {
      'id': json['product'], // Use the product UUID as fallback
      'name': 'Unknown Product',
      'base_price': json['price'],
    };
    
    return CartItem(
      id: json['id'],
      product: product,
      quantity: json['quantity'],
      price: double.parse(json['price'].toString()),
      total: double.parse(json['total_price'].toString()), // Use total_price from API
      bidding: json['bidding'],
    );
  }
}

class Cart {
  final int id;
  final List<CartItem> items;
  final double totalAmount;
  final int totalItems;
  final DateTime createdAt;

  Cart({
    required this.id,
    required this.items,
    required this.totalAmount,
    required this.totalItems,
    required this.createdAt,
  });

  factory Cart.fromJson(Map<String, dynamic> json) {
    return Cart(
      id: json['id'],
      items: (json['items'] as List<dynamic>)
          .map((item) => CartItem.fromJson(item))
          .toList(),
      totalAmount: double.parse(json['total_amount'].toString()),
      totalItems: json['total_items'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class CartProvider extends ChangeNotifier {
  Cart? _cart;
  bool _isLoading = false;
  bool _isRefreshing = false;
  String? _error;

  Cart? get cart => _cart;
  bool get isLoading => _isLoading;
  bool get isRefreshing => _isRefreshing;
  String? get error => _error;
  int get itemCount => _cart?.totalItems ?? 0;
  double get totalAmount => _cart?.totalAmount ?? 0.0;

  // Additional getters needed by UI
  List<CartItem> get items => _cart?.items ?? [];
  int get totalItems => _cart?.totalItems ?? 0;

  // Add loadCart method alias for getCart
  Future<void> loadCart() async {
    await getCart();
  }

  // Refresh cart for pull-to-refresh functionality
  Future<void> refreshCart() async {
    try {
      _isRefreshing = true;
      _error = null;
      notifyListeners();

      final response = await ApiService.getCart();
      _cart = Cart.fromJson(response);
      
      // Save item count to storage
      await StorageService.saveCartItemCount(_cart!.totalItems);
      
      _isRefreshing = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isRefreshing = false;
      notifyListeners();
    }
  }

  // Get cart
  Future<bool> getCart() async {
    // print('📦 CartProvider: getCart() called');
    // print('📦 CartProvider: Stack trace: ${StackTrace.current}');
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.getCart();
      // print('📦 CartProvider: API response: $response');
      _cart = Cart.fromJson(response);
      // print('📦 CartProvider: Parsed cart - items: ${_cart!.totalItems}, total: ${_cart!.totalAmount}');
      
      // Save item count to storage
      await StorageService.saveCartItemCount(_cart!.totalItems);
      
      _setLoading(false);
      return true;
    } catch (e) {
      // print('📦 CartProvider: getCart() error: $e');
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Add to cart
  Future<bool> addToCart(String productId, int quantity, {double? price}) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.addToCart(productId, quantity, price: price);
      
      // Refresh cart
      await getCart();
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Remove from cart
  Future<bool> removeFromCart(int cartItemId) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.removeFromCart(cartItemId);
      
      // Refresh cart
      await getCart();
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Update quantity (find cart item and update)
  Future<bool> updateQuantity(String productId, int newQuantity) async {
    try {
      _setLoading(true);
      _error = null;

      // Find the cart item for this product
      final cartItem = getCartItem(productId);
      if (cartItem == null) {
        _error = 'Product not found in cart';
        _setLoading(false);
        return false;
      }

      if (newQuantity <= 0) {
        return await removeFromCart(cartItem.id);
      }

      // Remove current item
      await ApiService.removeFromCart(cartItem.id);
      
      // Add with new quantity
      await ApiService.addToCart(productId, newQuantity, price: cartItem.price);
      
      // Refresh cart
      await getCart();
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Clear cart (call backend API and refresh)
  Future<void> clearCart() async {
    // print('📦 CartProvider: clearCart() called');
    // print('📦 CartProvider: Stack trace: ${StackTrace.current}');
    
    try {
      // Call backend API to clear cart
      await ApiService.clearCart();
      // print('📦 CartProvider: Backend cart cleared successfully');
    } catch (e) {
      // print('📦 CartProvider: Error clearing backend cart: $e');
      // Continue with local clearing even if backend fails
    }
    
    // Clear local cache completely
    _cart = null;
    _isLoading = false;
    _isRefreshing = false;
    _error = null;
    
    // Clear storage
    await StorageService.saveCartItemCount(0);
    
    notifyListeners();
    
    // print('📦 CartProvider: Cart cleared locally and storage updated');
  }

  // Add winning bid item to cart automatically
  Future<bool> addWinningBidToCart(String productId, {double? price}) async {
    return await addToCart(productId, 1, price: price);
  }

  // Check if product is in cart
  bool isProductInCart(String productId) {
    if (_cart == null) return false;
    
    return _cart!.items.any((item) => item.product['id'] == productId);
  }

  // Get cart item by product id
  CartItem? getCartItem(String productId) {
    if (_cart == null) return null;
    
    try {
      return _cart!.items.firstWhere((item) => item.product['id'] == productId);
    } catch (e) {
      return null;
    }
  }

  // Initialize cart count from storage
  void initCartCount() async {
    final count = StorageService.getCartItemCount();
    // print('📦 CartProvider: initCartCount - stored count: $count');
    
    if (count > 0) {
      // Try to get cart from backend to verify it still exists
      try {
        await getCart();
        // print('📦 CartProvider: initCartCount - cart loaded successfully');
      } catch (e) {
        // print('📦 CartProvider: initCartCount - error loading cart, clearing storage: $e');
        // If cart doesn't exist on backend, clear local storage
        await StorageService.saveCartItemCount(0);
        _cart = null;
        notifyListeners();
      }
    } else {
      // print('📦 CartProvider: initCartCount - no stored cart count');
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Helper method to set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}

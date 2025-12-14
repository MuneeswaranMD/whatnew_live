import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class ProductProvider with ChangeNotifier {
  List<Product> _products = [];
  List<Product> _searchResults = [];
  bool _isLoading = false;
  String? _error;
  String _lastSearchQuery = '';

  List<Product> get products => _products;
  List<Product> get searchResults => _searchResults;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get lastSearchQuery => _lastSearchQuery;

  // Search products
  Future<bool> searchProducts(String query, {int? category}) async {
    // print('ProductProvider: Searching products with query: "$query"');
    
    if (query.trim().isEmpty) {
      _searchResults = [];
      _lastSearchQuery = '';
      notifyListeners();
      return true;
    }

    _isLoading = true;
    _error = null;
    _lastSearchQuery = query;
    notifyListeners();

    try {
      final response = await ApiService.getProducts(
        search: query,
        category: category,
      );

      // print('ProductProvider: Raw search response: $response');

      List<dynamic> productsData;
      
      // Handle different response formats
      if (response.containsKey('results')) {
        // Paginated response
        productsData = response['results'] as List<dynamic>;
        // print('ProductProvider: Using paginated results with ${productsData.length} items');
      } else if (response.containsKey('data')) {
        // Response with data wrapper
        productsData = response['data'] as List<dynamic>;
        // print('ProductProvider: Using data wrapper with ${productsData.length} items');
      } else {
        // Response is the data itself - treat as single product
        productsData = [response];
        // print('ProductProvider: Using single product response');
      }

      // Parse products
      _searchResults = productsData.map((json) {
        try {
          return Product.fromJson(json as Map<String, dynamic>);
        } catch (e) {
          // print('ProductProvider: Error parsing product: $e');
          // print('ProductProvider: Problem JSON: $json');
          return null;
        }
      }).where((product) => product != null).cast<Product>().toList();

      // print('ProductProvider: Successfully parsed ${_searchResults.length} products');
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      // print('ProductProvider: Error searching products: $e');
      _error = 'Failed to search products: ${e.toString()}';
      _isLoading = false;
      _searchResults = [];
      notifyListeners();
      return false;
    }
  }

  // Get product by ID
  Future<Product?> getProductById(String productId) async {
    // print('ProductProvider: Getting product by ID: $productId');
    
    try {
      final response = await ApiService.getProduct(int.parse(productId));
      // print('ProductProvider: Product response: $response');
      
      return Product.fromJson(response);
    } catch (e) {
      // print('ProductProvider: Error getting product: $e');
      _error = 'Failed to get product details: ${e.toString()}';
      notifyListeners();
      return null;
    }
  }

  // Clear search results
  void clearSearch() {
    _searchResults = [];
    _lastSearchQuery = '';
    _error = null;
    notifyListeners();
  }

  // Load all products (for general browsing)
  Future<bool> loadProducts({int? category, int? page}) async {
    // print('ProductProvider: Loading products (category: $category, page: $page)');
    
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.getProducts(
        category: category,
        page: page,
      );

      List<dynamic> productsData;
      
      // Handle different response formats
      if (response.containsKey('results')) {
        productsData = response['results'] as List<dynamic>;
      } else if (response.containsKey('data')) {
        productsData = response['data'] as List<dynamic>;
      } else {
        productsData = [response];
      }

      // Parse products
      final newProducts = productsData.map((json) {
        try {
          return Product.fromJson(json as Map<String, dynamic>);
        } catch (e) {
          // print('ProductProvider: Error parsing product: $e');
          return null;
        }
      }).where((product) => product != null).cast<Product>().toList();

      if (page == null || page == 1) {
        _products = newProducts;
      } else {
        _products.addAll(newProducts);
      }

      // print('ProductProvider: Successfully loaded ${newProducts.length} products');
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      // print('ProductProvider: Error loading products: $e');
      _error = 'Failed to load products: ${e.toString()}';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}

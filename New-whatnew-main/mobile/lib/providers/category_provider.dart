import 'package:flutter/foundation.dart';
import '../models/category.dart' as model;
import '../services/api_service.dart';

class CategoryProvider extends ChangeNotifier {
  List<model.Category> _categories = [];
  bool _isLoading = false;
  String? _error;

  // Default categories that will be used as fallback
  final List<Map<String, dynamic>> _defaultCategories = [
    {'name': 'Electronics', 'icon': 'phone_android', 'color': 'primary'},
    {'name': 'Fashion', 'icon': 'checkroom', 'color': 'secondary'},
    {'name': 'Home & Kitchen', 'icon': 'home', 'color': 'success'},
    {'name': 'Sports', 'icon': 'sports_soccer', 'color': 'warning'},
    {'name': 'Beauty', 'icon': 'auto_awesome', 'color': 'pink'},
    {'name': 'Books', 'icon': 'menu_book', 'color': 'brown'},
    {'name': 'Toys', 'icon': 'toys', 'color': 'orange'},
    {'name': 'More', 'icon': 'more_horiz', 'color': 'grey'},
  ];

  // Getters
  List<model.Category> get categories => _categories;
  List<Map<String, dynamic>> get displayCategories {
    if (_categories.isNotEmpty) {
      // Use backend categories
      return _categories
          .where((cat) => cat.isActive)
          .take(8)
          .map((cat) => {
                'name': cat.name,
                'icon': _getIconForCategory(cat.name),
                'color': _getColorForCategory(cat.name),
              })
          .toList();
    } else {
      // Use default categories as fallback
      return _defaultCategories;
    }
  }
  
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load categories from backend
  Future<bool> loadCategories() async {
    try {
      // print('CategoryProvider: Starting to load categories from backend');
      _setLoading(true);
      _error = null;

      final response = await ApiService.getCategories();
      // print('CategoryProvider: Raw API response: $response');
      // print('CategoryProvider: Response type: ${response.runtimeType}');
      // print('CategoryProvider: Response length: ${response.length}');

      _categories = response
          .map((json) => model.Category.fromJson(json))
          .toList();

      // print('CategoryProvider: Parsed ${_categories.length} categories');
      for (var category in _categories) {
        // print('CategoryProvider: Category - Name: ${category.name}, Active: ${category.isActive}');
      }

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      // print('CategoryProvider: Error loading categories: $e');
      return false;
    }
  }

  // Helper method to get icon for category
  String _getIconForCategory(String categoryName) {
    switch (categoryName.toLowerCase()) {
      case 'electronics':
      case 'phone':
      case 'mobile':
        return 'phone_android';
      case 'fashion':
      case 'clothing':
      case 'clothes':
        return 'checkroom';
      case 'home & kitchen':
      case 'home':
      case 'kitchen':
        return 'home';
      case 'sports':
        return 'sports_soccer';
      case 'beauty':
        return 'auto_awesome';
      case 'books':
      case 'book':
        return 'menu_book';
      case 'toys':
        return 'toys';
      default:
        return 'category';
    }
  }

  // Helper method to get color for category
  String _getColorForCategory(String categoryName) {
    switch (categoryName.toLowerCase()) {
      case 'electronics':
      case 'phone':
      case 'mobile':
        return 'primary';
      case 'fashion':
      case 'clothing':
      case 'clothes':
        return 'secondary';
      case 'home & kitchen':
      case 'home':
      case 'kitchen':
        return 'success';
      case 'sports':
        return 'warning';
      case 'beauty':
        return 'pink';
      case 'books':
      case 'book':
        return 'brown';
      case 'toys':
        return 'orange';
      default:
        return 'grey';
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

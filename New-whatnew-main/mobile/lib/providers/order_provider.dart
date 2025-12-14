import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/address.dart';
import '../models/order.dart';

class ShippingAddress {
  final String fullName;
  final String phoneNumber;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String state;
  final String pincode;

  ShippingAddress({
    required this.fullName,
    required this.phoneNumber,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.state,
    required this.pincode,
  });

  factory ShippingAddress.fromJson(Map<String, dynamic> json) {
    return ShippingAddress(
      fullName: json['full_name']?.toString() ?? '',
      phoneNumber: json['phone_number']?.toString() ?? '',
      addressLine1: json['address_line_1']?.toString() ?? '',
      addressLine2: json['address_line_2']?.toString(),
      city: json['city']?.toString() ?? '',
      state: json['state']?.toString() ?? '',
      pincode: json['pincode']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'full_name': fullName,
      'phone_number': phoneNumber,
      'address_line_1': addressLine1,
      'address_line_2': addressLine2,
      'city': city,
      'state': state,
      'pincode': pincode,
    };
  }
}

// Extension to add toShippingAddress method to the imported Address model
extension AddressExtension on Address {
  ShippingAddress toShippingAddress() {
    return ShippingAddress(
      fullName: fullName,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      pincode: pincode, // Fixed to use pincode instead of postalCode
    );
  }
}

class OrderProvider extends ChangeNotifier {
  List<Order> _orders = [];
  List<Address> _addresses = [];
  Address? _selectedAddress;
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  List<Address> get addresses => _addresses;
  Address? get selectedAddress => _selectedAddress;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get orders
  Future<bool> getOrders({int? page}) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.getOrders(page: page);
      // print('OrderProvider.getOrders: Raw response type: ${response.runtimeType}');
      // print('OrderProvider.getOrders: Response keys: ${response.keys}');
      
      // Handle different response formats
      List<dynamic> ordersList;
      if (response.containsKey('results') && response['results'] is List) {
        // Paginated response
        ordersList = response['results'] as List<dynamic>;
        // print('OrderProvider.getOrders: Found results array with ${ordersList.length} items');
      } else if (response is List) {
        // Direct list response
        ordersList = response as List<dynamic>;
        // print('OrderProvider.getOrders: Direct list response with ${ordersList.length} items');
      } else {
        // Assume single order response - wrap in list
        ordersList = [response];
        // print('OrderProvider.getOrders: Single order response, wrapped in list');
      }
      
      // Debug each order item before parsing
      for (int i = 0; i < ordersList.length; i++) {
        // print('OrderProvider.getOrders: Item $i type: ${ordersList[i].runtimeType}');
        if (ordersList[i] is Map) {
          // print('OrderProvider.getOrders: Item $i keys: ${(ordersList[i] as Map).keys}');
        }
      }
      
      // Convert each valid Map to Order object with detailed error handling
      _orders = [];
      for (int i = 0; i < ordersList.length; i++) {
        final json = ordersList[i];
        if (json is Map<String, dynamic>) {
          try {
            // print('OrderProvider.getOrders: Parsing order $i');
            final order = Order.fromJson(json);
            _orders.add(order);
            // print('OrderProvider.getOrders: Successfully parsed order $i');
          } catch (e) {
            // print('OrderProvider.getOrders: Error parsing order $i: $e');
            // print('OrderProvider.getOrders: Order $i JSON: $json');
          }
        } else {
          // print('OrderProvider.getOrders: Skipping non-Map item at index $i: ${json.runtimeType}');
        }
      }

      // print('OrderProvider.getOrders: Successfully parsed ${_orders.length} orders');
      _setLoading(false);
      return true;
    } catch (e) {
      // print('OrderProvider.getOrders error: $e');
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Create order
  Future<bool> createOrder() async {
    try {
      if (_selectedAddress == null) {
        _error = 'Please select a shipping address';
        return false;
      }

      _setLoading(true);
      _error = null;

      final response = await ApiService.createOrder(
        shippingAddress: _selectedAddress!.toShippingAddress().toJson(),
      );

      // Add new order to the beginning of the list
      final newOrder = Order.fromJson(response);
      _orders.insert(0, newOrder);

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Get addresses
  Future<bool> getAddresses() async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.getAddresses();
      _addresses = (response as List<dynamic>)
          .map((json) => Address.fromJson(json))
          .toList();

      // Set default address as selected
      _selectedAddress ??= _addresses
          .where((addr) => addr.isDefault)
          .isNotEmpty
          ? _addresses.firstWhere((addr) => addr.isDefault)
          : null;

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Alias for getAddresses
  Future<bool> loadAddresses() => getAddresses();

  // Add address
  Future<bool> addAddress({
    required String fullName,
    required String phoneNumber,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
    bool isDefault = false,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.addAddress(
        fullName: fullName,
        phoneNumber: phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        pincode: pincode,
        isDefault: isDefault,
      );

      final newAddress = Address.fromJson(response);
      _addresses.add(newAddress);

      if (isDefault || _selectedAddress == null) {
        _selectedAddress = newAddress;
      }

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Update address
  Future<bool> updateAddress(
    int addressId, {
    String? fullName,
    String? phoneNumber,
    String? addressLine1,
    String? addressLine2,
    String? city,
    String? state,
    String? pincode,
    bool? isDefault,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.updateAddress(
        addressId,
        fullName: fullName,
        phoneNumber: phoneNumber,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        pincode: pincode,
        isDefault: isDefault,
      );

      final updatedAddress = Address.fromJson(response);
      final index = _addresses.indexWhere((addr) => addr.id == addressId);
      if (index != -1) {
        _addresses[index] = updatedAddress;
        
        if (_selectedAddress?.id == addressId) {
          _selectedAddress = updatedAddress;
        }
      }

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Delete address
  Future<bool> deleteAddress(int addressId) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.deleteAddress(addressId);
      
      _addresses.removeWhere((addr) => addr.id == addressId);
      
      if (_selectedAddress?.id == addressId) {
        _selectedAddress = _addresses
            .where((addr) => addr.isDefault)
            .isNotEmpty
            ? _addresses.firstWhere((addr) => addr.isDefault)
            : (_addresses.isNotEmpty ? _addresses.first : null);
      }

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Set default address
  Future<bool> setDefaultAddress(int addressId) async {
    try {
      _setLoading(true);
      _error = null;

      await ApiService.setDefaultAddress(addressId);
      
      // Update local state
      for (int i = 0; i < _addresses.length; i++) {
        _addresses[i] = Address.fromJson({
          ..._addresses[i].toJson(),
          'is_default': _addresses[i].id == addressId,
        });
      }
      
      _selectedAddress = _addresses.firstWhere((addr) => addr.id == addressId);

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Select address
  void selectAddress(Address address) {
    _selectedAddress = address;
    notifyListeners();
  }

  // Get order by ID
  Order? getOrderById(String orderId) {
    try {
      return _orders.firstWhere((order) => order.id == orderId);
    } catch (e) {
      return null;
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

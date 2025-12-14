import 'package:flutter/foundation.dart';
import '../models/address.dart';
import '../services/api_service.dart';
import '../utils/address_validator.dart';

class AddressProvider with ChangeNotifier {
  List<Address> _addresses = [];
  bool _isLoading = false;
  String? _error;

  List<Address> get addresses => _addresses;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Address? get defaultAddress {
    try {
      return _addresses.firstWhere((address) => address.isDefault);
    } catch (e) {
      return _addresses.isNotEmpty ? _addresses.first : null;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  Future<bool> loadAddresses() async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await ApiService.getAddresses();
      
      // Check if response has 'results' key (paginated response)
      if (response['results'] != null && response['results'] is List) {
        _addresses = (response['results'] as List)
            .map((addressJson) => Address.fromJson(addressJson as Map<String, dynamic>))
            .toList();
      } 
      // Check if response has 'data' key 
      else if (response['data'] != null && response['data'] is List) {
        _addresses = (response['data'] as List)
            .map((addressJson) => Address.fromJson(addressJson as Map<String, dynamic>))
            .toList();
      }
      // If response itself contains address fields (single address response)
      else if (response['id'] != null) {
        _addresses = [Address.fromJson(response)];
      }
      // Default to empty list
      else {
        _addresses = [];
      }

      notifyListeners();
      return true;
    } catch (e) {
      String errorMessage = 'Failed to load addresses';
      
      if (e is ApiException) {
        errorMessage = 'Failed to load addresses: ${e.message}';
        if (e.errors != null) {
          final errors = e.errors!;
          final errorDetails = errors.entries
              .map((entry) => '${entry.key}: ${entry.value}')
              .join(', ');
          errorMessage += ' ($errorDetails)';
        }
      } else {
        errorMessage = 'Failed to load addresses: ${e.toString()}';
      }
      
      _setError(errorMessage);
      return false;
    } finally {
      _setLoading(false);
    }
  }

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
    _setError(null);

    // Validate address data before making API call
    final validationErrors = AddressValidator.validateAddressData(
      fullName: fullName,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      pincode: pincode,
    );

    if (validationErrors.isNotEmpty) {
      final errorMessage = 'Invalid address data:\n${AddressValidator.formatValidationErrors(validationErrors)}';
      _setError(errorMessage);
      return false;
    }

    try {
      // print('AddressProvider.addAddress: Starting API call');
      final response = await ApiService.addAddress(
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2?.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault: isDefault,
      );

      // print('AddressProvider.addAddress: API call successful, response: $response');

      // If this is set as default, update other addresses
      if (isDefault) {
        _addresses = _addresses.map((address) => 
          address.copyWith(isDefault: false)
        ).toList();
      }

      // print('AddressProvider.addAddress: Parsing response to Address object');
      final newAddress = Address.fromJson(response);
      // print('AddressProvider.addAddress: Successfully parsed address: $newAddress');
      
      _addresses.add(newAddress);
      notifyListeners();

      return true;
    } catch (e) {
      // print('AddressProvider.addAddress: Exception caught: $e');
      // print('AddressProvider.addAddress: Exception type: ${e.runtimeType}');
      
      String errorMessage = 'Failed to add address';
      
      if (e is ApiException) {
        // print('AddressProvider.addAddress: ApiException details - Status: ${e.statusCode}, Message: ${e.message}, Errors: ${e.errors}');
        errorMessage = 'Failed to add address: ${e.message}';
        if (e.errors != null) {
          final errors = e.errors!;
          final errorDetails = errors.entries
              .map((entry) => '${entry.key}: ${entry.value}')
              .join(', ');
          errorMessage += ' ($errorDetails)';
        }
      } else {
        errorMessage = 'Failed to add address: ${e.toString()}';
      }
      
      _setError(errorMessage);
      return false;
    }
  }

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
    _setError(null);

    // Validate provided fields
    final validationErrors = <String, String>{};
    
    if (fullName != null) {
      if (fullName.trim().isEmpty) {
        validationErrors['full_name'] = 'Full name cannot be empty';
      } else if (fullName.trim().length < 2) {
        validationErrors['full_name'] = 'Full name must be at least 2 characters';
      }
    }
    
    if (phoneNumber != null) {
      final phoneRegex = RegExp(r'^[6-9]\d{9}$');
      if (phoneNumber.trim().isEmpty) {
        validationErrors['phone_number'] = 'Phone number cannot be empty';
      } else if (!phoneRegex.hasMatch(phoneNumber.trim())) {
        validationErrors['phone_number'] = 'Enter a valid 10-digit phone number';
      }
    }
    
    if (addressLine1 != null) {
      if (addressLine1.trim().isEmpty) {
        validationErrors['address_line_1'] = 'Address line 1 cannot be empty';
      } else if (addressLine1.trim().length < 5) {
        validationErrors['address_line_1'] = 'Address must be at least 5 characters';
      }
    }
    
    if (city != null) {
      if (city.trim().isEmpty) {
        validationErrors['city'] = 'City cannot be empty';
      } else if (city.trim().length < 2) {
        validationErrors['city'] = 'City must be at least 2 characters';
      }
    }
    
    if (state != null) {
      if (state.trim().isEmpty) {
        validationErrors['state'] = 'State cannot be empty';
      } else if (state.trim().length < 2) {
        validationErrors['state'] = 'State must be at least 2 characters';
      }
    }
    
    if (pincode != null) {
      final pincodeRegex = RegExp(r'^\d{6}$');
      if (pincode.trim().isEmpty) {
        validationErrors['pincode'] = 'Pincode cannot be empty';
      } else if (!pincodeRegex.hasMatch(pincode.trim())) {
        validationErrors['pincode'] = 'Enter a valid 6-digit pincode';
      }
    }

    if (validationErrors.isNotEmpty) {
      final errorMessage = 'Invalid address data:\n${validationErrors.entries.map((e) => '${e.key}: ${e.value}').join('\n')}';
      _setError(errorMessage);
      return false;
    }

    try {
      final response = await ApiService.updateAddress(
        addressId,
        fullName: fullName?.trim(),
        phoneNumber: phoneNumber?.trim(),
        addressLine1: addressLine1?.trim(),
        addressLine2: addressLine2?.trim(),
        city: city?.trim(),
        state: state?.trim(),
        pincode: pincode?.trim(),
        isDefault: isDefault,
      );

      // If this is set as default, update other addresses
      if (isDefault == true) {
        _addresses = _addresses.map((address) => 
          address.id == addressId 
            ? address.copyWith(isDefault: true)
            : address.copyWith(isDefault: false)
        ).toList();
      } else {
        final updatedAddress = Address.fromJson(response);
        final index = _addresses.indexWhere((address) => address.id == addressId);
        if (index != -1) {
          _addresses[index] = updatedAddress;
        }
      }

      notifyListeners();
      return true;
    } catch (e) {
      String errorMessage = 'Failed to update address';
      
      if (e is ApiException) {
        errorMessage = 'Failed to update address: ${e.message}';
        if (e.errors != null) {
          final errors = e.errors!;
          final errorDetails = errors.entries
              .map((entry) => '${entry.key}: ${entry.value}')
              .join(', ');
          errorMessage += ' ($errorDetails)';
        }
      } else {
        errorMessage = 'Failed to update address: ${e.toString()}';
      }
      
      _setError(errorMessage);
      return false;
    }
  }

  Future<bool> deleteAddress(int addressId) async {
    _setError(null);

    try {
      await ApiService.deleteAddress(addressId);
      _addresses.removeWhere((address) => address.id == addressId);
      notifyListeners();
      return true;
    } catch (e) {
      String errorMessage = 'Failed to delete address';
      
      if (e is ApiException) {
        errorMessage = 'Failed to delete address: ${e.message}';
        if (e.errors != null) {
          final errors = e.errors!;
          final errorDetails = errors.entries
              .map((entry) => '${entry.key}: ${entry.value}')
              .join(', ');
          errorMessage += ' ($errorDetails)';
        }
      } else {
        errorMessage = 'Failed to delete address: ${e.toString()}';
      }
      
      _setError(errorMessage);
      return false;
    }
  }

  Future<bool> setDefaultAddress(int addressId) async {
    _setError(null);

    try {
      await ApiService.setDefaultAddress(addressId);
      
      // Update the addresses list
      _addresses = _addresses.map((address) => 
        address.copyWith(isDefault: address.id == addressId)
      ).toList();
      
      notifyListeners();
      return true;
    } catch (e) {
      String errorMessage = 'Failed to set default address';
      
      if (e is ApiException) {
        errorMessage = 'Failed to set default address: ${e.message}';
        if (e.errors != null) {
          final errors = e.errors!;
          final errorDetails = errors.entries
              .map((entry) => '${entry.key}: ${entry.value}')
              .join(', ');
          errorMessage += ' ($errorDetails)';
        }
      } else {
        errorMessage = 'Failed to set default address: ${e.toString()}';
      }
      
      _setError(errorMessage);
      return false;
    }
  }

  void clearError() {
    _setError(null);
  }

  // Refresh addresses (for pull-to-refresh)
  Future<void> refreshAddresses() async {
    await loadAddresses();
  }
}

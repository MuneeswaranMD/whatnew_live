// Address validation helper
class AddressValidator {
  static Map<String, String> validateAddressData({
    required String fullName,
    required String phoneNumber,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
  }) {
    final errors = <String, String>{};

    // Validate full name
    if (fullName.trim().isEmpty) {
      errors['full_name'] = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors['full_name'] = 'Full name must be at least 2 characters';
    }

    // Validate phone number
    final phoneRegex = RegExp(r'^[6-9]\d{9}$');
    if (phoneNumber.trim().isEmpty) {
      errors['phone_number'] = 'Phone number is required';
    } else if (!phoneRegex.hasMatch(phoneNumber.trim())) {
      errors['phone_number'] = 'Enter a valid 10-digit phone number';
    }

    // Validate address line 1
    if (addressLine1.trim().isEmpty) {
      errors['address_line_1'] = 'Address line 1 is required';
    } else if (addressLine1.trim().length < 5) {
      errors['address_line_1'] = 'Address must be at least 5 characters';
    }

    // Validate city
    if (city.trim().isEmpty) {
      errors['city'] = 'City is required';
    } else if (city.trim().length < 2) {
      errors['city'] = 'City must be at least 2 characters';
    }

    // Validate state
    if (state.trim().isEmpty) {
      errors['state'] = 'State is required';
    } else if (state.trim().length < 2) {
      errors['state'] = 'State must be at least 2 characters';
    }

    // Validate pincode
    final pincodeRegex = RegExp(r'^\d{6}$');
    if (pincode.trim().isEmpty) {
      errors['pincode'] = 'Pincode is required';
    } else if (!pincodeRegex.hasMatch(pincode.trim())) {
      errors['pincode'] = 'Enter a valid 6-digit pincode';
    }

    return errors;
  }

  static bool isValidAddress({
    required String fullName,
    required String phoneNumber,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
  }) {
    final errors = validateAddressData(
      fullName: fullName,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      pincode: pincode,
    );
    return errors.isEmpty;
  }

  static String formatValidationErrors(Map<String, String> errors) {
    if (errors.isEmpty) return '';
    
    return errors.entries
        .map((entry) => '${entry.key}: ${entry.value}')
        .join('\n');
  }
}

// Test the validator
void main() {
  // print('=== Address Validation Test ===\n');

  // Test valid address
  final validErrors = AddressValidator.validateAddressData(
    fullName: 'John Doe',
    phoneNumber: '9876543210',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  );

  // print('Valid address errors: ${validErrors.isEmpty ? "None" : validErrors}');

  // Test invalid address
  final invalidErrors = AddressValidator.validateAddressData(
    fullName: '',
    phoneNumber: '123',
    addressLine1: '1',
    city: '',
    state: 'M',
    pincode: '12345',
  );

  // print('Invalid address errors:');
  if (invalidErrors.isNotEmpty) {
    invalidErrors.forEach((field, error) {
      // print('  $field: $error');
    });
  }
}

class Address {
  final int id;
  final String fullName;
  final String phoneNumber;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String state;
  final String pincode;
  final bool isDefault;
  final DateTime createdAt;
  final DateTime? updatedAt; // Make optional since backend doesn't return it

  Address({
    required this.id,
    required this.fullName,
    required this.phoneNumber,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.state,
    required this.pincode,
    required this.isDefault,
    required this.createdAt,
    this.updatedAt,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    // print('Address.fromJson: Parsing JSON: $json');
    try {
      return Address(
        id: json['id'] as int,
        fullName: json['full_name'] as String,
        phoneNumber: json['phone_number'] as String,
        addressLine1: json['address_line_1'] as String,
        addressLine2: json['address_line_2'] as String?,
        city: json['city'] as String,
        state: json['state'] as String,
        pincode: json['postal_code'] as String,
        isDefault: json['is_default'] as bool? ?? false,
        createdAt: DateTime.parse(json['created_at'] as String),
        updatedAt: json['updated_at'] != null 
            ? DateTime.parse(json['updated_at'] as String)
            : null,
      );
    } catch (e) {
      // print('Address.fromJson: Error parsing address: $e');
      // print('Address.fromJson: Failed JSON: $json');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'full_name': fullName,
      'phone_number': phoneNumber,
      'address_line_1': addressLine1,
      'address_line_2': addressLine2,
      'city': city,
      'state': state,
      'postal_code': pincode,
      'is_default': isDefault,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  String get formattedAddress {
    final line2 = addressLine2?.isNotEmpty == true ? '\n$addressLine2' : '';
    return '$addressLine1$line2\n$city, $state - $pincode';
  }

  String get shortAddress {
    return '$city, $state - $pincode';
  }

  Address copyWith({
    int? id,
    String? fullName,
    String? phoneNumber,
    String? addressLine1,
    String? addressLine2,
    String? city,
    String? state,
    String? pincode,
    bool? isDefault,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Address(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      addressLine1: addressLine1 ?? this.addressLine1,
      addressLine2: addressLine2 ?? this.addressLine2,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      isDefault: isDefault ?? this.isDefault,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Address &&
        other.id == id &&
        other.fullName == fullName &&
        other.phoneNumber == phoneNumber &&
        other.addressLine1 == addressLine1 &&
        other.addressLine2 == addressLine2 &&
        other.city == city &&
        other.state == state &&
        other.pincode == pincode &&
        other.isDefault == isDefault;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        fullName.hashCode ^
        phoneNumber.hashCode ^
        addressLine1.hashCode ^
        addressLine2.hashCode ^
        city.hashCode ^
        state.hashCode ^
        pincode.hashCode ^
        isDefault.hashCode;
  }

  @override
  String toString() {
    final line2 = addressLine2?.isNotEmpty == true ? '\n$addressLine2' : '';
    return '$addressLine1$line2\n$city, $state - $pincode';
  }
}

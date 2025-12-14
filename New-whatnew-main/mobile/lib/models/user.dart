class User {
  final String id;
  final String username;
  final String email;
  final String userType;
  final String firstName;
  final String lastName;
  final String? phoneNumber;
  final DateTime createdAt;
  final DateTime updatedAt;
  final BuyerProfile? buyerProfile;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.userType,
    required this.firstName,
    required this.lastName,
    this.phoneNumber,
    required this.createdAt,
    required this.updatedAt,
    this.buyerProfile,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      username: json['username']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      userType: json['user_type']?.toString() ?? '',
      firstName: json['first_name']?.toString() ?? '',
      lastName: json['last_name']?.toString() ?? '',
      phoneNumber: json['phone_number']?.toString() ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? json['date_joined']),
      updatedAt: DateTime.parse(json['updated_at'] ?? json['date_joined']),
      buyerProfile: json['buyer_profile'] != null
          ? BuyerProfile.fromJson(json['buyer_profile'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'user_type': userType,
      'first_name': firstName,
      'last_name': lastName,
      'phone_number': phoneNumber,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'buyer_profile': buyerProfile?.toJson(),
    };
  }

  String get fullName => '$firstName $lastName';
}

class BuyerProfile {
  final String id;
  final DateTime? dateOfBirth;
  final String? gender;
  final String? avatar;

  BuyerProfile({
    required this.id,
    this.dateOfBirth,
    this.gender,
    this.avatar,
  });

  factory BuyerProfile.fromJson(Map<String, dynamic> json) {
    return BuyerProfile(
      id: json['id']?.toString() ?? '',
      dateOfBirth: json['date_of_birth'] != null
          ? DateTime.parse(json['date_of_birth'])
          : null,
      gender: json['gender']?.toString(),
      avatar: json['avatar']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'gender': gender,
      'avatar': avatar,
    };
  }
}

class Address {
  final String? id;
  final String fullName;
  final String phoneNumber;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String state;
  final String pincode;
  final String? landmark;
  final String addressType;
  final bool isDefault;

  Address({
    this.id,
    required this.fullName,
    required this.phoneNumber,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.state,
    required this.pincode,
    this.landmark,
    required this.addressType,
    this.isDefault = false,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['id']?.toString(),
      fullName: json['full_name']?.toString() ?? '',
      phoneNumber: json['phone_number']?.toString() ?? '',
      addressLine1: json['address_line_1']?.toString() ?? '',
      addressLine2: json['address_line_2']?.toString(),
      city: json['city']?.toString() ?? '',
      state: json['state']?.toString() ?? '',
      pincode: json['pincode']?.toString() ?? json['postal_code']?.toString() ?? '', // Handle both field names
      landmark: json['landmark']?.toString(),
      addressType: json['address_type']?.toString() ?? '',
      isDefault: json['is_default'] ?? false,
    );
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
      'pincode': pincode,
      'landmark': landmark,
      'address_type': addressType,
      'is_default': isDefault,
    };
  }

  String get formattedAddress {
    final parts = <String>[
      addressLine1,
      if (addressLine2?.isNotEmpty == true) addressLine2!,
      if (landmark?.isNotEmpty == true) landmark!,
      city,
      state,
      pincode,
    ];
    return parts.join(', ');
  }
}

import '../utils/image_utils.dart';

class Product {
  final String id;
  final String name;
  final String? description;
  final double basePrice;
  final double? discountPrice;
  final int availableQuantity;
  final String status;
  final String categoryName;
  final String? sellerName;
  final DateTime? createdAt;
  final ProductImage? primaryImage;
  final List<ProductImage> images;

  Product({
    required this.id,
    required this.name,
    this.description,
    required this.basePrice,
    this.discountPrice,
    required this.availableQuantity,
    required this.status,
    required this.categoryName,
    this.sellerName,
    this.createdAt,
    this.primaryImage,
    this.images = const [],
  });

  // Getter for current price (discount price if available, otherwise base price)
  double get price => discountPrice ?? basePrice;
  
  bool get isActive => status == 'active';

  factory Product.fromJson(Map<String, dynamic> json) {
    // print('Parsing product JSON: $json');
    
    try {
      return Product(
        id: json['id']?.toString() ?? '',
        name: json['name']?.toString() ?? '',
        description: json['description']?.toString(),
        basePrice: _parseDouble(json['base_price']),
        discountPrice: json['discount_price'] != null 
            ? _parseDouble(json['discount_price']) 
            : null,
        availableQuantity: _parseInt(json['available_quantity']),
        status: json['status']?.toString() ?? 'inactive',
        categoryName: json['category_name']?.toString() ?? '',
        sellerName: json['seller_name']?.toString(),
        createdAt: json['created_at'] != null 
            ? DateTime.tryParse(json['created_at'].toString())
            : null,
        primaryImage: json['primary_image'] != null
            ? ProductImage.fromJson(json['primary_image'])
            : null,
        images: _parseImages(json['images']),
      );
    } catch (e) {
      // print('Error parsing product: $e');
      // print('Failed JSON: $json');
      rethrow;
    }
  }

  static double _parseDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  static int _parseInt(dynamic value) {
    // print('📦 Product._parseInt: parsing available_quantity: $value (type: ${value.runtimeType})');
    if (value == null) {
      // print('📦 Product._parseInt: value is null, returning 0');
      return 0;
    }
    if (value is int) {
      // print('📦 Product._parseInt: value is int: $value');
      return value;
    }
    if (value is double) {
      // print('📦 Product._parseInt: value is double: $value, converting to int: ${value.toInt()}');
      return value.toInt();
    }
    if (value is String) {
      final parsed = int.tryParse(value) ?? 0;
      // print('📦 Product._parseInt: value is string: "$value", parsed to: $parsed');
      return parsed;
    }
    // print('📦 Product._parseInt: unknown type ${value.runtimeType}, returning 0');
    return 0;
  }

  static List<ProductImage> _parseImages(dynamic value) {
    if (value == null) return [];
    if (value is! List) return [];
    
    return value
        .where((item) => item != null)
        .map((item) {
          try {
            return ProductImage.fromJson(item);
          } catch (e) {
            // print('Error parsing product image: $e');
            return null;
          }
        })
        .where((item) => item != null)
        .cast<ProductImage>()
        .toList();
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'base_price': basePrice,
      'discount_price': discountPrice,
      'available_quantity': availableQuantity,
      'status': status,
      'category_name': categoryName,
      'seller_name': sellerName,
      'created_at': createdAt?.toIso8601String(),
      'primary_image': primaryImage?.toJson(),
      'images': images.map((img) => img.toJson()).toList(),
    };
  }

  double get finalPrice => discountPrice ?? basePrice;
  
  double get discountPercentage {
    if (discountPrice == null) return 0;
    return ((basePrice - discountPrice!) / basePrice * 100);
  }

  bool get hasDiscount => discountPrice != null && discountPrice! < basePrice;
  
  bool get isInStock {
    // print('📦 Product ${name}: checking stock - availableQuantity: $availableQuantity');
    return availableQuantity > 0;
  }
  
  String get stockStatus {
    if (availableQuantity == 0) return 'Out of Stock';
    if (availableQuantity <= 5) return 'Limited Stock';
    return 'In Stock';
  }
}

class ProductImage {
  final String id;
  final String image;
  final int displayOrder;
  final bool isPrimary;

  ProductImage({
    required this.id,
    required this.image,
    required this.displayOrder,
    required this.isPrimary,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    // print('🖼️ Parsing ProductImage from JSON: $json');
    
    final image = ProductImage(
      id: json['id']?.toString() ?? '',
      image: json['image']?.toString() ?? '',
      displayOrder: _parseInt(json['display_order']),
      isPrimary: json['is_primary'] == true,
    );
    
    // print('🖼️ Created ProductImage: id=${image.id}, image=${image.image}, isPrimary=${image.isPrimary}');
    return image;
  }

  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'image': image,
      'display_order': displayOrder,
      'is_primary': isPrimary,
    };
  }

  String get fullImageUrl {
    final url = ImageUtils.getFullImageUrl(image);
    // print('🖼️ ProductImage fullImageUrl: $image -> $url');
    return url;
  }
}

class Category {
  final String id;
  final String name;
  final String? description;
  final String? image;
  final bool isActive;
  final String? parentId;

  Category({
    required this.id,
    required this.name,
    this.description,
    this.image,
    required this.isActive,
    this.parentId,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'].toString(),
      name: json['name'],
      description: json['description'],
      image: json['image'],
      isActive: json['is_active'] ?? true,
      parentId: json['parent']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image': image,
      'is_active': isActive,
      'parent': parentId,
    };
  }

  String get fullImageUrl {
    return ImageUtils.getFullImageUrl(image);
  }
}

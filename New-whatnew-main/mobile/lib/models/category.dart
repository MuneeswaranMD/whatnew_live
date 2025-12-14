class Category {
  final int id;
  final String name;
  final String description;
  final String? image;
  final bool isActive;
  final DateTime createdAt;

  Category({
    required this.id,
    required this.name,
    required this.description,
    this.image,
    required this.isActive,
    required this.createdAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    // print('Category.fromJson: Processing JSON: $json');
    
    try {
      return Category(
        id: json['id'] ?? 0,
        name: json['name'] ?? '',
        description: json['description'] ?? '',
        image: json['image'],
        isActive: json['is_active'] ?? true,
        createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      );
    } catch (e) {
      // print('Category.fromJson: Error parsing JSON: $e');
      // print('Category.fromJson: Problematic JSON: $json');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image': image,
      'is_active': isActive,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

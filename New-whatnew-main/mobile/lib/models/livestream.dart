import 'product.dart';
import 'category.dart' as category_model;

class SellerProfile {
  final String id;
  final String username;
  final String shopName;
  final String? shopAddress;
  final bool isVerified;
  final bool isActive;

  SellerProfile({
    required this.id,
    required this.username,
    required this.shopName,
    this.shopAddress,
    required this.isVerified,
    required this.isActive,
  });

  factory SellerProfile.fromJson(Map<String, dynamic> json) {
    return SellerProfile(
      id: json['id'].toString(),
      username: json['username'] ?? '',
      shopName: json['shop_name'] ?? '',
      shopAddress: json['shop_address'],
      isVerified: json['is_verified'] ?? false,
      isActive: json['is_active'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'shop_name': shopName,
      'shop_address': shopAddress,
      'is_verified': isVerified,
      'is_active': isActive,
    };
  }
}

class LiveStream {
  final String id;
  final String title;
  final String description;
  final String status;
  final DateTime? scheduledStartTime;
  final DateTime? actualStartTime;
  final DateTime? endTime;
  final int viewerCount;
  final int creditsConsumed;
  final String sellerName;
  final String categoryName;
  final category_model.Category category;
  final List<Product> products;
  final String agoraChannelName;
  final String? agoraToken;
  final String? thumbnail;
  final DateTime createdAt;
  final DateTime updatedAt;
  final SellerProfile seller; // Added seller property

  LiveStream({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    this.scheduledStartTime,
    this.actualStartTime,
    this.endTime,
    required this.viewerCount,
    required this.creditsConsumed,
    required this.sellerName,
    required this.categoryName,
    required this.category,
    required this.products,
    required this.agoraChannelName,
    this.agoraToken,
    this.thumbnail,
    required this.createdAt,
    required this.updatedAt,
    required this.seller, // Added seller to constructor
  });

  factory LiveStream.fromJson(Map<String, dynamic> json) {
    try {
      // print('LiveStream.fromJson: Processing JSON: $json');
      
      return LiveStream(
        id: json['id']?.toString() ?? '',
        title: json['title']?.toString() ?? '',
        description: json['description']?.toString() ?? '',
        status: json['status']?.toString() ?? 'scheduled',
        scheduledStartTime: json['scheduled_start_time'] != null
            ? DateTime.tryParse(json['scheduled_start_time'].toString())
            : null,
        actualStartTime: json['actual_start_time'] != null
            ? DateTime.tryParse(json['actual_start_time'].toString())
            : null,
        endTime: json['end_time'] != null
            ? DateTime.tryParse(json['end_time'].toString())
            : null,
        viewerCount: (json['viewer_count'] as num?)?.toInt() ?? 0,
        creditsConsumed: (json['credits_consumed'] as num?)?.toInt() ?? 0,
        sellerName: json['seller_name']?.toString() ?? '',
        categoryName: json['category_name']?.toString() ?? '',
        category: _parseCategory(json['category']),
        products: _parseProducts(json['products_data']),
        agoraChannelName: json['agora_channel_name']?.toString() ?? '',
        agoraToken: json['agora_token']?.toString(),
        thumbnail: json['thumbnail']?.toString(),
        createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
        updatedAt: DateTime.tryParse(json['updated_at']?.toString() ?? '') ?? DateTime.now(),
        seller: _parseSeller(json),
      );
    } catch (e) {
      // print('LiveStream.fromJson: Error parsing JSON: $e');
      // print('LiveStream.fromJson: Problematic JSON: $json');
      rethrow;
    }
  }

  static category_model.Category _parseCategory(dynamic categoryData) {
    try {
      // print('LiveStream._parseCategory: Processing category data: $categoryData');
      
      if (categoryData is Map<String, dynamic>) {
        return category_model.Category.fromJson(categoryData);
      } else if (categoryData is int) {
        // Category is just an ID, create a minimal category
        return category_model.Category(
          id: categoryData,
          name: 'Category $categoryData',
          description: '',
          isActive: true,
          createdAt: DateTime.now(),
        );
      } else {
        // print('LiveStream._parseCategory: Unknown category data format, creating default');
        return category_model.Category(
          id: 0, 
          name: 'Unknown', 
          description: '', 
          isActive: true, 
          createdAt: DateTime.now(),
        );
      }
    } catch (e) {
      // print('LiveStream._parseCategory: Error parsing category: $e, data: $categoryData');
      return category_model.Category(
        id: 0, 
        name: 'Unknown', 
        description: '', 
        isActive: true, 
        createdAt: DateTime.now(),
      );
    }
  }

  static List<Product> _parseProducts(dynamic productsData) {
    try {
      if (productsData is List) {
        return productsData
            .where((item) => item is Map<String, dynamic>)
            .map((product) => Product.fromJson(product as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      // print('LiveStream._parseProducts: Error parsing products: $e, data: $productsData');
      return [];
    }
  }

  static SellerProfile _parseSeller(Map<String, dynamic> json) {
    try {
      if (json['seller_profile'] != null && json['seller_profile'] is Map<String, dynamic>) {
        return SellerProfile.fromJson(json['seller_profile'] as Map<String, dynamic>);
      } else if (json['seller'] != null && json['seller'] is Map<String, dynamic>) {
        return SellerProfile.fromJson(json['seller'] as Map<String, dynamic>);
      } else {
        // Create a minimal seller profile from available data
        return SellerProfile(
          id: json['seller']?.toString() ?? '0',
          username: json['seller_name']?.toString() ?? 'Unknown Seller',
          shopName: json['seller_name']?.toString() ?? 'Unknown Shop',
          isVerified: false,
          isActive: false,
        );
      }
    } catch (e) {
      // print('LiveStream._parseSeller: Error parsing seller: $e, data: ${json['seller_profile'] ?? json['seller']}');
      return SellerProfile(
        id: '0',
        username: 'Unknown Seller',
        shopName: 'Unknown Shop',
        isVerified: false,
        isActive: false,
      );
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'status': status,
      'scheduled_start_time': scheduledStartTime?.toIso8601String(),
      'actual_start_time': actualStartTime?.toIso8601String(),
      'end_time': endTime?.toIso8601String(),
      'viewer_count': viewerCount,
      'credits_consumed': creditsConsumed,
      'seller_name': sellerName,
      'category_name': categoryName,
      'category': category.toJson(),
      'products_data': products.map((product) => product.toJson()).toList(),
      'agora_channel_name': agoraChannelName,
      'agora_token': agoraToken,
      'thumbnail': thumbnail,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'seller_profile': seller.toJson(), // Serialize seller profile
    };
  }

  bool get isLive => status == 'live';
  bool get isScheduled => status == 'scheduled';
  bool get isEnded => status == 'ended';
  bool get isCancelled => status == 'cancelled';

  String get statusDisplay {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'scheduled':
        return 'Scheduled';
      case 'ended':
        return 'Ended';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.toUpperCase();
    }
  }

  Duration? get duration {
    if (actualStartTime == null) return null;
    final endTime = this.endTime ?? DateTime.now();
    return endTime.difference(actualStartTime!);
  }

  String get formattedDuration {
    final dur = duration;
    if (dur == null) return '00:00';
    
    final hours = dur.inHours;
    final minutes = dur.inMinutes.remainder(60);
    
    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}h';
    } else {
      return '${minutes.toString().padLeft(2, '0')}m';
    }
  }
}

class ProductBidding {
  final String id;
  final Product product;
  final String livestreamId;
  final String livestreamTitle;
  final double startingPrice;
  final double? currentHighestBid;
  final int timerDuration;
  final String status;
  final DateTime? startedAt;
  final DateTime? endsAt;
  final DateTime? endedAt;
  final String? winnerId;
  final String? winnerName;
  final List<Bid> bids;

  ProductBidding({
    required this.id,
    required this.product,
    required this.livestreamId,
    required this.livestreamTitle,
    required this.startingPrice,
    this.currentHighestBid,
    required this.timerDuration,
    required this.status,
    this.startedAt,
    this.endsAt,
    this.endedAt,
    this.winnerId,
    this.winnerName,
    required this.bids,
  });

  factory ProductBidding.fromJson(Map<String, dynamic> json) {
    return ProductBidding(
      id: json['id'],
      product: Product.fromJson(json['product_data']),
      livestreamId: json['livestream'],
      livestreamTitle: json['livestream_title'] ?? '',
      startingPrice: double.parse(json['starting_price'].toString()),
      currentHighestBid: json['current_highest_bid'] != null
          ? double.parse(json['current_highest_bid'].toString())
          : null,
      timerDuration: json['timer_duration'],
      status: json['status'],
      startedAt: json['started_at'] != null
          ? DateTime.parse(json['started_at'])
          : null,
      endsAt: json['ends_at'] != null
          ? DateTime.parse(json['ends_at'])
          : null,
      endedAt: json['ended_at'] != null
          ? DateTime.parse(json['ended_at'])
          : null,
      winnerId: json['winner'],
      winnerName: json['winner_name'],
      bids: (json['bids'] as List<dynamic>?)
              ?.map((bid) => Bid.fromJson(bid))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product_data': product.toJson(),
      'livestream': livestreamId,
      'livestream_title': livestreamTitle,
      'starting_price': startingPrice,
      'current_highest_bid': currentHighestBid,
      'timer_duration': timerDuration,
      'status': status,
      'started_at': startedAt?.toIso8601String(),
      'ends_at': endsAt?.toIso8601String(),
      'ended_at': endedAt?.toIso8601String(),
      'winner': winnerId,
      'winner_name': winnerName,
      'bids': bids.map((bid) => bid.toJson()).toList(),
    };
  }

  bool get isActive => status == 'active';
  bool get isEnded => status == 'ended';
  bool get isPending => status == 'pending';

  double get nextBidAmount {
    final current = currentHighestBid ?? startingPrice;
    return current + 50; // ₹50 increment
  }

  int get timeRemaining {
    if (endsAt == null || !isActive) return 0;
    final now = DateTime.now();
    final remaining = endsAt!.difference(now).inSeconds;
    return remaining > 0 ? remaining : 0;
  }

  String get formattedTimeRemaining {
    final seconds = timeRemaining;
    if (seconds <= 0) return '00:00';
    
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}

class Bid {
  final String id;
  final double amount;
  final String bidderId;
  final String bidderName;
  final DateTime createdAt;
  final bool isWinning;

  Bid({
    required this.id,
    required this.amount,
    required this.bidderId,
    required this.bidderName,
    required this.createdAt,
    required this.isWinning,
  });

  factory Bid.fromJson(Map<String, dynamic> json) {
    return Bid(
      id: json['id'],
      amount: double.parse(json['amount'].toString()),
      bidderId: json['bidder'].toString(),
      bidderName: json['bidder_name'],
      createdAt: DateTime.parse(json['created_at']),
      isWinning: json['is_winning'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'bidder': bidderId,
      'bidder_name': bidderName,
      'created_at': createdAt.toIso8601String(),
      'is_winning': isWinning,
    };
  }
}

class ChatMessage {
  final String id;
  final String message;
  final String senderId;
  final String senderName;
  final String livestreamId;
  final DateTime timestamp;
  final bool isFromSeller;

  ChatMessage({
    required this.id,
    required this.message,
    required this.senderId,
    required this.senderName,
    required this.livestreamId,
    required this.timestamp,
    required this.isFromSeller,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'].toString(),
      message: json['message'],
      senderId: json['sender'].toString(),
      senderName: json['sender_name'],
      livestreamId: json['livestream'],
      timestamp: DateTime.parse(json['timestamp']),
      isFromSeller: json['is_from_seller'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'message': message,
      'sender': senderId,
      'sender_name': senderName,
      'livestream': livestreamId,
      'timestamp': timestamp.toIso8601String(),
      'is_from_seller': isFromSeller,
    };
  }
}

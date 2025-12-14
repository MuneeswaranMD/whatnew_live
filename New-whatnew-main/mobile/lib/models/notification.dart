class AppNotification {
  final String id;
  final String title;
  final String message;
  final String type;
  final Map<String, dynamic>? data;
  final bool isRead;
  final DateTime createdAt;
  final String? imageUrl;
  final String? actionUrl;

  AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    this.data,
    required this.isRead,
    required this.createdAt,
    this.imageUrl,
    this.actionUrl,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'].toString(),
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      type: json['type'] ?? 'info',
      data: json['data'],
      isRead: json['is_read'] ?? false,
      createdAt: DateTime.parse(json['created_at']),
      imageUrl: json['image_url'],
      actionUrl: json['action_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'data': data,
      'is_read': isRead,
      'created_at': createdAt.toIso8601String(),
      'image_url': imageUrl,
      'action_url': actionUrl,
    };
  }

  AppNotification copyWith({
    String? id,
    String? title,
    String? message,
    String? type,
    Map<String, dynamic>? data,
    bool? isRead,
    DateTime? createdAt,
    String? imageUrl,
    String? actionUrl,
  }) {
    return AppNotification(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      data: data ?? this.data,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
      imageUrl: imageUrl ?? this.imageUrl,
      actionUrl: actionUrl ?? this.actionUrl,
    );
  }

  // Helper methods for notification types
  bool get isOrderNotification => type == 'order';
  bool get isPaymentNotification => type == 'payment';
  bool get isReferralNotification => type == 'referral';
  bool get isSystemNotification => type == 'system';
  bool get isPromotionNotification => type == 'promotion';

  // Get icon based on notification type
  String get iconPath {
    switch (type) {
      case 'order':
        return 'assets/icons/order.png';
      case 'payment':
        return 'assets/icons/payment.png';
      case 'referral':
        return 'assets/icons/referral.png';
      case 'promotion':
        return 'assets/icons/promotion.png';
      case 'system':
        return 'assets/icons/system.png';
      default:
        return 'assets/icons/notification.png';
    }
  }

  // Get time ago string
  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(createdAt);

    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }
}

enum NotificationType {
  order,
  payment,
  referral,
  system,
  promotion,
}

extension NotificationTypeExtension on NotificationType {
  String get value {
    switch (this) {
      case NotificationType.order:
        return 'order';
      case NotificationType.payment:
        return 'payment';
      case NotificationType.referral:
        return 'referral';
      case NotificationType.system:
        return 'system';
      case NotificationType.promotion:
        return 'promotion';
    }
  }
}

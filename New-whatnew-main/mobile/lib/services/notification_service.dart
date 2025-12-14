import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/notification.dart';
import 'api_service.dart';
import 'storage_service.dart';

class NotificationService extends ChangeNotifier {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  List<AppNotification> _notifications = [];
  bool _isLoading = false;
  String? _error;
  int _unreadCount = 0;

  // Getters
  List<AppNotification> get notifications => _notifications;
  List<AppNotification> get unreadNotifications => 
      _notifications.where((n) => !n.isRead).toList();
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get unreadCount => _unreadCount;

  // Initialize service
  Future<void> initialize() async {
    await loadNotifications();
    await _loadCachedNotifications();
  }

  // Load notifications from API
  Future<void> loadNotifications() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final response = await ApiService.getNotifications();
      
      if (response['results'] != null) {
        _notifications = (response['results'] as List)
            .map((json) => AppNotification.fromJson(json))
            .toList();
        
        _updateUnreadCount();
        await _cacheNotifications();
      }
    } catch (e) {
      _error = e.toString();
      debugPrint('Error loading notifications: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Mark notification as read
  Future<void> markAsRead(String notificationId) async {
    try {
      await ApiService.markNotificationAsRead(notificationId);
      
      final index = _notifications.indexWhere((n) => n.id == notificationId);
      if (index != -1) {
        _notifications[index] = _notifications[index].copyWith(isRead: true);
        _updateUnreadCount();
        await _cacheNotifications();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error marking notification as read: $e');
    }
  }

  // Mark all notifications as read
  Future<void> markAllAsRead() async {
    try {
      await ApiService.markAllNotificationsAsRead();
      
      _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
      _updateUnreadCount();
      await _cacheNotifications();
      notifyListeners();
    } catch (e) {
      debugPrint('Error marking all notifications as read: $e');
    }
  }

  // Delete notification
  Future<void> deleteNotification(String notificationId) async {
    try {
      await ApiService.deleteNotification(notificationId);
      
      _notifications.removeWhere((n) => n.id == notificationId);
      _updateUnreadCount();
      await _cacheNotifications();
      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting notification: $e');
    }
  }

  // Clear all notifications
  Future<void> clearAllNotifications() async {
    try {
      await ApiService.clearAllNotifications();
      
      _notifications.clear();
      _updateUnreadCount();
      await _cacheNotifications();
      notifyListeners();
    } catch (e) {
      debugPrint('Error clearing all notifications: $e');
    }
  }

  // Add new notification (for real-time updates)
  void addNotification(AppNotification notification) {
    _notifications.insert(0, notification);
    _updateUnreadCount();
    _cacheNotifications();
    notifyListeners();
  }

  // Get notifications by type
  List<AppNotification> getNotificationsByType(String type) {
    return _notifications.where((n) => n.type == type).toList();
  }

  // Get recent notifications (last 24 hours)
  List<AppNotification> getRecentNotifications() {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return _notifications.where((n) => n.createdAt.isAfter(yesterday)).toList();
  }

  // Private methods
  void _updateUnreadCount() {
    _unreadCount = _notifications.where((n) => !n.isRead).length;
  }

  Future<void> _cacheNotifications() async {
    try {
      final notificationsJson = _notifications.map((n) => n.toJson()).toList();
      await StorageService.setString('cached_notifications', jsonEncode(notificationsJson));
    } catch (e) {
      debugPrint('Error caching notifications: $e');
    }
  }

  Future<void> _loadCachedNotifications() async {
    try {
      final cachedData = StorageService.getString('cached_notifications');
      if (cachedData != null) {
        final List<dynamic> notificationsJson = jsonDecode(cachedData);
        _notifications = notificationsJson
            .map((json) => AppNotification.fromJson(json))
            .toList();
        _updateUnreadCount();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading cached notifications: $e');
    }
  }

  // Refresh notifications
  Future<void> refresh() async {
    await loadNotifications();
  }

  // Create local notification for testing
  void createTestNotification({
    required String title,
    required String message,
    required String type,
    Map<String, dynamic>? data,
  }) {
    final notification = AppNotification(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      message: message,
      type: type,
      data: data,
      isRead: false,
      createdAt: DateTime.now(),
    );
    
    addNotification(notification);
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/app_theme.dart';
import '../../services/notification_service.dart';
import '../../models/notification.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NotificationService>(context, listen: false).loadNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppColors.primaryColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          Consumer<NotificationService>(
            builder: (context, notificationService, child) {
              if (notificationService.notifications.isEmpty) return const SizedBox();
              
              return PopupMenuButton<String>(
                onSelected: (value) async {
                  switch (value) {
                    case 'mark_all_read':
                      await notificationService.markAllAsRead();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('All notifications marked as read')),
                      );
                      break;
                    case 'clear_all':
                      await _showClearAllDialog(context, notificationService);
                      break;
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'mark_all_read',
                    child: Row(
                      children: [
                        Icon(Icons.mark_email_read),
                        SizedBox(width: 8),
                        Text('Mark All Read'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'clear_all',
                    child: Row(
                      children: [
                        Icon(Icons.clear_all),
                        SizedBox(width: 8),
                        Text('Clear All'),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
      body: Consumer<NotificationService>(
        builder: (context, notificationService, child) {
          if (notificationService.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (notificationService.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.textSecondaryColor.withOpacity(0.5),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading notifications',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondaryColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    notificationService.error!,
                    style: TextStyle(
                      color: AppColors.textSecondaryColor.withOpacity(0.7),
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => notificationService.loadNotifications(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (notificationService.notifications.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.notifications_outlined,
                      size: 64,
                      color: AppColors.textSecondaryColor.withOpacity(0.5),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No Notifications',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondaryColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'You\'re all caught up! Check back later for updates.',
                      style: TextStyle(
                        color: AppColors.textSecondaryColor.withOpacity(0.7),
                        fontSize: 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => notificationService.refresh(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notificationService.notifications.length,
              itemBuilder: (context, index) {
                final notification = notificationService.notifications[index];
                return _NotificationCard(
                  notification: notification,
                  onTap: () => _handleNotificationTap(notification),
                  onMarkAsRead: () => notificationService.markAsRead(notification.id),
                  onDelete: () => _showDeleteDialog(context, notification, notificationService),
                );
              },
            ),
          );
        },
      ),
    );
  }

  Future<void> _showClearAllDialog(BuildContext context, NotificationService service) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Notifications'),
        content: const Text('Are you sure you want to clear all notifications? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Clear All'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await service.clearAllNotifications();
    }
  }

  Future<void> _showDeleteDialog(BuildContext context, AppNotification notification, NotificationService service) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Notification'),
        content: const Text('Are you sure you want to delete this notification?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await service.deleteNotification(notification.id);
    }
  }

  void _handleNotificationTap(AppNotification notification) {
    // Mark as read if not already read
    if (!notification.isRead) {
      Provider.of<NotificationService>(context, listen: false).markAsRead(notification.id);
    }

    // Handle action URL if present
    if (notification.actionUrl != null) {
      _navigateToActionUrl(context, notification.actionUrl!);
    } else {
      // Default handling based on type
      _handleNotificationByType(notification);
    }
  }

  void _navigateToActionUrl(BuildContext context, String actionUrl) {
    final uri = Uri.parse(actionUrl);
    
    switch (uri.path) {
      case '/orders':
        Navigator.pushNamed(context, '/orders');
        break;
      case '/wallet':
        Navigator.pushNamed(context, '/wallet');
        break;
      case '/referrals':
        Navigator.pushNamed(context, '/refer-earn');
        break;
      case '/profile':
        Navigator.pushNamed(context, '/profile');
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notification opened')),
        );
        break;
    }
  }

  void _handleNotificationByType(AppNotification notification) {
    switch (notification.type) {
      case 'order':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Opening order details...')),
        );
        break;
      case 'payment':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Opening payment details...')),
        );
        break;
      case 'referral':
        Navigator.pushNamed(context, '/refer-earn');
        break;
      case 'promotion':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Opening promotion details...')),
        );
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notification opened')),
        );
    }
  }
}

class _NotificationCard extends StatelessWidget {
  final AppNotification notification;
  final VoidCallback onTap;
  final VoidCallback? onMarkAsRead;
  final VoidCallback? onDelete;

  const _NotificationCard({
    required this.notification,
    required this.onTap,
    this.onMarkAsRead,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: notification.isRead ? Colors.white : AppColors.primaryColor.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: notification.isRead ? AppColors.borderColor : AppColors.primaryColor.withOpacity(0.2),
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _getTypeColor().withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(
                  _getTypeIcon(),
                  color: _getTypeColor(),
                  size: 20,
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notification.title,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: notification.isRead ? FontWeight.w500 : FontWeight.w600,
                              color: AppColors.textPrimaryColor,
                            ),
                          ),
                        ),
                        if (!notification.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primaryColor,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    
                    const SizedBox(height: 4),
                    
                    Text(
                      notification.message,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondaryColor,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    
                    const SizedBox(height: 6),
                    
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notification.timeAgo,
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondaryColor.withOpacity(0.7),
                            ),
                          ),
                        ),
                        Row(
                          children: [
                            if (!notification.isRead && onMarkAsRead != null)
                              IconButton(
                                onPressed: onMarkAsRead,
                                icon: const Icon(Icons.mark_email_read),
                                iconSize: 18,
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            if (onDelete != null) ...[
                              const SizedBox(width: 8),
                              IconButton(
                                onPressed: onDelete,
                                icon: const Icon(Icons.delete_outline),
                                iconSize: 18,
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getTypeIcon() {
    switch (notification.type) {
      case 'order':
        return Icons.shopping_bag_outlined;
      case 'payment':
        return Icons.payment;
      case 'referral':
        return Icons.people_outline;
      case 'promotion':
        return Icons.local_offer_outlined;
      case 'system':
        return Icons.info_outline;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _getTypeColor() {
    switch (notification.type) {
      case 'order':
        return Colors.green;
      case 'payment':
        return Colors.blue;
      case 'referral':
        return Colors.purple;
      case 'promotion':
        return Colors.orange;
      case 'system':
        return Colors.grey;
      default:
        return AppColors.primaryColor;
    }
  }
}

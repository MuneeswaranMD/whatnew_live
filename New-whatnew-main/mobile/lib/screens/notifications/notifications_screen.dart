import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/notification.dart';
import '../../services/notification_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
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
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Consumer<NotificationService>(
            builder: (context, notificationService, child) {
              if (notificationService.notifications.isEmpty) return const SizedBox();
              
              return PopupMenuButton<String>(
                onSelected: (value) async {
                  switch (value) {
                    case 'mark_all_read':
                      await notificationService.markAllAsRead();
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
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading notifications',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    notificationService.error!,
                    style: Theme.of(context).textTheme.bodySmall,
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
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.notifications_none,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No notifications yet',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'You\'ll see your notifications here',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
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
                return NotificationCard(
                  notification: notification,
                  onTap: () => _handleNotificationTap(context, notification),
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

  void _handleNotificationTap(BuildContext context, AppNotification notification) {
    // Mark as read if not already read
    if (!notification.isRead) {
      Provider.of<NotificationService>(context, listen: false).markAsRead(notification.id);
    }

    // Handle action URL if present
    if (notification.actionUrl != null) {
      // Navigate to specific screen based on action URL
      _navigateToActionUrl(context, notification.actionUrl!);
    }
  }

  void _navigateToActionUrl(BuildContext context, String actionUrl) {
    // Parse action URL and navigate accordingly
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
        // Default navigation or show details
        break;
    }
  }
}

class NotificationCard extends StatelessWidget {
  final AppNotification notification;
  final VoidCallback? onTap;
  final VoidCallback? onMarkAsRead;
  final VoidCallback? onDelete;

  const NotificationCard({
    super.key,
    required this.notification,
    this.onTap,
    this.onMarkAsRead,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: notification.isRead ? 1 : 3,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Notification icon
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
              
              // Notification content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            notification.title,
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: notification.isRead ? FontWeight.normal : FontWeight.bold,
                            ),
                          ),
                        ),
                        if (!notification.isRead)
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.blue,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notification.message,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: notification.isRead ? Colors.grey[600] : Colors.black87,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          notification.timeAgo,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[500],
                            fontSize: 12,
                          ),
                        ),
                        const Spacer(),
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
        return Colors.blue;
    }
  }
}

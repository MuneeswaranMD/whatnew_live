import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/notification_service.dart';
import '../screens/notifications/notifications_screen.dart';

class NotificationBadge extends StatelessWidget {
  final Color? iconColor;
  final double? iconSize;

  const NotificationBadge({
    super.key,
    this.iconColor,
    this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationService>(
      builder: (context, notificationService, child) {
        return Stack(
          children: [
            IconButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const NotificationsScreen(),
                  ),
                );
              },
              icon: Icon(
                Icons.notifications_outlined,
                color: iconColor ?? Theme.of(context).iconTheme.color,
                size: iconSize ?? 24,
              ),
            ),
            if (notificationService.unreadCount > 0)
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 16,
                    minHeight: 16,
                  ),
                  child: Text(
                    notificationService.unreadCount > 99 
                        ? '99+' 
                        : notificationService.unreadCount.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

class NotificationDot extends StatelessWidget {
  final Widget child;
  final bool showDot;
  final Color dotColor;
  final double dotSize;

  const NotificationDot({
    super.key,
    required this.child,
    this.showDot = false,
    this.dotColor = Colors.red,
    this.dotSize = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (showDot)
          Positioned(
            right: 0,
            top: 0,
            child: Container(
              width: dotSize,
              height: dotSize,
              decoration: BoxDecoration(
                color: dotColor,
                shape: BoxShape.circle,
                border: Border.all(
                  color: Colors.white,
                  width: 1,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class NotificationBottomNavDot extends StatelessWidget {
  final Widget child;

  const NotificationBottomNavDot({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationService>(
      builder: (context, notificationService, _) {
        return NotificationDot(
          showDot: notificationService.unreadCount > 0,
          child: child,
        );
      },
    );
  }
}

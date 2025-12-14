import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/order.dart';
import '../../core/theme/app_colors.dart';
import '../../providers/order_provider.dart';
import 'order_detail_screen.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({Key? key}) : super(key: key);

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<OrderProvider>(context, listen: false);
      provider.getOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: Text(
          'My Orders',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            color: AppColors.pureWhite,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 0,
        centerTitle: true,
      ),
      body: Consumer<OrderProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.crimsonRed),
              ),
            );
          }

          if (provider.error != null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Something went wrong',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: AppColors.lightTextPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      provider.error!,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.lightTextSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => provider.getOrders(),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Try Again'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.crimsonRed,
                        foregroundColor: AppColors.pureWhite,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          if (provider.orders.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.offWhite,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.shopping_bag_outlined,
                        size: 64,
                        color: AppColors.slateGray,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No orders yet',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: AppColors.lightTextPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Your orders will appear here once you make your first purchase',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.lightTextSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil(
                        '/home',
                        (route) => false,
                      ),
                      icon: const Icon(Icons.shopping_cart),
                      label: const Text('Start Shopping'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.crimsonRed,
                        foregroundColor: AppColors.pureWhite,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            color: AppColors.crimsonRed,
            backgroundColor: AppColors.pureWhite,
            onRefresh: () async {
              await provider.getOrders();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.orders.length,
              itemBuilder: (context, index) {
                final order = provider.orders[index];
                return OrderCard(order: order);
              },
            ),
          );
        },
      ),
    );
  }
}

class OrderCard extends StatelessWidget {
  final Order order;

  const OrderCard({Key? key, required this.order}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 2,
        shadowColor: AppColors.shadowLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => OrderDetailScreen(order: order),
              ),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.pureWhite,
                  AppColors.offWhite.withOpacity(0.3),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Order header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Order #${order.orderNumber}',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: AppColors.lightTextPrimary,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: _getPaymentStatusColor(order.paymentStatus).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _getPaymentStatusColor(order.paymentStatus),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.payment,
                                  size: 14,
                                  color: _getPaymentStatusColor(order.paymentStatus),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  _getPaymentStatusText(order.paymentStatus),
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: _getPaymentStatusColor(order.paymentStatus),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            _getStatusColor(order.status),
                            _getStatusColor(order.status).withOpacity(0.8),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: _getStatusColor(order.status).withOpacity(0.3),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Text(
                        _getStatusText(order.status),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.pureWhite,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Order items summary
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.offWhite,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.shopping_basket_outlined,
                        size: 20,
                        color: AppColors.slateGray,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${order.items.length} item${order.items.length > 1 ? 's' : ''}',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.lightTextSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Spacer(),
                      // Total amount
                      Text(
                        '₹${order.totalAmount.toStringAsFixed(2)}',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.crimsonRed,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                
                // Order date and delivery info
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Icon(
                            Icons.calendar_today_outlined,
                            size: 16,
                            color: AppColors.slateGray,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _formatDate(order.createdAt),
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.lightTextSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 16,
                            color: AppColors.slateGray,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              '${order.shippingAddress['city'] ?? ''}, ${order.shippingAddress['state'] ?? ''}',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.lightTextSecondary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 12),
                
                // Action buttons row
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => OrderDetailScreen(order: order),
                            ),
                          );
                        },
                        icon: const Icon(Icons.visibility_outlined, size: 16),
                        label: const Text('View Details'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.crimsonRed,
                          side: BorderSide(color: AppColors.crimsonRed),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                    // if (order.status.toLowerCase() == 'delivered') ...[
                    //   const SizedBox(width: 12),
                    //   Expanded(
                    //     child: ElevatedButton.icon(
                    //       onPressed: () {
                    //         // TODO: Implement reorder functionality
                    //       },
                    //       icon: const Icon(Icons.refresh, size: 16),
                    //       label: const Text('Reorder'),
                    //       style: ElevatedButton.styleFrom(
                    //         backgroundColor: AppColors.emeraldGreen,
                    //         foregroundColor: AppColors.pureWhite,
                    //         shape: RoundedRectangleBorder(
                    //           borderRadius: BorderRadius.circular(8),
                    //         ),
                    //       ),
                    //     ),
                    //   ),
                    // ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return AppColors.amberYellow;
      case 'confirmed':
        return AppColors.skyBlue;
      case 'shipped':
        return AppColors.vibrantPurple;
      case 'delivered':
        return AppColors.emeraldGreen;
      case 'cancelled':
        return AppColors.error;
      default:
        return AppColors.slateGray;
    }
  }

  String _getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.toUpperCase();
    }
  }

  Color _getPaymentStatusColor(String paymentStatus) {
    switch (paymentStatus.toLowerCase()) {
      case 'completed':
        return AppColors.emeraldGreen;
      case 'pending':
        return AppColors.amberYellow;
      case 'failed':
        return AppColors.error;
      case 'refunded':
        return AppColors.skyBlue;
      default:
        return AppColors.slateGray;
    }
  }

  String _getPaymentStatusText(String paymentStatus) {
    switch (paymentStatus.toLowerCase()) {
      case 'completed':
        return 'Paid';
      case 'pending':
        return 'Payment Pending';
      case 'failed':
        return 'Payment Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return paymentStatus.toUpperCase();
    }
  }

  String _formatDate(dynamic dateTime) {
    if (dateTime == null) return 'Unknown';
    try {
      final dt = dateTime is DateTime ? dateTime : DateTime.parse(dateTime.toString());
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (e) {
      return 'Unknown';
    }
  }
}

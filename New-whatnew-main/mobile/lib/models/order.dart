class Order {
  final String id;
  final String orderNumber;
  final String status;
  final String paymentStatus;
  final List<OrderItem> items;
  final double subtotal;
  final double shippingFee;
  final double taxAmount;
  final double totalAmount;
  final Map<String, dynamic> shippingAddress;
  final DateTime createdAt;
  final DateTime? confirmedAt;
  final DateTime? shippedAt;
  final DateTime? deliveredAt;
  final String? customerNotes;
  final String? sellerNotes;
  final List<OrderTracking>? tracking;

  Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.paymentStatus,
    required this.items,
    required this.subtotal,
    required this.shippingFee,
    required this.taxAmount,
    required this.totalAmount,
    required this.shippingAddress,
    required this.createdAt,
    this.confirmedAt,
    this.shippedAt,
    this.deliveredAt,
    this.customerNotes,
    this.sellerNotes,
    this.tracking,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    try {
      // print('Order.fromJson: Parsing order with keys: ${json.keys.toList()}');
      
      // Parse items array with detailed error handling
      List<OrderItem> orderItems = [];
      if (json['items'] is List) {
        final itemsList = json['items'] as List<dynamic>;
        // print('Order.fromJson: Found ${itemsList.length} items');
        
        for (int i = 0; i < itemsList.length; i++) {
          try {
            final item = itemsList[i];
            // print('Order.fromJson: Parsing item $i: ${item.runtimeType}');
            if (item is Map<String, dynamic>) {
              orderItems.add(OrderItem.fromJson(item));
            } else {
              // print('Order.fromJson: Item $i is not a Map: $item');
            }
          } catch (e) {
            // print('Order.fromJson: Error parsing item $i: $e');
          }
        }
      }
      
      // Debug each field individually
      // print('Order.fromJson: Parsing id...');
      final orderId = json['id'].toString();
      
      // print('Order.fromJson: Parsing orderNumber...');
      final orderNumber = json['order_number'] ?? '';
      
      // print('Order.fromJson: Parsing status...');
      final status = json['status'] ?? 'pending';
      
      // print('Order.fromJson: Parsing payment_status...');
      final paymentStatus = json['payment_status'] ?? 'pending';
      
      // print('Order.fromJson: Parsing numeric fields...');
      final subtotal = double.tryParse(json['subtotal']?.toString() ?? '0') ?? 0.0;
      final shippingFee = double.tryParse(json['shipping_fee']?.toString() ?? '0') ?? 0.0;
      final taxAmount = double.tryParse(json['tax_amount']?.toString() ?? '0') ?? 0.0;
      final totalAmount = double.tryParse(json['total_amount']?.toString() ?? '0') ?? 0.0;
      
      // print('Order.fromJson: Parsing shippingAddress...');
      // print('Order.fromJson: shippingAddress type: ${json['shipping_address'].runtimeType}');
      final shippingAddress = json['shipping_address'] is Map<String, dynamic> 
          ? json['shipping_address'] as Map<String, dynamic>
          : <String, dynamic>{};
      
      // print('Order.fromJson: Parsing dates...');
      final createdAt = DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now();
      final confirmedAt = json['confirmed_at'] != null 
          ? DateTime.tryParse(json['confirmed_at']) 
          : null;
      final shippedAt = json['shipped_at'] != null 
          ? DateTime.tryParse(json['shipped_at']) 
          : null;
      final deliveredAt = json['delivered_at'] != null 
          ? DateTime.tryParse(json['delivered_at']) 
          : null;
      
      // print('Order.fromJson: Parsing notes...');
      final customerNotes = json['customer_notes']?.toString();
      final sellerNotes = json['seller_notes']?.toString();
      
      // print('Order.fromJson: Parsing tracking...');
      // print('Order.fromJson: tracking type: ${json['tracking']?.runtimeType}');
      List<OrderTracking>? tracking;
      if (json['tracking'] is List<dynamic>) {
        final trackingList = json['tracking'] as List<dynamic>;
        // print('Order.fromJson: tracking list length: ${trackingList.length}');
        
        List<OrderTracking> trackingItems = [];
        for (int i = 0; i < trackingList.length; i++) {
          try {
            final trackItem = trackingList[i];
            // print('Order.fromJson: tracking item $i type: ${trackItem.runtimeType}');
            // print('Order.fromJson: tracking item $i content: $trackItem');
            
            if (trackItem is Map<String, dynamic>) {
              final trackingObj = OrderTracking.fromJson(trackItem);
              trackingItems.add(trackingObj);
              // print('Order.fromJson: tracking item $i parsed successfully');
            } else {
              // print('Order.fromJson: tracking item $i is not a Map, skipping');
            }
          } catch (e) {
            // print('Order.fromJson: Error parsing tracking item $i: $e');
          }
        }
        tracking = trackingItems.isNotEmpty ? trackingItems : null;
      } else {
        tracking = null;
        // print('Order.fromJson: tracking is not a List, setting to null');
      }
      
      // print('Order.fromJson: Creating Order object...');
      return Order(
        id: orderId,
        orderNumber: orderNumber,
        status: status,
        paymentStatus: paymentStatus,
        items: orderItems,
        subtotal: subtotal,
        shippingFee: shippingFee,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        createdAt: createdAt,
        confirmedAt: confirmedAt,
        shippedAt: shippedAt,
        deliveredAt: deliveredAt,
        customerNotes: customerNotes,
        sellerNotes: sellerNotes,
        tracking: tracking,
      );
    } catch (e) {
      // print('Order.fromJson: Error parsing order: $e');
      // print('Order.fromJson: JSON data keys: ${json.keys.toList()}');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_number': orderNumber,
      'status': status,
      'payment_status': paymentStatus,
      'items': items.map((item) => item.toJson()).toList(),
      'subtotal': subtotal.toString(),
      'shipping_fee': shippingFee.toString(),
      'tax_amount': taxAmount.toString(),
      'total_amount': totalAmount.toString(),
      'shipping_address': shippingAddress,
      'created_at': createdAt.toIso8601String(),
      'confirmed_at': confirmedAt?.toIso8601String(),
      'shipped_at': shippedAt?.toIso8601String(),
      'delivered_at': deliveredAt?.toIso8601String(),
      'customer_notes': customerNotes,
      'seller_notes': sellerNotes,
      'tracking': tracking?.map((track) => track.toJson()).toList(),
    };
  }

  String get statusDisplayText {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  }

  String get paymentStatusDisplayText {
    switch (paymentStatus.toLowerCase()) {
      case 'pending':
        return 'Payment Pending';
      case 'completed':
        return 'Payment Completed';
      case 'failed':
        return 'Payment Failed';
      case 'refunded':
        return 'Payment Refunded';
      default:
        return paymentStatus;
    }
  }

  bool get isPaid {
    return paymentStatus.toLowerCase() == 'completed';
  }
}

class OrderItem {
  final String id;
  final Map<String, dynamic> product;
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final String productName;
  final String? productDescription;
  final Map<String, dynamic>? seller;
  final Map<String, dynamic>? bidding;

  OrderItem({
    required this.id,
    required this.product,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.productName,
    this.productDescription,
    this.seller,
    this.bidding,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    try {
      // print('OrderItem.fromJson: Parsing item with keys: ${json.keys.toList()}');
      
      // Handle product field - prioritize product_data over product
      Map<String, dynamic> productData;
      if (json['product_data'] is Map<String, dynamic>) {
        productData = json['product_data'];
        // print('OrderItem.fromJson: Using product_data');
      } else if (json['product'] is Map<String, dynamic>) {
        productData = json['product'];
        // print('OrderItem.fromJson: Using product as Map');
      } else {
        productData = {
          'id': json['product']?.toString() ?? '', 
          'name': json['product_name'] ?? ''
        };
        // print('OrderItem.fromJson: Created product data from string: ${json['product']}');
      }
      
      // Handle seller field - expect Map from backend
      Map<String, dynamic>? sellerData;
      if (json['seller'] is Map<String, dynamic>) {
        sellerData = json['seller'];
        // print('OrderItem.fromJson: Seller is Map');
      } else {
        // Fallback if still string (shouldn't happen with new backend)
        sellerData = null;
        // print('OrderItem.fromJson: Seller is not Map: ${json['seller']}');
      }
      
      // Handle bidding field - only bidding_data should be present now
      Map<String, dynamic>? biddingData;
      if (json['bidding_data'] is Map<String, dynamic>) {
        biddingData = json['bidding_data'];
        // print('OrderItem.fromJson: Using bidding_data');
      } else {
        biddingData = null;
        // print('OrderItem.fromJson: bidding_data is null or not Map');
      }
      
      return OrderItem(
        id: json['id'].toString(),
        product: productData,
        quantity: int.tryParse(json['quantity']?.toString() ?? '1') ?? 1,
        unitPrice: double.tryParse(json['unit_price']?.toString() ?? '0') ?? 0.0,
        totalPrice: double.tryParse(json['total_price']?.toString() ?? '0') ?? 0.0,
        productName: json['product_name'] ?? '',
        productDescription: json['product_description'],
        seller: sellerData,
        bidding: biddingData,
      );
    } catch (e) {
      // print('OrderItem.fromJson: Error parsing item: $e');
      // print('OrderItem.fromJson: JSON data: $json');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product': product,
      'quantity': quantity,
      'unit_price': unitPrice.toString(),
      'total_price': totalPrice.toString(),
      'product_name': productName,
      'product_description': productDescription,
      'seller': seller,
      'bidding': bidding,
    };
  }
}

class OrderTracking {
  final String id;
  final String status;
  final String? notes;
  final DateTime createdAt;
  final Map<String, dynamic>? createdBy;

  OrderTracking({
    required this.id,
    required this.status,
    this.notes,
    required this.createdAt,
    this.createdBy,
  });

  factory OrderTracking.fromJson(Map<String, dynamic> json) {
    return OrderTracking(
      id: json['id'].toString(),
      status: json['status'] ?? '',
      notes: json['notes'],
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      createdBy: json['created_by'] is Map<String, dynamic> 
          ? json['created_by'] 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'status': status,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
      'created_by': createdBy,
    };
  }

  String get statusDisplayText {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  }
}

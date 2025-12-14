from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, OrderTracking
from products.serializers import ProductListSerializer
from accounts.serializers import AddressSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_data = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()
    
    # Ensure proper type conversion for prices
    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_data', 'bidding', 'quantity', 'price', 
                 'total_price', 'added_at']
        read_only_fields = ['id', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_amount', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    bidding_id = serializers.UUIDField(required=False)
    quantity = serializers.IntegerField(default=1, min_value=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

class OrderItemSerializer(serializers.ModelSerializer):
    product_data = ProductListSerializer(source='product', read_only=True)
    seller = serializers.SerializerMethodField()
    bidding_data = serializers.SerializerMethodField()
    
    # Ensure proper type conversion for prices
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    
    def get_seller(self, obj):
        return {
            'id': str(obj.seller.id),
            'username': obj.seller.username,
            'email': obj.seller.email,
        }
    
    def get_bidding_data(self, obj):
        if obj.bidding:
            return {
                'id': str(obj.bidding.id),
                'starting_price': str(obj.bidding.starting_price),
                'current_highest_bid': str(obj.bidding.current_highest_bid) if obj.bidding.current_highest_bid else None,
                'status': obj.bidding.status,
            }
        return None
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_data', 'seller', 'bidding_data', 'quantity', 
                 'unit_price', 'total_price', 'product_name', 'product_description']

class OrderTrackingSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    
    def get_created_by(self, obj):
        return {
            'id': str(obj.created_by.id),
            'username': obj.created_by.username,
        }
    
    class Meta:
        model = OrderTracking
        fields = ['id', 'status', 'notes', 'tracking_id', 'courier_name', 'created_at', 'created_by']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    tracking = OrderTrackingSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    # Ensure proper type conversion for numbers
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    shipping_fee = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    
    # Ensure user ID is serialized as string
    user = serializers.CharField(source='user.id', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'user_name', 'status', 'payment_status', 'shipping_address', 
                 'subtotal', 'shipping_fee', 'tax_amount', 'total_amount', 'items', 'tracking',
                 'created_at', 'updated_at', 'confirmed_at', 'shipped_at', 'delivered_at',
                 'customer_notes', 'seller_notes']
        read_only_fields = ['id', 'order_number', 'user', 'created_at', 'updated_at', 
                           'confirmed_at', 'shipped_at', 'delivered_at']

class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    customer_notes = serializers.CharField(required=False, allow_blank=True)

class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
    tracking_id = serializers.CharField(required=False, allow_blank=True)
    courier_name = serializers.CharField(required=False, allow_blank=True)

class SellerOrderSerializer(serializers.ModelSerializer):
    """Specialized serializer for seller order views with buyer information"""
    items = OrderItemSerializer(many=True, read_only=True)
    tracking = OrderTrackingSerializer(many=True, read_only=True)
    
    # Buyer information
    buyer_name = serializers.SerializerMethodField()
    buyer_email = serializers.CharField(source='user.email', read_only=True)
    buyer_phone = serializers.SerializerMethodField()
    
    # Ensure proper type conversion for numbers
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    shipping_fee = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    
    # Delivery address
    delivery_address = serializers.SerializerMethodField()
    
    def get_buyer_name(self, obj):
        user = obj.user
        return f"{user.first_name} {user.last_name}".strip() or user.username
    
    def get_buyer_phone(self, obj):
        return getattr(obj.user, 'phone_number', None)
    
    def get_delivery_address(self, obj):
        """Format shipping address for display"""
        if obj.shipping_address:
            return obj.shipping_address
        return None
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'buyer_name', 'buyer_email', 'buyer_phone', 
                 'status', 'payment_status', 'delivery_address', 'subtotal', 'shipping_fee', 
                 'tax_amount', 'total_amount', 'items', 'tracking', 'created_at', 'updated_at', 
                 'confirmed_at', 'shipped_at', 'delivered_at', 'customer_notes', 'seller_notes']
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at', 
                           'confirmed_at', 'shipped_at', 'delivered_at']

from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, OrderTracking

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_items', 'total_amount', 'updated_at']
    search_fields = ['user__username']
    inlines = [CartItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity', 'price', 'total_price']
    search_fields = ['cart__user__username', 'product__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderTrackingInline(admin.TabularInline):
    model = OrderTracking
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'user__username']
    inlines = [OrderItemInline, OrderTrackingInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'seller', 'quantity', 'unit_price', 'total_price']
    search_fields = ['order__order_number', 'product_name', 'seller__username']

@admin.register(OrderTracking)
class OrderTrackingAdmin(admin.ModelAdmin):
    list_display = ['order', 'status', 'created_at', 'created_by']
    list_filter = ['status', 'created_at']
    search_fields = ['order__order_number']

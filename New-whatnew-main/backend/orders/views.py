from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from .models import Cart, CartItem, Order, OrderItem, OrderTracking
from accounts.models import Address
from .serializers import (
    CartSerializer, CartItemSerializer, AddToCartSerializer,
    OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer,
    SellerOrderSerializer
)
from .emails import send_order_confirmation_email, send_order_notification_to_sellers

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(generics.CreateAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        try:
            with transaction.atomic():
                # Check if item already exists in cart
                existing_item = CartItem.objects.filter(
                    cart=cart,
                    product_id=serializer.validated_data['product_id'],
                    bidding_id=serializer.validated_data.get('bidding_id')
                ).first()
                
                if existing_item:
                    # Update quantity
                    existing_item.quantity += serializer.validated_data['quantity']
                    existing_item.save()
                    cart_item = existing_item
                else:
                    # Create new cart item
                    cart_item = CartItem.objects.create(
                        cart=cart,
                        product_id=serializer.validated_data['product_id'],
                        bidding_id=serializer.validated_data.get('bidding_id'),
                        quantity=serializer.validated_data['quantity'],
                        price=serializer.validated_data['price']
                    )
                
                return Response({
                    'message': 'Item added to cart successfully',
                    'cart_item': CartItemSerializer(cart_item).data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                'error': 'Failed to add item to cart'
            }, status=status.HTTP_400_BAD_REQUEST)

class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        cart_item_id = request.data.get('cart_item_id')
        if not cart_item_id:
            return Response({'error': 'cart_item_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(
                id=cart_item_id,
                cart__user=request.user
            )
            cart_item.delete()
            return Response({'message': 'Item removed from cart'})
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class ClearCartView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            return Response({'message': 'Cart cleared successfully'})
        except Cart.DoesNotExist:
            return Response({'message': 'Cart is already empty'})

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                # Get user's cart
                cart = Cart.objects.get(user=request.user)
                if not cart.items.exists():
                    return Response({'error': 'Cart is empty'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
                
                # Get shipping address from JSON
                shipping_address = serializer.validated_data['shipping_address']
                
                # Calculate totals with platform fee and delivery charge
                from decimal import Decimal
                subtotal = cart.total_amount
                platform_fee = Decimal('3.0')  # Platform fee
                delivery_charge = Decimal('79.0')  # Delivery charge
                tax_amount = Decimal('0.0')  # No tax for now
                total_amount = subtotal + platform_fee + delivery_charge + tax_amount
                
                # Create order
                order = Order.objects.create(
                    user=request.user,
                    shipping_address=shipping_address,
                    subtotal=subtotal,
                    shipping_fee=delivery_charge,  # Use delivery_charge as shipping_fee
                    tax_amount=tax_amount,
                    total_amount=total_amount,
                    customer_notes=serializer.validated_data.get('customer_notes', '')
                )
                
                # Create order items
                for cart_item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        bidding=cart_item.bidding,
                        seller=cart_item.product.seller,
                        quantity=cart_item.quantity,
                        unit_price=cart_item.price,
                        total_price=cart_item.total_price
                    )
                
                # Create initial order tracking
                OrderTracking.objects.create(
                    order=order,
                    status='pending',
                    notes='Order created, awaiting payment',
                    created_by=request.user
                )
                
                # Send "order placed, awaiting payment" email (not full confirmation)
                from .emails import send_order_placed_awaiting_payment_email
                try:
                    send_order_placed_awaiting_payment_email(order)
                    print(f"Order placed (awaiting payment) email sent for order {order.order_number}")
                except Exception as e:
                    print(f"Error sending order placed email: {e}")
                
                # DON'T send confirmation/seller emails here - only send after successful payment
                print(f"Order {order.order_number} created successfully, awaiting payment")
                
                # Don't clear cart here - only clear after successful payment
                # cart.items.all().delete()
                
                return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
                
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Order creation error: {e}")  # Debug logging
            return Response({'error': f'Failed to create order: {str(e)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)

class CancelOrderView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
            
            if order.status not in ['pending', 'confirmed']:
                return Response({'error': 'Order cannot be cancelled'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                order.status = 'cancelled'
                order.save()
                
                OrderTracking.objects.create(
                    order=order,
                    status='cancelled',
                    notes='Order cancelled by customer',
                    created_by=request.user
                )
            
            return Response({'message': 'Order cancelled successfully'})
            
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class OrderTrackingView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
            tracking = OrderTracking.objects.filter(order=order).order_by('-created_at')
            
            tracking_data = [{
                'status': track.status,
                'notes': track.notes,
                'created_at': track.created_at,
                'created_by': track.created_by.username
            } for track in tracking]
            
            return Response({
                'order_number': order.order_number,
                'current_status': order.status,
                'tracking': tracking_data
            })
            
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class SellerOrdersView(generics.ListAPIView):
    serializer_class = SellerOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'seller':
            return Order.objects.none()
        
        # Get orders that contain items from this seller AND have successful payments
        # Only show orders with status 'confirmed' or later stages (paid orders)
        # Also filter by payment_status = 'completed' for extra safety
        paid_statuses = ['confirmed', 'processing', 'shipped', 'delivered']
        return Order.objects.filter(
            items__seller=self.request.user,
            status__in=paid_statuses,
            payment_status='completed'
        ).distinct().order_by('-created_at')

class UpdateOrderStatusView(generics.UpdateAPIView):
    serializer_class = UpdateOrderStatusSerializer
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            # Check authentication first
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication required'}, 
                              status=status.HTTP_401_UNAUTHORIZED)
            
            if not hasattr(request.user, 'user_type') or request.user.user_type != 'seller':
                return Response({'error': 'Only sellers can update order status'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Check if seller has items in this order and order is paid
            order = Order.objects.get(
                id=pk,
                items__seller=request.user,
                payment_status='completed'  # Only allow status updates for paid orders
            )
            
            new_status = serializer.validated_data['status']
            notes = serializer.validated_data.get('notes', '')
            tracking_id = serializer.validated_data.get('tracking_id', '')
            courier_name = serializer.validated_data.get('courier_name', '')
            
            # Validate status transitions
            current_status = order.status
            valid_transitions = {
                'confirmed': ['processing', 'shipped', 'cancelled'],
                'processing': ['shipped', 'cancelled'],
                'shipped': ['delivered', 'cancelled'],
                'delivered': [],  # Final state
                'cancelled': []   # Final state
            }
            
            if new_status not in valid_transitions.get(current_status, []):
                return Response({
                    'error': f'Invalid status transition from {current_status} to {new_status}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                order.status = new_status
                
                # Update timestamps based on status
                if new_status == 'confirmed':
                    order.confirmed_at = timezone.now()
                elif new_status == 'processing':
                    pass  # No specific timestamp for processing
                elif new_status == 'shipped':
                    order.shipped_at = timezone.now()
                elif new_status == 'delivered':
                    order.delivered_at = timezone.now()
                
                order.save()
                
                # Create tracking entry
                OrderTracking.objects.create(
                    order=order,
                    status=new_status,
                    notes=notes,
                    tracking_id=tracking_id if new_status == 'shipped' else '',
                    courier_name=courier_name if new_status == 'shipped' else '',
                    created_by=request.user
                )
                
                # Send email notifications for status changes
                from .emails import send_order_status_update_email
                try:
                    email_context = {
                        'tracking_id': tracking_id if new_status == 'shipped' else None,
                        'courier_name': courier_name if new_status == 'shipped' else None,
                        'estimated_delivery': '7-10 business days' if new_status == 'shipped' else None
                    }
                    send_order_status_update_email(order, new_status, notes, email_context)
                except Exception as e:
                    print(f"Error sending status update email: {e}")
                
                # If order is delivered, ensure seller earnings are recorded
                if new_status == 'delivered':
                    from payments.models import SellerEarnings
                    for item in order.items.filter(seller=request.user):
                        SellerEarnings.objects.get_or_create(
                            seller=request.user,
                            order_item=item,
                            defaults={
                                'gross_amount': item.total_price,
                                'platform_fee': 0,  # No additional fee for delivery
                                'net_amount': item.total_price
                            }
                        )
            
            return Response({
                'message': f'Order status updated to {new_status}',
                'order': SellerOrderSerializer(order).data
            })
            
        except Order.DoesNotExist:
            return Response({
                'error': 'Order not found, not paid, or you don\'t have permission to update it'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error updating order status: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Failed to update order status: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

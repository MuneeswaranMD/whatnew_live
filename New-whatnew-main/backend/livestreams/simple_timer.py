"""
Simple timer implementation using database polling
"""
import time
import threading
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import asyncio

class SimpleBiddingTimer:
    def __init__(self):
        self.running = False
        self.thread = None
        self.channel_layer = get_channel_layer()
    
    def start(self):
        """Start the timer service"""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._timer_loop, daemon=True)
            self.thread.start()
            print("✓ Bidding timer service started")
    
    def stop(self):
        """Stop the timer service"""
        self.running = False
        if self.thread:
            self.thread.join()
        print("✓ Bidding timer service stopped")
    
    def _timer_loop(self):
        """Main timer loop that runs every second"""
        while self.running:
            try:
                self._check_active_biddings()
                time.sleep(1)  # Check every second
            except Exception as e:
                print(f"Timer loop error: {e}")
                time.sleep(5)  # Wait longer on error
    
    def _check_active_biddings(self):
        """Check all active biddings and send timer updates"""
        from livestreams.models import ProductBidding, Bid
        from orders.models import Cart, CartItem
        
        try:
            # Get all active biddings
            active_biddings = ProductBidding.objects.filter(status='active').select_related('livestream', 'product')
            
            current_time = timezone.now()
            
            for bidding in active_biddings:
                if bidding.ends_at and bidding.ends_at <= current_time:
                    # Timer expired - end the bidding
                    self._auto_end_bidding(bidding)
                elif bidding.ends_at:
                    # Send timer update
                    remaining_seconds = int((bidding.ends_at - current_time).total_seconds())
                    if remaining_seconds >= 0:
                        self._send_timer_update(bidding, remaining_seconds)
                        
        except Exception as e:
            print(f"Error checking biddings: {e}")
    
    def _send_timer_update(self, bidding, remaining_seconds):
        """Send timer update via WebSocket"""
        try:
            if self.channel_layer:
                room_group_name = f'livestream_{bidding.livestream.id}'
                
                timer_data = {
                    'bidding_id': str(bidding.id),
                    'remaining_time': remaining_seconds,
                    'ends_at': bidding.ends_at.isoformat(),
                    'current_highest_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else float(bidding.starting_price)
                }
                
                # Add fresh product data to timer update
                try:
                    from products.serializers import ProductListSerializer
                    product_serializer = ProductListSerializer(bidding.product)
                    timer_data['product_data'] = product_serializer.data
                    
                    # Only print occasionally to avoid spam
                    if remaining_seconds % 10 == 0:
                        print(f"Added fresh product data to timer: status={bidding.product.status}, qty={bidding.product.available_quantity}")
                except Exception as e:
                    print(f"Error adding product data to timer update: {e}")
                
                async_to_sync(self.channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'bidding_timer_update',
                        'data': timer_data
                    }
                )
                
                # Print timer updates only every 5 seconds to avoid spam
                if remaining_seconds % 5 == 0:
                    print(f"Timer update: Bidding {bidding.id} - {remaining_seconds}s remaining")
                    
        except Exception as e:
            print(f"Error sending timer update: {e}")
    
    def _auto_end_bidding(self, bidding):
        """Automatically end a bidding when timer expires"""
        try:
            with transaction.atomic():
                # Refresh to avoid race conditions
                bidding.refresh_from_db()
                
                if bidding.status != 'active':
                    return  # Already ended
                
                # End the bidding
                bidding.status = 'ended'
                bidding.ended_at = timezone.now()
                
                # Determine winner
                from livestreams.models import Bid
                winning_bid = Bid.objects.filter(
                    bidding=bidding, 
                    is_winning=True
                ).first()
                
                if winning_bid:
                    bidding.winner = winning_bid.bidder
                    
                    # Add to winner's cart
                    from orders.models import Cart, CartItem
                    cart, created = Cart.objects.get_or_create(user=winning_bid.bidder)
                    
                    CartItem.objects.create(
                        cart=cart,
                        product=bidding.product,
                        bidding=bidding,
                        quantity=1,
                        price=winning_bid.amount
                    )
                    
                    # Reduce product quantity by 1 (since bidding is always for 1 item)
                    if bidding.product.quantity > 0:
                        bidding.product.quantity -= 1
                        bidding.product.save()
                        print(f"Product {bidding.product.name} quantity reduced to {bidding.product.quantity}")
                        
                        # Update status if sold out
                        if bidding.product.quantity == 0:
                            bidding.product.status = 'sold_out'
                            bidding.product.save()
                    
                    print(f"🏆 Auto-ended bidding {bidding.id} - Winner: {winning_bid.bidder.username} (₹{winning_bid.amount})")
                else:
                    print(f"⏰ Auto-ended bidding {bidding.id} - No bids placed")
                
                bidding.save()
                
                # Send WebSocket notification
                if self.channel_layer:
                    room_group_name = f'livestream_{bidding.livestream.id}'
                    
                    winner_data = {
                        'bidding_id': str(bidding.id),
                        'winner_id': str(bidding.winner.id) if bidding.winner else None,
                        'winner_name': bidding.winner.username if bidding.winner else None,
                        'winning_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                        'winning_amount': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                        'product_id': str(bidding.product.id),
                        'product_name': bidding.product.name,
                        'product_quantity_remaining': bidding.product.quantity,
                        'ended_at': bidding.ended_at.isoformat(),
                        'auto_ended': True
                    }
                    
                    async_to_sync(self.channel_layer.group_send)(
                        room_group_name,
                        {
                            'type': 'bidding_ended',
                            'data': winner_data
                        }
                    )
                
        except Exception as e:
            print(f"Error auto-ending bidding {bidding.id}: {e}")


# Global timer instance
simple_timer = SimpleBiddingTimer()

# Start timer when module is imported
def start_timer_service():
    """Start the timer service"""
    simple_timer.start()

def stop_timer_service():
    """Stop the timer service"""
    simple_timer.stop()

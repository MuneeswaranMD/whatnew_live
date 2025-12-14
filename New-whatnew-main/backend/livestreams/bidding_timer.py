"""
Bidding Timer Management System
Handles automatic bidding end and timer updates
"""
import asyncio
import json
from datetime import datetime, timedelta
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.management.base import BaseCommand
from livestreams.models import ProductBidding
from orders.models import Cart, CartItem


class BiddingTimerManager:
    def __init__(self):
        self.channel_layer = get_channel_layer()
        self.running_timers = {}
    
    async def start_bidding_timer(self, bidding_id):
        """Start a timer for a specific bidding"""
        try:
            # Get bidding object
            from django.db import connection
            from django.db.utils import OperationalError
            
            try:
                bidding = await self.get_bidding(bidding_id)
                if not bidding or bidding.status != 'active':
                    print(f"Bidding {bidding_id} not active or not found")
                    return
                
                print(f"Starting timer for bidding {bidding_id}, duration: {bidding.timer_duration}s")
                
                # Store timer reference
                self.running_timers[bidding_id] = True
                
                # Calculate remaining time
                remaining_time = int((bidding.ends_at - timezone.now()).total_seconds())
                
                # Send timer updates every second
                while remaining_time > 0 and self.running_timers.get(bidding_id):
                    # Send timer update
                    room_group_name = f'livestream_{bidding.livestream.id}'
                    
                    # Include fresh product data in timer update
                    from livestreams.serializers import ProductBiddingSerializer
                    from django.db import sync_to_async
                    
                    # Get fresh bidding data with up-to-date product info
                    timer_data = {
                        'bidding_id': str(bidding.id),
                        'remaining_time': remaining_time,
                        'ends_at': bidding.ends_at.isoformat(),
                        'current_highest_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else float(bidding.starting_price)
                    }
                    
                    # Add fresh product data to timer update
                    try:
                        def get_fresh_product_data():
                            from products.serializers import ProductListSerializer
                            product_serializer = ProductListSerializer(bidding.product)
                            return product_serializer.data
                        
                        fresh_product_data = await sync_to_async(get_fresh_product_data)()
                        timer_data['product_data'] = fresh_product_data
                        print(f"Added fresh product data to timer: {fresh_product_data}")
                    except Exception as e:
                        print(f"Error adding product data to timer update: {e}")
                    
                    if self.channel_layer:
                        await self.channel_layer.group_send(
                            room_group_name,
                            {
                                'type': 'bidding_timer_update',
                                'data': timer_data
                            }
                        )
                    
                    # Wait 1 second
                    await asyncio.sleep(1)
                    remaining_time -= 1
                    
                    # Refresh bidding to check if it's still active
                    bidding = await self.get_bidding(bidding_id)
                    if not bidding or bidding.status != 'active':
                        break
                
                # Timer ended - automatically end the bidding
                if remaining_time <= 0 and self.running_timers.get(bidding_id):
                    await self.auto_end_bidding(bidding_id)
                
                # Clean up timer reference
                self.running_timers.pop(bidding_id, None)
                
            except OperationalError:
                # Database connection issues, retry after a moment
                await asyncio.sleep(2)
                await self.start_bidding_timer(bidding_id)
                
        except Exception as e:
            print(f"Error in bidding timer for {bidding_id}: {e}")
            self.running_timers.pop(bidding_id, None)
    
    async def get_bidding(self, bidding_id):
        """Get bidding object asynchronously"""
        from django.db import sync_to_async
        from livestreams.models import ProductBidding
        
        try:
            return await sync_to_async(ProductBidding.objects.select_related('livestream', 'product', 'winner').get)(id=bidding_id)
        except ProductBidding.DoesNotExist:
            return None
    
    async def auto_end_bidding(self, bidding_id):
        """Automatically end bidding when timer expires"""
        from django.db import sync_to_async, transaction
        from livestreams.models import ProductBidding, Bid
        from orders.models import Cart, CartItem
        
        try:
            # Use database transaction
            @sync_to_async
            def end_bidding_transaction():
                with transaction.atomic():
                    bidding = ProductBidding.objects.select_related('livestream', 'product').get(id=bidding_id)
                    
                    if bidding.status != 'active':
                        return None
                    
                    # End the bidding
                    bidding.status = 'ended'
                    bidding.ended_at = timezone.now()
                    
                    # Determine winner
                    winning_bid = Bid.objects.filter(
                        bidding=bidding, 
                        is_winning=True
                    ).first()
                    
                    if winning_bid:
                        bidding.winner = winning_bid.bidder
                        
                        # Add to winner's cart
                        cart, created = Cart.objects.get_or_create(user=winning_bid.bidder)
                        
                        CartItem.objects.create(
                            cart=cart,
                            product=bidding.product,
                            bidding=bidding,
                            quantity=1,
                            price=winning_bid.amount
                        )
                        
                        print(f"Added product {bidding.product.name} to {winning_bid.bidder.username}'s cart")
                    
                    bidding.save()
                    
                    return {
                        'bidding': bidding,
                        'winner': bidding.winner,
                        'winning_bid': bidding.current_highest_bid
                    }
            
            result = await end_bidding_transaction()
            
            if result:
                bidding = result['bidding']
                
                # Send WebSocket notification
                room_group_name = f'livestream_{bidding.livestream.id}'
                
                winner_data = {
                    'bidding_id': str(bidding.id),
                    'winner_id': str(bidding.winner.id) if bidding.winner else None,
                    'winner_name': bidding.winner.username if bidding.winner else None,
                    'winning_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                    'winning_amount': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                    'product_name': bidding.product.name,
                    'ended_at': bidding.ended_at.isoformat(),
                    'auto_ended': True
                }
                
                if self.channel_layer:
                    await self.channel_layer.group_send(
                        room_group_name,
                        {
                            'type': 'bidding_ended',
                            'data': winner_data
                        }
                    )
                
                print(f"Auto-ended bidding {bidding_id}")
                
        except Exception as e:
            print(f"Error auto-ending bidding {bidding_id}: {e}")
    
    def stop_bidding_timer(self, bidding_id):
        """Stop a specific bidding timer"""
        self.running_timers.pop(bidding_id, None)
        print(f"Stopped timer for bidding {bidding_id}")
    
    def stop_all_timers(self):
        """Stop all running timers"""
        self.running_timers.clear()
        print("Stopped all bidding timers")


# Global timer manager instance
timer_manager = BiddingTimerManager()


class Command(BaseCommand):
    help = 'Start bidding timer manager'
    
    def handle(self, *args, **options):
        asyncio.run(self.run_timer_manager())
    
    async def run_timer_manager(self):
        """Run the timer manager"""
        print("Starting Bidding Timer Manager...")
        
        # Keep the manager running
        while True:
            try:
                await asyncio.sleep(1)
            except KeyboardInterrupt:
                print("Stopping Bidding Timer Manager...")
                timer_manager.stop_all_timers()
                break

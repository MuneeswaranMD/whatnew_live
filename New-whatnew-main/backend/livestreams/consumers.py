import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import LiveStream, ProductBidding, Bid

User = get_user_model()

class LivestreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.livestream_id = self.scope['url_route']['kwargs']['livestream_id']
        self.room_group_name = f'livestream_{self.livestream_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send initial livestream data
        livestream_data = await self.get_livestream_data()
        if livestream_data:
            await self.send(text_data=json.dumps({
                'type': 'livestream_data',
                'data': livestream_data
            }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'chat_message':
            # Handle chat message
            await self.handle_chat_message(data)
        elif message_type == 'place_bid' or message_type == 'bid_placed':
            # Handle bid placement
            await self.handle_bid_placed(data)
        elif message_type == 'bidding_started' or message_type == 'start_bidding':
            # Handle bidding start
            await self.handle_bidding_started(data)
        elif message_type == 'bidding_ended' or message_type == 'end_bidding':
            # Handle bidding end
            await self.handle_bidding_ended(data)
        elif message_type == 'viewer_count_update':
            # Handle viewer count update
            await self.handle_viewer_count_update(data)
        elif message_type == 'ban_user':
            # Handle user ban
            await self.handle_user_ban(data)
    
    async def handle_chat_message(self, data):
        # Broadcast chat message to all viewers
        message_data = {
            'user_name': data.get('user_name', 'Seller'),
            'message': data.get('message', ''),
            'user_id': data.get('user_id', 'seller'),
            'timestamp': data.get('timestamp'),
            'is_seller': True
        }
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'data': message_data
            }
        )

    async def handle_user_ban(self, data):
        # Broadcast user ban to all viewers
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_banned',
                'data': data
            }
        )

    async def handle_bid_placed(self, data):
        # Get bidding and user information
        bidding_id = data.get('bidding_id') or data.get('product_id')
        amount = data.get('bid_amount') or data.get('amount')
        user = self.scope.get('user')
        
        if bidding_id and amount and user:
            # Broadcast new bid to all viewers with complete data
            bid_data = {
                'bidding_id': str(bidding_id),
                'amount': float(amount),
                'bid_amount': float(amount),
                'user_id': str(user.id),
                'user_name': user.username,
                'username': user.username,
                'timestamp': timezone.now().isoformat(),
                'user_type': getattr(user, 'user_type', 'buyer')
            }
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'bid_placed',
                    'data': bid_data
                }
            )
    
    async def handle_bidding_started(self, data):
        # Get bidding information and broadcast with complete data
        bidding_data = await self.get_bidding_data(data.get('bidding_id'))
        if bidding_data:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'bidding_started',
                    'data': bidding_data
                }
            )
    
    async def handle_bidding_ended(self, data):
        # Get final bidding information and broadcast with winner data
        bidding_data = await self.get_bidding_data(data.get('bidding_id'))
        if bidding_data:
            # Add winner information
            winner_data = await self.get_bidding_winner(data.get('bidding_id'))
            bidding_data.update(winner_data)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'bidding_ended',
                    'data': bidding_data
                }
            )
    
    async def handle_viewer_count_update(self, data):
        # Broadcast viewer count update
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'viewer_count_update',
                'data': data
            }
        )
    
    # Receive message from room group
    async def bid_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bid_update',
            'data': event['data']
        }))
    
    async def bidding_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bidding_started',
            'data': event['data']
        }))
    
    async def bidding_ended(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bidding_ended',
            'data': event['data']
        }))
    
    async def viewer_count_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'viewer_count_update',
            'data': event['data']
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'data': event['data']
        }))

    async def bid_placed(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bid_placed',
            'data': event['data']
        }))

    async def bidding_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bidding_started',
            'data': event['data']
        }))

    async def bidding_ended(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bidding_ended',
            'data': event['data']
        }))

    async def user_banned(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_banned',
            'data': event['data']
        }))
    
    async def bidding_timer_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'bidding_timer_update',
            'data': event['data']
        }))
    
    @database_sync_to_async
    def get_livestream_data(self):
        try:
            livestream = LiveStream.objects.get(id=self.livestream_id)
            return {
                'id': str(livestream.id),
                'title': livestream.title,
                'status': livestream.status,
                'viewer_count': livestream.viewer_count,
                'seller': livestream.seller.username
            }
        except LiveStream.DoesNotExist:
            return None

    @database_sync_to_async
    def get_bidding_data(self, bidding_id):
        try:
            bidding = ProductBidding.objects.select_related('product').get(id=bidding_id)
            return {
                'id': str(bidding.id),
                'bidding_id': str(bidding.id),
                'product_id': str(bidding.product.id),
                'product_name': bidding.product.name,
                'starting_price': float(bidding.starting_price),
                'current_highest_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else float(bidding.starting_price),
                'timer_duration': bidding.timer_duration,
                'duration': bidding.timer_duration,
                'status': bidding.status,
                'started_at': bidding.started_at.isoformat(),
                'ends_at': bidding.ends_at.isoformat(),
                'remaining_time': max(0, int((bidding.ends_at - timezone.now()).total_seconds())) if bidding.status == 'active' else 0
            }
        except ProductBidding.DoesNotExist:
            return None

    @database_sync_to_async
    def get_bidding_winner(self, bidding_id):
        try:
            bidding = ProductBidding.objects.select_related('winner').get(id=bidding_id)
            if bidding.winner:
                return {
                    'winner_id': str(bidding.winner.id),
                    'winner_name': bidding.winner.username,
                    'winning_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                    'winning_amount': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0
                }
            else:
                return {
                    'winner_id': None,
                    'winner_name': None,
                    'winning_bid': 0,
                    'winning_amount': 0
                }
        except ProductBidding.DoesNotExist:
            return {
                'winner_id': None,
                'winner_name': None,
                'winning_bid': 0,
                'winning_amount': 0
            }

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import ChatMessage, BannedUser
from livestreams.models import LiveStream

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.livestream_id = self.scope['url_route']['kwargs']['livestream_id']
        self.room_group_name = f'chat_{self.livestream_id}'
        self.user = self.scope['user']
        
        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Check if user is banned
        is_banned = await self.check_if_banned()
        if is_banned:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send recent chat messages
        recent_messages = await self.get_recent_messages()
        for message in recent_messages:
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'data': message
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
            await self.handle_chat_message(data)
        elif message_type == 'delete_message':
            await self.handle_delete_message(data)
        elif message_type == 'ban_user':
            await self.handle_ban_user(data)
    
    async def handle_chat_message(self, data):
        content = data.get('content', '').strip()
        if not content:
            return
        
        # Check if user is banned (double-check)
        is_banned = await self.check_if_banned()
        if is_banned:
            return
        
        # Save message to database
        message = await self.save_message(content, data.get('message_type', 'text'))
        
        if message:
            # Broadcast message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message_broadcast',
                    'data': message
                }
            )
    
    async def handle_delete_message(self, data):
        message_id = data.get('message_id')
        if not message_id:
            return
        
        # Check if user has permission to delete
        can_delete = await self.can_delete_message(message_id)
        if not can_delete:
            return
        
        # Delete message
        deleted = await self.delete_message(message_id)
        if deleted:
            # Broadcast deletion to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'message_deleted',
                    'data': {'message_id': message_id}
                }
            )
    
    async def handle_ban_user(self, data):
        user_id = data.get('user_id')
        reason = data.get('reason', 'Inappropriate behavior')
        
        if not user_id:
            return
        
        # Check if user has permission to ban
        can_ban = await self.can_ban_user()
        if not can_ban:
            return
        
        # Ban user
        banned = await self.ban_user(user_id, reason)
        if banned:
            # Broadcast ban to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_banned',
                    'data': {'user_id': user_id, 'reason': reason}
                }
            )
    
    # Receive message from room group
    async def chat_message_broadcast(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'data': event['data']
        }))
    
    async def message_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_deleted',
            'data': event['data']
        }))
    
    async def user_banned(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_banned',
            'data': event['data']
        }))
    
    @database_sync_to_async
    def check_if_banned(self):
        try:
            return BannedUser.objects.filter(
                livestream_id=self.livestream_id,
                user=self.user,
                is_active=True
            ).exists()
        except:
            return False
    
    @database_sync_to_async
    def get_recent_messages(self):
        try:
            messages = ChatMessage.objects.filter(
                livestream_id=self.livestream_id,
                is_visible=True
            ).select_related('user').order_by('-created_at')[:50]
            
            return [{
                'id': str(message.id),
                'user_id': str(message.user.id),
                'username': message.user.username,
                'user_type': message.user.user_type,
                'content': message.content,
                'message_type': message.message_type,
                'created_at': message.created_at.isoformat(),
            } for message in reversed(messages)]
        except:
            return []
    
    @database_sync_to_async
    def save_message(self, content, message_type):
        try:
            message = ChatMessage.objects.create(
                livestream_id=self.livestream_id,
                user=self.user,
                content=content,
                message_type=message_type
            )
            
            return {
                'id': str(message.id),
                'user_id': str(message.user.id),
                'username': message.user.username,
                'user_type': message.user.user_type,
                'content': message.content,
                'message_type': message.message_type,
                'created_at': message.created_at.isoformat(),
            }
        except:
            return None
    
    @database_sync_to_async
    def can_delete_message(self, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            
            # User can delete their own messages
            if message.user == self.user:
                return True
            
            # Livestream owner can delete any message
            livestream = LiveStream.objects.get(id=self.livestream_id)
            if livestream.seller == self.user:
                return True
            
            # Moderators can delete messages
            from .models import ChatModerator
            if ChatModerator.objects.filter(
                livestream=livestream,
                moderator=self.user
            ).exists():
                return True
            
            return False
        except:
            return False
    
    @database_sync_to_async
    def delete_message(self, message_id):
        try:
            message = ChatMessage.objects.get(id=message_id)
            message.is_visible = False
            message.save()
            return True
        except:
            return False
    
    @database_sync_to_async
    def can_ban_user(self):
        try:
            # Only livestream owner can ban users
            livestream = LiveStream.objects.get(id=self.livestream_id)
            return livestream.seller == self.user
        except:
            return False
    
    @database_sync_to_async
    def ban_user(self, user_id, reason):
        try:
            user_to_ban = User.objects.get(id=user_id)
            livestream = LiveStream.objects.get(id=self.livestream_id)
            
            BannedUser.objects.get_or_create(
                livestream=livestream,
                user=user_to_ban,
                defaults={
                    'banned_by': self.user,
                    'reason': reason,
                    'is_active': True
                }
            )
            return True
        except:
            return False

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import ChatMessage, ChatModerator, BannedUser
from livestreams.models import LiveStream
from .serializers import (
    ChatMessageSerializer, SendMessageSerializer, ChatModeratorSerializer,
    BannedUserSerializer, BanUserSerializer
)

class ChatMessageListView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        livestream_id = self.kwargs['livestream_id']
        return ChatMessage.objects.filter(
            livestream_id=livestream_id,
            is_visible=True
        ).select_related('user').order_by('-created_at')[:50]

class SendMessageView(generics.CreateAPIView):
    serializer_class = SendMessageSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, livestream_id):
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            
            # Check if livestream is live
            if livestream.status != 'live':
                return Response({'error': 'Livestream is not currently live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user is banned
            if BannedUser.objects.filter(
                livestream=livestream,
                user=request.user,
                is_active=True
            ).exists():
                return Response({'error': 'You are banned from this livestream'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Create message
            message = ChatMessage.objects.create(
                livestream=livestream,
                user=request.user,
                content=serializer.validated_data['content'],
                message_type=serializer.validated_data['message_type']
            )
            
            return Response({
                'message': 'Message sent successfully',
                'data': ChatMessageSerializer(message).data
            }, status=status.HTTP_201_CREATED)
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class DeleteMessageView(generics.DestroyAPIView):
    queryset = ChatMessage.objects.all()
    permission_classes = [IsAuthenticated]
    
    def destroy(self, request, pk):
        try:
            message = self.get_object()
            
            # Check permissions
            can_delete = False
            
            # User can delete their own messages
            if message.user == request.user:
                can_delete = True
            
            # Livestream owner can delete any message
            elif message.livestream.seller == request.user:
                can_delete = True
            
            # Moderators can delete messages
            elif ChatModerator.objects.filter(
                livestream=message.livestream,
                moderator=request.user
            ).exists():
                can_delete = True
            
            if not can_delete:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Soft delete (hide message)
            message.is_visible = False
            message.save()
            
            return Response({'message': 'Message deleted successfully'})
            
        except ChatMessage.DoesNotExist:
            return Response({'error': 'Message not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class ChatModeratorsView(generics.ListCreateAPIView):
    serializer_class = ChatModeratorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        livestream_id = self.kwargs['livestream_id']
        return ChatModerator.objects.filter(
            livestream_id=livestream_id
        ).select_related('moderator', 'added_by')
    
    def create(self, request, livestream_id):
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            
            # Only livestream owner can add moderators
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            moderator_id = request.data.get('moderator_id')
            if not moderator_id:
                return Response({'error': 'moderator_id is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            from accounts.models import CustomUser
            moderator = CustomUser.objects.get(id=moderator_id)
            
            # Create moderator
            chat_moderator, created = ChatModerator.objects.get_or_create(
                livestream=livestream,
                moderator=moderator,
                defaults={'added_by': request.user}
            )
            
            if not created:
                return Response({'error': 'User is already a moderator'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'message': 'Moderator added successfully',
                'data': ChatModeratorSerializer(chat_moderator).data
            }, status=status.HTTP_201_CREATED)
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class BanUserView(generics.CreateAPIView):
    serializer_class = BanUserSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, livestream_id):
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            
            # Only livestream owner can ban users
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            from accounts.models import CustomUser
            user_to_ban = CustomUser.objects.get(
                id=serializer.validated_data['user_id']
            )
            
            # Cannot ban yourself
            if user_to_ban == request.user:
                return Response({'error': 'You cannot ban yourself'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Create ban record
            banned_user, created = BannedUser.objects.get_or_create(
                livestream=livestream,
                user=user_to_ban,
                defaults={
                    'banned_by': request.user,
                    'reason': serializer.validated_data['reason'],
                    'is_active': True
                }
            )
            
            if not created:
                # Update existing ban
                banned_user.reason = serializer.validated_data['reason']
                banned_user.is_active = True
                banned_user.save()
            
            return Response({
                'message': f'User {user_to_ban.username} banned successfully',
                'data': BannedUserSerializer(banned_user).data
            }, status=status.HTTP_201_CREATED)
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class UnbanUserView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, livestream_id):
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            
            # Only livestream owner can unban users
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            user_id = request.data.get('user_id')
            if not user_id:
                return Response({'error': 'user_id is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            banned_user = BannedUser.objects.get(
                livestream=livestream,
                user_id=user_id,
                is_active=True
            )
            
            banned_user.is_active = False
            banned_user.save()
            
            return Response({'message': 'User unbanned successfully'})
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except BannedUser.DoesNotExist:
            return Response({'error': 'Ban record not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class BannedUsersView(generics.ListAPIView):
    serializer_class = BannedUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        livestream_id = self.kwargs['livestream_id']
        return BannedUser.objects.filter(
            livestream_id=livestream_id,
            is_active=True
        ).select_related('user', 'banned_by')
    
    def get(self, request, livestream_id):
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            
            # Only livestream owner can view banned users
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'banned_users': serializer.data,
                'count': queryset.count()
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

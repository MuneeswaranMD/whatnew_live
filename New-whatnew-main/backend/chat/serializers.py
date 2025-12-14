from rest_framework import serializers
from .models import ChatMessage, ChatModerator, BannedUser

class ChatMessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'user_name', 'user_type', 'message_type', 'content', 
                 'is_visible', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=500)
    message_type = serializers.ChoiceField(
        choices=ChatMessage.MESSAGE_TYPE_CHOICES, 
        default='text'
    )

class ChatModeratorSerializer(serializers.ModelSerializer):
    moderator_name = serializers.CharField(source='moderator.username', read_only=True)
    added_by_name = serializers.CharField(source='added_by.username', read_only=True)
    
    class Meta:
        model = ChatModerator
        fields = ['id', 'moderator', 'moderator_name', 'added_by', 'added_by_name', 'added_at']
        read_only_fields = ['id', 'added_by', 'added_at']

class BannedUserSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    banned_by_name = serializers.CharField(source='banned_by.username', read_only=True)
    
    class Meta:
        model = BannedUser
        fields = ['id', 'user', 'user_name', 'banned_by', 'banned_by_name', 'reason', 
                 'banned_at', 'is_active']
        read_only_fields = ['id', 'banned_by', 'banned_at']

class BanUserSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    reason = serializers.CharField(max_length=500)

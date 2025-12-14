from django.contrib import admin
from .models import ChatMessage, ChatModerator, BannedUser

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'livestream', 'message_type', 'content', 'is_visible', 'created_at']
    list_filter = ['message_type', 'is_visible', 'created_at']
    search_fields = ['user__username', 'livestream__title', 'content']

@admin.register(ChatModerator)
class ChatModeratorAdmin(admin.ModelAdmin):
    list_display = ['livestream', 'moderator', 'added_by', 'added_at']
    search_fields = ['livestream__title', 'moderator__username']

@admin.register(BannedUser)
class BannedUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'livestream', 'banned_by', 'is_active', 'banned_at']
    list_filter = ['is_active', 'banned_at']
    search_fields = ['user__username', 'livestream__title']

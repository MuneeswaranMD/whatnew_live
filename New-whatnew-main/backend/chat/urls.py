from django.urls import path
from . import views

urlpatterns = [
    # Chat endpoints
    path('messages/<uuid:livestream_id>/', views.ChatMessageListView.as_view(), name='chat-messages'),
    path('messages/<uuid:livestream_id>/send/', views.SendMessageView.as_view(), name='send-message'),
    path('messages/<uuid:pk>/delete/', views.DeleteMessageView.as_view(), name='delete-message'),
    
    # Moderation endpoints
    path('livestreams/<uuid:livestream_id>/moderators/', views.ChatModeratorsView.as_view(), name='chat-moderators'),
    path('livestreams/<uuid:livestream_id>/ban-user/', views.BanUserView.as_view(), name='ban-user'),
    path('livestreams/<uuid:livestream_id>/unban-user/', views.UnbanUserView.as_view(), name='unban-user'),
    path('livestreams/<uuid:livestream_id>/banned-users/', views.BannedUsersView.as_view(), name='banned-users'),
]

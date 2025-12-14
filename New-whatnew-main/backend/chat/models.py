from django.db import models
from django.conf import settings
from livestreams.models import LiveStream
import uuid

class ChatMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('system', 'System'),
        ('bid', 'Bid'),
        ('emoji', 'Emoji'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    livestream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='chat_messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES, default='text')
    content = models.TextField()
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.content[:50]}"

class ChatModerator(models.Model):
    livestream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='moderators')
    moderator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='added_moderators'
    )
    
    class Meta:
        unique_together = ['livestream', 'moderator']
    
    def __str__(self):
        return f"{self.moderator.username} moderating {self.livestream.title}"

class BannedUser(models.Model):
    livestream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='banned_users')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    banned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='banned_users'
    )
    reason = models.TextField()
    banned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['livestream', 'user']
    
    def __str__(self):
        return f"{self.user.username} banned from {self.livestream.title}"

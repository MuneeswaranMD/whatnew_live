from django.db import models
from django.conf import settings
from products.models import Product
import uuid

class LiveStream(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('ended', 'Ended'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='livestreams')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey('products.Category', on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to='livestreams/thumbnails/', null=True, blank=True)
    products = models.ManyToManyField(Product, related_name='livestreams')
    agora_channel_name = models.CharField(max_length=100, unique=True)
    agora_token = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    scheduled_start_time = models.DateTimeField(null=True, blank=True)
    actual_start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    viewer_count = models.PositiveIntegerField(default=0)
    credits_consumed = models.PositiveIntegerField(default=0)
    last_credit_deduction = models.DateTimeField(null=True, blank=True)  # Track when last credit was deducted
    last_activity = models.DateTimeField(null=True, blank=True)  # Track last activity (heartbeat from frontend)
    auto_end_warned = models.BooleanField(default=False)  # Track if warning was sent before auto-ending
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.seller.username}"
    
    @property
    def duration_minutes(self):
        if self.actual_start_time and self.end_time:
            return int((self.end_time - self.actual_start_time).total_seconds() / 60)
        return 0

class LiveStreamViewer(models.Model):
    livestream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='viewers')
    viewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['livestream', 'viewer']
    
    def __str__(self):
        return f"{self.viewer.username} watching {self.livestream.title}"

class ProductBidding(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('ended', 'Ended'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    livestream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='biddings')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='biddings')
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_highest_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    timer_duration = models.PositiveIntegerField(help_text="Duration in seconds")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    started_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_biddings')
    
    def __str__(self):
        return f"Bidding for {self.product.name} in {self.livestream.title}"

class Bid(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bidding = models.ForeignKey(ProductBidding, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_winning = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-amount', '-created_at']
    
    def __str__(self):
        return f"₹{self.amount} bid by {self.bidder.username}"

from django.contrib import admin
from .models import LiveStream, LiveStreamViewer, ProductBidding, Bid

@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):
    list_display = ['title', 'seller', 'status', 'viewer_count', 'scheduled_start_time', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'seller__username', 'description']
    readonly_fields = ['agora_channel_name', 'viewer_count', 'credits_consumed']

@admin.register(LiveStreamViewer)
class LiveStreamViewerAdmin(admin.ModelAdmin):
    list_display = ['livestream', 'viewer', 'joined_at', 'is_active']
    list_filter = ['is_active', 'joined_at']
    search_fields = ['livestream__title', 'viewer__username']

@admin.register(ProductBidding)
class ProductBiddingAdmin(admin.ModelAdmin):
    list_display = ['product', 'livestream', 'starting_price', 'current_highest_bid', 'status', 'winner']
    list_filter = ['status', 'started_at']
    search_fields = ['product__name', 'livestream__title']
    readonly_fields = ['current_highest_bid', 'winner']

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ['bidding', 'bidder', 'amount', 'is_winning', 'created_at']
    list_filter = ['is_winning', 'created_at']
    search_fields = ['bidding__product__name', 'bidder__username']
    readonly_fields = ['is_winning']

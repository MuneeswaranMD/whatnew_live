from rest_framework import serializers
from .models import LiveStream, LiveStreamViewer, ProductBidding, Bid
from products.serializers import ProductListSerializer
from accounts.serializers import CustomUserSerializer
from PIL import Image
from django.core.exceptions import ValidationError as DjangoValidationError

class LiveStreamSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    products_data = ProductListSerializer(source='products', many=True, read_only=True)
    
    class Meta:
        model = LiveStream
        fields = ['id', 'title', 'description', 'category', 'category_name', 'thumbnail', 'products', 
                 'products_data', 'agora_channel_name', 'status', 'scheduled_start_time', 
                 'actual_start_time', 'end_time', 'viewer_count', 'credits_consumed', 
                 'seller', 'seller_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'seller', 'agora_channel_name', 'status', 'actual_start_time', 
                           'end_time', 'viewer_count', 'credits_consumed', 'created_at', 'updated_at']
    
    def validate_thumbnail(self, value):
        if value:
            try:
                # Import PIL here to avoid import issues if not installed
                from PIL import Image
                
                # Open the image to get dimensions
                img = Image.open(value)
                width, height = img.size
                
                # Check for exact dimensions: 480x720
                if not (width == 480 and height == 720):
                    raise serializers.ValidationError(
                        f'Thumbnail must be exactly 480×720px. '
                        f'Current dimensions: {width}×{height}px'
                    )
                
                # Check file size (optional - limit to 5MB)
                if value.size > 5 * 1024 * 1024:
                    raise serializers.ValidationError('Thumbnail file size must be less than 5MB')
                    
            except Exception as e:
                if isinstance(e, serializers.ValidationError):
                    raise e
                raise serializers.ValidationError('Invalid image file or unable to process image')
        
        return value
    
    def create(self, validated_data):
        import uuid
        validated_data['seller'] = self.context['request'].user
        validated_data['agora_channel_name'] = str(uuid.uuid4())
        return super().create(validated_data)

class LiveStreamListSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = LiveStream
        fields = ['id', 'title', 'category_name', 'thumbnail', 'status', 'scheduled_start_time', 
                 'viewer_count', 'seller_name', 'created_at']

class LiveStreamViewerSerializer(serializers.ModelSerializer):
    viewer_name = serializers.CharField(source='viewer.username', read_only=True)
    
    class Meta:
        model = LiveStreamViewer
        fields = ['id', 'viewer', 'viewer_name', 'joined_at', 'left_at', 'is_active']

class BidSerializer(serializers.ModelSerializer):
    bidder_name = serializers.CharField(source='bidder.username', read_only=True)
    
    class Meta:
        model = Bid
        fields = ['id', 'amount', 'bidder', 'bidder_name', 'created_at', 'is_winning']
        read_only_fields = ['id', 'bidder', 'created_at', 'is_winning']

class ProductBiddingSerializer(serializers.ModelSerializer):
    product_data = ProductListSerializer(source='product', read_only=True)
    livestream_title = serializers.CharField(source='livestream.title', read_only=True)
    bids = BidSerializer(many=True, read_only=True)
    winner_name = serializers.CharField(source='winner.username', read_only=True)
    
    class Meta:
        model = ProductBidding
        fields = ['id', 'product', 'product_data', 'livestream', 'livestream_title', 
                 'starting_price', 'current_highest_bid', 'timer_duration', 'status', 
                 'started_at', 'ends_at', 'ended_at', 'winner', 'winner_name', 'bids']
        read_only_fields = ['id', 'livestream', 'current_highest_bid', 'status', 
                           'started_at', 'ends_at', 'ended_at', 'winner']

class PlaceBidSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def validate_amount(self, value):
        bidding = self.context['bidding']
        
        if bidding.status != 'active':
            raise serializers.ValidationError("Bidding is not active")
        
        if value <= bidding.starting_price:
            raise serializers.ValidationError("Bid amount must be higher than starting price")
        
        if bidding.current_highest_bid and value <= bidding.current_highest_bid:
            raise serializers.ValidationError("Bid amount must be higher than current highest bid")
        
        return value

class AgoraTokenSerializer(serializers.Serializer):
    channel_name = serializers.CharField(read_only=True)
    token = serializers.CharField(read_only=True)
    uid = serializers.IntegerField(read_only=True)

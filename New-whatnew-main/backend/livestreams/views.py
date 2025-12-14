from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from agora_token_builder import RtcTokenBuilder
import time
from .models import LiveStream, LiveStreamViewer, ProductBidding, Bid
from .serializers import (
    LiveStreamSerializer, LiveStreamListSerializer, LiveStreamViewerSerializer,
    ProductBiddingSerializer, BidSerializer, PlaceBidSerializer, AgoraTokenSerializer
)
from .credit_monitor import CreditMonitorService

class LiveStreamViewSet(viewsets.ModelViewSet):
    serializer_class = LiveStreamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = LiveStream.objects.select_related('seller', 'category').prefetch_related('products')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by seller
        seller_id = self.request.query_params.get('seller', None)
        if seller_id:
            queryset = queryset.filter(seller_id=seller_id)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LiveStreamListSerializer
        return LiveStreamSerializer
    
    def perform_create(self, serializer):
        # Only sellers can create livestreams
        if self.request.user.user_type != 'seller':
            raise PermissionError("Only sellers can create livestreams")
        
        seller_profile = getattr(self.request.user, 'seller_profile', None)
        if not seller_profile or not seller_profile.is_account_active:
            raise PermissionError("Seller account not verified")
        
        if seller_profile.credits < 1:
            raise PermissionError("Insufficient credits to create livestream")
        
        serializer.save(seller=self.request.user)
    
    def perform_update(self, serializer):
        livestream = self.get_object()
        if livestream.seller != self.request.user:
            raise PermissionError("You can only update your own livestreams")
        
        # Prevent updating if live
        if livestream.status == 'live':
            raise PermissionError("Cannot update live stream")
        
        serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_livestreams(self, request):
        """Get livestreams for the authenticated seller"""
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        livestreams = LiveStream.objects.filter(seller=request.user).order_by('-created_at')
        serializer = LiveStreamListSerializer(livestreams, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def live_now(self, request):
        """Get currently live streams"""
        livestreams = LiveStream.objects.filter(status='live').order_by('-viewer_count')
        serializer = LiveStreamListSerializer(livestreams, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products associated with a specific livestream"""
        try:
            livestream = self.get_object()
            products = livestream.products.all()
            
            # Import ProductSerializer
            from products.serializers import ProductSerializer
            serializer = ProductSerializer(products, many=True)
            
            return Response({
                'products': serializer.data,
                'count': products.count()
            })
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def check_credits(self, request, pk=None):
        """Check and process credit deduction for a live stream"""
        try:
            livestream = self.get_object()
            
            # Check permissions
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Process credit deduction
            success = CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
            
            if not success:
                # Livestream was ended due to insufficient credits
                return Response({
                    'message': 'Livestream ended due to insufficient credits',
                    'livestream_ended': True,
                    'remaining_credits': livestream.seller.seller_profile.credits
                }, status=status.HTTP_200_OK)
            
            # Get updated livestream data
            livestream.refresh_from_db()
            time_until_next = CreditMonitorService.get_time_until_next_deduction(livestream)
            
            return Response({
                'message': 'Credits checked successfully',
                'livestream_ended': False,
                'remaining_credits': livestream.seller.seller_profile.credits,
                'credits_consumed': livestream.credits_consumed,
                'time_until_next_deduction_minutes': time_until_next.total_seconds() // 60 if time_until_next else None
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def heartbeat(self, request, pk=None):
        """Update livestream activity heartbeat to prevent auto-ending due to inactivity"""
        try:
            livestream = self.get_object()
            
            # Check permissions - only seller can send heartbeat
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Check if livestream is still live
            if livestream.status != 'live':
                return Response({'error': 'Livestream is not currently live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Update last activity time and reset warning flag
            livestream.last_activity = timezone.now()
            livestream.auto_end_warned = False
            livestream.save(update_fields=['last_activity', 'auto_end_warned'])
            
            return Response({
                'message': 'Heartbeat recorded successfully',
                'last_activity': livestream.last_activity,
                'remaining_credits': livestream.seller.seller_profile.credits,
                'credits_consumed': livestream.credits_consumed
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class StartLiveStreamView(generics.UpdateAPIView):
    queryset = LiveStream.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            livestream = self.get_object()
            
            # Check permissions
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Check seller credits
            seller_profile = request.user.seller_profile
            if seller_profile.credits < 1:
                return Response({'error': 'Insufficient credits to start livestream'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if already live
            if livestream.status == 'live':
                return Response({'error': 'Livestream is already live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Start the livestream
            with transaction.atomic():
                livestream.status = 'live'
                livestream.actual_start_time = timezone.now()
                livestream.last_credit_deduction = timezone.now()  # Set initial deduction time
                livestream.last_activity = timezone.now()  # Set initial activity time
                livestream.auto_end_warned = False  # Reset warning flag
                livestream.credits_consumed = 1  # Initialize credits consumed
                livestream.save()
                
                # Deduct initial 1 credit
                seller_profile.credits -= 1
                seller_profile.save()
            
            return Response({
                'message': 'Livestream started successfully',
                'agora_channel_name': livestream.agora_channel_name,
                'remaining_credits': seller_profile.credits
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class EndLiveStreamView(generics.UpdateAPIView):
    queryset = LiveStream.objects.all()
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            livestream = self.get_object()
            
            # Check permissions
            if livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Check if actually live
            if livestream.status != 'live':
                return Response({'error': 'Livestream is not currently live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # End the livestream
            with transaction.atomic():
                livestream.status = 'ended'
                livestream.end_time = timezone.now()
                
                # Calculate credits consumed based on duration
                if livestream.actual_start_time:
                    duration_minutes = int((timezone.now() - livestream.actual_start_time).total_seconds() / 60)
                    credits_consumed = max(1, duration_minutes // 30)  # 1 credit per 30 minutes
                    livestream.credits_consumed = credits_consumed
                
                livestream.save()
                
                # Mark all viewers as inactive
                LiveStreamViewer.objects.filter(
                    livestream=livestream, 
                    is_active=True
                ).update(is_active=False, left_at=timezone.now())
                
                # End all active biddings
                ProductBidding.objects.filter(
                    livestream=livestream, 
                    status='active'
                ).update(status='ended', ended_at=timezone.now())
            
            return Response({
                'message': 'Livestream ended successfully',
                'duration_minutes': livestream.duration_minutes,
                'credits_consumed': livestream.credits_consumed
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class JoinLiveStreamView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            livestream = LiveStream.objects.get(id=pk)
            
            # Check if livestream is live
            if livestream.status != 'live':
                return Response({'error': 'Livestream is not currently live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user is banned
            from chat.models import BannedUser
            if BannedUser.objects.filter(
                livestream=livestream, 
                user=request.user, 
                is_active=True
            ).exists():
                return Response({'error': 'You are banned from this livestream'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Create or update viewer record
            viewer, created = LiveStreamViewer.objects.get_or_create(
                livestream=livestream,
                viewer=request.user,
                defaults={'is_active': True}
            )
            
            if not created and not viewer.is_active:
                viewer.is_active = True
                viewer.joined_at = timezone.now()
                viewer.left_at = None
                viewer.save()
            
            # Update viewer count
            livestream.viewer_count = LiveStreamViewer.objects.filter(
                livestream=livestream, 
                is_active=True
            ).count()
            livestream.save()
            
            return Response({
                'message': 'Joined livestream successfully',
                'agora_channel_name': livestream.agora_channel_name,
                'viewer_count': livestream.viewer_count
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class LeaveLiveStreamView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            livestream = LiveStream.objects.get(id=pk)
            
            # Update viewer record
            try:
                viewer = LiveStreamViewer.objects.get(
                    livestream=livestream,
                    viewer=request.user,
                    is_active=True
                )
                viewer.is_active = False
                viewer.left_at = timezone.now()
                viewer.save()
                
                # Update viewer count
                livestream.viewer_count = LiveStreamViewer.objects.filter(
                    livestream=livestream, 
                    is_active=True
                ).count()
                livestream.save()
                
                return Response({'message': 'Left livestream successfully'})
                
            except LiveStreamViewer.DoesNotExist:
                return Response({'error': 'You are not currently viewing this livestream'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class AgoraTokenView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        try:
            livestream = LiveStream.objects.get(id=pk)
            
            # Check if user has permission to join
            if livestream.status != 'live':
                return Response({'error': 'Livestream is not currently live'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Generate Agora token
            app_id = settings.AGORA_APP_ID
            app_certificate = settings.AGORA_APP_CERTIFICATE
            
            # Handle missing Agora credentials in development
            if not app_id or not app_certificate or app_id.startswith('dummy'):
                return Response({
                    'channel_name': livestream.agora_channel_name,
                    'token': 'dummy_token_for_development',
                    'uid': 12345,
                    'app_id': 'dummy_app_id',
                    'message': 'Using dummy Agora credentials for development'
                })
            
            channel_name = livestream.agora_channel_name
            # Convert UUID to integer for Agora UID (take first 9 digits of hex and convert)
            user_id_hex = str(request.user.id).replace('-', '')[:9]
            try:
                uid = int(user_id_hex, 16) % 2147483647  # Ensure it fits in 32-bit signed int
            except ValueError:
                uid = abs(hash(str(request.user.id))) % 2147483647
            
            role = 1  # Publisher for seller, Subscriber for viewers
            
            if livestream.seller == request.user:
                role = 1  # Publisher
            else:
                role = 2  # Subscriber
            
            privilege_expired_ts = int(time.time()) + 3600  # 1 hour
            
            token = RtcTokenBuilder.buildTokenWithUid(
                app_id, app_certificate, channel_name, uid, role, privilege_expired_ts
            )
            
            return Response({
                'channel_name': channel_name,
                'token': token,
                'uid': uid,
                'app_id': app_id
            })
            
        except LiveStream.DoesNotExist:
            return Response({'error': 'Livestream not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Error generating Agora token: {str(e)}'}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductBiddingViewSet(viewsets.ModelViewSet):
    serializer_class = ProductBiddingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = ProductBidding.objects.select_related(
            'livestream', 'product', 'winner'
        ).prefetch_related('bids')
        
        # Filter by livestream
        livestream_id = self.request.query_params.get('livestream', None)
        if livestream_id:
            queryset = queryset.filter(livestream_id=livestream_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-started_at')
    
    def perform_create(self, serializer):
        # Only livestream seller can create biddings
        livestream_id = self.request.data.get('livestream')
        product_id = self.request.data.get('product')
        
        try:
            livestream = LiveStream.objects.get(id=livestream_id)
            if livestream.seller != self.request.user:
                raise PermissionError("Only livestream owner can create biddings")
            
            # Production: Only allow bidding during live streams
            if livestream.status != 'live':
                raise PermissionError("Can only create bidding during live stream")
            
            # Check if product has available quantity
            if product_id:
                from products.models import Product
                try:
                    product = Product.objects.get(id=product_id)
                    if product.quantity <= 0:
                        raise PermissionError("Cannot start bidding on out-of-stock product")
                    if product.status == 'sold_out':
                        raise PermissionError("Cannot start bidding on sold out product")
                except Product.DoesNotExist:
                    raise PermissionError("Product not found")
            
            # Calculate ends_at based on timer_duration
            from django.utils import timezone
            from datetime import timedelta
            
            timer_duration = self.request.data.get('timer_duration', 60)  # Default 60 seconds
            ends_at = timezone.now() + timedelta(seconds=int(timer_duration))
            
            bidding = serializer.save(livestream=livestream, ends_at=ends_at)
            
            # Send WebSocket notification for bidding started
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            
            channel_layer = get_channel_layer()
            if channel_layer:
                room_group_name = f'livestream_{livestream.id}'
                
                # Include full product data with images
                from products.serializers import ProductListSerializer
                product_serializer = ProductListSerializer(bidding.product)
                
                bidding_data = {
                    'bidding_id': str(bidding.id),
                    'product_id': str(bidding.product.id),
                    'product_name': bidding.product.name,
                    'product_data': product_serializer.data,  # Full product data with images
                    'starting_price': float(bidding.starting_price),
                    'current_highest_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else float(bidding.starting_price),
                    'timer_duration': timer_duration,
                    'ends_at': bidding.ends_at.isoformat(),
                    'started_at': bidding.started_at.isoformat(),
                    'status': bidding.status,
                    'seller_name': livestream.seller.username,
                    'bid_increment': 50.0  # Default bid increment
                }
                
                print(f"📡 Sending bidding_started event with product data: {product_serializer.data}")
                
                async_to_sync(channel_layer.group_send)(
                    room_group_name,
                    {
                        'type': 'bidding_started',
                        'data': bidding_data
                    }
                )
            
            # Start the simple timer service if not already running
            from .simple_timer import start_timer_service
            start_timer_service()
            
        except LiveStream.DoesNotExist:
            raise PermissionError("Livestream not found")

class PlaceBidView(generics.CreateAPIView):
    serializer_class = PlaceBidSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            bidding = ProductBidding.objects.get(id=pk)
            
            # Check if user is a buyer
            if request.user.user_type != 'buyer':
                return Response({'error': 'Only buyers can place bids'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            # Check if bidding is active
            if bidding.status != 'active':
                return Response({'error': 'Bidding is not active'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Check if bidding has ended
            if timezone.now() > bidding.ends_at:
                return Response({'error': 'Bidding time has expired'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(
                data=request.data, 
                context={'bidding': bidding}
            )
            serializer.is_valid(raise_exception=True)
            
            amount = serializer.validated_data['amount']
            
            with transaction.atomic():
                # Mark previous bids as not winning
                Bid.objects.filter(bidding=bidding).update(is_winning=False)
                
                # Create new bid
                bid = Bid.objects.create(
                    bidding=bidding,
                    bidder=request.user,
                    amount=amount,
                    is_winning=True
                )
                
                # Update bidding
                bidding.current_highest_bid = amount
                bidding.save()
                
                # Send WebSocket notification
                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync
                
                channel_layer = get_channel_layer()
                if channel_layer:
                    room_group_name = f'livestream_{bidding.livestream.id}'
                    
                    bid_data = {
                        'bidding_id': str(bidding.id),
                        'amount': float(amount),
                        'bid_amount': float(amount),
                        'user_id': str(request.user.id),
                        'user_name': request.user.username,
                        'username': request.user.username,
                        'timestamp': timezone.now().isoformat(),
                        'user_type': getattr(request.user, 'user_type', 'buyer'),
                        'current_highest_bid': float(amount),
                        'product_name': bidding.product.name
                    }
                    
                    async_to_sync(channel_layer.group_send)(
                        room_group_name,
                        {
                            'type': 'bid_placed',
                            'data': bid_data
                        }
                    )
            
            return Response({
                'message': 'Bid placed successfully',
                'bid': BidSerializer(bid).data,
                'current_highest_bid': amount
            })
            
        except ProductBidding.DoesNotExist:
            return Response({'error': 'Bidding not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class EndBiddingView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            bidding = ProductBidding.objects.get(id=pk)
            
            # Check permissions
            if bidding.livestream.seller != request.user:
                return Response({'error': 'Permission denied'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            if bidding.status != 'active':
                return Response({'error': 'Bidding is not active'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # No need to stop timer in simple timer implementation
            # The timer service automatically handles ended biddings
            
            with transaction.atomic():
                # End the bidding
                bidding.status = 'ended'
                bidding.ended_at = timezone.now()
                
                # Determine winner
                winning_bid = Bid.objects.filter(
                    bidding=bidding, 
                    is_winning=True
                ).first()
                
                if winning_bid:
                    bidding.winner = winning_bid.bidder
                    
                    # Add to winner's cart
                    from orders.models import Cart, CartItem
                    cart, created = Cart.objects.get_or_create(user=winning_bid.bidder)
                    
                    CartItem.objects.create(
                        cart=cart,
                        product=bidding.product,
                        bidding=bidding,
                        quantity=1,
                        price=winning_bid.amount
                    )
                    
                    # Reduce product quantity by 1 (since bidding is always for 1 item)
                    if bidding.product.quantity > 0:
                        bidding.product.quantity -= 1
                        bidding.product.save()
                        print(f'Product {bidding.product.name} quantity reduced to {bidding.product.quantity}')
                        
                        # Update status if sold out
                        if bidding.product.quantity == 0:
                            bidding.product.status = 'sold_out'
                            bidding.product.save()
                
                bidding.save()
                
                # Send WebSocket notification
                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync
                
                channel_layer = get_channel_layer()
                if channel_layer:
                    room_group_name = f'livestream_{bidding.livestream.id}'
                    
                    winner_data = {
                        'bidding_id': str(bidding.id),
                        'winner_id': str(bidding.winner.id) if bidding.winner else None,
                        'winner_name': bidding.winner.username if bidding.winner else None,
                        'winning_bid': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                        'winning_amount': float(bidding.current_highest_bid) if bidding.current_highest_bid else 0,
                        'product_id': str(bidding.product.id),
                        'product_name': bidding.product.name,
                        'product_quantity_remaining': bidding.product.quantity,
                        'ended_at': bidding.ended_at.isoformat(),
                        'manually_ended': True
                    }
                    
                    async_to_sync(channel_layer.group_send)(
                        room_group_name,
                        {
                            'type': 'bidding_ended',
                            'data': winner_data
                        }
                    )
            
            return Response({
                'message': 'Bidding ended successfully',
                'winner': bidding.winner.username if bidding.winner else None,
                'winning_amount': bidding.current_highest_bid
            })
            
        except ProductBidding.DoesNotExist:
            return Response({'error': 'Bidding not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

class CreditMonitorStatusView(generics.GenericAPIView):
    """
    View to check the status of the background credit monitor
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get credit monitor status"""
        from .background_monitor import get_monitor
        
        monitor = get_monitor()
        status_data = monitor.get_status()
        
        # Add additional info
        live_streams = LiveStream.objects.filter(status='live').select_related('seller__seller_profile')
        
        streams_info = []
        for stream in live_streams:
            last_activity = stream.last_activity
            time_since_activity = None
            if last_activity:
                time_since_activity = int((timezone.now() - last_activity).total_seconds() // 60)
            
            streams_info.append({
                'id': str(stream.id),
                'seller': stream.seller.username,
                'title': stream.title,
                'credits_consumed': stream.credits_consumed,
                'seller_credits_remaining': stream.seller.seller_profile.credits,
                'last_activity_minutes_ago': time_since_activity,
                'auto_end_warned': stream.auto_end_warned,
                'started_at': stream.actual_start_time
            })
        
        return Response({
            'monitor_status': status_data,
            'active_streams': streams_info,
            'total_active_streams': len(streams_info),
            'monitor_configuration': {
                'credit_deduction_interval_minutes': CreditMonitorService.CREDIT_DEDUCTION_INTERVAL,
                'inactivity_warning_minutes': CreditMonitorService.INACTIVITY_WARNING_TIME,
                'auto_end_minutes': CreditMonitorService.INACTIVITY_AUTO_END_TIME
            }
        })

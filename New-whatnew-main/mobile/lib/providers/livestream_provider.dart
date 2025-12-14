import 'package:flutter/widgets.dart';
import '../models/livestream.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import '../services/agora_service.dart';
import '../services/storage_service.dart';

class LivestreamProvider extends ChangeNotifier {
  List<LiveStream> _livestreams = [];
  List<LiveStream> _liveNow = [];
  LiveStream? _currentLivestream;
  List<ProductBidding> _currentBiddings = [];
  ProductBidding? _activeBidding;
  List<Map<String, dynamic>> _chatMessages = [];
  
  bool _isLoading = false;
  bool _isJoined = false;
  String? _error;
  int _viewerCount = 0;
  
  // WebSocket service instance
  final WebSocketService _webSocketService = WebSocketService();
  
  // Callback for auto-opening bidding interface
  VoidCallback? _onBiddingStarted;
  
  // Getters
  List<LiveStream> get livestreams => _livestreams;
  List<LiveStream> get liveNow => _liveNow;
  LiveStream? get currentLivestream => _currentLivestream;
  List<ProductBidding> get currentBiddings => _currentBiddings;
  ProductBidding? get activeBidding => _activeBidding;
  List<Map<String, dynamic>> get chatMessages => _chatMessages;
  bool get isLoading => _isLoading;
  bool get isJoined => _isJoined;
  String? get error => _error;
  int get viewerCount => _viewerCount;

  // Initialize provider
  void init() {
    _setupWebSocketListeners();
  }

  // Set callback for when bidding starts (auto-open bidding interface)
  void setBiddingStartedCallback(VoidCallback? callback) {
    _onBiddingStarted = callback;
  }

  // Get all livestreams
  Future<bool> getLivestreams({
    String? status,
    int? seller,
    String? category,
    int? page,
  }) async {
    try {
      _setLoading(true);
      _error = null;

      // print('LivestreamProvider: Fetching livestreams with params: status=$status, seller=$seller, category=$category, page=$page');

      final response = await ApiService.getLivestreams(
        status: status,
        seller: seller,
        category: category,
        page: page,
      );

      // print('LivestreamProvider: API response type: ${response.runtimeType}');
      // print('LivestreamProvider: API response: $response');

      // Handle both paginated and direct list responses
      List<dynamic> livestreamList;
      if (response is Map<String, dynamic> && response.containsKey('results')) {
        livestreamList = response['results'] ?? [];
        // print('LivestreamProvider: Using paginated results, count: ${livestreamList.length}');
      } else if (response is List) {
        livestreamList = response;
        // print('LivestreamProvider: Using direct list, count: ${livestreamList.length}');
      } else {
        // print('LivestreamProvider: Unexpected response format, using empty list');
        livestreamList = [];
      }

      // Validate each item in the list
      final validLivestreams = <LiveStream>[];
      for (int i = 0; i < livestreamList.length; i++) {
        try {
          final item = livestreamList[i];
          if (item is Map<String, dynamic>) {
            final livestream = LiveStream.fromJson(item);
            validLivestreams.add(livestream);
          } else {
            // print('LivestreamProvider: Invalid item at index $i: ${item.runtimeType} - $item');
          }
        } catch (e) {
          // print('LivestreamProvider: Error parsing livestream at index $i: $e');
        }
      }

      _livestreams = validLivestreams;
      // print('LivestreamProvider: Successfully parsed ${_livestreams.length} livestreams');

      // Filter by category if provided
      if (category != null && category.isNotEmpty) {
        _livestreams = _livestreams
            .where((livestream) => 
                livestream.categoryName.toLowerCase() == category.toLowerCase())
            .toList();
        // print('LivestreamProvider: Filtered by category "$category", remaining: ${_livestreams.length}');
      }

      _setLoading(false);
      return true;
    } catch (e) {
      // print('LivestreamProvider: Error in getLivestreams: $e');
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Get live streams now
  Future<bool> getLiveNow() async {
    try {
      _setLoading(true);
      _error = null;

      // print('LivestreamProvider: Fetching live now streams');

      final response = await ApiService.getLiveNow();
      // print('LivestreamProvider: Live now response type: ${response.runtimeType}');
      // print('LivestreamProvider: Live now response: $response');

      // Process the response list
      final validLivestreams = <LiveStream>[];
      for (int i = 0; i < response.length; i++) {
        try {
          final item = response[i];
          if (item is Map<String, dynamic>) {
            final livestream = LiveStream.fromJson(item);
            validLivestreams.add(livestream);
          } else {
            // print('LivestreamProvider: Invalid live now item at index $i: ${item.runtimeType} - $item');
          }
        } catch (e) {
          // print('LivestreamProvider: Error parsing live now stream at index $i: $e');
        }
      }
      _liveNow = validLivestreams;
      // print('LivestreamProvider: Successfully parsed ${_liveNow.length} live streams');

      _setLoading(false);
      return true;
    } catch (e) {
      // print('LivestreamProvider: Error in getLiveNow: $e');
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Get specific livestream
  Future<bool> getLivestream(String livestreamId) async {
    try {
      _setLoading(true);
      _error = null;

      final response = await ApiService.getLivestream(livestreamId);
      _currentLivestream = LiveStream.fromJson(response);

      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Get livestream by ID (alias for getLivestream)
  Future<LiveStream?> getLivestreamById(String livestreamId) async {
    final success = await getLivestream(livestreamId);
    return success ? _currentLivestream : null;
  }

  // Get Agora token for livestream
  Future<String?> getAgoraToken(String livestreamId) async {
    try {
      final response = await ApiService.getAgoraToken(livestreamId);
      return response['token'];
    } catch (e) {
      _error = e.toString();
      return null;
    }
  }

  // Join livestream
  Future<bool> joinLivestream(String livestreamId) async {
    try {
      _setLoading(true);
      _error = null;

      // Join via API
      final response = await ApiService.joinLivestream(livestreamId);
      
      // Connect to WebSocket
      await _webSocketService.connectToLivestream(livestreamId);
      await _webSocketService.connectToChat(livestreamId);
      
      // Join Agora channel if tokens provided
      if (response['agora_token'] != null && response['agora_channel'] != null) {
        await AgoraService.joinChannel(
          channelName: response['agora_channel'],
          token: response['agora_token'],
          uid: 0, // Use 0 for audience
        );
      }

      _webSocketService.joinLivestream(livestreamId);
      _isJoined = true;
      
      // Get biddings for this livestream
      await getBiddings(livestreamId: livestreamId);
      
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  // Leave livestream
  Future<void> leaveLivestream() async {
    try {
      if (_currentLivestream != null) {
        _webSocketService.leaveLivestream(_currentLivestream!.id);
        await ApiService.leaveLivestream(_currentLivestream!.id);
        await AgoraService.leaveChannel();
        _webSocketService.disconnectAll();
      }
      
      _isJoined = false;
      _currentLivestream = null;
      _currentBiddings = [];
      _activeBidding = null;
      _chatMessages = [];
      _viewerCount = 0;
      
      notifyListeners();
    } catch (e) {
      // print('Error leaving livestream: $e');
    }
  }

  // Get biddings
  Future<bool> getBiddings({
    String? livestreamId,
    String? status,
    int? page,
  }) async {
    try {
      final response = await ApiService.getBiddings(
        livestream: livestreamId,
        status: status,
        page: page,
      );

      _currentBiddings = (response['results'] as List<dynamic>)
          .map((json) => ProductBidding.fromJson(json))
          .toList();

      // Find active bidding
      _activeBidding = _currentBiddings
          .where((bidding) => bidding.status == 'active')
          .isNotEmpty 
          ? _currentBiddings.firstWhere((bidding) => bidding.status == 'active')
          : null;

      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }

  // Place bid
  Future<bool> placeBid(String biddingId, double amount) async {
    try {
      _error = null;

      await ApiService.placeBid(biddingId, amount);
      
      // Also send via WebSocket for real-time updates
      _webSocketService.placeBid(_currentLivestream!.id, biddingId, amount);
      
      // Refresh biddings
      if (_currentLivestream != null) {
        await getBiddings(livestreamId: _currentLivestream!.id);
      }

      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }

  // Send chat message
  void sendChatMessage(String message) {
    _webSocketService.sendChatMessage(_currentLivestream!.id, message);
  }

  // Setup WebSocket listeners
  void _setupWebSocketListeners() {
    // Livestream events
    _webSocketService.livestreamStream.listen((event) {
      switch (event['type']) {
        case 'viewer_joined':
          _viewerCount++;
          notifyListeners();
          break;
        case 'viewer_left':
          _viewerCount--;
          notifyListeners();
          break;
        case 'livestream_ended':
          _handleLivestreamEnded();
          break;
      }
    });

    // Chat events
    _webSocketService.chatStream.listen((event) {
      switch (event['type']) {
        case 'chat_message':
          _chatMessages.add(event['data']);
          notifyListeners();
          break;
        case 'message_deleted':
          _handleMessageDeleted(event['data']);
          break;
      }
    });

    // Bidding events
    _webSocketService.biddingStream.listen((event) {
      switch (event['type']) {
        case 'bid_placed':
          _handleBidPlaced(event['data']);
          break;
        case 'bidding_started':
          _handleBiddingStarted(event['data']);
          break;
        case 'bidding_ended':
          _handleBiddingEnded(event['data']);
          break;
        case 'bidding_timer_update':
          _handleBiddingTimerUpdate(event['data']);
          break;
      }
    });
  }

  // Handle livestream ended
  void _handleLivestreamEnded() {
    _isJoined = false;
    _activeBidding = null;
    notifyListeners();
  }

  // Handle bid placed
  void _handleBidPlaced(Map<String, dynamic> data) {
    try {
      // print('Handling bid placed: $data');
      
      // Update active bidding with new highest bid
      if (_activeBidding != null && _activeBidding!.id == data['bidding_id']) {
        // Create updated bidding data
        final updatedBiddingData = {
          'id': _activeBidding!.id,
          'product_data': _activeBidding!.product.toJson(),
          'livestream': _activeBidding!.livestreamId,
          'livestream_title': _activeBidding!.livestreamTitle,
          'starting_price': _activeBidding!.startingPrice.toString(),
          'current_highest_bid': data['amount']?.toString() ?? data['bid_amount']?.toString(),
          'timer_duration': _activeBidding!.timerDuration,
          'status': _activeBidding!.status,
          'started_at': _activeBidding!.startedAt?.toIso8601String(),
          'ends_at': _activeBidding!.endsAt?.toIso8601String(),
          'ended_at': _activeBidding!.endedAt?.toIso8601String(),
          'winner': _activeBidding!.winnerId,
          'winner_name': _activeBidding!.winnerName,
          'bids': _activeBidding!.bids.map((b) => b.toJson()).toList(),
        };
        
        _activeBidding = ProductBidding.fromJson(updatedBiddingData);
        
        // Update in biddings list as well
        final existingIndex = _currentBiddings.indexWhere((b) => b.id == _activeBidding!.id);
        if (existingIndex != -1) {
          _currentBiddings[existingIndex] = _activeBidding!;
        }
        
        // print('Updated active bidding with new highest bid: ${data['amount'] ?? data['bid_amount']}');
        notifyListeners();
      }
    } catch (e) {
      // print('Error handling bid placed: $e');
      // Fallback: refresh biddings from API
      if (_currentLivestream != null) {
        getBiddings(livestreamId: _currentLivestream!.id);
      }
    }
  }

  // Handle bidding started
  void _handleBiddingStarted(Map<String, dynamic> data) {
    try {
      // print('🎯 Handling bidding started: $data');
      
      // Create a new ProductBidding from WebSocket data
      // Use product_data if available, otherwise construct basic product info
      Map<String, dynamic> productData;
      if (data.containsKey('product_data') && data['product_data'] != null) {
        productData = data['product_data'];
        // print('✅ Using full product_data from WebSocket');
      } else {
        // Fallback: construct basic product data
        productData = {
          'id': data['product_id'] ?? '',
          'name': data['product_name'] ?? 'Unknown Product',
          'base_price': data['starting_price']?.toString() ?? '0',
          'description': '',
          'category_name': '',
          'status': 'active',
          'available_quantity': 1,
          'primary_image': null,
          'images': [],
        };
        // print('⚠️ Using fallback product data');
      }
      
      final biddingData = {
        'id': data['bidding_id'] ?? data['id'],
        'product_data': productData,
        'livestream': data['livestream'] ?? data['livestream_id'] ?? _currentLivestream?.id ?? '',
        'livestream_title': data['livestream_title'] ?? _currentLivestream?.title ?? '',
        'starting_price': data['starting_price']?.toString() ?? '0',
        'current_highest_bid': data['current_highest_bid']?.toString() ?? data['starting_price']?.toString() ?? '0',
        'timer_duration': data['timer_duration'] ?? data['duration'] ?? 60,
        'status': data['status'] ?? 'active',
        'started_at': data['started_at'],
        'ends_at': data['ends_at'],
        'ended_at': data['ended_at'],
        'winner': data['winner'],
        'winner_name': data['winner_name'],
        'bids': [],
      };
      
      final newBidding = ProductBidding.fromJson(biddingData);
      _activeBidding = newBidding;
      
      // Add to current biddings if not already present
      final existingIndex = _currentBiddings.indexWhere((b) => b.id == newBidding.id);
      if (existingIndex == -1) {
        _currentBiddings.add(newBidding);
      } else {
        _currentBiddings[existingIndex] = newBidding;
      }
      
      // print('✅ Successfully updated active bidding: ${newBidding.id}');
      // print('🎯 Product name: ${newBidding.product.name}');
      // print('🖼️ Product image available: ${newBidding.product.primaryImage != null}');
      if (newBidding.product.primaryImage != null) {
        // print('🖼️ Image URL: ${newBidding.product.primaryImage!.fullImageUrl}');
      }
      
      notifyListeners();
      
      // Auto-open bidding interface if callback is set
      if (_onBiddingStarted != null) {
        // print('🚀 Auto-opening bidding interface...');
        _onBiddingStarted!();
      } else {
        // print('⚠️ No bidding started callback set');
      }
    } catch (e) {
      // print('❌ Error handling bidding started: $e');
      // print('Stack trace: ${StackTrace.current}');
      // Fallback: refresh biddings from API
      if (_currentLivestream != null) {
        getBiddings(livestreamId: _currentLivestream!.id);
      }
    }
  }

  // Handle bidding ended
  void _handleBiddingEnded(Map<String, dynamic> data) {
    if (_activeBidding != null && _activeBidding!.id == data['bidding_id']) {
      _activeBidding = null;
      
      // Check if current user won
      if (data['winner_id'] != null) {
        final winnerName = data['winner_name'] ?? 'Unknown';
        final winningAmount = data['winning_bid'] ?? data['amount'] ?? 0;
        final winnerId = data['winner_id'];
        
        // Get current user ID from storage
        final currentUserId = StorageService.getUserId();
        final isCurrentUserWinner = winnerId == currentUserId;
        
        // print('🎉 Bidding ended! Winner: $winnerName with bid: ₹$winningAmount');
        if (isCurrentUserWinner) {
          // print('🏆 Current user is the winner!');
        }
        
        // Show winner announcement in UI
        _showWinnerAnnouncement(winnerName, winningAmount, isCurrentUserWinner);
      }
      
      notifyListeners();
    }
  }
  
  // Show winner announcement
  void _showWinnerAnnouncement(String winnerName, dynamic winningAmount, bool isCurrentUserWinner) {
    // This can be accessed by the UI to show winner popup/snackbar
    _lastWinnerData = {
      'winner_name': winnerName,
      'winning_amount': winningAmount,
      'is_current_user_winner': isCurrentUserWinner,
      'timestamp': DateTime.now(),
    };
    notifyListeners();
  }
  
  Map<String, dynamic>? _lastWinnerData;
  Map<String, dynamic>? get lastWinnerData => _lastWinnerData;
  
  // Clear winner data after it's been displayed
  void clearWinnerData() {
    _lastWinnerData = null;
    notifyListeners();
  }

  // Handle bidding timer update
  void _handleBiddingTimerUpdate(Map<String, dynamic> data) {
    try {
      // print('Handling bidding timer update: $data');
      // print('🔍 Checking for product_data in timer update...');
      // print('🔍 data.containsKey(\'product_data\'): ${data.containsKey('product_data')}');
      if (data.containsKey('product_data')) {
        // print('🔍 data[\'product_data\']: ${data['product_data']}');
        // print('🔍 data[\'product_data\'] != null: ${data['product_data'] != null}');
      }
      
      if (_activeBidding != null && _activeBidding!.id == data['bidding_id']) {
        // Update the ends_at time based on remaining time
        final remainingTime = data['remaining_time'] as int? ?? 0;
        final newEndsAt = DateTime.now().add(Duration(seconds: remainingTime));
        
        // Use fresh product data from timer update if available, otherwise use existing
        Map<String, dynamic> productData;
        if (data.containsKey('product_data') && data['product_data'] != null) {
          productData = data['product_data'];
          // print('🆕 Using fresh product data from timer update: $productData');
        } else {
          productData = _activeBidding!.product.toJson();
          // print('⚠️ Using cached product data: $productData');
        }
        
        // Create updated bidding data
        final updatedBiddingData = {
          'id': _activeBidding!.id,
          'product_data': productData,
          'livestream': _activeBidding!.livestreamId,
          'livestream_title': _activeBidding!.livestreamTitle,
          'starting_price': _activeBidding!.startingPrice.toString(),
          'current_highest_bid': (data['current_highest_bid'] ?? _activeBidding!.currentHighestBid)?.toString(),
          'timer_duration': _activeBidding!.timerDuration,
          'status': _activeBidding!.status,
          'started_at': _activeBidding!.startedAt?.toIso8601String(),
          'ends_at': newEndsAt.toIso8601String(),
          'ended_at': _activeBidding!.endedAt?.toIso8601String(),
          'winner': _activeBidding!.winnerId,
          'winner_name': _activeBidding!.winnerName,
          'bids': _activeBidding!.bids.map((b) => b.toJson()).toList(),
        };
        
        _activeBidding = ProductBidding.fromJson(updatedBiddingData);
        
        // Update in biddings list as well
        final existingIndex = _currentBiddings.indexWhere((b) => b.id == _activeBidding!.id);
        if (existingIndex != -1) {
          _currentBiddings[existingIndex] = _activeBidding!;
        }
        
        // print('Updated bidding timer: ${remainingTime}s remaining');
        notifyListeners();
      }
    } catch (e) {
      // print('Error handling bidding timer update: $e');
    }
  }

  // Handle message deleted
  void _handleMessageDeleted(Map<String, dynamic> data) {
    _chatMessages.removeWhere((msg) => msg['id'] == data['message_id']);
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Helper method to set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    // Use post-frame callback to avoid setState during build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      notifyListeners();
    });
  }

  @override
  void dispose() {
    _webSocketService.dispose();
    AgoraService.dispose();
    super.dispose();
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import '../../providers/livestream_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/livestream.dart';
import '../../widgets/custom_button.dart';
import '../../constants/app_colors.dart';
import '../../services/agora_service.dart';
import '../../services/websocket_service.dart';
import 'widgets/chat_widget.dart';
import 'widgets/bidding_widget.dart';

class LivestreamDetailScreen extends StatefulWidget {
  final String livestreamId;

  const LivestreamDetailScreen({
    super.key,
    required this.livestreamId,
  });

  @override
  State<LivestreamDetailScreen> createState() => _LivestreamDetailScreenState();
}

class _LivestreamDetailScreenState extends State<LivestreamDetailScreen> {
  RtcEngine? _rtcEngine;
  bool _isJoined = false;
  bool _isLoading = true;
  bool _isDisposing = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initializeScreen();
  }

  @override
  void dispose() {
    // Set a flag to prevent setState calls during disposal
    _isDisposing = true;
    _dispose();
    super.dispose();
  }

  Future<void> _initializeScreen() async {
    final livestreamProvider = Provider.of<LivestreamProvider>(context, listen: false);
    final webSocketService = Provider.of<WebSocketService>(context, listen: false);
    
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      // Initialize LivestreamProvider
      livestreamProvider.init();
      
      // Set callback for auto-opening bidding when seller starts it
      livestreamProvider.setBiddingStartedCallback(() {
        // print('🚀 Bidding started callback triggered');
        if (mounted && !_isDisposing) {
          final currentLivestream = livestreamProvider.currentLivestream;
          if (currentLivestream != null) {
            // print('✅ Auto-opening bidding interface for: ${currentLivestream.title}');
            _openBiddingInterface(currentLivestream, livestreamProvider);
          } else {
            // print('⚠️ No current livestream available for auto-open');
          }
        } else {
          // print('⚠️ Cannot auto-open: widget not mounted or disposing');
        }
      });

      // Get livestream details
      final livestream = await livestreamProvider.getLivestreamById(widget.livestreamId);
      if (livestream == null) {
        setState(() {
          _error = 'Failed to load livestream';
          _isLoading = false;
        });
        return;
      }

      // Connect to WebSocket for real-time updates
      // print('Connecting to WebSocket for livestream: ${widget.livestreamId}');
      await webSocketService.connectToLivestream(widget.livestreamId);
      await webSocketService.connectToChat(widget.livestreamId);

      // Initialize Agora if livestream is live
      final currentLivestream = livestreamProvider.currentLivestream;
      if (currentLivestream?.status == 'live') {
        await _initializeAgora();
        await _joinLivestream();
      }

      // Get current biddings
      await livestreamProvider.getBiddings(livestreamId: widget.livestreamId);

      setState(() {
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _initializeAgora() async {
    try {
      // Initialize and join livestream using backend credentials
      final success = await AgoraService.joinLivestreamWithBackendCredentials(widget.livestreamId);
      
      if (success) {
        // Listen for user events
        AgoraService.userJoinedStream.listen((userId) {
          _safeSetState(() {
            // print('User joined: $userId');
          });
        });
        
        AgoraService.userLeftStream.listen((userId) {
          _safeSetState(() {
            // print('User left: $userId');
          });
        });
        
        _safeSetState(() {
          _isJoined = true;
        });
        
        // print('Successfully joined Agora livestream');
      } else {
        // print('Failed to join Agora livestream');
      }
    } catch (e) {
      // print('Error initializing Agora: $e');
    }
  }

  Future<void> _joinLivestream() async {
    final livestreamProvider = Provider.of<LivestreamProvider>(context, listen: false);
    
    try {
      // Join livestream via API
      final success = await livestreamProvider.joinLivestream(widget.livestreamId);
      if (!success) {
        _showSnackBar('Failed to join livestream', isError: true);
        return;
      }

      // print('✅ Successfully joined livestream via API');
      
      // Agora integration is handled by _initializeAgora() method
      // which uses AgoraService.joinLivestreamWithBackendCredentials()
      
    } catch (e) {
      _showSnackBar('Failed to join livestream: $e', isError: true);
    }
  }

  Future<void> _leaveLivestream() async {
    // print('🔄 Leaving livestream...');
    
    try {
      // Only call provider and setState if not disposing
      if (!_isDisposing) {
        final livestreamProvider = Provider.of<LivestreamProvider>(context, listen: false);
        
        // Leave livestream via API and Agora
        await livestreamProvider.leaveLivestream();
        // print('✅ Left via provider');
        
        _safeSetState(() {
          _isJoined = false;
        });
      } else {
        // During disposal, manually ensure Agora cleanup
        await AgoraService.leaveChannel();
        _isJoined = false; // Update state without setState during disposal
        // print('✅ Left during disposal');
      }
    } catch (e) {
      // print('❌ Error leaving livestream: $e');
    }
  }

  Future<void> _dispose() async {
    // print('🔄 Starting dispose sequence for LivestreamDetailScreen');
    
    try {
      // 1. First disconnect WebSocket to stop receiving events
      final webSocketService = Provider.of<WebSocketService>(context, listen: false);
      webSocketService.disconnectAll();
      // print('✅ WebSocket disconnected');
      
      // 2. Leave livestream and Agora channel
      if (_isJoined) {
        await _leaveLivestream();
        // print('✅ Left livestream');
      }
      
      // 3. Ensure Agora service is properly disposed
      await AgoraService.dispose();
      // print('✅ Agora service disposed');
      
      // 4. Release RTC engine last
      await _rtcEngine?.release();
      _rtcEngine = null;
      // print('✅ RTC engine released');
      
    } catch (e) {
      // print('❌ Error during dispose: $e');
    }
    
    // print('✅ Dispose sequence completed');
  }

  void _showSnackBar(String message, {bool isError = false}) {
    // Avoid showing snackbar if widget is being disposed
    if (!_isDisposing && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: isError ? Colors.red : Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  // Helper method to safely call setState
  void _safeSetState(VoidCallback fn) {
    if (!_isDisposing && mounted) {
      setState(fn);
    }
  }

  // Show winner announcement dialog
  void _showWinnerAnnouncement(Map<String, dynamic> winnerData) {
    final winnerName = winnerData['winner_name'] ?? 'Unknown';
    final winningAmount = winnerData['winning_amount'] ?? 0;
    final isCurrentUserWinner = winnerData['is_current_user_winner'] ?? false;
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: isCurrentUserWinner ? Colors.green[50] : Colors.blue[50],
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              Icon(
                isCurrentUserWinner ? Icons.emoji_events : Icons.announcement,
                color: isCurrentUserWinner ? Colors.amber : Colors.blue,
                size: 28,
              ),
              const SizedBox(width: 8),
              Text(
                isCurrentUserWinner ? '🎉 Congratulations!' : '🎊 Bidding Ended!',
                style: TextStyle(
                  color: isCurrentUserWinner ? Colors.green[800] : Colors.blue[800],
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isCurrentUserWinner) ...[
                const Text(
                  'You won the bidding!',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Your winning bid: ₹${winningAmount.toString()}',
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 8),
                const Text(
                  'The product has been added to your cart automatically.',
                  style: TextStyle(color: Colors.grey),
                ),
              ] else ...[
                Text(
                  'Winner: $winnerName',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Winning bid: ₹${winningAmount.toString()}',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
            if (isCurrentUserWinner)
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  // Navigate to cart
                  Navigator.pushNamed(context, '/cart');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                ),
                child: const Text(
                  'View Cart',
                  style: TextStyle(color: Colors.white),
                ),
              ),
          ],
        );
      },
    );
  }

  void _openChatInterface(LiveStream livestream) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.3,
        maxChildSize: 0.9,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primaryColor,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.chat, color: Colors.white),
                    const SizedBox(width: 8),
                    const Text(
                      'Live Chat',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close, color: Colors.white),
                    ),
                  ],
                ),
              ),
              
              // Chat content
              Expanded(
                child: ChatWidget(
                  livestreamId: livestream.id,
                  scrollController: scrollController,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _openBiddingInterface(LiveStream livestream, LivestreamProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
          ),
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.primaryColor,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.gavel, color: Colors.white),
                    const SizedBox(width: 8),
                    const Text(
                      'Live Bidding',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close, color: Colors.white),
                    ),
                  ],
                ),
              ),
              
              // Bidding content
              Expanded(
                child: provider.activeBidding != null 
                    ? BiddingWidget(
                        bidding: provider.activeBidding!,
                        onBidPlaced: (amount) {
                          Navigator.pop(context);
                          _placeBid(provider.activeBidding!.id, amount);
                        },
                      )
                    : const Center(
                        child: Text(
                          'No active bidding',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Error: $_error',
                        style: const TextStyle(color: Colors.white),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      CustomButton(
                        text: 'Retry',
                        onPressed: _initializeScreen,
                      ),
                    ],
                  ),
                )
              : Consumer<LivestreamProvider>(
                  builder: (context, livestreamProvider, child) {
                    final livestream = livestreamProvider.currentLivestream;
                    if (livestream == null) {
                      return const Center(
                        child: Text(
                          'Livestream not found',
                          style: TextStyle(color: Colors.white),
                        ),
                      );
                    }
                    
                    // Show winner announcement if available
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      if (livestreamProvider.lastWinnerData != null) {
                        _showWinnerAnnouncement(livestreamProvider.lastWinnerData!);
                        livestreamProvider.clearWinnerData();
                      }
                    });

                    return Column(
                      children: [
                        // Video area - takes most of the screen
                        Expanded(
                          child: Stack(
                            children: [
                              // Video view - full area
                              _buildVideoView(livestream),
                              
                              // Top overlay bar
                              _buildTopBar(livestream),
                              
                              // Floating action buttons
                              _buildFloatingButtons(livestream, livestreamProvider),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
    );
  }

  Widget _buildVideoView(LiveStream livestream) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.black,
      child: Stack(
        children: [
          // Background gradient
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.grey[900]!,
                  Colors.black,
                ],
              ),
            ),
          ),
          
          // Video content or placeholder
          if (livestream.status == 'live' && _isJoined && AgoraService.remoteUid != null && AgoraService.remoteUid != 0)
            // Show actual video
            Center(
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: AgoraService.createRemoteView(AgoraService.remoteUid!),
              ),
            )
          else
            // Show placeholder content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    livestream.status == 'live' ? Icons.videocam_off : Icons.schedule,
                    size: 80,
                    color: Colors.white60,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    livestream.status == 'live' 
                        ? (_isJoined ? 'Waiting for stream...' : 'Connecting to stream...') 
                        : 'Stream ${livestream.status}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  if (livestream.status == 'scheduled') ...[
                    const SizedBox(height: 12),
                    Text(
                      'Starts at ${_formatDateTime(livestream.scheduledStartTime)}',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                  if (livestream.status == 'live' && !_isJoined) ...[
                    const SizedBox(height: 24),
                    const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTopBar(LiveStream livestream) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withOpacity(0.8),
                Colors.black.withOpacity(0.4),
                Colors.transparent,
              ],
            ),
          ),
          child: Row(
            children: [
              // Back button
              Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Title and seller info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      livestream.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      livestream.seller.shopName,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Status badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: livestream.status == 'live' ? Colors.red : Colors.grey,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      livestream.status.toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(width: 8),
              
              // Viewer count
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.visibility,
                      color: Colors.white,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${livestream.viewerCount}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFloatingButtons(LiveStream livestream, LivestreamProvider provider) {
    return Positioned(
      bottom: 30,
      right: 20,
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Bidding button - only show if there's an active bidding
            if (provider.activeBidding != null || provider.currentBiddings.isNotEmpty)
              Container(
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: FloatingActionButton(
                  heroTag: "bidding_button",
                  onPressed: () {
                    _openBiddingInterface(livestream, provider);
                  },
                  backgroundColor: AppColors.primaryColor,
                  elevation: 0,
                  child: const Icon(
                    Icons.gavel,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
              ),
            
            const SizedBox(height: 16),
            
            // Chat button
            Container(
              decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: FloatingActionButton(
                heroTag: "chat_button",
                onPressed: () {
                  _openChatInterface(livestream);
                },
                backgroundColor: AppColors.primaryColor,
                elevation: 0,
                child: const Icon(
                  Icons.chat,
                  color: Colors.white,
                  size: 24,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _placeBid(String biddingId, double amount) async {
    final livestreamProvider = Provider.of<LivestreamProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (!authProvider.isAuthenticated) {
      _showSnackBar('Please login to place a bid', isError: true);
      return;
    }

    // Find the bidding to check product quantity
    final bidding = livestreamProvider.activeBidding?.id == biddingId
        ? livestreamProvider.activeBidding
        : livestreamProvider.currentBiddings.firstWhere(
            (b) => b.id == biddingId,
            orElse: () => livestreamProvider.activeBidding!,
          );

    // Check if product is out of stock
    if (bidding != null && bidding.product.availableQuantity <= 0) {
      _showSnackBar(
        'This product is out of stock and cannot be bid on.',
        isError: true,
      );
      return;
    }
    
    final success = await livestreamProvider.placeBid(biddingId, amount);
    if (success) {
      _showSnackBar('Bid placed successfully!');
    } else {
      _showSnackBar(
        livestreamProvider.error ?? 'Failed to place bid',
        isError: true,
      );
    }
  }

  String _formatDateTime(DateTime? dateTime) {
    if (dateTime == null) return '';
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

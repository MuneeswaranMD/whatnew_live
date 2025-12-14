import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../services/api_service.dart';
import '../../../services/websocket_service.dart';
import '../../../constants/app_theme.dart';

class ChatWidget extends StatefulWidget {
  final String livestreamId;
  final ScrollController scrollController;

  const ChatWidget({
    super.key,
    required this.livestreamId,
    required this.scrollController,
  });

  @override
  State<ChatWidget> createState() => _ChatWidgetState();
}

class _ChatWidgetState extends State<ChatWidget> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _chatScrollController = ScrollController();
  List<Map<String, dynamic>> _messages = [];
  bool _isLoading = false;
  bool _isSending = false;
  WebSocketService? _webSocketService;

  @override
  void initState() {
    super.initState();
    _loadMessages();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Get WebSocket service and listen to chat messages
    _webSocketService = Provider.of<WebSocketService>(context, listen: false);
    _listenToChatMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _chatScrollController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    if (_isLoading) return;
    
    setState(() => _isLoading = true);
    
    try {
      final response = await ApiService.getChatMessages(widget.livestreamId);
      if (response['results'] != null) {
        setState(() {
          _messages = List<Map<String, dynamic>>.from(response['results']);
        });
        _scrollToBottom();
      }
    } catch (e) {
      // print('Error loading messages: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _sendMessage() async {
    final message = _messageController.text.trim();
    if (message.isEmpty || _isSending) return;

    setState(() => _isSending = true);
    
    try {
      // Use WebSocket for real-time messaging instead of API
      final webSocketService = Provider.of<WebSocketService>(context, listen: false);
      webSocketService.sendChatMessage(widget.livestreamId, message);
      
      _messageController.clear();
      // No need to refresh messages as they come via WebSocket
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send message: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => _isSending = false);
    }
  }

  void _listenToChatMessages() {
    _webSocketService?.chatStream.listen((message) {
      // print('🔵 RAW WebSocket message received: $message');
      
      // Extract the actual message data
      Map<String, dynamic> messageData;
      
      // Check if this is a WebSocket wrapper with 'data' field
      if (message.containsKey('data') && message['data'] is Map<String, dynamic>) {
        messageData = message['data'] as Map<String, dynamic>;
        // print('🔵 Using nested data: $messageData');
      } else {
        messageData = message;
        // print('🔵 Using direct message: $messageData');
      }
      
      // Prevent duplicate messages by checking message ID
      setState(() {
        String? messageId = messageData['id']?.toString();
        
        // If no ID, create a unique identifier
        if (messageId == null) {
          final content = messageData['content']?.toString() ?? '';
          final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
          final username = messageData['username']?.toString() ?? 'temp_user';
          messageId = '${username}_${content.hashCode}_$timestamp';
        }
        
        bool exists = _messages.any((existingMsg) {
          return existingMsg['id']?.toString() == messageId;
        });
        
        if (!exists) {
          _messages.add(messageData);
          // print('✅ Added new message: ${messageData['username']} - ${messageData['content']}');
        } else {
          // print('❌ Duplicate message ignored: $messageId');
        }
      });
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_chatScrollController.hasClients) {
        _chatScrollController.animateTo(
          _chatScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Messages list
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _messages.isEmpty
                  ? const Center(
                      child: Text(
                        'No messages yet\nBe the first to say hello!',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 16,
                        ),
                      ),
                    )
                  : ListView.builder(
                      controller: _chatScrollController,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        final message = _messages[index];
                        return _buildMessageBubble(message);
                      },
                    ),
        ),
        
        // Message input
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[50],
            border: Border(
              top: BorderSide(color: Colors.grey[200]!),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    maxLines: null,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              CircleAvatar(
                backgroundColor: AppColors.primaryColor,
                child: _isSending
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation(Colors.white),
                        ),
                      )
                    : IconButton(
                        onPressed: _sendMessage,
                        icon: const Icon(
                          Icons.send,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    // Direct field extraction - the message should already be the correct format
    final String username = message['username']?.toString() ?? 'Unknown User';
    final String content = message['content']?.toString() ?? 'No content';
    final String userType = message['user_type']?.toString() ?? '';
    final String timestamp = message['created_at']?.toString() ?? '';
    
    final bool isSellerMessage = userType.toLowerCase() == 'seller';
    
    // print('🔍 Building bubble - username: "$username", content: "$content", userType: "$userType"');
    
    // Choose colors based on user type
    Color avatarColor = isSellerMessage ? Colors.orange : AppColors.primaryColor;
    Color usernameColor = isSellerMessage ? Colors.orange[700]! : Colors.black87;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 12,
                backgroundColor: avatarColor,
                child: Text(
                  username.isNotEmpty ? username[0].toUpperCase() : '?',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                isSellerMessage ? '$username (Seller)' : username,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  color: usernameColor,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _formatTime(timestamp),
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 11,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Container(
            margin: const EdgeInsets.only(left: 32),
            padding: isSellerMessage 
                ? const EdgeInsets.symmetric(horizontal: 12, vertical: 8)
                : const EdgeInsets.all(0),
            decoration: isSellerMessage 
                ? BoxDecoration(
                    color: Colors.orange[50],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.orange[200]!),
                  )
                : null,
            child: Text(
              content,
              style: TextStyle(
                fontSize: 14,
                height: 1.3,
                color: isSellerMessage ? Colors.orange[800] : Colors.black87,
                fontWeight: isSellerMessage ? FontWeight.w500 : FontWeight.normal,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(String timestamp) {
    try {
      final dateTime = DateTime.parse(timestamp);
      final now = DateTime.now();
      final difference = now.difference(dateTime);
      
      if (difference.inMinutes < 1) {
        return 'now';
      } else if (difference.inHours < 1) {
        return '${difference.inMinutes}m';
      } else if (difference.inDays < 1) {
        return '${difference.inHours}h';
      } else {
        return '${difference.inDays}d';
      }
    } catch (e) {
      return '';
    }
  }
}

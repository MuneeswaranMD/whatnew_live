import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'storage_service.dart';

class WebSocketService {
  // static const String baseUrl = 'api.addagram.in';
  static const String baseUrl = 'http://10.92.201.154:8000';

  WebSocket? _livestreamSocket;
  WebSocket? _chatSocket;
  
  final StreamController<Map<String, dynamic>> _livestreamController = 
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _chatController = 
      StreamController<Map<String, dynamic>>.broadcast();
  final StreamController<Map<String, dynamic>> _biddingController = 
      StreamController<Map<String, dynamic>>.broadcast();
  
  Stream<Map<String, dynamic>> get livestreamStream => _livestreamController.stream;
  Stream<Map<String, dynamic>> get chatStream => _chatController.stream;
  Stream<Map<String, dynamic>> get biddingStream => _biddingController.stream;
  
  // Connect to livestream WebSocket
  Future<void> connectToLivestream(String livestreamId) async {
    try {
      final token = StorageService.getAuthToken();
      // print('Connecting to livestream WebSocket for livestream: $livestreamId');
      
      // Build WebSocket URL for Django Channels with token as query parameter
      String wsUrl = 'wss://$baseUrl/ws/livestream/$livestreamId/';
      if (token != null) {
        wsUrl = 'wss://$baseUrl/ws/livestream/$livestreamId/?token=$token';
      }
      
      _livestreamSocket = await WebSocket.connect(wsUrl);
      
      // print('Connected to livestream WebSocket');
      
      // Listen for messages
      _livestreamSocket!.listen(
        (dynamic data) {
          try {
            final message = jsonDecode(data as String) as Map<String, dynamic>;
            // print('Received livestream message: $message');
            _handleLivestreamMessage(message);
          } catch (e) {
            // print('Error parsing livestream message: $e');
          }
        },
        onError: (error) {
          // print('Livestream WebSocket error: $error');
        },
        onDone: () {
          // print('Livestream WebSocket disconnected');
        },
      );
      
      // Send join message
      _sendLivestreamMessage({
        'type': 'join_livestream',
        'livestream_id': livestreamId,
      });
      
    } catch (e) {
      // print('Error connecting to livestream WebSocket: $e');
    }
  }
  
  // Connect to chat WebSocket
  Future<void> connectToChat(String livestreamId) async {
    try {
      final token = StorageService.getAuthToken();
      // print('Connecting to chat WebSocket for livestream: $livestreamId');
      
      // Build WebSocket URL for Django Channels with token as query parameter
      String wsUrl = 'wss://$baseUrl/ws/chat/$livestreamId/';
      if (token != null) {
        wsUrl = 'wss://$baseUrl/ws/chat/$livestreamId/?token=$token';
      }
      
      _chatSocket = await WebSocket.connect(wsUrl);
      
      // print('Connected to chat WebSocket');
      
      // Listen for messages
      _chatSocket!.listen(
        (dynamic data) {
          try {
            final message = jsonDecode(data as String) as Map<String, dynamic>;
            // print('Received chat message: $message');
            _handleChatMessage(message);
          } catch (e) {
            // print('Error parsing chat message: $e');
          }
        },
        onError: (error) {
          // print('Chat WebSocket error: $error');
        },
        onDone: () {
          // print('Chat WebSocket disconnected');
        },
      );
      
      // Send join message
      _sendChatMessage({
        'type': 'join_chat',
        'livestream_id': livestreamId,
      });
      
    } catch (e) {
      // print('Error connecting to chat WebSocket: $e');
    }
  }
  
  // Handle livestream messages
  void _handleLivestreamMessage(Map<String, dynamic> message) {
    final messageType = message['type'] as String?;
    
    switch (messageType) {
      case 'livestream_started':
      case 'livestream_ended':
      case 'viewer_joined':
      case 'viewer_left':
        _livestreamController.add(message);
        break;
        
      case 'bid_placed':
      case 'bidding_started':
      case 'bidding_ended':
      case 'bidding_timer_update':
        _biddingController.add(message);
        break;
        
      default:
        _livestreamController.add(message);
    }
  }
  
  // Handle chat messages
  void _handleChatMessage(Map<String, dynamic> message) {
    _chatController.add(message);
  }
  
  // Send message to livestream WebSocket
  void _sendLivestreamMessage(Map<String, dynamic> message) {
    if (_livestreamSocket != null && _livestreamSocket!.readyState == WebSocket.open) {
      try {
        final jsonMessage = jsonEncode(message);
        _livestreamSocket!.add(jsonMessage);
        // print('Sent livestream message: $message');
      } catch (e) {
        // print('Error sending livestream message: $e');
      }
    }
  }
  
  // Send message to chat WebSocket
  void _sendChatMessage(Map<String, dynamic> message) {
    if (_chatSocket != null && _chatSocket!.readyState == WebSocket.open) {
      try {
        final jsonMessage = jsonEncode(message);
        _chatSocket!.add(jsonMessage);
        // print('Sent chat message: $message');
      } catch (e) {
        // print('Error sending chat message: $e');
      }
    }
  }
  
  // Send chat message
  void sendChatMessage(String livestreamId, String message) {
    _sendChatMessage({
      'type': 'chat_message',
      'content': message,
      'message_type': 'text',
      'livestream_id': livestreamId,
    });
  }
  
  // Place bid
  void placeBid(String livestreamId, String productId, double amount) {
    _sendLivestreamMessage({
      'type': 'place_bid',
      'product_id': productId,
      'bid_amount': amount,
      'livestream_id': livestreamId,
    });
  }
  
  // Join livestream
  void joinLivestream(String livestreamId) {
    _sendLivestreamMessage({
      'type': 'join_livestream',
      'livestream_id': livestreamId,
    });
  }
  
  // Leave livestream
  void leaveLivestream(String livestreamId) {
    _sendLivestreamMessage({
      'type': 'leave_livestream',
      'livestream_id': livestreamId,
    });
  }
  
  // Check if connected
  bool get isLivestreamConnected => 
      _livestreamSocket != null && _livestreamSocket!.readyState == WebSocket.open;
  
  bool get isChatConnected => 
      _chatSocket != null && _chatSocket!.readyState == WebSocket.open;
  
  // Disconnect from livestream
  void disconnectLivestream() {
    _livestreamSocket?.close();
    _livestreamSocket = null;
    // print('Disconnected from livestream WebSocket');
  }
  
  // Disconnect from chat
  void disconnectChat() {
    _chatSocket?.close();
    _chatSocket = null;
    // print('Disconnected from chat WebSocket');
  }
  
  // Disconnect all
  void disconnectAll() {
    disconnectLivestream();
    disconnectChat();
  }
  
  // Dispose
  void dispose() {
    disconnectAll();
    _livestreamController.close();
    _chatController.close();
    _biddingController.close();
  }
}

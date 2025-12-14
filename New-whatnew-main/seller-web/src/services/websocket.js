class WebSocketService {
  constructor() {
    this.socket = null;
    this.chatSocket = null;  // Add chat socket
    this.callbacks = {};
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  connect(livestreamId, token) {
    if (this.socket) {
      this.disconnect();
    }

    // Connect to livestream WebSocket first
    this.connectLivestreamSocket(livestreamId, token);
    
    // Connect to chat WebSocket after a small delay to avoid connection issues
    setTimeout(() => {
      this.connectChatSocket(livestreamId, token);
    }, 1000);
  }

  connectLivestreamSocket(livestreamId, token) {
    const wsUrl = process.env.REACT_APP_WS_URL ||'ws://192.168.1.42:8000';
    // Clean the URL and construct proper WebSocket URL
    const cleanUrl = wsUrl.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
    const wsProtocol = wsUrl.startsWith('https') ? 'wss' : 'ws';
    const fullWsUrl = `${wsProtocol}://${cleanUrl}/ws/livestream/${livestreamId}/?token=${token || ''}`;
    
    try {
      console.log('Connecting to Livestream WebSocket:', fullWsUrl);
      this.socket = new WebSocket(fullWsUrl);

      this.socket.onopen = () => {
        console.log('Connected to livestream WebSocket');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send authentication token
        if (token) {
          this.send('authenticate', { token });
        }
        
        this.emit('connection_status', { connected: true });
      };

      this.socket.onclose = (event) => {
        console.log('Disconnected from livestream WebSocket', event);
        this.isConnected = false;
        this.emit('connection_status', { connected: false });
        
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Reconnection attempt ${this.reconnectAttempts}`);
            this.connect(livestreamId, token);
          }, this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
        this.emit('connection_error', error);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle different event types
          if (data.type) {
            this.emit(data.type, data.data || data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('connection_error', error);
    }
  }

  connectChatSocket(livestreamId, token) {
    // Don't connect if already connected
    if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
      console.log('Chat socket already connected');
      return;
    }
    
    const wsUrl = process.env.REACT_APP_WS_URL || 'wss://api.whatnew.in';
    const cleanUrl = wsUrl.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
    const wsProtocol = wsUrl.startsWith('https') ? 'wss' : 'ws';
    const chatWsUrl = `${wsProtocol}://${cleanUrl}/ws/chat/${livestreamId}/?token=${token || ''}`;
    
    try {
      console.log('Connecting to Chat WebSocket:', chatWsUrl);
      this.chatSocket = new WebSocket(chatWsUrl);

      this.chatSocket.onopen = () => {
        console.log('Connected to chat WebSocket');
        // Send join chat message
        this.chatSocket.send(JSON.stringify({
          type: 'join_chat',
          livestream_id: livestreamId
        }));
      };

      this.chatSocket.onclose = (event) => {
        console.log('Disconnected from chat WebSocket', event);
        this.chatSocket = null;
      };

      this.chatSocket.onerror = (error) => {
        console.error('Chat WebSocket error:', error);
        this.chatSocket = null;
      };

      this.chatSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received chat message:', data);
          this.emit('chat_message', data.data || data);
        } catch (error) {
          console.error('Error parsing chat message:', error);
        }
      };
    } catch (error) {
      console.error('Error connecting to chat WebSocket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.chatSocket) {
      this.chatSocket.close();
      this.chatSocket = null;
    }
    this.isConnected = false;
  }

  send(type, data = {}) {
    if (this.socket && this.isConnected) {
      const message = JSON.stringify({ type, ...data });
      this.socket.send(message);
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  sendMessage(message) {
    // Send chat messages via chat WebSocket with correct format
    this.sendChatMessage('chat_message', { 
      content: message,  // Backend expects 'content'
      message_type: 'text'
      // Don't send username - backend will get it from authenticated user
    });
  }

  sendChatMessage(type, data = {}) {
    if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, ...data });
      this.chatSocket.send(message);
      console.log('Sent chat message:', message);
    } else {
      console.error('Chat WebSocket not connected');
    }
  }

  startBidding(biddingData) {
    this.send('start_bidding', biddingData);
  }

  endBidding(biddingId) {
    this.send('end_bidding', { bidding_id: biddingId });
  }

  banUser(userId, reason) {
    this.send('ban_user', { user_id: userId, reason });
  }
}

export default new WebSocketService();

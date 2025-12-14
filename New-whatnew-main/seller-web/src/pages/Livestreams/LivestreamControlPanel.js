import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { livestreamService } from '../../services/livestream';
import { productService } from '../../services/products';
import { chatService } from '../../services/chat';
import webSocketService from '../../services/websocket';
import Alert from '../../components/Common/Alert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ImageUtils } from '../../utils/imageUtils';

const LivestreamControlPanel = () => {
  const { livestreamId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [livestream, setLivestream] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isLive, setIsLive] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [bannedUsers, setBannedUsers] = useState([]);
  
  // Bidding state
  const [currentBidding, setCurrentBidding] = useState(null);
  const [biddingTimer, setBiddingTimer] = useState(0);
  const [bids, setBids] = useState([]);
  const [selectedBiddingTimer, setSelectedBiddingTimer] = useState(60); // Default 60 seconds
  const [customTimerInput, setCustomTimerInput] = useState('');
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [selectedProductForBidding, setSelectedProductForBidding] = useState(null);
  
  // Viewer state
  const [viewerCount, setViewerCount] = useState(0);
  const [viewers, setViewers] = useState([]);
  
  // Agora state
  const [agoraClient, setAgoraClient] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  
  // Refs
  const localVideoRef = useRef(null);
  const timerRef = useRef(null);
  const creditMonitorRef = useRef(null);

  useEffect(() => {
    initializeLivestream();
    return () => {
      cleanup();
    };
  }, [livestreamId]);

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getProductsForLivestream(livestreamId);
      setProducts(productsData.products || []);
      console.log('Refreshed products for livestream:', productsData.products?.length || 0);
    } catch (productError) {
      console.warn('Failed to refresh products:', productError);
    }
  };

  const initializeLivestream = async () => {
    try {
      setLoading(true);
      
      // Fetch livestream data
      const livestreamData = await livestreamService.getLivestream(livestreamId);
      setLivestream(livestreamData);
      
      // Fetch products for this livestream
      await fetchProducts();
    } catch (error) {
      console.error('Error initializing livestream:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to load livestream data. Please try again.'
      });
    }
    
    try {
      // Initialize WebSocket connection (but don't fail if it doesn't work)
      try {
        const token = localStorage.getItem('authToken');
        webSocketService.connect(livestreamId, token);
        
        // Set up WebSocket event listeners
        setupWebSocketListeners();
      } catch (wsError) {
        console.warn('WebSocket connection failed, continuing without real-time features:', wsError);
        setAlert({
          type: 'warning',
          message: 'Real-time features unavailable. Livestream control will still work.'
        });
      }

      // Initialize Agora and request permissions if livestream is live
      const livestreamData = livestream || await livestreamService.getLivestream(livestreamId);
      if (livestreamData.status === 'live') {
        setIsLive(true);
        
        // Start credit monitoring for already live streams
        startCreditMonitoring();
        
        // Request camera/microphone permissions when livestream is live
        try {
          console.log('Livestream is live, requesting camera and microphone permissions...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          // Display local video immediately
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }
          
          setAlert({
            type: 'success',
            message: '✅ Camera and microphone access granted!'
          });
          
          // Now try to initialize Agora
          try {
            await initializeAgora();
          } catch (agoraError) {
            console.warn('Agora initialization failed, using basic camera/microphone:', agoraError);
            setAlert({
              type: 'info',
              message: '📹 Camera and microphone ready. Video streaming disabled in development mode.'
            });
          }
          
        } catch (permissionError) {
          console.error('Camera/microphone permission denied:', permissionError);
          setAlert({
            type: 'warning',
            message: '⚠️ Camera/microphone permission denied. Please allow camera and microphone access to start livestream.'
          });
        }
      }
      
    } catch (error) {
      console.error('Error with WebSocket/Agora setup:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocketListeners = () => {
    webSocketService.on('connection_status', (data) => {
      console.log('WebSocket connection status:', data);
      if (data.connected) {
        setAlert({
          type: 'success',
          message: '🔗 Real-time features connected successfully!'
        });
      }
    });

    webSocketService.on('viewer_joined', (data) => {
      setViewerCount(prev => prev + 1);
      setViewers(prev => [...prev, data.user]);
    });

    webSocketService.on('viewer_left', (data) => {
      setViewerCount(prev => Math.max(0, prev - 1));
      setViewers(prev => prev.filter(viewer => viewer.id !== data.user.id));
    });

    webSocketService.on('chat_message', (data) => {
      console.log('Received chat message:', data);
      
      // Extract message data (handle both direct format and nested 'data' format)
      const messageData = data.data || data;
      console.log('Processed message data:', messageData);
      
      // Remove any temporary messages for this user when real message arrives
      setChatMessages(prev => {
        const messageId = messageData.id || `${Date.now()}_${Math.random()}`;
        
        // Remove temporary messages from the same user
        let filteredMessages = prev;
        if (messageData.user_type === 'seller') {
          filteredMessages = prev.filter(msg => !msg._isTemp);
        }
        
        // Check for duplicates by ID
        const exists = filteredMessages.some(msg => {
          const msgId = msg.id || msg.data?.id;
          return msgId === messageId;
        });
        
        if (exists) {
          console.log('Duplicate message detected, ignoring:', messageId);
          return filteredMessages;
        }
        
        console.log('Adding new message to chat:', messageData);
        return [...filteredMessages, messageData];
      });
    });

    webSocketService.on('bid_placed', (data) => {
      console.log('Received bid placed:', data);
      
      // Extract bid data
      const bidData = data.data || data;
      const newBid = {
        amount: bidData.amount || bidData.bid_amount,
        user_name: bidData.user_name || bidData.username || 'Anonymous',
        user_id: bidData.user_id,
        timestamp: bidData.timestamp || new Date().toISOString()
      };
      
      setBids(prev => {
        // Avoid duplicates
        const exists = prev.some(bid => 
          bid.user_id === newBid.user_id && 
          bid.amount === newBid.amount && 
          Math.abs(new Date(bid.timestamp) - new Date(newBid.timestamp)) < 5000 // 5 second tolerance
        );
        
        if (!exists) {
          console.log('Adding new bid:', newBid);
          return [...prev, newBid].sort((a, b) => a.amount - b.amount);
        }
        return prev;
      });
      
      // Show notification
      setAlert({
        type: 'info',
        message: `New bid: ₹${newBid.amount} by ${newBid.user_name}`,
        autoClose: 3000
      });
    });

    webSocketService.on('bidding_started', (data) => {
      console.log('Received bidding started:', data);
      
      const biddingData = data.data || data;
      const product = biddingData.product || products.find(p => p.id === biddingData.product_id) || {
        id: biddingData.product_id,
        name: 'Unknown Product',
        base_price: biddingData.starting_price || '0'
      };
      
      setCurrentBidding({
        id: biddingData.bidding_id || biddingData.id,
        product: product,
        starting_price: biddingData.starting_price,
        duration: biddingData.timer_duration || biddingData.duration,
        started_at: new Date()
      });
      
      setBiddingTimer(biddingData.timer_duration || biddingData.duration || 60);
      setBids([]);
    });

    webSocketService.on('bidding_ended', (data) => {
      console.log('Received bidding ended:', data);
      
      const endData = data.data || data;
      const winnerName = endData.winner_name || endData.winner?.name || 'Unknown';
      const winningBid = endData.winning_bid || endData.amount;
      
      setCurrentBidding(null);
      setBiddingTimer(0);
      setBids([]);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Refresh product data to get updated quantity
      if (endData.product_id || (currentBidding && currentBidding.product)) {
        fetchProducts(); // Refresh product list to show updated quantities
      }
      
      setAlert({
        type: 'success',
        message: winningBid 
          ? `🏆 Bidding ended! Winner: ${winnerName} with bid ₹${winningBid}. Product added to winner's cart and quantity reduced to ${endData.product_quantity_remaining || 'N/A'}!`
          : '⏰ Bidding ended with no bids.',
        autoClose: 10000
      });
    });

    webSocketService.on('bidding_timer_update', (data) => {
      const timerData = data.data || data;
      if (timerData.remaining_time !== undefined) {
        setBiddingTimer(timerData.remaining_time);
      }
    });

    webSocketService.on('user_banned', (data) => {
      setBannedUsers(prev => [...prev, data.user]);
      setAlert({
        type: 'info',
        message: `User ${data.user?.name || data.user?.username || 'Unknown'} has been banned.`
      });
    });
  };

  const initializeAgora = async () => {
    try {
      // Get Agora token from backend
      const agoraData = await livestreamService.getAgoraToken(livestreamId);
      
      // Check if we have dummy credentials (development mode)
      if (agoraData.token === 'dummy_token_for_development' || agoraData.app_id === 'dummy_app_id') {
        console.log('Using dummy Agora credentials, enabling basic camera/microphone for testing');
        
        // Request camera and microphone permissions for testing
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          // Display local video for testing
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }
          
          setAlert({
            type: 'success',
            message: 'Camera and microphone access granted. Video streaming disabled in development mode.'
          });
          
          return;
        } catch (permissionError) {
          console.error('Permission denied for camera/microphone:', permissionError);
          setAlert({
            type: 'warning',
            message: 'Camera/microphone permission denied. Video streaming requires permission.'
          });
          return;
        }
      }
      
      // Initialize Agora client
      const { createClient, createMicrophoneAndCameraTracks } = await import('agora-rtc-sdk-ng');
      
      const client = createClient({ mode: 'live', codec: 'vp8' });
      
      // Set client role as broadcaster (seller streams video)
      await client.setClientRole('host');
      
      await client.join(
        agoraData.app_id,
        agoraData.channel_name,
        agoraData.token,
        agoraData.uid
      );
      
      // Create local tracks
      const [microphoneTrack, cameraTrack] = await createMicrophoneAndCameraTracks();
      
      // Play local video
      if (localVideoRef.current) {
        cameraTrack.play(localVideoRef.current);
      }
      
      // Publish tracks (broadcaster publishes video/audio)
      await client.publish([microphoneTrack, cameraTrack]);
      
      console.log('✅ Seller joined Agora as broadcaster and published video/audio');
      
      setAgoraClient(client);
      setLocalVideoTrack(cameraTrack);
      setLocalAudioTrack(microphoneTrack);
      
    } catch (error) {
      console.error('Error initializing Agora:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to initialize video streaming. Please check your camera and microphone permissions.'
      });
    }
  };

  const startLivestream = async () => {
    try {
      // Request camera/microphone permissions before starting
      console.log('Starting livestream, requesting camera and microphone permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log('Camera and microphone access granted, setting up video...');
      
      // Display local video immediately
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        
        // Add event listeners for debugging
        localVideoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, playing video...');
          localVideoRef.current.play().catch(e => {
            console.error('Error playing video:', e);
          });
        };
        
        localVideoRef.current.onplay = () => {
          console.log('✅ Video is now playing');
        };
        
        localVideoRef.current.onerror = (e) => {
          console.error('❌ Video error:', e);
        };
        
        // Try to play immediately
        try {
          await localVideoRef.current.play();
          console.log('✅ Video playing successfully');
        } catch (playError) {
          console.warn('Autoplay failed, user interaction may be required:', playError);
        }
      } else {
        console.error('❌ Video element not found (localVideoRef.current is null)');
      }
      
      // Start the livestream
      await livestreamService.startLivestream(livestreamId);
      setIsLive(true);
      setLivestream(prev => ({ ...prev, status: 'live' }));
      
      // Start credit monitoring
      startCreditMonitoring();
      
      // Try to initialize Agora (optional)
      try {
        await initializeAgora();
        setAlert({
          type: 'success',
          message: '🎥 Livestream started successfully with professional streaming!'
        });
      } catch (agoraError) {
        console.warn('Agora initialization failed, using basic camera/microphone:', agoraError);
        setAlert({
          type: 'success',
          message: '🎥 Livestream started successfully with camera and microphone!'
        });
      }
      
    } catch (error) {
      console.error('Error starting livestream:', error);
      
      // Check if it's a permission error
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setAlert({
          type: 'danger',
          message: '⚠️ Camera/microphone access required to start livestream. Please allow permissions and try again.'
        });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.error || 'Failed to start livestream. Please check your credits.'
        });
      }
    }
  };

  const endLivestream = async () => {
    try {
      // Stop credit monitoring first
      stopCreditMonitoring();
      
      await livestreamService.endLivestream(livestreamId);
      setIsLive(false);
      setLivestream(prev => ({ ...prev, status: 'ended' }));
      cleanup();
      
      setAlert({
        type: 'info',
        message: 'Livestream ended successfully!'
      });
      
      setTimeout(() => {
        navigate('/livestreams');
      }, 2000);
    } catch (error) {
      console.error('Error ending livestream:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to end livestream. Please try again.'
      });
    }
  };

  const startBidding = async (productId, duration = selectedBiddingTimer) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        setAlert({
          type: 'danger',
          message: 'Product not found.'
        });
        return;
      }

      const biddingData = {
        product: productId,
        starting_price: product.base_price,
        timer_duration: duration
      };

      // Create bidding via backend API
      const biddingResponse = await livestreamService.startBidding(livestreamId, biddingData);
      
      // Notify via WebSocket
      webSocketService.startBidding({
        ...biddingData,
        bidding_id: biddingResponse.id
      });
      
      setCurrentBidding({
        id: biddingResponse.id,
        product,
        starting_price: product.base_price,
        duration,
        started_at: new Date()
      });
      
      setBiddingTimer(duration);
      setBids([]);
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setBiddingTimer(prev => {
          if (prev <= 1) {
            endBidding();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setAlert({
        type: 'success',
        message: `Bidding started for ${product.name}! Duration: ${formatTime(duration)}`
      });
      
      // Close timer modal if open
      setShowTimerModal(false);
      setSelectedProductForBidding(null);
    } catch (error) {
      console.error('Error starting bidding:', error);
      setAlert({
        type: 'danger',
        message: error.response?.data?.error || 'Failed to start bidding. Please try again.'
      });
    }
  };

  const handleStartBiddingClick = (product) => {
    setSelectedProductForBidding(product);
    setShowTimerModal(true);
  };

  const handleTimerSelection = (seconds) => {
    setSelectedBiddingTimer(seconds);
    setCustomTimerInput('');
  };

  const handleCustomTimerChange = (e) => {
    const value = e.target.value;
    setCustomTimerInput(value);
    if (value && !isNaN(value) && parseInt(value) > 0) {
      setSelectedBiddingTimer(parseInt(value));
    }
  };

  const confirmStartBidding = () => {
    if (selectedProductForBidding && selectedBiddingTimer > 0) {
      startBidding(selectedProductForBidding.id, selectedBiddingTimer);
    }
  };

  const endBidding = async () => {
    try {
      if (currentBidding && currentBidding.id) {
        await livestreamService.endBidding(currentBidding.id);
        webSocketService.endBidding(currentBidding.id);
      }
      
      setCurrentBidding(null);
      setBiddingTimer(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (error) {
      console.error('Error ending bidding:', error);
      setAlert({
        type: 'danger',
        message: 'Failed to end bidding. Please try again.'
      });
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      console.log('Attempting to send message:', newMessage);
      console.log('WebSocket connected:', webSocketService.isConnected);
      
      // Try WebSocket first
      if (webSocketService.isConnected) {
        // Send via WebSocket with proper format
        webSocketService.sendChatMessage('chat_message', {
          content: newMessage,
          message_type: 'text'
        });
        console.log('Message sent via WebSocket:', newMessage);
        
        // Add a temporary optimistic update to show message immediately
        const tempMessage = {
          id: `temp_${Date.now()}`,
          username: 'You',
          content: newMessage,
          user_type: 'seller',
          created_at: new Date().toISOString(),
          _isTemp: true
        };
        
        setChatMessages(prev => [...prev, tempMessage]);
        console.log('Added temporary message for immediate feedback');
        
        // Don't add locally - let the WebSocket response handle it
        // This prevents duplication since the backend will broadcast back
      } else {
        // Fallback: Add message locally for testing
        console.log('WebSocket not connected, adding message locally for testing');
        const testMessage = {
          id: `local_${Date.now()}`,
          username: 'Seller (Offline)',
          content: newMessage,
          user_type: 'seller',
          created_at: new Date().toISOString(),
          _isLocal: true
        };
        setChatMessages(prev => [...prev, testMessage]);
        console.log('Added local test message:', testMessage);
        
        setAlert({
          type: 'warning',
          message: '⚠️ Message sent locally only. WebSocket connection not available.'
        });
      }
      setNewMessage('');
    } else {
      console.log('Cannot send empty message');
    }
  };

  const banUser = (userId, reason = 'Inappropriate behavior') => {
    webSocketService.banUser(userId, reason);
  };

  const startCreditMonitoring = () => {
    // Clear any existing monitor
    if (creditMonitorRef.current) {
      clearInterval(creditMonitorRef.current);
    }
    
    // Check credit deduction every 25 minutes (slightly before 30 min mark)
    creditMonitorRef.current = setInterval(async () => {
      try {
        console.log('Checking credit deduction...');
        const result = await livestreamService.processCreditDeduction(livestreamId);
        
        if (result.credit_deducted) {
          setAlert({
            type: 'info',
            message: `Credit deducted! Remaining credits: ${result.remaining_credits}`,
          });
          
          // Update livestream data to reflect new credit consumption
          setLivestream(prev => ({
            ...prev,
            credits_consumed: result.total_credits_consumed
          }));
        }
        
        // Check if credits are running low
        if (result.remaining_credits <= 1) {
          setAlert({
            type: 'warning',
            message: `⚠️ Low credits! Only ${result.remaining_credits} credit(s) remaining. Your livestream may end soon.`,
          });
        }
        
        // If no credits left, end the livestream
        if (result.remaining_credits <= 0) {
          setAlert({
            type: 'danger',
            message: 'No credits remaining. Ending livestream...',
          });
          await endLivestream();
        }
        
      } catch (error) {
        console.error('Error checking credit deduction:', error);
        // Don't show alerts for credit check errors to avoid spam
      }
    }, 25 * 60 * 1000); // 25 minutes
    
    console.log('Credit monitoring started');
  };

  const stopCreditMonitoring = () => {
    if (creditMonitorRef.current) {
      clearInterval(creditMonitorRef.current);
      creditMonitorRef.current = null;
      console.log('Credit monitoring stopped');
    }
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Clear credit monitoring
    if (creditMonitorRef.current) {
      clearInterval(creditMonitorRef.current);
      creditMonitorRef.current = null;
    }
    
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    
    if (agoraClient) {
      agoraClient.leave();
    }
    
    webSocketService.disconnect();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!livestream) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <h4>Livestream not found</h4>
          <button className="btn btn-primary" onClick={() => navigate('/livestreams')}>
            Back to Livestreams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              className="mb-3"
            />
          )}

          {/* Livestream Header */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">{livestream.title}</h4>
                  <p className="text-muted mb-0">{livestream.description}</p>
                </div>
                <div className="text-end">
                  <span className={`badge fs-6 px-3 py-2 ${isLive ? 'bg-danger' : 'bg-secondary'}`}>
                    {isLive ? '🔴 LIVE' : '⏸️ OFFLINE'}
                  </span>
                  <div className="mt-2">
                    <small className="text-muted">Viewers: {viewerCount}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Stream */}
          <div className="card mb-3">
            <div className="card-body p-0">
              <div className="ratio ratio-16x9 bg-dark position-relative">
                <video
                  ref={localVideoRef}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  autoPlay
                  muted
                  playsInline
                />
                {!isLive && (
                  <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                    <i className="bi bi-camera-video-off display-1 mb-3"></i>
                    <h5>Livestream Offline</h5>
                    <p>Click "Start Livestream" to begin broadcasting</p>
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex gap-2">
                {!isLive ? (
                  <button className="btn btn-success" onClick={startLivestream}>
                    <i className="bi bi-play-circle me-2"></i>
                    Start Livestream
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={endLivestream}>
                    <i className="bi bi-stop-circle me-2"></i>
                    End Livestream
                  </button>
                )}
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (localVideoTrack) {
                      localVideoTrack.setEnabled(!localVideoTrack.enabled);
                    }
                  }}
                  disabled={!isLive}
                >
                  <i className="bi bi-camera-video"></i>
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (localAudioTrack) {
                      localAudioTrack.setEnabled(!localAudioTrack.enabled);
                    }
                  }}
                  disabled={!isLive}
                >
                  <i className="bi bi-mic"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Bidding Timer Settings */}
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Bidding Timer Settings
              </h5>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label className="form-label">Default Timer Duration:</label>
                  <select 
                    className="form-select"
                    value={selectedBiddingTimer}
                    onChange={(e) => setSelectedBiddingTimer(parseInt(e.target.value))}
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={90}>1.5 minutes</option>
                    <option value={120}>2 minutes</option>
                    <option value={180}>3 minutes</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="text-center">
                    <div className="fw-bold text-primary">{formatTime(selectedBiddingTimer)}</div>
                    <small className="text-muted">Current default timer</small>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  You can customize the timer for each product when starting bidding.
                </small>
              </div>
            </div>
          </div>

          {/* Active Bidding Status */}
          {currentBidding && (
            <div className="card mb-3 border-warning">
              <div className="card-header bg-warning bg-opacity-10">
                <h5 className="mb-0 text-warning">
                  <i className="bi bi-lightning-charge me-2"></i>
                  Active Bidding
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>{currentBidding.product?.name || 'Product'}</h6>
                    <p className="text-muted small mb-2">Starting Price: ₹{currentBidding.starting_price}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="h4 text-success mb-0">
                          ₹{bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : currentBidding.starting_price}
                        </div>
                        <small className="text-muted">
                          {bids.length > 0 ? `${bids.length} bids` : 'No bids yet'}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="h2 text-primary mb-0">
                          {formatTime(biddingTimer)}
                        </div>
                        <small className="text-muted">Time left</small>
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={endBidding}
                    >
                      <i className="bi bi-stop-circle me-1"></i>
                      End Bidding
                    </button>
                  </div>
                  
                  <div className="col-md-6">
                    <h6>Recent Bids</h6>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {bids.length === 0 ? (
                        <p className="text-muted small">No bids yet</p>
                      ) : (
                        bids.slice(-5).reverse().map((bid, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                            <small>{bid.user_name || 'Anonymous'}</small>
                            <span className="badge bg-primary">₹{bid.amount}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products for Bidding */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>
                Products for Bidding
              </h5>
            </div>
            <div className="card-body">
              {products.length === 0 ? (
                <p className="text-muted text-center">No products available for this livestream.</p>
              ) : (
                <div className="row">
                  {products.map((product) => (
                    <div key={product.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100">
                        <img 
                          src={ImageUtils.getProductImageUrl(product)}
                          className="card-img-top" 
                          alt={product.name || 'Product'}
                          style={{ height: '150px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = ImageUtils.getPlaceholderImage();
                          }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{product.name || 'Unknown Product'}</h6>
                          <p className="card-text small text-muted">{product.description || 'No description'}</p>
                          <p className="text-primary fw-bold">Starting: ₹{product.base_price || '0'}</p>
                          <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={() => handleStartBiddingClick(product)}
                            disabled={!isLive || currentBidding}
                          >
                            <i className="bi bi-stopwatch me-1"></i>
                            Start Bidding
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Current Bidding */}
          {currentBidding && (
            <div className="card mb-3 border-warning">
              <div className="card-header bg-warning text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <i className="bi bi-stopwatch me-2"></i>
                    Live Bidding
                  </h6>
                  <div className="d-flex align-items-center">
                    <div className="timer-display me-2">
                      <span className={`badge ${biddingTimer <= 10 ? 'bg-danger' : biddingTimer <= 30 ? 'bg-warning text-dark' : 'bg-success'} fs-6`}>
                        {formatTime(biddingTimer)}
                      </span>
                    </div>
                    {biddingTimer <= 10 && (
                      <i className="bi bi-exclamation-triangle text-danger"></i>
                    )}
                  </div>
                </div>
                
                {/* Timer Progress Bar */}
                <div className="progress mt-2" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar ${biddingTimer <= 10 ? 'bg-danger' : biddingTimer <= 30 ? 'bg-warning' : 'bg-success'}`}
                    style={{ 
                      width: `${(biddingTimer / currentBidding.duration) * 100}%`,
                      transition: 'width 1s linear'
                    }}
                  ></div>
                </div>
              </div>
              <div className="card-body">
                <h6>{currentBidding.product?.name || 'Product'}</h6>
                <p className="small text-muted">Starting Price: ₹{currentBidding.starting_price}</p>
                <p className="small text-muted">Duration: {formatTime(currentBidding.duration)}</p>
                
                <div className="mb-3">
                  <strong>Latest Bids:</strong>
                  <div className="mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {bids.length === 0 ? (
                      <p className="text-muted small">No bids yet</p>
                    ) : (
                      bids.slice(-5).reverse().map((bid, index) => (
                        <div key={index} className="d-flex justify-content-between small border-bottom py-1">
                          <span>{bid.bidder_name || bid.user_name || 'Anonymous'}</span>
                          <span className="fw-bold">₹{bid.amount}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={endBidding}
                >
                  <i className="bi bi-stop-circle me-1"></i>
                  End Bidding Early
                </button>
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Live Chat
                </h6>
                <small className={`badge ${webSocketService.isConnected ? 'bg-success' : 'bg-danger'}`}>
                  {webSocketService.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </small>
              </div>
            </div>
            <div className="card-body p-0">
              <div 
                className="p-3" 
                style={{ height: '300px', overflowY: 'auto' }}
              >
                {chatMessages.length === 0 ? (
                  <p className="text-muted text-center">No messages yet</p>
                ) : (
                  chatMessages.map((message, index) => {
                    const username = message.username || message.user_name || 'Anonymous';
                    const content = message.content || message.message || 'No content';
                    const userType = message.user_type || '';
                    const isTemp = message._isTemp || false;
                    const isLocal = message._isLocal || false;
                    
                    return (
                      <div key={message.id || index} className="mb-2">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-1">
                              <strong className="small">{username}</strong>
                              {userType && (
                                <span className={`badge badge-sm ${userType === 'seller' ? 'bg-warning' : 'bg-info'}`}>
                                  {userType}
                                </span>
                              )}
                              {isTemp && <span className="badge bg-secondary badge-sm">Sending...</span>}
                              {isLocal && <span className="badge bg-danger badge-sm">Offline</span>}
                            </div>
                            <p className={`mb-0 small ${isTemp ? 'text-muted' : ''}`}>
                              {content}
                            </p>
                          </div>
                          {!isTemp && !isLocal && (
                            <button
                              className="btn btn-outline-danger btn-sm ms-2"
                              onClick={() => banUser(message.user_id)}
                              title="Ban User"
                            >
                              <i className="bi bi-person-x"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="card-footer">
              {/* Debug info */}
              <div className="small text-muted mb-2">
                Debug: WebSocket {webSocketService.isConnected ? '✅ Connected' : '❌ Disconnected'} | 
                Messages: {chatMessages.length} | 
                Livestream: {isLive ? '🔴 Live' : '⏸️ Offline'}
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={isLive ? "Type a message..." : "Livestream must be live to chat"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  disabled={!isLive}
                />
                <button
                  className="btn btn-primary"
                  onClick={sendChatMessage}
                  disabled={!isLive || !newMessage.trim()}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Timer Selection Modal */}
      {showTimerModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-stopwatch me-2"></i>
                  Set Bidding Timer
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTimerModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedProductForBidding && (
                  <div className="mb-3">
                    <h6>Product: {selectedProductForBidding.name || 'Unknown Product'}</h6>
                    <p className="text-muted small">Starting Price: ₹{selectedProductForBidding.base_price || '0'}</p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Select Timer Duration:</label>
                  
                  {/* Quick Timer Presets */}
                  <div className="row g-2 mb-3">
                    {[30, 60, 90, 120, 180, 300].map(seconds => (
                      <div key={seconds} className="col-4">
                        <button
                          className={`btn btn-outline-primary w-100 ${selectedBiddingTimer === seconds ? 'active' : ''}`}
                          onClick={() => handleTimerSelection(seconds)}
                        >
                          {formatTime(seconds)}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Custom Timer Input */}
                  <div className="mb-3">
                    <label className="form-label">Custom Duration (seconds):</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter seconds"
                        value={customTimerInput}
                        onChange={handleCustomTimerChange}
                        min="10"
                        max="3600"
                      />
                      <span className="input-group-text">seconds</span>
                    </div>
                    <div className="form-text">
                      Min: 10 seconds, Max: 1 hour (3600 seconds)
                    </div>
                  </div>

                  {/* Selected Timer Display */}
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Selected Timer: {formatTime(selectedBiddingTimer)}</strong>
                    <div className="small mt-1">
                      Bidding will automatically end after this duration.
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowTimerModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={confirmStartBidding}
                  disabled={selectedBiddingTimer <= 0}
                >
                  <i className="bi bi-play-circle me-1"></i>
                  Start Bidding ({formatTime(selectedBiddingTimer)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamControlPanel;

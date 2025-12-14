import 'dart:async';
import 'package:flutter/material.dart';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:permission_handler/permission_handler.dart';
import 'api_service.dart';

class AgoraService {
  static RtcEngine? _engine;
  static String? _currentChannel;
  static bool _isJoined = false;
  static String _appId = 'd3d4570cf88940f5b24b3c1e44732eb1'; // Will be updated from backend
  
  // Events
  static final StreamController<String> _userJoinedController = 
      StreamController<String>.broadcast();
  static final StreamController<String> _userLeftController = 
      StreamController<String>.broadcast();
  static final StreamController<Map<String, dynamic>> _connectionStateController = 
      StreamController<Map<String, dynamic>>.broadcast();
  
  static Stream<String> get userJoinedStream => _userJoinedController.stream;
  static Stream<String> get userLeftStream => _userLeftController.stream;
  static Stream<Map<String, dynamic>> get connectionStateStream => _connectionStateController.stream;
  
  // Remote UID tracking
  static int? _remoteUid;
  
  static int? get remoteUid => _remoteUid;
  
  // Initialize Agora engine with credentials from backend
  static Future<void> initializeForLivestream(String livestreamId) async {
    try {
      // Use the real App ID you provided
      final appId = 'd3d4570cf88940f5b24b3c1e44732eb1';
      
      // print('Initializing Agora with real App ID: $appId');
      _appId = appId;
      
      await initializeWithAppId(appId);
    } catch (e) {
      // print('Error initializing Agora: $e');
      // Fallback to using the hardcoded App ID
      await initializeWithAppId('d3d4570cf88940f5b24b3c1e44732eb1');
    }
  }
  
  // Initialize Agora engine with default app ID (fallback)
  static Future<void> initialize() async {
    await initializeWithAppId(_appId);
  }
  
  // Initialize Agora engine
  static Future<void> initializeWithAppId(String appId) async {
    try {
      _engine = createAgoraRtcEngine();
      await _engine!.initialize(RtcEngineContext(
        appId: appId,
        channelProfile: ChannelProfileType.channelProfileLiveBroadcasting,
      ));
      
      // Set client role as audience (viewers)
      await _engine!.setClientRole(role: ClientRoleType.clientRoleAudience);
      
      // Enable video with optimized settings for mobile
      await _engine!.enableVideo();
      
      // Set video encoder configuration for better mobile experience
      await _engine!.setVideoEncoderConfiguration(
        const VideoEncoderConfiguration(
          dimensions: VideoDimensions(width: 1280, height: 720), // 720p for mobile
          frameRate: 30,
          bitrate: 1500, // Balanced bitrate for mobile
          orientationMode: OrientationMode.orientationModeAdaptive,
          degradationPreference: DegradationPreference.maintainQuality,
        ),
      );
      
      // Register event handlers
      _engine!.registerEventHandler(
        RtcEngineEventHandler(
          onJoinChannelSuccess: (RtcConnection connection, int elapsed) {
            // print('Successfully joined channel: ${connection.channelId}');
            _isJoined = true;
            _connectionStateController.add({
              'type': 'joined',
              'channel': connection.channelId,
              'elapsed': elapsed,
            });
          },
          onUserJoined: (RtcConnection connection, int uid, int elapsed) {
            // print('User joined: $uid');
            _userJoinedController.add(uid.toString());
            _remoteUid = uid; // Track remote UID
          },
          onUserOffline: (RtcConnection connection, int uid, UserOfflineReasonType reason) {
            // print('User left: $uid');
            _userLeftController.add(uid.toString());
            if (_remoteUid == uid) {
              _remoteUid = null; // Clear remote UID if the user left
            }
          },
          onLeaveChannel: (RtcConnection connection, RtcStats stats) {
            // print('Left channel: ${connection.channelId}');
            _isJoined = false;
            _connectionStateController.add({
              'type': 'left',
              'channel': connection.channelId,
              'stats': stats,
            });
          },
          onConnectionStateChanged: (RtcConnection connection, ConnectionStateType state, ConnectionChangedReasonType reason) {
            // print('Connection state changed: $state, reason: $reason');
            _connectionStateController.add({
              'type': 'state_changed',
              'state': state,
              'reason': reason,
            });
          },
          onError: (ErrorCodeType code, String msg) {
            // print('Agora error: $code - $msg');
            _connectionStateController.add({
              'type': 'error',
              'code': code,
              'message': msg,
            });
          },
        ),
      );
      
    } catch (e) {
      // print('Error initializing Agora: $e');
      throw e;
    }
  }
  
  // Request permissions
  static Future<bool> requestPermissions() async {
    try {
      Map<Permission, PermissionStatus> permissions = await [
        Permission.camera,
        Permission.microphone,
      ].request();
      
      return permissions[Permission.camera] == PermissionStatus.granted &&
             permissions[Permission.microphone] == PermissionStatus.granted;
    } catch (e) {
      // print('Error requesting permissions: $e');
      return false;
    }
  }
  
  // Join channel as viewer
  static Future<bool> joinChannel({
    required String channelName,
    required String token,
    required int uid,
  }) async {
    try {
      if (_engine == null) {
        throw Exception('Agora engine not initialized');
      }
      
      // Request permissions first
      final hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        throw Exception('Camera and microphone permissions required');
      }
      
      // Leave current channel if any
      if (_isJoined) {
        await leaveChannel();
      }
      
      // Join the channel
      await _engine!.joinChannel(
        token: token,
        channelId: channelName,
        uid: uid,
        options: const ChannelMediaOptions(
          clientRoleType: ClientRoleType.clientRoleAudience,
          audienceLatencyLevel: AudienceLatencyLevelType.audienceLatencyLevelLowLatency,
        ),
      );
      
      _currentChannel = channelName;
      return true;
      
    } catch (e) {
      // print('Error joining channel: $e');
      return false;
    }
  }
  
  // Join livestream with credentials from backend
  static Future<bool> joinLivestreamWithBackendCredentials(String livestreamId) async {
    try {
      // Get Agora credentials from backend
      final agoraData = await ApiService.getAgoraToken(livestreamId);
      
      final channelName = agoraData['channel_name'];
      final token = agoraData['token'];
      final uid = agoraData['uid'] ?? 0;
      // Use your real App ID instead of backend App ID
      final appId = 'd3d4570cf88940f5b24b3c1e44732eb1';
      
      // print('Joining livestream with backend credentials:');
      // print('App ID: $appId (using real App ID)');
      // print('Channel: $channelName');
      // print('Token: ${token?.substring(0, 10)}...');
      // print('UID: $uid');
      
      // Always initialize with your real App ID first
      _appId = appId;
      await initializeWithAppId(appId);
      
      // Join channel with backend credentials
      return await joinChannel(
        channelName: channelName,
        token: token,
        uid: uid,
      );
      
    } catch (e) {
      // print('Error joining livestream with backend credentials: $e');
      return false;
    }
  }
  
  // Leave channel
  static Future<void> leaveChannel() async {
    try {
      if (_engine != null && _isJoined) {
        // print('🔄 Leaving Agora channel: $_currentChannel');
        await _engine!.leaveChannel();
        
        // Reset state
        _currentChannel = null;
        _isJoined = false;
        _remoteUid = null;
        
        // print('✅ Successfully left Agora channel');
      } else {
        // print('⚠️ Not joined to any channel or engine not initialized');
      }
    } catch (e) {
      // print('❌ Error leaving channel: $e');
      // Still reset state even if there's an error
      _currentChannel = null;
      _isJoined = false;
      _remoteUid = null;
    }
  }
  
  // Create video view for remote user (seller's stream)
  static Widget createRemoteView(int uid) {
    if (_engine == null) {
      return Container(
        color: Colors.black,
        child: const Center(
          child: Text(
            'Video not available',
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    }
    
    return AgoraVideoView(
      controller: VideoViewController.remote(
        rtcEngine: _engine!,
        canvas: VideoCanvas(
          uid: uid,
          renderMode: RenderModeType.renderModeHidden, // Fill and crop to fit - ensures full coverage
          mirrorMode: VideoMirrorModeType.videoMirrorModeDisabled, // Disable mirror for better viewing
        ),
        connection: RtcConnection(channelId: _currentChannel),
      ),
    );
  }
  
  // Switch camera (front/back)
  static Future<void> switchCamera() async {
    try {
      await _engine?.switchCamera();
    } catch (e) {
      // print('Error switching camera: $e');
    }
  }
  
  // Mute/unmute audio
  static Future<void> muteAudio(bool mute) async {
    try {
      await _engine?.muteLocalAudioStream(mute);
    } catch (e) {
      // print('Error muting audio: $e');
    }
  }
  
  // Enable/disable video
  static Future<void> enableVideo(bool enable) async {
    try {
      if (enable) {
        await _engine?.enableVideo();
      } else {
        await _engine?.disableVideo();
      }
    } catch (e) {
      // print('Error enabling/disabling video: $e');
    }
  }
  
  // Get connection info
  static Map<String, dynamic> getConnectionInfo() {
    return {
      'isJoined': _isJoined,
      'currentChannel': _currentChannel,
      'engineInitialized': _engine != null,
    };
  }
  
  // Dispose
  static Future<void> dispose() async {
    try {
      // print('🔄 Disposing Agora service...');
      
      // First leave any active channel
      await leaveChannel();
      
      // Give a small delay to ensure channel leave is processed
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Release the engine
      if (_engine != null) {
        await _engine!.release();
        _engine = null;
        // print('✅ Agora engine released');
      }
      
      // Close stream controllers
      if (!_userJoinedController.isClosed) {
        await _userJoinedController.close();
      }
      if (!_userLeftController.isClosed) {
        await _userLeftController.close();
      }
      if (!_connectionStateController.isClosed) {
        await _connectionStateController.close();
      }
      
      // Reset state
      _isJoined = false;
      _currentChannel = null;
      _remoteUid = null;
      
      // print('✅ Agora service disposed successfully');
      
    } catch (e) {
      // print('❌ Error disposing Agora: $e');
    }
  }
}

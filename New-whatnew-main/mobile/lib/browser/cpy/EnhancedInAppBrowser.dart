import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

/// Instagram-style in-app browser with smooth animations and gesture controls
class EnhancedInAppBrowser {
  static final EnhancedInAppBrowser _instance = EnhancedInAppBrowser._internal();
  factory EnhancedInAppBrowser() => _instance;
  EnhancedInAppBrowser._internal();

  /// Opens URL in Instagram-style browser
  static Future<void> open(
    BuildContext context,
    String url, {
    String? title,
    Color? backgroundColor,
    Color? foregroundColor,
    bool showProgressBar = true,
    bool enableShare = true,
    bool enableRefresh = true,
    bool enableBackForward = true,
  }) async {
    await Navigator.of(context).push(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => _InstagramBrowserScreen(
          url: url,
          title: title,
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          showProgressBar: showProgressBar,
          enableShare: enableShare,
          enableRefresh: enableRefresh,
          enableBackForward: enableBackForward,
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(0.0, 1.0);
          const end = Offset.zero;
          const curve = Curves.easeInOut;

          var tween = Tween(begin: begin, end: end).chain(
            CurveTween(curve: curve),
          );

          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
    );
  }
}

class _InstagramBrowserScreen extends StatefulWidget {
  final String url;
  final String? title;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final bool showProgressBar;
  final bool enableShare;
  final bool enableRefresh;
  final bool enableBackForward;

  const _InstagramBrowserScreen({
    required this.url,
    this.title,
    this.backgroundColor,
    this.foregroundColor,
    this.showProgressBar = true,
    this.enableShare = true,
    this.enableRefresh = true,
    this.enableBackForward = true,
  });

  @override
  State<_InstagramBrowserScreen> createState() => _InstagramBrowserScreenState();
}

class _InstagramBrowserScreenState extends State<_InstagramBrowserScreen>
    with TickerProviderStateMixin {
  InAppWebViewController? _webViewController;
  String _currentUrl = '';
  String _pageTitle = '';
  bool _isLoading = true;
  double _progress = 0.0;
  bool _canGoBack = false;
  bool _canGoForward = false;
  bool _isSecure = false;
  
  // Animation controllers
  late AnimationController _toolbarAnimationController;
  late AnimationController _progressAnimationController;
  late Animation<double> _toolbarAnimation;
  late Animation<double> _progressAnimation;

  // Gesture tracking - Updated for better scroll handling
  bool _isDragging = false;
  double _dragDistance = 0.0;
  double _startDragY = 0.0;
  static const double _dismissThreshold = 150.0; // Increased threshold
  static const double _dragSensitivity = 20.0; // Added sensitivity

  @override
  void initState() {
    super.initState();
    _currentUrl = widget.url;
    _pageTitle = widget.title ?? 'Loading...';
    
    // Initialize animation controllers
    _toolbarAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    
    _progressAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    
    _toolbarAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _toolbarAnimationController, curve: Curves.easeInOut),
    );
    
    _progressAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _progressAnimationController, curve: Curves.easeInOut),
    );
    
    // Start animations
    _toolbarAnimationController.forward();
  }

  @override
  void dispose() {
    _toolbarAnimationController.dispose();
    _progressAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final backgroundColor = widget.backgroundColor ?? theme.scaffoldBackgroundColor;
    final foregroundColor = widget.foregroundColor ?? theme.primaryColor;
    
    return Scaffold(
      backgroundColor: backgroundColor,
      body: Stack(
        children: [
          // Main WebView Container with gesture detection only on toolbar area
          Container(
            margin: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 100,
            ),
            child: Column(
              children: [
                // Progress bar
                if (widget.showProgressBar && _isLoading)
                  AnimatedBuilder(
                    animation: _progressAnimation,
                    builder: (context, child) => LinearProgressIndicator(
                      value: _progress,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
                    ),
                  ),
                
                // WebView - No gesture detector here to allow scrolling
                Expanded(
                  child: Transform.translate(
                    offset: Offset(0, _dragDistance * 0.3), // Reduced transform effect
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(_dragDistance > 0 ? 12 : 0),
                        boxShadow: _dragDistance > 0
                            ? [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 10,
                                  offset: const Offset(0, 5),
                                ),
                              ]
                            : null,
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: InAppWebView(
                        initialUrlRequest: URLRequest(url: WebUri(widget.url)),
                        initialOptions: InAppWebViewGroupOptions(
                          crossPlatform: InAppWebViewOptions(
                            javaScriptEnabled: true,
                            useOnDownloadStart: true,
                            useOnLoadResource: true,
                            useShouldOverrideUrlLoading: true,
                            mediaPlaybackRequiresUserGesture: false,
                            transparentBackground: false, // Changed to false for better performance
                            // Added scroll settings
                            verticalScrollBarEnabled: true,
                            horizontalScrollBarEnabled: true,
                            disableVerticalScroll: false,
                            disableHorizontalScroll: false,
                          ),
                          android: AndroidInAppWebViewOptions(
                            useHybridComposition: true,
                            supportMultipleWindows: false,
                            allowContentAccess: true,
                            allowFileAccess: true,
                            useWideViewPort: true,
                            loadWithOverviewMode: true,
                            mixedContentMode: AndroidMixedContentMode.MIXED_CONTENT_COMPATIBILITY_MODE,
                            // Enhanced scrolling support
                            domStorageEnabled: true,
                            databaseEnabled: true,
                            // allowFileAccessFromFileURLs: true,
                            // allowUniversalAccessFromFileURLs: true,
                          ),
                          ios: IOSInAppWebViewOptions(
                            allowsInlineMediaPlayback: true,
                            allowsBackForwardNavigationGestures: true,
                            scrollsToTop: true,
                            // Enhanced iOS scrolling
                            disallowOverScroll: false,
                            enableViewportScale: true,
                            suppressesIncrementalRendering: false,
                          ),
                        ),
                        onWebViewCreated: (controller) {
                          _webViewController = controller;
                        },
                        onLoadStart: (controller, url) {
                          setState(() {
                            _isLoading = true;
                            _currentUrl = url.toString();
                            _isSecure = url.toString().startsWith('https://');
                          });
                        },
                        onLoadStop: (controller, url) async {
                          setState(() {
                            _isLoading = false;
                            _currentUrl = url.toString();
                          });
                          
                          final title = await controller.getTitle();
                          setState(() {
                            _pageTitle = title ?? _extractDomainFromUrl(_currentUrl);
                          });
                          
                          _updateNavigationState();
                        },
                        onProgressChanged: (controller, progress) {
                          setState(() {
                            _progress = progress / 100.0;
                          });
                          
                          if (progress == 100) {
                            _progressAnimationController.reverse();
                          } else {
                            _progressAnimationController.forward();
                          }
                        },
                        onReceivedError: (controller, request, error) {
                          setState(() {
                            _isLoading = false;
                          });
                        },
                        shouldOverrideUrlLoading: (controller, navigationAction) async {
                          final url = navigationAction.request.url.toString();
                          
                          // Handle special schemes
                          if (url.startsWith('mailto:') || 
                              url.startsWith('tel:') || 
                              url.startsWith('sms:')) {
                            await _launchExternalUrl(url);
                            return NavigationActionPolicy.CANCEL;
                          }
                          
                          return NavigationActionPolicy.ALLOW;
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Top toolbar with gesture detection
          AnimatedBuilder(
            animation: _toolbarAnimation,
            builder: (context, child) => Transform.translate(
              offset: Offset(0, (1 - _toolbarAnimation.value) * -100),
              child: GestureDetector(
                // Only detect gestures on the toolbar area
                onPanStart: (details) {
                  _isDragging = true;
                  _dragDistance = 0.0;
                  _startDragY = details.globalPosition.dy;
                },
                onPanUpdate: (details) {
                  if (_isDragging) {
                    double deltaY = details.globalPosition.dy - _startDragY;
                    
                    // Only allow drag down and only if it's a significant movement
                    if (deltaY > _dragSensitivity) {
                      setState(() {
                        _dragDistance = deltaY - _dragSensitivity;
                      });
                      
                      // Hide toolbar when dragging down significantly
                      if (_dragDistance > 50) {
                        _toolbarAnimationController.reverse();
                      }
                    }
                  }
                },
                onPanEnd: (details) {
                  _isDragging = false;
                  
                  if (_dragDistance > _dismissThreshold) {
                    // Dismiss the browser
                    Navigator.of(context).pop();
                  } else {
                    // Snap back
                    _toolbarAnimationController.forward();
                    setState(() {
                      _dragDistance = 0.0;
                    });
                  }
                },
                child: _buildTopToolbar(context, foregroundColor),
              ),
            ),
          ),
          
          // Drag indicator - only show when actively dragging
          if (_dragDistance > 20)
            Positioned(
              top: MediaQuery.of(context).padding.top + 30,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[400],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTopToolbar(BuildContext context, Color foregroundColor) {
    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top,
        left: 16,
        right: 16,
        bottom: 1,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Top row with close and actions
          Row(
            children: [
              // Close button
              IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close),
                style: IconButton.styleFrom(
                  foregroundColor: foregroundColor,
                ),
              ),
              
              // Title and URL
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Title with navigation buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Back button
                        if (widget.enableBackForward)
                          IconButton(
                            onPressed: _canGoBack ? _goBack : null,
                            icon: const Icon(Icons.arrow_back_ios),
                            iconSize: 16,
                            style: IconButton.styleFrom(
                              foregroundColor: _canGoBack ? foregroundColor : Colors.grey,
                              minimumSize: const Size(32, 32),
                              padding: const EdgeInsets.all(4),
                            ),
                          ),
                        
                        // Title (flexible to take remaining space)
                        Expanded(
                          child: Text(
                            _pageTitle,
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                          ),
                        ),
                        
                        // Forward button
                        if (widget.enableBackForward)
                          IconButton(
                            onPressed: _canGoForward ? _goForward : null,
                            icon: const Icon(Icons.arrow_forward_ios),
                            iconSize: 16,
                            style: IconButton.styleFrom(
                              foregroundColor: _canGoForward ? foregroundColor : Colors.grey,
                              minimumSize: const Size(32, 32),
                              padding: const EdgeInsets.all(4),
                            ),
                          ),
                      ],
                    ),
                    
                    // URL row with refresh button
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Refresh button
                        if (widget.enableRefresh)
                          IconButton(
                            onPressed: _refresh,
                            icon: _isLoading 
                                ? SizedBox(
                                    width: 12,
                                    height: 12,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 1.5,
                                      valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
                                    ),
                                  )
                                : const Icon(Icons.refresh),
                            iconSize: 14,
                            style: IconButton.styleFrom(
                              foregroundColor: foregroundColor,
                              minimumSize: const Size(28, 28),
                              padding: const EdgeInsets.all(2),
                            ),
                          ),
                        
                        // Security icon
                        if (_isSecure) ...[
                          Icon(
                            Icons.lock,
                            size: 12,
                            color: Colors.green[600],
                          ),
                          const SizedBox(width: 4),
                        ],
                        
                        // Domain URL
                        Expanded(
                          child: Text(
                            _extractDomainFromUrl(_currentUrl),
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                          ),
                        ),
                        
                        // Spacer to balance the refresh button
                        if (widget.enableRefresh)
                          const SizedBox(width: 28),
                      ],
                    ),
                  ],
                ),
              ),
              
              // More options
              PopupMenuButton<String>(
                onSelected: _handleMenuAction,
                itemBuilder: (context) => [
                  if (widget.enableRefresh)
                    const PopupMenuItem(
                      value: 'refresh',
                      child: Row(
                        children: [
                          Icon(Icons.refresh),
                          SizedBox(width: 8),
                          Text('Refresh'),
                        ],
                      ),
                    ),
                  if (widget.enableShare)
                    const PopupMenuItem(
                      value: 'share',
                      child: Row(
                        children: [
                          Icon(Icons.share),
                          SizedBox(width: 8),
                          Text('Share'),
                        ],
                      ),
                    ),
                  const PopupMenuItem(
                    value: 'copy',
                    child: Row(
                      children: [
                        Icon(Icons.copy),
                        SizedBox(width: 8),
                        Text('Copy Link'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'external',
                    child: Row(
                      children: [
                        Icon(Icons.open_in_browser),
                        SizedBox(width: 8),
                        Text('Open in Browser'),
                      ],
                    ),
                  ),
                ],
                icon: Icon(
                  Icons.more_vert,
                  color: foregroundColor,
                ),
              ),
            ],
          ),
          
          // Navigation buttons
          // if (widget.enableBackForward)
          //   Row(
          //     mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          //     children: [
          //       IconButton(
          //         onPressed: _canGoBack ? _goBack : null,
          //         icon: const Icon(Icons.arrow_back_ios),
          //         style: IconButton.styleFrom(
          //           foregroundColor: foregroundColor,
          //         ),
          //       ),
          //       IconButton(
          //         onPressed: _canGoForward ? _goForward : null,
          //         icon: const Icon(Icons.arrow_forward_ios),
          //         style: IconButton.styleFrom(
          //           foregroundColor: foregroundColor,
          //         ),
          //       ),
          //       IconButton(
          //         onPressed: _refresh,
          //         icon: _isLoading 
          //             ? const SizedBox(
          //                 width: 20,
          //                 height: 20,
          //                 child: CircularProgressIndicator(strokeWidth: 2),
          //               )
          //             : const Icon(Icons.refresh),
          //         style: IconButton.styleFrom(
          //           foregroundColor: foregroundColor,
          //         ),
          //       ),
          //     ],
          //   ),
        ],
      ),
    );
  }

  void _handleMenuAction(String action) async {
    switch (action) {
      case 'refresh':
        _refresh();
        break;
      case 'share':
        _shareUrl();
        break;
      case 'copy':
        _copyUrl();
        break;
      case 'external':
        _openInExternalBrowser();
        break;
    }
  }

  void _refresh() {
    _webViewController?.reload();
  }

  void _goBack() {
    _webViewController?.goBack();
  }

  void _goForward() {
    _webViewController?.goForward();
  }

  void _shareUrl() {
    // Implement share functionality
    // You can use the share_plus package here
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Share: $_currentUrl')),
    );
  }

  void _copyUrl() {
    Clipboard.setData(ClipboardData(text: _currentUrl));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('URL copied to clipboard')),
    );
  }

  void _openInExternalBrowser() async {
    await _launchExternalUrl(_currentUrl);
  }

  Future<void> _launchExternalUrl(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Error launching external URL: $e');
    }
  }

  void _updateNavigationState() async {
    final canGoBack = await _webViewController?.canGoBack() ?? false;
    final canGoForward = await _webViewController?.canGoForward() ?? false;
    
    setState(() {
      _canGoBack = canGoBack;
      _canGoForward = canGoForward;
    });
  }

  String _extractDomainFromUrl(String url) {
    try {
      final uri = Uri.parse(url);
      return uri.host;
    } catch (e) {
      return url;
    }
  }
}
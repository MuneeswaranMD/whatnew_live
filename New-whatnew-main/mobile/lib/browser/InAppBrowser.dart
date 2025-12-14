import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

/// A utility class to handle in-app browser functionality
class AppBrowser {
  // Singleton instance
  static final AppBrowser _instance = AppBrowser._internal();
  factory AppBrowser() => _instance;
  AppBrowser._internal();

  /// Chrome Safari Browser instance
  final ChromeSafariBrowser _browser = ChromeSafariBrowser();

  /// Opens a URL in Chrome Custom Tabs (Android) or Safari View Controller (iOS)
  /// 
  /// This provides a more integrated experience while keeping the user in your app
  Future<void> openCustomTab(
    String url, {
    Color? toolbarColor,
    bool enableDefaultShare = true,
  }) async {
    try {
      await _browser.open(
        url: WebUri(url),
        options: ChromeSafariBrowserClassOptions(
          android: AndroidChromeCustomTabsOptions(
            shareState: enableDefaultShare 
                ? CustomTabsShareState.SHARE_STATE_ON 
                : CustomTabsShareState.SHARE_STATE_OFF,
            addDefaultShareMenuItem: enableDefaultShare,
            // toolbarBackgroundColor: toolbarColor?.value,
          ),
          ios: IOSSafariOptions(
            preferredBarTintColor: toolbarColor,
          ),
        ),
      );
    } catch (e) {
      // debugPrint('Error opening custom tab: $e');
      // Fallback to external browser
      _openExternalBrowser(url);
    }
  }

  /// Opens URL in external browser (fallback method)
  Future<void> _openExternalBrowser(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        // debugPrint('Could not launch $url');
      }
    } catch (e) {
      // debugPrint('Error opening external browser: $e');
    }
  }

  /// Shows a URL in a bottom sheet with embedded WebView
  Future<void> showAsBottomSheet(BuildContext context, String url) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Drag handle
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              
              // Header with URL and actions
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: Colors.grey[300]!),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Web Content',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            url,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.open_in_browser),
                      onPressed: () {
                        Navigator.pop(context);
                        openCustomTab(url);
                      },
                      tooltip: 'Open in Browser',
                    ),
                    IconButton(
                      icon: const Icon(Icons.launch),
                      onPressed: () {
                        Navigator.pop(context);
                        _openExternalBrowser(url);
                      },
                      tooltip: 'External Browser',
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                      tooltip: 'Close',
                    ),
                  ],
                ),
              ),
              
              // WebView content
              Expanded(
                child: Container(
                  margin: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: InAppWebView(
                      initialUrlRequest: URLRequest(url: WebUri(url)),
                      initialOptions: InAppWebViewGroupOptions(
                        crossPlatform: InAppWebViewOptions(
                          javaScriptEnabled: true,
                          useOnDownloadStart: true,
                          useOnLoadResource: true,
                          useShouldOverrideUrlLoading: true,
                          mediaPlaybackRequiresUserGesture: false,
                          allowFileAccessFromFileURLs: true,
                          allowUniversalAccessFromFileURLs: true,
                        ),
                        android: AndroidInAppWebViewOptions(
                          useHybridComposition: true,
                          supportMultipleWindows: false,
                        ),
                        ios: IOSInAppWebViewOptions(
                          allowsInlineMediaPlayback: true,
                          allowsBackForwardNavigationGestures: true,
                        ),
                      ),
                      onWebViewCreated: (controller) {
                        // debugPrint('WebView created for: $url');
                      },
                      onLoadStart: (controller, url) {
                        // debugPrint('WebView started loading: $url');
                      },
                      onLoadStop: (controller, url) {
                        // debugPrint('WebView finished loading: $url');
                      },
                      onReceivedError: (controller, request, error) {
                        // debugPrint('WebView error: ${error.description}');
                      },
                      shouldOverrideUrlLoading: (controller, navigationAction) async {
                        final url = navigationAction.request.url.toString();
                        
                        // Handle external links
                        if (url.startsWith('mailto:') || 
                            url.startsWith('tel:') || 
                            url.startsWith('sms:')) {
                          await _openExternalBrowser(url);
                          return NavigationActionPolicy.CANCEL;
                        }
                        
                        return NavigationActionPolicy.ALLOW;
                      },
                      onDownloadStartRequest: (controller, downloadStartRequest) async {
                        // debugPrint('Download started: ${downloadStartRequest.url}');
                        await _openExternalBrowser(downloadStartRequest.url.toString());
                      },
                    ),
                  ),
                ),
              ),
              
              // Bottom action bar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(color: Colors.grey[300]!),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          openCustomTab(url);
                        },
                        icon: const Icon(Icons.tab),
                        label: const Text('Open in Tab'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          _openExternalBrowser(url);
                        },
                        icon: const Icon(Icons.launch),
                        label: const Text('External'),
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

  /// Alternative: Simple bottom sheet with options (fallback if WebView fails)
  Future<void> showOptionsBottomSheet(BuildContext context, String url) async {
    await showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Open Link',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Text(
              url,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      openCustomTab(url);
                    },
                    icon: const Icon(Icons.open_in_browser),
                    label: const Text('Open in Browser'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      _openExternalBrowser(url);
                    },
                    icon: const Icon(Icons.launch),
                    label: const Text('External Browser'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
          ],
        ),
      ),
    );
  }

  /// Direct external browser access
  Future<void> openExternalBrowser(String url) async {
    await _openExternalBrowser(url);
  }
}

///USAGE EXAMPLE
///// Quick usage:
// AppBrowser().openCustomTab('https://example.com');

// Custom styling:
// AppBrowser().openCustomTab(
//   'https://example.com',
//   toolbarColor: Colors.blue,
//   enableDefaultShare: true,
// );

// In-app bottom sheet with WebView:
// AppBrowser().showAsBottomSheet(context, 'https://example.com');

// Simple options bottom sheet:
// AppBrowser().showOptionsBottomSheet(context, 'https://example.com');
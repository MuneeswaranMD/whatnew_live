import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/livestream_provider.dart';
import '../../constants/app_colors.dart';
import '../../models/livestream.dart';
import '../../utils/image_widgets.dart';
import '../livestream/livestream_detail_screen.dart';

class LiveStreamsScreen extends StatefulWidget {
  final String? category;
  
  const LiveStreamsScreen({Key? key, this.category}) : super(key: key);

  @override
  State<LiveStreamsScreen> createState() => _LiveStreamsScreenState();
}

class _LiveStreamsScreenState extends State<LiveStreamsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStreams();
    });
  }

  Future<void> _loadStreams() async {
    final provider = Provider.of<LivestreamProvider>(context, listen: false);
    
    // Load based on category type
    if (widget.category == 'scheduled') {
      await provider.getLivestreams(status: 'scheduled');
    } else if (widget.category == 'ended') {
      await provider.getLivestreams(status: 'ended');
    } else {
      // Load all streams and live now
      await provider.getLiveNow();
      await provider.getLivestreams();
    }
  }

  String _getAppBarTitle() {
    if (widget.category == null) return 'Live Streams';
    if (widget.category == 'scheduled') return 'Scheduled Streams';
    if (widget.category == 'ended') return 'Ended Streams';
    return '${widget.category} Streams';
  }

  List<LiveStream> _getFilteredLivestreams(LivestreamProvider provider) {
    if (widget.category == null || 
        widget.category == 'scheduled' || 
        widget.category == 'ended') {
      return provider.livestreams;
    }
    
    // Filter by product category
    return provider.livestreams.where((stream) => 
      stream.categoryName.toLowerCase() == widget.category!.toLowerCase()
    ).toList();
  }

  List<LiveStream> _getFilteredLiveNow(LivestreamProvider provider) {
    if (widget.category == null || 
        widget.category == 'scheduled' || 
        widget.category == 'ended') {
      return provider.liveNow;
    }
    
    // Filter by product category
    return provider.liveNow.where((stream) => 
      stream.categoryName.toLowerCase() == widget.category!.toLowerCase()
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_getAppBarTitle()),
        backgroundColor: AppColors.primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Consumer<LivestreamProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Error: ${provider.error}',
                    style: const TextStyle(color: Colors.red),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _loadStreams,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          // Filter livestreams by category if specified
          List<LiveStream> filteredLivestreams = _getFilteredLivestreams(provider);
          List<LiveStream> filteredLiveNow = _getFilteredLiveNow(provider);
          
          return RefreshIndicator(
            onRefresh: _loadStreams,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Live Now Section
                  if (filteredLiveNow.isNotEmpty && widget.category != 'scheduled' && widget.category != 'ended') ...[
                    const Text(
                      'Live Now',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 200,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: filteredLiveNow.length,
                        itemBuilder: (context, index) {
                          final livestream = filteredLiveNow[index];
                          return Container(
                            width: 150,
                            margin: const EdgeInsets.only(right: 12),
                            child: _buildLivestreamCard(livestream),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // All Streams Section
                  Text(
                    _getSectionTitle(),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  if (filteredLivestreams.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.borderColor),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.live_tv_outlined,
                            size: 48,
                            color: AppColors.textSecondaryColor,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            _getEmptyMessage(),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimaryColor,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Check back later for more content',
                            style: TextStyle(
                              color: AppColors.textSecondaryColor,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    )
                  else
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.75,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: filteredLivestreams.length,
                      itemBuilder: (context, index) {
                        final livestream = filteredLivestreams[index];
                        return _buildLivestreamCard(livestream);
                      },
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _getSectionTitle() {
    if (widget.category == 'scheduled') return 'Scheduled Streams';
    if (widget.category == 'ended') return 'Past Streams';
    return 'All Streams';
  }

  String _getEmptyMessage() {
    if (widget.category == 'scheduled') return 'No Scheduled Streams';
    if (widget.category == 'ended') return 'No Past Streams';
    if (widget.category != null) return 'No ${widget.category} Streams';
    return 'No Streams Available';
  }

  Widget _buildLivestreamCard(LiveStream livestream) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => LivestreamDetailScreen(
              livestreamId: livestream.id,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail/Placeholder
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  color: Colors.grey[100],
                ),
                child: livestream.thumbnail != null
                    ? ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                        child: Stack(
                          children: [
                            NetworkImageExtension.networkWithFallback(
                              livestream.thumbnail,
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                              errorWidget: _buildCategoryPlaceholder(
                                livestream.categoryName,
                                livestream.status == 'live',
                              ),
                            ),
                            if (livestream.status == 'live')
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.red,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text(
                                    'LIVE',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      )
                    : _buildCategoryPlaceholder(
                        livestream.categoryName,
                        livestream.status == 'live',
                      ),
              ),
            ),
            
            // Content
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(
                      child: Text(
                        livestream.title,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimaryColor,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      livestream.sellerName,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textSecondaryColor,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Icon(
                          _getStatusIcon(livestream.status),
                          size: 10,
                          color: _getStatusColor(livestream.status),
                        ),
                        const SizedBox(width: 3),
                        Flexible(
                          child: Text(
                            livestream.status.toUpperCase(),
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: _getStatusColor(livestream.status),
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        if (livestream.scheduledStartTime != null)
                          Flexible(
                            child: Text(
                              _formatDateTime(livestream.scheduledStartTime),
                              style: const TextStyle(
                                fontSize: 9,
                                color: AppColors.textSecondaryColor,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'live':
        return Icons.circle;
      case 'scheduled':
        return Icons.schedule;
      case 'ended':
        return Icons.stop_circle;
      default:
        return Icons.live_tv;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'live':
        return Colors.red;
      case 'scheduled':
        return Colors.orange;
      case 'ended':
        return Colors.grey;
      default:
        return AppColors.primaryColor;
    }
  }

  Widget _buildCategoryPlaceholder(String categoryName, bool isLive) {
    IconData icon;
    Color backgroundColor;
    Color iconColor;
    
    switch (categoryName.toLowerCase()) {
      case 'electronics':
      case 'phone':
      case 'mobile':
        icon = Icons.phone_android;
        backgroundColor = AppColors.primaryColor.withOpacity(0.1);
        iconColor = AppColors.primaryColor;
        break;
      case 'fashion':
      case 'clothing':
      case 'clothes':
        icon = Icons.checkroom;
        backgroundColor = Colors.purple.withOpacity(0.1);
        iconColor = Colors.purple;
        break;
      case 'home & kitchen':
      case 'home':
      case 'kitchen':
        icon = Icons.home;
        backgroundColor = Colors.green.withOpacity(0.1);
        iconColor = Colors.green;
        break;
      case 'books':
      case 'book':
        icon = Icons.menu_book;
        backgroundColor = Colors.brown.withOpacity(0.1);
        iconColor = Colors.brown;
        break;
      case 'sports':
        icon = Icons.sports_soccer;
        backgroundColor = Colors.orange.withOpacity(0.1);
        iconColor = Colors.orange;
        break;
      case 'beauty':
        icon = Icons.auto_awesome;
        backgroundColor = Colors.pink.withOpacity(0.1);
        iconColor = Colors.pink;
        break;
      case 'toys':
        icon = Icons.toys;
        backgroundColor = Colors.orange.withOpacity(0.1);
        iconColor = Colors.orange;
        break;
      default:
        icon = Icons.live_tv;
        backgroundColor = AppColors.primaryColor.withOpacity(0.1);
        iconColor = AppColors.primaryColor;
    }
    
    return Container(
      color: backgroundColor,
      child: Stack(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  size: 40,
                  color: iconColor,
                ),
                const SizedBox(height: 8),
                Text(
                  categoryName.toUpperCase(),
                  style: TextStyle(
                    color: iconColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          if (isLive)
            Positioned(
              top: 8,
              right: 8,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'LIVE',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  String _formatDateTime(dynamic dateTime) {
    if (dateTime == null) return 'Unknown';
    try {
      final dt = dateTime is DateTime ? dateTime : DateTime.parse(dateTime.toString());
      final now = DateTime.now();
      final difference = now.difference(dt);
      
      if (difference.inDays > 0) {
        return '${difference.inDays}d ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours}h ago';
      } else {
        return '${difference.inMinutes}m ago';
      }
    } catch (e) {
      return 'Unknown';
    }
  }
}

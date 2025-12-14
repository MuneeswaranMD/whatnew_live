import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/livestream_provider.dart';
import '../../providers/category_provider.dart';
import '../../constants/app_theme.dart';
import '../../models/livestream.dart';
import '../livestream/livestream_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  int _selectedTabIndex = 0;

  @override
  void initState() {
    super.initState();
    // Initialize with a basic tab controller, will be updated when categories load
    _tabController = TabController(length: 1, vsync: this);
    
    // Use post-frame callback to avoid setState during build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final livestreamProvider = context.read<LivestreamProvider>();
    final categoryProvider = context.read<CategoryProvider>();
    
    // Load live streams and categories
    await Future.wait([
      livestreamProvider.getLiveNow(),
      categoryProvider.loadCategories(),
    ]);

    // Update tab controller when categories are loaded
    if (mounted) {
      _updateTabController();
    }
  }

  void _updateTabController() {
    final categoryProvider = context.read<CategoryProvider>();
    final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
    
    // Create tabs: "For You" + Category tabs
    final newLength = 1 + categories.length;
    
    if (_tabController.length != newLength) {
      _tabController.dispose();
      _tabController = TabController(length: newLength, vsync: this);
      _tabController.addListener(() {
        if (_tabController.indexIsChanging) {
          setState(() {
            _selectedTabIndex = _tabController.index;
          });
        }
      });
      setState(() {});
    }
  }

  Future<void> _refreshData() async {
    await _loadData();
  }

  List<LiveStream> _getFilteredLivestreams(String? categoryFilter) {
    final livestreamProvider = context.read<LivestreamProvider>();
    List<LiveStream> streams = List.from(livestreamProvider.liveNow);
    
    // Filter by category if specified
    if (categoryFilter != null && categoryFilter.isNotEmpty) {
      streams = streams.where((stream) => 
        stream.categoryName.toLowerCase() == categoryFilter.toLowerCase()
      ).toList();
    }
    
    // Sort by viewer count (descending)
    streams.sort((a, b) => b.viewerCount.compareTo(a.viewerCount));
    
    return streams;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Consumer2<CategoryProvider, LivestreamProvider>(
        builder: (context, categoryProvider, livestreamProvider, child) {
          final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
          
          return RefreshIndicator(
            onRefresh: _refreshData,
            child: NestedScrollView(
              headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
                return [
                  // App Bar with Search, Notifications, and Referral
                  SliverAppBar(
                    backgroundColor: AppColors.primaryColor,
                    elevation: 0,
                    floating: true,
                    pinned: true,
                    expandedHeight: 120,
                    flexibleSpace: FlexibleSpaceBar(
                      background: Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: AppColors.primaryGradient,
                          ),
                        ),
                      ),
                      title: Consumer<AuthProvider>(
                        builder: (context, authProvider, child) {
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Hi, ${authProvider.user?.firstName ?? 'User'}!',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const Text(
                                'Discover live shopping',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                  fontWeight: FontWeight.normal,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                      titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
                    ),
                    actions: [
                      // Search Icon
                      IconButton(
                        icon: const Icon(Icons.search, color: Colors.white, size: 24),
                        onPressed: () {
                          // TODO: Navigate to search
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Search coming soon!')),
                          );
                        },
                      ),
                      // Notification Icon
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: Colors.white, size: 24),
                        onPressed: () {
                          // TODO: Navigate to notifications
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Notifications coming soon!')),
                          );
                        },
                      ),
                      // Referral Icon
                      IconButton(
                        icon: const Icon(Icons.card_giftcard, color: Colors.white, size: 24),
                        onPressed: () {
                          // TODO: Navigate to referrals
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Referrals coming soon!')),
                          );
                        },
                      ),
                      const SizedBox(width: 8),
                    ],
                  ),
                  
                  // Tab Bar
                  SliverPersistentHeader(
                    pinned: true,
                    delegate: _SliverTabBarDelegate(
                      TabBar(
                        controller: _tabController,
                        isScrollable: true,
                        indicatorColor: AppColors.primaryColor,
                        indicatorWeight: 3,
                        labelColor: AppColors.primaryColor,
                        unselectedLabelColor: AppColors.textSecondaryColor,
                        labelStyle: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                        unselectedLabelStyle: const TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 14,
                        ),
                        tabs: [
                          const Tab(text: 'For You'),
                          ...categories.map((category) => Tab(text: category.name)),
                        ],
                      ),
                    ),
                  ),
                ];
              },
              body: TabBarView(
                controller: _tabController,
                children: [
                  // "For You" tab - shows all live streams
                  _buildLivestreamsGrid(_getFilteredLivestreams(null)),
                  // Category tabs
                  ...categories.map((category) => 
                    _buildLivestreamsGrid(_getFilteredLivestreams(category.name))
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLivestreamsGrid(List<LiveStream> livestreams) {
    if (context.read<LivestreamProvider>().isLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (livestreams.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.live_tv_outlined,
                size: 64,
                color: AppColors.textSecondaryColor.withOpacity(0.5),
              ),
              const SizedBox(height: 16),
              Text(
                'No Live Streams',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondaryColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Check back later for live shopping events in this category',
                style: TextStyle(
                  color: AppColors.textSecondaryColor.withOpacity(0.7),
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
        ),
        itemCount: livestreams.length,
        itemBuilder: (context, index) {
          final livestream = livestreams[index];
          return _LivestreamGridCard(
            livestream: livestream,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => LivestreamDetailScreen(
                    livestreamId: livestream.id,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// Custom widget for grid card design
class _LivestreamGridCard extends StatelessWidget {
  final LiveStream livestream;
  final VoidCallback onTap;

  const _LivestreamGridCard({
    required this.livestream,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Livestream Image with overlays
              Expanded(
                flex: 3,
                child: Stack(
                  children: [
                    // Background Image/Thumbnail
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            AppColors.primaryColor.withOpacity(0.3),
                            AppColors.primaryColor.withOpacity(0.8),
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.live_tv,
                          size: 40,
                          color: Colors.white60,
                        ),
                      ),
                    ),
                    
                    // Live Badge
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.liveColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 4,
                              height: 4,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 3),
                            const Text(
                              'LIVE',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    // Viewer Count
                    if (livestream.viewerCount > 0)
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.visibility,
                                size: 10,
                                color: Colors.white,
                              ),
                              const SizedBox(width: 3),
                              Text(
                                _formatViewerCount(livestream.viewerCount),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              
              // Content Section
              Expanded(
                flex: 2,
                child: Container(
                  width: double.infinity,
                  color: Colors.white,
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        livestream.title,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimaryColor,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      
                      const SizedBox(height: 4),
                      
                      // Category
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          livestream.categoryName,
                          style: TextStyle(
                            color: AppColors.primaryColor,
                            fontSize: 9,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 6),
                      
                      // Description
                      Expanded(
                        child: Text(
                          livestream.description,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondaryColor,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatViewerCount(int count) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return '${(count / 1000).toStringAsFixed(1)}K';
    } else {
      return '${(count / 1000000).toStringAsFixed(1)}M';
    }
  }
}

// Custom delegate for tab bar
class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;

  _SliverTabBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;

  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Colors.white,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverTabBarDelegate oldDelegate) {
    return false;
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/livestream_provider.dart';
import '../../providers/category_provider.dart';
import '../../constants/app_theme.dart';
import '../../models/livestream.dart';
import '../../utils/image_utils.dart';
import '../livestream/livestream_detail_screen.dart';
import '../search/search_screen.dart';
import '../referral/referral_screen.dart';
import '../../widgets/notification_badge.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  TabController? _tabController;
  final ValueNotifier<TabController?> _tabControllerNotifier = ValueNotifier(null);

  @override
  void initState() {
    super.initState();
    // Initialize with a basic tab controller to prevent initial errors
    _tabController = TabController(length: 5, vsync: this);
    _tabControllerNotifier.value = _tabController;
    
    // Use post-frame callback to avoid setState during build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  @override
  void dispose() {
    _tabController?.dispose();
    _tabControllerNotifier.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    // print('HomeScreen: Starting to load data');
    final livestreamProvider = context.read<LivestreamProvider>();
    final categoryProvider = context.read<CategoryProvider>();
    
    // Load live streams and categories
    // print('HomeScreen: Loading live streams and categories...');
    final results = await Future.wait([
      livestreamProvider.getLiveNow(),
      categoryProvider.loadCategories(),
    ]);
    
    // print('HomeScreen: Live streams loaded: ${results[0]}, Categories loaded: ${results[1]}');
    // print('HomeScreen: Live streams count: ${livestreamProvider.liveNow.length}');
    // print('HomeScreen: Categories count: ${categoryProvider.categories.length}');
    // print('HomeScreen: Active categories: ${categoryProvider.categories.where((cat) => cat.isActive).length}');

    // Update tab controller when categories are loaded
    if (mounted) {
      // print('HomeScreen: Updating tab controller');
      _updateTabController();
    }
  }

  void _updateTabController() {
    final categoryProvider = context.read<CategoryProvider>();
    final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
    
    // print('HomeScreen: _updateTabController called');
    // print('HomeScreen: Active categories for tabs: ${categories.map((c) => c.name).toList()}');
    
    // Create tabs: "For You" + Category tabs
    final newLength = 1 + categories.length;
    
    // print('HomeScreen: Current tab controller length: ${_tabController?.length}, new length: $newLength');
    
    // Only update if the length has actually changed and we have valid data
    final currentTabController = _tabController;
    if (currentTabController != null && currentTabController.length != newLength && newLength > 1) {
      // print('HomeScreen: Disposing old tab controller and creating new one');
      
      // Store the current index to restore it
      final currentIndex = _tabController?.index ?? 0;
      
      // Dispose old controller
      _tabController?.dispose();
      
      // Create new controller
      _tabController = TabController(
        length: newLength, 
        vsync: this,
        initialIndex: currentIndex < newLength ? currentIndex : 0, // Keep current tab if possible
      );
      
      // Update the notifier with the new controller
      _tabControllerNotifier.value = _tabController;
      
      _tabController?.addListener(() {
        if (_tabController?.indexIsChanging == true) {
          // print('HomeScreen: Tab changed to index: ${_tabController?.index}');
          // Don't call setState here as it's not needed for tab changes
        }
      });
      
      // Use post-frame callback to avoid setState during build
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          setState(() {});
        }
      });
      
      // print('HomeScreen: Tab controller updated successfully');
    } else {
      // print('HomeScreen: Tab controller length unchanged or invalid newLength: $newLength');
    }
  }

  Future<void> _refreshData() async {
    await _loadData();
  }

  List<LiveStream> _getFilteredLivestreams(String? categoryFilter) {
    final livestreamProvider = context.read<LivestreamProvider>();
    List<LiveStream> streams = List.from(livestreamProvider.liveNow);
    
    // print('HomeScreen: _getFilteredLivestreams called with category: $categoryFilter');
    // print('HomeScreen: Total live streams: ${streams.length}');
    
    // Filter by category if specified (except for "For You" tab)
    if (categoryFilter != null && categoryFilter.isNotEmpty) {
      streams = streams.where((stream) => 
        stream.categoryName.toLowerCase() == categoryFilter.toLowerCase()
      ).toList();
      // print('HomeScreen: After category filter "$categoryFilter": ${streams.length} streams');
    }
    
    // Sort by viewer count (descending - highest views first)
    streams.sort((a, b) => b.viewerCount.compareTo(a.viewerCount));
    
    // print('HomeScreen: Final filtered streams: ${streams.length}');
    return streams;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      body: Consumer2<CategoryProvider, LivestreamProvider>(
        builder: (context, categoryProvider, livestreamProvider, child) {
          final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
          
          // print('HomeScreen.build: Consumer2 called');
          // print('HomeScreen.build: CategoryProvider loading: ${categoryProvider.isLoading}');
          // print('HomeScreen.build: CategoryProvider error: ${categoryProvider.error}');
          // print('HomeScreen.build: Total categories: ${categoryProvider.categories.length}');
          // print('HomeScreen.build: Active categories: ${categories.length}');
          // print('HomeScreen.build: Active category names: ${categories.map((c) => c.name).toList()}');
          // print('HomeScreen.build: LivestreamProvider loading: ${livestreamProvider.isLoading}');
          // print('HomeScreen.build: LivestreamProvider error: ${livestreamProvider.error}');
          // print('HomeScreen.build: Live streams count: ${livestreamProvider.liveNow.length}');
          // print('HomeScreen.build: Live streams: ${livestreamProvider.liveNow.map((s) => '${s.title} (${s.categoryName})').toList()}');
          
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
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const SearchScreen(),
                            ),
                          );
                        },
                      ),
                      // Notification Icon with Badge
                      NotificationBadge(iconColor: Colors.white),
                      // Referral Icon
                      IconButton(
                        icon: const Icon(Icons.card_giftcard, color: Colors.white, size: 24),
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => const ReferralScreen(),
                            ),
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
                      ValueListenableBuilder<TabController?>(
                        valueListenable: _tabControllerNotifier,
                        builder: (context, tabController, child) {
                          if (tabController == null) {
                            return const TabBar(
                              tabs: [
                                Tab(text: 'Loading...'),
                              ],
                            );
                          }
                          
                          final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
                          final tabs = [
                            const Tab(text: 'For You'),
                            ...categories.map((category) => Tab(text: category.name)),
                          ];
                          
                          // If we don't have categories yet, show some default tabs to prevent empty tab bar
                          final finalTabs = categories.isEmpty ? const [
                            Tab(text: 'For You'),
                            Tab(text: 'Electronics'),
                            Tab(text: 'Fashion'),
                            Tab(text: 'Home'),
                            Tab(text: 'Books'),
                          ] : tabs;
                          
                          // print('HomeScreen.build: Creating tabs: ${finalTabs.map((t) => t.text).toList()}');
                          // print('HomeScreen.build: Tab controller length: ${tabController.length}');
                          // print('HomeScreen.build: Expected tabs length: ${finalTabs.length}');
                          
                          return TabBar(
                            controller: tabController,
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
                            tabs: finalTabs,
                          );
                        },
                      ),
                    ),
                  ),
                ];
              },
              body: ValueListenableBuilder<TabController?>(
                valueListenable: _tabControllerNotifier,
                builder: (context, tabController, child) {
                  if (tabController == null) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  
                  return TabBarView(
                    controller: tabController,
                    children: () {
                      final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
                      
                      // Ensure the number of children matches the tab controller length
                      final expectedLength = tabController.length;
                      
                      // If we don't have categories yet or the counts don't match, show default tab views
                      if (categories.isEmpty || (1 + categories.length) != expectedLength) {
                        return List.generate(expectedLength, (index) {
                          if (index == 0) {
                            return _buildLivestreamsGrid(_getFilteredLivestreams(null));
                          } else {
                            // Use default category names for extra tabs
                            final defaultCategories = ['Electronics', 'Fashion', 'Home', 'Books'];
                            final categoryName = index - 1 < defaultCategories.length 
                                ? defaultCategories[index - 1] 
                                : null;
                            return _buildLivestreamsGrid(_getFilteredLivestreams(categoryName));
                          }
                        });
                      }
                      
                      final children = [
                        // "For You" tab - shows all live streams
                        _buildLivestreamsGrid(_getFilteredLivestreams(null)),
                        // Category tabs
                        ...categories.map((category) => 
                          _buildLivestreamsGrid(_getFilteredLivestreams(category.name))
                        ),
                      ];
                      // print('HomeScreen.build: Creating TabBarView with ${children.length} children');
                      // print('HomeScreen.build: Tab controller length: ${tabController.length}');
                      return children;
                    }(),
                  );
                },
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
      return SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Center(
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
        ),
      );
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.6, // Adjusted to 3:5 ratio to better accommodate 480x720px images
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
              // Livestream Image with overlays - taking more space to show 480x720px image properly
              Expanded(
                flex: 4, // Increased from 3 to 4 for better image visibility
                child: Stack(
                  children: [
                    // Background Image/Thumbnail - designed for 480x720px (2:3 aspect ratio)
                    Container(
                      width: double.infinity,
                      height: double.infinity,
                      child: livestream.thumbnail != null && livestream.thumbnail?.isNotEmpty == true
                          ? ClipRRect(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                              child: Builder(
                                builder: (context) {
                                  final imageUrl = ImageUtils.getFullImageUrl(livestream.thumbnail);
                                  ImageUtils.logImageLoad(livestream.thumbnail, imageUrl);
                                  
                                  return Image.network(
                                    imageUrl,
                                    width: double.infinity,
                                    height: double.infinity,
                                    fit: BoxFit.cover, // Cover ensures the 480x720px image fills the space properly
                                    errorBuilder: (context, error, stackTrace) {
                                      ImageUtils.logImageError(imageUrl, error);
                                      // print('LivestreamGridCard: Error loading image for ${livestream.title}: $error');
                                      return _buildCategoryPlaceholder(livestream.categoryName);
                                    },
                                    loadingBuilder: (context, child, loadingProgress) {
                                      if (loadingProgress == null) {
                                        ImageUtils.logImageSuccess(imageUrl);
                                        // print('LivestreamGridCard: Image loaded successfully for ${livestream.title}');
                                        return child;
                                      }
                                      // print('LivestreamGridCard: Loading image for ${livestream.title}...');
                                      return Container(
                                        width: double.infinity,
                                        height: double.infinity,
                                        color: Colors.grey[200],
                                        child: Center(
                                          child: CircularProgressIndicator(
                                            value: loadingProgress.expectedTotalBytes != null
                                                ? loadingProgress.cumulativeBytesLoaded / 
                                                  (loadingProgress.expectedTotalBytes ?? 1)
                                                : null,
                                            strokeWidth: 2,
                                            color: AppColors.primaryColor,
                                          ),
                                        ),
                                      );
                                    },
                                  );
                                },
                              ),
                            )
                          : _buildCategoryPlaceholder(livestream.categoryName),
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
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 4,
                              offset: const Offset(0, 1),
                            ),
                          ],
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
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                blurRadius: 4,
                                offset: const Offset(0, 1),
                              ),
                            ],
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
              
              // Content Section - reduced to give more space to image
              Expanded(
                flex: 1, // Reduced from 2 to 1 to give more space to the image
                child: Container(
                  width: double.infinity,
                  color: Colors.white,
                  padding: const EdgeInsets.all(8), // Reduced padding to fit more content
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Title and Category Row
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Title
                          Text(
                            livestream.title,
                            style: const TextStyle(
                              fontSize: 12, // Slightly reduced font size
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimaryColor,
                            ),
                            maxLines: 1, // Reduced to 1 line to save space
                            overflow: TextOverflow.ellipsis,
                          ),
                          
                          const SizedBox(height: 3),
                          
                          // Category
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                            decoration: BoxDecoration(
                              color: AppColors.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(3),
                            ),
                            child: Text(
                              livestream.categoryName,
                              style: TextStyle(
                                color: AppColors.primaryColor,
                                fontSize: 8,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      // Description (only if there's space)
                      if (livestream.description.isNotEmpty)
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 3),
                            child: Text(
                              livestream.description,
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.textSecondaryColor,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
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

  Widget _buildCategoryPlaceholder(String categoryName) {
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
      width: double.infinity,
      height: double.infinity,
      color: backgroundColor,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 32,
              color: iconColor,
            ),
            const SizedBox(height: 4),
            Text(
              categoryName.toUpperCase(),
              style: TextStyle(
                color: iconColor,
                fontSize: 8,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// Standard delegate for tab bar
class _SliverTabBarDelegate extends SliverPersistentHeaderDelegate {
  final Widget _tabBar;
  static const double _tabBarHeight = 48.0; // Standard TabBar height

  _SliverTabBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBarHeight;

  @override
  double get maxExtent => _tabBarHeight;

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

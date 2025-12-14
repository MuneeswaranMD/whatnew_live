import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/livestream_provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/category_provider.dart';
import '../../constants/app_theme.dart';
import '../../models/livestream.dart';
import '../../models/product.dart';
import '../livestream/livestream_detail_screen.dart';
import '../product/product_detail_screen.dart';
import '../../utils/image_utils.dart';
import '../../services/sharing_service.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  late TabController _tabController;
  
  List<LiveStream> _filteredStreams = [];
  List<Product> _filteredProducts = [];
  bool _isSearching = false;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _searchController.addListener(_onSearchChanged);
    
    // Load products when search screen opens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialProducts();
    });
  }
  
  void _loadInitialProducts() async {
    try {
      final productProvider = context.read<ProductProvider>();
      if (productProvider.products.isEmpty) {
        // print('SearchScreen: Loading initial products...');
        await productProvider.loadProducts();
        // print('SearchScreen: Loaded ${productProvider.products.length} products for search');
      }
    } catch (e) {
      // print('SearchScreen: Error loading initial products: $e');
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      _searchQuery = _searchController.text;
      // print('SearchScreen: Search query changed to: "$_searchQuery"');
      _performSearch();
    });
  }

  void _performSearch() async {
    if (_searchQuery.isEmpty) {
      setState(() {
        _filteredStreams = [];
        _filteredProducts = [];
        _isSearching = false;
      });
      return;
    }

    setState(() {
      _isSearching = true;
    });
    
    // Search livestreams
    final livestreamProvider = context.read<LivestreamProvider>();
    final allStreams = livestreamProvider.liveNow;
    final query = _searchQuery.toLowerCase();
    
    setState(() {
      _filteredStreams = allStreams.where((stream) {
        return stream.title.toLowerCase().contains(query) ||
               stream.description.toLowerCase().contains(query) ||
               stream.categoryName.toLowerCase().contains(query);
      }).toList();

      // Sort livestreams by relevance
      _filteredStreams.sort((a, b) {
        final aTitle = a.title.toLowerCase().contains(query);
        final bTitle = b.title.toLowerCase().contains(query);
        
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        
        return b.viewerCount.compareTo(a.viewerCount);
      });
    });

    // Search products using ProductProvider with try-catch for safety
    try {
      final productProvider = context.read<ProductProvider>();
      
      // If we have products loaded, filter them locally first
      final allProducts = productProvider.products;
      // print('SearchScreen: Searching in ${allProducts.length} products for query: "$query"');
      
      // Debug: Print all loaded products
      for (int i = 0; i < allProducts.length; i++) {
        final product = allProducts[i];
        // print('SearchScreen: Product $i: name="${product.name}", category="${product.categoryName}", description="${product.description}"');
      }
      
      // Always start with locally filtered products (even if empty)
      _filteredProducts = allProducts.where((product) {
        final nameMatch = product.name.toLowerCase().contains(query);
        final descMatch = product.description?.toLowerCase().contains(query) ?? false;
        final categoryMatch = product.categoryName.toLowerCase().contains(query);
        return nameMatch || descMatch || categoryMatch;
      }).toList();
      
      // print('SearchScreen: Local filtered results: ${_filteredProducts.length} products');
      
      // Set state immediately with local filtered results
      setState(() {
        // Sort by relevance (name matches first, then description matches)
        _filteredProducts.sort((a, b) {
          final aNameMatch = a.name.toLowerCase().contains(query);
          final bNameMatch = b.name.toLowerCase().contains(query);
          
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          
          return a.name.compareTo(b.name);
        });
      });
      
      // If local search has no results, try loading all products and filtering manually
      if (_filteredProducts.isEmpty) {
        // print('SearchScreen: No local results, loading all products and filtering...');
        await productProvider.loadProducts();
        
        if (mounted) {
          setState(() {
            // Filter all loaded products locally
            final allProducts = productProvider.products;
            // print('SearchScreen: Manual filtering - loaded ${allProducts.length} products');
            
            // Debug: Print all loaded products again
            for (int i = 0; i < allProducts.length; i++) {
              final product = allProducts[i];
              // print('SearchScreen: Manual filter - Product $i: name="${product.name}", category="${product.categoryName}", description="${product.description}"');
            }
            
            _filteredProducts = allProducts.where((product) {
              final nameMatch = product.name.toLowerCase().contains(query);
              final descMatch = product.description?.toLowerCase().contains(query) ?? false;
              final categoryMatch = product.categoryName.toLowerCase().contains(query);
              // print('SearchScreen: Testing product "${product.name}" against "$query" - nameMatch:$nameMatch, descMatch:$descMatch, categoryMatch:$categoryMatch');
              return nameMatch || descMatch || categoryMatch;
            }).toList();
            
            // print('SearchScreen: Manual filtering results: ${_filteredProducts.length} products');
            
            // Sort by relevance
            _filteredProducts.sort((a, b) {
              final aNameMatch = a.name.toLowerCase().contains(query);
              final bNameMatch = b.name.toLowerCase().contains(query);
              
              if (aNameMatch && !bNameMatch) return -1;
              if (!aNameMatch && bNameMatch) return 1;
              
              return a.name.compareTo(b.name);
            });
          });
        }
      }
    } catch (e) {
      // print('ProductProvider not available: $e');
      // If ProductProvider is not available, just set empty products
      setState(() {
        _filteredProducts = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppColors.primaryColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: TextField(
          controller: _searchController,
          autofocus: true,
          style: const TextStyle(color: Color.fromARGB(255, 0, 0, 0), fontSize: 16),
          cursorColor: const Color.fromARGB(255, 0, 0, 0),
          decoration: const InputDecoration(
            hintText: 'Search streams and pr...',
            hintStyle: TextStyle(color: Color.fromARGB(179, 69, 57, 57), fontSize: 16),
            border: InputBorder.none,
            contentPadding: EdgeInsets.all(5),
          ),
        ),
        actions: [
          // Share App Button
          // IconButton(
          //   icon: const Icon(Icons.share, color: Colors.white),
          //   onPressed: () => _shareApp(context),
          //   tooltip: 'Share Addagram App',
          // ),
          if (_searchController.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear, color: Colors.white),
              onPressed: () {
                _searchController.clear();
              },
            ),
        ],
        bottom: _isSearching ? TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            Tab(
              text: 'Livestreams (${_filteredStreams.length})',
              icon: const Icon(Icons.live_tv, size: 18),
            ),
            Tab(
              text: 'Products (${_filteredProducts.length})',
              icon: const Icon(Icons.shopping_bag, size: 18),
            ),
          ],
        ) : null,
      ),
      body: _isSearching ? TabBarView(
        controller: _tabController,
        children: [
          // Livestreams Tab
          _filteredStreams.isEmpty 
              ? _buildNoResults('livestreams')
              : _buildLivestreamResults(),
          // Products Tab
          Consumer<ProductProvider>(
            builder: (context, productProvider, child) {
              if (productProvider.isLoading) {
                return const Center(child: CircularProgressIndicator());
              }
              
              if (_filteredProducts.isEmpty) {
                return _buildNoResults('products');
              }
              
              return _buildProductResults();
            },
          ),
        ],
      ) : _buildSearchSuggestions(),
    );
  }

  Widget _buildSearchSuggestions() {
    return Consumer<CategoryProvider>(
      builder: (context, categoryProvider, child) {
        final categories = categoryProvider.categories.where((cat) => cat.isActive).toList();
        
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Search Categories',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimaryColor,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: categories.map((category) {
                  return InkWell(
                    onTap: () {
                      _searchController.text = category.name;
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primaryColor.withOpacity(0.3)),
                      ),
                      child: Text(
                        category.name,
                        style: TextStyle(
                          color: AppColors.primaryColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 32),
              const Text(
                'Popular Searches',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimaryColor,
                ),
              ),
              const SizedBox(height: 16),
              ..._buildPopularSearches(),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _buildPopularSearches() {
    final popularSearches = [
      'Fashion',
      'Electronics',
      'Home & Kitchen',
      'Beauty',
      'Sports',
      'Books',
    ];

    return popularSearches.map((search) {
      return ListTile(
        leading: const Icon(Icons.trending_up, color: AppColors.textSecondaryColor),
        title: Text(search),
        onTap: () {
          _searchController.text = search;
        },
      );
    }).toList();
  }

  Widget _buildNoResults(String type) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              type == 'livestreams' ? Icons.live_tv : Icons.shopping_bag_outlined,
              size: 64,
              color: AppColors.textSecondaryColor.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No ${type == 'livestreams' ? 'Livestreams' : 'Products'} Found',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondaryColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try searching for different keywords',
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

  Widget _buildLivestreamResults() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${_filteredStreams.length} livestream${_filteredStreams.length != 1 ? 's' : ''} for "$_searchQuery"',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondaryColor,
            ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
            ),
            itemCount: _filteredStreams.length,
            itemBuilder: (context, index) {
              final livestream = _filteredStreams[index];
              return _SearchResultCard(
                livestream: livestream,
                searchQuery: _searchQuery,
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
        ],
      ),
    );
  }

  Widget _buildProductResults() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${_filteredProducts.length} product${_filteredProducts.length != 1 ? 's' : ''} for "$_searchQuery"',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppColors.textSecondaryColor,
            ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.8,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
            ),
            itemCount: _filteredProducts.length,
            itemBuilder: (context, index) {
              final product = _filteredProducts[index];
              return _ProductSearchCard(
                product: product,
                searchQuery: _searchQuery,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => ProductDetailScreen(
                        productId: product.id,
                        product: product,
                      ),
                    ),
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}

class _SearchResultCard extends StatelessWidget {
  final LiveStream livestream;
  final String searchQuery;
  final VoidCallback onTap;

  const _SearchResultCard({
    required this.livestream,
    required this.searchQuery,
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
              // Livestream Image
              Expanded(
                flex: 3,
                child: Stack(
                  children: [
                    Container(
                      width: double.infinity,
                      child: livestream.thumbnail != null && livestream.thumbnail!.isNotEmpty
                          ? Image.network(
                              ImageUtils.getFullImageUrl(livestream.thumbnail),
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                // print('SearchScreen: Error loading livestream image: $error');
                                return _buildCategoryPlaceholder();
                              },
                              loadingBuilder: (context, child, loadingProgress) {
                                if (loadingProgress == null) return child;
                                return Container(
                                  color: Colors.grey[200],
                                  child: const Center(
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  ),
                                );
                              },
                            )
                          : _buildCategoryPlaceholder(),
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
                    
                    // Share Button and Viewer Count
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          // Share Button
                          GestureDetector(
                            onTap: () => _shareLivestream(context, livestream),
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.9),
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Icon(
                                Icons.share,
                                size: 16,
                                color: AppColors.primaryColor,
                              ),
                            ),
                          ),
                          
                          if (livestream.viewerCount > 0) ...[
                            const SizedBox(height: 8),
                            // Viewer Count
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.6),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _formatViewerCount(livestream.viewerCount),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ],
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
                      // Title with highlighting
                      RichText(
                        text: _buildHighlightedText(livestream.title, searchQuery, const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimaryColor,
                        )),
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
                      
                      // Description with highlighting
                      Expanded(
                        child: RichText(
                          text: _buildHighlightedText(livestream.description, searchQuery, const TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondaryColor,
                          )),
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

  TextSpan _buildHighlightedText(String text, String query, TextStyle baseStyle) {
    if (query.isEmpty) {
      return TextSpan(text: text, style: baseStyle);
    }

    final lowerText = text.toLowerCase();
    final lowerQuery = query.toLowerCase();
    final List<TextSpan> spans = [];
    
    int start = 0;
    int index = lowerText.indexOf(lowerQuery);
    
    while (index != -1) {
      // Add text before match
      if (index > start) {
        spans.add(TextSpan(text: text.substring(start, index), style: baseStyle));
      }
      
      // Add highlighted match
      spans.add(TextSpan(
        text: text.substring(index, index + query.length),
        style: baseStyle.copyWith(
          backgroundColor: Colors.yellow,
          fontWeight: FontWeight.bold,
        ),
      ));
      
      start = index + query.length;
      index = lowerText.indexOf(lowerQuery, start);
    }
    
    // Add remaining text
    if (start < text.length) {
      spans.add(TextSpan(text: text.substring(start), style: baseStyle));
    }
    
    return TextSpan(children: spans);
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

  Widget _buildCategoryPlaceholder() {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: AppColors.primaryColor.withOpacity(0.1),
      child: Center(
        child: Icon(
          Icons.live_tv,
          size: 32,
          color: AppColors.primaryColor,
        ),
      ),
    );
  }

  /// Share livestream functionality
  void _shareLivestream(BuildContext context, LiveStream livestream) async {
    try {
      await SharingService.shareLivestream(livestream);
    } catch (e) {
      // Show error message if sharing fails
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to share livestream: ${e.toString()}'),
            backgroundColor: AppColors.errorColor,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }
}

class _ProductSearchCard extends StatelessWidget {
  final Product product;
  final String searchQuery;
  final VoidCallback onTap;

  const _ProductSearchCard({
    required this.product,
    required this.searchQuery,
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
              // Product Image
              Expanded(
                flex: 3,
                child: Stack(
                  children: [
                    Container(
                      width: double.infinity,
                      child: product.primaryImage?.image != null && product.primaryImage!.image.isNotEmpty
                          ? Image.network(
                              ImageUtils.getFullImageUrl(product.primaryImage!.image),
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                              loadingBuilder: (context, child, loadingProgress) {
                                if (loadingProgress == null) return child;
                                return Container(
                                  color: Colors.grey[200],
                                  child: const Center(
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  ),
                                );
                              },
                              errorBuilder: (context, error, stackTrace) {
                          // print('SearchScreen: Error loading product image: $error');
                                return _buildProductPlaceholder();
                              },
                            )
                          : _buildProductPlaceholder(),
                    ),
                    
                    // Stock Status Badge
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: product.isInStock ? AppColors.successColor : AppColors.errorColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          product.isInStock ? 'IN STOCK' : 'OUT OF STOCK',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    
                    // Share Button
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Share Button
                          GestureDetector(
                            onTap: () => _shareProduct(context, product),
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.9),
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Icon(
                                Icons.share,
                                size: 16,
                                color: AppColors.primaryColor,
                              ),
                            ),
                          ),
                          
                          if (product.hasDiscount) ...[
                            const SizedBox(width: 8),
                            // Price Tag
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.successColor,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '${product.discountPercentage.round()}% OFF',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ],
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
                      // Product Name with highlighting
                      RichText(
                        text: _buildHighlightedText(product.name, searchQuery, const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimaryColor,
                        )),
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
                          product.categoryName,
                          style: TextStyle(
                            color: AppColors.primaryColor,
                            fontSize: 9,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      
                      const Spacer(),
                      
                      // Price Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '₹${product.price.toStringAsFixed(0)}',
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primaryColor,
                                  ),
                                ),
                                if (product.hasDiscount) ...[
                                  Text(
                                    '₹${product.basePrice.toStringAsFixed(0)}',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: AppColors.textSecondaryColor,
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                          // Buy Now Button
                          GestureDetector(
                            onTap: () {
                              // Navigate to product detail screen first
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) => ProductDetailScreen(
                                    productId: product.id,
                                    product: product,
                                  ),
                                ),
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: product.isInStock ? AppColors.primaryColor : AppColors.textSecondaryColor,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                product.isInStock ? 'Buy Now' : 'Unavailable',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
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
      ),
    );
  }

  TextSpan _buildHighlightedText(String text, String query, TextStyle baseStyle) {
    if (query.isEmpty) {
      return TextSpan(text: text, style: baseStyle);
    }

    final lowerText = text.toLowerCase();
    final lowerQuery = query.toLowerCase();
    final List<TextSpan> spans = [];
    
    int start = 0;
    int index = lowerText.indexOf(lowerQuery);
    
    while (index != -1) {
      // Add text before match
      if (index > start) {
        spans.add(TextSpan(text: text.substring(start, index), style: baseStyle));
      }
      
      // Add highlighted match
      spans.add(TextSpan(
        text: text.substring(index, index + query.length),
        style: baseStyle.copyWith(
          backgroundColor: Colors.yellow,
          fontWeight: FontWeight.bold,
        ),
      ));
      
      start = index + query.length;
      index = lowerText.indexOf(lowerQuery, start);
    }
    
    // Add remaining text
    if (start < text.length) {
      spans.add(TextSpan(text: text.substring(start), style: baseStyle));
    }
    
    return TextSpan(children: spans);
  }

  Widget _buildProductPlaceholder() {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: AppColors.primaryColor.withOpacity(0.1),
      child: Center(
        child: Icon(
          Icons.shopping_bag,
          size: 32,
          color: AppColors.primaryColor,
        ),
      ),
    );
  }

  /// Share product functionality
  void _shareProduct(BuildContext context, Product product) async {
    try {
      await SharingService.shareProduct(product);
    } catch (e) {
      // Show error message if sharing fails
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to share product: ${e.toString()}'),
            backgroundColor: AppColors.errorColor,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }

  /// Share app functionality
  void _shareApp(BuildContext context) async {
    try {
      await SharingService.shareApp();
    } catch (e) {
      // Show error message if sharing fails
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to share app: ${e.toString()}'),
            backgroundColor: AppColors.errorColor,
            duration: const Duration(seconds: 2),
          ),
        );
      }
    }
  }
}
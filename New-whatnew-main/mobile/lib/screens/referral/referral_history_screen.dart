import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../models/referral.dart';
import '../../widgets/custom_button.dart';

class ReferralHistoryScreen extends StatefulWidget {
  const ReferralHistoryScreen({super.key});

  @override
  State<ReferralHistoryScreen> createState() => _ReferralHistoryScreenState();
}

class _ReferralHistoryScreenState extends State<ReferralHistoryScreen>
    with SingleTickerProviderStateMixin {
  bool _isLoading = false;
  List<ReferralHistory> _referralHistory = [];
  List<ReferralReward> _rewards = [];
  int _currentPage = 1;
  bool _hasMoreData = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadReferralHistory();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadReferralHistory({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _hasMoreData = true;
      _referralHistory.clear();
    }

    if (!_hasMoreData || _isLoading) return;

    setState(() => _isLoading = true);
    try {
      final response = await ApiService.getReferralHistory(page: _currentPage);
      print('Referral History API Response: $response');
      
      List<dynamic> results = [];
      
      if (response['results'] != null) {
        results = response['results'] as List<dynamic>;
      }
      
      print('Parsed referral history results: $results');
      
      final newHistory = results
          .map((json) => ReferralHistory.fromJson(json))
          .toList();

      setState(() {
        if (refresh) {
          _referralHistory = newHistory;
        } else {
          _referralHistory.addAll(newHistory);
        }
        _currentPage++;
        _hasMoreData = results.length >= 10; // Assuming page size is 10
      });
    } catch (e) {
      print('Error loading referral history: $e');
      _showErrorSnackBar('Failed to load referral history: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadRewards({bool refresh = false}) async {
    if (refresh) {
      _rewards.clear();
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiService.getReferralRewards();
      print('Referral Rewards API Response: $response');
      
      List<dynamic> results = [];
      
      if (response['results'] != null) {
        results = response['results'] as List<dynamic>;
      }
      
      print('Parsed referral rewards results: $results');
      
      final newRewards = results
          .map((json) => ReferralReward.fromJson(json))
          .toList();

      setState(() {
        _rewards = newRewards;
      });
    } catch (e) {
      print('Error loading referral rewards: $e');
      _showErrorSnackBar('Failed to load rewards: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Referral History'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: Container(
            color: Theme.of(context).primaryColor,
            child: TabBar(
              controller: _tabController,
              tabs: const [
                Tab(text: 'History'),
                Tab(text: 'Rewards'),
              ],
              indicatorColor: Colors.white,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.white70,
              onTap: (index) {
                if (index == 0 && _referralHistory.isEmpty) {
                  _loadReferralHistory(refresh: true);
                } else if (index == 1 && _rewards.isEmpty) {
                  _loadRewards(refresh: true);
                }
              },
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildHistoryTab(),
          _buildRewardsTab(),
        ],
      ),
    );
  }

  Widget _buildHistoryTab() {
    if (_isLoading && _referralHistory.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_referralHistory.isEmpty) {
      return _buildEmptyState(
        icon: Icons.people_outline,
        title: 'No Referrals Yet',
        subtitle: 'Start inviting friends to see your referral history here!',
        actionText: 'Invite Friends',
        onAction: () => Navigator.of(context).pop(),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadReferralHistory(refresh: true),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _referralHistory.length + (_hasMoreData ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == _referralHistory.length) {
            // Load more indicator
            _loadReferralHistory();
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(),
              ),
            );
          }

          final referral = _referralHistory[index];
          return _buildReferralHistoryItem(referral);
        },
      ),
    );
  }

  Widget _buildRewardsTab() {
    if (_isLoading && _rewards.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_rewards.isEmpty) {
      return _buildEmptyState(
        icon: Icons.card_giftcard_outlined,
        title: 'No Rewards Yet',
        subtitle: 'Complete referrals to earn rewards!',
        actionText: 'Invite Friends',
        onAction: () => Navigator.of(context).pop(),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadRewards(refresh: true),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _rewards.length,
        itemBuilder: (context, index) {
          final reward = _rewards[index];
          return _buildRewardItem(reward);
        },
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
    required String actionText,
    required VoidCallback onAction,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 80,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            CustomButton(
              text: actionText,
              onPressed: onAction,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReferralHistoryItem(ReferralHistory referral) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: _getStatusColor(referral.status),
                  child: Icon(
                    _getStatusIcon(referral.status),
                    color: Colors.white,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        referral.referredUserDetails.displayName,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '@${referral.referredUserDetails.username}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(referral.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _getStatusColor(referral.status).withOpacity(0.3),
                    ),
                  ),
                  child: Text(
                    referral.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: _getStatusColor(referral.status),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 16,
                  color: Colors.grey[600],
                ),
                const SizedBox(width: 6),
                Text(
                  'Joined ${_formatDate(referral.referredUserDetails.joinedDate)}',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                const Spacer(),
                Text(
                  '${referral.daysSinceReferral} days ago',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
            if (referral.rewardDetails != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: Colors.green.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.card_giftcard,
                      color: Colors.green,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Reward: ${referral.rewardDetails!.rewardType} ${referral.rewardDetails!.amount}',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.green,
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: _getRewardStatusColor(referral.rewardDetails!.status),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        referral.rewardDetails!.status.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildRewardItem(ReferralReward reward) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _getRewardTypeColor(reward.rewardType).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getRewardTypeIcon(reward.rewardType),
                    color: _getRewardTypeColor(reward.rewardType),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${reward.rewardType.toUpperCase()} ${reward.amount}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        reward.description,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getRewardStatusColor(reward.status),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    reward.status.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(
                  'From: ${reward.referralData.referredUser}',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                const Spacer(),
                Text(
                  _formatDate(reward.createdAt),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
            if (reward.creditedAt != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(
                    Icons.check_circle,
                    size: 16,
                    color: Colors.green,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Credited on ${_formatDate(reward.creditedAt!)}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.green,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'expired':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Icons.check_circle;
      case 'pending':
        return Icons.hourglass_empty;
      case 'expired':
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }

  Color _getRewardStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'credited':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'expired':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getRewardTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'credits':
        return Colors.purple;
      case 'cash':
        return Colors.green;
      case 'discount':
        return Colors.blue;
      case 'bonus':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getRewardTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'credits':
        return Icons.stars;
      case 'cash':
        return Icons.account_balance_wallet;
      case 'discount':
        return Icons.local_offer;
      case 'bonus':
        return Icons.card_giftcard;
      default:
        return Icons.help;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date).inDays;

    if (difference == 0) {
      return 'Today';
    } else if (difference == 1) {
      return 'Yesterday';
    } else if (difference < 7) {
      return '$difference days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}

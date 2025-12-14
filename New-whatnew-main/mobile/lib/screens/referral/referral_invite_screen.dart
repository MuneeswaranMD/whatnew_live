import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/api_service.dart';
import '../../models/referral.dart';
import '../../widgets/custom_button.dart';

class ReferralInviteScreen extends StatefulWidget {
  const ReferralInviteScreen({super.key});

  @override
  State<ReferralInviteScreen> createState() => _ReferralInviteScreenState();
}

class _ReferralInviteScreenState extends State<ReferralInviteScreen> {
  bool _isLoading = false;
  ReferralCode? _referralCode;
  ReferralStats? _stats;
  List<ReferralCampaign> _activeCampaigns = [];

  @override
  void initState() {
    super.initState();
    _loadReferralData();
  }

  Future<void> _loadReferralData() async {
    setState(() => _isLoading = true);
    try {
      // Load referral code
      final codeResponse = await ApiService.getReferralCode();
      print('Referral Code API Response: $codeResponse');
      _referralCode = ReferralCode.fromJson(codeResponse);

      // Load stats
      final statsResponse = await ApiService.getReferralStats();
      print('Referral Stats API Response: $statsResponse');
      _stats = ReferralStats.fromJson(statsResponse);

      // Load active campaigns
      final campaignsResponse = await ApiService.getActiveCampaigns();
      print('Active Campaigns API Response: $campaignsResponse');
      
      if (campaignsResponse['results'] != null) {
        _activeCampaigns = (campaignsResponse['results'] as List)
            .map((json) => ReferralCampaign.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        _activeCampaigns = [];
      }
      
      print('Parsed campaigns: $_activeCampaigns');
    } catch (e) {
      print('Error loading referral data: $e');
      _showErrorSnackBar('Failed to load referral data: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _shareReferral(String platform) async {
    if (_referralCode == null) return;

    try {
      final response = await ApiService.shareReferral(platform: platform);
      final shareContent = ShareContent.fromJson(response);
      await _handleShareContent(shareContent);
    } catch (e) {
      _showErrorSnackBar('Failed to share referral: $e');
    }
  }

  Future<void> _handleShareContent(ShareContent content) async {
    switch (content.platform) {
      case 'whatsapp':
        if (content.url != null) {
          await _launchUrl(content.url!);
        }
        break;
      case 'telegram':
        if (content.url != null) {
          await _launchUrl(content.url!);
        }
        break;
      case 'sms':
        if (content.smsUrl != null) {
          await _launchUrl(content.smsUrl!);
        }
        break;
      case 'email':
        if (content.emailUrl != null) {
          await _launchUrl(content.emailUrl!);
        }
        break;
      case 'copy':
        await _copyToClipboard(content.referralCode);
        break;
      default:
        await Share.share(
          content.text,
          subject: content.shareTitle ?? 'Join Addagram',
        );
    }
  }

  Future<void> _launchUrl(String url) async {
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        _showErrorSnackBar('Could not launch $url');
      }
    } catch (e) {
      _showErrorSnackBar('Failed to open app: $e');
    }
  }

  Future<void> _copyToClipboard(String code) async {
    await Clipboard.setData(ClipboardData(text: code));
    _showSuccessSnackBar('Referral code copied to clipboard!');
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Invite Friends'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadReferralData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildReferralCodeCard(),
                    const SizedBox(height: 20),
                    _buildStatsCard(),
                    const SizedBox(height: 20),
                    _buildActiveCampaigns(),
                    const SizedBox(height: 20),
                    _buildShareOptions(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildReferralCodeCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: LinearGradient(
            colors: [
              Theme.of(context).primaryColor,
              Theme.of(context).primaryColor.withOpacity(0.8),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            const Icon(
              Icons.card_giftcard,
              size: 48,
              color: Colors.white,
            ),
            const SizedBox(height: 12),
            const Text(
              'Your Referral Code',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                _referralCode?.code ?? 'Loading...',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).primaryColor,
                  letterSpacing: 2,
                ),
              ),
            ),
            const SizedBox(height: 12),
            CustomButton(
              text: 'Copy Code',
              onPressed: _referralCode != null
                  ? () => _copyToClipboard(_referralCode!.code)
                  : null,
              backgroundColor: Colors.white,
              textColor: Theme.of(context).primaryColor,
              icon: Icons.copy,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsCard() {
    if (_stats == null) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Your Referral Stats',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Total Referrals',
                    _stats!.totalReferrals.toString(),
                    Icons.people,
                    Colors.blue,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    'Successful',
                    _stats!.successfulReferrals.toString(),
                    Icons.check_circle,
                    Colors.green,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Total Earnings',
                    '₹${_stats!.totalEarnings.toStringAsFixed(0)}',
                    Icons.account_balance_wallet,
                    Colors.orange,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    'Credits Earned',
                    _stats!.totalCreditsEarned.toString(),
                    Icons.stars,
                    Colors.purple,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildActiveCampaigns() {
    if (_activeCampaigns.isEmpty) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Active Campaigns',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ..._activeCampaigns.map((campaign) => _buildCampaignItem(campaign)),
          ],
        ),
      ),
    );
  }

  Widget _buildCampaignItem(ReferralCampaign campaign) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Theme.of(context).primaryColor.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            campaign.name,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            campaign.description,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Reward: ${campaign.rewardType} ${campaign.referrerRewardAmount}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).primaryColor,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'ACTIVE',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShareOptions() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Share Your Referral Code',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: [
                _buildShareButton(
                  'WhatsApp',
                  Icons.chat,
                  Colors.green,
                  () => _shareReferral('whatsapp'),
                ),
                _buildShareButton(
                  'Telegram',
                  Icons.send,
                  Colors.blue,
                  () => _shareReferral('telegram'),
                ),
                _buildShareButton(
                  'SMS',
                  Icons.sms,
                  Colors.orange,
                  () => _shareReferral('sms'),
                ),
                _buildShareButton(
                  'Email',
                  Icons.email,
                  Colors.red,
                  () => _shareReferral('email'),
                ),
                _buildShareButton(
                  'Copy',
                  Icons.copy,
                  Colors.grey,
                  () => _shareReferral('copy'),
                ),
                _buildShareButton(
                  'More',
                  Icons.share,
                  Colors.purple,
                  () => _shareReferral('general'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareButton(
    String label,
    IconData icon,
    Color color,
    VoidCallback onPressed,
  ) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: color.withOpacity(0.3),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: color,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

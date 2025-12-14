import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/custom_button.dart';

class BecomeSellerScreen extends StatelessWidget {
  const BecomeSellerScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pureWhite,
      appBar: AppBar(
        title: const Text(
          'Become a Seller',
          style: TextStyle(
            color: AppColors.pureWhite,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded, color: AppColors.pureWhite),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.crimsonRed.withOpacity(0.05),
              AppColors.pureWhite,
            ],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.crimsonRed,
                    AppColors.crimsonRed.withOpacity(0.8),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.crimsonRed.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.storefront_rounded,
                      size: 48,
                      color: AppColors.pureWhite,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Start Selling Today!',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.pureWhite,
                      letterSpacing: 0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Join thousands of sellers reaching millions of customers through live shopping',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.pureWhite,
                      height: 1.5,
                      fontWeight: FontWeight.w400,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Benefits Section
            const Text(
              'Why Sell with Us?',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 20),

            _buildBenefitCard(
              icon: Icons.live_tv_rounded,
              title: 'Live Shopping',
              description: 'Showcase products through interactive live streams and engage directly with customers',
              color: AppColors.crimsonRed,
            ),

            _buildBenefitCard(
              icon: Icons.trending_up_rounded,
              title: 'Boost Sales',
              description: 'Increase conversion rates by up to 300% with live demonstrations and real-time interactions',
              color: AppColors.emeraldGreen,
            ),

            _buildBenefitCard(
              icon: Icons.people_rounded,
              title: 'Reach More Customers',
              description: 'Access to millions of active buyers looking for products like yours',
              color: AppColors.vibrantPurple,
            ),

            _buildBenefitCard(
              icon: Icons.analytics_rounded,
              title: 'Analytics & Insights',
              description: 'Track performance, understand your audience, and optimize your selling strategy',
              color: AppColors.amberYellow,
            ),

            _buildBenefitCard(
              icon: Icons.support_agent_rounded,
              title: '24/7 Support',
              description: 'Get dedicated support from our seller success team whenever you need help',
              color: AppColors.skyBlue,
            ),

            const SizedBox(height: 32),

            // Features Section
            const Text(
              'Seller Features',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 20),

            _buildFeatureItem('📱', 'Easy-to-use seller app'),
            _buildFeatureItem('💰', 'Competitive commission rates'),
            _buildFeatureItem('🚚', 'Integrated logistics support'),
            _buildFeatureItem('💳', 'Quick and secure payments'),
            _buildFeatureItem('📊', 'Real-time sales dashboard'),
            _buildFeatureItem('🎯', 'Marketing and promotion tools'),
            _buildFeatureItem('🔒', 'Secure transaction processing'),
            _buildFeatureItem('📞', 'Dedicated account manager'),

            const SizedBox(height: 32),

            // Requirements Section
            const Text(
              'Requirements',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 20),

            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.amberYellow.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.amberYellow.withOpacity(0.3)),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.amberYellow.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.amberYellow.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.info_outline_rounded,
                          color: AppColors.amberYellowDark,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'What you need to get started:',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                          color: AppColors.charcoalBlack,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildRequirementItem('Valid business registration or GST number'),
                  _buildRequirementItem('Bank account for payments'),
                  _buildRequirementItem('Product inventory and images'),
                  _buildRequirementItem('Basic smartphone for live streaming'),
                  _buildRequirementItem('Commitment to customer service'),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Commission Info
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.emeraldGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.3)),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.emeraldGreen.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.emeraldGreen.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.monetization_on_rounded,
                          color: AppColors.emeraldGreenDark,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Pricing & Commission',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                          color: AppColors.charcoalBlack,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    '• No setup fees or monthly charges\n'
                    '• Competitive commission rates (5-15%)\n'
                    '• Weekly payment settlements\n'
                    '• Transparent pricing with no hidden costs',
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.6,
                      color: AppColors.slateGrayDark,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // CTA Buttons
            CustomButton(
              text: 'Apply to Become a Seller',
              onPressed: () => _openSellerApplication(),
            ),

            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => _openSellerPortal(),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: AppColors.crimsonRed, width: 1.5),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  backgroundColor: AppColors.pureWhite,
                ),
                child: Text(
                  'View Seller Portal',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.crimsonRed,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: () => _contactSellerSupport(),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: AppColors.offWhite,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Contact Seller Support',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.slateGrayDark,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
        ),
      ),
    );
  }

  Widget _buildBenefitCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Card(
        elevation: 3,
        shadowColor: color.withOpacity(0.2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.pureWhite,
                color.withOpacity(0.02),
              ],
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: color.withOpacity(0.2),
                    width: 1,
                  ),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.charcoalBlack,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      description,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.slateGrayDark,
                        height: 1.5,
                        fontWeight: FontWeight.w400,
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

  Widget _buildFeatureItem(String emoji, String text) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.offWhite,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.slateGray.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.pureWhite,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: AppColors.slateGray.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(emoji, style: const TextStyle(fontSize: 20)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 15,
                height: 1.4,
                color: AppColors.charcoalBlack,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRequirementItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 6),
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: AppColors.amberYellowDark,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                height: 1.5,
                color: AppColors.slateGrayDark,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _openSellerApplication() async {
    const url = 'https://seller.addagram.in/register';
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _openSellerPortal() async {
    const url = 'https://seller.addagram.in';
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _contactSellerSupport() async {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: 'sellers@addagram.in',
      queryParameters: {
        'subject': 'Seller Support - Mobile App Inquiry',
        'body': 'Hi Seller Support Team,\n\nI am interested in becoming a seller and have the following questions:\n\n[Your questions here]\n\nThank you!'
      },
    );

    if (await canLaunchUrl(emailUri)) {
      await launchUrl(emailUri);
    }
  }
}

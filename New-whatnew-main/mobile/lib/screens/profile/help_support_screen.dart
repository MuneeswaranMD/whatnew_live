import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: const Text('Help & Support'),
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.crimsonRed.withOpacity(0.1),
                    AppColors.vibrantPurple.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppColors.borderLight,
                  width: 1,
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.crimsonRed.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.help_center_rounded,
                      size: 48,
                      color: AppColors.crimsonRed,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'How can we help you?',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.charcoalBlack,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Find answers to common questions or contact our support team',
                    style: const TextStyle(
                      fontSize: 16,
                      color: AppColors.slateGray,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Quick Actions
            Text(
              'Quick Actions',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
              ),
            ),
            const SizedBox(height: 16),

            _buildHelpOption(
              context,
              icon: Icons.chat_outlined,
              title: 'Live Chat',
              subtitle: 'Chat with our support team',
              onTap: () {
                _showComingSoonDialog(context, 'Live Chat');
              },
            ),

            _buildHelpOption(
              context,
              icon: Icons.phone_outlined,
              title: 'Call Support',
              subtitle: 'Speak directly with our team',
              onTap: () => _makePhoneCall('tel:+919876543210'),
            ),

            _buildHelpOption(
              context,
              icon: Icons.email_outlined,
              title: 'Email Support',
              subtitle: 'Send us your questions',
              onTap: () => _sendEmail(),
            ),

            const SizedBox(height: 24),

            // FAQ Section
            Text(
              'Frequently Asked Questions',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
              ),
            ),
            const SizedBox(height: 16),

            _buildFAQSection(),

            const SizedBox(height: 24),

            // Other Resources
            Text(
              'Other Resources',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
              ),
            ),
            const SizedBox(height: 16),

            _buildHelpOption(
              context,
              icon: Icons.video_library_outlined,
              title: 'Video Tutorials',
              subtitle: 'Learn how to use the app',
              onTap: () {
                _showComingSoonDialog(context, 'Video Tutorials');
              },
            ),

            _buildHelpOption(
              context,
              icon: Icons.article_outlined,
              title: 'User Guide',
              subtitle: 'Complete app documentation',
              onTap: () async {
                const url = 'https://app.addagram.in/user-guide';
                final Uri uri = Uri.parse(url);
                if (await canLaunchUrl(uri)) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
            ),

            _buildHelpOption(
              context,
              icon: Icons.bug_report_outlined,
              title: 'Report a Bug',
              subtitle: 'Help us improve the app',
              onTap: () => _reportBug(context),
            ),

            _buildHelpOption(
              context,
              icon: Icons.feedback_outlined,
              title: 'Send Feedback',
              subtitle: 'Share your suggestions',
              onTap: () => _sendFeedback(context),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHelpOption(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 2,
        shadowColor: AppColors.shadowLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.pureWhite,
                  AppColors.offWhite,
                ],
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.crimsonRed.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.crimsonRed,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: AppColors.charcoalBlack,
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: AppColors.slateGray,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 18,
                  color: AppColors.slateGray,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFAQSection() {
    return Column(
      children: [
        _buildFAQItem(
          'How do I place an order?',
          'Browse products, add items to cart, proceed to checkout, and complete payment.',
        ),
        _buildFAQItem(
          'How do I track my order?',
          'Go to "Orders" section in your profile to view order status and tracking information.',
        ),
        _buildFAQItem(
          'What payment methods are accepted?',
          'We accept UPI, credit/debit cards, net banking, and digital wallets.',
        ),
        _buildFAQItem(
          'How do I return or exchange items?',
          'Contact support within 7 days of delivery to initiate returns or exchanges.',
        ),
        _buildFAQItem(
          'How do referrals work?',
          'Share your referral code with friends. When they sign up and make their first purchase, you both get rewards.',
        ),
      ],
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 2,
        shadowColor: AppColors.shadowLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: ExpansionTile(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          collapsedShape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          iconColor: AppColors.crimsonRed,
          collapsedIconColor: AppColors.slateGray,
          title: Text(
            question,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 15,
              color: AppColors.charcoalBlack,
            ),
          ),
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              decoration: BoxDecoration(
                color: AppColors.offWhite.withOpacity(0.5),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(12),
                  bottomRight: Radius.circular(12),
                ),
              ),
              child: Text(
                answer,
                style: const TextStyle(
                  color: AppColors.slateGray,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri.parse(phoneNumber);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    }
  }

  void _sendEmail() async {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: 'support@addagram.in',
      queryParameters: {
        'subject': 'Support Request - Mobile App',
        'body': 'Hi Support Team,\n\nI need help with:\n\n[Describe your issue here]\n\nApp Version: 1.0.0\nDevice: [Your device info]\n\nThank you!'
      },
    );

    if (await canLaunchUrl(emailUri)) {
      await launchUrl(emailUri);
    }
  }

  void _reportBug(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Report a Bug',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const Text(
          'Please email us at support@addagram.in with:\n\n'
          '• Detailed description of the issue\n'
          '• Steps to reproduce the bug\n'
          '• Screenshots (if applicable)\n'
          '• Your device information\n\n'
          'We\'ll investigate and fix it as soon as possible!',
          style: TextStyle(
            color: AppColors.slateGray,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.slateGray,
            ),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _sendEmail();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.crimsonRed,
              foregroundColor: AppColors.pureWhite,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Send Email'),
          ),
        ],
      ),
    );
  }

  void _sendFeedback(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Send Feedback',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const Text(
          'We\'d love to hear your thoughts!\n\n'
          'Please email us at feedback@addagram.in with:\n\n'
          '• Your suggestions for improvement\n'
          '• Features you\'d like to see\n'
          '• Overall experience feedback\n\n'
          'Your input helps us make the app better!',
          style: TextStyle(
            color: AppColors.slateGray,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.slateGray,
            ),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _sendFeedbackEmail();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.crimsonRed,
              foregroundColor: AppColors.pureWhite,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Send Email'),
          ),
        ],
      ),
    );
  }

  void _sendFeedbackEmail() async {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: 'feedback@addagram.in',
      queryParameters: {
        'subject': 'App Feedback - Mobile App',
        'body': 'Hi Team,\n\nI\'d like to share the following feedback:\n\n[Your feedback here]\n\nApp Version: 1.0.0\n\nThank you!'
      },
    );

    if (await canLaunchUrl(emailUri)) {
      await launchUrl(emailUri);
    }
  }

  void _showComingSoonDialog(BuildContext context, String feature) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Text(
          feature,
          style: const TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const Text(
          'This feature is coming soon! Stay tuned for updates.',
          style: TextStyle(
            color: AppColors.slateGray,
            height: 1.5,
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.crimsonRed,
              foregroundColor: AppColors.pureWhite,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

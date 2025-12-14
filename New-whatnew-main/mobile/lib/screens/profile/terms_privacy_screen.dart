import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../../utils/simple_browser.dart';

class TermsPrivacyScreen extends StatelessWidget {
  const TermsPrivacyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pureWhite,
      appBar: AppBar(
        title: const Text(
          'Terms & Privacy',
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
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.pureWhite,
                    AppColors.offWhite,
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadowLight,
                    offset: const Offset(0, 4),
                    blurRadius: 12,
                    spreadRadius: 0,
                  ),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.crimsonRed.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      Icons.security_rounded,
                      size: 48,
                      color: AppColors.crimsonRed,
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Terms & Privacy',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.charcoalBlack,
                      letterSpacing: 0.3,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your privacy and security matter to us',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.slateGray,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Legal Documents
            const Text(
              'Legal Documents',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 16),

            _buildLegalOption(
              icon: Icons.article_outlined,
              title: 'Terms of Service',
              subtitle: 'Terms and conditions for using our app',
              onTap: () {
                SimpleBrowser.open('https://app.addagram.in/terms');
              },
            ),

            _buildLegalOption(
              icon: Icons.privacy_tip_outlined,
              title: 'Privacy Policy',
              subtitle: 'How we collect and use your data',
              onTap: () {
                SimpleBrowser.open('https://app.addagram.in/privacy');
              },
            ),

            _buildLegalOption(
              icon: Icons.cookie_outlined,
              title: 'Cookie Policy',
              subtitle: 'Information about cookies and tracking',
              onTap: () {
                SimpleBrowser.open('https://app.addagram.in/cookies');
              },
            ),

            _buildLegalOption(
              icon: Icons.swap_horizontal_circle_outlined,
              title: 'Return & Refund Policy',
              subtitle: 'Terms for returns and refunds',
              onTap: () {
                SimpleBrowser.open('https://app.addagram.in/returns');
              },
            ),

            const SizedBox(height: 24),

            // Privacy Controls
            const Text(
              'Privacy Controls',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 16),

            _buildPrivacyOption(
              icon: Icons.visibility_outlined,
              title: 'Data We Collect',
              subtitle: 'What information we gather',
              onTap: () => _showDataCollectionInfo(context),
            ),

            _buildPrivacyOption(
              icon: Icons.share_outlined,
              title: 'Data Sharing',
              subtitle: 'How we share your information',
              onTap: () => _showDataSharingInfo(context),
            ),

            _buildPrivacyOption(
              icon: Icons.security_outlined,
              title: 'Data Security',
              subtitle: 'How we protect your data',
              onTap: () => _showDataSecurityInfo(context),
            ),

            _buildPrivacyOption(
              icon: Icons.delete_outline,
              title: 'Delete My Data',
              subtitle: 'Request data deletion',
              onTap: () => _showDataDeletionInfo(context),
            ),

            const SizedBox(height: 24),

            // Contact Information
            const Text(
              'Questions?',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoalBlack,
                letterSpacing: 0.3,
              ),
            ),
            const SizedBox(height: 16),

            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.pureWhite,
                    AppColors.offWhite,
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadowLight,
                    offset: const Offset(0, 2),
                    blurRadius: 8,
                    spreadRadius: 0,
                  ),
                ],
                border: Border.all(
                  color: AppColors.slateGray.withOpacity(0.1),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Contact our Privacy Team',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.charcoalBlack,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'If you have questions about our privacy practices or want to exercise your rights, contact us:',
                    style: TextStyle(
                      color: AppColors.slateGray,
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.email_outlined, size: 16, color: AppColors.slateGray),
                      const SizedBox(width: 8),
                      Text(
                        'privacy@addagram.in',
                        style: TextStyle(
                          color: AppColors.crimsonRed,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Last Updated
            Center(
              child: Text(
                'Last updated: January 2024',
                style: TextStyle(
                  color: AppColors.slateGray,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
        ),
      ),
    );
  }

  Widget _buildLegalOption({
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
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: AppColors.charcoalBlack,
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
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.crimsonRed.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.open_in_new_rounded,
                    size: 16,
                    color: AppColors.crimsonRed,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPrivacyOption({
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
                    color: AppColors.vibrantPurple.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.vibrantPurple,
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
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: AppColors.charcoalBlack,
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
                  size: 16,
                  color: AppColors.slateGray,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showDataCollectionInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Data We Collect',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const SingleChildScrollView(
          child: Text(
            'We collect the following types of information:\n\n'
            '• Account Information: Name, email, phone number\n'
            '• Profile Information: Profile picture, preferences\n'
            '• Order Information: Purchase history, addresses\n'
            '• Usage Data: App usage patterns, features used\n'
            '• Device Information: Device type, OS version\n'
            '• Location Data: For delivery purposes (with permission)\n\n'
            'We only collect data necessary to provide our services.',
            style: TextStyle(
              color: AppColors.slateGray,
              height: 1.5,
            ),
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

  void _showDataSharingInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Data Sharing',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const SingleChildScrollView(
          child: Text(
            'We share your data only in these situations:\n\n'
            '• Service Providers: Payment processors, delivery partners\n'
            '• Legal Requirements: When required by law\n'
            '• Business Transfers: In case of mergers or acquisitions\n'
            '• With Your Consent: When you explicitly agree\n\n'
            'We never sell your personal data to third parties.\n\n'
            'All partners are required to protect your data with the same level of security we provide.',
            style: TextStyle(
              color: AppColors.slateGray,
              height: 1.5,
            ),
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

  void _showDataSecurityInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Data Security',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const SingleChildScrollView(
          child: Text(
            'We protect your data using:\n\n'
            '• Encryption: All data is encrypted in transit and at rest\n'
            '• Secure Servers: Industry-standard security measures\n'
            '• Access Controls: Limited access to authorized personnel\n'
            '• Regular Audits: Security reviews and updates\n'
            '• Secure Payments: PCI-compliant payment processing\n\n'
            'We continuously monitor and improve our security measures to keep your data safe.',
            style: TextStyle(
              color: AppColors.slateGray,
              height: 1.5,
            ),
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

  void _showDataDeletionInfo(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.pureWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text(
          'Delete My Data',
          style: TextStyle(
            color: AppColors.charcoalBlack,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: const SingleChildScrollView(
          child: Text(
            'You have the right to request deletion of your personal data.\n\n'
            'To request data deletion:\n\n'
            '1. Email us at privacy@addagram.in\n'
            '2. Include "Data Deletion Request" in the subject\n'
            '3. Provide your account email for verification\n'
            '4. Specify what data you want deleted\n\n'
            'Note: Some data may be retained for legal or business purposes as outlined in our Privacy Policy.\n\n'
            'We will respond to your request within 30 days.',
            style: TextStyle(
              color: AppColors.slateGray,
              height: 1.5,
            ),
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
            onPressed: () async {
              Navigator.pop(context);
              // Open email app
              final Uri emailUri = Uri.parse('mailto:privacy@addagram.in?subject=Data%20Deletion%20Request');
              if (await canLaunchUrl(emailUri)) {
                await launchUrl(emailUri);
              }
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
}

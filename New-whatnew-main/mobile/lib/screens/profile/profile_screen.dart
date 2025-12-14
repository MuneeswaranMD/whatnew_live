import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_colors.dart';
import '../auth/login_screen.dart';
import '../address/address_list_screen.dart';
import '../referral/referral_screen.dart';
import 'edit_profile_screen.dart';
import 'help_support_screen.dart';
import 'terms_privacy_screen.dart';
import 'become_seller_screen.dart';
import '../../utils/image_utils.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;

          if (user == null) {
            return Center(
              child: CircularProgressIndicator(
                color: AppColors.crimsonRed,
              ),
            );
          }

          return CustomScrollView(
            slivers: [
              // Modern App Bar with Gradient
              SliverAppBar(
                expandedHeight: 280,
                floating: false,
                pinned: true,
                elevation: 0,
                backgroundColor: AppColors.crimsonRed,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppColors.crimsonRed,
                          AppColors.crimsonRed.withOpacity(0.8),
                        ],
                      ),
                    ),
                    child: SafeArea(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 40),
                          // Profile Avatar with Ring
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.pureWhite,
                                width: 3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.shadowLight,
                                  blurRadius: 20,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: CircleAvatar(
                              radius: 60,
                              backgroundColor: AppColors.pureWhite,
                              backgroundImage: user.buyerProfile?.avatar != null
                                  ? NetworkImage(
                                      ImageUtils.getFullImageUrl(
                                        user.buyerProfile!.avatar!,
                                      ),
                                    )
                                  : null,
                              child: user.buyerProfile?.avatar == null
                                  ? Text(
                                      user.firstName.isNotEmpty
                                          ? user.firstName[0].toUpperCase()
                                          : 'U',
                                      style: theme.textTheme.headlineLarge?.copyWith(
                                        color: AppColors.crimsonRed,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    )
                                  : null,
                            ),
                          ),
                          const SizedBox(height: 16),
                          // User Name
                          Text(
                            '${user.firstName} ${user.lastName}',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: AppColors.pureWhite,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          // User Email
                          Text(
                            user.email,
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: AppColors.pureWhite.withOpacity(0.9),
                            ),
                          ),
                          if (user.phoneNumber != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              user.phoneNumber!,
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: AppColors.pureWhite.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // Profile Options
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Account Settings',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: AppColors.lightTextPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Profile Options Grid
                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.person_outline_rounded,
                        title: 'Edit Profile',
                        subtitle: 'Update your personal information',
                        gradient: [AppColors.skyBlue, AppColors.skyBlueLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const EditProfileScreen(),
                            ),
                          );
                        },
                      ),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.location_on_outlined,
                        title: 'Addresses',
                        subtitle: 'Manage your delivery addresses',
                        gradient: [AppColors.emeraldGreen, AppColors.emeraldGreenLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AddressListScreen(),
                            ),
                          );
                        },
                      ),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.card_giftcard_rounded,
                        title: 'Referrals',
                        subtitle: 'Refer friends and earn rewards',
                        gradient: [AppColors.amberYellow, AppColors.amberYellowLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ReferralScreen(),
                            ),
                          );
                        },
                      ),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.storefront_rounded,
                        title: 'Become a Seller',
                        subtitle: 'Start selling and grow your business',
                        gradient: [AppColors.vibrantPurple, AppColors.vibrantPurpleLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const BecomeSellerScreen(),
                            ),
                          );
                        },
                      ),

                      const SizedBox(height: 24),
                      
                      Text(
                        'Support & Legal',
                        style: theme.textTheme.titleLarge?.copyWith(
                          color: AppColors.lightTextPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.help_outline_rounded,
                        title: 'Help & Support',
                        subtitle: 'Get help with your account',
                        gradient: [AppColors.slateGray, AppColors.slateGrayLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const HelpSupportScreen(),
                            ),
                          );
                        },
                      ),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.security_rounded,
                        title: 'Terms & Privacy',
                        subtitle: 'Legal information and privacy settings',
                        gradient: [AppColors.slateGray, AppColors.slateGrayLight],
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const TermsPrivacyScreen(),
                            ),
                          );
                        },
                      ),

                      _buildModernProfileOption(
                        context: context,
                        icon: Icons.info_outline_rounded,
                        title: 'About',
                        subtitle: 'App version and information',
                        gradient: [AppColors.slateGray, AppColors.slateGrayLight],
                        onTap: () {
                          showAboutDialog(
                            context: context,
                            applicationName: 'Livestream Ecommerce',
                            applicationVersion: '1.0.0',
                            applicationLegalese: '© 2024 Livestream Ecommerce',
                          );
                        },
                      ),

                      const SizedBox(height: 32),

                      // Modern Logout Button
                      Container(
                        width: double.infinity,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [AppColors.error, AppColors.errorLight],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.error.withOpacity(0.3),
                              blurRadius: 12,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(16),
                            onTap: () => _showLogoutDialog(context, authProvider),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(
                                  Icons.logout_rounded,
                                  color: AppColors.pureWhite,
                                  size: 24,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  'Logout',
                                  style: theme.textTheme.titleMedium?.copyWith(
                                    color: AppColors.pureWhite,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildModernProfileOption({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required List<Color> gradient,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [
            gradient[0].withOpacity(0.1),
            gradient[1].withOpacity(0.05),
          ],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        border: Border.all(
          color: gradient[0].withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Icon Container
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: gradient,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: gradient[0].withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.pureWhite,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                
                // Text Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          color: AppColors.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Arrow Icon
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 16,
                  color: gradient[0].withOpacity(0.6),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, AuthProvider authProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final theme = Theme.of(context);
        return AlertDialog(
          backgroundColor: AppColors.lightSurface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.error.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.logout_rounded,
                  color: AppColors.error,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'Logout',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.lightTextPrimary,
                ),
              ),
            ],
          ),
          content: Text(
            'Are you sure you want to logout from your account?',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: AppColors.lightTextSecondary,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.slateGray,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              child: Text(
                'Cancel',
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.error, AppColors.errorLight],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: TextButton(
                onPressed: () async {
                  Navigator.of(context).pop();
                  await authProvider.logout();

                  // Navigate to login screen and clear stack
                  if (context.mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(
                        builder: (context) => const LoginScreen(),
                      ),
                      (route) => false,
                    );
                  }
                },
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.pureWhite,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                child: Text(
                  'Logout',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.pureWhite,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

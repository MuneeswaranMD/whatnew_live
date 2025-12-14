/// Main Theme Export File
/// 
/// Provides easy access to all theme-related components
/// for the Livestream E-commerce Mobile App

export 'app_colors.dart';
export 'app_text_styles.dart';
export 'theme_manager.dart';
export 'theme_provider.dart';

/// Quick access imports for common theme usage
/// 
/// Usage in your widget files:
/// ```dart
/// import 'package:your_app/core/theme/theme.dart';
/// 
/// // Access colors
/// Container(color: AppColors.crimsonRed)
/// 
/// // Access text styles
/// Text('Hello', style: AppTextStyles.h6Bold)
/// 
/// // Access theme manager
/// MaterialApp(theme: AppThemeManager.lightTheme)
/// 
/// // Access livestream themes
/// Container(decoration: LiveStreamThemes.priceTag)
/// ```

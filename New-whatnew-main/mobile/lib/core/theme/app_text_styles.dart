import 'package:flutter/material.dart';
import 'app_colors.dart';

/// App Text Styles Configuration
/// 
/// Provides comprehensive typography system based on Material Design 3
/// guidelines optimized for livestream e-commerce applications
class AppTextStyles {
  AppTextStyles._();

  // 📝 Font Family Constants
  static const String _primaryFontFamily = 'Roboto';
  static const String _displayFontFamily = 'Roboto';

  // 📝 Font Weight Constants
  static const FontWeight _light = FontWeight.w300;
  static const FontWeight _regular = FontWeight.w400;
  static const FontWeight _medium = FontWeight.w500;
  static const FontWeight _semiBold = FontWeight.w600;
  static const FontWeight _bold = FontWeight.w700;

  // 🎯 Display Styles (Large text for hero sections)
  static const TextStyle displayLarge = TextStyle(
    fontFamily: _displayFontFamily,
    fontSize: 57,
    fontWeight: _regular,
    letterSpacing: -0.25,
    height: 1.12,
  );

  static const TextStyle displayMedium = TextStyle(
    fontFamily: _displayFontFamily,
    fontSize: 45,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.16,
  );

  static const TextStyle displaySmall = TextStyle(
    fontFamily: _displayFontFamily,
    fontSize: 36,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.22,
  );

  // 🎯 Headline Styles (Large headlines)
  static const TextStyle headlineLarge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 32,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.25,
  );

  static const TextStyle headlineMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 28,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.29,
  );

  static const TextStyle headlineSmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 24,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.33,
  );

  // 🎯 Title Styles (Medium emphasis headlines)
  static const TextStyle titleLarge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 22,
    fontWeight: _regular,
    letterSpacing: 0,
    height: 1.27,
  );

  static const TextStyle titleMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 16,
    fontWeight: _medium,
    letterSpacing: 0.15,
    height: 1.5,
  );

  static const TextStyle titleSmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _medium,
    letterSpacing: 0.1,
    height: 1.43,
  );

  // 🎯 Label Styles (Small text for buttons, captions)
  static const TextStyle labelLarge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _medium,
    letterSpacing: 0.1,
    height: 1.43,
  );

  static const TextStyle labelMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _medium,
    letterSpacing: 0.5,
    height: 1.33,
  );

  static const TextStyle labelSmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 11,
    fontWeight: _medium,
    letterSpacing: 0.5,
    height: 1.45,
  );

  // 🎯 Body Styles (Regular content text)
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 16,
    fontWeight: _regular,
    letterSpacing: 0.5,
    height: 1.5,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _regular,
    letterSpacing: 0.25,
    height: 1.43,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _regular,
    letterSpacing: 0.4,
    height: 1.33,
  );

  // 🎯 Custom App-Specific Styles

  // Heading Variants
  static const TextStyle h1Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 32,
    fontWeight: _bold,
    letterSpacing: -0.5,
    height: 1.25,
  );

  static const TextStyle h2Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 28,
    fontWeight: _bold,
    letterSpacing: -0.25,
    height: 1.29,
  );

  static const TextStyle h3Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 24,
    fontWeight: _bold,
    letterSpacing: 0,
    height: 1.33,
  );

  static const TextStyle h4Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 20,
    fontWeight: _bold,
    letterSpacing: 0,
    height: 1.4,
  );

  static const TextStyle h5Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 18,
    fontWeight: _bold,
    letterSpacing: 0,
    height: 1.44,
  );

  static const TextStyle h6Bold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 16,
    fontWeight: _bold,
    letterSpacing: 0.15,
    height: 1.5,
  );

  // Body Variants
  static const TextStyle bodyRegular = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _regular,
    letterSpacing: 0.25,
    height: 1.43,
  );

  static const TextStyle bodyMediumWeight = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _medium,
    letterSpacing: 0.25,
    height: 1.43,
  );

  static const TextStyle bodyBold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _bold,
    letterSpacing: 0.25,
    height: 1.43,
  );

  // Button Styles
  static const TextStyle buttonLarge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 16,
    fontWeight: _medium,
    letterSpacing: 0.5,
    height: 1.25,
  );

  static const TextStyle buttonMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _medium,
    letterSpacing: 0.5,
    height: 1.14,
  );

  static const TextStyle buttonRegular = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _regular,
    letterSpacing: 0.5,
    height: 1.14,
  );

  static const TextStyle buttonSmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _medium,
    letterSpacing: 0.5,
    height: 1.33,
  );

  // Caption and Support Text
  static const TextStyle caption = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _regular,
    letterSpacing: 0.4,
    height: 1.33,
  );

  static const TextStyle captionBold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _medium,
    letterSpacing: 0.4,
    height: 1.33,
  );

  static const TextStyle overline = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 10,
    fontWeight: _regular,
    letterSpacing: 1.5,
    height: 1.6,
  );

  static const TextStyle overlineBold = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 10,
    fontWeight: _medium,
    letterSpacing: 1.5,
    height: 1.6,
  );

  // 🎯 Livestream-Specific Styles

  // Price Display
  static const TextStyle priceDisplay = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 24,
    fontWeight: _bold,
    letterSpacing: 0,
    height: 1.33,
  );

  static const TextStyle priceMedium = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 18,
    fontWeight: _semiBold,
    letterSpacing: 0,
    height: 1.44,
  );

  static const TextStyle priceSmall = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _semiBold,
    letterSpacing: 0.1,
    height: 1.43,
  );

  // Live Status
  static const TextStyle liveStatus = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _bold,
    letterSpacing: 1.0,
    height: 1.33,
  );

  // Viewer Count
  static const TextStyle viewerCount = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _medium,
    letterSpacing: 0.4,
    height: 1.33,
  );

  // Chat Message
  static const TextStyle chatMessage = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 14,
    fontWeight: _regular,
    letterSpacing: 0.1,
    height: 1.43,
  );

  static const TextStyle chatUsername = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 12,
    fontWeight: _semiBold,
    letterSpacing: 0.2,
    height: 1.33,
  );

  // Notification Badge
  static const TextStyle notificationBadge = TextStyle(
    fontFamily: _primaryFontFamily,
    fontSize: 10,
    fontWeight: _bold,
    letterSpacing: 0.5,
    height: 1.0,
  );

  // 🎨 Complete Text Theme for Light Mode
  static const TextTheme lightTextTheme = TextTheme(
    // Display
    displayLarge: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 57,
      fontWeight: _regular,
      letterSpacing: -0.25,
      height: 1.12,
      color: AppColors.lightTextPrimary,
    ),
    displayMedium: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 45,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.16,
      color: AppColors.lightTextPrimary,
    ),
    displaySmall: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 36,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.22,
      color: AppColors.lightTextPrimary,
    ),

    // Headlines
    headlineLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 32,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.25,
      color: AppColors.lightTextPrimary,
    ),
    headlineMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 28,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.29,
      color: AppColors.lightTextPrimary,
    ),
    headlineSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 24,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.33,
      color: AppColors.lightTextPrimary,
    ),

    // Titles
    titleLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 22,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.27,
      color: AppColors.lightTextPrimary,
    ),
    titleMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 16,
      fontWeight: _medium,
      letterSpacing: 0.15,
      height: 1.5,
      color: AppColors.lightTextPrimary,
    ),
    titleSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _medium,
      letterSpacing: 0.1,
      height: 1.43,
      color: AppColors.lightTextPrimary,
    ),

    // Body
    bodyLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 16,
      fontWeight: _regular,
      letterSpacing: 0.5,
      height: 1.5,
      color: AppColors.lightTextPrimary,
    ),
    bodyMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _regular,
      letterSpacing: 0.25,
      height: 1.43,
      color: AppColors.lightTextPrimary,
    ),
    bodySmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 12,
      fontWeight: _regular,
      letterSpacing: 0.4,
      height: 1.33,
      color: AppColors.lightTextSecondary,
    ),

    // Labels
    labelLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _medium,
      letterSpacing: 0.1,
      height: 1.43,
      color: AppColors.lightTextPrimary,
    ),
    labelMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 12,
      fontWeight: _medium,
      letterSpacing: 0.5,
      height: 1.33,
      color: AppColors.lightTextPrimary,
    ),
    labelSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 11,
      fontWeight: _medium,
      letterSpacing: 0.5,
      height: 1.45,
      color: AppColors.lightTextPrimary,
    ),
  );

  // 🎨 Complete Text Theme for Dark Mode
  static const TextTheme darkTextTheme = TextTheme(
    // Display
    displayLarge: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 57,
      fontWeight: _regular,
      letterSpacing: -0.25,
      height: 1.12,
      color: AppColors.darkTextPrimary,
    ),
    displayMedium: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 45,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.16,
      color: AppColors.darkTextPrimary,
    ),
    displaySmall: TextStyle(
      fontFamily: _displayFontFamily,
      fontSize: 36,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.22,
      color: AppColors.darkTextPrimary,
    ),

    // Headlines
    headlineLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 32,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.25,
      color: AppColors.darkTextPrimary,
    ),
    headlineMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 28,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.29,
      color: AppColors.darkTextPrimary,
    ),
    headlineSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 24,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.33,
      color: AppColors.darkTextPrimary,
    ),

    // Titles
    titleLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 22,
      fontWeight: _regular,
      letterSpacing: 0,
      height: 1.27,
      color: AppColors.darkTextPrimary,
    ),
    titleMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 16,
      fontWeight: _medium,
      letterSpacing: 0.15,
      height: 1.5,
      color: AppColors.darkTextPrimary,
    ),
    titleSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _medium,
      letterSpacing: 0.1,
      height: 1.43,
      color: AppColors.darkTextPrimary,
    ),

    // Body
    bodyLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 16,
      fontWeight: _regular,
      letterSpacing: 0.5,
      height: 1.5,
      color: AppColors.darkTextPrimary,
    ),
    bodyMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _regular,
      letterSpacing: 0.25,
      height: 1.43,
      color: AppColors.darkTextPrimary,
    ),
    bodySmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 12,
      fontWeight: _regular,
      letterSpacing: 0.4,
      height: 1.33,
      color: AppColors.darkTextSecondary,
    ),

    // Labels
    labelLarge: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 14,
      fontWeight: _medium,
      letterSpacing: 0.1,
      height: 1.43,
      color: AppColors.darkTextPrimary,
    ),
    labelMedium: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 12,
      fontWeight: _medium,
      letterSpacing: 0.5,
      height: 1.33,
      color: AppColors.darkTextPrimary,
    ),
    labelSmall: TextStyle(
      fontFamily: _primaryFontFamily,
      fontSize: 11,
      fontWeight: _medium,
      letterSpacing: 0.5,
      height: 1.45,
      color: AppColors.darkTextPrimary,
    ),
  );
}

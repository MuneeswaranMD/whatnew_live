import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Theme Manager for Livestream E-commerce App
/// 
/// Provides comprehensive Material Design 3 theme configuration
/// with light and dark mode support
class AppThemeManager {
  AppThemeManager._();

  /// Light Theme Configuration
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      
      // Primary Color Scheme
      colorScheme: const ColorScheme.light(
        primary: AppColors.crimsonRed,
        primaryContainer: AppColors.crimsonRedLight,
        secondary: AppColors.vibrantPurple,
        tertiary: AppColors.emeraldGreen,
        surface: AppColors.lightSurface,
        background: AppColors.lightBackground,
        error: AppColors.error,
        onPrimary: AppColors.pureWhite,
        onSecondary: AppColors.pureWhite,
        onSurface: AppColors.lightTextPrimary,
        onBackground: AppColors.lightTextPrimary,
        onError: AppColors.pureWhite,
      ),
      
      // App Bar
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.pureWhite,
        foregroundColor: AppColors.lightTextPrimary,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.lightTextPrimary),
      ),
      
      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.crimsonRed,
          foregroundColor: AppColors.pureWhite,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      
      // Input Fields
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.offWhite,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.crimsonRed, width: 2),
        ),
      ),
      
      // Background
      scaffoldBackgroundColor: AppColors.lightBackground,
    );
  }

  /// Dark Theme Configuration
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      
      // Primary Color Scheme
      colorScheme: const ColorScheme.dark(
        primary: AppColors.crimsonRedLight,
        primaryContainer: AppColors.crimsonRedDark,
        secondary: AppColors.vibrantPurpleLight,
        tertiary: AppColors.emeraldGreenLight,
        surface: AppColors.darkSurface,
        background: AppColors.darkBackground,
        error: AppColors.errorLight,
        onPrimary: AppColors.charcoalBlack,
        onSecondary: AppColors.charcoalBlack,
        onSurface: AppColors.darkTextPrimary,
        onBackground: AppColors.darkTextPrimary,
        onError: AppColors.charcoalBlack,
      ),
      
      // App Bar
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.darkSurface,
        foregroundColor: AppColors.darkTextPrimary,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.darkTextPrimary),
      ),
      
      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.crimsonRedLight,
          foregroundColor: AppColors.charcoalBlack,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      
      // Input Fields
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.charcoalBlack,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.crimsonRedLight, width: 2),
        ),
      ),
      
      // Background
      scaffoldBackgroundColor: AppColors.darkBackground,
    );
  }

  /// Get theme based on brightness
  static ThemeData getTheme(Brightness brightness) {
    return brightness == Brightness.light ? lightTheme : darkTheme;
  }
}

/// LiveStream Specific Component Themes
class LiveStreamThemes {
  LiveStreamThemes._();

  /// Live Status Badge Theme
  static BoxDecoration get liveStatusBadge => const BoxDecoration(
    color: AppColors.error,
    borderRadius: BorderRadius.all(Radius.circular(12)),
  );

  /// Price Tag Theme
  static BoxDecoration get priceTag => BoxDecoration(
    color: AppColors.crimsonRed,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: AppColors.shadowLight,
        blurRadius: 4,
        offset: const Offset(0, 2),
      ),
    ],
  );

  /// Chat Bubble Theme
  static BoxDecoration get chatBubble => BoxDecoration(
    color: AppColors.offWhite,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: AppColors.borderLight),
  );

  /// CTA Button Theme
  static ButtonStyle get ctaButtonStyle => ElevatedButton.styleFrom(
    backgroundColor: AppColors.crimsonRed,
    foregroundColor: AppColors.pureWhite,
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(25),
    ),
    elevation: 4,
  );

  /// Secondary Button Theme
  static ButtonStyle get secondaryButtonStyle => OutlinedButton.styleFrom(
    foregroundColor: AppColors.crimsonRed,
    side: const BorderSide(color: AppColors.crimsonRed, width: 2),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  );
}

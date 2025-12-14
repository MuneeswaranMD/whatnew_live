import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_text_styles.dart';

/// App Theme Configuration
/// 
/// Provides Material Design 3 themed configurations for both light and dark modes
/// optimized for livestream e-commerce applications
class AppTheme {
  AppTheme._();

  /// Light Theme Configuration
  static ThemeData get lightTheme {
    return ThemeData(
      // 🎨 Basic Theme Properties
      useMaterial3: true,
      brightness: Brightness.light,
      
      // 🎨 Color Scheme
      colorScheme: const ColorScheme.light(
        primary: AppColors.crimsonRed,
        primaryContainer: AppColors.crimsonRedLight,
        secondary: AppColors.vibrantPurple,
        secondaryContainer: AppColors.vibrantPurpleLight,
        tertiary: AppColors.skyBlue,
        tertiaryContainer: AppColors.skyBlueLight,
        surface: AppColors.lightSurface,
        surfaceVariant: AppColors.offWhite,
        background: AppColors.lightBackground,
        error: AppColors.error,
        errorContainer: AppColors.errorLight,
        onPrimary: AppColors.pureWhite,
        onSecondary: AppColors.pureWhite,
        onTertiary: AppColors.pureWhite,
        onSurface: AppColors.lightTextPrimary,
        onSurfaceVariant: AppColors.lightTextSecondary,
        onBackground: AppColors.lightTextPrimary,
        onError: AppColors.pureWhite,
        outline: AppColors.borderLight,
        outlineVariant: AppColors.dividerLight,
        shadow: AppColors.shadowLight,
        scrim: AppColors.charcoalBlack,
        inverseSurface: AppColors.charcoalBlack,
        onInverseSurface: AppColors.darkTextPrimary,
        inversePrimary: AppColors.crimsonRedLight,
      ),

      // 🎨 App Bar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.pureWhite,
        foregroundColor: AppColors.lightTextPrimary,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: AppColors.shadowLight,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
        ),
        titleTextStyle: AppTextStyles.h6Bold,
        centerTitle: true,
        iconTheme: IconThemeData(
          color: AppColors.lightTextPrimary,
          size: 24,
        ),
        actionsIconTheme: IconThemeData(
          color: AppColors.lightTextPrimary,
          size: 24,
        ),
      ),

      // 🎨 Bottom Navigation Bar Theme
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.pureWhite,
        selectedItemColor: AppColors.crimsonRed,
        unselectedItemColor: AppColors.slateGray,
        selectedLabelStyle: AppTextStyles.caption,
        unselectedLabelStyle: AppTextStyles.caption,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),

      // 🎨 Card Theme
      cardTheme: CardThemeData(
        color: AppColors.lightCard,
        shadowColor: AppColors.shadowLight,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(8),
      ),

      // 🎨 Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.crimsonRed,
          foregroundColor: AppColors.pureWhite,
          elevation: 2,
          shadowColor: AppColors.shadowLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Outlined Button Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.crimsonRed,
          side: const BorderSide(color: AppColors.crimsonRed, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.crimsonRed,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Icon Button Theme
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(
          foregroundColor: AppColors.lightTextPrimary,
          backgroundColor: Colors.transparent,
          padding: const EdgeInsets.all(8),
        ),
      ),

      // 🎨 Floating Action Button Theme
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.crimsonRed,
        foregroundColor: AppColors.pureWhite,
        elevation: 6,
        shape: CircleBorder(),
      ),

      // 🎨 Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.offWhite,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.crimsonRed, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.error, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        hintStyle: AppTextStyles.bodyRegular.copyWith(
          color: AppColors.lightTextSecondary,
        ),
        labelStyle: AppTextStyles.bodyRegular.copyWith(
          color: AppColors.lightTextSecondary,
        ),
      ),

      // 🎨 Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.offWhite,
        deleteIconColor: AppColors.lightTextSecondary,
        disabledColor: AppColors.borderLight,
        selectedColor: AppColors.crimsonRed,
        secondarySelectedColor: AppColors.vibrantPurple,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        labelStyle: AppTextStyles.caption,
        secondaryLabelStyle: AppTextStyles.caption.copyWith(
          color: AppColors.pureWhite,
        ),
        brightness: Brightness.light,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // 🎨 Dialog Theme
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.lightSurface,
        elevation: 8,
        shadowColor: AppColors.shadowLight,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        titleTextStyle: AppTextStyles.h6Bold,
        contentTextStyle: AppTextStyles.bodyRegular,
      ),

      // 🎨 Bottom Sheet Theme
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.lightSurface,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(16),
          ),
        ),
        clipBehavior: Clip.antiAliasWithSaveLayer,
      ),

      // 🎨 Progress Indicator Theme
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.crimsonRed,
        linearTrackColor: AppColors.borderLight,
        circularTrackColor: AppColors.borderLight,
      ),

      // 🎨 Switch Theme
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRed;
          }
          return AppColors.slateGray;
        }),
        trackColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRedLight;
          }
          return AppColors.borderLight;
        }),
      ),

      // 🎨 Checkbox Theme
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRed;
          }
          return Colors.transparent;
        }),
        checkColor: MaterialStateProperty.all(AppColors.pureWhite),
        side: const BorderSide(color: AppColors.borderLight, width: 2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),

      // 🎨 Radio Theme
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRed;
          }
          return AppColors.borderLight;
        }),
      ),

      // 🎨 Slider Theme
      sliderTheme: const SliderThemeData(
        activeTrackColor: AppColors.crimsonRed,
        inactiveTrackColor: AppColors.borderLight,
        thumbColor: AppColors.crimsonRed,
        overlayColor: AppColors.crimsonRedLight,
        valueIndicatorColor: AppColors.crimsonRed,
        valueIndicatorTextStyle: AppTextStyles.caption,
      ),

      // 🎨 Tab Bar Theme
      tabBarTheme: const TabBarThemeData(
        labelColor: AppColors.crimsonRed,
        unselectedLabelColor: AppColors.lightTextSecondary,
        indicator: UnderlineTabIndicator(
          borderSide: BorderSide(color: AppColors.crimsonRed, width: 2),
        ),
        labelStyle: AppTextStyles.buttonMedium,
        unselectedLabelStyle: AppTextStyles.buttonRegular,
      ),

      // 🎨 Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.dividerLight,
        thickness: 1,
        space: 1,
      ),

      // 🎨 List Tile Theme
      listTileTheme: const ListTileThemeData(
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        dense: false,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
        selectedTileColor: AppColors.offWhite,
        textColor: AppColors.lightTextPrimary,
        iconColor: AppColors.lightTextSecondary,
      ),

      // 🎨 Text Theme
      textTheme: AppTextStyles.lightTextTheme,

      // 🎨 Icon Theme
      iconTheme: const IconThemeData(
        color: AppColors.lightTextPrimary,
        size: 24,
      ),

      // 🎨 Primary Icon Theme
      primaryIconTheme: const IconThemeData(
        color: AppColors.pureWhite,
        size: 24,
      ),

      // 🎨 Scaffold Background Color
      scaffoldBackgroundColor: AppColors.lightBackground,

      // 🎨 Canvas Color
      canvasColor: AppColors.lightSurface,

      // 🎨 Splash Color
      splashColor: AppColors.crimsonRed.withOpacity(0.1),
      highlightColor: AppColors.crimsonRed.withOpacity(0.05),

      // 🎨 Focus Color
      focusColor: AppColors.crimsonRed.withOpacity(0.1),
      hoverColor: AppColors.crimsonRed.withOpacity(0.05),

      // 🎨 Visual Density
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
  }

  /// Dark Theme Configuration
  static ThemeData get darkTheme {
    return ThemeData(
      // 🎨 Basic Theme Properties
      useMaterial3: true,
      brightness: Brightness.dark,
      
      // 🎨 Color Scheme
      colorScheme: const ColorScheme.dark(
        primary: AppColors.crimsonRedLight,
        primaryContainer: AppColors.crimsonRedDark,
        secondary: AppColors.vibrantPurpleLight,
        secondaryContainer: AppColors.vibrantPurpleDark,
        tertiary: AppColors.skyBlueLight,
        tertiaryContainer: AppColors.skyBlueDark,
        surface: AppColors.darkSurface,
        surfaceVariant: AppColors.charcoalBlack,
        background: AppColors.darkBackground,
        error: AppColors.errorLight,
        errorContainer: AppColors.errorDark,
        onPrimary: AppColors.charcoalBlack,
        onSecondary: AppColors.charcoalBlack,
        onTertiary: AppColors.charcoalBlack,
        onSurface: AppColors.darkTextPrimary,
        onSurfaceVariant: AppColors.darkTextSecondary,
        onBackground: AppColors.darkTextPrimary,
        onError: AppColors.charcoalBlack,
        outline: AppColors.borderDark,
        outlineVariant: AppColors.dividerDark,
        shadow: AppColors.shadowDark,
        scrim: AppColors.charcoalBlack,
        inverseSurface: AppColors.offWhite,
        onInverseSurface: AppColors.lightTextPrimary,
        inversePrimary: AppColors.crimsonRed,
      ),

      // 🎨 App Bar Theme
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.darkSurface,
        foregroundColor: AppColors.darkTextPrimary,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: AppColors.shadowDark,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
        ),
        titleTextStyle: AppTextStyles.h6Bold,
        centerTitle: true,
        iconTheme: IconThemeData(
          color: AppColors.darkTextPrimary,
          size: 24,
        ),
        actionsIconTheme: IconThemeData(
          color: AppColors.darkTextPrimary,
          size: 24,
        ),
      ),

      // 🎨 Bottom Navigation Bar Theme
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.darkSurface,
        selectedItemColor: AppColors.crimsonRedLight,
        unselectedItemColor: AppColors.slateGray,
        selectedLabelStyle: AppTextStyles.caption,
        unselectedLabelStyle: AppTextStyles.caption,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),

      // 🎨 Card Theme
      cardTheme: CardThemeData(
        color: AppColors.darkCard,
        shadowColor: AppColors.shadowDark,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: const EdgeInsets.all(8),
      ),

      // 🎨 Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.crimsonRedLight,
          foregroundColor: AppColors.charcoalBlack,
          elevation: 2,
          shadowColor: AppColors.shadowDark,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Outlined Button Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.crimsonRedLight,
          side: const BorderSide(color: AppColors.crimsonRedLight, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Text Button Theme
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.crimsonRedLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: AppTextStyles.buttonMedium,
        ),
      ),

      // 🎨 Icon Button Theme
      iconButtonTheme: IconButtonThemeData(
        style: IconButton.styleFrom(
          foregroundColor: AppColors.darkTextPrimary,
          backgroundColor: Colors.transparent,
          padding: const EdgeInsets.all(8),
        ),
      ),

      // 🎨 Floating Action Button Theme
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.crimsonRedLight,
        foregroundColor: AppColors.charcoalBlack,
        elevation: 6,
        shape: CircleBorder(),
      ),

      // 🎨 Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.charcoalBlack,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderDark),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.borderDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.crimsonRedLight, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.errorLight, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        hintStyle: AppTextStyles.bodyRegular.copyWith(
          color: AppColors.darkTextSecondary,
        ),
        labelStyle: AppTextStyles.bodyRegular.copyWith(
          color: AppColors.darkTextSecondary,
        ),
      ),

      // 🎨 Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.charcoalBlack,
        deleteIconColor: AppColors.darkTextSecondary,
        disabledColor: AppColors.borderDark,
        selectedColor: AppColors.crimsonRedLight,
        secondarySelectedColor: AppColors.vibrantPurpleLight,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        labelStyle: AppTextStyles.caption.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        secondaryLabelStyle: AppTextStyles.caption.copyWith(
          color: AppColors.charcoalBlack,
        ),
        brightness: Brightness.dark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // 🎨 Dialog Theme
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.darkSurface,
        elevation: 8,
        shadowColor: AppColors.shadowDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        titleTextStyle: AppTextStyles.h6Bold.copyWith(
          color: AppColors.darkTextPrimary,
        ),
        contentTextStyle: AppTextStyles.bodyRegular.copyWith(
          color: AppColors.darkTextPrimary,
        ),
      ),

      // 🎨 Bottom Sheet Theme
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.darkSurface,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(16),
          ),
        ),
        clipBehavior: Clip.antiAliasWithSaveLayer,
      ),

      // 🎨 Progress Indicator Theme
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.crimsonRedLight,
        linearTrackColor: AppColors.borderDark,
        circularTrackColor: AppColors.borderDark,
      ),

      // 🎨 Switch Theme
      switchTheme: SwitchThemeData(
        thumbColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRedLight;
          }
          return AppColors.slateGray;
        }),
        trackColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRedDark;
          }
          return AppColors.borderDark;
        }),
      ),

      // 🎨 Checkbox Theme
      checkboxTheme: CheckboxThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRedLight;
          }
          return Colors.transparent;
        }),
        checkColor: MaterialStateProperty.all(AppColors.charcoalBlack),
        side: const BorderSide(color: AppColors.borderDark, width: 2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
      ),

      // 🎨 Radio Theme
      radioTheme: RadioThemeData(
        fillColor: MaterialStateProperty.resolveWith<Color>((states) {
          if (states.contains(MaterialState.selected)) {
            return AppColors.crimsonRedLight;
          }
          return AppColors.borderDark;
        }),
      ),

      // 🎨 Slider Theme
      sliderTheme: const SliderThemeData(
        activeTrackColor: AppColors.crimsonRedLight,
        inactiveTrackColor: AppColors.borderDark,
        thumbColor: AppColors.crimsonRedLight,
        overlayColor: AppColors.crimsonRedDark,
        valueIndicatorColor: AppColors.crimsonRedLight,
        valueIndicatorTextStyle: AppTextStyles.caption,
      ),

      // 🎨 Tab Bar Theme
      tabBarTheme: TabBarThemeData(
        labelColor: AppColors.crimsonRedLight,
        unselectedLabelColor: AppColors.darkTextSecondary,
        indicator: const UnderlineTabIndicator(
          borderSide: BorderSide(color: AppColors.crimsonRedLight, width: 2),
        ),
        labelStyle: AppTextStyles.buttonMedium.copyWith(
          color: AppColors.crimsonRedLight,
        ),
        unselectedLabelStyle: AppTextStyles.buttonRegular.copyWith(
          color: AppColors.darkTextSecondary,
        ),
      ),

      // 🎨 Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.dividerDark,
        thickness: 1,
        space: 1,
      ),

      // 🎨 List Tile Theme
      listTileTheme: const ListTileThemeData(
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        dense: false,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
        selectedTileColor: AppColors.charcoalBlack,
        textColor: AppColors.darkTextPrimary,
        iconColor: AppColors.darkTextSecondary,
      ),

      // 🎨 Text Theme
      textTheme: AppTextStyles.darkTextTheme,

      // 🎨 Icon Theme
      iconTheme: const IconThemeData(
        color: AppColors.darkTextPrimary,
        size: 24,
      ),

      // 🎨 Primary Icon Theme
      primaryIconTheme: const IconThemeData(
        color: AppColors.charcoalBlack,
        size: 24,
      ),

      // 🎨 Scaffold Background Color
      scaffoldBackgroundColor: AppColors.darkBackground,

      // 🎨 Canvas Color
      canvasColor: AppColors.darkSurface,

      // 🎨 Splash Color
      splashColor: AppColors.crimsonRedLight.withOpacity(0.1),
      highlightColor: AppColors.crimsonRedLight.withOpacity(0.05),

      // 🎨 Focus Color
      focusColor: AppColors.crimsonRedLight.withOpacity(0.1),
      hoverColor: AppColors.crimsonRedLight.withOpacity(0.05),

      // 🎨 Visual Density
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
  }

  /// Get theme based on brightness
  static ThemeData getTheme(Brightness brightness) {
    return brightness == Brightness.light ? lightTheme : darkTheme;
  }
}

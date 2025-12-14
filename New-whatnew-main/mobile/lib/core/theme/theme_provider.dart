import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Theme Provider for managing app-wide theme state
/// 
/// Handles light/dark mode switching and provides easy access
/// to current theme configuration throughout the app
class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'app_theme_mode';
  
  ThemeMode _themeMode = ThemeMode.system;
  
  /// Current theme mode
  ThemeMode get themeMode => _themeMode;
  
  /// Whether the current theme is dark
  bool get isDarkMode {
    return _themeMode == ThemeMode.dark;
  }
  
  /// Whether the current theme is light
  bool get isLightMode {
    return _themeMode == ThemeMode.light;
  }
  
  /// Whether the theme follows system setting
  bool get isSystemMode {
    return _themeMode == ThemeMode.system;
  }

  /// Set theme mode
  void setThemeMode(ThemeMode mode) {
    _themeMode = mode;
    _updateSystemUIOverlay();
    notifyListeners();
    // Here you would typically save to SharedPreferences
    _saveThemePreference(mode);
  }

  /// Toggle between light and dark mode
  void toggleTheme() {
    if (_themeMode == ThemeMode.light) {
      setThemeMode(ThemeMode.dark);
    } else if (_themeMode == ThemeMode.dark) {
      setThemeMode(ThemeMode.light);
    } else {
      // If system mode, toggle to opposite of current system setting
      final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
      setThemeMode(brightness == Brightness.dark ? ThemeMode.light : ThemeMode.dark);
    }
  }

  /// Set light theme
  void setLightTheme() {
    setThemeMode(ThemeMode.light);
  }

  /// Set dark theme
  void setDarkTheme() {
    setThemeMode(ThemeMode.dark);
  }

  /// Set system theme (follow device setting)
  void setSystemTheme() {
    setThemeMode(ThemeMode.system);
  }

  /// Get effective brightness based on current theme mode
  Brightness getEffectiveBrightness(BuildContext context) {
    switch (_themeMode) {
      case ThemeMode.light:
        return Brightness.light;
      case ThemeMode.dark:
        return Brightness.dark;
      case ThemeMode.system:
        return MediaQuery.of(context).platformBrightness;
    }
  }

  /// Update system UI overlay style based on current theme
  void _updateSystemUIOverlay() {
    final isDark = _themeMode == ThemeMode.dark;
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
        systemNavigationBarColor: isDark ? const Color(0xFF1A1A1A) : Colors.white,
        systemNavigationBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
      ),
    );
  }

  /// Save theme preference (mock implementation)
  void _saveThemePreference(ThemeMode mode) {
    // In a real app, you would save this to SharedPreferences
    // SharedPreferences.getInstance().then((prefs) {
    //   prefs.setString(_themeKey, mode.toString());
    // });
  }

  /// Load theme preference (mock implementation)
  Future<void> loadThemePreference() async {
    // In a real app, you would load this from SharedPreferences
    // final prefs = await SharedPreferences.getInstance();
    // final themeString = prefs.getString(_themeKey);
    // if (themeString != null) {
    //   _themeMode = ThemeMode.values.firstWhere(
    //     (mode) => mode.toString() == themeString,
    //     orElse: () => ThemeMode.system,
    //   );
    //   notifyListeners();
    // }
  }
}

/// Extension to easily access theme provider
extension ThemeContext on BuildContext {
  /// Get theme provider
  ThemeProvider get themeProvider => 
      Provider.of<ThemeProvider>(this, listen: false);
  
  /// Watch theme provider for changes
  ThemeProvider get watchThemeProvider => 
      Provider.of<ThemeProvider>(this, listen: true);
}

// Mock Provider class for demonstration
class Provider {
  static T of<T>(BuildContext context, {bool listen = true}) {
    throw UnimplementedError('Add provider package dependency');
  }
}

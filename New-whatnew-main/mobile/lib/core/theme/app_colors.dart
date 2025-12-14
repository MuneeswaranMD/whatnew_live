import 'package:flutter/material.dart';

/// App Color Palette for Livestream E-commerce
/// 
/// This palette balances energy and trust:
/// - Energy: keeps the app lively and engaging for streams
/// - Trust: builds reliability for purchases
/// - Neutral balance: makes product images/videos pop without clashing
class AppColors {
  AppColors._();

  // 🎨 Primary Colors
  /// 🔴 Crimson Red - Call-to-action (Buy, Go Live, Highlights)
  static const Color crimsonRed = Color(0xFFE63946);
  static const Color crimsonRedLight = Color(0xFFFF6B7A);
  static const Color crimsonRedDark = Color(0xFFB71C1C);

  /// 🟣 Vibrant Purple - Accent for live status, badges, and reactions
  static const Color vibrantPurple = Color(0xFF7B2CBF);
  static const Color vibrantPurpleLight = Color(0xFFA855F7);
  static const Color vibrantPurpleDark = Color(0xFF581C87);

  // 🎨 Secondary Colors
  /// 🟢 Emerald Green - Success states (checkout, "added to cart")
  static const Color emeraldGreen = Color(0xFF2ECC71);
  static const Color emeraldGreenLight = Color(0xFF4ADE80);
  static const Color emeraldGreenDark = Color(0xFF059669);

  /// 🟡 Amber Yellow - Discounts, deals, and urgency highlights
  static const Color amberYellow = Color(0xFFF1C40F);
  static const Color amberYellowLight = Color(0xFFFBBF24);
  static const Color amberYellowDark = Color(0xFFD97706);

  // 🎨 Neutral Base
  /// ⚪ Off White - Background for content areas
  static const Color offWhite = Color(0xFFF9FAFB);
  static const Color pureWhite = Color(0xFFFFFFFF);

  /// ⚫ Charcoal Black - Text and dark mode foundation
  static const Color charcoalBlack = Color(0xFF111827);
  static const Color deepBlack = Color(0xFF000000);

  /// 🩶 Slate Gray - Secondary text, borders, icons
  static const Color slateGray = Color(0xFF6B7280);
  static const Color slateGrayLight = Color(0xFF9CA3AF);
  static const Color slateGrayDark = Color(0xFF374151);

  // 🎨 Supportive Shades
  /// 🌸 Soft Pink - Lighter accents for playful elements
  static const Color softPink = Color(0xFFFFB6C1);
  static const Color softPinkLight = Color(0xFFFCE7F3);
  static const Color softPinkDark = Color(0xFFEC4899);

  /// 🌊 Sky Blue - Trust, links, subtle interactive states
  static const Color skyBlue = Color(0xFF3B82F6);
  static const Color skyBlueLight = Color(0xFF60A5FA);
  static const Color skyBlueDark = Color(0xFF1D4ED8);

  // 🎨 Semantic Colors
  /// Success colors
  static const Color success = emeraldGreen;
  static const Color successLight = emeraldGreenLight;
  static const Color successDark = emeraldGreenDark;

  /// Error colors
  static const Color error = crimsonRed;
  static const Color errorLight = crimsonRedLight;
  static const Color errorDark = crimsonRedDark;

  /// Warning colors
  static const Color warning = amberYellow;
  static const Color warningLight = amberYellowLight;
  static const Color warningDark = amberYellowDark;

  /// Info colors
  static const Color info = skyBlue;
  static const Color infoLight = skyBlueLight;
  static const Color infoDark = skyBlueDark;

  // 🎨 Livestream Specific Colors
  /// Live streaming indicator - high visibility
  static const Color liveIndicator = crimsonRed;
  static const Color liveGlow = Color(0xFFFF4757);
  
  /// Stream viewer count background
  static const Color viewerCountBg = Color(0x80000000);
  
  /// Chat bubble colors
  static const Color chatBubbleSelf = vibrantPurple;
  static const Color chatBubbleOther = slateGrayLight;
  
  /// Product highlight in stream
  static const Color productHighlight = amberYellow;
  static const Color productBorder = vibrantPurple;

  // 🎨 E-commerce Specific Colors
  /// Shopping cart
  static const Color cartIcon = crimsonRed;
  static const Color cartBadge = vibrantPurple;
  
  /// Price colors
  static const Color priceText = charcoalBlack;
  static const Color discountPrice = crimsonRed;
  static const Color originalPrice = slateGray;
  
  /// Sale badge
  static const Color saleBadge = crimsonRed;
  static const Color discountBadge = amberYellow;
  
  /// Add to cart button
  static const Color addToCartButton = emeraldGreen;
  static const Color buyNowButton = crimsonRed;

  // 🎨 Background Colors
  /// Light theme backgrounds
  static const Color lightBackground = offWhite;
  static const Color lightSurface = pureWhite;
  static const Color lightCard = pureWhite;
  
  /// Dark theme backgrounds
  static const Color darkBackground = charcoalBlack;
  static const Color darkSurface = Color(0xFF1F2937);
  static const Color darkCard = Color(0xFF374151);

  // 🎨 Text Colors
  /// Light theme text
  static const Color lightTextPrimary = charcoalBlack;
  static const Color lightTextSecondary = slateGray;
  static const Color lightTextTertiary = slateGrayLight;
  
  /// Dark theme text
  static const Color darkTextPrimary = offWhite;
  static const Color darkTextSecondary = slateGrayLight;
  static const Color darkTextTertiary = slateGray;

  // 🎨 Border Colors
  static const Color borderLight = Color(0xFFE5E7EB);
  static const Color borderDark = Color(0xFF4B5563);
  static const Color dividerLight = Color(0xFFF3F4F6);
  static const Color dividerDark = Color(0xFF374151);

  // 🎨 Shadow Colors
  static const Color shadowLight = Color(0x1A000000);
  static const Color shadowDark = Color(0x3A000000);

  // 🎨 Gradient Colors
  static const List<Color> primaryGradient = [
    crimsonRed,
    vibrantPurple,
  ];

  static const List<Color> liveGradient = [
    crimsonRed,
    Color(0xFFFF6B7A),
  ];

  static const List<Color> successGradient = [
    emeraldGreen,
    Color(0xFF4ADE80),
  ];

  static const List<Color> shimmerGradient = [
    Color(0xFFE5E7EB),
    Color(0xFFF9FAFB),
    Color(0xFFE5E7EB),
  ];

  // 🎨 Opacity Variants
  static Color withOpacity(Color color, double opacity) {
    return color.withOpacity(opacity);
  }

  // 🎨 Color Utilities
  static Color lighten(Color color, [double amount = 0.1]) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(color);
    final hslLight = hsl.withLightness((hsl.lightness + amount).clamp(0.0, 1.0));
    return hslLight.toColor();
  }

  static Color darken(Color color, [double amount = 0.1]) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(color);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));
    return hslDark.toColor();
  }

  // 🔄 BACKWARD COMPATIBILITY - Legacy Color Names
  // These are kept for compatibility with existing code
  
  // Primary Colors (Legacy compatibility)
  static const Color primaryColor = crimsonRed;
  static const Color primaryLightColor = crimsonRedLight;
  static const Color primaryDarkColor = crimsonRedDark;
  
  // Secondary Colors (Legacy compatibility)
  static const Color secondaryColor = vibrantPurple;
  static const Color secondaryLightColor = vibrantPurpleLight;
  static const Color secondaryDarkColor = vibrantPurpleDark;
  
  // Accent Colors (Legacy compatibility)
  static const Color accentColor = skyBlue;
  static const Color accentLightColor = skyBlueLight;
  static const Color accentDarkColor = skyBlueDark;
  
  // Status Colors (Legacy compatibility)
  static const Color successColor = success;
  static const Color errorColor = error;
  static const Color warningColor = warning;
  static const Color infoColor = info;
  
  // Neutral Colors (Legacy compatibility)
  static const Color backgroundColor = lightBackground;
  static const Color surfaceColor = lightSurface;
  static const Color cardColor = lightCard;
  
  // Text Colors (Legacy compatibility)
  static const Color textPrimaryColor = lightTextPrimary;
  static const Color textSecondaryColor = lightTextSecondary;
  static const Color textHintColor = lightTextTertiary;
  static const Color textDisabledColor = lightTextTertiary;
  
  // Border Colors (Legacy compatibility)
  static const Color borderColor = borderLight;
  static const Color dividerColor = dividerLight;
  
  // Livestream Colors (Legacy compatibility)
  static const Color liveColor = liveIndicator;
  static const Color scheduledColor = amberYellow;
  static const Color endedColor = slateGray;
  
  // Bidding Colors (Legacy compatibility)
  static const Color biddingActiveColor = emeraldGreen;
  static const Color biddingInactiveColor = slateGray;
  static const Color winningBidColor = amberYellow;
  
  // Order Status Colors (Legacy compatibility)
  static const Color orderPendingColor = amberYellow;
  static const Color orderConfirmedColor = skyBlue;
  static const Color orderShippedColor = vibrantPurple;
  static const Color orderDeliveredColor = emeraldGreen;
  static const Color orderCancelledColor = crimsonRed;
  
  // Gradient Colors (Legacy compatibility)
  static const List<Color> primaryGradientColors = primaryGradient;
  static const List<Color> secondaryGradientColors = [vibrantPurple, vibrantPurpleLight];
  
  // Shadow Colors (Legacy compatibility)
  static const Color shadowColor = shadowLight;
  static const Color lightShadowColor = Color(0x0A000000);
  
  // Shimmer Colors (Legacy compatibility)
  static const Color shimmerBaseColor = Color(0xFFE5E7EB);
  static const Color shimmerHighlightColor = Color(0xFFF9FAFB);
  
  // Chat Colors (Legacy compatibility)
  static const Color myMessageColor = chatBubbleSelf;
  static const Color otherMessageColor = chatBubbleOther;
  static const Color onlineColor = emeraldGreen;
  static const Color offlineColor = slateGray;
}

# Keep Razorpay classes
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Keep proguard annotations
-keep class proguard.annotation.** { *; }
-dontwarn proguard.annotation.**

# Keep R8 from removing important Razorpay classes
-keep class * extends com.razorpay.BaseRazorpay { *; }
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Additional rules for Razorpay
-keep class org.json.** { *; }
-dontwarn org.json.**

# Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Google Play Core
-dontwarn com.google.android.play.core.**
-keep class com.google.android.play.core.** { *; }

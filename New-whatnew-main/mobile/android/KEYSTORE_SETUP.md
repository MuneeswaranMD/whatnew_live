# Android Keystore Setup Documentation

## Overview
This document describes the Android keystore setup for the What New mobile application.

## Keystore Details
- **File**: `whatnew-release-key.jks`
- **Location**: `mobile/android/whatnew-release-key.jks`
- **Alias**: `whatnew-key-alias`
- **Algorithm**: RSA 2048-bit
- **Validity**: 10,000 days (~27 years)
- **Created**: August 28, 2025

## SHA-256 Fingerprint
```
31:B9:B6:D4:EF:02:69:A9:C3:E4:92:BA:F5:97:B5:4E:66:0D:40:02:CA:A7:50:8A:CC:A0:9C:00:CA:30:38:CA
```

## SHA-1 Fingerprint (for legacy services)
```
DA:44:2C:58:B2:9D:F0:66:2B:FA:5E:09:16:6E:F0:EA:36:7E:04:E2
```

## Certificate Information
- **Owner**: CN=What New, OU=Development, O=What New Organization, L=Chennai, ST=Tamil Nadu, C=IN
- **Issuer**: CN=What New, OU=Development, O=What New Organization, L=Chennai, ST=Tamil Nadu, C=IN
- **Serial Number**: d269b9b407cc1506
- **Valid From**: Thu Aug 28 14:34:34 IST 2025
- **Valid Until**: Mon Jan 13 14:34:34 IST 2053

## Usage

### Building Release APK
```bash
flutter build apk --release
```

### Building App Bundle (AAB)
```bash
flutter build appbundle --release
```

### Generating SHA-256 Fingerprint
```bash
# Navigate to android directory
cd mobile/android

# Run the generation script
./generate-sha256-simple.ps1

# Or run keytool directly
keytool -list -v -keystore whatnew-release-key.jks -alias whatnew-key-alias -storepass 6383588281
```

## Configuration Files

### key.properties
```properties
storePassword=6383588281
keyPassword=6383588281
keyAlias=whatnew-key-alias
storeFile=../whatnew-release-key.jks
```

### app/build.gradle.kts (Signing Configuration)
```kotlin
signingConfigs {
    create("release") {
        keyAlias = keystoreProperties.getProperty("keyAlias")
        keyPassword = keystoreProperties.getProperty("keyPassword")
        storeFile = keystoreProperties.getProperty("storeFile")?.let { file(it) }
        storePassword = keystoreProperties.getProperty("storePassword")
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.getByName("release")
        isMinifyEnabled = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

## Third-Party Service Configuration

### Firebase
1. Go to Firebase Console → Project Settings → General
2. Add Android app with package name: `com.shop.whatnew`
3. Add SHA-256 fingerprint: `31:B9:B6:D4:EF:02:69:A9:C3:E4:92:BA:F5:97:B5:4E:66:0D:40:02:CA:A7:50:8A:CC:A0:9C:00:CA:30:38:CA`
4. Download `google-services.json` and place in `android/app/`

### Google Play Console
1. Go to Play Console → App Signing
2. Add SHA-256 certificate fingerprint
3. Use for Play App Signing or Upload key certificate

### Google APIs (Maps, etc.)
1. Go to Google Cloud Console → Credentials
2. Create or edit Android API key
3. Add SHA-256 fingerprint and package name restriction

### Facebook Login
1. Go to Facebook Developers → App Settings → Basic
2. Add Android platform
3. Set package name: `com.shop.whatnew`
4. Add key hash (SHA-1 converted to base64)

## Security Best Practices

### ✅ Do
- Keep the keystore file secure and make regular backups
- Store keystore passwords in a secure password manager
- Use the keystore only for release builds
- Verify the fingerprint before configuring third-party services

### ❌ Don't
- Never commit the keystore file to version control
- Never share the keystore file in unsecured channels
- Never use the same keystore for multiple unrelated apps
- Never lose the keystore file (you won't be able to update your app)

## Backup Instructions
1. **Create secure backup**: Copy `whatnew-release-key.jks` to a secure location
2. **Store credentials**: Save store password, key password, and alias securely
3. **Test backup**: Verify you can build release APK using backup keystore
4. **Multiple locations**: Store backups in multiple secure locations

## Troubleshooting

### Build fails with signing error
- Verify keystore file exists at specified path
- Check passwords in `key.properties` are correct
- Ensure alias name matches exactly

### Cannot generate fingerprint
- Verify keystore file exists
- Check keytool is in PATH
- Verify alias and passwords are correct

### Wrong fingerprint in services
- Regenerate fingerprint using the provided script
- Ensure you're using the release keystore, not debug
- Update all configured third-party services

## Scripts Available
- `create-keystore.ps1`: Creates a new keystore (use if current one is lost)
- `generate-sha256-simple.ps1`: Generates SHA-256 fingerprint for easy copying

## Contact
For any issues with the keystore setup, contact the development team.

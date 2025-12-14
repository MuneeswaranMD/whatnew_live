# Create Android Release Keystore
# This script creates a new keystore for Android release builds

Write-Host "🔑 Creating Android release keystore..." -ForegroundColor Green
Write-Host ""

# Change to the android directory
$androidDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $androidDir

# Check if keystore already exists
if (Test-Path "whatnew-release-key.jks") {
    Write-Host "⚠️  Keystore file 'whatnew-release-key.jks' already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Operation cancelled." -ForegroundColor Red
        exit 0
    }
    Remove-Item "whatnew-release-key.jks" -Force
    Write-Host "🗑️  Existing keystore removed." -ForegroundColor Yellow
}

# Read configuration from key.properties
if (Test-Path "key.properties") {
    Write-Host "📋 Reading configuration from key.properties..." -ForegroundColor Cyan
    $keyProps = Get-Content "key.properties" | ConvertFrom-StringData
    $storePassword = $keyProps.storePassword
    $keyPassword = $keyProps.keyPassword
    $keyAlias = $keyProps.keyAlias
} else {
    Write-Host "❌ key.properties file not found!" -ForegroundColor Red
    exit 1
}

# Create the keystore
Write-Host "🛠️  Creating keystore with the following details:" -ForegroundColor Cyan
Write-Host "   Alias: $keyAlias" -ForegroundColor White
Write-Host "   Validity: 10,000 days (~27 years)" -ForegroundColor White
Write-Host "   Algorithm: RSA 2048-bit" -ForegroundColor White
Write-Host ""

$keytoolCmd = "keytool -genkey -v -keystore whatnew-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias $keyAlias -storepass $storePassword -keypass $keyPassword -dname `"CN=What New, OU=Development, O=What New Organization, L=Chennai, ST=Tamil Nadu, C=IN`""

try {
    Invoke-Expression $keytoolCmd
    Write-Host ""
    Write-Host "✅ Keystore created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Keystore details:" -ForegroundColor Cyan
    Write-Host "   File: whatnew-release-key.jks" -ForegroundColor White
    Write-Host "   Location: $androidDir\whatnew-release-key.jks" -ForegroundColor White
    Write-Host "   Alias: $keyAlias" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 Security reminder:" -ForegroundColor Yellow
    Write-Host "   • Keep this keystore file secure and make backups" -ForegroundColor White
    Write-Host "   • Never commit the keystore to version control" -ForegroundColor White
    Write-Host "   • The keystore is already added to .gitignore" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "   • Run 'generate-sha256.ps1' to get the SHA-256 fingerprint" -ForegroundColor White
    Write-Host "   • Add the fingerprint to Firebase, Google Play Console, etc." -ForegroundColor White
    Write-Host "   • Build your release APK with: flutter build apk --release" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to create keystore: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

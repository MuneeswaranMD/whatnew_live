# Generate SHA-256 fingerprint for Android keystore
# This script generates the SHA-256 fingerprint needed for Firebase, Google Play Console, etc.

Write-Host "Generating SHA-256 fingerprint for Android release keystore..." -ForegroundColor Green
Write-Host ""

# Change to the android directory
$androidDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $androidDir

# Check if keystore exists
if (-not (Test-Path "whatnew-release-key.jks")) {
    Write-Host "Keystore file not found!" -ForegroundColor Red
    Write-Host "Please run create-keystore.ps1 first to create the keystore." -ForegroundColor Yellow
    exit 1
}

# Generate the fingerprint
Write-Host "Keystore Information:" -ForegroundColor Cyan
keytool -list -v -keystore whatnew-release-key.jks -alias whatnew-key-alias -storepass 6383588281

Write-Host ""
Write-Host "SHA-256 Fingerprint (for easy copying):" -ForegroundColor Yellow
$fingerprint = keytool -list -v -keystore whatnew-release-key.jks -alias whatnew-key-alias -storepass 6383588281 | Select-String "SHA256:" | ForEach-Object { $_.ToString().Split(":")[1].Trim() }
Write-Host $fingerprint -ForegroundColor White

Write-Host ""
Write-Host "Use this SHA-256 fingerprint for:" -ForegroundColor Cyan
Write-Host "   Firebase Android App configuration" -ForegroundColor White
Write-Host "   Google Play Console App Signing" -ForegroundColor White
Write-Host "   Google APIs (Maps, etc.)" -ForegroundColor White
Write-Host "   Facebook Login configuration" -ForegroundColor White
Write-Host "   Other third-party integrations" -ForegroundColor White

# Cleanup script for legacy share directories
# Run this after confirming the unified share system is working

Write-Host "🧹 Cleaning up legacy share directories..." -ForegroundColor Green

# Check if directories exist before attempting to remove
if (Test-Path "share-page") {
    Write-Host "📁 Removing share-page directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "share-page"
    Write-Host "✅ share-page directory removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  share-page directory does not exist" -ForegroundColor Blue
}

if (Test-Path "share-redirect") {
    Write-Host "📁 Removing share-redirect directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "share-redirect"
    Write-Host "✅ share-redirect directory removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  share-redirect directory does not exist" -ForegroundColor Blue
}

Write-Host "🎉 Legacy cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Current share system status:" -ForegroundColor Cyan
Write-Host "✅ Unified share handler: /share" -ForegroundColor Green
Write-Host "✅ Backend template: backend/templates/share/index.html" -ForegroundColor Green
Write-Host "✅ Legacy URL redirects: Configured in backend/core/share_views.py" -ForegroundColor Green
Write-Host "✅ Well-known files: .well-known/assetlinks.json, .well-known/apple-app-site-association" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Test your setup:" -ForegroundColor Cyan
Write-Host "   https://app.addagram.in/share?ref=TEST123" -ForegroundColor White
Write-Host "   https://app.addagram.in/share?product=123" -ForegroundColor White
Write-Host "   https://app.addagram.in/share?livestream=123" -ForegroundColor White

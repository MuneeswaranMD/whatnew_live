# Execute script to run backend, mobile, and seller-web concurrently
Write-Host "Starting Livestream Ecommerce Platform..." -ForegroundColor Green

# Function to run commands in separate windows
function Start-InNewWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkingDirectory'; Write-Host 'Starting $Title...' -ForegroundColor Yellow; $Command" -WindowStyle Normal
}

# Get the base directory
$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Django Backend
Write-Host "Starting Django Backend..." -ForegroundColor Cyan
$BackendDir = Join-Path $BaseDir "backend"
Start-InNewWindow -Title "Django Backend" -Command "python manage.py runserver 192.168.31.248:8000" -WorkingDirectory $BackendDir

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start React Seller Web App
Write-Host "Starting React Seller Web App..." -ForegroundColor Cyan
$SellerWebDir = Join-Path $BaseDir "seller-web"
Start-InNewWindow -Title "Seller Web App" -Command "npm start" -WorkingDirectory $SellerWebDir

# Wait a moment
Start-Sleep -Seconds 2

# Start Flutter Mobile App
Write-Host "Starting Flutter Mobile App..." -ForegroundColor Cyan
$MobileDir = Join-Path $BaseDir "mobile"
Start-InNewWindow -Title "Flutter Mobile App" -Command "flutter run" -WorkingDirectory $MobileDir

Write-Host "`nAll services are starting..." -ForegroundColor Green
Write-Host "Backend: https://api.addagram.in (Local: http://localhost:8000)" -ForegroundColor Yellow
Write-Host "Seller Web: https://seller.addagram.in (Local: http://localhost:3000)" -ForegroundColor Yellow
Write-Host "Mobile: https://app.addagram.in (Check Flutter console for device connection)" -ForegroundColor Yellow
Write-Host "`nPress any key to exit..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
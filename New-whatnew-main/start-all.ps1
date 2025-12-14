# WhatNew Full Stack Launcher
# This script starts all services with a single command

param(
    [string]$Host = "0.0.0.0",
    [int]$Port = 8000,
    [switch]$Help
)

if ($Help) {
    Write-Host "WhatNew Full Stack Launcher" -ForegroundColor Cyan
    Write-Host "Usage: .\start-all.ps1 [options]" -ForegroundColor Green
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Host <ip>     Server host (default: 0.0.0.0)"
    Write-Host "  -Port <port>   Server port (default: 8000)"
    Write-Host "  -Help          Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\start-all.ps1                    # Start all services"
    Write-Host "  .\start-all.ps1 -Host 192.168.1.5  # Custom host"
    Write-Host "  .\start-all.ps1 -Port 3000         # Custom port"
    exit 0
}

$ErrorActionPreference = "Stop"

# Function to write colored output
function Write-Service {
    param($Service, $Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] [$Service] $Message" -ForegroundColor $Color
}

# Function to check if port is available
function Test-Port {
    param($Port)
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    } catch {
        return $false
    }
}

# Function to start a service in a new PowerShell window
function Start-ServiceWindow {
    param($Title, $Command, $WorkingDirectory)
    
    $encodedCommand = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($Command))
    
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-WindowStyle", "Normal",
        "-EncodedCommand", $encodedCommand
    ) -WorkingDirectory $WorkingDirectory
    
    Write-Service $Title "Started in new window" "Green"
}

# Function to serve static files with Python
function Start-StaticServer {
    param($Directory, $Port)
    
    $command = @"
Write-Host "🌐 Starting Static File Server..." -ForegroundColor Cyan
Write-Host "Directory: $Directory" -ForegroundColor Yellow
Write-Host "URL: http://localhost:$Port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Set-Location '$Directory'
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $Port
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server $Port
} else {
    Write-Host "Python not found! Please install Python or use a web server." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
"@
    
    Start-ServiceWindow "StaticServer" $command $Directory
}

try {
    Write-Host "🚀 WhatNew Full Stack Launcher" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    # Get base directory
    $baseDir = Split-Path -Parent $PSScriptRoot
    $backendDir = Join-Path $baseDir "backend"
    $sellerWebDir = Join-Path $baseDir "seller-web"
    $shareDir = Join-Path $baseDir "share"
    
    # Verify directories exist
    $dirs = @(
        @{Path = $backendDir; Name = "Backend"},
        @{Path = $sellerWebDir; Name = "Seller Web"},
        @{Path = $shareDir; Name = "Share"}
    )
    
    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir.Path)) {
            Write-Host "❌ $($dir.Name) directory not found: $($dir.Path)" -ForegroundColor Red
            exit 1
        }
        Write-Service "CHECK" "$($dir.Name) directory found" "Green"
    }
    
    # Check if ports are available
    $ports = @($Port, 3000, 8080)
    foreach ($p in $ports) {
        if (-not (Test-Port $p)) {
            Write-Service "WARNING" "Port $p is already in use" "Yellow"
        }
    }
    
    Write-Host ""
    Write-Host "🎯 Starting Services..." -ForegroundColor Cyan
    Write-Host ""
    
    # 1. Start Django Backend with Uvicorn
    Write-Service "BACKEND" "Starting Django backend on ${Host}:${Port}..." "Blue"
    $backendCommand = @"
Write-Host "🐍 Starting Django Backend..." -ForegroundColor Cyan
Write-Host "Host: $Host" -ForegroundColor Yellow
Write-Host "Port: $Port" -ForegroundColor Yellow
Write-Host "URL: http://${Host}:${Port}" -ForegroundColor Green
Write-Host "Admin: http://${Host}:${Port}/admin/" -ForegroundColor Green
Write-Host "API: http://${Host}:${Port}/api/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Set-Location '$backendDir'
uvicorn livestream_ecommerce.asgi:application --host $Host --port $Port --reload
"@
    Start-ServiceWindow "Django-Backend" $backendCommand $backendDir
    Start-Sleep 3
    
    # 2. Start React Seller Web
    Write-Service "SELLER-WEB" "Starting React seller web app..." "Blue"
    $sellerWebCommand = @"
Write-Host "⚛️ Starting React Seller Web..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Set-Location '$sellerWebDir'
npm start
"@
    Start-ServiceWindow "React-SellerWeb" $sellerWebCommand $sellerWebDir
    Start-Sleep 3
    
    # 3. Start Static Share Server
    Write-Service "SHARE" "Starting static share server..." "Blue"
    Start-StaticServer $shareDir 8080
    Start-Sleep 2
    
    Write-Host ""
    Write-Host "✅ All Services Started!" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Service URLs:" -ForegroundColor Cyan
    Write-Host "  🐍 Django Backend:    http://${Host}:${Port}" -ForegroundColor White
    Write-Host "  📱 Admin Panel:       http://${Host}:${Port}/admin/" -ForegroundColor White
    Write-Host "  🔌 API Endpoints:     http://${Host}:${Port}/api/" -ForegroundColor White
    Write-Host "  ⚛️ Seller Web App:    http://localhost:3000" -ForegroundColor White
    Write-Host "  📄 Share Pages:       http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Features Enabled:" -ForegroundColor Cyan
    Write-Host "  ✅ Automatic Credit Monitoring (every 30 min)" -ForegroundColor Green
    Write-Host "  ✅ Inactivity Detection (15 min auto-end)" -ForegroundColor Green
    Write-Host "  ✅ Real-time WebSocket Support" -ForegroundColor Green
    Write-Host "  ✅ Live Streaming with Agora" -ForegroundColor Green
    Write-Host "  ✅ Product Bidding System" -ForegroundColor Green
    Write-Host "  ✅ Payment Processing" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Management Commands:" -ForegroundColor Cyan
    Write-Host "  Check credit monitor: curl http://${Host}:${Port}/api/livestreams/credit-monitor/status/" -ForegroundColor Yellow
    Write-Host "  Admin wallet status:  curl http://${Host}:${Port}/api/payments/admin/wallet/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Notes:" -ForegroundColor Cyan
    Write-Host "  • All services run in separate windows" -ForegroundColor White
    Write-Host "  • Close individual windows to stop services" -ForegroundColor White
    Write-Host "  • Check logs in each service window" -ForegroundColor White
    Write-Host "  • Credit monitoring runs automatically in backend" -ForegroundColor White
    Write-Host ""
    
    # Keep this window open to show status
    Write-Host "📊 Service Status Monitor" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to exit this monitor (services will continue running)" -ForegroundColor Yellow
    Write-Host ""
    
    # Monitor services
    $iteration = 0
    while ($true) {
        Start-Sleep 30
        $iteration++
        
        # Test backend
        try {
            $response = Invoke-WebRequest -Uri "http://${Host}:${Port}/api/health/" -TimeoutSec 5 -UseBasicParsing
            $backendStatus = if ($response.StatusCode -eq 200) { "✅ Running" } else { "⚠️ Issues" }
        } catch {
            $backendStatus = "❌ Down"
        }
        
        # Test seller web (usually runs on 3000)
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
            $sellerWebStatus = if ($response.StatusCode -eq 200) { "✅ Running" } else { "⚠️ Issues" }
        } catch {
            $sellerWebStatus = "❌ Down"
        }
        
        # Test share server
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
            $shareStatus = if ($response.StatusCode -eq 200) { "✅ Running" } else { "⚠️ Issues" }
        } catch {
            $shareStatus = "❌ Down"
        }
        
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] Backend: $backendStatus | Seller Web: $sellerWebStatus | Share: $shareStatus"
        
        # Every 5 minutes, show more detailed status
        if ($iteration % 10 -eq 0) {
            try {
                $monitorResponse = Invoke-RestMethod -Uri "http://${Host}:${Port}/api/livestreams/credit-monitor/status/" -TimeoutSec 10
                $activeStreams = $monitorResponse.total_active_streams
                $monitorRunning = if ($monitorResponse.monitor_status.is_running) { "✅" } else { "❌" }
                Write-Host "[$timestamp] Credit Monitor: $monitorRunning | Active Streams: $activeStreams" -ForegroundColor Cyan
            } catch {
                Write-Host "[$timestamp] Credit Monitor: ❓ Unable to check" -ForegroundColor Yellow
            }
        }
    }
    
} catch {
    Write-Host "❌ Error starting services: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Press Enter to exit..."
    Read-Host
    exit 1
}

# stopall.ps1 - Stop all running services for the WNOT application

Write-Host "Stopping all WNOT application services..." -ForegroundColor Red

# Function to stop processes by name
function Stop-ProcessByName {
    param([string]$ProcessName)
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "Stopping $ProcessName processes..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
        Write-Host "✓ $ProcessName processes stopped" -ForegroundColor Green
    } else {
        Write-Host "No $ProcessName processes found" -ForegroundColor Gray
    }
}

# Function to stop processes by port
function Stop-ProcessByPort {
    param([int]$Port)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
    if ($process) {
        Write-Host "Stopping process on port $Port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Process on port $Port stopped" -ForegroundColor Green
    } else {
        Write-Host "No process found on port $Port" -ForegroundColor Gray
    }
}

# Stop common development servers
Stop-ProcessByName "node"
Stop-ProcessByName "npm"
Stop-ProcessByName "python"
Stop-ProcessByName "django"
Stop-ProcessByName "flutter"
Stop-ProcessByName "dart"

# Stop processes on common ports (adjust ports based on your services)
Stop-ProcessByPort 3000  # React dev server
Stop-ProcessByPort 8000  # Django backend
Stop-ProcessByPort 8080  # Alternative web server
Stop-ProcessByPort 5000  # Flask/other services

# Kill any remaining PowerShell windows that might be running services
$currentPID = $PID
Get-Process -Name "powershell" | Where-Object { $_.Id -ne $currentPID } | ForEach-Object {
    Write-Host "Stopping PowerShell process $($_.Id)..." -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "`nAll services stopped successfully!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
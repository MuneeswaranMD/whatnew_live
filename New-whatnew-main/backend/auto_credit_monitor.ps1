# Auto Credit Monitor PowerShell Script
# This script runs the Django credit monitoring command automatically
# It restarts the monitoring if it crashes and logs all activity

param(
    [int]$CheckInterval = 300,  # 5 minutes default
    [string]$LogFile = "credit_monitor.log",
    [switch]$RunOnce = $false,
    [switch]$Verbose = $false
)

$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendPath = $ScriptPath
$LogPath = Join-Path $BackendPath $LogFile

# Function to write timestamped log
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogPath -Value $LogEntry
}

# Function to check if Django server is running
function Test-DjangoServer {
    try {
        $response = Invoke-WebRequest -Uri "http://192.168.31.247:8000/api/health/" -TimeoutSec 10 -UseBasicParsing
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Function to run credit monitoring
function Start-CreditMonitoring {
    param([bool]$RunOnce, [bool]$Verbose)
    
    Write-Log "Starting credit monitoring process..."
    
    # Change to backend directory
    Set-Location $BackendPath
    
    # Build command arguments
    $CmdArgs = @("manage.py", "monitor_credits", "--check-interval", $CheckInterval)
    
    if ($RunOnce) {
        $CmdArgs += "--run-once"
    }
    
    if ($Verbose) {
        $CmdArgs += "--verbose"
    }
    
    try {
        # Run the Django management command
        if ($RunOnce) {
            Write-Log "Running credit monitor once..."
            python $CmdArgs
            Write-Log "Credit monitor run completed."
        } else {
            Write-Log "Starting continuous credit monitoring (interval: ${CheckInterval}s)..."
            Write-Log "Use Ctrl+C to stop the monitoring service."
            python $CmdArgs
        }
    } catch {
        Write-Log "Error running credit monitor: $($_.Exception.Message)" "ERROR"
        throw
    }
}

# Main execution
try {
    Write-Log "Auto Credit Monitor Service Starting..."
    Write-Log "Backend Path: $BackendPath"
    Write-Log "Log File: $LogPath"
    Write-Log "Check Interval: ${CheckInterval}s"
    Write-Log "Run Once: $RunOnce"
    Write-Log "Verbose: $Verbose"
    
    # Check if Django server is accessible
    Write-Log "Checking Django server availability..."
    if (-not (Test-DjangoServer)) {
        Write-Log "Warning: Django server not accessible at http://192.168.31.247:8000/" "WARN"
        Write-Log "Make sure the Django server is running before starting credit monitoring." "WARN"
    } else {
        Write-Log "Django server is accessible."
    }
    
    if ($RunOnce) {
        # Run once and exit
        Start-CreditMonitoring -RunOnce $true -Verbose $Verbose
    } else {
        # Continuous monitoring with restart capability
        $RestartCount = 0
        $MaxRestarts = 10
        
        while ($RestartCount -lt $MaxRestarts) {
            try {
                Start-CreditMonitoring -RunOnce $false -Verbose $Verbose
                break  # Normal exit
            } catch {
                $RestartCount++
                Write-Log "Credit monitoring crashed (attempt $RestartCount/$MaxRestarts): $($_.Exception.Message)" "ERROR"
                
                if ($RestartCount -lt $MaxRestarts) {
                    Write-Log "Restarting credit monitoring in 30 seconds..." "WARN"
                    Start-Sleep -Seconds 30
                } else {
                    Write-Log "Maximum restart attempts reached. Stopping service." "ERROR"
                    break
                }
            }
        }
    }
    
} catch {
    Write-Log "Fatal error in auto credit monitor: $($_.Exception.Message)" "ERROR"
    exit 1
} finally {
    Write-Log "Auto Credit Monitor Service Stopped."
}

# Usage examples:
# .\auto_credit_monitor.ps1                          # Run continuous monitoring
# .\auto_credit_monitor.ps1 -RunOnce                 # Run once and exit
# .\auto_credit_monitor.ps1 -CheckInterval 180       # Check every 3 minutes
# .\auto_credit_monitor.ps1 -Verbose                 # Enable verbose output
# .\auto_credit_monitor.ps1 -LogFile "custom.log"    # Use custom log file

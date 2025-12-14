# Windows Task Scheduler Setup for Auto Credit Monitor
# This script creates a Windows Task that runs the credit monitoring automatically

param(
    [Parameter(Mandatory=$false)]
    [string]$TaskName = "LivestreamCreditMonitor",
    
    [Parameter(Mandatory=$false)]
    [string]$BackendPath = $PSScriptRoot,
    
    [Parameter(Mandatory=$false)]
    [int]$CheckInterval = 300,
    
    [Parameter(Mandatory=$false)]
    [string]$RunAsUser = $env:USERNAME,
    
    [Parameter(Mandatory=$false)]
    [switch]$Remove
)

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to create the scheduled task
function New-CreditMonitorTask {
    Write-Host "Creating Windows Task Scheduler task: $TaskName" -ForegroundColor Green
    
    $ScriptPath = Join-Path $BackendPath "auto_credit_monitor.ps1"
    $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath`" -CheckInterval $CheckInterval"
    
    # Set trigger to run at startup and every hour
    $TriggerStartup = New-ScheduledTaskTrigger -AtStartup
    $TriggerRepeat = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration ([TimeSpan]::MaxValue)
    
    # Set to run as the specified user
    $Principal = New-ScheduledTaskPrincipal -UserId $RunAsUser -LogonType Interactive
    
    # Task settings
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable
    
    # Create the task
    try {
        Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $TriggerStartup,$TriggerRepeat -Principal $Principal -Settings $Settings -Description "Automatically monitors and deducts credits for livestreams every 30 minutes"
        Write-Host "✓ Task created successfully!" -ForegroundColor Green
        Write-Host "✓ Task will start at system startup and run continuously" -ForegroundColor Green
        Write-Host "✓ Check interval: $CheckInterval seconds" -ForegroundColor Green
        
        # Start the task immediately
        Start-ScheduledTask -TaskName $TaskName
        Write-Host "✓ Task started!" -ForegroundColor Green
        
        return $true
    } catch {
        Write-Host "✗ Failed to create task: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to remove the scheduled task
function Remove-CreditMonitorTask {
    Write-Host "Removing Windows Task Scheduler task: $TaskName" -ForegroundColor Yellow
    
    try {
        # Stop the task if running
        Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        # Remove the task
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "✓ Task removed successfully!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Failed to remove task: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to show task status
function Show-TaskStatus {
    try {
        $Task = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
        $TaskInfo = Get-ScheduledTaskInfo -TaskName $TaskName
        
        Write-Host "`nTask Status:" -ForegroundColor Cyan
        Write-Host "Name: $($Task.TaskName)"
        Write-Host "State: $($Task.State)"
        Write-Host "Last Run: $($TaskInfo.LastRunTime)"
        Write-Host "Next Run: $($TaskInfo.NextRunTime)"
        Write-Host "Last Result: $($TaskInfo.LastTaskResult)"
        
        if ($Task.State -eq "Running") {
            Write-Host "Status: ✓ Running" -ForegroundColor Green
        } elseif ($Task.State -eq "Ready") {
            Write-Host "Status: ⏸ Ready (not running)" -ForegroundColor Yellow
        } else {
            Write-Host "Status: ❌ $($Task.State)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "Task '$TaskName' not found or error accessing task: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
try {
    Write-Host "Windows Task Scheduler Setup for Auto Credit Monitor" -ForegroundColor Cyan
    Write-Host "=" * 55 -ForegroundColor Cyan
    
    # Check administrator privileges
    if (-not (Test-Administrator)) {
        Write-Host "⚠ Warning: Not running as administrator. Some operations may fail." -ForegroundColor Yellow
        Write-Host "For best results, run this script as administrator." -ForegroundColor Yellow
        Write-Host ""
    }
    
    Write-Host "Configuration:"
    Write-Host "Task Name: $TaskName"
    Write-Host "Backend Path: $BackendPath"
    Write-Host "Check Interval: $CheckInterval seconds"
    Write-Host "Run As User: $RunAsUser"
    Write-Host ""
    
    if ($Remove) {
        Remove-CreditMonitorTask
    } else {
        # Check if task already exists
        $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        
        if ($ExistingTask) {
            Write-Host "Task '$TaskName' already exists." -ForegroundColor Yellow
            Show-TaskStatus
            
            $Response = Read-Host "`nDo you want to recreate it? (y/N)"
            if ($Response -eq 'y' -or $Response -eq 'Y') {
                Remove-CreditMonitorTask
                Start-Sleep -Seconds 2
                New-CreditMonitorTask
            } else {
                Write-Host "Keeping existing task." -ForegroundColor Green
            }
        } else {
            New-CreditMonitorTask
        }
        
        Write-Host ""
        Show-TaskStatus
    }
    
    Write-Host "`nAdditional Commands:" -ForegroundColor Cyan
    Write-Host "View all tasks: Get-ScheduledTask | Where-Object {`$_.TaskName -like '*Credit*'}"
    Write-Host "Start task: Start-ScheduledTask -TaskName '$TaskName'"
    Write-Host "Stop task: Stop-ScheduledTask -TaskName '$TaskName'"
    Write-Host "Remove task: .\setup_windows_task.ps1 -Remove"
    Write-Host "Manual run: .\auto_credit_monitor.ps1"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Usage examples:
# .\setup_windows_task.ps1                                    # Create task with defaults
# .\setup_windows_task.ps1 -CheckInterval 180                 # Check every 3 minutes  
# .\setup_windows_task.ps1 -TaskName "MyCustomCreditMonitor"  # Custom task name
# .\setup_windows_task.ps1 -Remove                            # Remove the task

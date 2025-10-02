# MusiBot Watchdog Script
# Monitors and automatically restarts MusiBot if it crashes
# Run on boot via Task Scheduler: -ExecutionPolicy Bypass -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1"

param(
    [string]$BotDirectory = "C:\Code\MusiBot",
    [int]$CheckInterval = 30,  # Check every 30 seconds
    [int]$RestartDelay = 5,    # Wait 5 seconds before restart
    [int]$MaxRestarts = 10,    # Max restarts per hour before stopping
    [string]$LogFile = "C:\Code\MusiBot\watchdog.log"
)

# Initialize
$ErrorActionPreference = "Continue"
$RestartCount = 0
$LastResetTime = Get-Date
$BotProcess = $null

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    Write-Host $LogMessage
    Add-Content -Path $LogFile -Value $LogMessage -ErrorAction SilentlyContinue
}

function Stop-ExistingBot {
    Write-Log "Stopping any existing MusiBot processes..."
    $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -and $_.CommandLine -like "*index.js*"
    }
    
    if ($processes) {
        foreach ($proc in $processes) {
            Write-Log "Stopping process ID: $($proc.Id)"
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
}

function Clear-Port8080 {
    Write-Log "Checking port 8080..."
    $connections = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            Write-Log "Killing process on port 8080: $($conn.OwningProcess)"
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 2
    }
}

function Start-MusiBot {
    Write-Log "Starting MusiBot..."
    
    # Change to bot directory
    Set-Location $BotDirectory
    
    # Clear port if needed
    Clear-Port8080
    
    # Start the bot process
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "node"
    $processInfo.Arguments = "index.js"
    $processInfo.WorkingDirectory = $BotDirectory
    $processInfo.UseShellExecute = $false
    $processInfo.RedirectStandardOutput = $true
    $processInfo.RedirectStandardError = $true
    $processInfo.CreateNoWindow = $true
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processInfo
    
    # Event handlers for output
    $process.add_OutputDataReceived({
        param([object]$sender, [System.Diagnostics.DataReceivedEventArgs]$e)
        if ($e.Data) {
            Write-Log $e.Data "BOT"
        }
    })
    
    $process.add_ErrorDataReceived({
        param([object]$sender, [System.Diagnostics.DataReceivedEventArgs]$e)
        if ($e.Data) {
            Write-Log $e.Data "ERROR"
        }
    })
    
    try {
        $process.Start() | Out-Null
        $process.BeginOutputReadLine()
        $process.BeginErrorReadLine()
        Write-Log "MusiBot started with PID: $($process.Id)" "SUCCESS"
        return $process
    }
    catch {
        Write-Log "Failed to start MusiBot: $_" "ERROR"
        return $null
    }
}

function Test-BotRunning {
    param([System.Diagnostics.Process]$Process)
    
    if (-not $Process) {
        return $false
    }
    
    try {
        # Check if process exists and hasn't exited
        if ($Process.HasExited) {
            Write-Log "Bot process has exited with code: $($Process.ExitCode)" "WARNING"
            return $false
        }
        
        # Additional check: verify the process still exists in system
        $sysProcess = Get-Process -Id $Process.Id -ErrorAction SilentlyContinue
        if (-not $sysProcess) {
            Write-Log "Bot process no longer exists in system" "WARNING"
            return $false
        }
        
        return $true
    }
    catch {
        Write-Log "Error checking bot status: $_" "WARNING"
        return $false
    }
}

function Reset-RestartCounter {
    $CurrentTime = Get-Date
    $TimeDiff = ($CurrentTime - $LastResetTime).TotalHours
    
    if ($TimeDiff -ge 1) {
        Write-Log "Resetting restart counter (1 hour elapsed)"
        $script:RestartCount = 0
        $script:LastResetTime = $CurrentTime
    }
}

# Main watchdog loop
Write-Log "=== MusiBot Watchdog Started ===" "SUCCESS"
Write-Log "Bot Directory: $BotDirectory"
Write-Log "Check Interval: $CheckInterval seconds"
Write-Log "Max Restarts per Hour: $MaxRestarts"

# Stop any existing instances
Stop-ExistingBot

# Initial start
$BotProcess = Start-MusiBot

if (-not $BotProcess) {
    Write-Log "Failed to start bot initially. Exiting watchdog." "ERROR"
    exit 1
}

# Monitor loop
while ($true) {
    Start-Sleep -Seconds $CheckInterval
    
    # Reset counter if needed
    Reset-RestartCounter
    
    # Check if bot is running
    $isRunning = Test-BotRunning -Process $BotProcess
    
    if (-not $isRunning) {
        Write-Log "Bot is not running! Attempting restart..." "WARNING"
        
        # Check restart limit
        if ($RestartCount -ge $MaxRestarts) {
            Write-Log "Maximum restart limit reached ($MaxRestarts per hour). Stopping watchdog." "ERROR"
            Write-Log "Please check the logs and restart manually." "ERROR"
            exit 1
        }
        
        # Increment restart counter
        $RestartCount++
        Write-Log "Restart attempt $RestartCount of $MaxRestarts"
        
        # Clean up old process
        try {
            if ($BotProcess -and -not $BotProcess.HasExited) {
                $BotProcess.Kill()
            }
            $BotProcess.Dispose()
        }
        catch {
            Write-Log "Error cleaning up old process: $_" "WARNING"
        }
        
        # Wait before restart
        Write-Log "Waiting $RestartDelay seconds before restart..."
        Start-Sleep -Seconds $RestartDelay
        
        # Clear any stuck processes
        Stop-ExistingBot
        
        # Restart the bot
        $BotProcess = Start-MusiBot
        
        if (-not $BotProcess) {
            Write-Log "Failed to restart bot. Waiting for next check cycle..." "ERROR"
        }
    }
    else {
        # Bot is running fine
        $uptime = (Get-Date) - $BotProcess.StartTime
        Write-Log "Bot is running (PID: $($BotProcess.Id), Uptime: $($uptime.ToString('hh\:mm\:ss')))"
    }
}

# Cleanup on exit (Ctrl+C)
trap {
    Write-Log "Watchdog shutting down..." "INFO"
    if ($BotProcess -and -not $BotProcess.HasExited) {
        Write-Log "Stopping bot process..."
        $BotProcess.Kill()
        $BotProcess.Dispose()
    }
    Write-Log "=== MusiBot Watchdog Stopped ===" "INFO"
    exit
}

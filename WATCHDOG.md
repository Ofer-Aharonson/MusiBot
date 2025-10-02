# MusiBot Watchdog - Setup Guide

## Overview
The Watchdog script monitors your MusiBot and automatically restarts it if it crashes. Perfect for running your bot 24/7 on a Windows server or local machine.

## Features
- ✅ **Auto-restart on crash** - Restarts bot within seconds if it crashes
- ✅ **Port cleanup** - Automatically clears port 8080 if stuck
- ✅ **Restart limits** - Prevents infinite restart loops (max 10/hour)
- ✅ **Detailed logging** - Tracks all restarts and errors in `watchdog.log`
- ✅ **Process monitoring** - Checks bot health every 30 seconds
- ✅ **Graceful shutdown** - Properly stops bot on watchdog exit

## Task Scheduler Setup (Run on Boot)

### Quick Setup
1. Open **Task Scheduler** (`taskschd.msc`)
2. Click **Create Task** (not Basic Task)
3. Configure as follows:

### General Tab
- **Name**: `MusiBot Watchdog`
- **Description**: `Monitors and auto-restarts MusiBot`
- ✅ **Run whether user is logged on or not**
- ✅ **Run with highest privileges**
- **Configure for**: `Windows 10` or `Windows 11`

### Triggers Tab
1. Click **New...**
2. **Begin the task**: `At startup`
3. ✅ **Enabled**
4. Click **OK**

### Actions Tab
1. Click **New...**
2. **Action**: `Start a program`
3. **Program/script**: `powershell.exe`
4. **Add arguments**: 
   ```
   -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1"
   ```
5. **Start in**: `C:\Code\MusiBot`
6. Click **OK**

### Conditions Tab
- ❌ **Uncheck** "Start the task only if the computer is on AC power"
- ❌ **Uncheck** "Stop if the computer switches to battery power"

### Settings Tab
- ✅ **Allow task to be run on demand**
- ❌ **Uncheck** "Stop the task if it runs longer than"
- **If the task is already running**: `Do not start a new instance`
- ✅ **If the task fails, restart every**: `1 minute` (attempts: `3`)

### Save & Test
1. Click **OK** to save
2. Enter your Windows password if prompted
3. Right-click the task → **Run** to test
4. Check `C:\Code\MusiBot\watchdog.log` for output

## Manual Start (Testing)

Test the watchdog before setting up Task Scheduler:

```powershell
cd C:\Code\MusiBot
powershell -ExecutionPolicy Bypass -File .\Watchdog-MusiBot.ps1
```

Press `Ctrl+C` to stop the watchdog.

## Configuration Parameters

You can customize the watchdog by editing these parameters at the top of `Watchdog-MusiBot.ps1`:

```powershell
param(
    [string]$BotDirectory = "C:\Code\MusiBot",  # Bot installation path
    [int]$CheckInterval = 30,                   # Check every 30 seconds
    [int]$RestartDelay = 5,                     # Wait 5 seconds before restart
    [int]$MaxRestarts = 10,                     # Max restarts per hour
    [string]$LogFile = "C:\Code\MusiBot\watchdog.log"  # Log file path
)
```

### Custom Parameters via Task Scheduler

To change parameters without editing the script:

**Add arguments**:
```powershell
-ExecutionPolicy Bypass -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1" -CheckInterval 60 -MaxRestarts 20
```

## Logs

### View Live Logs
```powershell
Get-Content C:\Code\MusiBot\watchdog.log -Wait
```

### Log Format
```
[2025-10-02 14:30:15] [INFO] === MusiBot Watchdog Started ===
[2025-10-02 14:30:15] [SUCCESS] MusiBot started with PID: 12345
[2025-10-02 14:30:45] [INFO] Bot is running (PID: 12345, Uptime: 00:00:30)
[2025-10-02 14:31:15] [WARNING] Bot is not running! Attempting restart...
[2025-10-02 14:31:20] [SUCCESS] MusiBot started with PID: 12346
```

### Log Levels
- **INFO** - Normal operation messages
- **SUCCESS** - Bot started successfully
- **WARNING** - Bot crashed, attempting restart
- **ERROR** - Critical errors (max restarts reached)
- **BOT** - Direct output from MusiBot

## Troubleshooting

### Watchdog doesn't start on boot
1. Check Task Scheduler is running: `Get-Service -Name Schedule`
2. Verify task exists: Open Task Scheduler → Find "MusiBot Watchdog"
3. Check task history: Task Scheduler → Enable History → Check for errors
4. Ensure paths are correct in the task action

### Bot keeps crashing
1. Check `watchdog.log` for error patterns
2. Check bot logs for crash reasons
3. Verify `.env` file has correct tokens
4. Test bot manually: `node index.js`

### Max restarts reached
```
[ERROR] Maximum restart limit reached (10 per hour). Stopping watchdog.
```

**Solutions**:
- Fix the underlying bot issue (check logs)
- Increase `MaxRestarts` parameter if legitimate crashes
- Check for port conflicts or permission issues

### Port 8080 always in use
The watchdog automatically clears port 8080, but if issues persist:

```powershell
# Manual port cleanup
Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { 
    Stop-Process -Id $_.OwningProcess -Force 
}
```

### Watchdog not detecting crashes
- Default check interval is 30 seconds
- Reduce `CheckInterval` for faster detection
- Check if bot is stuck (not crashed) - watchdog only detects process exits

## Stopping the Watchdog

### Via Task Scheduler
1. Open Task Scheduler
2. Find "MusiBot Watchdog"
3. Right-click → **End** or **Disable**

### Via PowerShell
```powershell
# Find and stop the watchdog process
Get-Process powershell | Where-Object { 
    $_.CommandLine -like "*Watchdog-MusiBot*" 
} | Stop-Process -Force

# Also stop the bot
Stop-Process -Name node -Force
```

### Via Process Manager
1. Open Task Manager (`Ctrl+Shift+Esc`)
2. Find `powershell.exe` running the watchdog
3. End the process
4. Also end `node.exe` (MusiBot)

## Security Considerations

- ✅ Watchdog runs with your user permissions
- ✅ Logs may contain bot output (keep `watchdog.log` secure)
- ✅ `.env` file should never be logged or exposed
- ❌ Don't run with higher privileges than necessary
- ✅ Consider log rotation for long-term deployments

## Log Rotation (Optional)

Add to the beginning of the watchdog script to rotate logs:

```powershell
# Rotate log if > 10MB
if (Test-Path $LogFile) {
    $logSize = (Get-Item $LogFile).Length / 1MB
    if ($logSize -gt 10) {
        $backupLog = $LogFile -replace '\.log$', "_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
        Move-Item $LogFile $backupLog
        Write-Host "Log rotated to: $backupLog"
    }
}
```

## Advanced: Running Multiple Bots

To run multiple bots with separate watchdogs:

1. Copy the script: `Watchdog-MusiBot2.ps1`
2. Edit parameters to point to different directories
3. Create separate Task Scheduler tasks
4. Use different log files for each bot

## Support

If you encounter issues:
1. Check `watchdog.log` for errors
2. Test bot manually: `node index.js`
3. Verify Task Scheduler task configuration
4. Check Windows Event Viewer for system errors
5. Ensure Node.js is in system PATH

## Uninstall

1. Open Task Scheduler
2. Find "MusiBot Watchdog"
3. Right-click → **Delete**
4. Stop any running watchdog processes
5. Optionally delete `Watchdog-MusiBot.ps1` and `watchdog.log`

---

**Enjoy your 24/7 MusiBot! 🎵**

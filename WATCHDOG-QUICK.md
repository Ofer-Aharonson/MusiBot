# 🛡️ Watchdog Quick Reference

## Quick Start

### Test Watchdog (Manual)
```powershell
# Option 1: Double-click this file
Start-Watchdog.bat

# Option 2: PowerShell command
cd C:\Code\MusiBot
powershell -ExecutionPolicy Bypass -File .\Watchdog-MusiBot.ps1
```

### Setup Auto-Start (Task Scheduler)

1. **Open Task Scheduler**: Press `Win+R`, type `taskschd.msc`, press Enter
2. **Create Task** (not "Create Basic Task")
3. **General Tab**:
   - Name: `MusiBot Watchdog`
   - ✅ Run whether user is logged on or not
   - ✅ Run with highest privileges
4. **Triggers Tab** → New:
   - Begin: `At startup`
5. **Actions Tab** → New:
   - Program: `powershell.exe`
   - Arguments: `-ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1"`
   - Start in: `C:\Code\MusiBot`
6. **Conditions Tab**:
   - ❌ Uncheck "Start only if on AC power"
7. **Settings Tab**:
   - ❌ Uncheck "Stop if runs longer than"
8. Click **OK**, enter password if prompted

## Monitor Watchdog

### View Live Logs
```powershell
Get-Content C:\Code\MusiBot\watchdog.log -Wait
```

### Check if Running
```powershell
Get-Process powershell | Where-Object { $_.CommandLine -like "*Watchdog*" }
```

### Check Bot Status
```powershell
Get-Process node | Where-Object { $_.CommandLine -like "*index.js*" }
```

## Control Watchdog

### Stop Watchdog
```powershell
# Via Task Scheduler
# Right-click "MusiBot Watchdog" → End

# Via PowerShell
Get-Process powershell | Where-Object { 
    $_.CommandLine -like "*Watchdog*" 
} | Stop-Process -Force
```

### Restart Watchdog
```powershell
# Stop first
Get-Process powershell | Where-Object { 
    $_.CommandLine -like "*Watchdog*" 
} | Stop-Process -Force

# Then start via Task Scheduler or manually
powershell -ExecutionPolicy Bypass -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1"
```

## Configuration

Edit `Watchdog-MusiBot.ps1` parameters:

```powershell
$CheckInterval = 30     # Check every 30 seconds
$RestartDelay = 5       # Wait 5 seconds before restart
$MaxRestarts = 10       # Max 10 restarts per hour
```

## Troubleshooting

### Bot Keeps Crashing
```powershell
# Check bot logs
Get-Content C:\Code\MusiBot\watchdog.log | Select-String "ERROR"

# Test bot manually
cd C:\Code\MusiBot
node index.js
```

### Max Restarts Reached
```
[ERROR] Maximum restart limit reached (10 per hour)
```
Fix the underlying issue, then increase `$MaxRestarts` if needed.

### Port 8080 Stuck
```powershell
# Manual cleanup
Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { 
    Stop-Process -Id $_.OwningProcess -Force 
}
```

### Task Scheduler Not Starting
1. Verify paths are correct in task action
2. Check task history in Task Scheduler
3. Ensure PowerShell execution policy allows scripts
4. Test manually first

## Log Locations

- **Watchdog Log**: `C:\Code\MusiBot\watchdog.log`
- **Bot Output**: Captured in watchdog log with `[BOT]` prefix
- **Task Scheduler**: Task Scheduler → History tab

## What It Does

✅ **Monitors** bot process every 30 seconds
✅ **Restarts** bot within 5 seconds if crashed
✅ **Cleans** port 8080 if stuck
✅ **Limits** restarts to prevent loops (10/hour)
✅ **Logs** everything to `watchdog.log`
✅ **Tracks** uptime and restart count

## Common Commands

```powershell
# View last 20 log lines
Get-Content C:\Code\MusiBot\watchdog.log -Tail 20

# Search for errors
Get-Content C:\Code\MusiBot\watchdog.log | Select-String "ERROR"

# Clear old logs (backup first!)
Move-Item watchdog.log "watchdog_$(Get-Date -Format 'yyyyMMdd').log"

# Check watchdog status
Get-ScheduledTask -TaskName "MusiBot Watchdog" | Get-ScheduledTaskInfo
```

## Need Help?

📖 Full documentation: [WATCHDOG.md](WATCHDOG.md)
🐛 Issues: Check `watchdog.log` for errors
💡 Tips: Test manually before Task Scheduler setup

---

**Enjoy your 24/7 MusiBot! 🎵**

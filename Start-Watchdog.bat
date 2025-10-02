@echo off
REM Quick test launcher for MusiBot Watchdog
REM Double-click to run, press Ctrl+C to stop

echo ========================================
echo MusiBot Watchdog - Test Mode
echo ========================================
echo.
echo Starting watchdog...
echo Press Ctrl+C to stop
echo.
echo Log file: C:\Code\MusiBot\watchdog.log
echo.

cd /d C:\Code\MusiBot
powershell.exe -ExecutionPolicy Bypass -File "C:\Code\MusiBot\Watchdog-MusiBot.ps1"

echo.
echo Watchdog stopped.
pause

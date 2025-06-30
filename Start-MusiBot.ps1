# PowerShell script to start MusiBot in a new window
$botPath = "C:\Code\MusiBot"
$nodeCmd = "node index.js"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$botPath`"; $nodeCmd"

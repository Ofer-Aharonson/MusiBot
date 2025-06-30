# PowerShell Watchdog script to keep MusiBot running
$botPath = "C:\Code\MusiBot"
$nodeCmd = "node index.js"

while ($true) {
    Write-Host "[Watchdog] Starting MusiBot..."
    $proc = Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory $botPath -NoNewWindow -Wait -PassThru
    $exitCode = $proc.ExitCode
    Write-Host "[Watchdog] MusiBot exited with code $exitCode. Restarting in 5 seconds..."
    Start-Sleep -Seconds 5
}

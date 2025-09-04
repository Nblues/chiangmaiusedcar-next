param([string]$Action)

if ($Action -eq "close") {
    Write-Host "Closing non-dev apps..." -ForegroundColor Yellow
    
    $apps = @("msedge", "Teams", "Spotify", "Discord", "Steam", "OneDrive")
    $closed = @()
    
    foreach ($app in $apps) {
        $proc = Get-Process -Name $app -ErrorAction SilentlyContinue
        if ($proc) {
            $closed += @{Name=$app; Path=$proc[0].Path}
            $proc | Stop-Process -Force
            Write-Host "Closed: $app" -ForegroundColor Red
        }
    }
    
    $closed | ConvertTo-Json | Out-File "$env:TEMP\apps.json"
    Write-Host "Done! Closed $($closed.Count) apps" -ForegroundColor Green
}
elseif ($Action -eq "restore") {
    Write-Host "Restoring apps..." -ForegroundColor Yellow
    
    if (Test-Path "$env:TEMP\apps.json") {
        $apps = Get-Content "$env:TEMP\apps.json" | ConvertFrom-Json
        foreach ($app in $apps) {
            if (Test-Path $app.Path) {
                Start-Process $app.Path
                Write-Host "Restored: $($app.Name)" -ForegroundColor Green
            }
        }
        Remove-Item "$env:TEMP\apps.json"
    }
}
else {
    Write-Host "Usage: script.ps1 [close|restore]"
}

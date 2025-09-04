# Simple Dev Environment Manager
param([string]$Action)

Write-Host "🚀 Development Environment Manager" -ForegroundColor Cyan

if ($Action -eq "close") {
    Write-Host "🔧 Closing non-development apps..." -ForegroundColor Yellow
    
    $appsToClose = @("msedge", "Teams", "Spotify", "Discord", "Steam", "OneDrive", "Dropbox", "obs64", "WINWORD", "EXCEL")
    $closedApps = @()
    
    foreach ($app in $appsToClose) {
        $processes = Get-Process -Name $app -ErrorAction SilentlyContinue
        if ($processes) {
            foreach ($proc in $processes) {
                $closedApps += @{
                    Name = $proc.ProcessName
                    Path = $proc.Path
                }
                Stop-Process -Id $proc.Id -Force
                Write-Host "❌ Closed: $($proc.ProcessName)" -ForegroundColor Red
            }
        }
    }
    
    if ($closedApps.Count -gt 0) {
        $closedApps | ConvertTo-Json | Out-File "$env:TEMP\closed-dev-apps.json" -Encoding UTF8
        Write-Host "✅ Closed $($closedApps.Count) apps successfully!" -ForegroundColor Green
    } else {
        Write-Host "📝 No apps were running" -ForegroundColor Yellow
    }
}
elseif ($Action -eq "restore") {
    Write-Host "🔄 Restoring apps..." -ForegroundColor Yellow
    
    $dataFile = "$env:TEMP\closed-dev-apps.json"
    if (Test-Path $dataFile) {
        $apps = Get-Content $dataFile | ConvertFrom-Json
        $restored = 0
        
        foreach ($app in $apps) {
            if ($app.Path -and (Test-Path $app.Path)) {
                Start-Process $app.Path
                Write-Host "▶️ Restored: $($app.Name)" -ForegroundColor Green
                $restored++
                Start-Sleep -Milliseconds 300
            }
        }
        
        if ($restored -gt 0) {
            Remove-Item $dataFile
            Write-Host "✅ Restored $restored apps successfully!" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ No apps data found to restore" -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  .\simple-dev.ps1 close    - Close non-development apps" -ForegroundColor White
    Write-Host "  .\simple-dev.ps1 restore  - Restore closed apps" -ForegroundColor White
    Write-Host ""
}

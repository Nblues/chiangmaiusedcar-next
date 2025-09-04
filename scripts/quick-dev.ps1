# Quick Dev Environment Manager
# สคริปต์เร็วสำหรับปิด/เปิดแอปพลิเคชัน
# Usage: .\quick-dev.ps1 close    # ปิดแอป
#        .\quick-dev.ps1 restore  # เปิดกลับคืน

param([string]$Action)

if ($Action -eq "close") {
    Write-Host "🔧 ปิดแอปที่ไม่เกี่ยวข้อง..." -ForegroundColor Yellow
    
    $processes = @("msedge","Teams","Spotify","Discord","Steam","OneDrive","Dropbox","obs64","WINWORD","EXCEL")
    $closed = @()
    
    foreach ($proc in $processes) {
        $running = Get-Process -Name $proc -ErrorAction SilentlyContinue
        if ($running) {
            $closed += @{Name=$proc; Path=$running[0].Path}
            $running | Stop-Process -Force
            Write-Host "❌ $proc" -ForegroundColor Red
        }
    }
    
    $closed | ConvertTo-Json | Out-File "$env:TEMP\dev-apps.json"
    Write-Host "✅ ปิด $($closed.Count) แอป" -ForegroundColor Green
}
elseif ($Action -eq "restore") {
    Write-Host "🔄 เปิดแอปกลับคืน..." -ForegroundColor Yellow
    
    if (Test-Path "$env:TEMP\dev-apps.json") {
        $apps = Get-Content "$env:TEMP\dev-apps.json" | ConvertFrom-Json
        foreach ($app in $apps) {
            if (Test-Path $app.Path) {
                Start-Process $app.Path
                Write-Host "▶️ $($app.Name)" -ForegroundColor Green
            }
        }
        Remove-Item "$env:TEMP\dev-apps.json"
        Write-Host "✅ เปิดเรียบร้อย" -ForegroundColor Green
    }
}
else {
    Write-Host "Usage: .\quick-dev.ps1 [close|restore]" -ForegroundColor Yellow
}

# สคริปต์เปิดแอปกลับคืนหลังรีสตาร์ทเครื่อง
# Restore Applications Script
# Created: August 27, 2025

Write-Host "🔄 กำลังเปิดแอปพลิเคชันกลับคืน..." -ForegroundColor Yellow

# ตรวจสอบไฟล์ข้อมูล process ที่ปิดไป
$closedProcessesFile = "$PSScriptRoot\closed-processes.json"

if (-not (Test-Path $closedProcessesFile)) {
    Write-Host "❌ ไม่พบไฟล์ข้อมูล process ที่ปิดไป: $closedProcessesFile" -ForegroundColor Red
    Write-Host "💡 โปรดรันสคริปต์ close-non-dev-apps.ps1 ก่อน" -ForegroundColor Yellow
    pause
    exit
}

try {
    $closedProcesses = Get-Content $closedProcessesFile | ConvertFrom-Json
    
    if (-not $closedProcesses -or $closedProcesses.Count -eq 0) {
        Write-Host "📝 ไม่มี process ที่ต้องเปิดกลับคืน" -ForegroundColor Green
        pause
        exit
    }
    
    Write-Host "📋 พบ $($closedProcesses.Count) แอปที่ต้องเปิดกลับคืน" -ForegroundColor Cyan
    
    $restored = 0
    $failed = 0
    
    foreach ($processInfo in $closedProcesses) {
        try {
            if ($processInfo.Path -and (Test-Path $processInfo.Path)) {
                Write-Host "▶️ เปิด: $($processInfo.Name)" -ForegroundColor Green
                Start-Process $processInfo.Path -ErrorAction SilentlyContinue
                $restored++
                Start-Sleep -Milliseconds 500  # หน่วงเวลาไม่ให้เปิดพร้อมกันเยอะ
            }
            else {
                Write-Host "⚠️ ไม่พบไฟล์: $($processInfo.Name) - $($processInfo.Path)" -ForegroundColor Yellow
                $failed++
            }
        }
        catch {
            Write-Host "❌ ไม่สามารถเปิด: $($processInfo.Name) - $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
    
    Write-Host "`n✅ เสร็จสิ้น!" -ForegroundColor Green
    Write-Host "▶️ เปิดสำเร็จ: $restored แอป" -ForegroundColor Green
    Write-Host "❌ เปิดไม่ได้: $failed แอป" -ForegroundColor Red
    
    # ลบไฟล์ข้อมูลหลังใช้งานเสร็จ
    Write-Host "`n🗑️ ลบไฟล์ข้อมูลชั่วคราว..." -ForegroundColor Yellow
    Remove-Item $closedProcessesFile -Force
    
}
catch {
    Write-Host "❌ เกิดข้อผิดพลาด: $($_.Exception.Message)" -ForegroundColor Red
}

pause

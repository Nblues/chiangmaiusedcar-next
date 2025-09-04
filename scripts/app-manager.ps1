# สคริปต์รวมสำหรับจัดการแอปพลิเคชัน
# Application Management Helper Script
# Created: August 27, 2025

param(
    [string]$Action = "menu"
)

function Show-Menu {
    Clear-Host
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host "🚀 ตัวจัดการแอปพลิเคชันสำหรับการพัฒนา" -ForegroundColor Yellow
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 🔴 ปิดแอปที่ไม่เกี่ยวข้องกับการพัฒนา" -ForegroundColor Red
    Write-Host "2. 🔄 เปิดแอปกลับคืน" -ForegroundColor Green
    Write-Host "3. 📋 ดูรายการ process ปัจจุบัน" -ForegroundColor Cyan
    Write-Host "4. 💾 ดูการใช้หน่วยความจำ" -ForegroundColor Magenta
    Write-Host "5. 🚪 ออก" -ForegroundColor Gray
    Write-Host ""
    Write-Host "==============================================================" -ForegroundColor Cyan
}

function Show-CurrentProcesses {
    Write-Host "📋 Process ที่กำลังทำงาน (เฉพาะที่สำคัญ):" -ForegroundColor Cyan
    
    $importantProcesses = @(
        "code", "node", "npm", "git", "python", "chrome", 
        "msedge", "Teams", "Spotify", "Discord", "Steam", 
        "OneDrive", "Dropbox", "obs64"
    )
    
    foreach ($proc in $importantProcesses) {
        $processes = Get-Process -Name $proc -ErrorAction SilentlyContinue
        if ($processes) {
            Write-Host "✅ $proc - $($processes.Count) instance(s)" -ForegroundColor Green
        } else {
            Write-Host "❌ $proc - ไม่ทำงาน" -ForegroundColor Red
        }
    }
}

function Show-MemoryUsage {
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $totalMemory = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeMemory = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedMemory = $totalMemory - $freeMemory
    $usagePercent = [math]::Round(($usedMemory / $totalMemory) * 100, 1)
    
    Write-Host "💾 การใช้หน่วยความจำ:" -ForegroundColor Magenta
    Write-Host "   รวม: $totalMemory GB" -ForegroundColor White
    Write-Host "   ใช้แล้ว: $usedMemory GB ($usagePercent%)" -ForegroundColor Yellow
    Write-Host "   ว่าง: $freeMemory GB" -ForegroundColor Green
}

if ($Action -eq "close") {
    & "$PSScriptRoot\close-non-dev-apps.ps1"
    exit
}

if ($Action -eq "restore") {
    & "$PSScriptRoot\restore-apps.ps1"
    exit
}

# แสดงเมนู
do {
    Show-Menu
    $choice = Read-Host "เลือกการดำเนินการ (1-5)"
    
    switch ($choice) {
        "1" {
            & "$PSScriptRoot\close-non-dev-apps.ps1"
            Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
            Read-Host
        }
        "2" {
            & "$PSScriptRoot\restore-apps.ps1"
            Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
            Read-Host
        }
        "3" {
            Show-CurrentProcesses
            Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
            Read-Host
        }
        "4" {
            Show-MemoryUsage
            Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
            Read-Host
        }
        "5" {
            Write-Host "👋 ขอบคุณที่ใช้บริการ!" -ForegroundColor Green
            exit
        }
        default {
            Write-Host "❌ กรุณาเลือก 1-5 เท่านั้น" -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($choice -ne "5")

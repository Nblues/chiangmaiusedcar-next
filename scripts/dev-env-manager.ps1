# สคริปต์รวมทุกฟังก์ชันในไฟล์เดียว (สำหรับใช้งานง่าย)
# All-in-One Development Environment Manager
# Created: August 27, 2025

param(
    [ValidateSet("close", "restore", "menu", "setup")]
    [string]$Action = "menu"
)

# กำหนดรายการ process ที่จะปิด
$PROCESSES_TO_CLOSE = @(
    "msedge", "firefox", "opera", "brave",
    "Teams", "Slack", "Discord", "WhatsApp", "Telegram Desktop", "Signal", "Zoom", "Skype",
    "Spotify", "vlc", "foobar2000", "iTunes", "MusicBee", "AIMP",
    "Steam", "EpicGamesLauncher", "Battle.net", "Origin", "Uplay", "GOGGalaxy",
    "OneDrive", "Dropbox", "GoogleDriveFS", "Box", "pCloud",
    "obs64", "obs32", "OBS", "XSplit", "Streamlabs OBS", "Bandicam", "Camtasia",
    "WINWORD", "EXCEL", "POWERPNT", "OUTLOOK", "ONENOTE",
    "Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects",
    "uTorrent", "BitTorrent", "qBittorrent", "IDM",
    "Notepad++", "7zFM", "WinRAR", "TeamViewer", "AnyDesk", "calculator"
)

function Close-NonDevApps {
    Write-Host "🔧 กำลังปิดแอปพลิเคชันที่ไม่เกี่ยวข้องกับการพัฒนา..." -ForegroundColor Yellow
    Write-Host "💡 จะไม่ปิด: VS Code, Node.js, Git, Python, Google Chrome" -ForegroundColor Green
    
    $closedProcesses = @()
    
    foreach ($processName in $PROCESSES_TO_CLOSE) {
        try {
            $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
            if ($processes) {
                foreach ($process in $processes) {
                    $processInfo = @{
                        Name = $process.ProcessName
                        Path = $process.Path
                        StartTime = $process.StartTime
                    }
                    $closedProcesses += $processInfo
                    
                    Write-Host "❌ ปิด: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
                    $process.Kill()
                }
            }
        }
        catch {
            # ไม่แสดง error สำหรับ process ที่ไม่มี
        }
    }
    
    # บันทึกข้อมูล
    $dataPath = "$env:TEMP\dev-closed-apps.json"
    $closedProcesses | ConvertTo-Json -Depth 3 | Out-File -FilePath $dataPath -Encoding UTF8
    
    Write-Host "`n✅ เสร็จสิ้น! ปิด $($closedProcesses.Count) processes" -ForegroundColor Green
    Write-Host "💾 บันทึกรายการแล้วที่: $dataPath" -ForegroundColor Cyan
    
    # แสดงหน่วยความจำที่ว่างขึ้น
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $freeMemory = [math]::Round($memory.FreePhysicalMemory/1MB, 2)
    Write-Host "💾 หน่วยความจำว่าง: $freeMemory GB" -ForegroundColor Magenta
}

function Restore-Apps {
    Write-Host "🔄 กำลังเปิดแอปพลิเคชันกลับคืน..." -ForegroundColor Yellow
    
    $dataPath = "$env:TEMP\dev-closed-apps.json"
    
    if (-not (Test-Path $dataPath)) {
        Write-Host "❌ ไม่พบไฟล์ข้อมูล process ที่ปิดไป" -ForegroundColor Red
        Write-Host "💡 โปรดรันการปิดแอปก่อน" -ForegroundColor Yellow
        return
    }
    
    try {
        $closedProcesses = Get-Content $dataPath | ConvertFrom-Json
        
        if (-not $closedProcesses -or $closedProcesses.Count -eq 0) {
            Write-Host "📝 ไม่มี process ที่ต้องเปิดกลับคืน" -ForegroundColor Green
            return
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
                    Start-Sleep -Milliseconds 500
                }
                else {
                    Write-Host "⚠️ ไม่พบไฟล์: $($processInfo.Name)" -ForegroundColor Yellow
                    $failed++
                }
            }
            catch {
                Write-Host "❌ ไม่สามารถเปิด: $($processInfo.Name)" -ForegroundColor Red
                $failed++
            }
        }
        
        Write-Host "`n✅ เสร็จสิ้น! เปิดสำเร็จ: $restored แอป, เปิดไม่ได้: $failed แอป" -ForegroundColor Green
        
        # ลบไฟล์ข้อมูลหลังใช้งาน
        Remove-Item $dataPath -Force -ErrorAction SilentlyContinue
        
    }
    catch {
        Write-Host "❌ เกิดข้อผิดพลาด: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Setup-AutoRestore {
    Write-Host "⚙️ ตั้งค่าการเปิดแอปอัตโนมัติเมื่อเปิดเครื่อง..." -ForegroundColor Yellow
    
    $startupFolder = [Environment]::GetFolderPath("Startup")
    $shortcutPath = "$startupFolder\DevAppsRestore.lnk"
    
    $WScriptShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-WindowStyle Hidden -ExecutionPolicy Bypass -Command `"& '$PSCommandPath' -Action restore`""
    $Shortcut.Description = "เปิดแอปพัฒนาอัตโนมัติ"
    $Shortcut.Save()
    
    Write-Host "✅ ตั้งค่าเรียบร้อย! จะเปิดแอปอัตโนมัติเมื่อรีสตาร์ท" -ForegroundColor Green
}

function Show-Menu {
    Clear-Host
    Write-Host "=============================================================" -ForegroundColor Cyan
    Write-Host "🚀 ตัวจัดการแอปพลิเคชันสำหรับการพัฒนา" -ForegroundColor Yellow
    Write-Host "=============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. 🔴 ปิดแอปที่ไม่เกี่ยวข้องกับการพัฒนา" -ForegroundColor Red
    Write-Host "2. 🔄 เปิดแอปกลับคืน" -ForegroundColor Green
    Write-Host "3. ⚙️ ตั้งค่าเปิดอัตโนมัติเมื่อรีสตาร์ท" -ForegroundColor Yellow
    Write-Host "4. 💾 ดูการใช้หน่วยความจำ" -ForegroundColor Magenta
    Write-Host "5. 🚪 ออก" -ForegroundColor Gray
    Write-Host ""
    Write-Host "=============================================================" -ForegroundColor Cyan
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

# ประมวลผลการทำงาน
switch ($Action) {
    "close" {
        Close-NonDevApps
        pause
        exit
    }
    "restore" {
        Restore-Apps
        if ($env:SESSIONNAME -eq "Console") { pause }  # pause เฉพาะเมื่อรันแบบ interactive
        exit
    }
    "setup" {
        Setup-AutoRestore
        pause
        exit
    }
    "menu" {
        do {
            Show-Menu
            $choice = Read-Host "เลือกการดำเนินการ (1-5)"
            
            switch ($choice) {
                "1" {
                    Close-NonDevApps
                    Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
                    Read-Host
                }
                "2" {
                    Restore-Apps
                    Write-Host "`nกด Enter เพื่อกลับไปเมนู..." -ForegroundColor Yellow
                    Read-Host
                }
                "3" {
                    Setup-AutoRestore
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
    }
}

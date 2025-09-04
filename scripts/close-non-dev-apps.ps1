# สคริปต์ปิดแอปที่ไม่เกี่ยวข้องกับการพัฒนาโปรเจค
# Close Non-Development Applications Script
# Created: August 27, 2025

Write-Host "🔧 กำลังปิดแอปพลิเคชันที่ไม่เกี่ยวข้องกับการพัฒนา..." -ForegroundColor Yellow
Write-Host "💡 จะไม่ปิด: VS Code, Node.js, Git, Python, Google Chrome" -ForegroundColor Green

# รายการ process ที่จะปิด (ไม่เกี่ยวข้องกับการพัฒนา)
$processesToClose = @(
    # Browser อื่นๆ (ยกเว้น Chrome)
    "msedge",
    "firefox",
    "opera",
    "brave",
    
    # Communication Apps
    "Teams",
    "Slack",
    "Discord",
    "WhatsApp",
    "Telegram Desktop",
    "Signal",
    "Zoom",
    "Skype",
    
    # Entertainment
    "Spotify",
    "vlc",
    "foobar2000",
    "iTunes",
    "MusicBee",
    "AIMP",
    
    # Gaming
    "Steam",
    "EpicGamesLauncher",
    "Battle.net",
    "Origin",
    "Uplay",
    "GOGGalaxy",
    
    # Cloud Storage (Desktop Apps)
    "OneDrive",
    "Dropbox",
    "GoogleDriveFS",
    "Box",
    "pCloud",
    
    # Streaming/Recording
    "obs64",
    "obs32",
    "OBS",
    "XSplit",
    "Streamlabs OBS",
    "Bandicam",
    "Camtasia",
    
    # Office Apps (ยกเว้น Notepad, VS Code)
    "WINWORD",
    "EXCEL",
    "POWERPNT",
    "OUTLOOK",
    "ONENOTE",
    
    # Design Apps (ที่ไม่จำเป็นสำหรับ web dev)
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Premiere Pro",
    "After Effects",
    
    # Torrent/Download Managers
    "uTorrent",
    "BitTorrent",
    "qBittorrent",
    "IDM",
    
    # Other Apps
    "Notepad++",  # อาจจะใช้ VS Code แทน
    "7zFM",       # 7-Zip File Manager
    "WinRAR",
    "TeamViewer",
    "AnyDesk",
    "calculator"
)

# เก็บรายการ process ที่ปิดไปสำหรับการเปิดกลับคืน
$closedProcesses = @()

foreach ($processName in $processesToClose) {
    try {
        $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
        if ($processes) {
            foreach ($process in $processes) {
                # เก็บข้อมูล process ที่จะปิด
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

# สร้างไฟล์เก็บรายการ process ที่ปิดไป
$closedProcessesJson = $closedProcesses | ConvertTo-Json -Depth 3
$closedProcessesJson | Out-File -FilePath "$PSScriptRoot\closed-processes.json" -Encoding UTF8

Write-Host "`n✅ เสร็จสิ้น! ปิด $($closedProcesses.Count) processes" -ForegroundColor Green
Write-Host "💾 บันทึกรายการแล้วที่: $PSScriptRoot\closed-processes.json" -ForegroundColor Cyan
Write-Host "🔄 ใช้สคริปต์ restore-apps.ps1 เพื่อเปิดกลับคืน" -ForegroundColor Yellow

# แสดงหน่วยความจำที่ว่างขึ้น
$memoryBefore = (Get-WmiObject -Class Win32_OperatingSystem).TotalVisibleMemorySize
$memoryAfter = (Get-WmiObject -Class Win32_OperatingSystem).FreePhysicalMemory
Write-Host "💾 หน่วยความจำว่าง: $([math]::Round($memoryAfter/1MB, 2)) GB" -ForegroundColor Magenta

pause

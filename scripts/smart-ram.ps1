# Smart RAM Management for Development Environment
# ตั้งค่าการใช้งาน RAM แบบฉลาด เพื่อแก้ปัญหาช้า ค้าง และ error บ่อย
# โดยไม่ลดประสิทธิภาพ GitHub Copilot
# Created: August 27, 2025

param(
    [ValidateSet("optimize", "monitor", "cleanup", "copilot-boost", "auto")]
    [string]$Action = "auto"
)

# Configuration
$COPILOT_PRIORITY_PROCESSES = @("Code", "node", "git", "python", "chrome")
$MEMORY_THRESHOLD_WARNING = 85  # เตือนเมื่อใช้ RAM เกิน 85%
$MEMORY_THRESHOLD_CRITICAL = 95 # ทำความสะอาดเมื่อใช้ RAM เกิน 95%

function Get-SystemMemoryInfo {
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $totalGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedGB = $totalGB - $freeGB
    $usagePercent = [math]::Round(($usedGB / $totalGB) * 100, 1)
    
    return @{
        Total = $totalGB
        Used = $usedGB
        Free = $freeGB
        Percentage = $usagePercent
    }
}

function Set-ProcessPriority {
    param([string]$ProcessName, [string]$Priority)
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    foreach ($proc in $processes) {
        try {
            $proc.PriorityClass = $Priority
            Write-Host "✅ Set $ProcessName priority to $Priority" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Cannot set priority for $ProcessName" -ForegroundColor Yellow
        }
    }
}

function Optimize-CopilotPerformance {
    Write-Host "🚀 Optimizing GitHub Copilot Performance..." -ForegroundColor Cyan
    
    # ตั้งค่า VS Code และ Node.js ให้มี priority สูง
    Set-ProcessPriority -ProcessName "Code" -Priority "High"
    Set-ProcessPriority -ProcessName "node" -Priority "AboveNormal"
    
    # ตั้งค่า Chrome สำหรับ testing ให้มี priority ปกติ
    Set-ProcessPriority -ProcessName "chrome" -Priority "Normal"
    
    # เพิ่ม working set size สำหรับ VS Code
    $codeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue
    foreach ($proc in $codeProcesses) {
        try {
            $proc.MinWorkingSet = 512MB  # ขั้นต่ำ 512MB
            $proc.MaxWorkingSet = 4GB    # สูงสุด 4GB
        }
        catch {
            # Ignore errors for processes without sufficient rights
        }
    }
    
    Write-Host "🎯 Copilot optimization completed!" -ForegroundColor Green
}

function Clear-NonEssentialProcesses {
    param([int]$MemoryThreshold = 90)
    
    Write-Host "🧹 Cleaning non-essential processes (Memory usage: $MemoryThreshold%+)..." -ForegroundColor Yellow
    
    # รายการ process ที่สามารถปิดได้เมื่อ RAM เต็ม
    $nonEssentialApps = @(
        "msedge", "firefox", "opera", "brave",           # Browser อื่นๆ (ยกเว้น Chrome)
        "Teams", "Slack", "Discord", "WhatsApp",         # Communication (ยกเว้นที่จำเป็น)
        "Spotify", "vlc", "iTunes", "MusicBee",          # Media Players
        "Steam", "EpicGamesLauncher", "Battle.net",      # Gaming
        "OneDrive", "Dropbox", "GoogleDriveFS",          # Cloud Storage
        "obs64", "obs32", "OBS", "Bandicam",             # Recording
        "WINWORD", "EXCEL", "POWERPNT",                  # Office (ยกเว้นถ้าไม่ได้ใช้)
        "Photoshop", "Illustrator", "InDesign",          # Design Apps
        "calculator", "notepad", "7zFM"                  # Small utilities
    )
    
    $closedProcesses = @()
    
    foreach ($appName in $nonEssentialApps) {
        $processes = Get-Process -Name $appName -ErrorAction SilentlyContinue
        if ($processes) {
            foreach ($proc in $processes) {
                $memoryMB = [math]::Round($proc.WorkingSet64 / 1MB, 1)
                if ($memoryMB -gt 50) {  # ปิดเฉพาะที่ใช้ RAM > 50MB
                    $closedProcesses += @{
                        Name = $proc.ProcessName
                        Path = $proc.Path
                        Memory = $memoryMB
                    }
                    
                    Write-Host "❌ Closed: $($proc.ProcessName) ($memoryMB MB)" -ForegroundColor Red
                    $proc.Kill()
                }
            }
        }
    }
    
    if ($closedProcesses.Count -gt 0) {
        $closedProcesses | ConvertTo-Json -Depth 3 | Out-File "$env:TEMP\smart-ram-backup.json" -Encoding UTF8
        $totalFreed = ($closedProcesses | Measure-Object -Property Memory -Sum).Sum
        Write-Host "💾 Freed approximately $totalFreed MB of RAM" -ForegroundColor Green
    }
    
    return $closedProcesses.Count
}

function Start-MemoryMonitoring {
    Write-Host "👁️ Starting Smart RAM Monitor..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
    
    $iteration = 0
    
    while ($true) {
        $memory = Get-SystemMemoryInfo
        $timestamp = Get-Date -Format "HH:mm:ss"
        
        # แสดงสถานะทุก 10 วินาที
        if ($iteration % 2 -eq 0) {
            $color = if ($memory.Percentage -gt $MEMORY_THRESHOLD_CRITICAL) { "Red" }
                    elseif ($memory.Percentage -gt $MEMORY_THRESHOLD_WARNING) { "Yellow" }
                    else { "Green" }
            
            Write-Host "[$timestamp] RAM: $($memory.Used)/$($memory.Total) GB ($($memory.Percentage)%)" -ForegroundColor $color
        }
        
        # Auto cleanup เมื่อ RAM เกินขีดจำกัด
        if ($memory.Percentage -gt $MEMORY_THRESHOLD_CRITICAL) {
            Write-Host "🚨 Critical memory usage detected! Auto-cleaning..." -ForegroundColor Red
            $cleaned = Clear-NonEssentialProcesses -MemoryThreshold $MEMORY_THRESHOLD_CRITICAL
            if ($cleaned -gt 0) {
                Write-Host "🧹 Cleaned $cleaned processes" -ForegroundColor Green
            }
        }
        
        # Optimize Copilot ทุก 30 วินาที
        if ($iteration % 6 -eq 0 -and $iteration -gt 0) {
            Optimize-CopilotPerformance
        }
        
        Start-Sleep -Seconds 5
        $iteration++
    }
}

function Show-RAMUsageByProcess {
    Write-Host "📊 Top Memory-Consuming Processes:" -ForegroundColor Cyan
    
    Get-Process | Where-Object { $_.WorkingSet64 -gt 50MB } | 
    Sort-Object WorkingSet64 -Descending | 
    Select-Object -First 15 ProcessName, 
        @{Name="Memory(MB)"; Expression={[math]::Round($_.WorkingSet64/1MB, 1)}},
        @{Name="Priority"; Expression={$_.PriorityClass}},
        Id |
    Format-Table -AutoSize
}

function Restore-BackupProcesses {
    $backupFile = "$env:TEMP\smart-ram-backup.json"
    
    if (Test-Path $backupFile) {
        Write-Host "🔄 Restoring previously closed processes..." -ForegroundColor Yellow
        
        $processes = Get-Content $backupFile | ConvertFrom-Json
        $restored = 0
        
        foreach ($proc in $processes) {
            if ($proc.Path -and (Test-Path $proc.Path)) {
                Start-Process $proc.Path
                Write-Host "▶️ Restored: $($proc.Name)" -ForegroundColor Green
                $restored++
                Start-Sleep -Milliseconds 500
            }
        }
        
        Remove-Item $backupFile
        Write-Host "✅ Restored $restored processes" -ForegroundColor Green
    } else {
        Write-Host "📝 No backup processes found" -ForegroundColor Yellow
    }
}

function Set-SmartRAMOptimization {
    Write-Host "⚙️ Applying Smart RAM Optimizations..." -ForegroundColor Cyan
    
    # 1. เพิ่มประสิทธิภาพ Virtual Memory
    Write-Host "💽 Optimizing Virtual Memory..." -ForegroundColor Yellow
    try {
        # ตั้งค่า page file ให้เหมาะสม
        $cs = Get-WmiObject -Class Win32_ComputerSystem
        $totalRAM = [math]::Round($cs.TotalPhysicalMemory / 1GB)
        $optimalPageFile = $totalRAM * 1.5  # 1.5 เท่าของ RAM
        
        Write-Host "💡 Recommended Page File Size: $optimalPageFile GB" -ForegroundColor Cyan
    }
    catch {
        Write-Host "⚠️ Cannot optimize virtual memory settings" -ForegroundColor Yellow
    }
    
    # 2. เพิ่มประสิทธิภาพ Copilot
    Optimize-CopilotPerformance
    
    # 3. ล้าง Windows Cache
    Write-Host "🧹 Clearing Windows Cache..." -ForegroundColor Yellow
    try {
        # ล้าง DNS Cache
        & ipconfig /flushdns | Out-Null
        
        # ล้าง Windows Update Cache
        Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
        Remove-Item "$env:windir\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
        Start-Service -Name wuauserv -ErrorAction SilentlyContinue
        
        Write-Host "✅ Cache cleared successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Some cache operations failed (normal)" -ForegroundColor Yellow
    }
    
    # 4. แสดงสถานะหลังการปรับปรุง
    $memory = Get-SystemMemoryInfo
    Write-Host "`n📊 Memory Status After Optimization:" -ForegroundColor Cyan
    Write-Host "   Total: $($memory.Total) GB" -ForegroundColor White
    Write-Host "   Used: $($memory.Used) GB ($($memory.Percentage)%)" -ForegroundColor $(if($memory.Percentage -gt 80){"Red"}else{"Green"})
    Write-Host "   Free: $($memory.Free) GB" -ForegroundColor Green
}

# Main execution logic
switch ($Action) {
    "optimize" {
        Set-SmartRAMOptimization
        Write-Host "`n🎯 Use 'monitor' to start continuous monitoring" -ForegroundColor Cyan
    }
    "monitor" {
        Start-MemoryMonitoring
    }
    "cleanup" {
        $memory = Get-SystemMemoryInfo
        if ($memory.Percentage -gt 80) {
            $cleaned = Clear-NonEssentialProcesses -MemoryThreshold 80
            Write-Host "🧹 Cleanup completed. Freed processes: $cleaned" -ForegroundColor Green
        } else {
            Write-Host "✅ Memory usage is acceptable ($($memory.Percentage)%)" -ForegroundColor Green
        }
        Show-RAMUsageByProcess
    }
    "copilot-boost" {
        Optimize-CopilotPerformance
        Write-Host "🚀 GitHub Copilot optimization completed!" -ForegroundColor Green
    }
    "auto" {
        Write-Host "🤖 Smart RAM Auto-Optimization Mode" -ForegroundColor Cyan
        
        $memory = Get-SystemMemoryInfo
        Write-Host "Current RAM Usage: $($memory.Percentage)%" -ForegroundColor $(if($memory.Percentage -gt 80){"Red"}else{"Green"})
        
        # Auto-optimize based on current memory usage
        if ($memory.Percentage -gt $MEMORY_THRESHOLD_CRITICAL) {
            Write-Host "🚨 Critical memory usage! Running full cleanup..." -ForegroundColor Red
            Clear-NonEssentialProcesses -MemoryThreshold 90
            Set-SmartRAMOptimization
        }
        elseif ($memory.Percentage -gt $MEMORY_THRESHOLD_WARNING) {
            Write-Host "⚠️ High memory usage! Running optimization..." -ForegroundColor Yellow
            Optimize-CopilotPerformance
            Clear-NonEssentialProcesses -MemoryThreshold 85
        }
        else {
            Write-Host "✅ Memory usage is optimal! Boosting Copilot..." -ForegroundColor Green
            Optimize-CopilotPerformance
        }
        
        Write-Host "`n📋 Available commands:" -ForegroundColor Cyan
        Write-Host "  .\smart-ram.ps1 monitor     - Start continuous monitoring" -ForegroundColor White
        Write-Host "  .\smart-ram.ps1 cleanup     - Manual cleanup" -ForegroundColor White
        Write-Host "  .\smart-ram.ps1 optimize    - Full optimization" -ForegroundColor White
        Write-Host "  .\smart-ram.ps1 copilot-boost - Boost Copilot only" -ForegroundColor White
    }
}

# Restore function (always available)
if ($args -contains "restore") {
    Restore-BackupProcesses
}

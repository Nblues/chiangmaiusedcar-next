# All-in-One Development Performance Optimizer
# รวมทุกการปรับปรุงประสิทธิภาพสำหรับการพัฒนา
# Created: August 27, 2025

param(
    [ValidateSet("full", "ram", "vscode", "node", "monitor", "restore", "status")]
    [string]$Action = "full"
)

Write-Host "🚀 Development Performance Optimizer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

function Show-SystemStatus {
    Write-Host "`n📊 Current System Status:" -ForegroundColor Cyan
    
    # Memory status
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $totalGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedGB = $totalGB - $freeGB
    $usagePercent = [math]::Round(($usedGB / $totalGB) * 100, 1)
    
    $memoryColor = if ($usagePercent -gt 90) { "Red" }
                  elseif ($usagePercent -gt 75) { "Yellow" }
                  else { "Green" }
    
    Write-Host "💾 Memory: $usedGB/$totalGB GB ($usagePercent%)" -ForegroundColor $memoryColor
    
    # Development processes status
    $devProcesses = @("Code", "node", "chrome", "git")
    foreach ($proc in $devProcesses) {
        $processes = Get-Process -Name $proc -ErrorAction SilentlyContinue
        if ($processes) {
            $memoryMB = [math]::Round(($processes | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 1)
            Write-Host "✅ $proc: $($processes.Count) processes ($memoryMB MB)" -ForegroundColor Green
        } else {
            Write-Host "❌ $proc: Not running" -ForegroundColor Red
        }
    }
    
    # Disk space (current drive)
    $drive = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
    $freeSpace = [math]::Round($drive.FreeSpace / 1GB, 1)
    $totalSpace = [math]::Round($drive.Size / 1GB, 1)
    $diskPercent = [math]::Round((($totalSpace - $freeSpace) / $totalSpace) * 100, 1)
    
    Write-Host "💽 Disk C: $freeSpace/$totalSpace GB free ($diskPercent% used)" -ForegroundColor $(if($diskPercent -gt 90){"Red"}else{"Green"})
}

function Run-FullOptimization {
    Write-Host "`n🎯 Running Full Development Optimization..." -ForegroundColor Yellow
    
    # 1. Smart RAM Management
    Write-Host "`n1️⃣ Smart RAM Optimization" -ForegroundColor Cyan
    & "$PSScriptRoot\smart-ram.ps1" -Action auto
    
    # 2. VS Code Optimization
    Write-Host "`n2️⃣ VS Code Optimization" -ForegroundColor Cyan
    & "$PSScriptRoot\vscode-optimizer.ps1" optimize
    
    # 3. Node.js Optimization
    Write-Host "`n3️⃣ Node.js Optimization" -ForegroundColor Cyan
    & "$PSScriptRoot\node-optimizer.ps1" optimize
    
    # 4. System cleanup
    Write-Host "`n4️⃣ System Cleanup" -ForegroundColor Cyan
    try {
        # ล้าง Windows temp files
        Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Cleared Windows temp files" -ForegroundColor Green
        
        # ล้าง browser cache (Chrome development tools)
        $chromeCachePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Service Worker\CacheStorage"
        if (Test-Path $chromeCachePath) {
            Remove-Item "$chromeCachePath\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Cleared Chrome dev cache" -ForegroundColor Green
        }
        
    }
    catch {
        Write-Host "⚠️ Some cleanup operations failed (normal)" -ForegroundColor Yellow
    }
    
    Write-Host "`n🎉 Full optimization completed!" -ForegroundColor Green
    Show-SystemStatus
}

function Start-PerformanceMonitoring {
    Write-Host "`n👁️ Starting Performance Monitor..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    
    & "$PSScriptRoot\smart-ram.ps1" -Action monitor
}

function Restore-BackupSettings {
    Write-Host "`n🔄 Restoring Backup Settings..." -ForegroundColor Yellow
    
    # Restore VS Code settings
    & "$PSScriptRoot\vscode-optimizer.ps1" restore
    
    # Restore closed applications
    & "$PSScriptRoot\smart-ram.ps1" restore
    
    Write-Host "✅ Restoration completed!" -ForegroundColor Green
}

function Show-PerformanceTips {
    Write-Host "`n💡 Development Performance Tips:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🧠 Memory Management:" -ForegroundColor Yellow
    Write-Host "  • Keep RAM usage below 80% for optimal performance" -ForegroundColor White
    Write-Host "  • Close unnecessary browser tabs and applications" -ForegroundColor White
    Write-Host "  • Use .\smart-ram.ps1 monitor for real-time monitoring" -ForegroundColor White
    Write-Host ""
    Write-Host "⚡ VS Code Performance:" -ForegroundColor Yellow
    Write-Host "  • Disable unnecessary extensions" -ForegroundColor White
    Write-Host "  • Use workspace-specific settings" -ForegroundColor White
    Write-Host "  • Exclude node_modules from file watching" -ForegroundColor White
    Write-Host ""
    Write-Host "📦 Node.js Performance:" -ForegroundColor Yellow
    Write-Host "  • Use latest Node.js LTS version" -ForegroundColor White
    Write-Host "  • Clear npm cache regularly: npm cache clean --force" -ForegroundColor White
    Write-Host "  • Use pnpm instead of npm for faster installs" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 GitHub Copilot Performance:" -ForegroundColor Yellow
    Write-Host "  • Ensure VS Code has high process priority" -ForegroundColor White
    Write-Host "  • Keep network connection stable" -ForegroundColor White
    Write-Host "  • Restart VS Code if Copilot becomes slow" -ForegroundColor White
}

# Main execution
switch ($Action) {
    "full" {
        Run-FullOptimization
        Show-PerformanceTips
    }
    "ram" {
        & "$PSScriptRoot\smart-ram.ps1" -Action auto
    }
    "vscode" {
        & "$PSScriptRoot\vscode-optimizer.ps1" optimize
    }
    "node" {
        & "$PSScriptRoot\node-optimizer.ps1" optimize
    }
    "monitor" {
        Start-PerformanceMonitoring
    }
    "restore" {
        Restore-BackupSettings
    }
    "status" {
        Show-SystemStatus
        Show-PerformanceTips
    }
}

Write-Host "`n📋 Available Commands:" -ForegroundColor Cyan
Write-Host "  .\dev-optimizer.ps1 full     - Complete optimization (recommended)" -ForegroundColor White
Write-Host "  .\dev-optimizer.ps1 ram      - RAM optimization only" -ForegroundColor White  
Write-Host "  .\dev-optimizer.ps1 vscode   - VS Code optimization only" -ForegroundColor White
Write-Host "  .\dev-optimizer.ps1 node     - Node.js optimization only" -ForegroundColor White
Write-Host "  .\dev-optimizer.ps1 monitor  - Start performance monitoring" -ForegroundColor White
Write-Host "  .\dev-optimizer.ps1 status   - Show current system status" -ForegroundColor White
Write-Host "  .\dev-optimizer.ps1 restore  - Restore backup settings" -ForegroundColor White

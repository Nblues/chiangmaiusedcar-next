param([string]$Action = "auto")

# Smart RAM Manager for Development
Write-Host "Smart RAM Manager for Development" -ForegroundColor Cyan

function Get-MemoryInfo {
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

function Optimize-CopilotProcesses {
    Write-Host "Optimizing GitHub Copilot Performance..." -ForegroundColor Yellow
    
    # Set VS Code to high priority
    $codeProcesses = Get-Process -Name "Code" -ErrorAction SilentlyContinue
    foreach ($proc in $codeProcesses) {
        try {
            $proc.PriorityClass = "High"
            Write-Host "Set VS Code process $($proc.Id) to High priority" -ForegroundColor Green
        }
        catch {
            Write-Host "Cannot set priority for process $($proc.Id)" -ForegroundColor Yellow
        }
    }
    
    # Set Node.js to above normal priority
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    foreach ($proc in $nodeProcesses) {
        try {
            $proc.PriorityClass = "AboveNormal"
            Write-Host "Set Node.js process $($proc.Id) to AboveNormal priority" -ForegroundColor Green
        }
        catch {
            Write-Host "Cannot set priority for process $($proc.Id)" -ForegroundColor Yellow
        }
    }
}

function Close-NonEssentialApps {
    Write-Host "Closing non-essential applications..." -ForegroundColor Yellow
    
    $appsToClose = @("msedge", "Teams", "Spotify", "Discord", "Steam", "OneDrive", "Dropbox")
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
                Write-Host "Closed: $($proc.ProcessName)" -ForegroundColor Red
            }
        }
    }
    
    if ($closedApps.Count -gt 0) {
        $closedApps | ConvertTo-Json | Out-File "$env:TEMP\smart-ram-backup.json" -Encoding UTF8
        Write-Host "Closed $($closedApps.Count) applications" -ForegroundColor Green
    }
    
    return $closedApps.Count
}

function Clear-WindowsCache {
    Write-Host "Clearing Windows cache..." -ForegroundColor Yellow
    
    try {
        # Clear DNS cache
        & ipconfig /flushdns | Out-Null
        Write-Host "DNS cache cleared" -ForegroundColor Green
        
        # Clear temp files
        $tempPath = "$env:TEMP\*"
        Remove-Item $tempPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Temp files cleared" -ForegroundColor Green
        
    }
    catch {
        Write-Host "Some cache operations failed" -ForegroundColor Yellow
    }
}

function Show-MemoryStatus {
    $memory = Get-MemoryInfo
    Write-Host ""
    Write-Host "Memory Status:" -ForegroundColor Cyan
    Write-Host "  Total: $($memory.Total) GB" -ForegroundColor White
    Write-Host "  Used: $($memory.Used) GB" -ForegroundColor White
    Write-Host "  Free: $($memory.Free) GB" -ForegroundColor White
    Write-Host "  Usage: $($memory.Percentage)%" -ForegroundColor $(if($memory.Percentage -gt 80){"Red"}else{"Green"})
}

function Restore-Applications {
    $backupFile = "$env:TEMP\smart-ram-backup.json"
    
    if (Test-Path $backupFile) {
        Write-Host "Restoring applications..." -ForegroundColor Yellow
        
        $apps = Get-Content $backupFile | ConvertFrom-Json
        $restored = 0
        
        foreach ($app in $apps) {
            if ($app.Path -and (Test-Path $app.Path)) {
                Start-Process $app.Path
                Write-Host "Restored: $($app.Name)" -ForegroundColor Green
                $restored++
                Start-Sleep -Milliseconds 500
            }
        }
        
        Remove-Item $backupFile
        Write-Host "Restored $restored applications" -ForegroundColor Green
    } else {
        Write-Host "No backup found" -ForegroundColor Yellow
    }
}

# Main execution
switch ($Action) {
    "auto" {
        $memory = Get-MemoryInfo
        Write-Host "Current RAM usage: $($memory.Percentage)%" -ForegroundColor Cyan
        
        if ($memory.Percentage -gt 85) {
            Write-Host "High memory usage detected! Running cleanup..." -ForegroundColor Red
            Close-NonEssentialApps
            Clear-WindowsCache
        }
        
        Optimize-CopilotProcesses
        Show-MemoryStatus
    }
    "cleanup" {
        Close-NonEssentialApps
        Clear-WindowsCache
        Show-MemoryStatus
    }
    "optimize" {
        Optimize-CopilotProcesses
        Show-MemoryStatus
    }
    "restore" {
        Restore-Applications
    }
    "status" {
        Show-MemoryStatus
    }
}

Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  .\smart-ram-simple.ps1 auto     - Auto optimization" -ForegroundColor White
Write-Host "  .\smart-ram-simple.ps1 cleanup  - Force cleanup" -ForegroundColor White
Write-Host "  .\smart-ram-simple.ps1 optimize - Optimize Copilot only" -ForegroundColor White
Write-Host "  .\smart-ram-simple.ps1 restore  - Restore closed apps" -ForegroundColor White
Write-Host "  .\smart-ram-simple.ps1 status   - Show memory status" -ForegroundColor White

param([string]$Action = "all")

# Complete Development Performance Optimizer
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Development Performance Optimizer v1.0" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan

function Get-CurrentStatus {
    Write-Host ""
    Write-Host "Current System Status:" -ForegroundColor Cyan
    
    # Memory status
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $totalGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedGB = $totalGB - $freeGB
    $usagePercent = [math]::Round(($usedGB / $totalGB) * 100, 1)
    
    $memColor = if ($usagePercent -gt 85) { "Red" } elseif ($usagePercent -gt 75) { "Yellow" } else { "Green" }
    Write-Host "Memory: $usedGB/$totalGB GB ($usagePercent%)" -ForegroundColor $memColor
    
    # Check development processes
    $devApps = @{
        "VS Code" = "Code"
        "Node.js" = "node" 
        "Chrome" = "chrome"
    }
    
    foreach ($app in $devApps.GetEnumerator()) {
        $processes = Get-Process -Name $app.Value -ErrorAction SilentlyContinue
        if ($processes) {
            $memMB = [math]::Round(($processes | Measure-Object WorkingSet64 -Sum).Sum / 1MB, 1)
            Write-Host "$($app.Key): $($processes.Count) processes ($memMB MB)" -ForegroundColor Green
        } else {
            Write-Host "$($app.Key): Not running" -ForegroundColor Yellow
        }
    }
}

function Start-FullOptimization {
    Write-Host ""
    Write-Host "Starting Full Optimization..." -ForegroundColor Yellow
    Write-Host ""
    
    # 1. RAM Optimization
    Write-Host "1. RAM Optimization" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Gray
    & "$PSScriptRoot\smart-ram-simple.ps1" auto
    
    Write-Host ""
    
    # 2. VS Code Optimization
    Write-Host "2. VS Code Optimization" -ForegroundColor Cyan
    Write-Host "-----------------------" -ForegroundColor Gray
    & "$PSScriptRoot\vscode-simple.ps1" optimize
    
    Write-Host ""
    
    # 3. Node.js Optimization
    Write-Host "3. Node.js Optimization" -ForegroundColor Cyan
    Write-Host "-----------------------" -ForegroundColor Gray
    & "$PSScriptRoot\node-simple.ps1" optimize
    
    Write-Host ""
    Write-Host "Full optimization completed!" -ForegroundColor Green
}

function Show-PerformanceTips {
    Write-Host ""
    Write-Host "Performance Tips for Development:" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Memory Management:" -ForegroundColor Yellow
    Write-Host "- Keep RAM usage below 80%" -ForegroundColor White
    Write-Host "- Close unnecessary applications" -ForegroundColor White
    Write-Host "- Use RAM monitoring regularly" -ForegroundColor White
    Write-Host ""
    Write-Host "VS Code Performance:" -ForegroundColor Yellow
    Write-Host "- Disable unused extensions" -ForegroundColor White
    Write-Host "- Exclude node_modules from file watching" -ForegroundColor White
    Write-Host "- Use workspace-specific settings" -ForegroundColor White
    Write-Host ""
    Write-Host "Node.js Performance:" -ForegroundColor Yellow
    Write-Host "- Use latest LTS version" -ForegroundColor White
    Write-Host "- Clear cache regularly" -ForegroundColor White
    Write-Host "- Optimize memory settings" -ForegroundColor White
    Write-Host ""
    Write-Host "GitHub Copilot Performance:" -ForegroundColor Yellow
    Write-Host "- Keep VS Code at high priority" -ForegroundColor White
    Write-Host "- Ensure stable network connection" -ForegroundColor White
    Write-Host "- Restart VS Code if Copilot becomes slow" -ForegroundColor White
}

switch ($Action) {
    "all" {
        Get-CurrentStatus
        Start-FullOptimization
        Get-CurrentStatus
        Show-PerformanceTips
    }
    "ram" {
        & "$PSScriptRoot\smart-ram-simple.ps1" auto
    }
    "vscode" {
        & "$PSScriptRoot\vscode-simple.ps1" optimize  
    }
    "node" {
        & "$PSScriptRoot\node-simple.ps1" optimize
    }
    "status" {
        Get-CurrentStatus
    }
    "tips" {
        Show-PerformanceTips
    }
    "monitor" {
        Write-Host "Starting performance monitoring..." -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
        Write-Host ""
        
        while ($true) {
            Clear-Host
            Write-Host "Performance Monitor - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
            Write-Host "======================================" -ForegroundColor Gray
            Get-CurrentStatus
            Start-Sleep -Seconds 10
        }
    }
    default {
        Write-Host ""
        Write-Host "Available Commands:" -ForegroundColor Cyan
        Write-Host "  .\dev-performance.ps1 all     - Complete optimization (recommended)" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 ram     - RAM optimization only" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 vscode  - VS Code optimization only" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 node    - Node.js optimization only" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 status  - Show current status" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 monitor - Start performance monitoring" -ForegroundColor White
        Write-Host "  .\dev-performance.ps1 tips    - Show performance tips" -ForegroundColor White
        Write-Host ""
    }
}

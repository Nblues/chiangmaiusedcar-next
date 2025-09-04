# Node.js & NPM Performance Optimizer
# ปรับปรุงประสิทธิภาพ Node.js และ NPM สำหรับการพัฒนา
# Created: August 27, 2025

param([string]$Action = "optimize")

function Optimize-NodeJSPerformance {
    Write-Host "⚡ Optimizing Node.js Performance..." -ForegroundColor Cyan
    
    # ตั้งค่า Node.js environment variables สำหรับประสิทธิภาพ
    $nodeOptimizations = @{
        "NODE_OPTIONS" = "--max-old-space-size=8192 --optimize-for-size"
        "NODE_ENV" = "development"
        "UV_THREADPOOL_SIZE" = "128"
        "NODE_MAX_PARALLEL" = "8"
    }
    
    foreach ($env in $nodeOptimizations.GetEnumerator()) {
        [Environment]::SetEnvironmentVariable($env.Key, $env.Value, "User")
        Write-Host "✅ Set $($env.Key) = $($env.Value)" -ForegroundColor Green
    }
    
    Write-Host "🔄 Please restart your terminal for changes to take effect" -ForegroundColor Yellow
}

function Optimize-NPMConfiguration {
    Write-Host "📦 Optimizing NPM Configuration..." -ForegroundColor Cyan
    
    # ตั้งค่า NPM สำหรับประสิทธิภาพ
    $npmCommands = @(
        "npm config set registry https://registry.npmjs.org/",
        "npm config set cache-min 86400",
        "npm config set prefer-online true", 
        "npm config set audit false",
        "npm config set fund false",
        "npm config set maxsockets 50",
        "npm config set network-timeout 300000"
    )
    
    foreach ($cmd in $npmCommands) {
        try {
            Write-Host "⚙️ $cmd" -ForegroundColor Yellow
            Invoke-Expression $cmd
        }
        catch {
            Write-Host "⚠️ Failed: $cmd" -ForegroundColor Red
        }
    }
    
    Write-Host "✅ NPM configuration optimized!" -ForegroundColor Green
}

function Clear-NodeCaches {
    Write-Host "🧹 Clearing Node.js & NPM Caches..." -ForegroundColor Yellow
    
    try {
        # ล้าง NPM cache
        & npm cache clean --force
        Write-Host "✅ NPM cache cleared" -ForegroundColor Green
        
        # ล้าง Node modules cache (หากมี)
        $nodeModulesPaths = @(
            ".\node_modules\.cache",
            "$env:APPDATA\npm-cache",
            "$env:LOCALAPPDATA\npm-cache"
        )
        
        foreach ($path in $nodeModulesPaths) {
            if (Test-Path $path) {
                Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "✅ Cleared cache: $path" -ForegroundColor Green
            }
        }
        
    }
    catch {
        Write-Host "⚠️ Some cache operations failed" -ForegroundColor Yellow
    }
}

function Show-NodePerformanceInfo {
    Write-Host "`n📊 Node.js Performance Information:" -ForegroundColor Cyan
    
    try {
        # Node.js version
        $nodeVersion = & node --version
        Write-Host "Node.js Version: $nodeVersion" -ForegroundColor White
        
        # NPM version
        $npmVersion = & npm --version
        Write-Host "NPM Version: $npmVersion" -ForegroundColor White
        
        # Memory usage
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $totalMemory = ($nodeProcesses | Measure-Object -Property WorkingSet64 -Sum).Sum / 1MB
            Write-Host "Node.js Memory Usage: $([math]::Round($totalMemory, 1)) MB" -ForegroundColor White
        }
        
        # Environment variables
        Write-Host "`nCurrent Environment Variables:" -ForegroundColor Cyan
        $envVars = @("NODE_OPTIONS", "NODE_ENV", "UV_THREADPOOL_SIZE")
        foreach ($var in $envVars) {
            $value = [Environment]::GetEnvironmentVariable($var, "User")
            if ($value) {
                Write-Host "$var = $value" -ForegroundColor Green
            } else {
                Write-Host "$var = (not set)" -ForegroundColor Yellow
            }
        }
        
    }
    catch {
        Write-Host "❌ Cannot retrieve Node.js information" -ForegroundColor Red
    }
}

function Set-ProjectOptimizations {
    Write-Host "🎯 Setting up project-specific optimizations..." -ForegroundColor Cyan
    
    # สร้าง .nvmrc สำหรับ Node version
    if (-not (Test-Path ".nvmrc")) {
        try {
            $nodeVersion = & node --version
            $nodeVersion | Out-File ".nvmrc" -Encoding UTF8
            Write-Host "✅ Created .nvmrc with Node $nodeVersion" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Cannot create .nvmrc" -ForegroundColor Yellow
        }
    }
    
    # สร้าง .npmrc สำหรับ project
    $npmrcContent = @"
audit=false
fund=false
loglevel=warn
progress=false
cache-min=86400
prefer-online=true
maxsockets=50
"@
    
    if (-not (Test-Path ".npmrc")) {
        $npmrcContent | Out-File ".npmrc" -Encoding UTF8
        Write-Host "✅ Created optimized .npmrc" -ForegroundColor Green
    }
    
    # ตรวจสอบ package.json scripts
    if (Test-Path "package.json") {
        try {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            if ($packageJson.scripts) {
                Write-Host "📋 Available NPM scripts:" -ForegroundColor Cyan
                $packageJson.scripts.PSObject.Properties | ForEach-Object {
                    Write-Host "  npm run $($_.Name)" -ForegroundColor White
                }
            }
        }
        catch {
            Write-Host "⚠️ Cannot read package.json" -ForegroundColor Yellow
        }
    }
}

switch ($Action) {
    "optimize" {
        Optimize-NodeJSPerformance
        Optimize-NPMConfiguration
        Set-ProjectOptimizations
        Write-Host "`n🎉 Node.js optimization completed!" -ForegroundColor Green
        Write-Host "💡 Run 'info' to see current configuration" -ForegroundColor Cyan
    }
    "cache-clear" {
        Clear-NodeCaches
    }
    "info" {
        Show-NodePerformanceInfo
    }
    "project" {
        Set-ProjectOptimizations
    }
    default {
        Write-Host "Usage: .\node-optimizer.ps1 [optimize|cache-clear|info|project]" -ForegroundColor Yellow
        Write-Host "  optimize    - Full Node.js & NPM optimization" -ForegroundColor White
        Write-Host "  cache-clear - Clear all Node.js & NPM caches" -ForegroundColor White
        Write-Host "  info        - Show current Node.js performance info" -ForegroundColor White
        Write-Host "  project     - Setup project-specific optimizations" -ForegroundColor White
    }
}

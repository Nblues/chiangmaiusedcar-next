param([string]$Action = "optimize")

# Node.js Performance Optimizer
Write-Host "Node.js Performance Optimizer" -ForegroundColor Cyan

function Optimize-NodeEnvironment {
    Write-Host "Optimizing Node.js environment..." -ForegroundColor Yellow
    
    # Set Node.js environment variables
    $nodeEnvVars = @{
        "NODE_OPTIONS" = "--max-old-space-size=8192"
        "NODE_ENV" = "development"
        "UV_THREADPOOL_SIZE" = "128"
    }
    
    foreach ($env in $nodeEnvVars.GetEnumerator()) {
        [Environment]::SetEnvironmentVariable($env.Key, $env.Value, "User")
        Write-Host "Set $($env.Key) = $($env.Value)" -ForegroundColor Green
    }
    
    Write-Host "Restart your terminal for changes to take effect" -ForegroundColor Yellow
}

function Optimize-NPMConfig {
    Write-Host "Optimizing NPM configuration..." -ForegroundColor Yellow
    
    $npmConfigs = @(
        "npm config set audit false",
        "npm config set fund false", 
        "npm config set prefer-online true",
        "npm config set maxsockets 50",
        "npm config set network-timeout 300000"
    )
    
    foreach ($config in $npmConfigs) {
        try {
            Write-Host "Running: $config" -ForegroundColor Gray
            Invoke-Expression $config
        }
        catch {
            Write-Host "Failed: $config" -ForegroundColor Red
        }
    }
    
    Write-Host "NPM configuration optimized!" -ForegroundColor Green
}

function Clear-Caches {
    Write-Host "Clearing Node.js and NPM caches..." -ForegroundColor Yellow
    
    try {
        # Clear NPM cache
        & npm cache clean --force
        Write-Host "NPM cache cleared" -ForegroundColor Green
        
        # Clear common cache directories
        $cachePaths = @(
            "$env:APPDATA\npm-cache",
            "$env:LOCALAPPDATA\npm-cache",
            ".\node_modules\.cache"
        )
        
        foreach ($path in $cachePaths) {
            if (Test-Path $path) {
                Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "Cleared: $path" -ForegroundColor Green
            }
        }
        
    }
    catch {
        Write-Host "Some cache operations failed" -ForegroundColor Yellow
    }
}

function Show-NodeInfo {
    Write-Host ""
    Write-Host "Node.js Information:" -ForegroundColor Cyan
    
    try {
        # Node and NPM versions
        $nodeVersion = & node --version
        $npmVersion = & npm --version
        Write-Host "Node.js: $nodeVersion" -ForegroundColor White
        Write-Host "NPM: $npmVersion" -ForegroundColor White
        
        # Memory usage of Node processes
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $totalMemory = ($nodeProcesses | Measure-Object WorkingSet64 -Sum).Sum / 1MB
            Write-Host "Node.js Memory Usage: $([math]::Round($totalMemory, 1)) MB" -ForegroundColor White
        }
        
        # Environment variables
        Write-Host ""
        Write-Host "Environment Variables:" -ForegroundColor Cyan
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
        Write-Host "Cannot retrieve Node.js information" -ForegroundColor Red
    }
}

function Setup-ProjectConfig {
    Write-Host "Setting up project optimizations..." -ForegroundColor Yellow
    
    # Create .nvmrc if not exists
    if (-not (Test-Path ".nvmrc")) {
        try {
            $nodeVersion = & node --version
            $nodeVersion | Out-File ".nvmrc" -Encoding UTF8
            Write-Host "Created .nvmrc with Node $nodeVersion" -ForegroundColor Green
        }
        catch {
            Write-Host "Cannot create .nvmrc" -ForegroundColor Yellow
        }
    }
    
    # Create optimized .npmrc
    $npmrcContent = @"
audit=false
fund=false
loglevel=warn
progress=false
prefer-online=true
maxsockets=50
"@
    
    if (-not (Test-Path ".npmrc")) {
        $npmrcContent | Out-File ".npmrc" -Encoding UTF8
        Write-Host "Created optimized .npmrc" -ForegroundColor Green
    }
    
    # Show package.json scripts if available
    if (Test-Path "package.json") {
        try {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            if ($packageJson.scripts) {
                Write-Host ""
                Write-Host "Available NPM scripts:" -ForegroundColor Cyan
                $packageJson.scripts.PSObject.Properties | ForEach-Object {
                    Write-Host "  npm run $($_.Name)" -ForegroundColor White
                }
            }
        }
        catch {
            Write-Host "Cannot read package.json" -ForegroundColor Yellow
        }
    }
}

switch ($Action) {
    "optimize" {
        Optimize-NodeEnvironment
        Optimize-NPMConfig
        Setup-ProjectConfig
        Write-Host ""
        Write-Host "Node.js optimization completed!" -ForegroundColor Green
    }
    "cache" {
        Clear-Caches
    }
    "info" {
        Show-NodeInfo
    }
    "project" {
        Setup-ProjectConfig
    }
    default {
        Write-Host "Usage: .\node-simple.ps1 [optimize|cache|info|project]" -ForegroundColor Yellow
        Write-Host "  optimize - Full Node.js and NPM optimization" -ForegroundColor White
        Write-Host "  cache    - Clear all caches" -ForegroundColor White  
        Write-Host "  info     - Show Node.js information" -ForegroundColor White
        Write-Host "  project  - Setup project-specific configs" -ForegroundColor White
    }
}

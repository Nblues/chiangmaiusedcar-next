# PowerShell script to optimize Windows for Next.js development
# Run as Administrator for best results

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Next.js Dev Environment Optimizer" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# 1. Kill existing Node processes
Write-Host "1. Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# 2. Clear npm/pnpm cache
Write-Host "2. Clearing package manager caches..." -ForegroundColor Yellow
pnpm store prune 2>$null
npm cache clean --force 2>$null

# 3. Clean Next.js build artifacts
Write-Host "3. Cleaning Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "out") {
    Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue
}

# 4. Check memory usage
Write-Host "4. Checking system memory..." -ForegroundColor Yellow
$computerSystem = Get-CimInstance -ClassName Win32_ComputerSystem
$totalRAM = [math]::Round($computerSystem.TotalPhysicalMemory / 1GB, 2)
$os = Get-CimInstance -ClassName Win32_OperatingSystem
$freeRAM = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
$usedRAM = [math]::Round(($totalRAM * 1024 - $freeRAM) / 1024, 2)

Write-Host "   Total RAM: $totalRAM GB" -ForegroundColor Cyan
Write-Host "   Used RAM: $usedRAM GB" -ForegroundColor Yellow
Write-Host "   Free RAM: $([math]::Round($freeRAM / 1024, 2)) GB" -ForegroundColor Green

if ($freeRAM -lt 4096) {
    Write-Host "   WARNING: Less than 4GB free memory!" -ForegroundColor Red
    Write-Host "   Consider closing other applications." -ForegroundColor Red
}

# 5. Set environment variables for this session
Write-Host "5. Setting environment variables..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=10240"
$env:UV_THREADPOOL_SIZE = "8"

# 6. Display Node.js info
Write-Host "6. Node.js information:" -ForegroundColor Yellow
$nodeVersion = node --version
$pnpmVersion = pnpm --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Cyan
Write-Host "   pnpm: $pnpmVersion" -ForegroundColor Cyan

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "Optimization Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting dev server with 10GB memory allocation..." -ForegroundColor Cyan
Write-Host ""

# 7. Start dev server
Start-Sleep -Seconds 2
pnpm dev

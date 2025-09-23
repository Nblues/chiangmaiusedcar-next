# Fix WebSocket HMR - Windows PowerShell Script
# เครื่องมือแก้ไขปัญหา WebSocket HMR สำหรับ Next.js

param(
    [switch]$Reset,
    [switch]$Production,
    [switch]$Development,
    [switch]$Help
)

# สีสำหรับ PowerShell output
function Write-ColoredText {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

function Write-Info { param([string]$Text) Write-ColoredText "🔍 $Text" "Cyan" }
function Write-Success { param([string]$Text) Write-ColoredText "✅ $Text" "Green" }
function Write-Warning { param([string]$Text) Write-ColoredText "⚠️ $Text" "Yellow" }
function Write-Error { param([string]$Text) Write-ColoredText "❌ $Text" "Red" }

function Show-Help {
    Write-ColoredText "`n=== WebSocket HMR Fix Tool - ครูหนึ่งรถสวย ===" "Magenta"
    Write-Host ""
    Write-Host "Usage: .\fix-hmr.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Reset        รีเซ็ต .next directory และติดตั้ง dependencies ใหม่"
    Write-Host "  -Production   ตั้งค่าสำหรับ production (ปิด HMR logs)"
    Write-Host "  -Development  ตั้งค่าสำหรับ development (เปิด HMR)"
    Write-Host "  -Help         แสดงข้อมูลนี้"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\fix-hmr.ps1 -Reset           # รีเซ็ตและเริ่มใหม่"
    Write-Host "  .\fix-hmr.ps1 -Development     # ตั้งค่า dev mode"
    Write-Host "  .\fix-hmr.ps1 -Production      # ตั้งค่า prod mode"
    exit 0
}

function Test-CommandExists {
    param([string]$Command)
    return (Get-Command $Command -ErrorAction SilentlyContinue) -ne $null
}

function Get-PackageManager {
    if (Test-CommandExists "pnpm") {
        return "pnpm"
    } elseif (Test-CommandExists "yarn") {
        return "yarn"
    } elseif (Test-CommandExists "npm") {
        return "npm"
    } else {
        Write-Error "ไม่พบ package manager (npm, yarn, หรือ pnpm)"
        exit 1
    }
}

function Remove-NextDirectory {
    $nextDir = ".\.next"
    if (Test-Path $nextDir) {
        Write-Info "กำลังลบ .next directory..."
        Remove-Item $nextDir -Recurse -Force
        Write-Success "ลบ .next directory สำเร็จ"
    } else {
        Write-Warning ".next directory ไม่พบ"
    }
}

function Clear-PackageCache {
    $packageManager = Get-PackageManager
    Write-Info "กำลังล้าง cache ของ $packageManager..."
    
    try {
        switch ($packageManager) {
            "pnpm" { 
                & pnpm store prune 2>$null
                Write-Success "ล้าง pnpm cache สำเร็จ"
            }
            "yarn" { 
                & yarn cache clean 2>$null
                Write-Success "ล้าง yarn cache สำเร็จ"
            }
            "npm" { 
                & npm cache clean --force 2>$null
                Write-Success "ล้าง npm cache สำเร็จ"
            }
        }
    } catch {
        Write-Warning "ไม่สามารถล้าง cache ได้ แต่จะดำเนินการต่อ"
    }
}

function Install-Dependencies {
    $packageManager = Get-PackageManager
    Write-Info "กำลังติดตั้ง dependencies ด้วย $packageManager..."
    
    try {
        switch ($packageManager) {
            "pnpm" { & pnpm install }
            "yarn" { & yarn install }
            "npm" { & npm install }
        }
        Write-Success "ติดตั้ง dependencies สำเร็จ"
    } catch {
        Write-Error "ติดตั้ง dependencies ไม่สำเร็จ: $($_.Exception.Message)"
        exit 1
    }
}

function Set-ProductionConfig {
    Write-Info "ตั้งค่าสำหรับ Production mode..."
    
    # สร้าง .env.local สำหรับ production
    $envContent = @"

# HMR Production Configuration
NEXT_TELEMETRY_DISABLED=1
DISABLE_HMR_LOGS=true
FAST_REFRESH=false
NODE_ENV=production
"@

    $envFile = ".\.env.local"
    if (Test-Path $envFile) {
        $existingContent = Get-Content $envFile -Raw
        if (-not $existingContent.Contains("DISABLE_HMR_LOGS")) {
            Add-Content $envFile $envContent
        }
    } else {
        Set-Content $envFile $envContent
    }
    
    Write-Success "ตั้งค่า Production configuration สำเร็จ"
    Write-Info "HMR logs ถูกปิดในโหมด production"
}

function Set-DevelopmentConfig {
    Write-Info "ตั้งค่าสำหรับ Development mode..."
    
    # ลบการตั้งค่า production ออกจาก .env.local
    $envFile = ".\.env.local"
    if (Test-Path $envFile) {
        $content = Get-Content $envFile | Where-Object { 
            $_ -notmatch "DISABLE_HMR_LOGS|FAST_REFRESH=false|NODE_ENV=production" 
        }
        Set-Content $envFile $content
    }
    
    Write-Success "ตั้งค่า Development configuration สำเร็จ"
    Write-Info "HMR เปิดใช้งานในโหมด development"
}

function Start-DevServer {
    $packageManager = Get-PackageManager
    Write-Info "เริ่มต้น development server..."
    
    try {
        switch ($packageManager) {
            "pnpm" { 
                Write-Success "🚀 กำลังเริ่ม dev server ด้วย pnpm..."
                & pnpm dev 
            }
            "yarn" { 
                Write-Success "🚀 กำลังเริ่ม dev server ด้วย yarn..."
                & yarn dev 
            }
            "npm" { 
                Write-Success "🚀 กำลังเริ่ม dev server ด้วย npm..."
                & npm run dev 
            }
        }
    } catch {
        Write-Error "ไม่สามารถเริ่ม dev server ได้: $($_.Exception.Message)"
        Write-Info "กรุณารันคำสั่งด้วยตนเอง: $packageManager dev"
    }
}

function Create-HMRConfig {
    $configContent = @"
{
  "development": {
    "webpackHMR": true,
    "refreshOnUpdate": true,
    "websocketUrl": "ws://localhost:3000/_next/webpack-hmr",
    "retryAttempts": 3,
    "retryDelay": 1000
  },
  "production": {
    "webpackHMR": false,
    "refreshOnUpdate": false,
    "websocketUrl": null,
    "disableLogs": true
  }
}
"@

    Set-Content "hmr.config.json" $configContent
    Write-Success "สร้าง HMR configuration file สำเร็จ"
}

# Main execution
Write-ColoredText "`n🔧 WebSocket HMR Fix Tool - ครูหนึ่งรถสวย" "Magenta"
Write-Info "Project directory: $(Get-Location)"

if ($Help) {
    Show-Help
}

# ตรวจสอบว่าอยู่ใน Next.js project หรือไม่
if (-not (Test-Path "next.config.js")) {
    Write-Error "ไม่พบ next.config.js - กรุณาเรียกใช้ในโฟลเดอร์ Next.js project"
    exit 1
}

# สร้าง HMR config file
Create-HMRConfig

if ($Reset) {
    Write-Info "🔄 กำลังรีเซ็ต Next.js development environment..."
    Remove-NextDirectory
    Clear-PackageCache
    Install-Dependencies
    Set-DevelopmentConfig
    Write-Success "🎉 รีเซ็ตเสร็จสิ้น!"
    
    $response = Read-Host "ต้องการเริ่ม dev server หรือไม่? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Start-DevServer
    }
} elseif ($Production) {
    Write-Info "📦 ตั้งค่าสำหรับ Production mode..."
    Set-ProductionConfig
    Write-Success "✅ Production configuration เสร็จสิ้น"
} elseif ($Development) {
    Write-Info "🛠️ ตั้งค่าสำหรับ Development mode..."
    Set-DevelopmentConfig
    Write-Success "✅ Development configuration เสร็จสิ้น"
    
    $response = Read-Host "ต้องการเริ่ม dev server หรือไม่? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Start-DevServer
    }
} else {
    # Default: ตรวจสอบ NODE_ENV และรันตามสภาพแวดล้อม
    $nodeEnv = $env:NODE_ENV
    
    if ($nodeEnv -eq "production") {
        Write-Info "ตรวจพบ Production environment"
        Set-ProductionConfig
    } else {
        Write-Info "ตรวจพบ Development environment (หรือไม่ได้กำหนด)"
        Set-DevelopmentConfig
        
        $response = Read-Host "ต้องการรีเซ็ตและเริ่ม dev server หรือไม่? (y/N)"
        if ($response -eq "y" -or $response -eq "Y") {
            Remove-NextDirectory
            Clear-PackageCache
            Install-Dependencies
            Start-DevServer
        }
    }
}

Write-ColoredText "`n🎉 WebSocket HMR Fix เสร็จสิ้น!" "Green"
Write-Info "หากยังมีปัญหา HMR กรุณาตรวจสอบ:"
Write-Host "  1. Firewall ที่พอร์ต 3000"
Write-Host "  2. Proxy configuration สำหรับ /_next/webpack-hmr"
Write-Host "  3. WebSocket support ใน reverse proxy"
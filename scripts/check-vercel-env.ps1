# Check Vercel Environment Variables
# Usage: powershell -ExecutionPolicy Bypass -File scripts\check-vercel-env.ps1

$ErrorActionPreference = 'Continue'

$REQUIRED_VARS = @('ADMIN_USERNAME', 'ADMIN_PASSWORD', 'SESSION_SECRET')

Write-Host "`n🔍 Checking Vercel Environment Variables...`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = $false
try {
    $null = vercel --version 2>&1
    $vercelInstalled = $true
}
catch {
    $vercelInstalled = $false
}

if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI not installed" -ForegroundColor Yellow
    Write-Host "   Install: npm i -g vercel or pnpm add -g vercel`n" -ForegroundColor Yellow
    
    Write-Host "📖 Manual check instead:" -ForegroundColor Cyan
    Write-Host "   1. Go to https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "   2. Select your project" -ForegroundColor Cyan
    Write-Host "   3. Settings → Environment Variables" -ForegroundColor Cyan
    Write-Host "   4. Check if these exist:`n" -ForegroundColor Cyan
    
    foreach ($var in $REQUIRED_VARS) {
        Write-Host "      • $var" -ForegroundColor Cyan
    }
    
    Write-Host "`n   If missing, follow: VERCEL_ENV_QUICK_SETUP.md`n" -ForegroundColor Yellow
    exit 0
}

# Get environment variables from Vercel
Write-Host "Fetching environment variables from Vercel...`n" -ForegroundColor Cyan

try {
    $envOutput = vercel env ls 2>&1 | Out-String
    
    # Check each required variable
    $results = @{}
    $allPresent = $true
    
    Write-Host "📊 Results:`n" -ForegroundColor Cyan
    
    foreach ($var in $REQUIRED_VARS) {
        $found = $envOutput -match $var
        $results[$var] = $found
        
        if ($found) {
            Write-Host "   ✅ $var - Found" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ $var - Missing" -ForegroundColor Red
            $allPresent = $false
        }
    }
    
    Write-Host ""
    
    if ($allPresent) {
        Write-Host "✅ All required environment variables are set!`n" -ForegroundColor Green
        Write-Host "🚀 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Make sure the values are correct" -ForegroundColor Cyan
        Write-Host "   2. Redeploy if you just added them" -ForegroundColor Cyan
        Write-Host "   3. Test login at https://www.chiangmaiusedcar.com/admin/login`n" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ Missing required environment variables!`n" -ForegroundColor Red
        Write-Host "📖 Follow the setup guide:" -ForegroundColor Yellow
        Write-Host "   • Quick: VERCEL_ENV_QUICK_SETUP.md" -ForegroundColor Yellow
        Write-Host "   • Detailed: VERCEL_ENV_VARIABLES_REQUIRED.md`n" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "`n❌ Error: $($_.Exception.Message)`n" -ForegroundColor Red
    Write-Host "💡 Try running: vercel login" -ForegroundColor Yellow
    Write-Host "   Then link your project: vercel link`n" -ForegroundColor Yellow
}

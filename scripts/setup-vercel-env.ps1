# Automated Vercel Environment Variables Setup
# Usage: powershell -ExecutionPolicy Bypass -File scripts\setup-vercel-env.ps1

$ErrorActionPreference = 'Stop'

Write-Host "`n🚀 Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI found: $vercelVersion`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "`nInstalling Vercel CLI...`n" -ForegroundColor Yellow
    pnpm add -g vercel
    Write-Host "✅ Vercel CLI installed`n" -ForegroundColor Green
}

# Check if user is logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
$loginCheck = vercel whoami 2>&1 | Out-String
if ($loginCheck -match "Error") {
    Write-Host "❌ Not logged in to Vercel`n" -ForegroundColor Red
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
    Write-Host "`n✅ Logged in successfully`n" -ForegroundColor Green
}
else {
    Write-Host "✅ Already logged in to Vercel`n" -ForegroundColor Green
}

# Link project
Write-Host "Linking to Vercel project..." -ForegroundColor Yellow
vercel link --yes 2>&1 | Out-Null
Write-Host "✅ Project linked`n" -ForegroundColor Green

# Environment variables to add
$envVars = @(
    @{
        name = "ADMIN_USERNAME"
        value = "kngoodcar"
    },
    @{
        name = "ADMIN_PASSWORD"
        value = "Kn-goodcar**5277"
    },
    @{
        name = "SESSION_SECRET"
        value = "f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33"
    }
)

Write-Host "Adding environment variables to Vercel...`n" -ForegroundColor Cyan

foreach ($env in $envVars) {
    Write-Host "📝 Adding $($env.name)..." -ForegroundColor Yellow
    
    # Add to Production
    try {
        $envInput = "$($env.value)`nproduction`n"
        $envInput | vercel env add $env.name production 2>&1 | Out-Null
        Write-Host "   ✅ Production" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Production (may already exist)" -ForegroundColor Yellow
    }
    
    # Add to Preview
    try {
        $envInput = "$($env.value)`npreview`n"
        $envInput | vercel env add $env.name preview 2>&1 | Out-Null
        Write-Host "   ✅ Preview" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Preview (may already exist)" -ForegroundColor Yellow
    }
    
    # Add to Development
    try {
        $envInput = "$($env.value)`ndevelopment`n"
        $envInput | vercel env add $env.name development 2>&1 | Out-Null
        Write-Host "   ✅ Development" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Development (may already exist)" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "✅ All environment variables added!`n" -ForegroundColor Green

# Verify
Write-Host "Verifying environment variables..." -ForegroundColor Yellow
$envList = vercel env ls 2>&1 | Out-String

$allFound = $true
foreach ($env in $envVars) {
    if ($envList -match $env.name) {
        Write-Host "   ✅ $($env.name)" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ $($env.name) - NOT FOUND" -ForegroundColor Red
        $allFound = $false
    }
}

Write-Host ""

if ($allFound) {
    Write-Host "🎉 Setup Complete!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Redeploy production: vercel --prod" -ForegroundColor White
    Write-Host "2. Wait 2-3 minutes for deployment" -ForegroundColor White
    Write-Host "3. Test login at: https://www.chiangmaiusedcar.com/admin/login" -ForegroundColor White
    Write-Host "`nCredentials:" -ForegroundColor Cyan
    Write-Host "   Username: kngoodcar" -ForegroundColor White
    Write-Host "   Password: Kn-goodcar**5277`n" -ForegroundColor White
}
else {
    Write-Host "⚠️  Some variables may not have been added." -ForegroundColor Yellow
    Write-Host "Please check manually at: https://vercel.com/dashboard`n" -ForegroundColor Yellow
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

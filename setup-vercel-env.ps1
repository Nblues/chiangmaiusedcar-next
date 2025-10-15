# Script to setup Vercel Environment Variables
# Run this script with: .\setup-vercel-env.ps1

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "📝 Adding Environment Variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Admin Authentication
vercel env add ADMIN_USERNAME production
# Enter: kngoodcar

vercel env add ADMIN_PASSWORD production
# Enter: Kn-goodcar**5277

vercel env add SESSION_SECRET production
# Enter: KrooNeung_ChiangMai_UsedCar_Development_Session_Secret_2025_Secure_Random_Key

Write-Host ""
Write-Host "✅ Environment variables added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Now deploying to apply changes..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✨ Done! Your admin login should now work." -ForegroundColor Green

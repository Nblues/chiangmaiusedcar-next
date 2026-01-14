# Fix Vercel Environment Variables - Remove \r\n Issue
# Problem: Environment variables have \r\n at the end causing login failure

Write-Host "`n=== Fixing Vercel Environment Variables ===" -ForegroundColor Cyan
Write-Host "Problem: Variables have \r\n at the end`n" -ForegroundColor Yellow

# Vercel CLI path
$vercel = "C:\Users\Admin\AppData\Roaming\npm\node_modules\vercel\dist\vc.js"
function Invoke-Vercel {
    param([string[]]$Args)
    & node $vercel @Args
}

# Step 1: Remove corrupted variables
Write-Host "Step 1: Removing corrupted variables..." -ForegroundColor Yellow

Write-Host "  Removing ADMIN_USERNAME..." -ForegroundColor Gray
Write-Output "y" | Invoke-Vercel env rm ADMIN_USERNAME production

Write-Host "  Removing ADMIN_PASSWORD..." -ForegroundColor Gray
Write-Output "y" | Invoke-Vercel env rm ADMIN_PASSWORD production

Write-Host "  Removing SESSION_SECRET..." -ForegroundColor Gray
Write-Output "y" | Invoke-Vercel env rm SESSION_SECRET production

Write-Host "`nStep 2: Adding clean variables..." -ForegroundColor Yellow

# Step 2: Add clean variables (manual input to avoid line ending issues)
Write-Host "  Adding ADMIN_USERNAME..." -ForegroundColor Gray
if (-not $env:ADMIN_USERNAME) { $env:ADMIN_USERNAME = Read-Host -Prompt 'ADMIN_USERNAME (non-sensitive)' }
$env:ADMIN_USERNAME | Invoke-Vercel env add ADMIN_USERNAME production

Write-Host "  Adding ADMIN_PASSWORD..." -ForegroundColor Gray
if (-not $env:ADMIN_PASSWORD) {
    $secure = Read-Host -Prompt 'ADMIN_PASSWORD (sensitive)' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $env:ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}
$env:ADMIN_PASSWORD | Invoke-Vercel env add ADMIN_PASSWORD production

Write-Host "  Adding SESSION_SECRET..." -ForegroundColor Gray
if (-not $env:SESSION_SECRET) {
    $secure = Read-Host -Prompt 'SESSION_SECRET (sensitive, random 32+ chars)' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $env:SESSION_SECRET = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}
$env:SESSION_SECRET | Invoke-Vercel env add SESSION_SECRET production

Write-Host "`n=== Verification ===" -ForegroundColor Cyan
Invoke-Vercel env ls

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Run: .\scripts\vercel.ps1 --prod --force" -ForegroundColor White
Write-Host "2. Wait 2-3 minutes" -ForegroundColor White
Write-Host "3. Test: https://www.chiangmaiusedcar.com/admin/login`n" -ForegroundColor White

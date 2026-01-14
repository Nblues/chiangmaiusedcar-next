# Fix Environment Variables with \r\n line endings
# ลบและเพิ่มใหม่ทั้ง 3 ตัวแปร

Write-Host "`n=== Fixing Environment Variables with \r\n ===" -ForegroundColor Cyan
Write-Host "This will remove and re-add ADMIN_USERNAME, ADMIN_PASSWORD, and SESSION_SECRET`n" -ForegroundColor Yellow

$adminUser = $env:ADMIN_USERNAME
$adminPass = $env:ADMIN_PASSWORD
$sessionSecret = $env:SESSION_SECRET

if ([string]::IsNullOrWhiteSpace($adminUser)) {
    $adminUser = Read-Host -Prompt 'ADMIN_USERNAME (non-sensitive)'
}
if ([string]::IsNullOrWhiteSpace($adminPass)) {
    $secure = Read-Host -Prompt 'ADMIN_PASSWORD (sensitive)' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $adminPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}
if ([string]::IsNullOrWhiteSpace($sessionSecret)) {
    $secure = Read-Host -Prompt 'SESSION_SECRET (sensitive, random 32+ chars)' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $sessionSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$env:CI = "1"  # Non-interactive mode

# 1. Remove old variables
Write-Host "Step 1: Removing old variables..." -ForegroundColor Yellow
echo "y" | vercel env rm ADMIN_USERNAME production 2>&1 | Out-Null
echo "y" | vercel env rm ADMIN_PASSWORD production 2>&1 | Out-Null
echo "y" | vercel env rm SESSION_SECRET production 2>&1 | Out-Null
Write-Host "[OK] Old variables removed`n" -ForegroundColor Green

# 2. Add new variables using temp files (UTF8 no BOM)
Write-Host "Step 2: Adding new variables (clean, no \r\n)..." -ForegroundColor Yellow

# ADMIN_USERNAME
$tempUser = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempUser -Value $adminUser -Encoding UTF8 -NoNewline
Get-Content $tempUser | vercel env add ADMIN_USERNAME production 2>&1 | Out-Null
Remove-Item $tempUser
Write-Host "  [OK] ADMIN_USERNAME added" -ForegroundColor Green

# ADMIN_PASSWORD
$tempPass = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempPass -Value $adminPass -Encoding UTF8 -NoNewline
Get-Content $tempPass | vercel env add ADMIN_PASSWORD production 2>&1 | Out-Null
Remove-Item $tempPass
Write-Host "  [OK] ADMIN_PASSWORD added" -ForegroundColor Green

# SESSION_SECRET
$tempSecret = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempSecret -Value $sessionSecret -Encoding UTF8 -NoNewline
Get-Content $tempSecret | vercel env add SESSION_SECRET production 2>&1 | Out-Null
Remove-Item $tempSecret
Write-Host "  [OK] SESSION_SECRET added`n" -ForegroundColor Green

# 3. Verify by pulling
Write-Host "Step 3: Verifying..." -ForegroundColor Yellow
vercel env pull .env.verify.local --environment production 2>&1 | Out-Null

$hasNewlines = Get-Content .env.verify.local | Select-String "\\r\\n"
if ($hasNewlines) {
    Write-Host "[ERROR] Still found \r\n in environment variables!" -ForegroundColor Red
    Write-Host $hasNewlines
    exit 1
} else {
    Write-Host "[SUCCESS] All environment variables are clean (no \r\n)!`n" -ForegroundColor Green
}

Remove-Item .env.verify.local -ErrorAction SilentlyContinue

Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Force redeploy: vercel --prod --force" -ForegroundColor White
Write-Host "2. Wait 30 seconds for deployment" -ForegroundColor White
Write-Host "3. Test login: .\scripts\test-admin-login.ps1 -Domain <deployment-url>`n" -ForegroundColor White

# Manual Environment Variable Setup via Temp Files
# This avoids any line ending issues by using temp files

Write-Host "`n=== Manual Vercel Environment Variable Setup ===" -ForegroundColor Cyan
Write-Host "Using temp files to avoid line ending issues`n" -ForegroundColor Yellow

# Values (trim any whitespace)
$username = "kngoodcar"
$password = "Kn-goodcar**5277"  
$secret = "f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33"

# Create temp files with UTF8 no BOM
$tempDir = $env:TEMP
$usernameFile = Join-Path $tempDir "username.txt"
$passwordFile = Join-Path $tempDir "password.txt"
$secretFile = Join-Path $tempDir "secret.txt"

# Write values without any extra characters
[System.IO.File]::WriteAllText($usernameFile, $username, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($passwordFile, $password, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($secretFile, $secret, [System.Text.UTF8Encoding]::new($false))

Write-Host "Step 1: Adding ADMIN_USERNAME to Production..." -ForegroundColor Yellow
Get-Content $usernameFile -Raw | vercel env add ADMIN_USERNAME production

Write-Host "`nStep 2: Adding ADMIN_PASSWORD to Production..." -ForegroundColor Yellow
Get-Content $passwordFile -Raw | vercel env add ADMIN_PASSWORD production

Write-Host "`nStep 3: Adding SESSION_SECRET to Production..." -ForegroundColor Yellow
Get-Content $secretFile -Raw | vercel env add SESSION_SECRET production

# Cleanup
Remove-Item $usernameFile, $passwordFile, $secretFile -ErrorAction SilentlyContinue

Write-Host "`n=== Verification ===" -ForegroundColor Cyan
vercel env ls production

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Run: vercel --prod --force" -ForegroundColor White
Write-Host "2. Test: https://www.chiangmaiusedcar.com/admin/login`n" -ForegroundColor White

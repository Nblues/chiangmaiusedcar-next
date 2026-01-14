# Manual Environment Variable Setup via Temp Files
# This avoids any line ending issues by using temp files

Write-Host "`n=== Manual Vercel Environment Variable Setup ===" -ForegroundColor Cyan
Write-Host "Using temp files to avoid line ending issues`n" -ForegroundColor Yellow

# Values (read from env or prompt; avoid hardcoding secrets)
$username = $env:ADMIN_USERNAME
$password = $env:ADMIN_PASSWORD
$secret = $env:SESSION_SECRET

if ([string]::IsNullOrWhiteSpace($username)) {
	$username = Read-Host -Prompt 'ADMIN_USERNAME (non-sensitive)'
}
if ([string]::IsNullOrWhiteSpace($password)) {
	$secure = Read-Host -Prompt 'ADMIN_PASSWORD (sensitive)' -AsSecureString
	$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
	try { $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
	finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}
if ([string]::IsNullOrWhiteSpace($secret)) {
	$secure = Read-Host -Prompt 'SESSION_SECRET (sensitive, random 32+ chars)' -AsSecureString
	$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
	try { $secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
	finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

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

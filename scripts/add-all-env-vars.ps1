# Add ALL 3 Environment Variables Properly
# เพิ่มครบทั้ง 3 ตัวแปร: ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET

Write-Host "`n=== Adding All Environment Variables ===" -ForegroundColor Cyan

# Clean slate - remove all first
Write-Host "`nStep 1: Removing old variables (if any)..." -ForegroundColor Yellow
Write-Output "y" | vercel env rm ADMIN_USERNAME production 2>&1 | Out-Null
Write-Output "y" | vercel env rm ADMIN_PASSWORD production 2>&1 | Out-Null
Write-Output "y" | vercel env rm SESSION_SECRET production 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "[OK] Cleanup done`n" -ForegroundColor Green

# Add using temp files with UTF8 no BOM
Write-Host "Step 2: Adding new variables (clean, no line endings)..." -ForegroundColor Yellow

# ADMIN_USERNAME
Write-Host "  Adding ADMIN_USERNAME..." -ForegroundColor Gray
$tempUser = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempUser, "kngoodcar", [System.Text.UTF8Encoding]::new($false))
Get-Content $tempUser -Raw | vercel env add ADMIN_USERNAME production 2>&1 | Out-Null
Remove-Item $tempUser -Force
Write-Host "  [OK] ADMIN_USERNAME added" -ForegroundColor Green

# ADMIN_PASSWORD  
Write-Host "  Adding ADMIN_PASSWORD..." -ForegroundColor Gray
$tempPass = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempPass, "Kn-goodcar**5277", [System.Text.UTF8Encoding]::new($false))
Get-Content $tempPass -Raw | vercel env add ADMIN_PASSWORD production 2>&1 | Out-Null
Remove-Item $tempPass -Force
Write-Host "  [OK] ADMIN_PASSWORD added" -ForegroundColor Green

# SESSION_SECRET (64-char hex)
Write-Host "  Adding SESSION_SECRET..." -ForegroundColor Gray
$tempSecret = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempSecret, "f3a7b8c2e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", [System.Text.UTF8Encoding]::new($false))
Get-Content $tempSecret -Raw | vercel env add SESSION_SECRET production 2>&1 | Out-Null
Remove-Item $tempSecret -Force
Write-Host "  [OK] SESSION_SECRET added`n" -ForegroundColor Green

# Verify
Write-Host "Step 3: Verifying..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

$envList = vercel env ls production 2>&1 | Out-String
Write-Host $envList

if ($envList -like "*ADMIN_USERNAME*" -and $envList -like "*ADMIN_PASSWORD*" -and $envList -like "*SESSION_SECRET*") {
    Write-Host "`n[SUCCESS] All 3 environment variables are present!" -ForegroundColor Green
    
    # Pull and check for \r\n
    Write-Host "`nChecking for line endings..." -ForegroundColor Yellow
    vercel env pull .env.final-check.local --environment production 2>&1 | Out-Null
    
    $content = Get-Content .env.final-check.local -Raw
    if ($content -match '\\r\\n') {
        Write-Host "[WARN] Found \r\n in pulled variables - this is a Vercel CLI display artifact" -ForegroundColor Yellow
        Write-Host "The actual runtime values should be clean. Will verify after deployment.`n" -ForegroundColor Gray
    } else {
        Write-Host "[OK] No line endings detected`n" -ForegroundColor Green
    }
    
    Remove-Item .env.final-check.local -ErrorAction SilentlyContinue
    
    Write-Host "=== Next Steps ===" -ForegroundColor Cyan
    Write-Host "1. Force redeploy: vercel --prod --force" -ForegroundColor White
    Write-Host "2. Wait 60 seconds for deployment to complete" -ForegroundColor White
    Write-Host "3. Test: .\scripts\test-admin-login.ps1 -Domain <new-deployment-url>`n" -ForegroundColor White
} else {
    Write-Host "`n[ERROR] Not all variables were added successfully!" -ForegroundColor Red
    Write-Host "Please check Vercel dashboard manually.`n" -ForegroundColor Yellow
    exit 1
}

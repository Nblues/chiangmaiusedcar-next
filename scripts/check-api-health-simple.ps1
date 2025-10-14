# API Health Check Script
# Check if Vercel Deployment Protection is blocking APIs

param(
    [string]$Domain = "https://www.chiangmaiusedcar.com"
)

Write-Host ""
Write-Host "=== API Health Check ===" -ForegroundColor Cyan
Write-Host "Domain: $Domain" -ForegroundColor Gray
Write-Host ""

$endpoints = @(
    @{ Path = "/api/ping"; ExpectedContent = "pong" },
    @{ Path = "/api/runtime-check"; ExpectedContent = "ok" }
)

$allPassed = $true
$protectionDetected = $false

foreach ($endpoint in $endpoints) {
    $url = "$Domain$($endpoint.Path)"
    Write-Host "Testing: $($endpoint.Path) ... " -ForegroundColor Yellow -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $content = $response.Content
        
        if ($content -like "*$($endpoint.ExpectedContent)*") {
            Write-Host "PASS" -ForegroundColor Green
        } else {
            Write-Host "FAIL" -ForegroundColor Red
            Write-Host "  Got: $($content.Substring(0, [Math]::Min(200, $content.Length)))" -ForegroundColor Gray
            $allPassed = $false
        }
        
        # Check for Vercel Authentication page
        if ($content -like "*Authentication Required*" -or $content -like "*vercel.com/sso-api*") {
            $protectionDetected = $true
        }
        
    } catch {
        Write-Host "ERROR" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -like "*Authentication Required*") {
            $protectionDetected = $true
        }
        
        $allPassed = $false
    }
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan

if ($protectionDetected) {
    Write-Host ""
    Write-Host "[BLOCKED] Vercel Deployment Protection DETECTED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "API endpoints are being blocked by authentication." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard" -ForegroundColor White
    Write-Host "2. Project -> Settings -> Security -> Deployment Protection" -ForegroundColor White
    Write-Host "3. Disable Protection for Production" -ForegroundColor White
    Write-Host "4. Save and wait 30 seconds" -ForegroundColor White
    Write-Host "5. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "See: VERCEL_DEPLOYMENT_PROTECTION_FIX.md for details" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

if ($allPassed) {
    Write-Host ""
    Write-Host "[OK] All API endpoints are healthy!" -ForegroundColor Green
    Write-Host "Deployment Protection: DISABLED (correct)" -ForegroundColor Green
    Write-Host ""
    exit 0
} else {
    Write-Host ""
    Write-Host "[WARN] Some endpoints failed checks" -ForegroundColor Yellow
    Write-Host "Review errors above for details" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

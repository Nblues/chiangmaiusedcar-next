# API Health Check Script
# ตรวจสอบว่า Vercel Deployment Protection บล็อค API หรือไม่

param(
    [string]$Domain = "https://www.chiangmaiusedcar.com",
    [switch]$Verbose
)

Write-Host "`n=== API Health Check ===" -ForegroundColor Cyan
Write-Host "Domain: $Domain`n" -ForegroundColor Gray

$endpoints = @(
    @{ Path = "/api/ping"; ExpectedStatus = 200; ExpectedContent = "pong"; Description = "Minimal ping endpoint" },
    @{ Path = "/api/runtime-check"; ExpectedStatus = 200; ExpectedContent = '"ok":true'; Description = "Runtime check" },
    @{ Path = "/api/test-env"; ExpectedStatus = 200; ExpectedContent = '"env"'; Description = "Environment check" },
    @{ Path = "/api/health"; ExpectedStatus = 200; ExpectedContent = '"success":true'; Description = "Health endpoint" }
)

$allPassed = $true
$protectionDetected = $false

foreach ($endpoint in $endpoints) {
    $url = "$Domain$($endpoint.Path)"
    Write-Host "Testing: $($endpoint.Path)" -ForegroundColor Yellow -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $content = $response.Content
        
        if ($response.StatusCode -eq $endpoint.ExpectedStatus) {
            if ($content -like "*$($endpoint.ExpectedContent)*") {
                Write-Host " ✅ PASS" -ForegroundColor Green
                if ($Verbose) {
                    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
                    Write-Host "  Content: $($content.Substring(0, [Math]::Min(100, $content.Length)))..." -ForegroundColor Gray
                }
            } else {
                Write-Host " ⚠️  WARN" -ForegroundColor Yellow
                Write-Host "  Expected content not found: '$($endpoint.ExpectedContent)'" -ForegroundColor Yellow
                Write-Host "  Got: $($content.Substring(0, [Math]::Min(200, $content.Length)))..." -ForegroundColor Gray
                $allPassed = $false
            }
        } else {
            Write-Host " ❌ FAIL" -ForegroundColor Red
            Write-Host "  Expected: $($endpoint.ExpectedStatus), Got: $($response.StatusCode)" -ForegroundColor Red
            $allPassed = $false
        }
        
        # Check for Vercel Authentication page
        if ($content -like "*Authentication Required*" -or $content -like "*vercel.com/sso-api*") {
            $protectionDetected = $true
        }
        
    } catch {
        Write-Host " ❌ ERROR" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Message -like "*Authentication Required*" -or $_.Exception.Response.StatusCode -eq 401) {
            $protectionDetected = $true
        }
        
        $allPassed = $false
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan

if ($protectionDetected) {
    Write-Host "🔐 Vercel Deployment Protection DETECTED!" -ForegroundColor Red
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
    Write-Host "See: VERCEL_DEPLOYMENT_PROTECTION_FIX.md for detailed steps" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

if ($allPassed) {
    Write-Host "✅ All API endpoints are healthy!" -ForegroundColor Green
    Write-Host "Deployment Protection: DISABLED (correct)" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some endpoints failed checks" -ForegroundColor Yellow
    Write-Host "Review errors above for details" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

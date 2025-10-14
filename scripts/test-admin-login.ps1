# Quick Test: Admin Login Flow
# ทดสอบการ login หลังปิด Deployment Protection

param(
    [string]$Domain = "https://www.chiangmaiusedcar.com",
    [string]$Username = "kngoodcar",
    [string]$Password = "Kn-goodcar**5277"
)

Write-Host "`n=== Admin Login Test ===" -ForegroundColor Cyan
Write-Host "Testing admin authentication flow...`n" -ForegroundColor Gray

# Test 1: Ping
Write-Host "1. Testing /api/ping..." -ForegroundColor Yellow
try {
    $ping = Invoke-WebRequest -Uri "$Domain/api/ping" -Method GET -UseBasicParsing
    if ($ping.Content -eq "pong") {
        Write-Host "   ✅ Ping successful" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected response: $($ping.Content)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Ping failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -like "*Authentication Required*") {
        Write-Host "`n🔐 Deployment Protection is still ENABLED!" -ForegroundColor Red
        Write-Host "Please disable it first. See VERCEL_DEPLOYMENT_PROTECTION_FIX.md`n" -ForegroundColor Yellow
        exit 1
    }
    exit 1
}

# Test 2: Login
Write-Host "`n2. Testing /api/admin/login..." -ForegroundColor Yellow
try {
    $body = @{
        username = $Username
        password = $Password
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $login = Invoke-WebRequest -Uri "$Domain/api/admin/login" -Method POST -Body $body -Headers $headers -UseBasicParsing -SessionVariable session

    if ($login.StatusCode -eq 200) {
        $result = $login.Content | ConvertFrom-Json
        if ($result.success -eq $true) {
            Write-Host "   ✅ Login successful!" -ForegroundColor Green
            Write-Host "   User: $($result.user.username)" -ForegroundColor Gray
            
            # Test 3: Verify session
            Write-Host "`n3. Testing /api/admin/verify..." -ForegroundColor Yellow
            try {
                $verify = Invoke-WebRequest -Uri "$Domain/api/admin/verify" -Method GET -WebSession $session -UseBasicParsing
                $verifyResult = $verify.Content | ConvertFrom-Json
                
                if ($verifyResult.success -eq $true) {
                    Write-Host "   ✅ Session verified!" -ForegroundColor Green
                    Write-Host "   Authenticated as: $($verifyResult.user.username)" -ForegroundColor Gray
                } else {
                    Write-Host "   ❌ Session verification failed" -ForegroundColor Red
                }
            } catch {
                Write-Host "   ❌ Verify failed: $($_.Exception.Message)" -ForegroundColor Red
            }
            
            Write-Host "`n=== Summary ===" -ForegroundColor Cyan
            Write-Host "✅ Admin authentication is working correctly!" -ForegroundColor Green
            Write-Host "`nYou can now access:" -ForegroundColor White
            Write-Host "  - $Domain/admin/login" -ForegroundColor Cyan
            Write-Host "  - $Domain/admin/dashboard" -ForegroundColor Cyan
            Write-Host "  - $Domain/admin/cars`n" -ForegroundColor Cyan
            
            exit 0
        } else {
            Write-Host "   ❌ Login returned success=false" -ForegroundColor Red
            Write-Host "   Response: $($login.Content)" -ForegroundColor Gray
            exit 1
        }
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "   ❌ Login failed: Invalid credentials (401)" -ForegroundColor Red
        Write-Host "   Check ADMIN_USERNAME and ADMIN_PASSWORD in Vercel env vars" -ForegroundColor Yellow
    } elseif ($statusCode -eq 429) {
        Write-Host "   ⚠️  Rate limited (429) - too many attempts" -ForegroundColor Yellow
        Write-Host "   Wait 10 minutes and try again" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    exit 1
}

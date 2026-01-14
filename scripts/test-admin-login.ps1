# Quick Test: Admin Login Flow
# ทดสอบการ login หลังปิด Deployment Protection

param(
    [string]$Domain = "https://www.chiangmaiusedcar.com",
    [string]$Username = $env:ADMIN_USERNAME,
    [string]$Password = $env:ADMIN_PASSWORD,
    [string]$BypassToken
)

if ([string]::IsNullOrWhiteSpace($Username)) {
    $Username = Read-Host -Prompt 'ADMIN_USERNAME'
}
if ([string]::IsNullOrWhiteSpace($Password)) {
    $secure = Read-Host -Prompt 'ADMIN_PASSWORD' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

Write-Host "`n=== Admin Login Test ===" -ForegroundColor Cyan
Write-Host "Testing admin authentication flow...`n" -ForegroundColor Gray
if ($BypassToken) { Write-Host "Using bypass token (length $($BypassToken.Length))`n" -ForegroundColor Gray }

# Optional: Set bypass cookie first
if ($BypassToken) {
    Write-Host "Setting bypass cookie..." -ForegroundColor Yellow
    $bypassUrl = "$Domain/api/ping?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$([uri]::EscapeDataString($BypassToken))"
    try {
        $null = Invoke-WebRequest -Uri $bypassUrl -UseBasicParsing -SessionVariable bypassSession -TimeoutSec 10
        Write-Host "Bypass cookie request sent." -ForegroundColor Green
    } catch {
        Write-Host "Failed to set bypass cookie: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 1: Ping
Write-Host "1. Testing /api/ping..." -ForegroundColor Yellow
try {
    if ($bypassSession) {
        $ping = Invoke-WebRequest -Uri "$Domain/api/ping" -Method GET -UseBasicParsing -WebSession $bypassSession
    } else {
        $ping = Invoke-WebRequest -Uri "$Domain/api/ping" -Method GET -UseBasicParsing
    }
    if ($ping.Content -eq "pong") {
        Write-Host "   [OK] Ping successful" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Unexpected response: $($ping.Content)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   [ERROR] Ping failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -like "*Authentication Required*") {
        Write-Host "`n[BLOCKED] Deployment Protection is still ENABLED!" -ForegroundColor Red
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

    if ($bypassSession) {
        $login = Invoke-WebRequest -Uri "$Domain/api/admin/login" -Method POST -Body $body -Headers $headers -UseBasicParsing -SessionVariable session -WebSession $bypassSession
    } else {
        $login = Invoke-WebRequest -Uri "$Domain/api/admin/login" -Method POST -Body $body -Headers $headers -UseBasicParsing -SessionVariable session
    }

    if ($login.StatusCode -eq 200) {
        $result = $login.Content | ConvertFrom-Json
        if ($result.success -eq $true) {
            Write-Host "   [OK] Login successful!" -ForegroundColor Green
            Write-Host "   User: $($result.user.username)" -ForegroundColor Gray
            
            # Test 3: Verify session
            Write-Host "`n3. Testing /api/admin/verify..." -ForegroundColor Yellow
            try {
                if ($bypassSession) {
                    $verify = Invoke-WebRequest -Uri "$Domain/api/admin/verify" -Method GET -WebSession $session -UseBasicParsing
                } else {
                    $verify = Invoke-WebRequest -Uri "$Domain/api/admin/verify" -Method GET -WebSession $session -UseBasicParsing
                }
                $verifyResult = $verify.Content | ConvertFrom-Json
                
                if ($verifyResult.success -eq $true) {
                    Write-Host "   [OK] Session verified!" -ForegroundColor Green
                    Write-Host "   Authenticated as: $($verifyResult.user.username)" -ForegroundColor Gray
                } else {
                    Write-Host "   [ERROR] Session verification failed" -ForegroundColor Red
                }
            } catch {
                Write-Host "   [ERROR] Verify failed: $($_.Exception.Message)" -ForegroundColor Red
            }
            
            Write-Host "`n=== Summary ===" -ForegroundColor Cyan
            Write-Host "[SUCCESS] Admin authentication is working correctly!" -ForegroundColor Green
            Write-Host "`nYou can now access:" -ForegroundColor White
            Write-Host "  - $Domain/admin/login" -ForegroundColor Cyan
            Write-Host "  - $Domain/admin/dashboard" -ForegroundColor Cyan
            Write-Host "  - $Domain/admin/cars`n" -ForegroundColor Cyan
            
            exit 0
        } else {
            Write-Host "   [ERROR] Login returned success=false" -ForegroundColor Red
            Write-Host "   Response: $($login.Content)" -ForegroundColor Gray
            exit 1
        }
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 401) {
        Write-Host "   [ERROR] Login failed: Invalid credentials (401)" -ForegroundColor Red
        Write-Host "   Check ADMIN_USERNAME and ADMIN_PASSWORD in Vercel env vars" -ForegroundColor Yellow
    } elseif ($statusCode -eq 429) {
        Write-Host "   [WARN] Rate limited (429) - too many attempts" -ForegroundColor Yellow
        Write-Host "   Wait 10 minutes and try again" -ForegroundColor Gray
    } else {
        Write-Host "   [ERROR] Login failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    exit 1
}

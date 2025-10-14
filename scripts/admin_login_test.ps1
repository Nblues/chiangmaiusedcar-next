# Test Admin Login Flow
# Usage: powershell -ExecutionPolicy Bypass -File scripts\admin_login_test.ps1

$ErrorActionPreference = 'Stop'
$BASE_URL = 'http://localhost:3000'

Write-Host "Testing Admin Login Flow..." -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Login
    Write-Host "Step 1: Logging in with admin credentials..." -ForegroundColor Yellow
    $loginBody = @{
        username = "admin"
        password = "changeme123"
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest `
        -Uri "$BASE_URL/api/admin/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -SessionVariable webSession `
        -UseBasicParsing

    Write-Host "Login Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    
    # Check for Set-Cookie header
    $setCookieHeader = $loginResponse.Headers['Set-Cookie']
    if ($setCookieHeader) {
        Write-Host "Session cookie set" -ForegroundColor Green
    } else {
        Write-Host "No session cookie found" -ForegroundColor Red
        exit 1
    }

    # Parse login response
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "   User: $($loginData.user.username)" -ForegroundColor Gray
    Write-Host ""

    # Step 2: Verify session
    Write-Host "Step 2: Verifying session..." -ForegroundColor Yellow
    $verifyResponse = Invoke-WebRequest `
        -Uri "$BASE_URL/api/admin/verify" `
        -Method Get `
        -WebSession $webSession `
        -UseBasicParsing

    Write-Host "Verify Status: $($verifyResponse.StatusCode)" -ForegroundColor Green
    
    # Parse verify response
    $verifyData = $verifyResponse.Content | ConvertFrom-Json
    Write-Host "   Authenticated: $($verifyData.success)" -ForegroundColor Gray
    Write-Host "   User: $($verifyData.user.username)" -ForegroundColor Gray
    Write-Host ""

    # Step 3: Test dashboard access
    Write-Host "Step 3: Testing dashboard access..." -ForegroundColor Yellow
    $dashboardResponse = Invoke-WebRequest `
        -Uri "$BASE_URL/admin/dashboard" `
        -Method Get `
        -WebSession $webSession `
        -UseBasicParsing

    Write-Host "Dashboard Status: $($dashboardResponse.StatusCode)" -ForegroundColor Green
    Write-Host ""

    # Summary
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Admin Authentication Flow: SUCCESS" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "All checks passed! Admin system is working correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now access:" -ForegroundColor Yellow
    Write-Host "  Login:     $BASE_URL/admin/login" -ForegroundColor White
    Write-Host "  Dashboard: $BASE_URL/admin/dashboard" -ForegroundColor White
    Write-Host ""

    exit 0

} catch {
    Write-Host ""
    Write-Host "Test Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    }
    
    exit 1
}

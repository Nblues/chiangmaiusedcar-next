# Test Admin Login Flow - ASCII Only Version
# Tests: Ping -> Login -> Verify Session

param(
    [string]$Domain = "https://www.chiangmaiusedcar.com"
)

$ErrorActionPreference = "Stop"

# Credentials
$username = "kngoodcar"
$password = "Kn-goodcar**5277"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Admin Login Test - $Domain" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: API Ping
Write-Host "[1/3] Testing API Health..." -ForegroundColor Yellow
try {
    $pingUrl = "$Domain/api/ping"
    $pingResponse = Invoke-WebRequest -Uri $pingUrl -Method GET -UseBasicParsing
    
    if ($pingResponse.StatusCode -eq 200) {
        $body = $pingResponse.Content
        Write-Host "    SUCCESS - API is up" -ForegroundColor Green
        Write-Host "    Response: $body" -ForegroundColor Gray
    }
} catch {
    Write-Host "    FAILED - API not responding" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Admin Login
Write-Host "[2/3] Testing Admin Login..." -ForegroundColor Yellow
try {
    $loginUrl = "$Domain/api/admin/login"
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest `
        -Uri $loginUrl `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing `
        -SessionVariable webSession
    
    if ($loginResponse.StatusCode -eq 200) {
        $responseData = $loginResponse.Content | ConvertFrom-Json
        Write-Host "    SUCCESS - Login successful" -ForegroundColor Green
        Write-Host "    User: $($responseData.user.username)" -ForegroundColor Gray
        
        # Extract cookies
        $cookies = $webSession.Cookies.GetCookies($loginUrl)
        Write-Host "    Cookies received: $($cookies.Count)" -ForegroundColor Gray
        foreach ($cookie in $cookies) {
            Write-Host "      - $($cookie.Name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "    FAILED - Login failed" -ForegroundColor Red
    Write-Host "    Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to read error response
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "    Response: $errorBody" -ForegroundColor Red
    } catch {}
    
    exit 1
}

Write-Host ""

# Test 3: Verify Session
Write-Host "[3/3] Testing Session Verification..." -ForegroundColor Yellow
try {
    $verifyUrl = "$Domain/api/admin/verify"
    $verifyResponse = Invoke-WebRequest `
        -Uri $verifyUrl `
        -Method GET `
        -UseBasicParsing `
        -WebSession $webSession
    
    if ($verifyResponse.StatusCode -eq 200) {
        $responseData = $verifyResponse.Content | ConvertFrom-Json
        Write-Host "    SUCCESS - Session is valid" -ForegroundColor Green
        Write-Host "    Authenticated: $($responseData.authenticated)" -ForegroundColor Gray
        if ($responseData.user) {
            Write-Host "    User: $($responseData.user.username)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "    FAILED - Session verification failed" -ForegroundColor Red
    Write-Host "    Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " ALL TESTS PASSED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Admin login is working correctly on: $Domain" -ForegroundColor Green
Write-Host ""

# Disable Vercel Deployment Protection via API
# Requires Vercel Personal Access Token (PAT)

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "prj_XVRkUdnzaMz6OLJs6SKyZoe8F4ON",
    
    [Parameter(Mandatory=$false)]
    [string]$TeamId = "chiangmaiusedcars-projects"
)

Write-Host "`n=== Disable Vercel Deployment Protection ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Gray
Write-Host "Team: $TeamId`n" -ForegroundColor Gray

# Check for VERCEL_TOKEN environment variable or ask user
$token = $env:VERCEL_TOKEN
if (-not $token) {
    Write-Host "VERCEL_TOKEN not found in environment." -ForegroundColor Yellow
    Write-Host "Please provide your Vercel Personal Access Token:" -ForegroundColor Yellow
    Write-Host "(Create at: https://vercel.com/account/tokens)`n" -ForegroundColor Gray
    $token = Read-Host -Prompt "Token" -MaskInput
}

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "[ERROR] No token provided. Cannot proceed." -ForegroundColor Red
    exit 1
}

Write-Host "Fetching current project settings..." -ForegroundColor Yellow

# API endpoint
$apiUrl = "https://api.vercel.com/v9/projects/$ProjectId`?teamId=$TeamId"

try {
    # Get current settings
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $currentSettings = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Current project retrieved." -ForegroundColor Green
    
    # Check current protection settings
    $currentProtection = $currentSettings.protection
    if ($currentProtection) {
        Write-Host "Current Protection: $($currentProtection | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } else {
        Write-Host "Current Protection: null (likely disabled)" -ForegroundColor Gray
    }
    
    Write-Host "`nDisabling Deployment Protection..." -ForegroundColor Yellow
    
    # Update to disable protection
    $updateBody = @{
        protection = $null
    } | ConvertTo-Json
    
    $updatedSettings = Invoke-RestMethod -Uri $apiUrl -Method Patch -Headers $headers -Body $updateBody -ErrorAction Stop
    
    Write-Host "[OK] Deployment Protection DISABLED!" -ForegroundColor Green
    Write-Host "New Protection: $($updatedSettings.protection)" -ForegroundColor Gray
    
    Write-Host "`n=== Success ===" -ForegroundColor Green
    Write-Host "Deployment Protection is now disabled for Production." -ForegroundColor White
    Write-Host "Wait 30-60 seconds for changes to propagate." -ForegroundColor Yellow
    Write-Host "`nTest with:" -ForegroundColor Cyan
    Write-Host "  .\scripts\check-api-health-simple.ps1" -ForegroundColor White
    Write-Host ""
    
    exit 0
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.Exception.Message
    
    Write-Host "[ERROR] Failed to update project settings." -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Message: $errorMessage" -ForegroundColor Red
    
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "`nThe token may be invalid or lack permissions." -ForegroundColor Yellow
        Write-Host "Required scope: Project settings (read + write)" -ForegroundColor Yellow
        Write-Host "Create token at: https://vercel.com/account/tokens" -ForegroundColor Cyan
    }
    
    try {
        $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error Details: $($errorBody.error.message)" -ForegroundColor Red
    } catch {}
    
    exit 1
}

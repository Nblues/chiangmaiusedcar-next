# Disable Vercel Deployment Protection via API
# Requires Vercel Personal Access Token (PAT)

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "prj_XVRkUdnzaMz6OLJs6SKyZoe8F4ON",
    
    [Parameter(Mandatory=$false)]
    [string]$TeamId = "chiangmaiusedcars-projects",

    [Parameter(Mandatory=$false)]
    [string]$Token
)

Write-Host "`n=== Disable Vercel Deployment Protection ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Gray
Write-Host "Team: $TeamId`n" -ForegroundColor Gray

# Resolve token from parameter, environment or prompt (with PS5.1 compatibility)
$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
    Write-Host "VERCEL_TOKEN not found in environment and -Token not provided." -ForegroundColor Yellow
    Write-Host "Please provide your Vercel Personal Access Token:" -ForegroundColor Yellow
    Write-Host "(Create at: https://vercel.com/account/tokens)`n" -ForegroundColor Gray

    try {
        # PowerShell 5.1-compatible masked input using SecureString
        $secure = Read-Host -Prompt "Token" -AsSecureString
        if ($secure) {
            $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
            try {
                $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
            } finally {
                [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
            }
        }
    } catch {
        # Fallback to plain input (not masked)
        Write-Host "Input masking unavailable; token will be visible while typing." -ForegroundColor Yellow
        $token = Read-Host -Prompt "Token"
    }
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
    
    # Dump current settings keys to identify correct property
    try {
        $jsonPreview = $currentSettings | ConvertTo-Json -Depth 9
        Write-Host "Current Project JSON (preview):" -ForegroundColor DarkGray
        # Print limited lines to avoid flooding
        $lines = $jsonPreview -split "`n"
        $max = [Math]::Min(80, $lines.Count)
        for ($i=0; $i -lt $max; $i++) { Write-Host $lines[$i] -ForegroundColor DarkGray }
        if ($lines.Count -gt $max) { Write-Host "... (truncated) ..." -ForegroundColor DarkGray }
    } catch {}
    
    # Check current protection-like settings
    $currentProtection = $currentSettings.protection
    if ($currentProtection) {
        Write-Host "Current Protection: $($currentProtection | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } else {
        Write-Host "Current Protection: null or not present in API" -ForegroundColor Gray
    }
    
    Write-Host "`nDisabling Deployment Protection..." -ForegroundColor Yellow
    
    # Try known shapes in order until one succeeds

    $attempts = @()
    # Attempt 1: Legacy 'protection' removal
    $attempts += @{ Body = (@{ protection = $null } | ConvertTo-Json); Note = 'legacy-protection-null' }
    # Attempt 2: Newer key 'deploymentProtection' set to null/disabled
    $attempts += @{ Body = (@{ deploymentProtection = $null } | ConvertTo-Json); Note = 'deploymentProtection-null' }
    # Attempt 3: Protection object with mode disabled
    $attempts += @{ Body = (@{ protection = @{ mode = 'DISABLED' } } | ConvertTo-Json); Note = 'protection-mode-disabled' }
    # Attempt 4: Security settings key
    $attempts += @{ Body = (@{ security = @{ deploymentProtection = @{ mode = 'DISABLED' } } } | ConvertTo-Json); Note = 'security.deploymentProtection.mode' }

    $lastError = $null
    foreach ($a in $attempts) {
        Write-Host ("Trying update variant: {0}" -f $a.Note) -ForegroundColor Yellow
        try {
            $updatedSettings = Invoke-RestMethod -Uri $apiUrl -Method Patch -Headers $headers -Body $a.Body -ErrorAction Stop
            Write-Host ("[OK] Update succeeded with variant: {0}" -f $a.Note) -ForegroundColor Green
            break
        } catch {
            $lastError = $_
            $statusCode2 = $_.Exception.Response.StatusCode.value__
            Write-Host ("Variant {0} failed: {1}" -f $a.Note, $statusCode2) -ForegroundColor DarkYellow
        }
    }
    
    if (-not $updatedSettings) { throw $lastError }
    
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

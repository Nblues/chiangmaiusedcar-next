# Add all required environment variables to chiangmaiusedcar-next project
param(
  [Parameter(Mandatory=$false)][string]$Token
)

$ErrorActionPreference = 'Stop'

# Configuration
$ProjectId = "prj_4DRhhC01Inrz1KwksneD9fnzbHdE"  # chiangmaiusedcar-next
$TeamId = "team_hwAaxdwJKzNxcJJWHj6zO50k"

# Get token
$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
    Write-Host ""
    Write-Host "=== Vercel Token Required ===" -ForegroundColor Cyan
    Write-Host "Please enter your Vercel API token:" -ForegroundColor Yellow
    $secureToken = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    $token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

Write-Host ""
Write-Host "=== Adding Environment Variables to Production ===" -ForegroundColor Cyan
Write-Host "Project: chiangmaiusedcar-next" -ForegroundColor Gray
Write-Host "Project ID: $ProjectId" -ForegroundColor Gray
Write-Host ""

function Get-OrPrompt([string]$Name, [string]$Prompt) {
    $val = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($val)) { return $val }
    return (Read-Host -Prompt $Prompt)
}

function Get-OrPromptSecret([string]$Name, [string]$Prompt) {
    $val = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($val)) { return $val }
    $secure = Read-Host -Prompt $Prompt -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$shopifyStorefrontToken = Get-OrPromptSecret -Name 'SHOPIFY_STOREFRONT_TOKEN' -Prompt 'SHOPIFY_STOREFRONT_TOKEN (sensitive)'
$adminUsername = Get-OrPrompt -Name 'ADMIN_USERNAME' -Prompt 'ADMIN_USERNAME (non-sensitive)'
$adminPassword = Get-OrPromptSecret -Name 'ADMIN_PASSWORD' -Prompt 'ADMIN_PASSWORD (sensitive)'

$sessionSecret = $env:SESSION_SECRET
if ([string]::IsNullOrWhiteSpace($sessionSecret)) {
    $sessionSecret = "production-secret-$(Get-Random)-$(Get-Date -Format 'yyyyMMddHHmmss')-chiangmai-usedcar"
}

# Environment variables to add
$envVars = @(
    @{ Key = "SHOPIFY_DOMAIN"; Value = "kn-goodcar.com" },
    @{ Key = "SHOPIFY_STOREFRONT_TOKEN"; Value = $shopifyStorefrontToken },
    @{ Key = "ADMIN_USERNAME"; Value = $adminUsername },
    @{ Key = "ADMIN_PASSWORD"; Value = $adminPassword },
    @{ Key = "SESSION_SECRET"; Value = $sessionSecret },
    @{ Key = "SITE_URL"; Value = "https://www.chiangmaiusedcar.com" },
    @{ Key = "NEXT_PUBLIC_SITE_URL"; Value = "https://www.chiangmaiusedcar.com" },
    @{ Key = "NEXT_PUBLIC_EMAILJS_SERVICE_ID"; Value = "service_qlcksif" },
    @{ Key = "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"; Value = "template_zd6e3f6" },
    @{ Key = "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"; Value = "P3wnNJB_Y_PddrdBJ" }
)

$successCount = 0
$failCount = 0

foreach ($env in $envVars) {
    Write-Host "Adding: $($env.Key) ... " -ForegroundColor Yellow -NoNewline
    
    try {
        $result = & "$PSScriptRoot\add-env-to-project.ps1" `
            -ProjectId $ProjectId `
            -TeamId $TeamId `
            -Token $token `
            -Key $env.Key `
            -Value $env.Value `
            -Targets @('production') `
            2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "FAILED" -ForegroundColor Red
            Write-Host "  Error: $result" -ForegroundColor DarkRed
            $failCount++
        }
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor DarkRed
        $failCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed:  $failCount" -ForegroundColor $(if ($failCount -gt 0) { 'Red' } else { 'Gray' })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "All environment variables added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Vercel dashboard" -ForegroundColor Gray
    Write-Host "2. Navigate to chiangmaiusedcar-next project" -ForegroundColor Gray
    Write-Host "3. Go to Deployments tab" -ForegroundColor Gray
    Write-Host "4. Click on latest deployment (42b06c3)" -ForegroundColor Gray
    Write-Host "5. Click 'Redeploy' button" -ForegroundColor Gray
    Write-Host "6. Wait 2-3 minutes for deployment to complete" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "Some variables failed to add. Please add them manually in Vercel dashboard." -ForegroundColor Yellow
}

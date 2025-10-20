# Create Vercel Webhook via GitHub API
# Purpose: Manually create Vercel deployment webhook when Vercel API is down

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    
    [Parameter(Mandatory=$false)]
    [string]$VercelProjectId = "prj_iCL0HK8DdSAVYTPNjpkSTT6DjZH4",
    
    [Parameter(Mandatory=$false)]
    [string]$VercelToken = $env:VERCEL_TOKEN
)

$owner = "Nblues"
$repo = "chiangmaiusedcar-next"

if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "ERROR: GitHub Token not provided!" -ForegroundColor Red
    Write-Host "Set: `$env:GITHUB_TOKEN = 'YOUR_TOKEN'" -ForegroundColor Yellow
    exit 1
}

if ([string]::IsNullOrEmpty($VercelToken)) {
    Write-Host "ERROR: Vercel Token not provided!" -ForegroundColor Red
    Write-Host "Get token from: https://vercel.com/account/tokens" -ForegroundColor Yellow
    Write-Host "Set: `$env:VERCEL_TOKEN = 'YOUR_TOKEN'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Creating Vercel webhook for $owner/$repo..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
        "Content-Type" = "application/json"
    }
    
    # Vercel deployment webhook payload
    $webhookData = @{
        name = "web"
        active = $true
        events = @("push", "pull_request")
        config = @{
            url = "https://api.vercel.com/v1/integrations/deploy/$VercelProjectId/webhook"
            content_type = "json"
            secret = $VercelToken
            insecure_ssl = "0"
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "Webhook Configuration:" -ForegroundColor Yellow
    Write-Host $webhookData
    Write-Host ""
    
    $result = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/hooks" -Headers $headers -Method Post -Body $webhookData
    
    Write-Host "SUCCESS: Webhook created!" -ForegroundColor Green
    Write-Host "Webhook ID: $($result.id)" -ForegroundColor Cyan
    Write-Host "URL: $($result.config.url)" -ForegroundColor Cyan
    Write-Host "Events: $($result.events -join ', ')" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Auto-deploy is now enabled!" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check GitHub token has 'admin:repo_hook' scope"
    Write-Host "2. Verify Vercel token is valid"
    Write-Host "3. Confirm project ID is correct"
    Write-Host ""
    Write-Host "Current settings:" -ForegroundColor Yellow
    Write-Host "  Project ID: $VercelProjectId"
    Write-Host "  Repo: $owner/$repo"
}

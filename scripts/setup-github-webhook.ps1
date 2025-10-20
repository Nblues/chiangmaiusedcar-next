# GitHub Webhook Setup Script
# Purpose: Remove broken webhook and verify Vercel webhook

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

$owner = "Nblues"
$repo = "chiangmaiusedcar-next"

if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "ERROR: GitHub Token not provided!" -ForegroundColor Red
    Write-Host ""
    Write-Host "How to use:" -ForegroundColor Yellow
    Write-Host "1. Create GitHub Personal Access Token at https://github.com/settings/tokens"
    Write-Host "2. Select scope: admin:repo_hook"
    Write-Host "3. Run: `$env:GITHUB_TOKEN = 'YOUR_TOKEN'; .\scripts\setup-github-webhook.ps1"
    Write-Host ""
    exit 1
}

Write-Host "Fetching webhooks for $owner/$repo..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $webhooks = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/hooks" -Headers $headers -Method Get
    
    Write-Host "SUCCESS: Found $($webhooks.Count) webhook(s)" -ForegroundColor Green
    Write-Host ""
    
    foreach ($webhook in $webhooks) {
        Write-Host "Webhook ID: $($webhook.id)" -ForegroundColor Yellow
        Write-Host "  URL: $($webhook.config.url)"
        Write-Host "  Events: $($webhook.events -join ', ')"
        Write-Host "  Active: $($webhook.active)"
        
        # Check if this is the broken CodeGPT webhook
        if ($webhook.config.url -like "*api.codegpt.co*") {
            Write-Host "  WARNING: This is the broken CodeGPT webhook!" -ForegroundColor Red
            
            $confirm = Read-Host "  Delete this webhook? (y/n)"
            if ($confirm -eq 'y') {
                try {
                    Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/hooks/$($webhook.id)" -Headers $headers -Method Delete
                    Write-Host "  SUCCESS: Deleted webhook $($webhook.id)" -ForegroundColor Green
                } catch {
                    Write-Host "  ERROR: Failed to delete - $_" -ForegroundColor Red
                }
            }
        }
        elseif ($webhook.config.url -like "*api.vercel.com*") {
            Write-Host "  OK: This is the Vercel webhook (keep it!)" -ForegroundColor Green
        }
        
        Write-Host ""
    }
    
    Write-Host "Webhook setup complete!" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "- Invalid token"
    Write-Host "- Token missing admin:repo_hook scope"
    Write-Host "- Network error"
}

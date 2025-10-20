# Vercel Git Integration Setup Script
# Purpose: Connect GitHub repository to Vercel project

param(
    [Parameter(Mandatory=$false)]
    [string]$VercelToken = $env:VERCEL_TOKEN
)

$projectId = "chiangmaiusedcar-setup"
$teamId = "chiangmaiusedcars-projects"
$githubRepo = "Nblues/chiangmaiusedcar-next"
$productionBranch = "master"

if ([string]::IsNullOrEmpty($VercelToken)) {
    Write-Host "ERROR: Vercel Token not provided!" -ForegroundColor Red
    Write-Host ""
    Write-Host "How to get token:" -ForegroundColor Yellow
    Write-Host "1. Go to https://vercel.com/account/tokens"
    Write-Host "2. Click 'Create Token'"
    Write-Host "3. Name: 'Git Integration Setup'"
    Write-Host "4. Scope: Full Account"
    Write-Host "5. Copy token"
    Write-Host ""
    Write-Host "Then run:" -ForegroundColor Yellow
    Write-Host "`$env:VERCEL_TOKEN = 'YOUR_TOKEN'; .\scripts\setup-vercel-git.ps1"
    Write-Host ""
    exit 1
}

Write-Host "Configuring Vercel Git Integration..." -ForegroundColor Cyan
Write-Host "Project: $projectId" -ForegroundColor Yellow
Write-Host "Team: $teamId" -ForegroundColor Yellow
Write-Host "GitHub Repo: $githubRepo" -ForegroundColor Yellow
Write-Host "Production Branch: $productionBranch" -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $VercelToken"
        "Content-Type" = "application/json"
    }
    
    # Get project details
    Write-Host "Step 1: Fetching project details..." -ForegroundColor Cyan
    $projectUrl = "https://api.vercel.com/v9/projects/$projectId`?teamId=$teamId"
    $project = Invoke-RestMethod -Uri $projectUrl -Headers $headers -Method Get
    Write-Host "SUCCESS: Project found - $($project.name)" -ForegroundColor Green
    Write-Host ""
    
    # Update project with Git settings
    Write-Host "Step 2: Connecting GitHub repository..." -ForegroundColor Cyan
    
    $body = @{
        gitRepository = @{
            type = "github"
            repo = $githubRepo
        }
        framework = "nextjs"
        buildCommand = "pnpm build"
        devCommand = "pnpm dev"
        installCommand = "pnpm install"
        outputDirectory = ".next"
        publicSource = $false
    } | ConvertTo-Json -Depth 10
    
    $updateUrl = "https://api.vercel.com/v9/projects/$projectId`?teamId=$teamId"
    $result = Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method PATCH -Body $body
    
    Write-Host "SUCCESS: Git repository connected!" -ForegroundColor Green
    Write-Host ""
    
    # Set production branch
    Write-Host "Step 3: Setting production branch to '$productionBranch'..." -ForegroundColor Cyan
    
    $branchBody = @{
        gitBranch = $productionBranch
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method PATCH -Body $branchBody
    
    Write-Host "SUCCESS: Production branch set to '$productionBranch'" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "================================" -ForegroundColor Green
    Write-Host "Git Integration Setup Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Verify at: https://vercel.com/$teamId/$projectId/settings/git"
    Write-Host "2. Check GitHub webhooks at: https://github.com/$githubRepo/settings/hooks"
    Write-Host "3. Test by pushing a commit"
    Write-Host ""
    
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "- Invalid Vercel token"
    Write-Host "- Insufficient permissions"
    Write-Host "- Project or team ID incorrect"
    Write-Host "- GitHub integration not authorized"
}

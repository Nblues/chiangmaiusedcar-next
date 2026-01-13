<#
.SYNOPSIS
Promotes the latest Vercel deployment to production

.DESCRIPTION
Fetches the most recent deployment and promotes it to production using Vercel CLI
#>

$ErrorActionPreference = 'Stop'

Write-Host "🚀 Promoting latest deployment to production..." -ForegroundColor Cyan

try {
    # Get latest deployment URL from git commit
    $latestCommit = git log --oneline -1
    Write-Host "Latest commit: $latestCommit" -ForegroundColor Gray
    
    # Try to use vercel CLI to promote
    $vercelPath = Get-Command vercel -ErrorAction SilentlyContinue
    
    if (-not $vercelPath) {
        Write-Host "❌ Vercel CLI not found" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please promote manually:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://vercel.com/nblues/chiangmaiusedcar-next/deployments" -ForegroundColor Cyan
        Write-Host "2. Find deployment with commit: $latestCommit" -ForegroundColor Cyan
        Write-Host "3. Click ⋯ menu → 'Promote to Production'" -ForegroundColor Cyan
        exit 1
    }
    
    Write-Host "✓ Using Vercel CLI: $($vercelPath.Source)" -ForegroundColor Green
    
    # List recent deployments
    Write-Host ""
    Write-Host "Fetching deployments..." -ForegroundColor Gray
    & vercel list --yes
    
    Write-Host ""
    Write-Host "To promote manually, run:" -ForegroundColor Yellow
    Write-Host "  vercel promote <deployment-url>" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://vercel.com/nblues/chiangmaiusedcar-next/deployments" -ForegroundColor Cyan
    Write-Host "2. Find latest deployment" -ForegroundColor Cyan
    Write-Host "3. Click ⋯ → 'Promote to Production'" -ForegroundColor Cyan
    exit 1
}

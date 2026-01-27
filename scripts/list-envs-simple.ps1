param(
    [Parameter(Mandatory = $false)][string]$ProjectId,
    [Parameter(Mandatory = $false)][string]$TeamId,
    [Parameter(Mandatory = $false)][string]$Token
)

$ErrorActionPreference = 'Stop'

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Host "[ERROR] Missing Vercel token. Provide -Token or set VERCEL_TOKEN." -ForegroundColor Red; exit 1 }

$projectId = $ProjectId
if (-not $projectId) { $projectId = $env:VERCEL_PROJECT_ID }
if (-not $projectId) { Write-Host "[ERROR] Missing project id. Provide -ProjectId or set VERCEL_PROJECT_ID." -ForegroundColor Red; exit 1 }

$teamId = $TeamId
if (-not $teamId) { $teamId = $env:VERCEL_TEAM_ID }

$headers = @{ Authorization = "Bearer $token" }

Write-Host ""
Write-Host "=== Vercel Environment Variables ===" -ForegroundColor Cyan
Write-Host ""

try {
    $url = "https://api.vercel.com/v9/projects/$projectId/env"
    if ($teamId) { $url = $url + "?teamId=$teamId" }
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    
    if ($response.envs) {
        Write-Host "Found $($response.envs.Count) variables:" -ForegroundColor Green
        Write-Host ""
        
        foreach ($env in ($response.envs | Sort-Object key)) {
            $targets = $env.target -join ', '
            Write-Host "  - $($env.key)" -ForegroundColor Yellow
            Write-Host "    Target: $targets" -ForegroundColor Gray
        }
    } else {
        Write-Host "No variables found." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
}

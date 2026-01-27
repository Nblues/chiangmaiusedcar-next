# List all environment variables in a Vercel project
param(
    [Parameter(Mandatory = $false)][string]$ProjectId,
    [Parameter(Mandatory = $false)][string]$TeamId,
    [Parameter(Mandatory = $false)][string]$Token
)

$ErrorActionPreference = 'Stop'

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
    Write-Host "[ERROR] Missing Vercel token. Provide -Token or set VERCEL_TOKEN." -ForegroundColor Red
    exit 1
}

$projectId = $ProjectId
if (-not $projectId) { $projectId = $env:VERCEL_PROJECT_ID }
if (-not $projectId) {
    Write-Host "[ERROR] Missing project id. Provide -ProjectId or set VERCEL_PROJECT_ID." -ForegroundColor Red
    exit 1
}

$teamId = $TeamId
if (-not $teamId) { $teamId = $env:VERCEL_TEAM_ID }

$headers = @{ Authorization = "Bearer $token" }

Write-Host ""
Write-Host "=== Vercel Environment Variables ===" -ForegroundColor Cyan
Write-Host ("ProjectId: " + $projectId) -ForegroundColor Gray
if ($teamId) { Write-Host ("TeamId: " + $teamId) -ForegroundColor Gray }
Write-Host ""

try {
    $url = "https://api.vercel.com/v9/projects/$projectId/env"
    if ($teamId) { $url = $url + "?teamId=$teamId" }
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    
    if ($response.envs -and $response.envs.Count -gt 0) {
        Write-Host "Found $($response.envs.Count) environment variables:" -ForegroundColor Green
        Write-Host ""
        
        $response.envs | Sort-Object key | ForEach-Object {
            $targets = ($_.target -join ', ')
            Write-Host "  ✓ $($_.key)" -ForegroundColor Green
            Write-Host "    Type: $($_.type)" -ForegroundColor Gray
            Write-Host "    Target: $targets" -ForegroundColor Gray
            if ($_.value -and $_.value.Length -lt 50) {
                Write-Host "    Value: $($_.value)" -ForegroundColor DarkGray
            } else {
                Write-Host "    Value: [encrypted/hidden]" -ForegroundColor DarkGray
            }
            Write-Host ""
        }
    } else {
        Write-Host "No environment variables found." -ForegroundColor Yellow
    }
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Error:" $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details:" $_.ErrorDetails.Message -ForegroundColor Red
    }
}

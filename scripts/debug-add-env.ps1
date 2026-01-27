param(
    [Parameter(Mandatory = $false)][string]$ProjectId,
    [Parameter(Mandatory = $false)][string]$TeamId,
    [Parameter(Mandatory = $false)][string]$Token
)

$ErrorActionPreference = 'Stop'

# Debug Vercel API Call
$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Host "[ERROR] Missing Vercel token. Provide -Token or set VERCEL_TOKEN." -ForegroundColor Red; exit 1 }

$projectId = $ProjectId
if (-not $projectId) { $projectId = $env:VERCEL_PROJECT_ID }
if (-not $projectId) { Write-Host "[ERROR] Missing project id. Provide -ProjectId or set VERCEL_PROJECT_ID." -ForegroundColor Red; exit 1 }

$teamId = $TeamId
if (-not $teamId) { $teamId = $env:VERCEL_TEAM_ID }

$headers = @{
    Authorization = "Bearer $token"
    'Content-Type' = 'application/json'
}

$body = @{
    key = 'SHOPIFY_DOMAIN'
    value = 'kn-goodcar.com'
    type = 'encrypted'
    target = @('production')
} | ConvertTo-Json

Write-Host "Attempting to add SHOPIFY_DOMAIN..." -ForegroundColor Yellow
Write-Host "Project: $projectId" -ForegroundColor Gray
Write-Host "Team: $teamId" -ForegroundColor Gray
Write-Host ""

try {
    $url = "https://api.vercel.com/v10/projects/$projectId/env"
    if ($teamId) { $url = $url + "?teamId=$teamId" }
    Write-Host "URL: $url" -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body $body -ErrorAction Stop
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

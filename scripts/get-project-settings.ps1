param(
    [string]$Token,
    [string]$ProjectId
)

$ErrorActionPreference = 'Stop'

if (-not $Token) { $Token = $env:VERCEL_TOKEN }
if (-not $Token) { Write-Host "[ERROR] Missing Vercel token. Provide -Token or set VERCEL_TOKEN." -ForegroundColor Red; exit 1 }
if (-not $ProjectId) { $ProjectId = $env:VERCEL_PROJECT_ID }
if (-not $ProjectId) { Write-Host "[ERROR] Missing project id. Provide -ProjectId or set VERCEL_PROJECT_ID." -ForegroundColor Red; exit 1 }

$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "`n=== Vercel Project Settings ===`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$ProjectId" -Method GET -Headers $headers
    
    Write-Host "Project Name: $($response.name)"
    Write-Host "Framework: $($response.framework)"
    Write-Host "Node Version: $($response.nodeVersion)"
    Write-Host "Build Command: $($response.buildCommand)"
    Write-Host "Install Command: $($response.installCommand)"
    Write-Host "Output Directory: $($response.outputDirectory)"
    Write-Host "`nFunction Settings:" -ForegroundColor Yellow
    Write-Host "  Max Duration: $($response.functions.maxDuration)"
    Write-Host "  Memory: $($response.functions.memory)"
    Write-Host "`nEnvironment Variables: $($response.env.Count)" -ForegroundColor Yellow
    
    Write-Host "`nFull response:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host ("Error: " + $_.Exception.Message) -ForegroundColor Red
}

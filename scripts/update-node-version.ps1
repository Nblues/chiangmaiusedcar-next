param(
    [string]$Token,
    [string]$ProjectId,
    [string]$NodeVersion = "20.x"
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

$body = @{
    nodeVersion = $NodeVersion
} | ConvertTo-Json

Write-Host "`n=== Updating Vercel Node.js Version ===`n" -ForegroundColor Cyan
Write-Host "Project ID: $ProjectId"
Write-Host "New Node Version: $NodeVersion`n"

try {
    $response = Invoke-RestMethod `
        -Uri "https://api.vercel.com/v9/projects/$ProjectId" `
        -Method PATCH `
        -Headers $headers `
        -Body $body
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Node Version updated to: $($response.nodeVersion)`n"
    
    Write-Host "Triggering new deployment..." -ForegroundColor Yellow
    Write-Host "Push any commit to trigger rebuild with Node.js 20.x"
    
} catch {
    Write-Host ("❌ Error: " + $_.Exception.Message) -ForegroundColor Red
}

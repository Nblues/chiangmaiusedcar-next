param(
    [string]$Token = "6d4ulahzz0A261sGrPSIIfP1",
    [string]$ProjectId = "prj_4DRhhC01Inrz1KwksneD9fnzbHdE",
    [string]$NodeVersion = "20.x"
)

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
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

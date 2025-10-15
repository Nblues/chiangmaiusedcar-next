# Debug Vercel API Call
$token = '6d4ulahzz0A261sGrPSIIfP1'
$projectId = 'prj_4DRhhC01Inrz1KwksneD9fnzbHdE'
$teamId = 'team_hwAaxdwJKzNxcJJWHj6zO50k'

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
    $url = "https://api.vercel.com/v10/projects/$projectId/env?teamId=$teamId"
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

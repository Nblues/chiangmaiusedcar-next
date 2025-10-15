$token = '6d4ulahzz0A261sGrPSIIfP1'
$deploymentId = 'dpl_7K6tT6aLDHuuiJfKCgewU31kqNz8'  # Latest deployment
$teamId = 'team_hwAaxdwJKzNxcJJWHj6zO50k'

$headers = @{ Authorization = "Bearer $token" }

Write-Host ""
Write-Host "=== Triggering Redeploy ===" -ForegroundColor Cyan
Write-Host "Deployment: $deploymentId" -ForegroundColor Gray
Write-Host ""

try {
    $url = "https://api.vercel.com/v13/deployments/$deploymentId/redeploy?teamId=$teamId"
    Write-Host "Attempting redeploy..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Post
    Write-Host "SUCCESS! New deployment created." -ForegroundColor Green
    Write-Host "New deployment ID:" $response.id -ForegroundColor Green
    Write-Host "Status:" $response.readyState -ForegroundColor Green
} catch {
    Write-Host "Redeploy endpoint failed, trying alternative..." -ForegroundColor Yellow
    
    # Alternative: Just trigger new deployment via push or webhook
    Write-Host ""
    Write-Host "Please redeploy manually:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com" -ForegroundColor Gray
    Write-Host "2. Select chiangmaiusedcar-next project" -ForegroundColor Gray
    Write-Host "3. Go to Deployments tab" -ForegroundColor Gray
    Write-Host "4. Click on latest deployment" -ForegroundColor Gray
    Write-Host "5. Click 'Redeploy' button (three dots menu)" -ForegroundColor Gray
}

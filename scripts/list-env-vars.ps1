# List all environment variables in Vercel project
$token = '6d4ulahzz0A261sGrPSIIfP1'
$projectId = 'prj_4DRhhC01Inrz1KwksneD9fnzbHdE'
$teamId = 'team_hwAaxdwJKzNxcJJWHj6zO50k'

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host ""
Write-Host "=== Vercel Environment Variables ===" -ForegroundColor Cyan
Write-Host "Project: chiangmaiusedcar-next" -ForegroundColor Gray
Write-Host ""

try {
    $url = "https://api.vercel.com/v9/projects/$projectId/env?teamId=$teamId"
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

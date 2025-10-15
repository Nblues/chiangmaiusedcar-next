$token = '6d4ulahzz0A261sGrPSIIfP1'
$projectId = 'prj_4DRhhC01Inrz1KwksneD9fnzbHdE'
$teamId = 'team_hwAaxdwJKzNxcJJWHj6zO50k'

$headers = @{ Authorization = "Bearer $token" }

Write-Host ""
Write-Host "=== Vercel Environment Variables ===" -ForegroundColor Cyan
Write-Host ""

try {
    $url = "https://api.vercel.com/v9/projects/$projectId/env?teamId=$teamId"
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

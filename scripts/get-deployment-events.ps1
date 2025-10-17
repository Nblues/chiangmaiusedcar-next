param(
  [string]$Token = "6d4ulahzz0A261sGrPSIIfP1",
  [string]$ProjectId = "prj_4DRhhC01Inrz1KwksneD9fnzbHdE",
  [int]$Limit = 1
)

$headers = @{ Authorization = "Bearer $Token" }

Write-Host "=== Fetch latest deployment(s) ===" -ForegroundColor Cyan
$deploys = Invoke-RestMethod -Uri "https://api.vercel.com/v6/deployments?projectId=$ProjectId&limit=$Limit" -Headers $headers -Method GET
$deployment = $deploys.deployments[0]
if (-not $deployment) { Write-Host "No deployments found" -ForegroundColor Red; exit 1 }

$depId = $deployment.uid
Write-Host ("Deployment: {0} | state={1} | url={2}" -f $depId,$deployment.readyState,$deployment.url) -ForegroundColor Yellow

Write-Host "`n=== Fetch deployment events (build/runtime) ===" -ForegroundColor Cyan
try {
  $events = Invoke-RestMethod -Uri "https://api.vercel.com/v3/deployments/$depId/events" -Headers $headers -Method GET
  $filtered = @($events.events | Select-Object -First 100)
  if ($filtered.Count -eq 0) { Write-Host "No events found" -ForegroundColor DarkYellow } else {
    foreach ($e in $filtered) {
      $ts = [DateTimeOffset]::FromUnixTimeMilliseconds($e.timestamp).ToLocalTime().ToString('u')
      Write-Host ("[{0}] {1} -> {2}" -f $ts,$e.type,$e.payload.message)
    }
  }
} catch {
  Write-Host "Failed to get events: $_" -ForegroundColor Red
}

Write-Host "`n=== Attempt function logs (best-effort) ===" -ForegroundColor Cyan
# Best-effort telemetry logs API (may require params)
$from = [int64](([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()) - 30*60*1000)
try {
  $logsUri = "https://api.vercel.com/v3/telemetry/logs?deploymentId=$depId&from=$from&limit=200&direction=backward"
  $logs = Invoke-RestMethod -Uri $logsUri -Headers $headers -Method GET
  if ($logs -and $logs.data) {
    $lines = $logs.data | Where-Object { $_.message -match "/api/ping|/api/admin/login|FUNCTION_INVOCATION_FAILED|error" } | Select-Object -First 50
    foreach ($l in $lines) {
      $ts = [DateTimeOffset]::FromUnixTimeMilliseconds($l.timestamp).ToLocalTime().ToString('u')
      Write-Host ("[{0}] {1}" -f $ts,$l.message)
    }
  } else {
    Write-Host "No telemetry logs returned or endpoint unsupported for this project" -ForegroundColor DarkYellow
  }
} catch {
  Write-Host "Failed to get telemetry logs: $_" -ForegroundColor Red
}

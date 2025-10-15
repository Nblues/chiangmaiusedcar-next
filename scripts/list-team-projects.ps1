param(
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

Write-Host "`n=== Vercel Team Projects ===" -ForegroundColor Cyan

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
  Write-Host "[ERROR] No token provided via -Token or VERCEL_TOKEN env." -ForegroundColor Red
  exit 1
}

$headers = @{ Authorization = "Bearer $token" }
$url = "https://api.vercel.com/v9/projects?teamId=$TeamId&limit=100"

try {
  $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  if ($res.projects) {
    foreach ($p in $res.projects) {
      Write-Host ("- {0} | id={1}" -f $p.name, $p.id) -ForegroundColor Gray
    }
  } else {
    $json = $res | ConvertTo-Json -Depth 6
    Write-Host $json
  }
} catch {
  Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

exit 0

param(
  [Parameter(Mandatory=$true)][string]$ProjectId,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token" }
$url = "https://api.vercel.com/v9/deployments?projectId=$ProjectId&teamId=$TeamId&target=production&limit=1"

try {
  $r = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  if ($r.deployments -and $r.deployments.Count -gt 0) {
    $d = $r.deployments[0]
    $out = [PSCustomObject]@{
      id = $d.id
      readyState = $d.readyState
      url = $d.url
      createdAt = $d.createdAt
      inspectorUrl = $d.inspectorUrl
    }
    $out | ConvertTo-Json -Depth 5
  } else {
    Write-Host "No production deployments found" -ForegroundColor Yellow
  }
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

param(
  [Parameter(Mandatory=$true)][string]$DeploymentId,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }
$url = "https://api.vercel.com/v13/deployments/$DeploymentId/redeploy?teamId=$TeamId"

try {
  $body = @{ }
  $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body ($body | ConvertTo-Json) -ErrorAction Stop
  $res | ConvertTo-Json -Depth 6
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

param(
  [Parameter(Mandatory=$true)][string]$Name,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token" }
$url = "https://api.vercel.com/v9/projects/$Name?teamId=$TeamId"

try {
  $p = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  $p | ConvertTo-Json -Depth 9
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

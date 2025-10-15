param(
  [Parameter(Mandatory=$false)][string]$ProjectId,
  [Parameter(Mandatory=$false)][string]$ProjectName,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token,
  [Parameter(Mandatory=$false)][string]$Target = "production",
  [Parameter(Mandatory=$false)][int]$Limit = 5
)

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token" }

$qs = @()
if ($ProjectId) { $qs += "projectId=$ProjectId" }
if ($ProjectName) { $qs += "project=$ProjectName" }
if ($TeamId) { $qs += "teamId=$TeamId" }
if ($Target) { $qs += "target=$Target" }
if ($Limit) { $qs += "limit=$Limit" }
$qsStr = ($qs -join '&')

$url = "https://api.vercel.com/v6/deployments?$qsStr"

try {
  $r = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  if ($r.deployments) {
    $r.deployments | Select-Object uid, url, state, name, created
  } else {
    $r | ConvertTo-Json -Depth 6
  }
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

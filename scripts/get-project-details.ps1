param(
  [Parameter(Mandatory=$true)][string]$ProjectId,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token" }
$url = "https://api.vercel.com/v9/projects/$ProjectId?teamId=$TeamId"

try {
  $p = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  $out = [PSCustomObject]@{
    id = $p.id
    name = $p.name
    accountId = $p.accountId
    linkType = $p.link.type
    repo = if ($p.link.org -and $p.link.repo) { "$($p.link.org)/$($p.link.repo)" } else { '' }
    gitBranch = $p.link.productionBranch
    latestRuntime = $p.nodeVersion
  }
  $out | ConvertTo-Json -Depth 5
} catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}

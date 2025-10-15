param(
  [Parameter(Mandatory=$true)][string]$ProjectId,
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token,
  [Parameter(Mandatory=$true)][string]$Key,
  [Parameter(Mandatory=$true)][string]$Value,
  [Parameter(Mandatory=$false)][string[]]$Targets = @('production')
)

$ErrorActionPreference = 'Stop'
$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) { Write-Error "Missing token"; exit 1 }
$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }

# Prefer team accountId if we can resolve it
function Resolve-TeamId([string]$projectIdFallback) {
  if ($TeamId -like 'team_*') { return $TeamId }
  try {
    $u = "https://api.vercel.com/v9/projects/$projectIdFallback"
    $p = Invoke-RestMethod -Uri $u -Headers $headers -Method Get -ErrorAction Stop
    if ($p.accountId -and $p.accountId -like 'team_*') { return $p.accountId }
  } catch {}
  return $TeamId
}
$teamResolved = Resolve-TeamId -projectIdFallback $ProjectId

$body = @{ key = $Key; value = $Value; type = 'encrypted'; target = $Targets } | ConvertTo-Json

$endpoints = @(
  "https://api.vercel.com/v10/projects/$ProjectId/env?teamId=$teamResolved",
  "https://api.vercel.com/v9/projects/$ProjectId/env?teamId=$teamResolved"
)

$ok = $false
foreach ($u in $endpoints) {
  try {
    Write-Host "Adding env $Key via $u ..." -ForegroundColor Yellow
    $res = Invoke-RestMethod -Uri $u -Headers $headers -Method Post -Body $body -ErrorAction Stop
    Write-Host "[OK] $Key added to $Targets" -ForegroundColor Green
    $ok = $true
    break
  } catch {
    Write-Host "Variant failed: $u" -ForegroundColor DarkYellow
  }
}

if (-not $ok) { Write-Error "Failed to add env $Key" }

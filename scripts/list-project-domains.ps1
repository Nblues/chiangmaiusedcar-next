param(
  [Parameter(Mandatory=$false)][string]$ProjectId = "prj_XVRkUdnzaMz6OLJs6SKyZoe8F4ON",
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$Token
)

Write-Host "`n=== Vercel Project Domains ===" -ForegroundColor Cyan

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
  Write-Host "[ERROR] No token provided via -Token or VERCEL_TOKEN env." -ForegroundColor Red
  exit 1
}

$headers = @{ Authorization = "Bearer $token" }
$url = "https://api.vercel.com/v9/projects/$ProjectId/domains?teamId=$TeamId"

try {
  $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction Stop
  if ($res.domains) {
    foreach ($d in $res.domains) {
      $name = $d.name
      $verified = $d.verified
      $pending = $d.pending
      $redirect = if ($d.redirect) { $d.redirect } else { '' }
      Write-Host ("- {0} | verified={1} pending={2} redirect={3}" -f $name, $verified, $pending, $redirect) -ForegroundColor Gray
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

param(
  [Parameter(Mandatory=$false)][string]$TeamId = "chiangmaiusedcars-projects",
  [Parameter(Mandatory=$false)][string]$NextProjectId = "prj_4DRhhC01Inrz1KwksneD9fnzbHdE",
  [Parameter(Mandatory=$false)][string]$SetupProjectId = "prj_XVRkUdnzaMz6OLJs6SKyZoe8F4ON",
  [Parameter(Mandatory=$false)][string]$Token,
  [Parameter(Mandatory=$false)][string]$Apex = "chiangmaiusedcar.com",
  [Parameter(Mandatory=$false)][string]$Www = "www.chiangmaiusedcar.com"
)

$ErrorActionPreference = 'Stop'

Write-Host "`n=== Switch Domain to Setup Project ===" -ForegroundColor Cyan
Write-Host "Team        : $TeamId" -ForegroundColor Gray
Write-Host "From (next) : $NextProjectId" -ForegroundColor Gray
Write-Host "To (setup)  : $SetupProjectId" -ForegroundColor Gray
Write-Host "Domains     : $Apex, $Www`n" -ForegroundColor Gray

$token = $Token
if (-not $token) { $token = $env:VERCEL_TOKEN }
if (-not $token) {
  Write-Host "[ERROR] No token provided via -Token or VERCEL_TOKEN env." -ForegroundColor Red
  exit 1
}

$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }

# Resolve canonical teamId (ID vs slug)
function Resolve-TeamId([string]$projectIdFallback) {
  if ($TeamId -like 'team_*') { return $TeamId }
  try {
    $u = "https://api.vercel.com/v9/projects/$projectIdFallback"
    $p = Invoke-RestMethod -Uri $u -Headers $headers -Method Get -ErrorAction Stop
    if ($p.accountId -and $p.accountId -like 'team_*') {
      return $p.accountId
    }
  } catch {
    # ignore, fallback to provided TeamId
  }
  return $TeamId
}

$teamResolved = Resolve-TeamId -projectIdFallback $NextProjectId
Write-Host ("Using teamId (resolved id): {0}" -f $teamResolved) -ForegroundColor Gray
$teamSlug = $TeamId
Write-Host ("Using teamId (slug for domain ops): {0}" -f $teamSlug) -ForegroundColor Gray
$teamForDomainOps = $teamResolved
Write-Host ("Using teamId (id for domain ops): {0}" -f $teamForDomainOps) -ForegroundColor Gray

function Remove-DomainFromProject([string]$projectId, [string]$domain) {
  $url = "https://api.vercel.com/v9/projects/$projectId/domains/$domain?teamId=$teamForDomainOps"
  try {
    Write-Host "Removing domain '$domain' from project $projectId ..." -ForegroundColor Yellow
    Invoke-RestMethod -Uri $url -Headers $headers -Method Delete | Out-Null
    Write-Host "[OK] Removed $domain" -ForegroundColor Green
  } catch {
    $code = $null
    try { $code = $_.Exception.Response.StatusCode.value__ } catch {}
    if ($code -eq 404) {
      Write-Host "[SKIP] $domain not found on project $projectId" -ForegroundColor DarkGray
    } elseif ($code -eq 409) {
      Write-Host "[SKIP] $domain is locked or in use; proceed to reattach." -ForegroundColor DarkYellow
    } else {
      throw $_
    }
  }
}

function Add-DomainToProject([string]$projectId, [string]$domain, [string]$redirect) {
  $url = "https://api.vercel.com/v9/projects/$projectId/domains?teamId=$teamForDomainOps"
  $bodyObj = @{ name = $domain }
  if ($redirect) { $bodyObj.redirect = $redirect }
  $body = $bodyObj | ConvertTo-Json -Depth 5
  Write-Host "Adding domain '$domain' to project $projectId (redirect=$redirect) ..." -ForegroundColor Yellow
  $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body $body
  Write-Host "[OK] Added $domain (verified=$($res.verified))" -ForegroundColor Green
}

# Helper: check domain presence on project
function Test-DomainOnProject([string]$projectId, [string]$domain) {
  $u = "https://api.vercel.com/v9/projects/$projectId/domains?teamId=$teamForDomainOps"
  try {
    $r = Invoke-RestMethod -Uri $u -Headers $headers -Method Get -ErrorAction Stop
    if ($r.domains) {
      return $r.domains | Where-Object { $_.name -eq $domain } | ForEach-Object { $true } | Select-Object -First 1
    }
  } catch {}
  return $false
}

# 1) Remove from NEXT project
$removedWWW = $false
$removedApex = $false
if (Test-DomainOnProject -projectId $NextProjectId -domain $Www) {
  Remove-DomainFromProject -projectId $NextProjectId -domain $Www
  $removedWWW = $true
} else {
  Write-Host "[INFO] $Www not currently on NEXT project (skip)." -ForegroundColor DarkGray
}
if (Test-DomainOnProject -projectId $NextProjectId -domain $Apex) {
  Remove-DomainFromProject -projectId $NextProjectId -domain $Apex
  $removedApex = $true
} else {
  Write-Host "[INFO] $Apex not currently on NEXT project (skip)." -ForegroundColor DarkGray
}

# If either domain still on NEXT project, abort to avoid downtime
if (Test-DomainOnProject -projectId $NextProjectId -domain $Www -or Test-DomainOnProject -projectId $NextProjectId -domain $Apex) {
  Write-Host "[ABORT] Domains still attached to NEXT project; not switching to avoid conflict." -ForegroundColor Yellow
  exit 2
}

# 2) Add to SETUP project (www first, then apex redirect to www)
Add-DomainToProject -projectId $SetupProjectId -domain $Www -redirect $null
Add-DomainToProject -projectId $SetupProjectId -domain $Apex -redirect $Www

Write-Host "`n[OK] Domains switched. Propagating... wait ~30-60s." -ForegroundColor Green
exit 0

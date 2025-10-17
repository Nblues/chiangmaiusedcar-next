# Verify domain mapping for production vs deployment using /api/_probe
param(
  [string]$CustomDomain = 'https://www.chiangmaiusedcar.com',
  [string]$DeploymentUrl = ''
)

$ErrorActionPreference = 'Stop'

function Get-Probe {
  param(
    [string]$Base
  )
  if (-not $Base) { return $null }
  $url = $Base.TrimEnd('/') + '/api/_probe'
  try {
    $resp = Invoke-RestMethod -Method Get -Uri $url -Headers @{ 'Accept'='application/json' } -TimeoutSec 15
    return @{ Type='json'; Status=200; Body=$resp; Url=$url }
  } catch {
    if ($_.Exception.Response) {
      try {
        $res = $_.Exception.Response
        $code = [int]$res.StatusCode
        $ct = $res.ContentType
        $sr = New-Object System.IO.StreamReader($res.GetResponseStream())
        $text = $sr.ReadToEnd()
        return @{ Type='raw'; Status=$code; ContentType=$ct; Body=$text; Url=$url }
      } catch {
        return @{ Type='error'; Error=$_.Exception.Message; Url=$url }
      }
    } else {
      return @{ Type='error'; Error=$_.Exception.Message; Url=$url }
    }
  }
}

function Write-ProbeResult {
  param(
    [string]$Label,
    [hashtable]$Result
  )
  Write-Host ("=== $Label ===") -ForegroundColor Cyan
  if (-not $Result) {
    Write-Host 'No URL provided' -ForegroundColor Yellow
    return
  }
  Write-Host ("URL: {0}" -f $Result.Url) -ForegroundColor DarkGray
  if ($Result.Type -eq 'json') {
    $b = $Result.Body
    $ok = $b.ok
    $hostName = $b.host
    $fwd = $b.forwardedHost
    $vid = $b.vercelId
    $vurl = $b.vercelUrl
    $env = $b.nodeEnv
    Write-Host ("Status: 200 JSON (ok={0})" -f $ok) -ForegroundColor Green
    Write-Host ("host={0}; x-forwarded-host={1}" -f $hostName, $fwd)
    Write-Host ("x-vercel-id={0}; VERCEL_URL={1}; NODE_ENV={2}" -f $vid, $vurl, $env)
  } elseif ($Result.Type -eq 'raw') {
    $status = $Result.Status
    $ct = $Result.ContentType
    $snippet = if ($Result.Body.Length -gt 120) { $Result.Body.Substring(0, 120) + '…' } else { $Result.Body }
    Write-Host ("Status: {0} ({1})" -f $status, $ct) -ForegroundColor Yellow
    Write-Host ("Body: {0}" -f $snippet)
  } else {
    Write-Host ("Error: {0}" -f $Result.Error) -ForegroundColor Red
  }
}

if (-not $DeploymentUrl) {
  # Try to read last deployment from a local file if provided in repo (optional)
  $guess = Get-ChildItem -Path "$(Split-Path $PSScriptRoot -Parent)\dev\scripts" -Filter 'probe-urls.mjs' -ErrorAction SilentlyContinue
  if ($guess) {
    Write-Host 'Tip: Provide -DeploymentUrl https://<your-deployment>.vercel.app for comparison.' -ForegroundColor DarkGray
  }
}

Write-Host 'Probing domains via /api/_probe …' -ForegroundColor Magenta
if ($CustomDomain) { Write-ProbeResult -Label 'Custom Domain' -Result (Get-Probe -Base $CustomDomain) }
if ($DeploymentUrl) { Write-ProbeResult -Label 'Deployment' -Result (Get-Probe -Base $DeploymentUrl) }

Write-Host 'Done.' -ForegroundColor Magenta

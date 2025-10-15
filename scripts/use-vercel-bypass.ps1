<#
 .SYNOPSIS
  Set Vercel Deployment Protection bypass cookie using a provided bypass token.

 .DESCRIPTION
  This script helps you quickly apply a Deployment Protection bypass token against
  the production domain so that protected /api/* routes become accessible within
  the current cookie session. It then optionally verifies a list of endpoints.

 .USAGE
  powershell -ExecutionPolicy Bypass -File .\scripts\use-vercel-bypass.ps1 -BypassToken YOUR_TOKEN
  .\scripts\use-vercel-bypass.ps1 -Domain https://www.chiangmaiusedcar.com -BypassToken YOUR_TOKEN -VerifyEndpoints

 .PARAMETER Domain
  Target base URL (defaults to production domain).

 .PARAMETER BypassToken
  The token generated from Vercel (NOT your Personal Access Token). Required.

 .PARAMETER VerifyEndpoints
  If supplied, performs quick GETs to /api/ping and /api/runtime-check after setting cookie.

 .NOTES
  The bypass cookie is set by calling an endpoint with the query params:
   x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<token>
  This mirrors Vercel's own bypass link generation behavior.
  This mirrors Vercel's own bypass link generation behavior.
#>
param(
  [string]$Domain = "https://www.chiangmaiusedcar.com",
  [Parameter(Mandatory = $true)][string]$BypassToken,
  [switch]$VerifyEndpoints
)

Write-Host "`n=== Vercel Deployment Protection Bypass ===" -ForegroundColor Cyan
Write-Host "Domain      : $Domain" -ForegroundColor Gray
Write-Host "Token (len) : $($BypassToken.Length)" -ForegroundColor Gray

if ([string]::IsNullOrWhiteSpace($BypassToken) -or $BypassToken.Length -lt 8) {
  Write-Host "[ERROR] Bypass token is missing or too short." -ForegroundColor Red
  exit 1
}

$bypassUrlApi = "$Domain/api/ping?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$([uri]::EscapeDataString($BypassToken))"
$bypassUrlRoot = "$Domain/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$([uri]::EscapeDataString($BypassToken))"

Write-Host "Setting bypass cookie via API: $bypassUrlApi" -ForegroundColor Yellow

$setOk = $false
try {
  $null = Invoke-WebRequest -Uri $bypassUrlApi -UseBasicParsing -SessionVariable bypassSession -TimeoutSec 15 -ErrorAction Stop
  $setOk = $true
  Write-Host "[OK] Bypass request sent via /api." -ForegroundColor Green
} catch {
  Write-Host "[WARN] API path blocked or failed ($($_.Exception.Response.StatusCode.value__)): trying site root..." -ForegroundColor Yellow
  try {
    $null = Invoke-WebRequest -Uri $bypassUrlRoot -UseBasicParsing -SessionVariable bypassSession -TimeoutSec 15 -ErrorAction Stop
    $setOk = $true
    Write-Host "[OK] Bypass request sent via root page." -ForegroundColor Green
  } catch {
    Write-Host "[ERROR] Failed to set bypass cookie via both API and root: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "       Double-check the token is generated for this exact domain/deployment." -ForegroundColor Red
    exit 1
  }
}

if ($VerifyEndpoints) {
  Write-Host "`nVerifying endpoints with bypass session..." -ForegroundColor Cyan
  $tests = @(
    @{ Path = "/api/ping"; Expect = "pong" },
    @{ Path = "/api/runtime-check"; Expect = '"ok":true' }
  )
  $allOk = $true
  foreach ($t in $tests) {
    $u = "$Domain$($t.Path)"
    Write-Host "Test: $($t.Path) ... " -NoNewline -ForegroundColor Yellow
    try {
      $r = Invoke-WebRequest -Uri $u -UseBasicParsing -WebSession $bypassSession -TimeoutSec 15
      if ($r.Content -like "*${($t.Expect)}*") {
        Write-Host "PASS" -ForegroundColor Green
      } else {
        Write-Host "FAIL" -ForegroundColor Red
        Write-Host "  Content (trunc): $($r.Content.Substring(0, [Math]::Min(180, $r.Content.Length)))" -ForegroundColor DarkGray
        $allOk = $false
      }
    } catch {
      Write-Host "ERR" -ForegroundColor Red
      Write-Host "  $($_.Exception.Message)" -ForegroundColor DarkRed
      $allOk = $false
    }
  }
  Write-Host "`nSummary:" -ForegroundColor Cyan
  if ($allOk) {
    Write-Host "[OK] All tested endpoints responded successfully under bypass." -ForegroundColor Green
  } else {
    Write-Host "[WARN] Some endpoints failed. Check Protection state or token validity." -ForegroundColor Yellow
  }
}

Write-Host "`nDone." -ForegroundColor Gray
exit 0

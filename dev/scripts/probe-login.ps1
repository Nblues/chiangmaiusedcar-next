# Probe production admin login endpoints using PowerShell
param(
  [string]$BaseUrl = 'https://www.chiangmaiusedcar.com'
)

$ErrorActionPreference = 'Stop'

function Post-Json {
  param(
    [string]$Url,
    [hashtable]$Body
  )
  $json = $Body | ConvertTo-Json -Depth 4
  try {
    $resp = Invoke-WebRequest -Method Post -Uri $Url -ContentType 'application/json' -Body $json -Headers @{ 'X-Requested-With'='XMLHttpRequest'; 'Accept'='application/json' }
    return @{ Status = $resp.StatusCode; Headers = $resp.Headers; Body = $resp.Content }
  } catch {
    if ($_.Exception.Response) {
      $res = $_.Exception.Response
      $sr = New-Object System.IO.StreamReader($res.GetResponseStream())
      $text = $sr.ReadToEnd()
      return @{ Status = [int]$res.StatusCode; Reason = $res.StatusDescription; Headers = $res.Headers; Body = $text }
    } else {
      throw
    }
  }
}

Write-Host ("Base URL: $BaseUrl") -ForegroundColor Cyan

Write-Host "--- DEBUG-LOGIN ---" -ForegroundColor Yellow
$d = Post-Json -Url ("$BaseUrl/api/admin/debug-login") -Body @{ username='kngoodcar'; password='Kn-goodcar**5277' }
$d | Format-List

Write-Host "`n--- LOGIN ---" -ForegroundColor Yellow
$l = Post-Json -Url ("$BaseUrl/api/admin/login") -Body @{ username='kngoodcar'; password='Kn-goodcar**5277' }
$l | Format-List

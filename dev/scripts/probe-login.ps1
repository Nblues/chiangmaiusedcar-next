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

$username = $env:ADMIN_USERNAME
$password = $env:ADMIN_PASSWORD

if ([string]::IsNullOrWhiteSpace($username)) {
  $username = Read-Host -Prompt 'ADMIN_USERNAME'
}
if ([string]::IsNullOrWhiteSpace($password)) {
  $secure = Read-Host -Prompt 'ADMIN_PASSWORD' -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

Write-Host "--- DEBUG-LOGIN ---" -ForegroundColor Yellow
$d = Post-Json -Url ("$BaseUrl/api/admin/debug-login") -Body @{ username=$username; password=$password }
$d | Format-List

Write-Host "`n--- LOGIN ---" -ForegroundColor Yellow
$l = Post-Json -Url ("$BaseUrl/api/admin/login") -Body @{ username=$username; password=$password }
$l | Format-List

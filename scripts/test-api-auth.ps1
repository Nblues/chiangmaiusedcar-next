param(
  [string]$BaseUrl = 'https://www.chiangmaiusedcar.com'
)

$candidates = @(
  [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\.secrets\\api-auth.local.json')),
  [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\..\\.secrets\\api-auth.local.json'))
)
$secretsPath = $null
foreach ($p in $candidates) {
  if (Test-Path $p) { $secretsPath = $p; break }
}
if (-not $secretsPath) {
  Write-Error "Secrets file not found in candidates. Run vercel-set-api-auth.ps1 first."
  Write-Host ("Checked: `n" + ($candidates -join "`n")) -ForegroundColor DarkGray
  exit 1
}

$apiKey = $null
$apiSecret = $null
try {
  $keyFile = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\.secrets\\api_key.txt'))
  $secFile = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\.secrets\\api_secret.txt'))
  if (Test-Path $keyFile -and Test-Path $secFile) {
    $apiKey = (Get-Content -Raw -Path $keyFile).Trim()
    $apiSecret = (Get-Content -Raw -Path $secFile).Trim()
  }
} catch {}

if (-not $apiKey -or -not $apiSecret) {
  $secrets = Get-Content -Raw -Path $secretsPath | ConvertFrom-Json
  $apiKey = $secrets.apiKey
  $apiSecret = $secrets.apiSecret
}

# Compute signature for GET /api/_auth-check
$method = 'GET'
$pathAndQuery = '/api/_auth-check'
# Use milliseconds epoch to avoid ISO parsing quirks
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString()
$body = ''

# SHA256 of body
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$hashBytes = $sha256.ComputeHash($bodyBytes)
$payloadHash = -join ($hashBytes | ForEach-Object { $_.ToString('x2') })

$canonical = "$method`n$pathAndQuery`n$ts`n$payloadHash"

# HMAC-SHA256
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($apiSecret)
$sigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($canonical))
$signature = -join ($sigBytes | ForEach-Object { $_.ToString('x2') })

$headers = @{
  'X-API-Key'   = $apiKey
  'X-Timestamp' = $ts
  'X-Signature' = $signature
}

Write-Host "Canonical: `n$canonical" -ForegroundColor DarkGray
Write-Host "Using headers -> X-API-Key: $($apiKey.Substring(0,8))..., X-Timestamp: $ts, X-Signature: $($signature.Substring(0,12))..." -ForegroundColor DarkGray

# Always try to capture body even on 4xx; on Windows PowerShell 5.1 Invoke-WebRequest may not throw.
try {
  $resp = Invoke-WebRequest -UseBasicParsing -Uri ($BaseUrl + $pathAndQuery) -Headers $headers -Method GET -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
  if ($resp.Content) { Write-Host $resp.Content }
} catch {
  $status = $null
  $bodyText = $null
  if ($_.Exception.Response) {
    try {
      $status = [int]$_.Exception.Response.StatusCode
      $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $bodyText = $sr.ReadToEnd()
    } catch {}
  }
  if (-not $status) { $status = 0 }
  Write-Host "Status: $status" -ForegroundColor Yellow
  if ($bodyText) { Write-Host $bodyText } else {
    Write-Host "(no body from Invoke-WebRequest; trying curl -i for details)" -ForegroundColor DarkGray
    $curlCmd = "cmd /c curl -i -H `"X-API-Key: $apiKey`" -H `"X-Timestamp: $ts`" -H `"X-Signature: $signature`" `"$BaseUrl$pathAndQuery`""
    Write-Host $curlCmd -ForegroundColor DarkGray
  $ci = cmd /c curl -i -H "X-API-Key: $apiKey" -H "X-Timestamp: $ts" -H "X-Signature: $signature" -H "X-Debug: 1" "$BaseUrl$pathAndQuery"
    Write-Host $ci
    Write-Host "--- Body only ---" -ForegroundColor DarkGray
  $cb = cmd /c curl -s -H "X-API-Key: $apiKey" -H "X-Timestamp: $ts" -H "X-Signature: $signature" -H "X-Debug: 1" "$BaseUrl$pathAndQuery"
    Write-Host $cb
  }
}
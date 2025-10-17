param(
  [Parameter(Mandatory=$true)][string]$PathAndQuery,
  [string]$BaseUrl = 'https://www.chiangmaiusedcar.com'
)

# Load secrets
$candidates = @(
  [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\.secrets\\api-auth.local.json')),
  [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\..\\.secrets\\api-auth.local.json'))
)
$secretsPath = $null
foreach ($p in $candidates) { if (Test-Path $p) { $secretsPath = $p; break } }
if (-not $secretsPath) { Write-Error 'Secrets file not found'; exit 1 }
$secrets = Get-Content -Raw -Path $secretsPath | ConvertFrom-Json
$apiKey = $secrets.apiKey
$apiSecret = $secrets.apiSecret

# Prepare canonical
$method = 'GET'
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString()
$body = ''
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
$hashBytes = $sha256.ComputeHash($bodyBytes)
$payloadHash = -join ($hashBytes | ForEach-Object { $_.ToString('x2') })
$canonical = "$method`n$PathAndQuery`n$ts`n$payloadHash"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($apiSecret)
$sigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($canonical))
$signature = -join ($sigBytes | ForEach-Object { $_.ToString('x2') })

Write-Host "Canonical:`n$canonical" -ForegroundColor DarkGray

$headers = @{
  'X-API-Key'   = $apiKey
  'X-Timestamp' = $ts
  'X-Signature' = $signature
}

try {
  $resp = Invoke-WebRequest -UseBasicParsing -Uri ($BaseUrl + $PathAndQuery) -Headers $headers -Method GET -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Green
  if ($resp.Content) { Write-Host $resp.Content }
} catch {
  if ($_.Exception.Response) {
    $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $bodyText = $sr.ReadToEnd()
    Write-Host "Status: $([int]$_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    Write-Host $bodyText
  } else {
    Write-Error $_
  }
}
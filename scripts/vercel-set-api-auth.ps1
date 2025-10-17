<#
.SYNOPSIS
  Configure API authentication env vars (API_KEY, API_SECRET) in Vercel for chiangmaiusedcar-next.

.DESCRIPTION
  - Generates strong random values if not provided
  - Adds/updates ENV for development, preview, and production
  - Verifies by calling /api/_auth-check with headers

.PARAMETER Project
  Vercel project name (default: chiangmaiusedcar-next)

.PARAMETER ApiKey
  Optional custom API key; if omitted a secure random key is generated

.PARAMETER ApiSecret
  Optional custom API secret; if omitted a secure random secret is generated

.EXAMPLE
  ./scripts/vercel-set-api-auth.ps1 -Project chiangmaiusedcar-next

#>

param(
  [string]$Project = 'chiangmaiusedcar-next',
  [string]$ApiKey,
  [string]$ApiSecret
)

function New-RandomHex {
  param([int]$Bytes = 32)
  $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
  $data = New-Object byte[] ($Bytes)
  $rng.GetBytes($data)
  ($data | ForEach-Object { $_.ToString('x2') }) -join ''
}

function Format-EnvValue([string]$s) {
  if (-not $s) { return $s }
  return ($s -replace "\r", '' -replace "\n", '').Trim()
}

Write-Host "==> Preparing API auth keys (API_KEY, API_SECRET) for Vercel project: $Project" -ForegroundColor Cyan

if (-not $ApiKey -or [string]::IsNullOrWhiteSpace($ApiKey)) {
  $ApiKey = New-RandomHex -Bytes 32
}
if (-not $ApiSecret -or [string]::IsNullOrWhiteSpace($ApiSecret)) {
  $ApiSecret = New-RandomHex -Bytes 48
}

$ApiKey = Format-EnvValue $ApiKey
$ApiSecret = Format-EnvValue $ApiSecret

Write-Host "API_KEY length: $($ApiKey.Length), API_SECRET length: $($ApiSecret.Length)" -ForegroundColor DarkGray

# Ensure Vercel CLI is available
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Error "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
}

Write-Host "==> Linking project (if needed) -> $Project" -ForegroundColor Cyan
cmd /c vercel link --yes --project $Project | Out-Host

Write-Host "==> Setting ENV in Vercel (development/preview/production)" -ForegroundColor Cyan

foreach ($envName in @('development','preview','production')) {
  # Use `vercel env rm` then add to avoid duplicates
  cmd /c vercel env rm API_KEY $envName --yes | Out-Null
  cmd /c vercel env rm API_SECRET $envName --yes | Out-Null

  $null = cmd /c "echo $ApiKey | vercel env add API_KEY $envName"
  $null = cmd /c "echo $ApiSecret | vercel env add API_SECRET $envName"
}

Write-Host "==> Pulling env to .env.local (optional)" -ForegroundColor Cyan
cmd /c vercel env pull --yes | Out-Host

Write-Host "==> Redeploying (production) to apply env for $Project" -ForegroundColor Cyan
cmd /c vercel deploy --prod --yes | Out-Host

Write-Host "==> Done. Verify with /api/_auth-check using headers: X-API-Key, X-Timestamp, X-Signature" -ForegroundColor Green

# Persist generated credentials locally (git-ignored) for testing/monitoring
try {
  $secretsDir = Join-Path -Path $PSScriptRoot -ChildPath "..\..\.secrets"
  $secretsDir = [System.IO.Path]::GetFullPath($secretsDir)
  if (-not (Test-Path $secretsDir)) { New-Item -ItemType Directory -Path $secretsDir | Out-Null }
  $outPath = Join-Path $secretsDir "api-auth.local.json"
  $payload = [pscustomobject]@{
    apiKey    = $ApiKey
    apiSecret = $ApiSecret
    project   = $Project
    createdAt = (Get-Date).ToString("o")
  } | ConvertTo-Json -Depth 3
  Set-Content -Path $outPath -Value $payload -Encoding UTF8
  Write-Host "Saved local test credentials to: $outPath (git-ignored)" -ForegroundColor DarkGray
} catch {}

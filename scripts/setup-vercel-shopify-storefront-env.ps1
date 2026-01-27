#!/usr/bin/env pwsh
<#{
Sets Shopify Storefront environment variables in Vercel for this project.

Why:
  - Build-time scripts (e.g. sitemap-images.xml) fetch Shopify product images.
  - Vercel builds need SHOPIFY_DOMAIN + SHOPIFY_STOREFRONT_TOKEN (Storefront API) configured.

Security:
  - No secrets are stored in the repo.
  - Token is entered interactively (secure prompt) or sourced from env.

Usage:
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-vercel-shopify-storefront-env.ps1
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-vercel-shopify-storefront-env.ps1 -OnlyProduction

Notes:
  - Uses .\vercel-cli.ps1 wrapper to avoid brittle global installs.
  - Requires Vercel login (you may need to run: pnpm run vercel -- login)
#>}

param(
  [switch]$OnlyProduction
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

$vercelWrapper = Join-Path $repoRoot 'vercel-cli.ps1'
if (-not (Test-Path $vercelWrapper)) {
  Write-Host "[ERROR] Missing vercel-cli.ps1 at repo root." -ForegroundColor Red
  exit 1
}

function Get-OrPrompt([string]$Name, [string]$Prompt, [string]$Default = $null) {
  $val = [Environment]::GetEnvironmentVariable($Name)
  if (-not [string]::IsNullOrWhiteSpace($val)) { return $val }
  if ($Default) {
    $entered = Read-Host -Prompt ("$Prompt (default: $Default)")
    if ([string]::IsNullOrWhiteSpace($entered)) { return $Default }
    return $entered
  }
  return (Read-Host -Prompt $Prompt)
}

function Get-OrPromptSecret([string]$Name, [string]$Prompt) {
  $val = [Environment]::GetEnvironmentVariable($Name)
  if (-not [string]::IsNullOrWhiteSpace($val)) { return $val }
  $secure = Read-Host -Prompt $Prompt -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

function Invoke-Vercel([string[]]$Args) {
  & $vercelWrapper @Args
  $code = $LASTEXITCODE
  if ($code -eq $null) { $code = 0 }
  return $code
}

function Set-VercelEnv([string]$Name, [string]$Value, [string]$Environment, [switch]$Sensitive) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "Missing required value: $Name"
  }

  $args = @('env', 'add', $Name, $Environment, '--force')
  if ($Sensitive) { $args += '--sensitive' }

  # Pipe the value via stdin. Vercel CLI does not need the value as a flag.
  $Value | & $vercelWrapper @args | Out-Null
  Write-Host ("  OK  " + $Name + " (" + $Environment + ")") -ForegroundColor Green
}

Write-Host "=== Setup Vercel: Shopify Storefront env ===" -ForegroundColor Cyan
Write-Host ("Repo: " + $repoRoot) -ForegroundColor Gray

Write-Host "\nLinking project (vercel link --yes)..." -ForegroundColor Yellow
$linkExit = Invoke-Vercel @('link', '--yes')
if ($linkExit -ne 0) {
  Write-Host "[ERROR] vercel link failed. Try: pnpm run vercel -- login" -ForegroundColor Red
  exit $linkExit
}

$domain = Get-OrPrompt -Name 'SHOPIFY_DOMAIN' -Prompt 'SHOPIFY_DOMAIN (recommended: <store>.myshopify.com)' -Default 'kn-goodcar.myshopify.com'
$token = Get-OrPromptSecret -Name 'SHOPIFY_STOREFRONT_TOKEN' -Prompt 'SHOPIFY_STOREFRONT_TOKEN (Storefront API access token)'

$targetEnvs = @('production', 'preview', 'development')
if ($OnlyProduction) { $targetEnvs = @('production') }

Write-Host "\nAdding env vars..." -ForegroundColor Yellow
foreach ($envName in $targetEnvs) {
  Set-VercelEnv -Name 'SHOPIFY_DOMAIN' -Value $domain -Environment $envName
  Set-VercelEnv -Name 'SHOPIFY_STOREFRONT_TOKEN' -Value $token -Environment $envName -Sensitive
}

Write-Host "\nDone. Next: trigger a new build/deploy on Vercel." -ForegroundColor Cyan
Write-Host "- Production deploy: corepack pnpm deploy" -ForegroundColor Gray
Write-Host "- Or: pnpm run vercel -- --prod" -ForegroundColor Gray

exit 0

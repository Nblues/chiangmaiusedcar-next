# Attach custom domain to the selected Vercel project (guided, non-destructive)
param(
  [string]$Project = 'chiangmaiusedcar-next',
  [string]$Domain = 'www.chiangmaiusedcar.com',
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

function Test-VercelCLI {
  $output = cmd /c vercel --version 2>&1
  $code = $LASTEXITCODE
  if ($code -ne 0) {
    Write-Host 'Vercel CLI is required. Install from: https://vercel.com/cli' -ForegroundColor Red
    if ($output) { Write-Host $output -ForegroundColor Yellow }
    throw "vercel --version exit $code"
  }
  return $output
}

function Invoke-Vercel {
  param([string]$CliArgs)
  Write-Host "> vercel $CliArgs" -ForegroundColor DarkGray
  $out = cmd /c vercel $CliArgs 2>&1
  $code = $LASTEXITCODE
  if ($code -ne 0) {
    if ($out) { Write-Host $out -ForegroundColor Yellow }
    throw "Command failed: vercel $CliArgs (exit $code)"
  }
  return $out
}

Write-Host "Project: $Project" -ForegroundColor Cyan
Write-Host "Domain:  $Domain" -ForegroundColor Cyan
if ($DryRun) { Write-Host 'Mode:    DRY RUN (no changes will be made)' -ForegroundColor Yellow }

$null = Test-VercelCLI

# Normalize domain to host (strip scheme and trailing slash)
$DomainHost = $Domain -replace '^https?://', '' -replace '/$', ''

# 1) Login (interactive if needed)
if (-not $DryRun) {
  try { Invoke-Vercel -CliArgs 'whoami' | Out-Null } catch { Invoke-Vercel -CliArgs 'login' | Out-Null }
}

# 2) Show current project/domains
Write-Host 'Fetching project details …' -ForegroundColor Magenta
$list = Invoke-Vercel -CliArgs ("domains ls --project $Project")
Write-Host $list

# 3) Attach domain (idempotent)
if ($DryRun) {
  Write-Host 'DRY RUN: Skipping domain attachment.' -ForegroundColor Yellow
} else {
  Write-Host "Attaching domain if missing … ($DomainHost)" -ForegroundColor Magenta
  try {
    $attach = Invoke-Vercel -CliArgs ("domains add $DomainHost --project $Project")
    Write-Host $attach
  } catch {
    Write-Host 'Attach step reported an error above; it may already be attached. Continuing …' -ForegroundColor Yellow
  }
}

# 4) Guide DNS (records)
Write-Host 'DNS guidance:' -ForegroundColor Green
Write-Host '- For www: CNAME www -> cname.vercel-dns.com (temporarily disable proxy/CDN orange cloud if using Cloudflare)'
Write-Host '- For apex (optional): ALIAS/ANAME @ -> cname.vercel-dns.com or A 76.76.21.21, then redirect apex -> www in Next.js (already configured)'

# 5) Verification hint
Write-Host 'Verify using scripts/vercel-domain-check.ps1 after DNS propagates.' -ForegroundColor Green

Write-Host 'Done.' -ForegroundColor Magenta

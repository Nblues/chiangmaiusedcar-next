<#
Checks for a permanent Vercel CLI setup on Windows.
Reports Node/npm versions, PATH resolution, and Vercel CLI availability.
Usage:
  powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/check-vercel-cli.ps1
#>

$ErrorActionPreference = 'SilentlyContinue'

function Write-Section($title) {
  Write-Host "`n=== $title ===" -ForegroundColor Cyan
}

function Show-Cmd($cmd) {
  try { & cmd /c "where $cmd" | ForEach-Object { Write-Host ("$cmd -> " + $_) -ForegroundColor DarkGray } } catch {}
}

Write-Section "Node & npm"
Show-Cmd node
Show-Cmd npm
Show-Cmd npx
Write-Host ("node -v: " + (try { node -v } catch { 'N/A' }))
Write-Host ("npm -v:  " + (try { npm -v } catch { 'N/A' }))

Write-Section "Vercel CLI"
Show-Cmd vercel
$vercelVersion = $null
try { $vercelVersion = vercel --version } catch {}
if ($vercelVersion) {
  Write-Host ("vercel --version: " + $vercelVersion) -ForegroundColor Green
} else {
  Write-Host "vercel not available in PATH" -ForegroundColor Yellow
}

Write-Section "Suggestions"
if (-not $vercelVersion) {
  Write-Host "1) Install Node.js LTS from https://nodejs.org/ (use the official installer)" -ForegroundColor Gray
  Write-Host "2) Open a new PowerShell and run: npm install -g vercel" -ForegroundColor Gray
  Write-Host "3) Verify: vercel --version" -ForegroundColor Gray
  Write-Host "4) Login: vercel login" -ForegroundColor Gray
} else {
  Write-Host "Vercel CLI looks installed. Try: vercel whoami (may require login)" -ForegroundColor Green
}

if (-not $vercelVersion) { exit 1 } else { exit 0 }

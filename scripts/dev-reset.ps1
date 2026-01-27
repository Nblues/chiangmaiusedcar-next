param(
  [int]$Port = 3000,
  [switch]$CleanNext,
  [ValidateSet('safe','light','full','dev')]
  [string]$Mode = 'safe'
)

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "[dev-reset] Target port: $Port" -ForegroundColor Cyan

# 1) Kill dev-watch loop(s)
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like '*scripts\\dev-watch.mjs*' } |
  ForEach-Object {
    Write-Host "[dev-reset] Killing dev-watch PID=$($_.ProcessId)" -ForegroundColor Yellow
    Stop-Process -Id $_.ProcessId -Force
  }

# 2) Kill anything listening on the dev port
$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listener) {
  Write-Host "[dev-reset] Killing port :$Port listener PID=$($listener.OwningProcess)" -ForegroundColor Yellow
  Stop-Process -Id $listener.OwningProcess -Force
}

# 3) Clean .next (optional)
if ($CleanNext) {
  $nextDir = Join-Path $PSScriptRoot '..\\.next'
  if (Test-Path $nextDir) {
    Write-Host "[dev-reset] Removing .next" -ForegroundColor Yellow
    Remove-Item -Path $nextDir -Recurse -Force
  }
}

# 4) Start a single dev instance
$script = switch ($Mode) {
  'safe' { 'dev:safe' }
  'light' { 'dev:light' }
  'full' { 'dev:full' }
  default { 'dev' }
}

Write-Host "[dev-reset] Starting: pnpm $script" -ForegroundColor Green
pnpm $script

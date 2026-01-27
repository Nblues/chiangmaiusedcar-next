Param(
  [Parameter(Mandatory = $false)]
  [string]$Workspace = "C:\project davelopper\chiangmaiusedcar-setup"
)

$ErrorActionPreference = 'Stop'

$userExe = Join-Path $env:LOCALAPPDATA 'Programs\Microsoft VS Code\Code.exe'
$sysExe = 'C:\Program Files\Microsoft VS Code\Code.exe'

$codeExe = $null
if (Test-Path $userExe) { $codeExe = $userExe }
elseif (Test-Path $sysExe) { $codeExe = $sysExe }

if (-not $codeExe) {
  throw "Cannot find Code.exe. Checked: $userExe, $sysExe"
}

$ver = (Get-Item $codeExe).VersionInfo.ProductVersion
Write-Host "Using VS Code: $codeExe (v$ver)"

$cleanUser = Join-Path $env:TEMP 'vscode-clean-user'
$cleanExt = Join-Path $env:TEMP 'vscode-clean-ext'

New-Item -ItemType Directory -Force -Path $cleanUser | Out-Null
New-Item -ItemType Directory -Force -Path $cleanExt | Out-Null

Write-Host "Launching in SAFE mode (no extensions, no GPU, clean profile)…"
Write-Host "User data: $cleanUser"
Write-Host "Extensions: $cleanExt"

& $codeExe `
  '--disable-extensions' `
  '--disable-gpu' `
  '--user-data-dir' $cleanUser `
  '--extensions-dir' $cleanExt `
  $Workspace

Param(
  [int]$DelaySeconds = 20,
  [string]$LogPath = "C:\project davelopper\chiangmaiusedcar-setup\logs\remove-vscode-1.103.2.log"
)

$ErrorActionPreference = 'Stop'

function Test-IsAdmin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdmin)) {
  Write-Host 'Requesting Administrator permission (UAC)…'
  $args = @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', $PSCommandPath,
    '-DelaySeconds', $DelaySeconds,
    '-LogPath', $LogPath
  )
  Start-Process -FilePath 'powershell.exe' -ArgumentList $args -Verb RunAs
  return
}

$logDir = Split-Path -Parent $LogPath
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

"=== Remove VS Code 1.103.2 ===" | Out-File $LogPath -Encoding utf8
("Start: {0}" -f (Get-Date)) | Add-Content $LogPath
("DelaySeconds: {0}" -f $DelaySeconds) | Add-Content $LogPath

# Give user time to save work
Start-Sleep -Seconds $DelaySeconds

"\n## Checking for system-level Code.exe processes" | Add-Content $LogPath
$systemPrefix = 'C:\\Program Files\\Microsoft VS Code\\'
Get-Process Code -ErrorAction SilentlyContinue | Where-Object {
  try { $_.Path -like ($systemPrefix + '*') } catch { $false }
} | ForEach-Object {
  try {
    ("Stopping system Code.exe PID {0} ({1})" -f $_.Id, $_.Path) | Add-Content $LogPath
    Stop-Process -Id $_.Id -Force -ErrorAction Stop
  } catch {
    ("Failed to stop PID {0}: {1}" -f $_.Id, $_.Exception.Message) | Add-Content $LogPath
  }
}

"\n## winget list (before)" | Add-Content $LogPath
try {
  (winget list --id Microsoft.VisualStudioCode --exact | Out-String).TrimEnd() | Add-Content $LogPath
} catch {
  ("winget list failed: {0}" -f $_.Exception.Message) | Add-Content $LogPath
}

"\n## Uninstall VS Code 1.103.2 (system)" | Add-Content $LogPath
try {
  # The system-level install shows as 1.103.2 in winget
  $args = @('uninstall','--id','Microsoft.VisualStudioCode','--exact','--version','1.103.2','--silent','--accept-source-agreements','--accept-package-agreements')
  ("Running: winget {0}" -f ($args -join ' ')) | Add-Content $LogPath
  $p = Start-Process -FilePath 'winget' -ArgumentList $args -Wait -PassThru
  ("winget exit code: {0}" -f $p.ExitCode) | Add-Content $LogPath
} catch {
  ("winget uninstall failed: {0}" -f $_.Exception.Message) | Add-Content $LogPath
}

"\n## winget list (after)" | Add-Content $LogPath
try {
  (winget list --id Microsoft.VisualStudioCode --exact | Out-String).TrimEnd() | Add-Content $LogPath
} catch {
  ("winget list failed: {0}" -f $_.Exception.Message) | Add-Content $LogPath
}

("\nEnd: {0}" -f (Get-Date)) | Add-Content $LogPath

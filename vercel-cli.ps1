<#
Vercel CLI Wrapper for Windows
การใช้งาน: PowerShell
  - .\vercel-cli.ps1                # เปิดตัวช่วย (จะแจ้งแนวทางถ้า CLI ใช้ไม่ได้)
  - .\vercel-cli.ps1 --prod         # deploy production
  - .\vercel-cli.ps1 env ls         # แสดง env vars
  - .\vercel-cli.ps1 login          # เข้าสู่ระบบ

ลำดับความพยายาม (จากง่ายไปยาก):
  1) vercel.exe ในโปรเจ็กต์ (หากผู้ใช้วางไฟล์เอง)
  2) vercel ใน PATH (ติดตั้งแบบ global แล้ว)
  3) npx vercel
  4) npm exec vercel
  5) pnpm dlx vercel
หากทั้งหมดล้มเหลว จะแนะนำให้ใช้ Dashboard หรือแก้ npm ตามเอกสาร
#>

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$VercelArgs
)

$ErrorActionPreference = 'SilentlyContinue'

function Normalize-VercelArgs {
    param([string[]]$InputArgs)

    $normalized = @()
    if ($InputArgs) { $normalized += $InputArgs }

    # Do not inject flags for purely informational commands.
    foreach ($a in $normalized) {
        if ($a -match '^(--version|-v|--help|-h)$') {
            return $normalized
        }
    }

    # Only inject --yes for deploy-like commands.
    # Injecting --yes for other subcommands (e.g. `whoami`) can make Vercel treat
    # the remaining arg as a deploy path.
    $isDeployLike = $false

    if (-not $normalized -or $normalized.Length -eq 0) {
        $isDeployLike = $true
    } else {
        $joined = ($normalized -join ' ')
        if ($joined -match '(?i)(^|\s)--prod(\s|$)' -or $joined -match '(?i)--target\s+production') {
            $isDeployLike = $true
        } else {
            # If the first non-flag token is `deploy`, treat it as deploy.
            $firstNonFlag = $null
            foreach ($a in $normalized) {
                if ($a -and -not ($a -like '-*')) { $firstNonFlag = $a; break }
            }
            if ($firstNonFlag -and $firstNonFlag -ieq 'deploy') {
                $isDeployLike = $true
            }
        }
    }

    if ($isDeployLike) {
        $hasYes = $false
        foreach ($a in $normalized) {
            if ($a -match '^(--yes|-y)$') { $hasYes = $true; break }
        }
        if (-not $hasYes) {
            $normalized = @('--yes') + $normalized
        }
    }

    return $normalized
}

function Invoke-Tool {
    param(
        [string]$ToolPath,
        [string[]]$ToolArgs
    )
    if ([string]::IsNullOrWhiteSpace($ToolPath)) { return $false }
    if (-not (Test-Path $ToolPath)) { return $false }
    Write-Host "→ $ToolPath $($ToolArgs -join ' ')" -ForegroundColor DarkGray
    & $ToolPath @ToolArgs
    $code = $LASTEXITCODE
    if ($code -eq $null) { $code = 0 }
    if ($code -eq 0) { return $true } else { return $false }
}

Write-Host "🚀 Running Vercel CLI..." -ForegroundColor Cyan
if ($VercelArgs -and $VercelArgs.Length -gt 0) {
    Write-Host ("Command: vercel " + ($VercelArgs -join ' ')) -ForegroundColor Gray
}
Write-Host ""

$VercelArgsNormalized = Normalize-VercelArgs -InputArgs $VercelArgs
if ($VercelArgsNormalized -and $VercelArgsNormalized.Length -gt 0) {
    Write-Host ("Auto flags: " + ($VercelArgsNormalized -join ' ')) -ForegroundColor DarkGray
    Write-Host "If this looks stuck, it is usually waiting for login or a browser confirmation." -ForegroundColor DarkYellow
    Write-Host "Try running: pnpm run vercel -- login" -ForegroundColor DarkYellow
    Write-Host ""
}

# If we're targeting production, prefer a fresh CLI (global installs can be stale).
$isProdDeploy = $false
if ($VercelArgs -and $VercelArgs.Length -gt 0) {
    $joinedArgs = ($VercelArgs -join ' ')
    if ($joinedArgs -match '(?i)(^|\s)--prod(\s|$)' -or $joinedArgs -match '(?i)--target\s+production') {
        $isProdDeploy = $true
    }
}

if ($isProdDeploy) {
    $npxPathCandidates = @(
        "$env:ProgramFiles\nodejs\npx.cmd",
        "$env:ProgramFiles(x86)\nodejs\npx.cmd",
        "C:\\nvm4w\\nodejs\\npx.cmd",
        (Get-Command npx -ErrorAction SilentlyContinue).Path
    )
    foreach ($npx in $npxPathCandidates) {
        if (-not [string]::IsNullOrWhiteSpace($npx) -and (Test-Path $npx)) {
            if (Invoke-Tool -ToolPath $npx -ToolArgs (@('vercel@latest') + $VercelArgsNormalized)) { exit 0 }
        }
    }
}

# 1) Local portable binary (optional manual placement)
$localExe = Join-Path (Get-Location) 'vercel.exe'
if (Test-Path $localExe) {
    if (Invoke-Tool -ToolPath $localExe -ToolArgs $VercelArgsNormalized) { exit 0 }
}

# 2) Global vercel in PATH
$vercelCmd = (& { (Get-Command vercel -ErrorAction SilentlyContinue).Path })
if ($vercelCmd) {
    if (Invoke-Tool -ToolPath $vercelCmd -ToolArgs $VercelArgsNormalized) { exit 0 }
}

# 3) npx vercel
$npxPathCandidates = @(
    "$env:ProgramFiles\nodejs\npx.cmd",
    "$env:ProgramFiles(x86)\nodejs\npx.cmd",
    "C:\\nvm4w\\nodejs\\npx.cmd",
    (Get-Command npx -ErrorAction SilentlyContinue).Path
)
foreach ($npx in $npxPathCandidates) {
    if (-not [string]::IsNullOrWhiteSpace($npx) -and (Test-Path $npx)) {
        if (Invoke-Tool -ToolPath $npx -ToolArgs (@('vercel@latest') + $VercelArgsNormalized)) { exit 0 }
    }
}

# 4) npm exec vercel
$npmCmd = (& { (Get-Command npm -ErrorAction SilentlyContinue).Path })
if ($npmCmd) {
    if (Invoke-Tool -ToolPath $npmCmd -ToolArgs (@('exec','-y','vercel@latest','--') + $VercelArgsNormalized)) { exit 0 }
}

# 5) pnpm dlx vercel
$pnpmCmd = (& { (Get-Command pnpm -ErrorAction SilentlyContinue).Path })
if (-not $pnpmCmd) { $pnpmCmd = "C:\\nvm4w\\nodejs\\pnpm.CMD" }
if (Test-Path $pnpmCmd) {
    if (Invoke-Tool -ToolPath $pnpmCmd -ToolArgs (@('dlx','vercel@latest') + $VercelArgsNormalized)) { exit 0 }
}

# Fallback: Guidance (ASCII only to avoid encoding parse issues)
Write-Host ""; Write-Host "ERROR: Could not run Vercel CLI on this machine" -ForegroundColor Red
Write-Host ""; Write-Host "Use Vercel Dashboard as an alternative:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/nblues/chiangmaiusedcar-next" -ForegroundColor Blue
Write-Host ""; Write-Host "Or fix npm/node and install CLI:" -ForegroundColor Yellow
Write-Host "   1) Install Node.js LTS from https://nodejs.org/" -ForegroundColor Gray
Write-Host "   2) Open new PowerShell and run: npm install -g vercel" -ForegroundColor Gray
Write-Host "   3) Then run: vercel login" -ForegroundColor Gray
exit 1

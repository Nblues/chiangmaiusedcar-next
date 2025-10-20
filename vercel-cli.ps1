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

function Invoke-Tool {
    param(
        [string]$ToolPath,
        [string[]]$Args
    )
    if ([string]::IsNullOrWhiteSpace($ToolPath)) { return $false }
    if (-not (Test-Path $ToolPath)) { return $false }
    Write-Host "→ $ToolPath $($Args -join ' ')" -ForegroundColor DarkGray
    & $ToolPath @Args
    $code = $LASTEXITCODE
    if ($code -eq $null) { $code = 0 }
    if ($code -eq 0) { return $true } else { return $false }
}

Write-Host "🚀 Running Vercel CLI..." -ForegroundColor Cyan
if ($VercelArgs -and $VercelArgs.Length -gt 0) {
    Write-Host ("Command: vercel " + ($VercelArgs -join ' ')) -ForegroundColor Gray
}
Write-Host ""

# 1) Local portable binary (optional manual placement)
$localExe = Join-Path (Get-Location) 'vercel.exe'
if (Test-Path $localExe) {
    if (Invoke-Tool -ToolPath $localExe -Args $VercelArgs) { exit 0 }
}

# 2) Global vercel in PATH
$vercelCmd = (& { (Get-Command vercel -ErrorAction SilentlyContinue).Path })
if ($vercelCmd) {
    if (Invoke-Tool -ToolPath $vercelCmd -Args $VercelArgs) { exit 0 }
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
        if (Invoke-Tool -ToolPath $npx -Args (@('vercel@latest') + $VercelArgs)) { exit 0 }
    }
}

# 4) npm exec vercel
$npmCmd = (& { (Get-Command npm -ErrorAction SilentlyContinue).Path })
if ($npmCmd) {
    if (Invoke-Tool -ToolPath $npmCmd -Args (@('exec','-y','vercel@latest','--') + $VercelArgs)) { exit 0 }
}

# 5) pnpm dlx vercel
$pnpmCmd = (& { (Get-Command pnpm -ErrorAction SilentlyContinue).Path })
if (-not $pnpmCmd) { $pnpmCmd = "C:\\nvm4w\\nodejs\\pnpm.CMD" }
if (Test-Path $pnpmCmd) {
    if (Invoke-Tool -ToolPath $pnpmCmd -Args (@('dlx','vercel@latest') + $VercelArgs)) { exit 0 }
}

# Fallback: Guidance
Write-Host ""; Write-Host "❌ ไม่สามารถรัน Vercel CLI ได้ในเครื่องนี้" -ForegroundColor Red
Write-Host ""; Write-Host "📝 ใช้ Vercel Dashboard แทนได้ครบถ้วน:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/nblues/chiangmaiusedcar-next" -ForegroundColor Blue
Write-Host ""; Write-Host "หรือแก้ npm/node ตามคู่มือ (Option 2) แล้วติดตั้ง CLI:" -ForegroundColor Yellow
Write-Host "   1) ติดตั้ง Node.js LTS ใหม่จาก https://nodejs.org/" -ForegroundColor Gray
Write-Host "   2) เปิด PowerShell ใหม่ แล้วรัน: npm install -g vercel" -ForegroundColor Gray
Write-Host "   3) จากนั้นรัน: vercel login" -ForegroundColor Gray
exit 1

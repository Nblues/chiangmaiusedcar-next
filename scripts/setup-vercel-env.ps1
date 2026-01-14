# Script to setup Vercel Environment Variables
# Run this script with: .\setup-vercel-env.ps1
#
# Security:
# - Do not hardcode secrets in this file.
# - Provide values via environment variables or interactive prompts.
# - Uses `--force` to be idempotent and `--sensitive` for secrets.

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Green
Write-Host ""

# Run from repository root (so `vercel link` and config resolution are correct)
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    pnpm add -g vercel
}

Write-Host "📝 Adding Environment Variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Ensure project is linked
try {
    vercel link --yes | Out-Null
} catch {
    Write-Host "❌ Failed to link Vercel project. Run 'vercel link' manually." -ForegroundColor Red
    throw
}

function Get-OrPrompt([string]$Name, [string]$Prompt) {
    $val = [Environment]::GetEnvironmentVariable($Name)
    if (-not [string]::IsNullOrWhiteSpace($val)) { return $val }
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

function Set-VercelEnv([string]$Name, [string]$Value, [string]$Environment, [switch]$Sensitive) {
    if ([string]::IsNullOrWhiteSpace($Value)) {
        throw "Missing required value: $Name"
    }
    $args = @('env', 'add', $Name, $Environment, '--force')
    if ($Sensitive) { $args += '--sensitive' }
    $Value | & vercel @args | Out-Null
    Write-Host "  ✅ $Name ($Environment)" -ForegroundColor Green
}

$targetEnvs = @('production', 'preview', 'development')

$adminUser = Get-OrPrompt -Name 'ADMIN_USERNAME' -Prompt 'ADMIN_USERNAME (non-sensitive)'
$adminPass = Get-OrPromptSecret -Name 'ADMIN_PASSWORD' -Prompt 'ADMIN_PASSWORD (sensitive)'
$sessionSecret = Get-OrPromptSecret -Name 'SESSION_SECRET' -Prompt 'SESSION_SECRET (sensitive, random 32+ chars)'

foreach ($env in $targetEnvs) {
    Set-VercelEnv -Name 'ADMIN_USERNAME' -Value $adminUser -Environment $env
    Set-VercelEnv -Name 'ADMIN_PASSWORD' -Value $adminPass -Environment $env -Sensitive
    Set-VercelEnv -Name 'SESSION_SECRET' -Value $sessionSecret -Environment $env -Sensitive
}

Write-Host ""
Write-Host "✅ Environment variables added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Now deploying to apply changes..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✨ Done! Your admin login should now work." -ForegroundColor Green

# Vercel CLI Wrapper - Easy Access
# Usage: .\scripts\vercel.ps1 <command>
# Example: .\scripts\vercel.ps1 list
#          .\scripts\vercel.ps1 env ls

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

$vercelPath = "C:\Users\Admin\AppData\Roaming\npm\node_modules\vercel\dist\vc.js"

if (-not (Test-Path $vercelPath)) {
    Write-Host "❌ Vercel CLI not found at: $vercelPath" -ForegroundColor Red
    Write-Host "Please install: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Vercel CLI" -ForegroundColor Cyan
node $vercelPath @Args

param(
  [string]$SecretsPath = 'C:\project davelopper\.secrets\api-auth.local.json'
)

Write-Host "==> Setting API_SECRET in Vercel (production) from: $SecretsPath" -ForegroundColor Cyan
if (-not (Test-Path $SecretsPath)) { Write-Error "Secrets file not found: $SecretsPath"; exit 1 }

try {
  $obj = Get-Content -Raw -Path $SecretsPath | ConvertFrom-Json
  $secret = $obj.apiSecret
  if (-not $secret) { Write-Error 'apiSecret missing in secrets file'; exit 1 }
} catch {
  Write-Error $_
  exit 1
}

$tmp = New-TemporaryFile
[System.IO.File]::WriteAllText($tmp, $secret, [System.Text.UTF8Encoding]::new($false))

Write-Host 'Removing existing API_SECRET (ignore errors if not present)...' -ForegroundColor DarkGray
cmd /c vercel env rm API_SECRET production --yes | Out-Null

Write-Host 'Adding API_SECRET to production...' -ForegroundColor Yellow
cmd /c type $tmp | vercel env add API_SECRET production

Remove-Item $tmp -Force -ErrorAction SilentlyContinue
Write-Host 'Done. You may need to redeploy: vercel deploy --prod --yes' -ForegroundColor Green

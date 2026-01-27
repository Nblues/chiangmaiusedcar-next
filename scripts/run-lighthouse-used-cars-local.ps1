param(
  [int]$Port = 3010,
  [string]$Route = '/used-cars-chiang-mai',
  [string]$ReportPath = 'logs/lighthouse-mobile-used-cars-chiang-mai.local.json',
  [int]$StartupTimeoutSec = 60
)

$ErrorActionPreference = 'Stop'

function Kill-Port([int]$port) {
  try {
    $pids = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)
    foreach ($pid in $pids) {
      if ($pid -and $pid -ne 0) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      }
    }
  } catch {
    # ignore
  }
}

Set-Location (Split-Path -Parent $PSScriptRoot)

Kill-Port $Port

$report = $ReportPath
$outLog = "logs/next-start-$Port.out.txt"
$errLog = "logs/next-start-$Port.err.txt"

foreach ($f in @($report, $outLog, $errLog)) {
  if (Test-Path $f) {
    Remove-Item $f -Force -ErrorAction SilentlyContinue
  }
}

$env:NODE_ENV = 'production'

$server = Start-Process -FilePath 'node' -ArgumentList @('.\\node_modules\\next\\dist\\bin\\next', 'start', '-p', "$Port") -PassThru -RedirectStandardOutput $outLog -RedirectStandardError $errLog -WindowStyle Hidden
Write-Host ("Started Next.js production server PID=$($server.Id) on :$Port")

try {
  $url = "http://127.0.0.1:$Port$Route"

  $ok = $false
  for ($i = 0; $i -lt $StartupTimeoutSec; $i++) {
    try {
      $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
        $ok = $true
        break
      }
    } catch {
      # ignore
    }
    Start-Sleep -Seconds 1
  }

  if (-not $ok) {
    Write-Host "Server not ready after ${StartupTimeoutSec}s: $url"
    Write-Host '--- next stderr (tail) ---'
    if (Test-Path $errLog) { Get-Content $errLog -Tail 200 }
    Write-Host '--- next stdout (tail) ---'
    if (Test-Path $outLog) { Get-Content $outLog -Tail 200 }
    throw "Server not ready on :$Port"
  }

  Write-Host "Server ready: $url"
  Write-Host 'Running Lighthouse (mobile, simulated throttling)...'

  $maxAttempts = 3
  $okReport = $false

  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    if (Test-Path $report) {
      Remove-Item $report -Force -ErrorAction SilentlyContinue
    }

    if ($attempt -gt 1) {
      Write-Host "Retrying Lighthouse ($attempt/$maxAttempts)..."
      Start-Sleep -Seconds 2
    }

    node .\\node_modules\\lighthouse\\cli\\index.js $url `
      --quiet `
      --emulated-form-factor=mobile `
      --throttling-method=simulate `
      --only-categories=performance `
      --only-categories=seo `
      --only-categories=accessibility `
      --only-categories=best-practices `
      --output=json `
      --output-path=$report `
      --chrome-flags='--headless --no-sandbox'

    if ($LASTEXITCODE -ne 0) {
      if ($attempt -eq $maxAttempts) {
        throw "Lighthouse failed (exit $LASTEXITCODE)"
      }
      continue
    }

    if (-not (Test-Path $report)) {
      if ($attempt -eq $maxAttempts) {
        throw "Lighthouse did not create report file: $report"
      }
      continue
    }

    try {
      $json = Get-Content $report -Raw | ConvertFrom-Json
      if ($null -ne $json.runtimeError) {
        Write-Host "Lighthouse runtimeError detected: $($json.runtimeError.code)"
        if ($attempt -eq $maxAttempts) {
          throw "Lighthouse produced runtimeError (code=$($json.runtimeError.code))"
        }
        continue
      }
    } catch {
      if ($attempt -eq $maxAttempts) {
        throw
      }
      continue
    }

    $okReport = $true
    break
  }

  if (-not $okReport) {
    throw 'Lighthouse failed to produce a valid report'
  }

  node scripts/summarize-lighthouse.mjs $report

} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  Kill-Port $Port
}

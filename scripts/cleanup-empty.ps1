param(
    [string]$Root = (Resolve-Path .).Path
)

$ErrorActionPreference = 'Stop'

# Excluded directory name fragments (match anywhere in full path)
$exclude = @('\node_modules\', '\.next\', '\.git\', '\.vercel\')

function Test-ExcludedPath {
    param([string]$Path)
    foreach ($frag in $exclude) {
        if ($Path -like "*${frag}*") { return $true }
    }
    return $false
}

if (-not (Test-Path -LiteralPath $Root)) {
    Write-Error "Root path not found: $Root"
}

$Root = (Resolve-Path -LiteralPath $Root).Path
Write-Host "Running cleanup in: $Root"

# 1) Delete zero-byte files
$deletedFiles = 0
Get-ChildItem -Path $Root -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -eq 0 -and -not (Test-ExcludedPath $_.FullName) } |
    ForEach-Object {
        try {
            Remove-Item -LiteralPath $_.FullName -Force -ErrorAction Stop
            $deletedFiles += 1
        } catch {}
    }

# 2) Iteratively remove empty directories (deepest first)
$deletedDirsTotal = 0
#do a few passes until stable
for ($pass = 1; $pass -le 5; $pass++) {
    $deletedDirs = 0
    # deepest paths first ensures children are removed before parents
    $dirs = Get-ChildItem -Path $Root -Recurse -Directory -Force -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending

    foreach ($d in $dirs) {
        if (Test-ExcludedPath $d.FullName) { continue }
        $children = Get-ChildItem -LiteralPath $d.FullName -Force -ErrorAction SilentlyContinue
        if (-not $children -or $children.Count -eq 0) {
            try {
                Remove-Item -LiteralPath $d.FullName -Force -ErrorAction Stop
                $deletedDirs += 1
            } catch {}
        }
    }

    if ($deletedDirs -eq 0) { break }
    $deletedDirsTotal += $deletedDirs
}

Write-Output ("Zero-byte files deleted: $deletedFiles")
Write-Output ("Empty directories deleted: $deletedDirsTotal")

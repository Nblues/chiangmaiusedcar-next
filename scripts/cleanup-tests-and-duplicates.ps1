param(
    [string]$Root = (Resolve-Path .).Path,
    [switch]$WhatIf
)

# Safety and excludes
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path -LiteralPath $Root).Path
$excludePathFragments = @('\node_modules\', '\.next\', '\.git\', '\.vercel\')

function Test-ExcludedPath {
    param([string]$Path)
    foreach ($frag in $excludePathFragments) { if ($Path -like "*${frag}*") { return $true } }
    return $false
}

Write-Host "Cleaning tests and duplicates in: $Root"

# 1) Remove common test files and folders
$testFilePatterns = @(
    '*.test.*','*.spec.*','jest.config.*','vitest.config.*','playwright.*','cypress.*','*.stories.*','*.story.*'
)
$testDirs = @('__tests__','tests','e2e','cypress')
$explicitFiles = @(
    'pages\test.jsx',
    'test-simple.jsx',
    'public\schema-test.html',
    'public\performance-test.html'
)

$deletedTestFiles = New-Object System.Collections.Generic.List[string]
$deletedTestDirs = New-Object System.Collections.Generic.List[string]

# Files by pattern
$files = Get-ChildItem -Path $Root -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object { -not (Test-ExcludedPath $_.FullName) }
foreach ($f in $files) {
    $name = $f.Name
    $isMatch = $false
    foreach ($pat in $testFilePatterns) { if ($name -like $pat) { $isMatch = $true; break } }
    if ($isMatch) {
        if ($WhatIf) { Write-Host "Would delete test file: $($f.FullName)" } else {
            try { Remove-Item -LiteralPath $f.FullName -Force -ErrorAction Stop; $deletedTestFiles.Add($f.FullName) } catch {}
        }
    }
}

# Explicit files
foreach ($rel in $explicitFiles) {
    $full = Join-Path $Root $rel
    if (Test-Path -LiteralPath $full) {
        if (-not (Test-ExcludedPath $full)) {
            if ($WhatIf) { Write-Host "Would delete explicit test file: $full" } else {
                try { Remove-Item -LiteralPath $full -Force -ErrorAction Stop; $deletedTestFiles.Add($full) } catch {}
            }
        }
    }
}

# Test directories
$dirs = Get-ChildItem -Path $Root -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { -not (Test-ExcludedPath $_.FullName) }
foreach ($d in $dirs) {
    if ($testDirs -contains $d.Name) {
        if ($WhatIf) { Write-Host "Would delete test dir: $($d.FullName)" } else {
            try { Remove-Item -LiteralPath $d.FullName -Recurse -Force -ErrorAction Stop; $deletedTestDirs.Add($d.FullName) } catch {}
        }
    }
}

# 2) Remove duplicate files by content hash with priority rules
# Priority: keep files in these roots over others
$keepPriority = @('pages','components','lib','public','app','scripts','styles','config')
$lowPriorityHints = @('deployment_source','deployment-july19','backup','old')

$allFiles = Get-ChildItem -Path $Root -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object { -not (Test-ExcludedPath $_.FullName) }

# Build hash map: SHA256 -> list of files
$hashGroups = @{}
foreach ($file in $allFiles) {
    try {
        $h = (Get-FileHash -Algorithm SHA256 -LiteralPath $file.FullName -ErrorAction Stop).Hash
        if (-not $hashGroups.ContainsKey($h)) { $hashGroups[$h] = New-Object System.Collections.Generic.List[object] }
        $hashGroups[$h].Add($file)
    } catch {}
}

$deletedDuplicates = New-Object System.Collections.Generic.List[string]

function Get-RootSegment([string]$path, [string]$base) {
    $rel = $path.Substring($base.Length).TrimStart('\\')
    $first = $rel.Split([IO.Path]::DirectorySeparatorChar)[0]
    return $first
}

foreach ($entry in $hashGroups.GetEnumerator()) {
    $filesWithSameHash = $entry.Value
    if ($filesWithSameHash.Count -le 1) { continue }

    # Decide which file to keep
    $ranked = $filesWithSameHash | ForEach-Object {
        $rootSeg = Get-RootSegment $_.FullName $Root
        $pri = ($keepPriority.IndexOf($rootSeg))
        if ($pri -lt 0) { $pri = 999 } # lowest priority if not listed
        $lowHint = ($lowPriorityHints | Where-Object { $_ -and $_ -ne '' -and $_ -in $_.FullName })
        $lowPenalty = if ($lowHint) { 100 } else { 0 }
        [PSCustomObject]@{ File=$_; Score=($pri + $lowPenalty) }
    } | Sort-Object Score, @{Expression={$_.File.FullName.Length}; Ascending=$true}

    $toKeep = $ranked[0].File

    foreach ($cand in $filesWithSameHash) {
        if ($cand.FullName -ne $toKeep.FullName) {
            if ($WhatIf) {
                Write-Host "Would delete duplicate: $($cand.FullName) (keep -> $($toKeep.FullName))"
            } else {
                try { Remove-Item -LiteralPath $cand.FullName -Force -ErrorAction Stop; $deletedDuplicates.Add($cand.FullName) } catch {}
            }
        }
    }
}

Write-Output ("Test files deleted: $($deletedTestFiles.Count)")
Write-Output ("Test directories deleted: $($deletedTestDirs.Count)")
Write-Output ("Duplicate files deleted: $($deletedDuplicates.Count)")

# Print small samples for transparency
if ($deletedTestFiles.Count -gt 0) { Write-Host "Sample test files:"; $deletedTestFiles | Select-Object -First 5 | ForEach-Object { Write-Host " - $_" } }
if ($deletedTestDirs.Count -gt 0) { Write-Host "Sample test dirs:"; $deletedTestDirs | Select-Object -First 5 | ForEach-Object { Write-Host " - $_" } }
if ($deletedDuplicates.Count -gt 0) { Write-Host "Sample duplicates:"; $deletedDuplicates | Select-Object -First 5 | ForEach-Object { Write-Host " - $_" } }

param(
  [string]$Url = 'http://127.0.0.1:3010/'
)

$ErrorActionPreference = 'Stop'

function IsAbsUrl([object]$value) {
  return ($value -is [string]) -and ($value -match '^https?://')
}

function IsNumericValue([object]$value) {
  if ($value -is [double] -or $value -is [int] -or $value -is [decimal]) { return $true }
  return ($value -is [string]) -and ($value -match '^\d+(\.\d+)?$')
}

function NormalizeToArray([object]$value) {
  if ($null -eq $value) { return @() }
  if ($value -is [System.Array]) { return $value }
  return @($value)
}

$resp = Invoke-WebRequest -Uri $Url -UseBasicParsing
$html = $resp.Content

$re = [regex]::new('<script[^>]*type=["'']application/ld\+json["''][^>]*>([\s\S]*?)</script>', 'IgnoreCase')
$matches = $re.Matches($html)

$blocks = @()
foreach ($m in $matches) { $blocks += $m.Groups[1].Value }

$products = @()
foreach ($raw in $blocks) {
  $obj = $raw | ConvertFrom-Json

  foreach ($x in (NormalizeToArray $obj)) {
    if ($null -ne $x -and $x.'@type' -eq 'ItemList') {
      foreach ($el in (NormalizeToArray $x.itemListElement)) {
        $it = $el.item
        if ($null -ne $it -and $it.'@type' -eq 'Product') {
          $products += ,$it
        }
      }
    }
  }
}

$bad = 0
foreach ($p in $products) {
  if (-not (IsAbsUrl $p.url)) { $bad++ }

  if ($null -eq $p.offers) {
    $bad++
    continue
  }

  if (-not (IsAbsUrl $p.offers.url)) { $bad++ }
  if (-not (IsNumericValue $p.offers.price)) { $bad++ }

  $imgs = NormalizeToArray $p.image
  if ($imgs.Count -eq 0) {
    $bad++
  } else {
    foreach ($img in $imgs) {
      if (-not (IsAbsUrl $img)) { $bad++; break }
    }
  }
}

Write-Output ("status={0} blocks={1} products={2} bad={3}" -f $resp.StatusCode, $blocks.Count, $products.Count, $bad)
if ($bad -gt 0) { exit 1 }

$content = Get-Content lib/shopify/queries.mjs -Raw
$content = $content -replace '\{ namespace: "spec", key: "fuel_type" \}', '{ namespace: "spec", key: "fuel_type" }
                  { namespace: "custom", key: "fuel-type" }
                  { namespace: "custom", key: "fuel_type" }
                  { namespace: "shopify", key: "fuel-supply" }'

$content = $content -replace '\{ namespace: "spec", key: "drive_type" \}', '{ namespace: "spec", key: "drive_type" }
                  { namespace: "custom", key: "drive-type" }
                  { namespace: "custom", key: "wheel-drive" }
                  { namespace: "spec", key: "drive-type" }
                  { namespace: "spec", key: "wheel-drive" }'

$content = $content -replace '\{ namespace: "spec", key: "year" \}', '{ namespace: "spec", key: "year" }
                  { namespace: "custom", key: "year" }'

$content = $content -replace '\{ namespace: "spec", key: "mileage" \}', '{ namespace: "spec", key: "mileage" }
                  { namespace: "custom", key: "mileage" }'

$content | Set-Content lib/shopify/queries.mjs

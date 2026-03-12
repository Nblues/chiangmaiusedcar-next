$file = "pages/car/[handle].jsx"
$content = Get-Content -LiteralPath $file -Raw
$content = $content -replace "drivetrain: c.drivetrain \|\| c.drive_type,", "drivetrain: c.drivetrain || c.drive_type || c.wheel_drive,"
Set-Content -LiteralPath $file -Value $content

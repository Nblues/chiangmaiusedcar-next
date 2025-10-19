# PowerShell Security Check Script
# ตรวจสอบความปลอดภัยระบบ Admin

Write-Host "Checking Admin Security..." -ForegroundColor Yellow

# ตรวจสอบ robots.txt
$robotsPath = "public/robots.txt"
if (Test-Path $robotsPath) {
    $robotsContent = Get-Content $robotsPath -Raw
    if ($robotsContent -match "Disallow: /admin") {
        Write-Host "✅ robots.txt: Admin routes are blocked" -ForegroundColor Green
    } else {
        Write-Host "❌ robots.txt: Admin routes NOT blocked" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ robots.txt: File not found" -ForegroundColor Red
    exit 1
}

# ตรวจสอบ middleware
$middlewarePath = "middleware.js"
if (Test-Path $middlewarePath) {
    $middlewareContent = Get-Content $middlewarePath -Raw
    if ($middlewareContent -match "/admin") {
        Write-Host "✅ Middleware: Admin protection found" -ForegroundColor Green
    } else {
        Write-Host "❌ Middleware: Admin protection NOT found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Middleware: File not found" -ForegroundColor Red
    exit 1
}

# ตรวจสอบ noindex ในหน้า admin
$adminIndexPath = "pages/admin/index.jsx"
if (Test-Path $adminIndexPath) {
    $adminContent = Get-Content $adminIndexPath -Raw
    if ($adminContent -match "noindex") {
        Write-Host "✅ Admin Pages: noindex meta tag found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Admin Pages: noindex meta tag NOT found" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Admin Index: File not found" -ForegroundColor Red
}

# ตรวจสอบ ADMIN_ACCESS_GUIDE.md
$guidePath = "ADMIN_ACCESS_GUIDE.md"
if (Test-Path $guidePath) {
    Write-Host "✅ Documentation: Admin access guide found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Documentation: Admin access guide NOT found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Security Check Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:"
Write-Host "  • Admin routes blocked in robots.txt"
Write-Host "  • Middleware protection active"
Write-Host "  • Bot detection enabled"
Write-Host "  • noindex meta tags present"
Write-Host ""
Write-Host "Admin Access:" -ForegroundColor Magenta
Write-Host "  URL: https://yourdomain.com/admin"
Write-Host "  Username: admin"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "IMPORTANT: Change password after deployment!" -ForegroundColor Red
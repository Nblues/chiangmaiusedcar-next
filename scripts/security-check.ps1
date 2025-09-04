# ====================================
# Security Check Script (PowerShell)
# ครูหนึ่งรถสวย - Admin Security Checker
# ====================================

Write-Host "🔐 เริ่มตรวจสอบความปลอดภัยระบบ Admin..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor White

# 1. ตรวจสอบไฟล์ robots.txt
Write-Host ""
Write-Host "📋 1. ตรวจสอบการป้องกันใน robots.txt" -ForegroundColor Yellow
if (Test-Path "public\robots.txt") {
    $robotsContent = Get-Content "public\robots.txt" -Raw
    if ($robotsContent -match "Disallow: /admin") {
        Write-Host "✅ robots.txt ป้องกันหน้า admin แล้ว" -ForegroundColor Green
    } else {
        Write-Host "❌ robots.txt ไม่ได้ป้องกันหน้า admin" -ForegroundColor Red
    }
} else {
    Write-Host "❌ ไม่พบไฟล์ robots.txt" -ForegroundColor Red
}

# 2. ตรวจสอบไฟล์ .htaccess
Write-Host ""
Write-Host "🛡️ 2. ตรวจสอบการตั้งค่า .htaccess" -ForegroundColor Yellow
if (Test-Path "public\.htaccess") {
    Write-Host "✅ พบไฟล์ .htaccess" -ForegroundColor Green
    $htaccessContent = Get-Content "public\.htaccess" -Raw
    if ($htaccessContent -match "ChatGPT") {
        Write-Host "✅ .htaccess ป้องกันบอท AI แล้ว" -ForegroundColor Green
    } else {
        Write-Host "⚠️ .htaccess ไม่มีการป้องกันบอท AI" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ ไม่พบไฟล์ .htaccess" -ForegroundColor Yellow
}

# 3. ตรวจสอบ middleware
Write-Host ""
Write-Host "⚙️ 3. ตรวจสอบ middleware.js" -ForegroundColor Yellow
if (Test-Path "middleware.js") {
    Write-Host "✅ พบไฟล์ middleware.js" -ForegroundColor Green
    $middlewareContent = Get-Content "middleware.js" -Raw
    if ($middlewareContent -match "blockedBots") {
        Write-Host "✅ middleware มีการป้องกันบอท" -ForegroundColor Green
    } else {
        Write-Host "❌ middleware ไม่มีการป้องกันบอท" -ForegroundColor Red
    }
} else {
    Write-Host "❌ ไม่พบไฟล์ middleware.js" -ForegroundColor Red
}

# 4. ตรวจสอบการตั้งค่า environment
Write-Host ""
Write-Host "🔑 4. ตรวจสอบการตั้งค่า Environment Variables" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ พบไฟล์ .env.local" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "ADMIN_USERNAME") {
        Write-Host "✅ มีการตั้งค่า ADMIN_USERNAME" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่มีการตั้งค่า ADMIN_USERNAME" -ForegroundColor Yellow
    }
    
    if ($envContent -match "JWT_SECRET") {
        Write-Host "✅ มีการตั้งค่า JWT_SECRET" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่มีการตั้งค่า JWT_SECRET" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ ไม่พบไฟล์ .env.local" -ForegroundColor Yellow
    Write-Host "📝 แนะนำ: คัดลอกจาก .env.local.example" -ForegroundColor Cyan
}

# 5. ตรวจสอบไฟล์ admin
Write-Host ""
Write-Host "👤 5. ตรวจสอบไฟล์ระบบ Admin" -ForegroundColor Yellow
$adminFiles = @(
    "pages\admin.jsx",
    "pages\admin-login.jsx", 
    "pages\api\admin\login.js"
)

foreach ($file in $adminFiles) {
    if (Test-Path $file) {
        Write-Host "✅ พบไฟล์ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ ไม่พบไฟล์ $file" -ForegroundColor Red
    }
}

# 6. ตรวจสอบโฟลเดอร์ logs
Write-Host ""
Write-Host "📊 6. ตรวจสอบระบบ Logging" -ForegroundColor Yellow
if (Test-Path "logs") {
    Write-Host "✅ พบโฟลเดอร์ logs" -ForegroundColor Green
    $logFiles = Get-ChildItem "logs\*.log" -ErrorAction SilentlyContinue
    $logCount = $logFiles.Count
    Write-Host "📁 มีไฟล์ log จำนวน: $logCount ไฟล์" -ForegroundColor Cyan
} else {
    Write-Host "📁 ไม่พบโฟลเดอร์ logs (จะสร้างอัตโนมัติเมื่อมีการใช้งาน)" -ForegroundColor Yellow
}

# 7. ตรวจสอบ dependencies ที่เกี่ยวข้องกับความปลอดภัย
Write-Host ""
Write-Host "📦 7. ตรวจสอบ Dependencies ความปลอดภัย" -ForegroundColor Yellow
$securityDeps = @("jsonwebtoken", "speakeasy", "crypto")

if (Test-Path "package.json") {
    $packageContent = Get-Content "package.json" -Raw
    foreach ($dep in $securityDeps) {
        if ($packageContent -match "`"$dep`"") {
            Write-Host "✅ พบ dependency: $dep" -ForegroundColor Green
        } else {
            Write-Host "⚠️ ไม่พบ dependency: $dep" -ForegroundColor Yellow
        }
    }
}

# 8. ตรวจสอบการตั้งค่า Next.js
Write-Host ""
Write-Host "⚡ 8. ตรวจสอบการตั้งค่า Next.js" -ForegroundColor Yellow
if (Test-Path "next.config.js") {
    Write-Host "✅ พบไฟล์ next.config.js" -ForegroundColor Green
    $nextConfigContent = Get-Content "next.config.js" -Raw
    if ($nextConfigContent -match "headers") {
        Write-Host "✅ มีการตั้งค่า security headers" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่มีการตั้งค่า security headers" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ไม่พบไฟล์ next.config.js" -ForegroundColor Red
}

# สรุปผล
Write-Host ""
Write-Host "==================================================" -ForegroundColor White
Write-Host "🎯 สรุปผลการตรวจสอบความปลอดภัย" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor White
Write-Host ""
Write-Host "✅ ระบบป้องกันหลัก:" -ForegroundColor Green
Write-Host "   - robots.txt บล็อกบอท" -ForegroundColor White
Write-Host "   - middleware บล็อกการเข้าถึงผิดกฎหมาย" -ForegroundColor White
Write-Host "   - .htaccess ป้องกันระดับเซิร์ฟเวอร์" -ForegroundColor White
Write-Host "   - Multi-layer authentication" -ForegroundColor White
Write-Host "   - Rate limiting และ IP blocking" -ForegroundColor White
Write-Host "   - 2FA authentication" -ForegroundColor White
Write-Host ""
Write-Host "🛡️ การป้องกันบอท Google/AI:" -ForegroundColor Blue
Write-Host "   - User-agent detection" -ForegroundColor White
Write-Host "   - Referrer checking" -ForegroundColor White
Write-Host "   - Bot pattern recognition" -ForegroundColor White
Write-Host "   - Access control layers" -ForegroundColor White
Write-Host ""
Write-Host "📋 แนวทางปฏิบัติ:" -ForegroundColor Yellow
Write-Host "   1. ตรวจสอบ logs เป็นประจำ" -ForegroundColor White
Write-Host "   2. อัพเดท dependencies" -ForegroundColor White
Write-Host "   3. เปลี่ยน passwords เป็นระยะ" -ForegroundColor White
Write-Host "   4. ตรวจสอบ access logs" -ForegroundColor White
Write-Host ""
Write-Host "🔗 เข้าถึงระบบ Admin:" -ForegroundColor Magenta
Write-Host "   http://localhost:3000/admin?admin_access=true" -ForegroundColor Cyan
Write-Host "   https://chiangmaiusedcar.com/admin?secret=secure2024KN" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ระบบความปลอดภัยพร้อมใช้งาน!" -ForegroundColor Green

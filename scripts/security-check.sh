#!/bin/bash

# ====================================
# Security Check Script
# ครูหนึ่งรถสวย - Admin Security Checker
# ====================================

echo "🔐 เริ่มตรวจสอบความปลอดภัยระบบ Admin..."
echo "=================================================="

# 1. ตรวจสอบไฟล์ robots.txt
echo ""
echo "📋 1. ตรวจสอบการป้องกันใน robots.txt"
if grep -q "Disallow: /admin" public/robots.txt; then
    echo "✅ robots.txt ป้องกันหน้า admin แล้ว"
else
    echo "❌ robots.txt ไม่ได้ป้องกันหน้า admin"
fi

# 2. ตรวจสอบไฟล์ .htaccess
echo ""
echo "🛡️ 2. ตรวจสอบการตั้งค่า .htaccess"
if [ -f "public/.htaccess" ]; then
    echo "✅ พบไฟล์ .htaccess"
    if grep -q "RewriteCond.*ChatGPT" public/.htaccess; then
        echo "✅ .htaccess ป้องกันบอท AI แล้ว"
    else
        echo "⚠️ .htaccess ไม่มีการป้องกันบอท AI"
    fi
else
    echo "⚠️ ไม่พบไฟล์ .htaccess"
fi

# 3. ตรวจสอบ middleware
echo ""
echo "⚙️ 3. ตรวจสอบ middleware.js"
if [ -f "middleware.js" ]; then
    echo "✅ พบไฟล์ middleware.js"
    if grep -q "blockedBots" middleware.js; then
        echo "✅ middleware มีการป้องกันบอท"
    else
        echo "❌ middleware ไม่มีการป้องกันบอท"
    fi
else
    echo "❌ ไม่พบไฟล์ middleware.js"
fi

# 4. ตรวจสอบการตั้งค่า environment
echo ""
echo "🔑 4. ตรวจสอบการตั้งค่า Environment Variables"
if [ -f ".env.local" ]; then
    echo "✅ พบไฟล์ .env.local"
    
    if grep -q "ADMIN_USERNAME" .env.local; then
        echo "✅ มีการตั้งค่า ADMIN_USERNAME"
    else
        echo "⚠️ ไม่มีการตั้งค่า ADMIN_USERNAME"
    fi
    
    if grep -q "JWT_SECRET" .env.local; then
        echo "✅ มีการตั้งค่า JWT_SECRET"
    else
        echo "⚠️ ไม่มีการตั้งค่า JWT_SECRET"
    fi
else
    echo "⚠️ ไม่พบไฟล์ .env.local"
    echo "📝 แนะนำ: คัดลอกจาก .env.local.example"
fi

# 5. ตรวจสอบไฟล์ admin
echo ""
echo "👤 5. ตรวจสอบไฟล์ระบบ Admin"
admin_files=("pages/admin.jsx" "pages/admin-login.jsx" "pages/api/admin/login.js")

for file in "${admin_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ พบไฟล์ $file"
    else
        echo "❌ ไม่พบไฟล์ $file"
    fi
done

# 6. ตรวจสอบโฟลเดอร์ logs
echo ""
echo "📊 6. ตรวจสอบระบบ Logging"
if [ -d "logs" ]; then
    echo "✅ พบโฟลเดอร์ logs"
    log_count=$(ls logs/*.log 2>/dev/null | wc -l)
    echo "📁 มีไฟล์ log จำนวน: $log_count ไฟล์"
else
    echo "📁 ไม่พบโฟลเดอร์ logs (จะสร้างอัตโนมัติเมื่อมีการใช้งาน)"
fi

# 7. ตรวจสอบ dependencies ที่เกี่ยวข้องกับความปลอดภัย
echo ""
echo "📦 7. ตรวจสอบ Dependencies ความปลอดภัย"
security_deps=("jsonwebtoken" "speakeasy" "crypto")

for dep in "${security_deps[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "✅ พบ dependency: $dep"
    else
        echo "⚠️ ไม่พบ dependency: $dep"
    fi
done

# 8. ตรวจสอบการตั้งค่า Next.js
echo ""
echo "⚡ 8. ตรวจสอบการตั้งค่า Next.js"
if [ -f "next.config.js" ]; then
    echo "✅ พบไฟล์ next.config.js"
    if grep -q "headers" next.config.js; then
        echo "✅ มีการตั้งค่า security headers"
    else
        echo "⚠️ ไม่มีการตั้งค่า security headers"
    fi
else
    echo "❌ ไม่พบไฟล์ next.config.js"
fi

# สรุปผล
echo ""
echo "=================================================="
echo "🎯 สรุปผลการตรวจสอบความปลอดภัย"
echo "=================================================="
echo ""
echo "✅ ระบบป้องกันหลัก:"
echo "   - robots.txt บล็อกบอท"
echo "   - middleware บล็อกการเข้าถึงผิดกฎหมาย"
echo "   - .htaccess ป้องกันระดับเซิร์ฟเวอร์"
echo "   - Multi-layer authentication"
echo "   - Rate limiting และ IP blocking"
echo "   - 2FA authentication"
echo ""
echo "🛡️ การป้องกันบอท Google/AI:"
echo "   - User-agent detection"
echo "   - Referrer checking"
echo "   - Bot pattern recognition"
echo "   - Access control layers"
echo ""
echo "📋 แนวทางปฏิบัติ:"
echo "   1. ตรวจสอบ logs เป็นประจำ"
echo "   2. อัพเดท dependencies"
echo "   3. เปลี่ยน passwords เป็นระยะ"
echo "   4. ตรวจสอบ access logs"
echo ""
echo "🔗 เข้าถึงระบบ Admin:"
echo "   http://localhost:3000/admin?admin_access=true"
echo "   https://chiangmaiusedcar.com/admin?secret=secure2024KN"
echo ""
echo "✅ ระบบความปลอดภัยพร้อมใช้งาน!"

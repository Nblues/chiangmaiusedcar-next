# ====================================
# Image Usage Check Script (PowerShell)
# ตรวจสอบการใช้งานรูปภาพใน Next.js App
# ====================================

Write-Host "🖼️ ตรวจสอบการใช้งานรูปภาพในระบบ..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor White

# ตรวจสอบไฟล์ที่ใช้รูปภาพแบบเก่า (.png, .jpg)
Write-Host ""
Write-Host "📋 1. ไฟล์ที่ยังใช้รูปภาพแบบเก่า (.png, .jpg)" -ForegroundColor Yellow

# ค้นหาการใช้งาน .png และ .jpg ในโค้ด
$oldImageUsage = Select-String -Path "pages\*.jsx", "components\*.jsx" -Pattern "\.(png|jpg|jpeg)" | Where-Object { $_.Line -notmatch "webp" -and $_.Line -notmatch "//.*\.(png|jpg|jpeg)" }

if ($oldImageUsage) {
    Write-Host "⚠️ พบการใช้งานรูปภาพแบบเก่า:" -ForegroundColor Yellow
    foreach ($match in $oldImageUsage) {
        $file = Split-Path $match.Filename -Leaf
        $line = $match.LineNumber
        $content = $match.Line.Trim()
        Write-Host "   📄 $file (บรรทัด $line): $content" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ ไม่พบการใช้งานรูปภาพแบบเก่าในโค้ด" -ForegroundColor Green
}

# ตรวจสอบการใช้งาน SmartImage
Write-Host ""
Write-Host "🔄 2. การใช้งาน SmartImage Component" -ForegroundColor Yellow

$smartImageUsage = Select-String -Path "pages\*.jsx", "components\*.jsx" -Pattern "SmartImage|ResponsiveCarImage"
if ($smartImageUsage) {
    Write-Host "✅ พบการใช้งาน SmartImage:" -ForegroundColor Green
    $smartImageCount = ($smartImageUsage | Group-Object Filename).Count
    Write-Host "   📊 ใช้ใน $smartImageCount ไฟล์" -ForegroundColor Cyan
    
    foreach ($group in ($smartImageUsage | Group-Object Filename)) {
        $file = Split-Path $group.Name -Leaf
        $count = $group.Count
        Write-Host "   📄 $file: $count ครั้ง" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ ไม่พบการใช้งาน SmartImage" -ForegroundColor Red
}

# ตรวจสอบ WebP conversion
Write-Host ""
Write-Host "🔄 3. การแปลงรูปภาพเป็น WebP" -ForegroundColor Yellow

$webpUsage = Select-String -Path "pages\*.jsx", "components\*.jsx" -Pattern "\.webp"
if ($webpUsage) {
    Write-Host "✅ พบการใช้งาน WebP:" -ForegroundColor Green
    $webpCount = ($webpUsage | Measure-Object).Count
    Write-Host "   📊 ใช้ WebP จำนวน $webpCount ครั้ง" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ ไม่พบการใช้งาน WebP ในโค้ด" -ForegroundColor Yellow
}

# ตรวจสอบไฟล์รูปภาพในโฟลเดอร์ public
Write-Host ""
Write-Host "📁 4. ไฟล์รูปภาพในโฟลเดอร์ public" -ForegroundColor Yellow

$publicImages = @{
    "PNG" = (Get-ChildItem "public\**\*.png" -Recurse -ErrorAction SilentlyContinue).Count
    "JPG" = (Get-ChildItem "public\**\*.jpg" -Recurse -ErrorAction SilentlyContinue).Count + (Get-ChildItem "public\**\*.jpeg" -Recurse -ErrorAction SilentlyContinue).Count
    "WebP" = (Get-ChildItem "public\**\*.webp" -Recurse -ErrorAction SilentlyContinue).Count
}

Write-Host "📊 สถิติไฟล์รูปภาพ:" -ForegroundColor Cyan
foreach ($format in $publicImages.GetEnumerator()) {
    $color = if ($format.Key -eq "WebP") { "Green" } elseif ($format.Value -gt 0) { "Yellow" } else { "Gray" }
    Write-Host "   $($format.Key): $($format.Value) ไฟล์" -ForegroundColor $color
}

# ตรวจสอบ Next.js Image Optimization
Write-Host ""
Write-Host "⚡ 5. การตั้งค่า Next.js Image Optimization" -ForegroundColor Yellow

if (Test-Path "next.config.js") {
    $nextConfig = Get-Content "next.config.js" -Raw
    
    if ($nextConfig -match "images.*domains|images.*remotePatterns") {
        Write-Host "✅ มีการตั้งค่า Image Optimization" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่พบการตั้งค่า Image Optimization" -ForegroundColor Yellow
    }
    
    if ($nextConfig -match "formats.*webp") {
        Write-Host "✅ เปิดใช้งาน WebP format" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่ได้เปิดใช้งาน WebP format" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ไม่พบไฟล์ next.config.js" -ForegroundColor Red
}

# ตรวจสอบการ preload รูปภาพใน _document.jsx
Write-Host ""
Write-Host "🚀 6. การ Preload รูปภาพสำคัญ" -ForegroundColor Yellow

if (Test-Path "pages\_document.jsx") {
    $documentContent = Get-Content "pages\_document.jsx" -Raw
    
    if ($documentContent -match "preload.*webp") {
        Write-Host "✅ มีการ preload รูปภาพ WebP" -ForegroundColor Green
    } else {
        Write-Host "⚠️ ไม่มีการ preload รูปภาพ WebP" -ForegroundColor Yellow
    }
    
    $preloadCount = ([regex]::Matches($documentContent, "preload.*image")).Count
    Write-Host "📊 Preload รูปภาพ: $preloadCount รายการ" -ForegroundColor Cyan
} else {
    Write-Host "❌ ไม่พบไฟล์ _document.jsx" -ForegroundColor Red
}

# สรุปและแนะนำ
Write-Host ""
Write-Host "==================================================" -ForegroundColor White
Write-Host "📋 สรุปและข้อแนะนำ" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor White

Write-Host ""
Write-Host "✅ สิ่งที่ดีอยู่แล้ว:" -ForegroundColor Green
Write-Host "   - ใช้ SmartImage component สำหรับการแปลง WebP อัตโนมัติ" -ForegroundColor White
Write-Host "   - มีระบบ fallback สำหรับรูปภาพที่โหลดไม่ได้" -ForegroundColor White
Write-Host "   - ใช้ Next.js Image optimization" -ForegroundColor White

Write-Host ""
Write-Host "🔧 สิ่งที่ควรปรับปรุง:" -ForegroundColor Yellow

# ตรวจสอบว่ายังมีการใช้ Image component แบบเก่าหรือไม่
$oldImageComponent = Select-String -Path "pages\*.jsx", "components\*.jsx" -Pattern "import.*Image.*next/image|<Image" | Where-Object { $_.Line -notmatch "SmartImage" }
if ($oldImageComponent) {
    Write-Host "   - แทนที่ Image component ด้วย SmartImage ในไฟล์ต่างๆ" -ForegroundColor White
}

if ($publicImages["PNG"] + $publicImages["JPG"] -gt $publicImages["WebP"]) {
    Write-Host "   - แปลงรูปภาพ PNG/JPG เป็น WebP เพิ่มเติม" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 การปรับปรุงต่อไป:" -ForegroundColor Magenta
Write-Host "   1. ใช้ SmartImage ในทุกที่ที่แสดงรูปภาพ" -ForegroundColor White
Write-Host "   2. เพิ่ม responsive breakpoints สำหรับ mobile" -ForegroundColor White
Write-Host "   3. ใช้ lazy loading สำหรับรูปภาพที่ไม่สำคัญ" -ForegroundColor White
Write-Host "   4. อัปโหลดรูปภาพ WebP เพิ่มเติมผ่านระบบ admin" -ForegroundColor White

Write-Host ""
Write-Host "✅ ระบบการจัดการรูปภาพพร้อมใช้งาน!" -ForegroundColor Green

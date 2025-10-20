# ============================================
# Vercel KV Setup Script (PowerShell)
# ============================================
# สคริปต์นี้จะช่วยตรวจสอบและ deploy หลังจากสร้าง KV database
# ============================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🚀 Vercel KV Setup Assistant" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Open browser to create KV
Write-Host " 📋 ขั้นตอนที่ 1: สร้าง KV Database" -ForegroundColor Yellow
Write-Host ""
Write-Host "    เปิด Browser ไปที่:" -ForegroundColor White
Write-Host "    https://vercel.com/new/storage/kv" -ForegroundColor Cyan
Write-Host ""
Write-Host "    1. เลือก Project: chiangmaiusedcar-setup" -ForegroundColor Gray
Write-Host "    2. Database Name: car-status-db" -ForegroundColor Gray
Write-Host "    3. Region: Singapore" -ForegroundColor Gray
Write-Host "    4. คลิก Create" -ForegroundColor Gray
Write-Host ""

# Open browser automatically
Start-Process "https://vercel.com/new/storage/kv"

Write-Host " 🔄 กด Enter เมื่อสร้าง KV เสร็จแล้ว..." -ForegroundColor Yellow
$null = Read-Host

Write-Host ""
Write-Host " ⏳ กำลังตรวจสอบ environment variables..." -ForegroundColor Cyan
Write-Host ""

# Step 2: Check if KV env vars exist
$envList = vercel env ls 2>&1
if ($envList -match "KV_REST_API_URL") {
    Write-Host " ✅ พบ KV_REST_API_URL!" -ForegroundColor Green
} else {
    Write-Host " ❌ ยังไม่พบ KV_REST_API_URL" -ForegroundColor Red
    Write-Host " โปรดตรวจสอบว่าสร้าง KV และ connect กับ project แล้ว" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if ($envList -match "KV_REST_API_TOKEN") {
    Write-Host " ✅ พบ KV_REST_API_TOKEN!" -ForegroundColor Green
} else {
    Write-Host " ❌ ยังไม่พบ KV_REST_API_TOKEN" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host " 🎉 KV Database พร้อมใช้งาน!" -ForegroundColor Green
Write-Host ""

# Step 3: Pull environment variables for local dev
Write-Host " 📥 กำลัง pull environment variables สำหรับ local dev..." -ForegroundColor Cyan
vercel env pull .env.local

if ($LASTEXITCODE -eq 0) {
    Write-Host " ✅ Pull env variables สำเร็จ!" -ForegroundColor Green
} else {
    Write-Host " ❌ Pull env variables ล้มเหลว" -ForegroundColor Red
}

Write-Host ""

# Step 4: Deploy to production
Write-Host " 🚀 พร้อม deploy production หรือยัง?" -ForegroundColor Yellow
Write-Host ""
Write-Host "    [Y] Deploy เลย (แนะนำ)" -ForegroundColor Green
Write-Host "    [N] ยังก่อน" -ForegroundColor Gray
Write-Host ""
$deploy = Read-Host " เลือก (Y/N)"

if ($deploy -eq "Y" -or $deploy -eq "y") {
    Write-Host ""
    Write-Host " 🚀 กำลัง deploy ไป production..." -ForegroundColor Cyan
    Write-Host ""
    
    vercel --prod --yes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host " ✅ Deploy สำเร็จ!" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host " 🎉 ระบบพร้อมใช้งานแล้ว!" -ForegroundColor Green
        Write-Host ""
        Write-Host " 🧪 ทดสอบ:" -ForegroundColor Yellow
        Write-Host "    1. เข้า https://www.chiangmaiusedcar.com/admin/cars" -ForegroundColor Cyan
        Write-Host "    2. Login Admin" -ForegroundColor White
        Write-Host "    3. กดปิดจองรถ" -ForegroundColor White
        Write-Host "    4. Refresh หน้า (F5)" -ForegroundColor White
        Write-Host "    5. ✅ สถานะยังคงเป็น 'จองแล้ว'" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host " ❌ Deploy ล้มเหลว" -ForegroundColor Red
        Write-Host " ลอง deploy ด้วยตนเอง: vercel --prod" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host " ⏭️  ข้าม deploy" -ForegroundColor Gray
    Write-Host ""
    Write-Host " เมื่อพร้อม deploy ให้รันคำสั่ง:" -ForegroundColor Yellow
    Write-Host "    vercel --prod" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""
Write-Host " 📊 สรุป:" -ForegroundColor Yellow
Write-Host ""
Write-Host "    ✅ KV Database: car-status-db" -ForegroundColor Green
Write-Host "    ✅ Environment Variables: KV_REST_API_*" -ForegroundColor Green
Write-Host "    ✅ Local .env.local: Updated" -ForegroundColor Green
Write-Host ""
Write-Host " 🎯 ระบบใหม่:" -ForegroundColor Yellow
Write-Host ""
Write-Host "    Shopify → ข้อมูลรถ (ยี่ห้อ, รุ่น, ราคา)" -ForegroundColor Cyan
Write-Host "    Vercel KV → สถานะเปิด/ปิดจอง (ถาวร!)" -ForegroundColor Cyan
Write-Host ""

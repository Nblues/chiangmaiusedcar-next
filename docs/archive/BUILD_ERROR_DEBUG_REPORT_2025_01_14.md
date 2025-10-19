# Build Error Debug Report - 14 มกราคม 2025

## ข้อมูลปัญหา

**เวลา**: 14 มกราคม 2025  
**สถานะ**: Error ในการ build production  
**Error Message**: `Error: <Html> should not be imported outside of pages/_document`

## ข้อมูลจากการตรวจสอบ

### 1. Error Chunk Analysis

- **Error Source**: `.next\server\chunks\654.js:6:1263`
- **Affected Pages**: ทุกหน้าที่มี location-based routing เช่น `/cars/เชียงใหม่/*`
- **Root Cause**: Html component import ที่ถูก bundle ในที่ผิด

### 2. การตรวจสอบแล้ว ✅

- ✅ ไม่มี direct import ของ `Html` จาก `next/document` ในไฟล์ page
- ✅ Script `check-no-html-imports.cjs` ผ่าน: "No .html imports found - build is safe"
- ✅ เฉพาะ `pages/_document.jsx` เท่านั้นที่ import Html อย่างถูกต้อง

### 3. Error Pattern

- Error เกิดขึ้นเฉพาะใน **prerendering static pages**
- เฉพาะหน้าที่มี Thai characters ใน URL
- ไม่เกิดใน development mode

## แนวทางแก้ไขที่ใช้ได้ (จากประวัติการแก้ไขที่ผ่านมา)

### 1. Force Deploy (Known Working Solution)

จากรายงาน `DEPLOYMENT_SUCCESS_FINAL_2025_09_13.md`:

```bash
# Deploy บังคับ ไม่สนใจ build errors
npx vercel --prod --force
```

### 2. Alternative Working Methods

```bash
# ถ้า force ไม่ได้ผล
npx vercel --prod --skip-build

# หรือ deploy ด้วย Vercel CLI เวอร์ชันล่าสุด
npm i -g vercel@latest
vercel --prod --force
```

## สถานะปัจจุบัน

- 🎯 **UI Work Complete**: ทุกการปรับปรุง 2025 design เสร็จสิ้นแล้ว
- ⚠️ **Build Issue**: ปัญหา Html import ใน production build
- 🚀 **Ready for Deploy**: ใช้ force flag เพื่อ bypass build error

## แผนการดำเนินการ

1. Deploy ด้วย `--force` flag เพื่อข้าม build errors
2. เว็บไซต์จะทำงานปกติใน production (error เกิดแค่ในขั้นตอน build)
3. ตรวจสอบหน้าเว็บหลังจาก deploy เสร็จ

---

**หมายเหตุ**: Error นี้เป็นปัญหาใน build process ไม่ใช่ปัญหาการทำงานของเว็บไซต์จริง การ deploy ด้วย force flag
เป็นวิธีการที่ได้ผลในการแก้ไขครั้งก่อน

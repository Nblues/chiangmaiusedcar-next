# 🔴 Vercel Deployment Error - วิธีแก้ไขทันที

**วันที่**: 13 มกราคม 2026  
**ปัญหา**: Deployments บน Vercel ล้มเหลวหลายครั้ง (สถานะสีแดง ❌)  
**Project**: chiangmaiusedcar-setup

---

## 📊 สรุปสถานะปัจจุบัน

### ✅ สิ่งที่ตรวจสอบแล้ว

- [x] **Environment Variables**: ครบถ้วนทั้งหมด (20 ตัว)
  - SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN
  - ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET
  - KV\_\* variables (6 ตัว)
  - NEXT*PUBLIC*\* variables (4 ตัว)
- [x] **Build ในเครื่อง**: สำเร็จปกติ

  - `pnpm build` ทำงานได้ 100%
  - สร้าง 84 หน้าสำเร็จ
  - ไม่มี error ใดๆ

- [x] **Build Command**: `pnpm build` (ถูกต้อง)

### ❌ ปัญหาที่พบ

จากการตรวจสอบ Vercel deployments ล่าสุด (10 ครั้ง):

- ✅ **Ready**: 3-4 deployments (9-15 ชม.ที่แล้ว)
- ❌ **Error**: 6-7 deployments (5-9 ชม.ที่แล้ว)
- ⏱️ **Duration**: Deployments ที่ error หยุดภายใน 4-10 วินาที (ปกติใช้เวลา 1+ นาที)

---

## 🎯 วิธีแก้ไขทันที (เลือก 1 วิธี)

### วิธีที่ 1: ตรวจสอบ Build Logs บน Vercel Dashboard (แนะนำ)

1. **เปิด Deployment ที่ล้มเหลว**:

   ```
   https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup
   ```

2. **คลิกที่ deployment ที่มีสถานะ ERROR (สีแดง)**

3. **ดูแท็บ "Building"** เพื่อดู error message ที่แท้จริง

4. **มองหา error patterns ทั่วไป**:
   - `FATAL ERROR: JavaScript heap out of memory` → Memory issue
   - `Error: Cannot find module` → Missing dependency
   - `ELIFECYCLE Command failed` → Build script issue
   - `ETIMEDOUT` → Network/API timeout

### วิธีที่ 2: Redeploy ใหม่

**Option A: ผ่าน Vercel Dashboard**

1. ไปที่: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup
2. คลิก "Deployments" tab
3. เลือก deployment ที่ล่าสุดที่ READY (สีเขียว)
4. คลิกปุ่ม "Redeploy" (มุมขวาบน)
5. เลือก "Use existing Build Cache" หรือ "Rebuild"

**Option B: ผ่าน Git (Trigger auto-deploy)**

```powershell
# สร้าง empty commit เพื่อ trigger deployment
git commit --allow-empty -m "chore: trigger Vercel redeploy"
git push origin master
```

### วิธีที่ 3: เพิ่ม Memory Limit (ถ้าเป็น memory issue)

แก้ไข `vercel.json`:

```json
{
  "functions": {
    "pages/**/*.js": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

### วิธีที่ 4: ลด Build Concurrency (ถ้า build หลายหน้าพร้อมกัน)

แก้ไข `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};
```

---

## 🔍 สาเหตุที่เป็นไปได้

### 1. Memory Exhaustion (น่าจะเป็นนี้มากที่สุด)

- Next.js build ใช้ memory สูง
- Vercel free tier: 1024 MB
- Vercel Pro tier: 3008 MB
- โปรเจ็กต์มี 84 หน้า + Shopify data fetching

**วิธีตรวจสอบ**: ดู error log จะมีคำว่า "heap out of memory"

### 2. Build Timeout

- Shopify API ช้าหรือ timeout
- Vercel build timeout: 45 นาที (Pro tier)
- แต่ deployment หยุดภายใน 10 วิ = น่าจะ crash ก่อน timeout

### 3. Missing Dependencies (ไม่น่าจะเป็น)

- Build ในเครื่องสำเร็จ = dependencies ครบ

### 4. Environment Variable Issue (ไม่น่าจะเป็น)

- ตรวจสอบแล้วครบทั้งหมด

---

## 📝 Action Items (ทำตามลำดับ)

- [ ] 1. เปิด Vercel Dashboard และดู build logs จาก deployment ที่ error
- [ ] 2. Copy error message และวิเคราะห์
- [ ] 3. ถ้าเป็น memory issue → เพิ่ม memory limit หรือ optimize build
- [ ] 4. ถ้าเป็น timeout → เพิ่ม cache หรือ reduce static pages
- [ ] 5. Redeploy ใหม่หลังแก้ไข
- [ ] 6. Monitor deployment จนเสร็จ

---

## 🛠️ Commands ที่ใช้ได้

```powershell
# Build test ในเครื่อง
pnpm build

# Clean build
pnpm build:clean
pnpm build

# Low memory build (สำหรับทดสอบ)
pnpm build:lowmem

# Redeploy ผ่าน Git
git commit --allow-empty -m "fix: redeploy after config changes"
git push origin master
```

---

## 📞 หากยังไม่ได้

1. **Check Vercel Status**: https://www.vercel-status.com/
2. **Contact Vercel Support**: support@vercel.com
3. **Community**: https://github.com/vercel/vercel/discussions

---

## 📌 Links สำคัญ

- **Dashboard**: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup
- **Deployments**: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup/deployments
- **Settings**: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup/settings
- **Env Variables**: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup/settings/environment-variables

---

**หมายเหตุ**: ปัญหาน่าจะเกิดจาก **memory limit** เพราะ:

- Build หยุดเร็วมาก (4-10 วิ)
- Build ในเครื่องสำเร็จ (มี memory มากกว่า)
- โปรเจ็กต์มี 84 หน้า + Shopify API calls

**แนะนำ**: ดู build logs ก่อน แล้วค่อยแก้ตามสาเหตุที่แท้จริง

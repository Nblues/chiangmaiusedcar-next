# 🚨 Vercel Environment Variables Setup (URGENT)

**ปัญหา**: Admin login ไม่ได้บน production  
**สาเหตุ**: ยังไม่ได้ตั้งค่า Environment Variables บน Vercel

---

## ⚡ แก้ไขด่วน (5 นาที)

### 1. เข้า Vercel Dashboard

```
https://vercel.com/dashboard
```

### 2. เลือก Project

คลิกที่โปรเจค: **chiangmaiusedcar-next** (หรือชื่อที่คุณตั้งไว้)

### 3. ไปที่ Settings

```
Project > Settings > Environment Variables
```

### 4. เพิ่ม Environment Variables (คัดลอกทั้งหมด)

กดปุ่ม **"Add New"** แล้วใส่ทีละตัว:

---

### 🔐 Admin Authentication (สำคัญที่สุด!)

```env
ADMIN_USERNAME
kngoodcar
```

```env
ADMIN_PASSWORD
<YOUR_ADMIN_PASSWORD>
```

```env
SESSION_SECRET
chiangmai-usedcar-secure-session-2025-production-secret-key
```

```env
CRON_SECRET
cron-backup-secret-key-2025-production
```

---

### 🛍️ Shopify (ถ้ามี)

```env
SHOPIFY_DOMAIN
kn-goodcar.com
```

```env
SHOPIFY_STOREFRONT_TOKEN
<SHOPIFY_STOREFRONT_TOKEN>
```

```env
SHOPIFY_ADMIN_TOKEN
(ถ้ามี - สำหรับ toggle car status)
```

---

### 📧 EmailJS

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID
service_qlcksif
```

```env
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
template_zd6e3f6
```

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
P3wnNJB_Y_PddrdBJ
```

---

### 🌐 Site Configuration

```env
NEXT_PUBLIC_SITE_URL
https://www.chiangmaiusedcar.com
```

```env
NEXT_PUBLIC_GA_ID
(ถ้ามี Google Analytics)
```

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID
(ถ้ามี Facebook Pixel)
```

---

### 🔑 reCAPTCHA (ถ้ามี)

```env
RECAPTCHA_SECRET_KEY
(ถ้ามี)
```

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
(ถ้ามี)
```

---

### 🔥 Firebase (สำหรับ Backup - Optional)

```env
FIREBASE_PROJECT_ID
(ถ้าต้องการ Firebase backup)
```

```env
FIREBASE_CLIENT_EMAIL
(ถ้าต้องการ Firebase backup)
```

```env
FIREBASE_PRIVATE_KEY
(ถ้าต้องการ Firebase backup)
```

```env
FIREBASE_STORAGE_BUCKET
(ถ้าต้องการ Firebase backup)
```

---

## 5. เลือก Environment

**สำคัญ!** เลือกว่าจะใช้ env นี้กับ environment ไหน:

- ✅ **Production** (ต้องเลือก!)
- ✅ **Preview** (แนะนำ)
- ⬜ **Development** (ไม่จำเป็น)

---

## 6. Save และ Redeploy

### วิธีที่ 1: Redeploy ผ่าน Dashboard

1. กลับไปที่ **Deployments**
2. เลือก deployment ล่าสุด
3. กดปุ่ม **"..."** (3 จุด)
4. เลือก **"Redeploy"**
5. เลือก **"Use existing Build Cache"** หรือไม่ก็ได้
6. กด **"Redeploy"**

### วิธีที่ 2: Push commit ใหม่

```bash
# เพิ่มไฟล์อะไรก็ได้เพื่อ trigger deploy
git commit --allow-empty -m "🔧 Trigger redeploy after env setup"
git push origin master
```

---

## 7. รอ Deployment (2-3 นาที)

ดูสถานะที่:

```
Deployments > Latest
```

เมื่อสถานะเป็น **"Ready"** ✅

---

## 8. ทดสอบ Login

เข้า:

```
https://www.chiangmaiusedcar.com/admin/login
```

ใส่:

```
Username: kngoodcar
Password: <YOUR_ADMIN_PASSWORD>
```

---

## 🔍 ตรวจสอบว่า ENV ตั้งค่าแล้ว

### จาก Vercel Dashboard:

```
Settings > Environment Variables
```

ต้องเห็น:

- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD
- ✅ SESSION_SECRET
- ✅ NEXT_PUBLIC_SITE_URL
- และอื่นๆ

---

## ❌ ถ้ายังเข้าไม่ได้

### ตรวจสอบ:

1. **ใช้ URL ถูกต้องไหม?**

   - ❌ `https://chiangmaiusedcar.com/admin/login`
   - ✅ `https://www.chiangmaiusedcar.com/admin/login`

2. **ENV ตั้งค่าถูก Environment ไหม?**

   - ต้องเลือก **Production** ✅

3. **Redeploy แล้วหรือยัง?**

   - ENV ใหม่ต้อง redeploy ถึงจะใช้ได้

4. **ดู Logs:**

   ```
   Deployments > Latest > Runtime Logs
   ```

5. **ลอง Hard Refresh:**

   - กด `Ctrl + Shift + R` (Windows)
   - กด `Cmd + Shift + R` (Mac)

6. **ลบ Cookies:**
   - F12 > Application > Cookies > ลบทั้งหมด
   - ปิด browser แล้วเปิดใหม่

---

## 📝 Checklist

- [ ] เข้า Vercel Dashboard
- [ ] เพิ่ม ADMIN_USERNAME
- [ ] เพิ่ม ADMIN_PASSWORD
- [ ] เพิ่ม SESSION_SECRET
- [ ] เพิ่ม NEXT_PUBLIC_SITE_URL
- [ ] เลือก Environment = Production
- [ ] Save ทุก env variable
- [ ] Redeploy project
- [ ] รอ deployment เสร็จ (2-3 นาที)
- [ ] ทดสอบ login ที่ www.chiangmaiusedcar.com/admin/login
- [ ] ใช้ username: kngoodcar
- [ ] ใช้ password: <YOUR_ADMIN_PASSWORD>

---

## 🆘 ยังไม่ได้?

ส่งข้อมูลนี้มา:

1. Screenshot หน้า Vercel Environment Variables
2. Screenshot Runtime Logs
3. Screenshot Console (F12) เวลา login
4. URL ที่ใช้ login

---

## ⚡ Quick Fix Command

ถ้าต้องการ trigger redeploy ด่วน:

```powershell
# ใน PowerShell
cd "C:\project davelopper\chiangmaiusedcar-setup"
git commit --allow-empty -m "🔧 Trigger redeploy"
git push origin master
```

---

**Updated**: October 14, 2025  
**Priority**: 🔥 URGENT - ต้องทำก่อนใช้งาน production

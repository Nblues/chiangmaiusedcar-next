# คู่มือตั้งค่า Environment Variables บน Vercel

## ปัญหา: เข้าหน้าแอดมินบน Production ไม่ได้

**สาเหตุ**: Vercel ไม่มี environment variables สำหรับ admin authentication

---

## ขั้นตอนการแก้ไข (ใช้เวลา 5 นาที)

### 1. เข้า Vercel Dashboard

```
URL: https://vercel.com/dashboard
```

1. Login เข้า Vercel account
2. เลือกโปรเจค: **chiangmaiusedcar-next**
3. คลิกแท็บ **Settings**
4. เลือก **Environment Variables** (เมนูด้านซ้าย)

---

### 2. เพิ่ม Environment Variables

คลิก **Add New** และเพิ่มตัวแปรทั้ง 3 ตัวนี้:

#### **Variable 1: ADMIN_USERNAME**

```
Key: ADMIN_USERNAME
Value: <YOUR_ADMIN_USERNAME>
Environment: Production, Preview, Development (เลือกทั้ง 3)
```

#### **Variable 2: ADMIN_PASSWORD**

```
Key: ADMIN_PASSWORD
Value: <YOUR_ADMIN_PASSWORD>
Environment: Production, Preview, Development (เลือกทั้ง 3)
```

#### **Variable 3: SESSION_SECRET**

```
Key: SESSION_SECRET
Value: <RANDOM_32+_CHARS>
Environment: Production, Preview, Development (เลือกทั้ง 3)
```

**หมายเหตุ**: SESSION_SECRET ต้องมีความยาว 32 ตัวอักษรขึ้นไป (ใช้ค่าข้างบนได้เลย)

---

### 3. Redeploy Production

หลังจากเพิ่ม environment variables แล้ว:

1. ไปที่แท็บ **Deployments**
2. คลิกที่ deployment ล่าสุด (commit: `530babd`)
3. คลิกปุ่ม **⋮** (three dots) ด้านขวา
4. เลือก **Redeploy**
5. เลือก **Use Existing Build Cache** (ไม่ต้องติ๊ก)
6. คลิก **Redeploy**

**รอ 2-3 นาที** ให้ Vercel redeploy เสร็จ

---

## 4. ทดสอบเข้าระบบ

### Production URLs:

```
Login: https://www.chiangmaiusedcar.com/admin/login
Dashboard: https://www.chiangmaiusedcar.com/admin/dashboard
Cars: https://www.chiangmaiusedcar.com/admin/cars
```

### ข้อมูลเข้าสู่ระบบ:

```
Username: kngoodcar
Password: <YOUR_ADMIN_PASSWORD>
```

---

## วิธีตรวจสอบว่า Deploy สำเร็จ

### ใน Vercel Dashboard:

1. เข้าแท็บ **Deployments**
2. ดูว่า deployment ล่าสุดมีสถานะ **Ready** (สีเขียว)
3. คลิกเข้าไปดู deployment log ว่าไม่มี error

### ทดสอบ API:

เปิด browser console แล้วพิมพ์:

```javascript
fetch('https://www.chiangmaiusedcar.com/api/admin/verify', {
  credentials: 'include',
})
  .then(r => r.json())
  .then(console.log);
```

**ผลลัพธ์ที่ควรได้** (ก่อนล็อกอิน):

```json
{
  "authenticated": false,
  "error": "Unauthorized"
}
```

---

## ปัญหาที่พบบ่อยและวิธีแก้

### 1. Error 401 Unauthorized

**สาเหตุ**: Environment variables ยังไม่ถูกโหลด **แก้ไข**: Redeploy อีกครั้ง (ไม่ใช้ cache)

### 2. Login ไม่ผ่าน แต่รหัสถูกต้อง

**สาเหตุ**: SESSION_SECRET ไม่ตรงกัน หรือ cookies ไม่ได้ถูก set **แก้ไข**:

- ตรวจสอบ SESSION_SECRET มีค่า
- Clear browser cookies สำหรับ chiangmaiusedcar.com
- ลองใช้ Incognito/Private browsing mode

### 3. Redirect loop

**สาเหตุ**: Middleware ไม่ทำงาน **แก้ไข**:

- ตรวจสอบว่ามีไฟล์ `middleware.js` ใน root directory
- Redeploy พร้อมลบ cache

### 4. Error 308 Permanent Redirect

**สาเหตุ**: ใช้ URL ไม่ถูกต้อง **แก้ไข**: ใช้ `https://www.chiangmaiusedcar.com` (มี www) แทน
`https://chiangmaiusedcar.com`

---

## สำหรับ Development (Local)

ตัวแปรใน `.env.local` ที่คุณมีอยู่แล้ว:

```env
# Admin Authentication
ADMIN_USERNAME=kngoodcar
ADMIN_PASSWORD=<YOUR_ADMIN_PASSWORD>
SESSION_SECRET=<YOUR_SESSION_SECRET>

# Shopify
SHOPIFY_DOMAIN=kn-goodcar.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-token-here

# EmailJS (if used)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx

# reCAPTCHA (if used)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
RECAPTCHA_SECRET_KEY=xxx
```

---

## Checklist การตั้งค่า

- [ ] เข้า Vercel Dashboard
- [ ] เพิ่ม ADMIN_USERNAME = kngoodcar
- [ ] เพิ่ม ADMIN_PASSWORD = <YOUR_ADMIN_PASSWORD>
- [ ] เพิ่ม SESSION_SECRET (ใช้ค่าที่สร้างไว้)
- [ ] เลือก Environment = Production, Preview, Development ทั้ง 3 ตัว
- [ ] บันทึก (Save)
- [ ] Redeploy production
- [ ] รอ 2-3 นาที
- [ ] ทดสอบเข้า https://www.chiangmaiusedcar.com/admin/login
- [ ] Login ด้วย kngoodcar / <YOUR_ADMIN_PASSWORD>
- [ ] ตรวจสอบว่าเข้า Dashboard ได้

---

## ติดต่อ/ขอความช่วยเหลือ

หากยังมีปัญหา ส่ง screenshot ของ:

1. Vercel Environment Variables page
2. Browser console errors (F12 → Console tab)
3. Vercel deployment logs

---

**อัปเดตล่าสุด**: 14 ตุลาคม 2025  
**Version**: v2.0.0-production-ready  
**Commit**: 530babd

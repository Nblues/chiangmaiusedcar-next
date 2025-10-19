# 🔧 คู่มือเพิ่ม Environment Variables ใน Vercel

## ⚠️ ปัญหาที่พบ

- www.chiangmaiusedcar.com/api/ping → 500 Error
- สาเหตุ: **ไม่มี Environment Variables ใน Vercel Project**

## ✅ วิธีแก้ไข (ทำใน Vercel Dashboard)

### ขั้นตอนที่ 1: เข้าสู่ Vercel Dashboard

1. เปิด https://vercel.com
2. Login เข้าสู่ระบบ
3. เลือก project **chiangmaiusedcar-next**

### ขั้นตอนที่ 2: เปิดหน้า Environment Variables

1. คลิกแท็บ **Settings** (ด้านบน)
2. เลื่อนลงหาเมนู **Environment Variables** (ด้านซ้าย)
3. คลิกเข้าไป

### ขั้นตอนที่ 3: เพิ่มตัวแปรทีละตัว

**สำคัญ:** ทุกตัวแปรเลือก Environment = **Production** เท่านั้น

#### 1. Shopify Configuration

**Key:** `SHOPIFY_DOMAIN`  
**Value:** `kn-goodcar.com`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `SHOPIFY_STOREFRONT_TOKEN`  
**Value:** `bb70cb008199a94b83c98df0e45ada67`  
**Environment:** Production  
คลิก **Add**

---

#### 2. Admin Authentication

**Key:** `ADMIN_USERNAME`  
**Value:** `kngoodcar`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `ADMIN_PASSWORD`  
**Value:** `Kn-goodcar**5277`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `SESSION_SECRET`  
**Value:** `production-secret-chiangmai-2025-rotate-regularly`  
**Environment:** Production  
คลิก **Add**

---

#### 3. Site Configuration

**Key:** `SITE_URL`  
**Value:** `https://www.chiangmaiusedcar.com`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `NEXT_PUBLIC_SITE_URL`  
**Value:** `https://www.chiangmaiusedcar.com`  
**Environment:** Production  
คลิก **Add**

---

#### 4. EmailJS (Optional - สำหรับฟอร์มติดต่อ)

**Key:** `NEXT_PUBLIC_EMAILJS_SERVICE_ID`  
**Value:** `service_qlcksif`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`  
**Value:** `template_zd6e3f6`  
**Environment:** Production  
คลิก **Add**

---

**Key:** `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`  
**Value:** `P3wnNJB_Y_PddrdBJ`  
**Environment:** Production  
คลิก **Add**

---

### ขั้นตอนที่ 4: Redeploy

หลังจากเพิ่มตัวแปรครบแล้ว:

1. ไปที่แท็บ **Deployments**
2. หา deployment ล่าสุด (commit `42b06c3` - "chore: add porting checklist...")
3. คลิกที่ deployment นั้น
4. คลิกปุ่ม **"Redeploy"** (ปุ่ม 3 จุดด้านขวาบน → Redeploy)
5. เลือก **"Use existing Build Cache"** (เร็วกว่า)
6. คลิก **Redeploy**

### ขั้นตอนที่ 5: รอและทดสอบ

1. รอ 2-3 นาที ให้ Vercel deploy เสร็จ
2. ดูสถานะใน Deployments tab จนเห็น **"Ready"**
3. ทดสอบ:

```powershell
# PowerShell command
Invoke-WebRequest -Uri "https://www.chiangmaiusedcar.com/api/ping" -UseBasicParsing

# Should return:
# StatusCode: 200
# Content: pong
```

---

## 📋 Checklist

- [ ] เพิ่ม SHOPIFY_DOMAIN
- [ ] เพิ่ม SHOPIFY_STOREFRONT_TOKEN
- [ ] เพิ่ม ADMIN_USERNAME
- [ ] เพิ่ม ADMIN_PASSWORD
- [ ] เพิ่ม SESSION_SECRET
- [ ] เพิ่ม SITE_URL
- [ ] เพิ่ม NEXT_PUBLIC_SITE_URL
- [ ] เพิ่ม NEXT_PUBLIC_EMAILJS_SERVICE_ID
- [ ] เพิ่ม NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
- [ ] เพิ่ม NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
- [ ] Redeploy project
- [ ] ทดสอบ /api/ping
- [ ] ทดสอบ /api/runtime-check
- [ ] ทดสอบ admin login
- [ ] ทดสอบ toggle reserved

---

## 🎯 ผลลัพธ์ที่คาดหวัง

หลัง redeploy เสร็จ:

✅ www.chiangmaiusedcar.com/api/ping → 200 "pong"  
✅ www.chiangmaiusedcar.com/api/runtime-check → 200 { ok: true }  
✅ Admin login ทำงานได้  
✅ Toggle reserved ทำงานได้  
✅ Analytics รับ string payload ได้

---

## 🆘 ถ้ายังไม่ได้

ถ้าหลัง redeploy แล้วยังได้ 500 Error:

1. ตรวจสอบว่าเพิ่มตัวแปรครบ 10 ตัว
2. ตรวจสอบว่าเลือก Environment = **Production**
3. ตรวจสอบว่า Value ไม่มีช่องว่างนำหน้าหรือท้าย
4. ดู Function Logs ใน deployment เพื่อหา error message ที่แท้จริง
5. ลอง **"Redeploy without cache"** แทน

---

## 📞 ติดปัญหา?

ถ้าทำตามแล้วยังไม่ได้ ให้:

1. Screenshot หน้า Environment Variables
2. Screenshot Function Logs (error message)
3. ส่งมาให้ผมดู

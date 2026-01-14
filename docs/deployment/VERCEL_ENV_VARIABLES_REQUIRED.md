# 🚨 ต้องตั้งค่า Environment Variables บน Vercel ด่วน

## ปัญหาที่เกิดขึ้น

**Admin authentication ไม่ทำงานบน Production** เพราะ Vercel ยังไม่มี environment variables ที่จำเป็น

---

## ✅ ขั้นตอนแก้ไข (5 นาที)

### 1️⃣ เข้า Vercel Dashboard

```text
🔗 https://vercel.com/dashboard
```

1. Login เข้า Vercel account ของคุณ
2. เลือกโปรเจค: **chiangmaiusedcar-next** หรือชื่อโปรเจคของคุณ
3. คลิกแท็บ **Settings** (ด้านบน)
4. เลือก **Environment Variables** จากเมนูด้านซ้าย

---

### 2️⃣ เพิ่ม Environment Variables ทั้ง 3 ตัวนี้

คลิกปุ่ม **Add New** แล้วเพิ่มทีละตัว:

#### Variable 1: ADMIN_USERNAME

```text
Name:        ADMIN_USERNAME
Value:       <YOUR_ADMIN_USERNAME>
Environment: ✅ Production  ✅ Preview  ✅ Development (เลือกทั้ง 3)
```

#### Variable 2: ADMIN_PASSWORD

```text
Name:        ADMIN_PASSWORD
Value:       <YOUR_ADMIN_PASSWORD>
Environment: ✅ Production  ✅ Preview  ✅ Development (เลือกทั้ง 3)
```

#### Variable 3: SESSION_SECRET

```text
Name:        SESSION_SECRET
Value:       <RANDOM_32+_CHARS>
Environment: ✅ Production  ✅ Preview  ✅ Development (เลือกทั้ง 3)
```

> **⚠️ สำคัญ**: SESSION_SECRET ต้องมีความยาวอย่างน้อย 32 ตัวอักษร (ค่าข้างบนใช้ได้เลย)

---

### 3️⃣ Redeploy Production

หลังจากเพิ่ม environment variables แล้ว **ต้อง redeploy** เพื่อให้ค่าใหม่มีผล:

#### วิธีที่ 1: Redeploy ผ่าน Vercel Dashboard

1. ไปที่แท็บ **Deployments**
2. คลิกที่ deployment ล่าสุด (มักอยู่บรรทัดแรก)
3. คลิกปุ่ม **⋮** (three dots) ที่มุมขวาบน
4. เลือก **Redeploy**
5. ✅ **ไม่ต้อง** เลือก "Use Existing Build Cache"
6. คลิก **Redeploy**

#### วิธีที่ 2: Push commit ใหม่ (อัตโนมัติ)

```bash
# ถ้าอยู่ใน repo git
git commit --allow-empty -m "chore: trigger redeploy for env vars"
git push origin master
```

**⏳ รอ 2-3 นาที** ให้ Vercel build และ deploy เสร็จ

---

## 4️⃣ ทดสอบเข้าระบบ

### URLs สำหรับ Production

```text
Login:     https://www.chiangmaiusedcar.com/admin/login
Dashboard: https://www.chiangmaiusedcar.com/admin/dashboard
Cars:      https://www.chiangmaiusedcar.com/admin/cars
Articles:  https://www.chiangmaiusedcar.com/admin/articles
```

### ข้อมูลเข้าสู่ระบบ

```text
👤 Username: <YOUR_ADMIN_USERNAME>
🔑 Password: <YOUR_ADMIN_PASSWORD>
```

---

## 🔍 ตรวจสอบว่าตั้งค่าสำเร็จ

### 1. ตรวจสอบ Environment Variables

ใน Vercel Dashboard → Settings → Environment Variables:

```text
✅ ADMIN_USERNAME        = kngoodcar
✅ ADMIN_PASSWORD        = <YOUR_ADMIN_PASSWORD>
✅ SESSION_SECRET        = <RANDOM_32+_CHARS>
```

### 2. ตรวจสอบ Deployment Status

ใน Vercel Dashboard → Deployments:

```text
✅ สถานะ: Ready (สีเขียว)
✅ มี Environment Variables ครบ
✅ ไม่มี error ใน deployment logs
```

### 3. ทดสอบผ่าน Browser Console (F12)

```javascript
// ทดสอบ API endpoint
fetch('https://www.chiangmaiusedcar.com/api/admin/verify', {
  credentials: 'include',
})
  .then(r => r.json())
  .then(console.log);

// ผลลัพธ์ที่ควรได้ (ก่อน login):
// { "authenticated": false, "error": "Unauthorized" }
```

---

## 🐛 แก้ปัญหาที่พบบ่อย

### Error 401 Unauthorized

**สาเหตุ**: Environment variables ยังไม่ถูกโหลดในระบบ

**วิธีแก้**:

1. Redeploy อีกครั้ง **โดยไม่เลือก** "Use Existing Build Cache"
2. Clear cache ใน Vercel: Settings → General → Clear Deployment Cache
3. รอ deployment เสร็จแล้วลองใหม่

### Login ไม่ผ่าน แม้รหัสถูกต้อง

**สาเหตุ**: Session cookies ไม่ถูก set หรือ SESSION_SECRET ไม่ตรง

**วิธีแก้**:

1. เช็คว่า SESSION_SECRET ใน Vercel มีค่า (ไม่ว่าง)
2. Clear browser cookies สำหรับ chiangmaiusedcar.com
3. ลองใช้ Incognito/Private browsing mode
4. ตรวจสอบ browser console (F12) มี error ไหม

### Redirect loop (เข้าหน้า login ซ้ำๆ)

**สาเหตุ**: Middleware หรือ authentication logic มีปัญหา

**วิธีแก้**:

1. ตรวจสอบว่ามีไฟล์ `middleware.js` หรือ `middleware.ts` ใน root
2. เช็ค deployment logs ว่ามี error middleware ไหม
3. Redeploy โดยไม่ใช้ cache

### Error 308 Permanent Redirect

**สาเหตุ**: ใช้ URL ไม่ถูกต้อง

**วิธีแก้**: ใช้ `https://www.chiangmaiusedcar.com` (มี www) แทน `https://chiangmaiusedcar.com`

---

## 📋 Checklist การตั้งค่า

ตรวจสอบให้ครบทุกข้อ:

- [ ] 1. เข้า Vercel Dashboard → Settings → Environment Variables
- [ ] 2. เพิ่ม `ADMIN_USERNAME` = `kngoodcar`
- [ ] 3. เพิ่ม `ADMIN_PASSWORD` = `<YOUR_ADMIN_PASSWORD>`
- [ ] 4. เพิ่ม `SESSION_SECRET` = `<YOUR_SESSION_SECRET>`
- [ ] 5. เลือก Environment = Production, Preview, Development ทั้ง 3 ตัว
- [ ] 6. คลิก Save เพื่อบันทึก
- [ ] 7. Redeploy production (ไม่ใช้ cache)
- [ ] 8. รอ deployment เสร็จ (2-3 นาที)
- [ ] 9. เข้า <https://www.chiangmaiusedcar.com/admin/login>
- [ ] 10. Login ด้วย kngoodcar / <YOUR_ADMIN_PASSWORD>
- [ ] 11. ตรวจสอบว่าเข้า Dashboard ได้และแสดงข้อมูลถูกต้อง

---

## 🔐 ความปลอดภัย (Security Notes)

### ✅ ที่ทำแล้ว

- Admin routes ถูกป้องกันด้วย middleware authentication
- Session cookies ใช้ HMAC signature validation
- HttpOnly, Secure, SameSite=Strict cookies
- CSRF protection ด้วย double-submit cookie pattern
- Rate limiting ป้องกัน brute force attacks
- IP whitelist support (optional)

### ⚠️ แนะนำเพิ่มเติม

1. **เปลี่ยนรหัสผ่านเป็นประจำ** (ทุก 90 วัน)
2. **ใช้ IP whitelist** ใน production:

   ```env
   ADMIN_ALLOWED_IPS=203.154.x.x,192.168.1.0/24
   ```

3. **เปิด 2FA** ถ้าเพิ่มฟีเจอร์ในอนาคต
4. **Monitor logs** ดู suspicious login attempts
5. **Backup SESSION_SECRET** เก็บไว้ในที่ปลอดภัย

---

## 📚 เอกสารอ้างอิง

- `ADMIN_SECURITY_GUIDE.md` - คำแนะนำด้านความปลอดภัย
- `ADMIN_ACCESS_GUIDE.md` - คู่มือการเข้าถึงระบบ admin
- `DEPLOYMENT_GUIDE.md` - คู่มือการ deploy
- `middleware/adminAuth.js` - โค้ด authentication logic

---

## 🆘 ติดปัญหา?

หากยังมีปัญหา ส่ง screenshot ของ:

1. **Vercel Environment Variables page** (Settings → Environment Variables)
2. **Browser Console errors** (กด F12 → Console tab → screenshot errors)
3. **Vercel Deployment logs** (Deployments → click deployment → Function Logs)
4. **Network tab** (F12 → Network → filter: admin → screenshot failed requests)

---

**📅 อัปเดต**: 14 ตุลาคม 2025  
**🏷️ Version**: v2.0.0  
**✨ Status**: Production Ready  
**📝 Related Commit**: 530babd

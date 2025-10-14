# 🔴 Admin Login ไม่ทำงานบน Production - Troubleshooting Guide

**วันที่**: 14 ตุลาคม 2025  
**ปัญหา**: Admin login ไม่ทำงานบน production แม้จะตั้งค่า environment variables แล้ว

---

## 🔍 การตรวจสอบที่ทำแล้ว

### ✅ Environment Variables บน Vercel

```bash
vercel env ls
```

**ผลลัพธ์**: ✅ ครบทั้ง 3 ตัว

```text
 ADMIN_USERNAME     Encrypted           Production
 ADMIN_PASSWORD     Encrypted           Production
 SESSION_SECRET     Encrypted           Production
```

### ✅ Deployment Status

```bash
vercel ls --prod
```

**ผลลัพธ์**: ✅ Latest deployment is Ready (14 นาทีที่แล้ว)

### ❌ API Login Test

```bash
curl -X POST https://www.chiangmaiusedcar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kngoodcar","password":"Kn-goodcar**5277"}'
```

**ผลลัพธ์**: ❌ **500 Internal Server Error**

---

## 🐛 สาเหตุที่เป็นไปได้

### 1. Environment Variables ไม่ถูกโหลดใน Runtime

แม้จะตั้งค่าบน Vercel แล้ว แต่อาจ:

- Deployment ใช้ build cache เก่า
- Environment variables ยังไม่ refresh
- Next.js ไม่โหลด env vars ใน API routes

### 2. การ Deploy ที่ผิดลำดับ

- ตั้งค่า env vars **หลัง** deployment ล่าสุด
- ต้อง redeploy เพื่อให้ env vars มีผล

### 3. Next.js Environment Variables Scope

- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET` ไม่มี prefix `NEXT_PUBLIC_`
- จึงใช้ได้เฉพาะ **server-side** เท่านั้น
- ถูกต้อง ไม่ใช่ปัญหา

---

## ✅ วิธีแก้ไข (แนะนำ)

### Option 1: Force Redeploy (แนะนำที่สุด)

```bash
# 1. Clear cache และ redeploy
vercel --prod --force

# 2. รอ 2-3 นาที

# 3. ทดสอบ
curl -X POST https://www.chiangmaiusedcar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kngoodcar","password":"Kn-goodcar**5277"}'
```

### Option 2: Redeploy ผ่าน Git

```bash
# 1. Empty commit
git commit --allow-empty -m "chore: trigger redeploy for env vars" --no-verify
git push origin master

# 2. รอ auto-deploy

# 3. ทดสอบ
```

### Option 3: Redeploy ผ่าน Vercel Dashboard

1. เปิด <https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-setup>
2. ไปที่แท็บ **Deployments**
3. คลิกที่ deployment ล่าสุด
4. คลิก **⋮** (three dots) → **Redeploy**
5. ✅ **เลือก "Redeploy with the latest code and settings"**
6. ❌ **ไม่เลือก** "Use existing Build Cache"
7. คลิก **Redeploy**

---

## 🧪 การทดสอบ

### 1. ทดสอบ Environment Variables

สร้าง endpoint ใหม่ `/api/test-env`:

```javascript
export default function handler(req, res) {
  return res.status(200).json({
    hasUsername: !!process.env.ADMIN_USERNAME,
    hasPassword: !!process.env.ADMIN_PASSWORD,
    hasSecret: !!process.env.SESSION_SECRET,
    usernameLength: process.env.ADMIN_USERNAME?.length || 0,
  });
}
```

ทดสอบ:

```bash
curl https://www.chiangmaiusedcar.com/api/test-env
```

**คาดหวัง**:

```json
{
  "hasUsername": true,
  "hasPassword": true,
  "hasSecret": true,
  "usernameLength": 9
}
```

### 2. ทดสอบ Login API

```bash
curl -X POST https://www.chiangmaiusedcar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kngoodcar","password":"Kn-goodcar**5277"}' \
  -i
```

**คาดหวัง**:

```text
HTTP/1.1 200 OK
Set-Cookie: admin_session=...
Set-Cookie: csrfToken=...

{"success":true,"message":"Login successful","user":{"username":"kngoodcar"}}
```

### 3. ทดสอบผ่าน Browser

1. เปิด <https://www.chiangmaiusedcar.com/admin/login>
2. กรอก:
   - Username: `kngoodcar`
   - Password: `Kn-goodcar**5277`
3. คลิก "เข้าสู่ระบบ"
4. ควร redirect ไป `/admin/dashboard`

---

## 🔧 ขั้นตอนการแก้ไขโดยละเอียด

### ขั้นตอนที่ 1: Verify Environment Variables

```bash
# ดู env vars ที่ตั้งค่าไว้
vercel env ls

# ตรวจสอบว่ามี Production environment
```

**ผลลัพธ์ควรเป็น**:

```text
✅ ADMIN_USERNAME - Production
✅ ADMIN_PASSWORD - Production
✅ SESSION_SECRET - Production
```

### ขั้นตอนที่ 2: Force Redeploy

```bash
# ใช้คำสั่งนี้
vercel --prod --force
```

หรือ

```bash
# Empty commit
git commit --allow-empty -m "chore: force redeploy for env vars refresh" --no-verify
git push origin master
```

### ขั้นตอนที่ 3: รอและตรวจสอบ

```bash
# รอ 2-3 นาที

# ดู deployment status
vercel ls --prod

# ตรวจสอบว่า deployment ล่าสุดเป็น Ready
```

### ขั้นตอนที่ 4: ทดสอบ

```bash
# ทดสอบ test-env endpoint
curl https://www.chiangmaiusedcar.com/api/test-env

# ทดสอบ login
curl -X POST https://www.chiangmaiusedcar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kngoodcar","password":"Kn-goodcar**5277"}'
```

---

## 📝 Checklist แก้ไขปัญหา

- [ ] 1. ตรวจสอบ env vars บน Vercel (`vercel env ls`)
- [ ] 2. Verify deployment status (`vercel ls --prod`)
- [ ] 3. Force redeploy (`vercel --prod --force`)
- [ ] 4. รอ deployment เสร็จ (2-3 นาที)
- [ ] 5. ทดสอบ `/api/test-env` endpoint
- [ ] 6. ทดสอบ `/api/admin/login` endpoint
- [ ] 7. ทดสอบ login ผ่าน browser
- [ ] 8. Verify session cookies ถูก set
- [ ] 9. Verify redirect ไป dashboard

---

## 🐛 Common Issues

### Issue 1: 500 Internal Server Error

**สาเหตุ**: Environment variables ไม่ถูกโหลด

**วิธีแก้**: Force redeploy โดยไม่ใช้ cache

```bash
vercel --prod --force
```

### Issue 2: 401 Unauthorized

**สาเหตุ**: Credentials ไม่ถูกต้อง หรือ env vars เป็นค่าเริ่มต้น

**วิธีแก้**:

1. ตรวจสอบ env vars บน Vercel
2. ตรวจสอบว่าไม่มี typo ในชื่อตัวแปร
3. Redeploy

### Issue 3: Session Cookies ไม่ถูก Set

**สาเหตุ**: HTTPS, SameSite, หรือ Secure flags

**วิธีแก้**:

1. ใช้ `https://` (มี s)
2. ใช้ `www.chiangmaiusedcar.com` (มี www)
3. Clear browser cookies

---

## 🚀 ขั้นตอนด่วน (Quick Fix)

```bash
# 1. Force redeploy
vercel --prod --force

# 2. รอ 3 นาที

# 3. ทดสอบ
curl https://www.chiangmaiusedcar.com/api/test-env

# 4. ทดสอบ login
curl -X POST https://www.chiangmaiusedcar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"kngoodcar","password":"Kn-goodcar**5277"}'

# 5. เปิด browser
# https://www.chiangmaiusedcar.com/admin/login
# Login: kngoodcar / Kn-goodcar**5277
```

---

## 📚 เอกสารอ้างอิง

- `VERCEL_ENV_SETUP_COMPLETE.md` - การตั้งค่า env vars
- `FINAL_DEPLOYMENT_SUCCESS_2025_10_14.md` - สรุป deployment
- `VERCEL_CRON_JOB_FIX_2025_10_14.md` - แก้ไข cron jobs
- `NODE_VERSION_FIX_2025_10_14.md` - แก้ไข node version warning

---

## 💡 Tips

1. **Always force redeploy** หลังเปลี่ยน env vars
2. **ไม่ใช้ build cache** เมื่อมีปัญหา env vars
3. **ทดสอบด้วย curl** ก่อนทดสอบผ่าน browser
4. **ตรวจสอบ deployment logs** ใน Vercel Dashboard
5. **Clear browser cookies** ถ้า login ไม่ผ่าน

---

**⚠️ Status**: ต้อง Force Redeploy  
**🔧 Action Required**: `vercel --prod --force`  
**⏱️ ETA**: 3 นาที  
**📅 Date**: October 14, 2025

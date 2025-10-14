# 🔐 แก้ปัญหา Vercel Deployment Protection บล็อค API

## 🚨 อาการที่พบ

เมื่อเรียก API endpoints (เช่น `/api/ping`, `/api/admin/login`, `/api/test-env`):
- ได้หน้า HTML "Authentication Required" 
- Redirect ไป `vercel.com/sso-api`
- Error: `FUNCTION_INVOCATION_FAILED`
- แต่หน้า static (HTML) ทำงานปกติ (200 OK)

## 🎯 สาเหตุ

**Vercel Deployment Protection** ถูกเปิดใช้งานสำหรับ Production → ทุก API request ถูกบล็อคต้องมี authentication token

นี่**ไม่ใช่**ปัญหา:
- ❌ Environment variables (แก้แล้ว - ไม่มี `\r\n`)
- ❌ Code errors (ทดสอบแล้ว - build สำเร็จ)
- ❌ Firebase/Shopify config (ไม่เกี่ยวข้อง)

นี่**คือ**ปัญหา:
- ✅ Vercel Project Settings → Deployment Protection เปิดอยู่

---

## 🔧 วิธีแก้ (ใช้เวลา 1-2 นาที)

### ขั้นตอนที่ 1: เข้า Vercel Dashboard

1. เปิด https://vercel.com
2. Login เข้าบัญชีของคุณ
3. เลือก Project: **chiangmaiusedcar-setup**

### ขั้นตอนที่ 2: ปิด Deployment Protection

**วิธีที่ 1** (Vercel UI ปัจจุบัน):
```
Project → Settings → Security
└── Deployment Protection
    └── Production
        ✅ ปิด "Enable Protection" (หรือเปลี่ยนเป็น OFF)
```

**วิธีที่ 2** (Vercel UI เวอร์ชันเก่า):
```
Project → Settings → General
└── Deployment Protection
    ├── Password Protection: OFF
    ├── Vercel Authentication: OFF (หรือ Preview Only)
    └── Protection: Disabled for Production
```

**วิธีที่ 3** (สำหรับ Team/Enterprise):
```
Project → Settings → Deployment Protection
└── Configure Protection
    ├── Enable for: Preview Only (ไม่เลือก Production)
    └── Save
```

### ขั้นตอนที่ 3: กด Save/Apply

หลังกด Save รอ 10-30 วินาที ระบบจะ propagate

### ขั้นตอนที่ 4: ทดสอบ

เปิด PowerShell รัน:

```powershell
# ทดสอบ API ping (ต้องได้ "pong")
curl.exe https://www.chiangmaiusedcar.com/api/ping

# ทดสอบ runtime check
curl.exe https://www.chiangmaiusedcar.com/api/runtime-check

# ทดสอบ env check
curl.exe https://www.chiangmaiusedcar.com/api/test-env
```

**ผลลัพธ์ที่ถูกต้อง:**
- `/api/ping` → `pong` (plain text)
- `/api/runtime-check` → `{"ok":true,"ts":1760465xxx,"node":"v20.x.x"}`
- `/api/test-env` → JSON object with `variables` field

**ถ้ายังได้ HTML "Authentication Required"** → Protection ยังไม่ปิด ลองรอ 1 นาทีแล้วทดสอบอีกครั้ง

---

## 🛡️ ทางเลือก: ใช้ Bypass Token (ไม่ปิด Protection)

ถ้าคุณต้องการเก็บ Protection ไว้ แต่ต้องการทดสอบ:

### 1. ดึง Bypass Token

```
Project → Deployments → เลือก deployment ล่าสุด
→ คลิก "..." (menu) → Protection → "Generate Bypass Link"
→ คัดลอก token (ตัวอย่าง: `AbCdEf123456...`)
```

### 2. ใช้ Bypass Token

```powershell
# ตั้ง bypass cookie (รันครั้งเดียว)
curl.exe "https://www.chiangmaiusedcar.com/api/ping?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=YOUR_TOKEN_HERE"

# หลังจากนั้น request ถัดไปจะใช้งานได้ (ใน session เดียวกัน)
curl.exe https://www.chiangmaiusedcar.com/api/test-env
```

**หมายเหตุ:** Token หมดอายุตาม session/เวลาที่ตั้งไว้

---

## 📋 Checklist หลังแก้

- [ ] `/api/ping` ตอบ `pong`
- [ ] `/api/runtime-check` ตอบ JSON `{"ok":true,...}`
- [ ] `/api/test-env` ตอบ JSON with env status
- [ ] `/api/admin/login` ตอบ 401 (Unauthorized) เมื่อไม่ส่ง credentials ✅ ถูกต้อง!
- [ ] `/api/admin/login` ตอบ 200 เมื่อส่ง credentials ถูกต้อง
- [ ] เว็บหน้าแรก (/) ยังทำงานปกติ

---

## 🔍 วิธีตรวจสอบว่า Protection เปิดอยู่หรือไม่

รัน PowerShell:

```powershell
.\scripts\check-api-health.ps1
```

จะแสดง:
- ✅ API ทำงาน → Protection ปิดแล้ว
- ❌ Authentication Required → Protection ยังเปิดอยู่

---

## 📚 ข้อมูลเพิ่มเติม

- Vercel Docs: https://vercel.com/docs/security/deployment-protection
- Protection Methods: https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection

---

## 🎯 สรุป

**Root Cause:** Vercel Deployment Protection เปิดสำหรับ Production  
**Solution:** ปิด Protection ใน Settings → Security → Deployment Protection  
**Time:** 1-2 นาที  
**Impact:** API จะทำงานได้ทันที หน้า static ไม่ได้รับผลกระทบ  

---

*เอกสารนี้สร้างเมื่อ: 2025-10-14*  
*Status: ✅ Root cause identified, waiting for user to disable protection*

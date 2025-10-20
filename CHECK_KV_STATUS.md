# 🔍 ตรวจสอบสถานะ KV - ไม่ต้องใช้ Vercel CLI

## ⚠️ ปัญหา: Vercel CLI ไม่ทำงาน

npm และ npx มีปัญหาในเครื่องนี้ ทำให้ Vercel CLI ใช้ไม่ได้

## ✅ วิธีแก้: ตรวจสอบผ่าน Vercel Dashboard แทน

### 🎯 ขั้นตอนที่ 1: ตรวจสอบ KV Environment Variables

1. **เปิดลิงก์นี้**: https://vercel.com/nblues/chiangmaiusedcar-next/settings/environment-variables

2. **ค้นหา**: `KV_REST_API` ในช่องค้นหา

3. **ตรวจสอบว่ามีทั้ง 3 ตัวนี้หรือไม่:**

   - ✅ `KV_REST_API_URL`
   - ✅ `KV_REST_API_TOKEN`
   - ✅ `KV_REST_API_READ_ONLY_TOKEN`

4. **ตรวจสอบ Environment แต่ละตัว:**
   - ต้องมี **Production** ✅ (สำคัญที่สุด!)
   - อาจมี Development, Preview (ไม่จำเป็น)

---

### 🎯 ขั้นตอนที่ 2: ตรวจสอบ KV Database Connection

1. **เปิดลิงก์นี้**: https://vercel.com/nblues/chiangmaiusedcar-next/stores

2. **ตรวจสอบว่า**:

   - มี Database ชื่อ **car-status-db** หรือไม่
   - Status: **Active** (สีเขียว)
   - Connected to: **chiangmaiusedcar-next** (Production ✅)

3. **ถ้าไม่มี หรือ Status เป็น Inactive**:
   - คลิกที่ database
   - ไปที่แถบ **Settings**
   - คลิก **Connect Project**
   - เลือก **chiangmaiusedcar-next**
   - เลือก Environments: ✅ Production, ✅ Preview, ✅ Development
   - คลิก **Connect**

---

### 🎯 ขั้นตอนที่ 3: ตรวจสอบ Production Deployment

1. **เปิดลิงก์นี้**: https://vercel.com/nblues/chiangmaiusedcar-next/deployments

2. **หา deployment ล่าสุด** (commit: "chore: redeploy to activate KV...")

3. **ตรวจสอบสถานะ**:

   - 🟡 **Building** → รออีก 1-2 นาที
   - 🟢 **Ready** → ดีมาก! ไปขั้นตอนที่ 4
   - 🔴 **Error** → คลิกดู error logs

4. **ถ้าสถานะ Ready แล้ว**:
   - คลิกที่ deployment นั้น
   - ไปที่แถบ **Environment Variables**
   - ดูว่ามี `KV_REST_API_*` หรือไม่

---

### 🎯 ขั้นตอนที่ 4: ทดสอบว่า Production รับ KV Variables แล้วหรือยัง

1. **เปิดลิงก์นี้ในเบราว์เซอร์**: https://www.chiangmaiusedcar.com/api/debug/kv-check

2. **ดูผลลัพธ์**:

   **✅ ถ้าขึ้นแบบนี้ = สำเร็จ:**

   ```json
   {
     "success": true,
     "kvReady": true,
     "envCheck": {
       "KV_REST_API_URL": true,
       "KV_REST_API_TOKEN": true,
       "KV_REST_API_READ_ONLY_TOKEN": true
     },
     "message": "✅ KV environment variables are ready"
   }
   ```

   → **ไปทดสอบ admin toggle ได้เลย!**

   **❌ ถ้าขึ้นแบบนี้ = ยังไม่พร้อม:**

   ```json
   {
     "success": true,
     "kvReady": false,
     "envCheck": {
       "KV_REST_API_URL": false,
       "KV_REST_API_TOKEN": false,
       "KV_REST_API_READ_ONLY_TOKEN": false
     },
     "message": "⚠️ KV environment variables are missing"
   }
   ```

   → **ต้อง redeploy ใหม่** (ดูขั้นตอนที่ 5)

---

### 🎯 ขั้นตอนที่ 5: Redeploy (ถ้า KV Variables ยังไม่พร้อม)

**วิธีที่ 1: Redeploy ผ่าน Dashboard (แนะนำ)**

1. ไปที่: https://vercel.com/nblues/chiangmaiusedcar-next/deployments
2. คลิกที่ deployment ล่าสุด
3. คลิกปุ่ม **"Redeploy"** ด้านบนขวา
4. เลือก **"Redeploy with existing Build Cache"** (ถ้ามีตัวเลือก)
5. คลิก **"Redeploy"**
6. รอ 2-3 นาที แล้วกลับไปทดสอบที่ขั้นตอนที่ 4

**วิธีที่ 2: Push Commit ใหม่**

รันคำสั่งนี้ใน PowerShell:

```powershell
git commit --allow-empty -m "chore: force redeploy for KV env vars" --no-verify
git push origin master
```

---

## 📊 สรุป Checklist

ทำตามลำดับนี้:

- [ ] 1. เช็ค Environment Variables ว่ามี `KV_REST_API_*` ครบ 3 ตัว พร้อม Production
- [ ] 2. เช็ค Stores ว่า `car-status-db` connected กับ project
- [ ] 3. เช็ค Deployments ว่า build เสร็จแล้ว (Ready)
- [ ] 4. เปิด `/api/debug/kv-check` ดูว่า `kvReady: true` หรือยัง
- [ ] 5. ถ้า false → Redeploy ผ่าน Dashboard
- [ ] 6. รอ deployment เสร็จ แล้วเช็คขั้นตอน 4 อีกครั้ง
- [ ] 7. ถ้า `kvReady: true` → ทดสอบ admin toggle

---

## 🎯 เมื่อ KV พร้อมแล้ว

ทดสอบ admin:

1. เข้า: https://www.chiangmaiusedcar.com/admin/cars
2. Login
3. กดเปิด/ปิดจองรถ
4. **Refresh (F5)**
5. **สถานะต้องคงที่** ✅

---

## 🆘 ถ้ายังมีปัญหา

ส่งข้อมูลเหล่านี้มา:

1. Screenshot หน้า Environment Variables (ต้องเห็น KV*REST_API*\*)
2. Screenshot หน้า Stores (ต้องเห็น car-status-db connected)
3. ผลลัพธ์จาก `/api/debug/kv-check`
4. Error message จาก admin toggle (ถ้ามี)

# 🔧 คู่มือตั้งค่า Vercel Environment Variables สำหรับระบบหลังบ้าน

## ปัญหา: ล็อกอินระบบหลังบ้านไม่ได้

**สาเหตุ**: ขาด Environment Variables สำคัญใน Vercel Production Environment

---

## 🎯 วิธีแก้ไข (เลือก 1 ใน 3 วิธี)

### วิธีที่ 1: ใช้ Vercel Dashboard (ง่ายที่สุด) ⭐

1. **เปิด Vercel Dashboard**

   - ไปที่: https://vercel.com/dashboard
   - เข้าสู่ระบบด้วยบัญชีของคุณ

2. **เลือกโปรเจกต์**

   - คลิกที่โปรเจกต์ `chiangmaiusedcar-next`

3. **ไปที่ Settings**

   - คลิกแท็บ **Settings** บนเมนู

4. **เพิ่ม Environment Variables**

   - คลิก **Environment Variables** ในเมนูด้านซ้าย
   - คลิกปุ่ม **Add New**

5. **เพิ่มตัวแปรทั้ง 3 ตัวนี้:**

   **ตัวแปรที่ 1:**

   ```
   Key: ADMIN_USERNAME
   Value: kngoodcar
   Environment: Production ✓ Preview ✓
   ```

   **ตัวแปรที่ 2:**

   ```
   Key: ADMIN_PASSWORD
   Value: Kn-goodcar**5277
   Environment: Production ✓ Preview ✓
   ```

   **ตัวแปรที่ 3:**

   ```
   Key: SESSION_SECRET
   Value: KrooNeung_ChiangMai_UsedCar_Development_Session_Secret_2025_Secure_Random_Key
   Environment: Production ✓ Preview ✓
   ```

6. **Redeploy โปรเจกต์**

   - ไปที่แท็บ **Deployments**
   - คลิกที่ deployment ล่าสุด
   - คลิกปุ่ม **⋮** (three dots) แล้วเลือก **Redeploy**
   - เลือก **Use existing Build Cache** (เร็วกว่า)
   - คลิก **Redeploy**

7. **รอ deployment เสร็จ** (ประมาณ 1-2 นาที)

8. **ทดสอบล็อกอิน**
   - ไปที่: https://chiangmaiusedcar.com/admin/login
   - ใช้ username: `kngoodcar`
   - ใช้ password: `Kn-goodcar**5277`

---

### วิธีที่ 2: ใช้ Vercel CLI (สำหรับคนชอบใช้ Command Line)

1. **ติดตั้ง Vercel CLI** (ถ้ายังไม่มี)

   ```powershell
   npm install -g vercel
   ```

2. **Login เข้า Vercel**

   ```powershell
   vercel login
   ```

3. **Link โปรเจกต์** (ถ้ายังไม่ได้ link)

   ```powershell
   vercel link
   ```

4. **เพิ่ม Environment Variables**

   ```powershell
   # Username
   vercel env add ADMIN_USERNAME production
   # พิมพ์: kngoodcar
   # กด Enter

   # Password
   vercel env add ADMIN_PASSWORD production
   # พิมพ์: Kn-goodcar**5277
   # กด Enter

   # Session Secret
   vercel env add SESSION_SECRET production
   # พิมพ์: KrooNeung_ChiangMai_UsedCar_Development_Session_Secret_2025_Secure_Random_Key
   # กด Enter
   ```

5. **Deploy**
   ```powershell
   vercel --prod
   ```

---

### วิธีที่ 3: ใช้ PowerShell Script (อัตโนมัติ)

1. **รันสคริปต์ที่เตรียมไว้**

   ```powershell
   .\setup-vercel-env.ps1
   ```

2. **ทำตามคำแนะนำบนหน้าจอ**

---

## ✅ ตรวจสอบว่าตั้งค่าสำเร็จ

1. ไปที่ Vercel Dashboard → Settings → Environment Variables
2. ควรเห็นตัวแปรทั้ง 3 ตัว:

   - ✓ `ADMIN_USERNAME`
   - ✓ `ADMIN_PASSWORD`
   - ✓ `SESSION_SECRET`

3. ตรวจสอบว่าแต่ละตัวมี Environment เป็น **Production** และ **Preview**

---

## 🔍 แก้ไขปัญหาเพิ่มเติม

### ปัญหา: ล็อกอินไม่ได้แม้ตั้งค่าแล้ว

1. **ตรวจสอบ Browser Console**

   - กด F12
   - ไปที่แท็บ Console
   - ดู error messages

2. **ตรวจสอบ Network Tab**

   - กด F12
   - ไปที่แท็บ Network
   - ลองล็อกอินอีกครั้ง
   - ดู status code ของ `/api/admin/login`
     - 200 = สำเร็จ
     - 401 = รหัสผิด
     - 403 = CSRF token ผิด
     - 500 = Server error

3. **ลบ Cookies แล้วลองใหม่**

   - กด F12
   - ไปที่แท็บ Application (Chrome) หรือ Storage (Firefox)
   - ลบ cookies ทั้งหมดของ chiangmaiusedcar.com
   - Refresh หน้า
   - ลองล็อกอินใหม่

4. **ตรวจสอบ Vercel Logs**
   - Vercel Dashboard → โปรเจกต์ → Deployments
   - คลิกที่ deployment ล่าสุด
   - ดู Runtime Logs

---

## 📱 ติดต่อสอบถาม

หากยังมีปัญหา:

1. เช็ค error message ที่แสดงบนหน้าจอ
2. เช็ค Browser Console (F12)
3. เช็ค Vercel Logs

---

## 🔐 ข้อมูลการล็อกอิน (สำหรับทดสอบ)

- **URL**: https://chiangmaiusedcar.com/admin/login
- **Username**: `kngoodcar`
- **Password**: `Kn-goodcar**5277`

---

**หมายเหตุ**: หลังจากตั้งค่าเสร็จ ระบบอาจใช้เวลา 1-2 นาทีในการอัปเดต

# 🔧 วิธีเชื่อมต่อ Vercel CLI (Setup ที่ใช้งานได้จริงบน Windows)

## ⚠️ ปัญหาที่พบ

- npm และ npx ไม่ทำงาน (exit code 1)
- pnpm ทำงานบางคำสั่ง แต่ติดตั้ง package ไม่ได้
- ไม่พบ binary ทางการของ Vercel CLI สำหรับ Windows ที่ใช้งานแบบ standalone ได้

ดูสรุปฉบับสมบูรณ์: `VERCEL_CLI_FINAL_SOLUTION.md`

---

## ✅ ทางออกที่แนะนำ

### วิธีที่ 1: ใช้สคริปต์ตัวช่วย vercel-cli.ps1 (พยายามหลายวิธีอัตโนมัติ)

เราเพิ่มสคริปต์ `vercel-cli.ps1` ที่จะลองเรียกใช้ Vercel CLI หลายวิธี (global, npx, npm exec, pnpm dlx)
และแสดงคำแนะนำถ้าทุกวิธีล้มเหลว

รันจากโฟลเดอร์โปรเจกต์:

```powershell
# ดูเวอร์ชัน (ตัวอย่าง)
pnpm vercel -- --version

# Deploy production (จะรัน lint+type-check+build ก่อน)
pnpm deploy

# ดู environment variables
pnpm vercel -- env ls

# Login
pnpm vercel -- login
```

หมายเหตุ: สคริปต์จะลองใช้ `vercel` ที่ติดตั้ง global, หรือ `npx vercel@latest`, หรือ `npm exec -y vercel@latest`, หรือ
`pnpm dlx vercel@latest` ให้โดยอัตโนมัติ

---

### วิธีที่ 2: แก้ npm/Node.js ให้ทำงาน แล้วติดตั้ง Vercel (ถาวร)

#### A. ตรวจสอบปัญหา npm

```powershell
# ลองรัน npm version
C:\nvm4w\nodejs\npm.cmd --version

# ถ้าไม่ทำงาน ลองแก้ permissions
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# หรือ reinstall npm
C:\nvm4w\nodejs\node.exe C:\nvm4w\nodejs\node_modules\npm\bin\npm-cli.js install -g npm@latest
```

#### B. เมื่อ npm ทำงานแล้ว ติดตั้ง Vercel

```powershell
npm install -g vercel
vercel login
```

---

### วิธีที่ 3: ใช้ Vercel ผ่าน Dashboard แทน (ไม่ต้องใช้ CLI)

เนื่องจาก CLI มีปัญหา คุณสามารถทำทุกอย่างผ่าน Vercel Dashboard ได้:

#### 1. **ดู Environment Variables**

<https://vercel.com/nblues/chiangmaiusedcar-next/settings/environment-variables>

#### 2. **Redeploy**

- ไปที่: <https://vercel.com/nblues/chiangmaiusedcar-next/deployments>
- คลิก deployment ล่าสุด
- คลิกปุ่ม "Redeploy"

#### 3. **ดู Logs**

- เปิด deployment ที่ต้องการ
- คลิก "Function Logs" หรือ "Build Logs"

#### 4. **ดู Stores (KV)**

<https://vercel.com/nblues/chiangmaiusedcar-next/stores>

#### 5. **ดึง Environment Variables (Manual)**

- ไปที่ Environment Variables page
- คัดลอกแต่ละตัวแปรมาสร้างไฟล์ `.env.local` เอง

---

## 🎯 แนะนำ

**สำหรับตอนนี้**: ใช้ **วิธีที่ 1** (สคริปต์ vercel-cli.ps1) หากยังไม่ได้ผลให้ใช้ **วิธีที่ 3** (Dashboard) เพราะ:

- ✅ ไม่ต้องแก้ปัญหา CLI
- ✅ ทำอะไรก็ได้ที่ CLI ทำได้
- ✅ มี UI ดูง่ายกว่า

**สำหรับอนาคต**: ถ้าอยากใช้ CLI แบบถาวร → ทำ **วิธีที่ 2** (ติดตั้ง Node.js ใหม่ให้ npm ใช้งานได้ แล้ว
`npm install -g vercel`)

---

## 📝 คำสั่งที่ใช้บ่อย (เมื่อ CLI พร้อม)

```powershell
# Login
vercel login

# Link project
vercel link

# ดู environment variables
vercel env ls

# ดึง env variables
vercel env pull .env.local

# Deploy production
vercel --prod

# ดู logs
vercel logs
```

---

## 🆘 ถ้ายังมีปัญหา

1. **ตรวจสอบ Node.js version**:

   ```powershell
   node --version  # ควรเป็น v18+ หรือ v20+
   ```

2. **ติดตั้ง Node.js ใหม่** (ถ้าจำเป็น):

   - ดาวน์โหลดจาก: <https://nodejs.org/>
   - เลือก LTS version

3. **ใช้ Terminal อื่น**:

   - ลองใช้ Command Prompt แทน PowerShell
   - หรือ Git Bash

4. **ติดต่อ Vercel Support**:
   - <https://vercel.com/support>

---

**สร้างเมื่อ**: 20 ตุลาคม 2025

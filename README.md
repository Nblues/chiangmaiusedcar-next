# Chiangmai Used Car Website (ครูหนึ่งรถสวย)

เว็บไซต์รถมือสองเชียงใหม่ที่สร้างด้วย Next.js 14

## ลิขสิทธิ์

© 2025 Chiangmai Used Car (ครูหนึ่งรถสวย). All rights reserved.

โค้ดในโปรเจกต์นี้เป็นผลงานต้นฉบับที่สร้างขึ้นเฉพาะสำหรับธุรกิจครูหนึ่งรถสวย

## ไฟล์ที่เป็นผลงานต้นฉบับ

- `/pages/admin/*` - ระบบจัดการหลังบ้าน (Admin System)
- `/pages/features/[id].jsx` - หน้าแสดงบทความ (Article Display)
- `/components/*` - ส่วนประกอบต่างๆ ของเว็บไซต์
- `/lib/*` - ฟังก์ชันและ utilities

## Dependencies

โปรเจกต์ใช้ open-source libraries ที่มี MIT License:

- Next.js 14.2.5
- React 18
- Tailwind CSS
- TypeScript

## การใช้งาน

```bash
# ติดตั้ง dependencies
pnpm install

# รันในโหมด development
pnpm dev

# Build สำหรับ production
pnpm build

# ตรวจสอบโค้ด
pnpm lint        # ESLint check
pnpm type-check  # TypeScript syntax check
```

## ฟีเจอร์หลัก

### เว็บไซต์หน้าบ้าน

- แสดงรายการรถมือสอง
- ระบบค้นหาและกรองรถ
- หน้าบทความ/ข่าวสาร
- ฟอร์มติดต่อ

### ระบบ Admin

- จัดการบทความ (CRUD)
- ระบบ Authentication (admin/admin123)
- API Dashboard
- ตรวจสอบสถานะระบบ

## การเข้าถึง Admin

- URL: `/admin`
- Username: `admin`
- Password: `admin123`

## โครงสร้างไฟล์

```text
├── pages/
│   ├── admin/          # ระบบจัดการหลังบ้าน
│   │   ├── index.jsx   # หน้าแรก Admin
│   │   ├── articles/   # จัดการบทความ
│   │   └── api-dashboard.jsx  # ตรวจสอบ API
│   ├── features/       # หน้าบทความ
│   └── api/           # API endpoints
├── components/        # React components
├── lib/              # Utilities และ helpers
└── styles/           # CSS และ Tailwind
```

## Development Notes

- ใช้ `pnpm` สำหรับจัดการ packages
- Husky runs `lint` และ `type-check` ก่อน commit
- Push ไป **main** → GitHub Action ตรวจสอบ build → Vercel auto-deploy
- ข้อมูลบทความเก็บใน localStorage สำหรับ demo

## การพัฒนา

ทีมพัฒนา: Chiangmai Used Car Development Team

สำหรับคำถามเกี่ยวกับโค้ด กรุณาติดต่อผ่านทางเว็บไซต์

---

**หมายเหตุ**: โค้ดทั้งหมดในโปรเจกต์นี้เป็นผลงานต้นฉบับที่พัฒนาโดยทีมงาน
ไม่มีการคัดลอกหรือใช้โค้ดจากแหล่งอื่นที่อาจมีปัญหาลิขสิทธิ์

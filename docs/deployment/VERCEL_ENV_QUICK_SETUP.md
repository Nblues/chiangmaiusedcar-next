# ⚡ Quick Setup: Vercel Environment Variables

## 🎯 สิ่งที่ต้องทำตอนนี้เลย

Admin authentication บน production ไม่ทำงานเพราะยังไม่มี environment variables บน Vercel

---

## 📝 ขั้นตอน (5 นาที)

### 1. เข้า Vercel

<https://vercel.com/dashboard> → เลือกโปรเจค → **Settings** → **Environment Variables**

### 2. เพิ่ม Variables 3 ตัว

คลิก **Add New** แล้วเพิ่มทีละตัว (เลือก Production + Preview + Development ทั้งหมด):

| Name             | Value                   |
| ---------------- | ----------------------- |
| `ADMIN_USERNAME` | `<YOUR_ADMIN_USERNAME>` |
| `ADMIN_PASSWORD` | `<YOUR_ADMIN_PASSWORD>` |
| `SESSION_SECRET` | `<RANDOM_32+_CHARS>`    |

### 3. Redeploy

Vercel Dashboard → **Deployments** → คลิก deployment ล่าสุด → **⋮** → **Redeploy**

✅ ไม่ต้องติ๊ก "Use Existing Build Cache"

### 4. รอ 2-3 นาที แล้วทดสอบ

```bash
URL:      https://www.chiangmaiusedcar.com/admin/login
Username: <YOUR_ADMIN_USERNAME>
Password: <YOUR_ADMIN_PASSWORD>
```

---

## ✅ เสร็จแล้ว

เมื่อทำครบทั้ง 4 ขั้นตอน admin authentication จะทำงานบน production ทันที

---

**💡 Tip**: หากยังเข้าไม่ได้ ให้ clear browser cookies หรือใช้ Incognito mode

**📖 รายละเอียดเพิ่มเติม**: ดูใน `VERCEL_ENV_VARIABLES_REQUIRED.md`

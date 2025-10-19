# ⚡ Quick Setup: Vercel Environment Variables

## 🎯 สิ่งที่ต้องทำตอนนี้เลย

Admin authentication บน production ไม่ทำงานเพราะยังไม่มี environment variables บน Vercel

---

## 📝 ขั้นตอน (5 นาที)

### 1. เข้า Vercel

<https://vercel.com/dashboard> → เลือกโปรเจค → **Settings** → **Environment Variables**

### 2. เพิ่ม Variables 3 ตัว

คลิก **Add New** แล้วเพิ่มทีละตัว (เลือก Production + Preview + Development ทั้งหมด):

| Name             | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `ADMIN_USERNAME` | `kngoodcar`                                                        |
| `ADMIN_PASSWORD` | `Kn-goodcar**5277`                                                 |
| `SESSION_SECRET` | `f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33` |

### 3. Redeploy

Vercel Dashboard → **Deployments** → คลิก deployment ล่าสุด → **⋮** → **Redeploy**

✅ ไม่ต้องติ๊ก "Use Existing Build Cache"

### 4. รอ 2-3 นาที แล้วทดสอบ

```bash
URL:      https://www.chiangmaiusedcar.com/admin/login
Username: kngoodcar
Password: Kn-goodcar**5277
```

---

## ✅ เสร็จแล้ว

เมื่อทำครบทั้ง 4 ขั้นตอน admin authentication จะทำงานบน production ทันที

---

**💡 Tip**: หากยังเข้าไม่ได้ ให้ clear browser cookies หรือใช้ Incognito mode

**📖 รายละเอียดเพิ่มเติม**: ดูใน `VERCEL_ENV_VARIABLES_REQUIRED.md`

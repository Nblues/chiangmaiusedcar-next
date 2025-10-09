# 🔐 GitHub Secret Configuration

## ⚠️ ขั้นตอนสำคัญ - ต้องทำก่อนใช้งาน!

### 1. เปิด GitHub Repository Settings

1. ไปที่ https://github.com/Nblues/chiangmaiusedcar-next
2. คลิก **Settings** (ด้านบนขาว)
3. เลือก **Secrets and variables** → **Actions** (เมนูด้านซ้าย)

### 2. เพิ่ม Secret

คลิก **New repository secret** และเพิ่ม:

#### Secret #1: RESCRAPE_SECRET

```
Name: RESCRAPE_SECRET
Secret: 301982Nueng@5277
```

คลิก **Add secret**

---

## ✅ ตรวจสอบว่าทำสำเร็จ

หลังจากเพิ่ม Secret แล้ว คุณจะเห็น:

```
RESCRAPE_SECRET
Updated now by Nblues
```

---

## 🚀 ทดสอบ Workflow

### วิธีที่ 1: รอ Auto Trigger

- Push code ครั้งต่อไป → GitHub Actions จะรันอัตโนมัติ

### วิธีที่ 2: Run Manual

1. ไปที่ **Actions** tab
2. เลือก **Auto Re-scrape Facebook OG Cache**
3. คลิก **Run workflow** (ปุ่มสีเทา ด้านขวา)
4. คลิก **Run workflow** สีเขียว
5. รอ 2-3 นาที แล้วดูผลลัพธ์

---

## 📋 หลังจากตั้งค่าเรียบร้อย

### ระบบจะทำงานอัตโนมัติ:

1. ✅ คุณ push code
2. ✅ Vercel deploy
3. ✅ GitHub Actions รอ deploy เสร็จ
4. ✅ Auto re-scrape Facebook cache
5. ✅ Facebook ใช้ OG tags ใหม่

### ไม่ต้องทำอะไรเพิ่ม! 🎉

---

## 🔗 Quick Links

- GitHub Settings: https://github.com/Nblues/chiangmaiusedcar-next/settings/secrets/actions
- GitHub Actions: https://github.com/Nblues/chiangmaiusedcar-next/actions
- Facebook Debugger: https://developers.facebook.com/tools/debug/

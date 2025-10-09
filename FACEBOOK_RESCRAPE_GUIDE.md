# 🔄 Facebook OG Cache Re-scrape - คู่มือการใช้งาน

## 📋 ภาพรวม

ระบบ **อัตโนมัติ 100%** สำหรับ refresh Facebook Open Graph cache หลัง deploy

---

## 🤖 ระบบอัตโนมัติ

### 1. GitHub Actions (แนะนำ)

**อัตโนมัติทุกครั้งที่ push code:**

- ✅ รอ Vercel deploy เสร็จ (60 วินาที)
- ✅ ตรวจสอบว่าเว็บไซต์พร้อมใช้งาน
- ✅ Re-scrape Facebook OG cache อัตโนมัติ
- ✅ แสดงผลลัพธ์ใน GitHub Actions logs

**ไฟล์:** `.github/workflows/rescrape-facebook.yml`

#### การตั้งค่า GitHub Secrets

1. ไปที่ GitHub Repository Settings
2. เลือก **Secrets and variables** → **Actions**
3. เพิ่ม Secret ชื่อ `RESCRAPE_SECRET`
4. ใส่ค่า: `301982Nueng@5277`

**เสร็จแล้ว!** ทุกครั้งที่ push code → auto re-scrape

---

## 🎯 การใช้งาน Manual

### วิธีที่ 1: npm script (ง่ายที่สุด)

```bash
# Re-scrape รถทั้งหมด
npm run rescrape

# Re-scrape 50 คันแรก (เร็วกว่า)
npm run rescrape:limit

# Deploy + Auto re-scrape
npm run deploy:rescrape
```

### วิธีที่ 2: Node script

```bash
# ทั้งหมด
RESCRAPE_SECRET=301982Nueng@5277 node scripts/rescrape-facebook.js

# จำกัด 50 คัน
RESCRAPE_SECRET=301982Nueng@5277 node scripts/rescrape-facebook.js 50
```

### วิธีที่ 3: curl/API โดยตรง

```bash
# Windows PowerShell
Invoke-RestMethod -Method POST -Uri "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=301982Nueng@5277"

# Linux/Mac
curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=301982Nueng@5277"
```

---

## 🔧 GitHub Actions - Manual Trigger

1. ไปที่ **Actions** tab ใน GitHub
2. เลือก **Auto Re-scrape Facebook OG Cache**
3. คลิก **Run workflow**
4. (Optional) ระบุจำนวนรถที่ต้องการ re-scrape
5. คลิก **Run workflow** สีเขียว

---

## 📊 ตัวอย่างผลลัพธ์

```json
{
  "ok": true,
  "count": 150,
  "results": [
    {
      "url": "https://www.chiangmaiusedcar.com/car/toyota-camry-2-0-g",
      "status": 200,
      "data": {
        "id": "https://www.chiangmaiusedcar.com/car/toyota-camry-2-0-g",
        "updated_time": "2025-01-14T10:30:00+0000"
      }
    }
  ]
}
```

---

## ⚙️ การตั้งค่า Environment Variables

### Vercel (Production)

✅ **ตั้งค่าเรียบร้อยแล้ว:**

- `RESCRAPE_SECRET`
- `FACEBOOK_GRAPH_ACCESS_TOKEN`

### Local Development

สร้างไฟล์ `.env.local`:

```bash
RESCRAPE_SECRET=301982Nueng@5277
FACEBOOK_GRAPH_ACCESS_TOKEN=EAAFmLEjK4lcBP...
SITE_URL=https://www.chiangmaiusedcar.com
```

---

## 🎯 Best Practices

### เมื่อไหร่ควร Re-scrape?

| สถานการณ์        | ควร Re-scrape? | วิธี                               |
| ---------------- | -------------- | ---------------------------------- |
| แก้ไข OG tags    | ✅ ใช่         | Manual หรือรอ auto                 |
| เพิ่มรถใหม่      | ⚠️ ไม่จำเป็น   | Facebook จะ scrape ตอนแชร์ครั้งแรก |
| Deploy code ใหม่ | ✅ ใช่         | GitHub Actions auto                |
| เปลี่ยนรูปรถ     | ✅ ใช่         | Manual: `npm run rescrape`         |

### Performance Tips

- 🚀 **Re-scrape แค่บางส่วน:** ใช้ parameter `limit=50`
- ⏰ **เว้นระยะ:** ระบบมี throttle 250ms ต่อ request
- 📊 **Monitor:** ดู logs ใน GitHub Actions

---

## 🔍 การทดสอบ

### 1. ทดสอบว่า API ทำงาน

```bash
curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=301982Nueng@5277&handle=toyota-camry-2-0-g"
```

### 2. ตรวจสอบ Facebook Debugger

1. เปิด: https://developers.facebook.com/tools/debug/
2. ใส่ URL: `https://www.chiangmaiusedcar.com/car/toyota-camry-2-0-g`
3. คลิก **Fetch new information**
4. ตรวจสอบ OG tags ใหม่

---

## 🐛 Troubleshooting

### ❌ Error: "Unauthorized"

- ตรวจสอบ `RESCRAPE_SECRET` ถูกต้อง
- ใน GitHub: ดูที่ Repository Settings → Secrets

### ❌ Error: "FACEBOOK_GRAPH_ACCESS_TOKEN is not configured"

- Token หมดอายุ - ต้องสร้างใหม่ที่ Facebook Developers
- อัปเดตใน Vercel Environment Variables

### ⏰ Workflow รันช้า

- ปกติใช้เวลา 2-5 นาที สำหรับรถ 100+ คัน
- ลด `limit` ถ้าต้องการเร็วขึ้น

---

## 🎉 สรุป

### ระบบอัตโนมัติ 100%:

1. ✅ Push code → GitHub Actions trigger
2. ✅ รอ Vercel deploy เสร็จ
3. ✅ Re-scrape Facebook cache อัตโนมัติ
4. ✅ แสดงผลลัพธ์ใน logs

### หรือใช้ Manual เมื่อต้องการ:

```bash
npm run rescrape
```

**🚀 ไม่ต้องทำอะไรเพิ่ม - ระบบจะดูแลให้อัตโนมัติ!**

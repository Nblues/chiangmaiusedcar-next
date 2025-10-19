# 🚀 Vercel KV Setup Guide - แก้ปัญหาสถานะรถถาวร

## 🎯 เป้าหมาย

**ดึงข้อมูลรถจาก Shopify เหมือนเดิม** + **จัดการสถานะเปิด/ปิดจองในระบบเราเอง**

### ทำไมต้อง Vercel KV?

- ✅ **ข้อมูลถาวร 100%** - ไม่หายแม้ Vercel restart
- ✅ **ฟรี 256MB** - เพียงพอสำหรับสถานะรถหลายพันคัน
- ✅ **Global Edge Network** - เร็วกว่า database ทั่วไป
- ✅ **ไม่ต้องพึ่ง Shopify** - จัดการเองทั้งหมด
- ✅ **Setup ง่าย** - 5 นาทีเสร็จ

---

## 📋 ขั้นตอนการติดตั้ง

### 1️⃣ สร้าง Vercel KV Database

1. เข้า **Vercel Dashboard**: https://vercel.com/dashboard

2. ไปที่ **Storage** tab (เมนูด้านซ้าย)

3. คลิก **Create Database**

4. เลือก **KV (Redis-compatible)**

5. ตั้งชื่อ Database:
   ```
   car-status-db
   ```

6. เลือก Region:
   ```
   Singapore (ใกล้ไทยที่สุด)
   ```

7. คลิก **Create**

8. เลือกโปรเจค:
   ```
   chiangmaiusedcar-next
   ```

9. คลิก **Connect Project**

10. ✅ เสร็จแล้ว! Vercel จะเพิ่ม env variables อัตโนมัติ:
    - `KV_REST_API_URL`
    - `KV_REST_API_TOKEN`
    - `KV_REST_API_READ_ONLY_TOKEN`

---

### 2️⃣ ติดตั้ง Vercel KV SDK

```bash
pnpm add @vercel/kv
```

---

### 3️⃣ แก้ไขโค้ด (ผมทำให้)

ผมจะแก้ไขไฟล์ต่อไปนี้:

1. **`lib/carStatusStore.js`** → ใช้ Vercel KV แทน file storage
2. **`pages/api/admin/cars/toggle-status.js`** → ลบ Shopify Metafield logic
3. **`pages/api/admin/cars/list.js`** → อ่านสถานะจาก KV

---

### 4️⃣ Data Flow ใหม่

```
┌─────────────────────────────────────────────────┐
│ Shopify (Product Data)                          │
│ - ยี่ห้อ, รุ่น, ราคา, รูปภาพ, ฯลฯ              │
│ - ไม่เก็บสถานะเปิด/ปิดจอง                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Vercel KV (Car Status)                          │
│ Key: car:{shopifyId}                            │
│ Value: { status: "available|reserved" }         │
│ - จัดการโดยระบบเราเอง 100%                      │
│ - ข้อมูลถาวร ไม่หาย                             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Frontend (แสดงผล)                               │
│ - ข้อมูลรถจาก Shopify                          │
│ - สถานะจาก Vercel KV                           │
│ - Merge กันแล้วแสดงผล                           │
└─────────────────────────────────────────────────┘
```

---

### 5️⃣ ตัวอย่างการใช้งาน

#### เปลี่ยนสถานะรถ (Admin):

```javascript
// POST /api/admin/cars/toggle-status
import { kv } from '@vercel/kv';

const carId = 'gid://shopify/Product/123456';
const status = 'reserved';

await kv.set(`car:${carId}`, {
  status,
  updatedAt: new Date().toISOString(),
});
```

#### อ่านสถานะรถ:

```javascript
import { kv } from '@vercel/kv';

const carId = 'gid://shopify/Product/123456';
const data = await kv.get(`car:${carId}`);

// data = { status: 'reserved', updatedAt: '2025-10-19T...' }
```

---

## 🔄 Migration Plan

### ขั้นตอนการย้ายข้อมูล:

1. **ติดตั้ง KV** (ขั้นตอน 1-2)
2. **Deploy โค้ดใหม่** (ผมแก้ให้)
3. **ข้อมูลเก่าจะหาย** แต่ไม่เป็นไร เพราะ:
   - สถานะเริ่มต้นทุกคัน = `available`
   - Admin กดปิดจองใหม่ได้
4. **ตั้งแต่นี้ไป** สถานะถาวร ไม่หายอีก!

---

## ✅ ผลลัพธ์หลังติดตั้ง

| คุณสมบัติ | ก่อน (File Storage) | หลัง (Vercel KV) |
|----------|---------------------|------------------|
| **ข้อมูลถาวร** | ❌ หายทุก 1-2 ชม. | ✅ ถาวร 100% |
| **ความเร็ว** | 🐌 ช้า (file I/O) | ⚡ เร็ว (in-memory) |
| **พึ่งพา Shopify** | ⚠️ ต้องมี Admin Token | ✅ ไม่ต้องพึ่ง |
| **ราคา** | ✅ ฟรี | ✅ ฟรี (256MB) |
| **Scalability** | ❌ จำกัด | ✅ รองรับหลายพันคัน |
| **จัดการเอง** | ❌ พึ่ง /tmp | ✅ ควบคุมเอง 100% |

---

## 🧪 ทดสอบหลัง Deploy

1. เข้าหน้า Admin Cars
2. กดปิดจองรถ → รอโหลด...
3. **Refresh หน้า (F5)** → ✅ สถานะยังเป็น "จองแล้ว"
4. รอ 2-3 ชั่วโมง → Refresh อีกครั้ง
5. ✅ **สถานะยังคงเป็น "จองแล้ว"** (ไม่หาย!)

---

## 🔍 ตรวจสอบข้อมูลใน KV

### ผ่าน Vercel Dashboard:

1. ไปที่ **Storage** → **car-status-db**
2. ดู **Data Browser**
3. เห็น keys: `car:gid://shopify/Product/123456`
4. คลิกดู value: `{ "status": "reserved", "updatedAt": "..." }`

### ผ่าน API:

```bash
curl https://www.chiangmaiusedcar.com/api/admin/cars/list
```

---

## 📊 ข้อมูลเทคนิค

### KV Schema:

```
Key:   car:{shopifyProductId}
Value: {
  status: "available" | "reserved",
  updatedAt: "2025-10-19T12:34:56.789Z"
}
TTL:   ไม่มี (ถาวร)
```

### Performance:

- Read: < 10ms (global edge)
- Write: < 50ms
- Storage: 256MB ฟรี (≈ 250,000 records)

---

## 🆘 Troubleshooting

### ปัญหา: ไม่มี env variables

**สาเหตุ**: ยังไม่ connect KV กับโปรเจค

**แก้ไข**:
1. Vercel Dashboard → Storage → car-status-db
2. Settings → Connected Projects
3. เลือก chiangmaiusedcar-next
4. Connect

### ปัญหา: Import error `@vercel/kv`

**สาเหตุ**: ยังไม่ได้ติดตั้ง package

**แก้ไข**:
```bash
pnpm add @vercel/kv
```

### ปัญหา: KV_REST_API_URL undefined

**สาเหตุ**: Local dev ไม่มี env variables

**แก้ไข**: เพิ่มใน `.env.local`:
```bash
# Pull from Vercel
vercel env pull .env.local
```

---

## 📦 ไฟล์ที่จะแก้ไข

1. `lib/carStatusStore.js` - เปลี่ยนจาก file → KV
2. `pages/api/admin/cars/toggle-status.js` - ลบ Shopify logic
3. `pages/api/admin/cars/list.js` - อ่านจาก KV
4. `package.json` - เพิ่ม @vercel/kv

---

**สร้างเมื่อ**: 2025-10-19  
**Priority**: 🔥 สูงสุด  
**Status**: 🟡 รอติดตั้ง KV

---

## 🚀 พร้อมเริ่มไหมครับ?

ขั้นตอนต่อไป:
1. ✅ คุณสร้าง KV database (ตามขั้นตอน 1)
2. ✅ รัน `pnpm add @vercel/kv`
3. ✅ ผมแก้ไขโค้ดให้
4. ✅ Deploy!

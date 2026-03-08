# 🔐 Shopify Admin Token Setup Guide

## ❌ ปัญหาปัจจุบัน

**สถานะรถไม่ถาวร** - กดปิดจองแล้วพอ refresh กลับมาเป็นพร้อมขายอีก

### สาเหตุ:

1. **ไม่มี `SHOPIFY_ADMIN_TOKEN`** ใน Vercel environment variables
2. ระบบ fallback ไปใช้ **file storage** (`/tmp/car-status.json`)
3. Vercel serverless → **/tmp ถูกล้างทุกครั้งที่ instance restart** (1-2 ชม.)
4. สถานะหายไป กลับมาเป็น `available` เหมือนเดิม

---

## ✅ วิธีแก้ไข

ใช้ **Shopify Metafields** เป็น primary storage แทน file:

- ข้อมูลถาวร เก็บใน Shopify Database
- ไม่หายแม้ Vercel restart
- สถานะคงค่าตลอดไป

---

## 📋 ขั้นตอนการแก้ไข

### 1️⃣ สร้าง Shopify Admin API Token

1. เข้า **Shopify Admin**: https://kn-goodcar.com/admin

2. ไปที่ **Settings** → **Apps and sales channels**

3. คลิก **Develop apps** (ด้านล่างสุด)

4. คลิก **Create an app**

   - App name: `Car Management API`
   - App developer: `kn-goodcar.com`

5. คลิก **Configure Admin API scopes**

6. เลือก scopes ที่ต้องการ:

   - ✅ `read_products` (อ่านข้อมูลรถ)
   - ✅ `write_products` (แก้ไขสถานะรถ)

7. คลิก **Save** → **Install app**

8. คลิก **Reveal token once** → **Copy token**
   - Token จะมีรูปแบบ: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **เก็บไว้ปลอดภัย! จะแสดงแค่ครั้งเดียว**

---

### 2️⃣ เพิ่ม Token ใน Vercel

1. เข้า **Vercel Dashboard**:

   ```
   https://vercel.com/nblues/chiangmaiusedcar-next/settings/environment-variables
   ```

2. คลิก **Add New**

3. กรอกข้อมูล:

   ```
   Name:  SHOPIFY_ADMIN_TOKEN
   Value: shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. เลือก **Environments**:

   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. คลิก **Save**

6. **Redeploy** โปรเจค:
   - ไปที่ **Deployments** tab
   - คลิก **⋯** (จุด 3 จุด) ที่ deployment ล่าสุด
   - คลิก **Redeploy**
   - เลือก **Use existing Build Cache** → **Redeploy**

---

### 3️⃣ ทดสอบหลัง Deploy เสร็จ (3-5 นาที)

1. เข้าหน้า **Admin Cars**:

   ```
   https://www.chiangmaiusedcar.com/admin/cars
   ```

2. **กดปิดจองรถ** → รอโหลด...

3. **Refresh หน้า (F5)**

4. ✅ **สถานะยังคงเป็น "จองแล้ว"**

5. รอ 1-2 ชม. → Refresh อีกครั้ง

6. ✅ **สถานะยังคงเป็น "จองแล้ว"** (ไม่หายแม้ instance restart!)

---

## 🔄 Data Flow Comparison

### ❌ ก่อนแก้ไข (ไม่มี Admin Token):

```
Admin กดปิดจอง
  ↓
POST /api/admin/cars/toggle-status
  ↓
✅ Check SHOPIFY_ADMIN_TOKEN... ❌ ไม่มี!
  ↓
Fallback → บันทึกใน /tmp/car-status.json
  ↓
⏰ Instance restart (1-2 ชม.)
  ↓
💥 /tmp ถูกล้างหมด!
  ↓
สถานะกลับมาเป็น available ❌
```

### ✅ หลังแก้ไข (มี Admin Token):

```
Admin กดปิดจอง
  ↓
POST /api/admin/cars/toggle-status
  ↓
✅ Check SHOPIFY_ADMIN_TOKEN... ✅ มี!
  ↓
PUT Shopify Metafield (custom.status = "reserved")
  ↓
✅ บันทึกใน Shopify Database
  ↓
✅ ถาวร! ไม่หายแม้ Vercel restart
  ↓
สถานะคงค่าตลอดไป ✅
```

---

## 📂 ไฟล์ที่เกี่ยวข้อง

- `pages/api/admin/cars/toggle-status.js` - API endpoint สำหรับเปลี่ยนสถานะ
- `lib/carStatusStore.js` - File storage (fallback เท่านั้น)
- `pages/api/admin/cars/list.js` - อ่านสถานะรถทั้งหมด

---

## ⚠️ หมายเหตุสำคัญ

1. **Token เก็บไว้ปลอดภัย** - อย่าแชร์หรือ commit ใน Git
2. **Redeploy จำเป็น** - หลังเพิ่ม env variable ต้อง redeploy
3. **File storage เป็น fallback** - ใช้เฉพาะกรณีไม่มี Admin Token
4. **Production เท่านั้น** - Local dev ยังใช้ file storage ได้ปกติ

---

## 🧪 Verify Token ทำงาน

ดูใน Vercel deployment logs:

```
✅ บรรทัดนี้ → ใช้ Shopify API:
  "message": "Status updated successfully"
  "metafield": { "id": "...", "value": "reserved" }
  "storage": "shopify"

❌ บรรทัดนี้ → ใช้ file (ไม่ถาวร):
  "message": "Status updated successfully (file storage)"
  "storage": "file"
  "filePath": "/tmp/car-status.json"
```

---

## 🆘 Troubleshooting

### ปัญหา: Token ไม่ทำงาน

1. ตรวจสอบ scopes ใน Shopify:

   - `read_products` ✅
   - `write_products` ✅

2. ตรวจสอบ token ใน Vercel:

   - Format ถูกต้อง: `shpat_xxxxx...`
   - Environments: Production ✅

3. Redeploy ใหม่

### ปัญหา: สถานะยังหาย

1. ตรวจสอบ deployment logs:

   - มีข้อความ error หรือไม่?
   - ใช้ storage อะไร? (shopify / file)

2. ทดสอบอีกครั้ง:
   - Clear cache browser (Ctrl+Shift+R)
   - ลอง incognito mode

---

**สร้างเมื่อ**: 2025-10-19  
**สถานะ**: 🔴 รอเพิ่ม SHOPIFY_ADMIN_TOKEN  
**Priority**: 🔥 สูงมาก (ระบบไม่ stable)

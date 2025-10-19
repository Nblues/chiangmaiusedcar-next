# คู่มือแก้ไขปัญหาการแชร์ลิงก์ Facebook/LINE

## ปัญหาที่พบ

เมื่อแชร์ลิงก์รถยนต์บน Facebook หรือ LINE ไม่แสดงรูปภาพและข้อมูลอย่างถูกต้อง

## สาเหตุ

1. **Facebook cache** - Facebook เก็บ Open Graph (OG) tags ไว้ในแคช
2. **รูปภาพไม่เป็น absolute URL** - ต้องขึ้นต้นด้วย https://
3. **ขนาดรูปไม่ตรงมาตรฐาน** - Facebook ต้องการอย่างน้อย 1200x630px

## วิธีแก้ไข

### 1. ตรวจสอบ URL ของรถที่มีปัญหา

ตัวอย่าง: `https://www.chiangmaiusedcar.com/car/nissan-march-1-2-e-mt-2011-2554`

### 2. ใช้เครื่องมือ Facebook Debugger

เปิด: https://developers.facebook.com/tools/debug/

วิธีใช้:

1. วาง URL ของรถที่มีปัญหา
2. คลิก "Debug"
3. ดูข้อมูล Open Graph tags ที่ Facebook อ่านได้
4. คลิก "Scrape Again" เพื่อบังคับให้ Facebook อ่านข้อมูลใหม่

### 3. รีเฟรช cache ด้วย LINE Debugger

เปิด: https://poker.line.naver.jp/

วิธีใช้:

1. วาง URL ของรถที่มีปัญหา
2. คลิก "確認" (ตรวจสอบ)
3. ดูตัวอย่างการแสดงผลใน LINE

### 4. ตรวจสอบ Open Graph tags

เปิดหน้ารถใน browser และกด F12:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://www.chiangmaiusedcar.com/..." />
<meta property="og:url" content="https://www.chiangmaiusedcar.com/car/..." />
```

**สิ่งที่ต้องตรวจสอบ:**

- ✅ og:image ต้องเป็น absolute URL (ขึ้นต้นด้วย https://)
- ✅ รูปภาพต้องมีขนาดอย่างน้อย 1200x630px
- ✅ og:url ต้องเป็น absolute URL พร้อม www
- ✅ og:title และ og:description ต้องไม่เกิน 60 และ 155 ตัวอักษร

## การแก้ไขที่ทำแล้ว

### 1. ปรับปรุงการสร้าง absolute URL

```javascript
// Before
socialImage = `https://chiangmaiusedcar.com${socialImage}`;

// After
socialImage = `https://www.chiangmaiusedcar.com${socialImage}`;
```

### 2. เพิ่ม cache busting

```javascript
const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Update every hour
socialImage = `${socialImage}?v=${timestamp}&w=1200&h=630`;
```

### 3. เพิ่ม fallback image

หากไม่มีรูปรถ จะใช้รูปเริ่มต้น:

```
https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp
```

### 4. เพิ่ม debug logging

เปิด Console (F12) เพื่อดูข้อมูล SEO debug:

```javascript
console.log('🔍 Car Detail SEO Debug:', {
  title: '...',
  image: 'https://www.chiangmaiusedcar.com/...',
  imageAbsolute: true,
  facebookDebugUrl: '...',
});
```

## ขั้นตอนทดสอบ

### 1. ทดสอบในเครื่อง (localhost)

```bash
pnpm dev
```

เปิด http://localhost:3000/car/nissan-march-1-2-e-mt-2011-2554

### 2. ตรวจสอบ meta tags

- กด F12 → Elements/Inspector
- ค้นหา `<meta property="og:image"`
- ตรวจสอบว่าเป็น absolute URL

### 3. Deploy และทดสอบ

```bash
pnpm build
pnpm start
```

หรือ deploy ไป Vercel/Production

### 4. Clear Facebook cache

1. ไปที่ https://developers.facebook.com/tools/debug/
2. วาง URL: `https://www.chiangmaiusedcar.com/car/nissan-march-1-2-e-mt-2011-2554`
3. คลิก "Scrape Again" 2-3 ครั้ง
4. รอ 5-10 นาที
5. ลองแชร์ใหม่อีกครั้ง

### 5. ทดสอบแชร์จริง

- แชร์ลิงก์บน Facebook (โหมดส่วนตัวก่อน)
- แชร์ลิงก์บน LINE
- ตรวจสอบว่ารูปและข้อมูลแสดงถูกต้อง

## เคล็ดลับเพิ่มเติม

### บังคับ Facebook รีเฟรช cache ทันที

```bash
curl -X POST \
  -F "id=https://www.chiangmaiusedcar.com/car/YOUR-CAR-HANDLE" \
  -F "scrape=true" \
  "https://graph.facebook.com/?access_token=YOUR_ACCESS_TOKEN"
```

### ตรวจสอบรูปภาพ

```bash
curl -I https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp
```

ต้องได้ Status: 200 OK

### ปัญหาที่อาจพบ

#### ปัญหา: รูปไม่แสดงใน Facebook

**แก้ไข:**

1. ตรวจสอบว่ารูปเข้าถึงได้จาก public internet
2. ขนาดรูปต้อง >= 1200x630px
3. ไฟล์ต้องไม่เกิน 8MB
4. รูปต้องเป็น JPG, PNG หรือ WebP

#### ปัญหา: ข้อมูลเก่ายังติดอยู่

**แก้ไข:**

1. ใช้ Facebook Debugger → "Scrape Again"
2. เพิ่ม query parameter ใหม่ เช่น `?v=2`
3. รอ 24 ชั่วโมงให้ cache หมดอายุ

#### ปัญหา: LINE แสดงผลไม่ถูก

**แก้ไข:** LINE ใช้ og:image เหมือน Facebook ดังนั้นถ้าแก้ไข Facebook แล้ว LINE ก็จะถูกด้วย

## สรุป

หลังจากแก้ไขแล้ว:

1. ✅ รูปภาพเป็น absolute URL (https://www.chiangmaiusedcar.com/...)
2. ✅ มี cache busting (&v=timestamp)
3. ✅ มี fallback image
4. ✅ URL ใช้ www. เพื่อความเข้ากันได้ดีกว่า
5. ✅ มี debug logging สำหรับตรวจสอบ

**ต้องทำทุกครั้ง:**

- หลัง deploy ใหม่ → ใช้ Facebook Debugger
- เพิ่มรถใหม่ → ทดสอบแชร์ก่อน
- เปลี่ยนรูป → Scrape Again

**หมายเลขติดต่อ:** 094-064-9018  
**LINE:** @krunuengusedcar

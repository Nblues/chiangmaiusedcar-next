# 🔍 Facebook Sharing Debug Guide

## ปัญหา: กดแชร์ไปเฟสบุ๊คในหน้ารายละเอียดรถ รูปกับข้อมูลไม่แสดง

### 🎯 สาเหตุที่เป็นไปได้

1. **Facebook Cache** - Facebook เก็บข้อมูลเก่าไว้
2. **Image URL ไม่ valid** - รูปไม่เป็น absolute URL หรือขนาดไม่ถูกต้อง
3. **OG Tags ไม่ครบ** - Meta tags สำหรับ Open Graph ไม่ครบถ้วน
4. **HTTPS/Protocol** - Facebook ต้องการ HTTPS เท่านั้น

---

## ✅ วิธีตรวจสอบและแก้ไข

### 1. ทดสอบ URL ที่ Facebook Sharing Debugger

เปิด URL นี้:

```
https://developers.facebook.com/tools/debug/
```

วาง URL หน้ารายละเอียดรถ เช่น:

```
https://www.chiangmaiusedcar.com/car/toyota-yaris-ative-auto-1-2-play-auto-2021
```

กด **"Debug"** แล้วดูผลลัพธ์:

- ✅ เห็นรูปภาพ = OG tags ถูกต้อง
- ❌ ไม่เห็นรูป = มีปัญหา

### 2. Force Refresh Facebook Cache

หลังจาก debug แล้ว กด **"Scrape Again"** เพื่อบังคับให้ Facebook ดึงข้อมูลใหม่

### 3. ตรวจสอบ OG Tags ในเว็บ

**เปิด F12 → Elements → ค้นหา `<meta property="og:`**

ต้องมี tags เหล่านี้:

```html
<meta property="og:title" content="ชื่อรถ | ครูหนึ่งรถสวย" />
<meta property="og:description" content="รายละเอียดรถ..." />
<meta property="og:image" content="https://www.chiangmaiusedcar.com/image.jpg" />
<meta property="og:url" content="https://www.chiangmaiusedcar.com/car/xxx" />
<meta property="og:type" content="product" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 4. ตรวจสอบรูปภาพ

**รูปต้อง:**

- ✅ เป็น absolute URL: `https://www.chiangmaiusedcar.com/...`
- ✅ ใช้ HTTPS (ไม่ใช่ HTTP)
- ✅ ขนาดแนะนำ: 1200x630 pixels
- ✅ ขนาดไฟล์ไม่เกิน 8MB
- ✅ รูปต้องเข้าถึงได้ (ไม่ login, ไม่ private)

---

## 🔧 การแก้ไขในโค้ด

### ปัญหาที่เจอบ่อย:

#### 1. รูปเป็น Relative URL

❌ **ผิด:**

```javascript
image: '/herobanner/car.jpg';
```

✅ **ถูก:**

```javascript
image: 'https://www.chiangmaiusedcar.com/herobanner/car.jpg';
```

#### 2. รูปจาก Shopify CDN ไม่มี protocol

❌ **ผิด:**

```javascript
image: '//cdn.shopify.com/...';
```

✅ **ถูก:**

```javascript
image: 'https://cdn.shopify.com/...';
```

---

## 📋 Checklist การตรวจสอบ

- [ ] เปิด Facebook Sharing Debugger
- [ ] วาง URL หน้ารถที่ต้องการแชร์
- [ ] กด "Debug" และดูผลลัพธ์
- [ ] ตรวจสอบว่า og:image แสดงรูปถูกต้อง
- [ ] กด "Scrape Again" เพื่อ refresh cache
- [ ] ทดสอบแชร์จริงใน Facebook
- [ ] ตรวจสอบ og:title และ og:description

---

## 🚀 Solution สำหรับแอดมิน

### วิธีที่ 1: Batch Clear Facebook Cache (แนะนำ)

สร้างสคริปต์ clear cache ทุก URL:

```bash
# PowerShell
$urls = @(
  "https://www.chiangmaiusedcar.com/",
  "https://www.chiangmaiusedcar.com/all-cars",
  "https://www.chiangmaiusedcar.com/car/toyota-yaris-ative-auto-1-2-play-auto-2021"
  # ... เพิ่ม URLs รถอื่นๆ
)

foreach ($url in $urls) {
  Write-Host "Clearing cache for: $url"
  Invoke-WebRequest -Uri "https://developers.facebook.com/tools/debug/?q=$url" -Method GET
  Start-Sleep -Seconds 2
}
```

### วิธีที่ 2: ใช้ Facebook Graph API

```javascript
// ใน Node.js หรือ terminal
const axios = require('axios');

const urls = [
  'https://www.chiangmaiusedcar.com/car/toyota-yaris-ative-auto-1-2-play-auto-2021',
  // ... URLs อื่นๆ
];

urls.forEach(async url => {
  await axios.post(
    `https://graph.facebook.com/?id=${encodeURIComponent(url)}&scrape=true&access_token=YOUR_ACCESS_TOKEN`
  );
  console.log(`✅ Cleared: ${url}`);
});
```

---

## 📱 ทดสอบการแชร์

### Desktop

1. เปิดเว็บหน้ารถ
2. กดปุ่ม "แชร์ Facebook"
3. ดูว่ารูป + ข้อมูลแสดงถูกต้องไหม

### Mobile

1. เปิดเว็บใน Safari/Chrome mobile
2. กดปุ่มแชร์
3. เลือก Facebook
4. ตรวจสอบ preview

---

## ⚠️ ข้อควรระวัง

1. **Cache ใช้เวลา** - Facebook อาจใช้เวลา 5-30 นาทีในการอัปเดต cache
2. **ทดสอบหลายคัน** - แต่ละคันรถอาจมีปัญหาต่างกัน
3. **Shopify Images** - ตรวจสอบว่ารูปจาก Shopify CDN โหลดได้
4. **Next.js ISR** - หน้า static จะต้อง rebuild ก่อน (600s revalidation)

---

## 🔗 Tools ที่ใช้

1. **Facebook Sharing Debugger** https://developers.facebook.com/tools/debug/

2. **Open Graph Checker** https://www.opengraph.xyz/

3. **LinkedIn Post Inspector** (ถ้าแชร์ LinkedIn ด้วย) https://www.linkedin.com/post-inspector/

4. **Meta Tags Validator** https://metatags.io/

---

## 💡 Tips

- อัปเดตรูปรถใหม่ = ต้อง clear Facebook cache
- Deploy เว็บใหม่ = ควร clear cache ทุก URL
- รูปควรมีข้อความ/โลโก้ชัดเจน สำหรับ preview
- หลีกเลี่ยงรูปที่มีข้อความเยอะ (Facebook อาจตรวจจับเป็น spam)

---

## 📞 Support

หากยังมีปัญหา ติดต่อ:

- Facebook: https://www.facebook.com/KN2car
- โทร: 094-064-9018

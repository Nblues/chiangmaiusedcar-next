# Favicon Configuration for Search Engines - 2025 Standards

สร้างไฟล์นี้เพื่อระบุการใช้งาน favicon.png ในผลการค้นหาของ search engines

## Meta Tags สำหรับ Search Engines (2025)

### Google Search

- ขนาดที่แนะนำ: 16x16, 32x32, 48x48, 96x96, 192x192, 512x512
- รูปแบบ: PNG (รองรับ transparency)
- ใช้ favicon.png หลัก

### Bing Search

- ขนาดที่แนะนำ: 16x16, 32x32
- รูปแบบ: PNG, ICO
- ใช้ favicon.png และ favicon.ico

### DuckDuckGo

- ขนาดที่แนะนำ: 16x16, 32x32, 48x48
- รูปแบบ: PNG
- ใช้ favicon.png

### Yandex

- ขนาดที่แนะนำ: 16x16, 32x32, 120x120
- รูปแบบ: PNG, ICO
- ใช้ favicon.png

### Baidu (สำหรับตลาดจีน)

- ขนาดที่แนะนำ: 16x16, 32x32, 57x57, 72x72, 114x114
- รูปแบบ: PNG, ICO
- ใช้ favicon.png

## การปรับปรุงที่ทำแล้ว

1. **\_document.jsx**: เปลี่ยนจาก favicon.webp เป็น favicon.png
2. **SEO.jsx**: อัปเดต favicon links และ structured data
3. **manifest.json**: เปลี่ยน icons เป็น favicon.png
4. **browserconfig.xml**: อัปเดต Microsoft tiles เป็น favicon.png
5. **site.webmanifest**: สร้างใหม่สำหรับมาตรฐาน 2025

## Link Tags ที่เพิ่มแล้ว

```html
<!-- Primary favicon -->
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="shortcut icon" href="/favicon.png" />

<!-- Multi-size for different devices -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />

<!-- Microsoft Tiles -->
<meta name="msapplication-TileImage" content="/favicon.png" />
<meta name="msapplication-TileColor" content="#1a237e" />
```

## Schema.org Structured Data

อัปเดต logo ใน LocalBusiness schema:

```json
{
  "@type": "AutoDealer",
  "logo": {
    "@type": "ImageObject",
    "url": "https://chiangmaiusedcar.com/favicon.png",
    "width": "512",
    "height": "512"
  }
}
```

## ตรวจสอบผลลัพธ์

1. **Google Search Console**: ตรวจสอบ favicon ใน search results
2. **Rich Results Test**: ทดสอบ structured data
3. **Mobile-Friendly Test**: ตรวจสอบ favicon บนมือถือ
4. **PageSpeed Insights**: ตรวจสอบ loading performance

## การตรวจสอบเพิ่มเติม

- Google: `site:chiangmaiusedcar.com` ดู favicon ใน search results
- Bing: `site:chiangmaiusedcar.com` ตรวจสอบ favicon display
- DuckDuckGo: ค้นหา "ครูหนึ่งรถสวย" ดู favicon
- Yandex: ตรวจสอบสำหรับตลาดรัสเซีย

favicon.png จะแสดงในผลการค้นหาของ search engines ทั้งหมดตามมาตรฐาน 2025

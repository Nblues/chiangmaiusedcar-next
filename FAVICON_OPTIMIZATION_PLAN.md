# Favicon Optimization for SEO and Search Results

## ปัญหาที่พบ

- favicon.webp (48KB) ขนาดใหญ่เกินไป อาจทำให้โหลดช้า
- ขาดขนาดมาตรฐานที่ Google ต้องการ (16x16, 32x32, 96x96)
- ไม่มี favicon.png สำหรับ compatibility

## วิธีแก้ไข

### 1. สร้างไฟล์ favicon หลายขนาด

ควรมีไฟล์ต่อไปนี้:

- favicon.ico (16x16, 32x32, 48x48 multisize)
- favicon-16x16.png
- favicon-32x32.png
- favicon-96x96.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png

### 2. อัพเดต \_document.jsx

```jsx
{/* Favicon Settings - Multi-size for SEO */}
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

{/* Apple Touch Icons */}
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

{/* Android Chrome Icons */}
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
```

### 3. อัพเดต manifest.json

```json
{
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/favicon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    }
  ]
}
```

## ขั้นตอนดำเนินการ

1. ใช้เครื่องมือออนไลน์สร้าง favicon หลายขนาด
2. อัพเดตไฟล์การตั้งค่า
3. ทดสอบใน Google Search Console
4. รอ Google re-index (1-2 สัปดาห์)

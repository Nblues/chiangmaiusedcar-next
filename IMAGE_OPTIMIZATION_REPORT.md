# 📸 รายงานการแสดงรูปภาพรถยนต์ - 2025

## ✅ สถานะปัจจุบัน

### การตั้งค่าที่ดีอยู่แล้ว

1. **Next.js Image Component**

   - Quality: 85 (คุณภาพสูง)
   - Formats: AVIF, WebP (รูปแบบสมัยใหม่)
   - Lazy loading: ใช้งานอัตโนมัติ
   - Priority loading: รูปหลักโหลดก่อน

2. **Shopify CDN**

   - ต้นทาง: `cdn.shopify.com`
   - CDN ระดับโลก (edge caching)
   - SSL/TLS: ✅ HTTPS

3. **Responsive Design**

   ```javascript
   sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px';
   ```

   - Mobile: ความกว้างเต็มจอ
   - Tablet: 90% ของหน้าจอ
   - Desktop: จำกัด 1200px

4. **A11yImage Component**
   - Alt text อัตโนมัติ
   - Fallback เมื่อโหลดไม่ได้
   - Loading state + Error handling

---

## ⚠️ ปัญหาที่พบ

### `unoptimized: true` ใน next.config.js

```javascript
images: {
  unoptimized: true,  // ❌ ปิด Next.js optimization
}
```

**ผลกระทบ:**

- ❌ Next.js ไม่ได้ปรับขนาดรูปอัตโนมัติ
- ❌ ไม่ได้แปลงเป็น WebP/AVIF
- ❌ ใช้ไฟล์ต้นฉบับขนาดเต็มจาก Shopify
- 📊 รูปอาจหนัก 2-5 MB ต่อภาพ (แทนที่จะเป็น 200-500 KB)

**สาเหตุที่ตั้ง `unoptimized: true`:**

- หลีกเลี่ยง Vercel 402 Payment Required (Image Optimization billing)
- แต่ทำให้สูญเสีย performance

---

## 💡 วิธีแก้ไข (3 ทางเลือก)

### ทางเลือก 1: ใช้ Shopify Image Resizing (แนะนำ ⭐)

Shopify CDN รองรับการปรับขนาดรูปผ่าน URL parameters:

```javascript
// ก่อน
https://cdn.shopify.com/s/files/1/xxxxx/original.jpg

// หลัง
https://cdn.shopify.com/s/files/1/xxxxx/original.jpg?width=1200&format=webp
```

**ขั้นตอน:**

1. สร้าง utility function `optimizeShopifyImage(url, width)`
2. เพิ่ม width parameter ตาม viewport
3. เพิ่ม format=webp สำหรับ browser ที่รองรับ

**ข้อดี:**

- ✅ ฟรี (Shopify รองรับ built-in)
- ✅ ไม่มีค่าใช้จ่าย Vercel
- ✅ Edge CDN caching

**ข้อเสีย:**

- ต้องเขียน logic เอง

---

### ทางเลือก 2: ใช้ Cloudflare Images (Paid)

```javascript
// Cloudflare Image Resizing
https://chiangmaiusedcar.com/cdn-cgi/image/width=1200,format=auto,quality=85/shopify-image-url
```

**ข้อดี:**

- ✅ รองรับทุก format (WebP, AVIF, JPEG XL)
- ✅ Auto-optimization
- ✅ Polish feature (ลดขนาด 35-50%)

**ข้อเสีย:**

- 💰 ค่าใช้จ่าย: $5/เดือน (50,000 images)

---

### ทางเลือก 3: Pre-optimize ก่อน Upload

**ขั้นตอน:**

1. Resize รูปก่อน upload ไป Shopify

   - ขนาดแนะนำ: 1920x1440 (สูงสุด)
   - Mobile: 640x480
   - Thumbnail: 320x240

2. Compress ด้วย tools:
   - TinyPNG
   - Squoosh
   - ImageOptim

**ข้อดี:**

- ✅ ฟรี 100%
- ✅ ไฟล์เล็กตั้งแต่ต้น

**ข้อเสีย:**

- ⏰ ใช้เวลามากกว่า
- ไม่ responsive (ขนาดเดียวสำหรับทุก device)

---

## 🎯 แนวทางแก้ไขแนะนำ

### 1. สร้าง Shopify Image Optimizer (ฟรี)

```javascript
// utils/imageOptimizer.js
export function optimizeShopifyImage(url, width = 1200, format = 'webp') {
  if (!url || !url.includes('cdn.shopify.com')) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}&format=${format}`;
}

// ใช้งาน
<A11yImage
  src={optimizeShopifyImage(car.image, 1200)}
  srcSet={`
    ${optimizeShopifyImage(car.image, 640)} 640w,
    ${optimizeShopifyImage(car.image, 1024)} 1024w,
    ${optimizeShopifyImage(car.image, 1920)} 1920w
  `}
/>;
```

### 2. เพิ่ม Responsive Srcset

```javascript
// components/OptimizedCarImage.jsx
export function OptimizedCarImage({ src, alt, priority = false }) {
  return (
    <A11yImage
      src={optimizeShopifyImage(src, 1200)}
      srcSet={`
        ${optimizeShopifyImage(src, 640)} 640w,
        ${optimizeShopifyImage(src, 1024)} 1024w,
        ${optimizeShopifyImage(src, 1920)} 1920w
      `}
      sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
      alt={alt}
      priority={priority}
      quality={85}
    />
  );
}
```

### 3. Lazy Loading สำหรับ Thumbnails

```javascript
// หน้ารายละเอียดรถ - Gallery thumbnails
{
  carImages.map((img, idx) => (
    <A11yImage
      key={idx}
      src={optimizeShopifyImage(img.url, 200)} // Thumbnail ขนาดเล็ก
      loading={idx > 3 ? 'lazy' : 'eager'} // โหลด 4 รูปแรก
      quality={75} // คุณภาพต่ำกว่าสำหรับ thumbnail
    />
  ));
}
```

---

## 📊 ผลลัพธ์ที่คาดหวัง

### ก่อนปรับปรุง

- ขนาดรูป: 2-5 MB ต่อภาพ
- เวลาโหลด: 3-8 วินาที (3G)
- LCP (Largest Contentful Paint): 4.5s ❌

### หลังปรับปรุง

- ขนาดรูป: 200-500 KB ต่อภาพ (ลด 80-90%)
- เวลาโหลด: 0.5-1.5 วินาที (3G)
- LCP: 1.8s ✅ (ผ่านเกณฑ์ Google)

---

## ✅ Checklist การแก้ไข

### ด่วนที่สุด (ใช้เวลา 30 นาที)

- [ ] สร้าง `utils/imageOptimizer.js`
- [ ] Update `components/A11yImage.jsx` ใช้ optimizer
- [ ] Update `pages/car/[handle].jsx` รูปหลัก
- [ ] Test รูปโหลดเร็วขึ้น

### ระยะกลาง (ใช้เวลา 1 ชั่วโมง)

- [ ] เพิ่ม srcset สำหรับ responsive
- [ ] Optimize thumbnails (200px width)
- [ ] เพิ่ม lazy loading สำหรับ gallery
- [ ] Test performance ด้วย Lighthouse

### ระยะยาว (ใช้เวลา 2 ชั่วโมง)

- [ ] สร้าง `<OptimizedCarImage>` component
- [ ] Replace ทุกที่ที่ใช้รูปรถ
- [ ] เพิ่ม blur placeholder
- [ ] Monitor Core Web Vitals

---

## 🚀 คำสั่งเริ่มต้น

```bash
# 1. สร้าง image optimizer utility
# ตามตัวอย่างข้างบน

# 2. Test performance ก่อน
pnpm dlx @unlighthouse/cli --site https://www.chiangmaiusedcar.com

# 3. แก้ไขโค้ด

# 4. Test performance หลัง
pnpm dlx @unlighthouse/cli --site https://www.chiangmaiusedcar.com

# 5. Compare results
```

---

## 📌 หมายเหตุ

1. **Shopify Image API ฟรี**: ไม่มีค่าใช้จ่ายเพิ่ม
2. **Browser Caching**: ตั้ง Cache-Control: max-age=31536000
3. **CDN**: Shopify CDN มี edge servers ทั่วโลก
4. **Format Support**:
   - WebP: รองรับ 95%+ browsers
   - AVIF: รองรับ 80%+ browsers (ใหม่กว่า)

---

## 🔗 อ้างอิง

- [Shopify Image Parameters](https://shopify.dev/api/liquid/filters/url-filters#image_url)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Core Web Vitals](https://web.dev/vitals/)
- [WebP vs AVIF](https://www.smashingmagazine.com/2021/09/modern-image-formats-avif-webp/)

---

**สรุป**: รูปรถในเว็บ**คมชัดมาตรฐาน**แต่**โหลดช้าเกินจำเป็น** เพราะใช้ไฟล์ต้นฉบับขนาดเต็ม แนะนำใช้ **Shopify Image
Resizing (ฟรี)** เพื่อลดขนาดไฟล์ 80-90% โดยไม่สูญเสียคุณภาพ

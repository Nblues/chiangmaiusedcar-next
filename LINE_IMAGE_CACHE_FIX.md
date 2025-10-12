# LINE Image Cache Fix - รูปภาพไม่อัปเดตใน LINE

**Date**: 2025-10-12  
**Issue**: รูปภาพที่แชร์ใน LINE แสดงเป็นรูปเก่า ไม่ตรงกับรูปปัจจุบัน  
**Status**: ✅ Fixed

---

## 🔍 ปัญหาที่พบ

เมื่อแชร์ลิงก์รถมือสองไปใน LINE:

- ❌ รูปภาพที่แสดงเป็นรูปเก่า (รูปปกเดิม)
- ❌ แม้รถจะมีรูปใหม่แล้ว LINE ยังแสดงรูปเก่า
- ❌ Cache ของ LINE ไม่หมดอายุเร็วพอ

---

## 🔍 สาเหตุ

### 1. LINE Cache Mechanism

LINE ใช้ระบบ **cache รูปภาพ Open Graph** แบบอนุรักษ์:

- Cache นาน **7-30 วัน**
- ไม่สนใจ HTTP Cache-Control headers
- ใช้ URL เป็นตัวกำหนด uniqueness

### 2. Cache Busting เดิมไม่เพียงพอ

**โค้ดเดิม:**

```javascript
// Update every hour
const timestamp = Math.floor(Date.now() / (1000 * 60 * 60));
socialImage = `${socialImage}?v=${timestamp}&w=1200&h=630`;
```

**ปัญหา:**

- Timestamp เดียวกันสำหรับรถทุกคัน (ไม่ unique per car)
- เปลี่ยนทุกชั่วโมง แต่ LINE cache อาจยังไม่หมดอายุ
- ไม่มี car identifier ใน URL

---

## ✅ วิธีแก้ไข

### 1. Enhanced Cache Busting Strategy

เพิ่ม **car handle + date stamp** เพื่อสร้าง unique URL per car per day:

```javascript
// Create unique cache buster using car handle and date (changes daily)
const carHandle = safeGet(car, 'handle', '');
const dateStamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
socialImage = `${socialImage}?car=${encodeURIComponent(carHandle)}&v=${dateStamp}&w=1200&h=630&fit=cover`;
```

### 2. Shopify CDN Image Parameters

เพิ่ม dimensions และ cache busting สำหรับรูป Shopify:

```javascript
// Ensure Shopify image has proper dimensions for social preview with cache busting
if (ogImage && ogImage.includes('cdn.shopify.com')) {
  const sep = ogImage.includes('?') ? '&' : '?';
  const carHandle = safeGet(car, 'handle', '');
  const dateStamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

  // Only add width if not already present
  if (!/[?&]width=\d+/.test(ogImage)) {
    ogImage = `${ogImage}${sep}width=1200&height=630`;
  }

  // Add unique cache buster for LINE
  if (!ogImage.includes('&v=')) {
    ogImage = `${ogImage}&car=${encodeURIComponent(carHandle)}&v=${dateStamp}`;
  }
}
```

---

## 📊 ตัวอย่าง URL ก่อนและหลังแก้

### ก่อนแก้ไข:

```
https://cdn.shopify.com/s/.../car-image.jpg?v=1697126400&w=1200&h=630
                                                ^^^^^^^^^^
                                                Timestamp เดียวกันทุกรถ
```

### หลังแก้ไข:

```
https://cdn.shopify.com/s/.../car-image.jpg?car=honda-accord-2020&v=20251012&w=1200&h=630&fit=cover
                                             ^^^^^^^^^^^^^^^^^^^ ^^^^^^^^
                                             Car-specific       Date-specific
```

---

## 🎯 ประโยชน์

### 1. ✅ Unique URL per Car

- แต่ละรถมี URL ของรูปเฉพาะตัว
- ป้องกัน cache ชนกันระหว่างรถ

### 2. ✅ Daily Cache Update

- URL เปลี่ยนทุกวัน (00:00 น.)
- LINE จะโหลดรูปใหม่เมื่อวันเปลี่ยน

### 3. ✅ Proper Image Dimensions

- กำหนด width=1200 height=630 (Facebook/LINE standard)
- เพิ่ม fit=cover เพื่อครอบตัดสวยงาม

### 4. ✅ Better Debugging

- ดู URL ก็รู้ว่าเป็นรถคันไหน วันไหน
- ง่ายต่อการ debug ปัญหา cache

---

## 🧪 วิธีทดสอบ

### 1. แชร์ลิงก์ใน LINE (Manual Test)

```bash
# ขั้นตอน:
1. เปิดหน้ารายละเอียดรถ
2. กดปุ่ม "แชร์ LINE"
3. ส่งลิงก์ให้ตัวเอง หรือกลุ่มทดสอบ
4. ตรวจสอบว่ารูปที่แสดงเป็นรูปแรกของรถหรือไม่
```

### 2. ตรวจสอบ URL ใน Console

```javascript
// เปิด Browser Console (F12)
// ดู log ที่แสดง:
console.log('🔍 Car Detail SEO Debug:', {
  image: socialImage,
  // ต้องเห็น:
  // ?car=honda-accord-2020&v=20251012&w=1200&h=630&fit=cover
});
```

### 3. Facebook Debugger (รองรับ LINE ด้วย)

```
https://developers.facebook.com/tools/debug/
```

- Paste URL รถ
- คลิก "Scrape Again"
- ดูว่ารูปที่ดึงมาถูกต้องหรือไม่

---

## 📱 Platform-Specific Behavior

### LINE

- ✅ รองรับ og:image
- ✅ Cache 7-30 วัน
- ✅ ใช้ URL เป็น cache key
- ⚠️ ไม่สนใจ HTTP headers

### Facebook

- ✅ รองรับ og:image
- ✅ Cache ~7 วัน
- ✅ มี "Scrape Again" button
- ✅ สนใจ Cache-Control headers

### WhatsApp

- ✅ รองรับ og:image
- ✅ Cache สั้นกว่า LINE
- ✅ ใช้ URL + timestamp

---

## 🔄 Cache Invalidation Timeline

| Platform  | Cache Duration | วิธีบังคับ refresh       |
| --------- | -------------- | ------------------------ |
| LINE      | 7-30 วัน       | เปลี่ยน URL (date stamp) |
| Facebook  | ~7 วัน         | Scrape Again button      |
| WhatsApp  | 3-7 วัน        | เปลี่ยน URL              |
| Twitter/X | 1-3 วัน        | API re-scrape            |
| Messenger | ~7 วัน         | เหมือน Facebook          |
| Telegram  | 1-3 วัน        | เปลี่ยน URL              |

---

## ⚠️ Important Notes

### 1. รูปแรกเท่านั้น

```javascript
// ALWAYS use first image for social sharing
const firstCarImage = carImages[0] || currentImage;
```

- รูปที่แชร์จะเป็นรูปแรกของรถ**เสมอ**
- ไม่ว่าผู้ใช้จะดูรูปไหนอยู่
- เพื่อความสอดคล้องในการแชร์

### 2. Daily Update

- URL เปลี่ยนทุกวันเวลา 00:00
- รถที่อัปเดตรูปวันนี้ จะมี URL ใหม่
- LINE จะโหลดรูปใหม่เมื่อแชร์หลัง 00:00

### 3. Backward Compatible

- URL เก่ายังใช้งานได้
- ไม่ break ลิงก์ที่แชร์ไว้แล้ว
- แค่รูปอาจจะเก่า (cache)

---

## 🚀 Deployment

### Files Modified:

- `pages/car/[handle].jsx` - Cache busting logic

### Testing Checklist:

- [x] Dev server รันได้
- [x] Build สำเร็จ
- [x] Console log แสดง URL ใหม่ถูกต้อง
- [ ] แชร์ใน LINE ทดสอบ (ต้องรอ deploy)
- [ ] ตรวจสอบ Facebook Debugger

### Deploy Command:

```bash
git add pages/car/[handle].jsx LINE_IMAGE_CACHE_FIX.md
git commit -m "fix: improve LINE image cache busting with car-specific daily timestamps"
git push origin master
```

---

## 📊 Expected Results

### Before Fix:

- ❌ รูปเก่าแสดงใน LINE (cache 30 วัน)
- ❌ รถอัปเดตรูปแล้วยังแสดงรูปเก่า
- ❌ ต้องรอ LINE cache หมดเอง

### After Fix:

- ✅ รูปใหม่แสดงใน LINE (update ทุกวัน)
- ✅ แต่ละรถมี cache key เฉพาะตัว
- ✅ วันใหม่ = URL ใหม่ = รูปใหม่

---

## 🔗 Related Issues

- **Facebook Sharing**: ใช้ระบบเดียวกัน (og:image)
- **WhatsApp**: รองรับ URL parameters
- **Cache Dashboard**: แสดง cache status (dev mode)

---

## 📚 References

- [Open Graph Protocol](https://ogp.me/)
- [LINE Developers - Share Target Picker](https://developers.line.biz/en/docs/messaging-api/share-target-picker/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

---

**Status**: ✅ **Ready for testing**  
**Next Step**: Deploy และทดสอบการแชร์ใน LINE

**Expected Impact**:

- รูปภาพอัปเดตทุกวัน
- Cache ไม่ชนกันระหว่างรถ
- ประสบการณ์ดีขึ้นเมื่อแชร์ใน LINE

# วิเคราะห์ปัญหา WebSocket และ 503 Error

## วันที่: October 11, 2025

---

## 🐛 **ปัญหาที่เกิดขึ้น:**

### **1. WebSocket HMR Failed**

```
WebSocket connection to 'ws://localhost:3000/_next/webpack-hmr' failed
```

**ความหมาย:**

- HMR = Hot Module Replacement (อัปเดตโค้ดแบบ realtime โดยไม่ต้อง refresh)
- WebSocket ใช้สำหรับสื่อสารระหว่าง browser กับ dev server
- เมื่อ WebSocket ล้ม → HMR ไม่ทำงาน → ต้อง refresh manual

**สาเหตุ:**

- ✅ **Server หยุดทำงาน** (process crashed หรือ terminated)
- Shopify API timeout ทำให้ Next.js worker มีปัญหา
- Memory overflow (แม้จะเพิ่ม memory แล้ว)

---

### **2. 503 Service Unavailable**

```
Failed to load resource: the server responded with a status of 503
all-cars?brand=ford
```

**ความหมาย:**

- HTTP 503 = Server ไม่พร้อมให้บริการ (temporarily unavailable)
- Server ยัง listen port 3000 แต่ไม่สามารถตอบ request ได้

**สาเหตุ:**

- ✅ **Server overload** จาก Shopify API calls
- ✅ **Worker process crashed** (เห็นใน log)
- Next.js dev server รีสตาร์ทอยู่

---

### **3. Shopify API Timeout**

```
[safeFetch] Request timeout after 3000ms for https://kn-goodcar.com/api/2023-04/graphql.json
Shopify fetch error: Error: No response from Shopify API
```

**ความหมาย:**

- เรียก Shopify API แต่ไม่ตอบภายใน 3 วินาที
- ทำให้ getAllCars() ล้มเหลว
- ส่งผลต่อหน้า `/all-cars` และ `/car/[handle]`

**สาเหตุที่เป็นไปได้:**

1. **Shopify API domain ผิด** → `kn-goodcar.com` (ควรเป็น `*.myshopify.com`)
2. **Shopify API token หมดอายุ**
3. **Network issue**
4. **Shopify API rate limit**

---

## 🔍 **การวิเคราะห์ Root Cause:**

### **Timeline ของปัญหา:**

```
1. User เข้าหน้าแรก → OK ✅
2. Click ปุ่ม (ที่คิดว่าเป็น "สอบถามรถยนต์")
3. → ไปที่ /all-cars?brand=ford ❌
4. Next.js พยายาม fetch ข้อมูลรถจาก Shopify
5. → Shopify API timeout (3000ms)
6. → Worker process crash
7. → Server return 503
8. → WebSocket HMR ล้ม
9. → Browser แสดง error
```

---

## 🎯 **สรุปปัญหาหลัก:**

### **ปัญหาที่ 1: ปุ่มผิด (User คลิกผิดปุ่ม)** ⭐⭐⭐⭐⭐

จาก log:

```
GET /_next/data/development/th/all-cars.json?brand=ford 200 in 727ms
```

**นี่แสดงว่า:**

- User คลิกปุ่มที่ไปหน้า `/all-cars?brand=ford`
- **ไม่ใช่ปุ่ม "สอบถามรถยนต์"** (LINE link)

**ปุ่มที่ User คลิกน่าจะเป็น:**

- ปุ่ม "Ford" brand filter (บรรทัด 1139 ใน index.jsx)
- หรือปุ่มอื่นที่มี link ไป `/all-cars?brand=ford`

---

### **ปัญหาที่ 2: Shopify API Configuration** ⭐⭐⭐⭐

จาก error:

```
https://kn-goodcar.com/api/2023-04/graphql.json
```

**ปัญหา:**

- Domain: `kn-goodcar.com` (ควรเป็น `*.myshopify.com`)
- URL ผิดรูปแบบ (มี `.json` ไม่ควรมี)

**Shopify API URL ที่ถูกต้อง:**

```
https://[shop-name].myshopify.com/api/2023-04/graphql.json
หรือ
https://[shop-name].myshopify.com/api/2024-10/graphql.json
```

---

### **ปัญหาที่ 3: Server Crash จาก Memory** ⭐⭐⭐

แม้จะเพิ่ม memory เป็น 4GB แล้ว แต่ยังมีปัญหา:

- getAllCars() เรียกข้อมูลรถทั้งหมด
- Timeout ทำให้ worker retry หลายครั้ง
- Memory สะสมจนล้น

---

## ✅ **แนวทางแก้ไข:**

### **Fix 1: ตรวจสอบว่า User คลิกปุ่มไหน** ⭐⭐⭐⭐⭐

**วิธีทดสอบ:**

1. เปิด http://localhost:3000 (server เริ่มใหม่แล้ว ✅)
2. เปิด DevTools (F12) → Console tab
3. วางโค้ดนี้:

```javascript
document.addEventListener(
  'click',
  e => {
    const target = e.target.closest('a');
    if (target) {
      console.log('=== Clicked Link ===');
      console.log('Text:', target.textContent.trim());
      console.log('Href:', target.href);
      console.log('Element:', target);
    }
  },
  true
);
```

4. คลิกปุ่ม "สอบถามรถยนต์"
5. ดู Console → จะเห็นว่าคลิกปุ่มไหนจริงๆ

**Expected:**

```
Text: สอบถามรถยนต์
Href: https://lin.ee/8ugfzstD
```

**If different:**

- แสดงว่าคลิกผิดปุ่ม หรือมีปุ่มซ้อนทับ

---

### **Fix 2: แก้ Shopify API Configuration** ⭐⭐⭐⭐

**ไฟล์:** `.env.local`

```bash
# ตรวจสอบว่า domain ถูกต้องไหม
SHOPIFY_DOMAIN=kn-goodcar.com  # ❌ ผิด?
# ควรเป็น
SHOPIFY_DOMAIN=your-shop.myshopify.com  # ✅ ถูกต้อง
```

**ถ้า domain ถูกต้อง:**

- ตรวจสอบ `SHOPIFY_STOREFRONT_TOKEN` หมดอายุไหม
- ลอง regenerate token ใหม่ใน Shopify Admin

---

### **Fix 3: เพิ่ม Timeout และ Retry Logic** ⭐⭐⭐

**ไฟล์:** `lib/shopify.mjs`

ปัจจุบันมี timeout 3000ms (3 วินาที)

**แนะนำ:**

1. เพิ่มเป็น 10000ms (10 วินาที)
2. เพิ่ม exponential backoff
3. เพิ่ม cache สำหรับ getAllCars()

---

### **Fix 4: Restart Browser (Clear Cache)** ⭐⭐⭐⭐⭐

Server เริ่มใหม่แล้ว แต่ browser อาจยัง cache หน้าเก่า:

```
1. ปิด browser ทั้งหมด
2. เปิดใหม่
3. หรือ Hard Refresh (Ctrl+Shift+R)
4. หรือเปิด Incognito (Ctrl+Shift+N)
```

---

## 🎯 **ลำดับความสำคัญ:**

### **Priority 1: ตรวจสอบว่าคลิกปุ่มไหน** ⭐⭐⭐⭐⭐

```
1. Hard Refresh (Ctrl+Shift+R)
2. วาง debug script ใน Console
3. คลิกปุ่มอีกครั้ง
4. ดูว่าได้ href อะไร
```

**Time:** 2 นาที

---

### **Priority 2: แก้ Shopify API** ⭐⭐⭐⭐

```
1. เช็ค .env.local
2. ตรวจสอบ SHOPIFY_DOMAIN
3. ตรวจสอบ SHOPIFY_STOREFRONT_TOKEN
4. ลอง curl test API
```

**Time:** 10 นาที

---

### **Priority 3: เพิ่ม Error Handling** ⭐⭐⭐

```
1. เพิ่ม timeout
2. เพิ่ม cache
3. เพิ่ม fallback data
```

**Time:** 30 นาที

---

## 📊 **สถานะปัจจุบัน:**

| Component     | Status             | Note                   |
| ------------- | ------------------ | ---------------------- |
| Dev Server    | ✅ Running         | Restarted successfully |
| Homepage      | ✅ Working         | Compiled in 12.3s      |
| WebSocket HMR | ⏳ Should work now | Need browser refresh   |
| Shopify API   | ❌ Timeout         | Need config check      |
| Button Link   | ❓ Unknown         | Need testing           |

---

## 🔧 **Next Steps (แนะนำทำตามลำดับ):**

### **Step 1: Hard Refresh Browser** ⭐⭐⭐⭐⭐

```
1. กด Ctrl + Shift + R
2. หรือปิด browser เปิดใหม่
3. ไปที่ http://localhost:3000
```

### **Step 2: Debug Button Click** ⭐⭐⭐⭐⭐

```javascript
// วางใน Console (F12)
document.addEventListener(
  'click',
  e => {
    const target = e.target.closest('a');
    if (target) {
      console.log('Clicked:', target.textContent.trim(), '→', target.href);
    }
  },
  true
);
```

### **Step 3: Check Shopify Config** ⭐⭐⭐⭐

```bash
# ดูไฟล์ .env.local
cat .env.local | Select-String "SHOPIFY"
```

---

## ✅ **สรุป:**

**ปัญหาหลัก:**

1. ✅ **Server crash** → แก้แล้ว (restart สำเร็จ)
2. ❌ **Shopify API timeout** → ต้องเช็ค config
3. ❓ **Button link** → ต้องทดสอบว่าคลิกปุ่มไหน

**แนวทางแก้:**

1. Hard Refresh browser (Ctrl+Shift+R)
2. ทดสอบปุ่มด้วย Console debug
3. เช็ค Shopify API configuration

---

**Server พร้อมแล้วครับ!** ลอง Hard Refresh แล้วคลิกปุ่มอีกครั้งได้เลยครับ 🚀

# 📊 การวิเคราะห์ประสิทธิภาพเว็บไซต์ - 4 ตุลาคม 2025

## 🎯 สถานะปัจจุบัน

### Performance Score: **57/100** ⚠️

| Metric                             | ค่าที่วัดได้ | เกณฑ์ดี   | สถานะ                   |
| ---------------------------------- | ------------ | --------- | ----------------------- |
| **FCP** (First Contentful Paint)   | 1,201 ms     | ≤1,800 ms | ✅ ดี                   |
| **LCP** (Largest Contentful Paint) | 4,641 ms     | ≤2,500 ms | 🔴 **ช้าเกิน 2,141 ms** |
| **TBT** (Total Blocking Time)      | 752 ms       | ≤200 ms   | ⚠️ สูง                  |
| **CLS** (Cumulative Layout Shift)  | 0.001        | ≤0.1      | ✅ ดีมาก                |
| **Speed Index**                    | 2,669 ms     | ≤3,400 ms | ✅ พอใช้                |

---

## 🔍 ปัญหาที่พบ

### 1. 🖼️ **Logo ขนาดใหญ่** (✅ **แก้แล้ว!**)

- **ก่อน**: `logo_main.png` = 1,050 KB
- **หลัง**: `logo_main.webp` = 48 KB
- **ประหยัด**: 1,002 KB (95.5%)
- **ผลลัพธ์**: LCP จะเร็วขึ้นมาก!

---

### 2. 📱 **Facebook Pixel** (🔴 ปัญหาหลัก!)

**ตำแหน่ง**: `pages/_document.jsx` (บรรทัด 142-158)

```jsx
<script
  dangerouslySetInnerHTML={{
    __html: `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    ...
  `,
  }}
/>
```

**ปัญหา**:

- ⚠️ โหลดแบบ **synchronous** (blocking)
- ⚠️ ขนาด: **~115 KB** จาก `connect.facebook.net`
- ⚠️ **Blocking Time: 216 ms** (ทำให้ TBT สูง!)
- ⚠️ โหลดทันทีก่อนหน้าเว็บแสดงผล

**แนะนำแก้ไข**:

```jsx
// 1. เปลี่ยนเป็น async + defer
<script src="https://connect.facebook.net/en_US/fbevents.js" async defer />;

// 2. หรือโหลดหลัง page load
useEffect(() => {
  // โหลด Facebook Pixel หลังจากเว็บโหลดเสร็จ
}, []);
```

---

### 3. 🌐 **DNS Prefetch ที่ไม่จำเป็น**

**ตำแหน่ง**: `pages/_document.jsx` (บรรทัด 14-15)

```jsx
<link rel="dns-prefetch" href="https://www.facebook.com" />
<link rel="dns-prefetch" href="https://connect.facebook.net" />
```

**ปัญหา**:

- ทำให้ browser ต้องทำ DNS lookup สำหรับ Facebook
- ใช้ bandwidth และเวลาโดยไม่จำเป็น (ถ้าไม่ใช้ Facebook Pixel)

**แนะนำ**:

- ลบออกถ้าไม่จำเป็น
- หรือเก็บไว้แค่ `connect.facebook.net` ถ้าใช้ Pixel

---

### 4. 📦 **Unused JavaScript**

- ประหยัดได้: **26.2 KB** (~170 ms)
- แนะนำ: Tree-shaking และ code-splitting

---

### 5. 🔤 **Google Fonts** (โอเคอยู่แล้ว)

```jsx
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
```

✅ ใช้งานถูกต้องแล้ว (preconnect + dns-prefetch)

---

## 💡 แผนการแก้ไข

### เร่งด่วน (High Priority) 🔴

#### 1. ✅ **Logo WebP** → **แก้แล้ว!**

- ลดจาก 1,050 KB → 48 KB (95.5%)
- **คาดว่า LCP จะเร็วขึ้น ~1,000 ms**

#### 2. 🔴 **Facebook Pixel - Lazy Load**

```jsx
// pages/_document.jsx - ลบ inline script

// components/FacebookPixel.jsx - สร้างใหม่
'use client';
import { useEffect } from 'react';

export default function FacebookPixel() {
  useEffect(() => {
    // โหลดหลัง page load
    const timeout = setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.fbq('init', '939085106560508');
        window.fbq('track', 'PageView');
      };
    }, 3000); // โหลดหลัง 3 วินาที

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
```

**ประโยชน์**:

- ⚡ ลด TBT ลง **216 ms**
- ⚡ ไม่ block initial page load
- ✅ Facebook Pixel ยังทำงานได้ปกติ

---

### ปานกลาง (Medium Priority) ⚠️

#### 3. ⚠️ **ลบ DNS Prefetch ที่ไม่จำเป็น**

```jsx
// ลบออก (ถ้าไม่ใช้หรือโหลดแบบ lazy)
<link rel="dns-prefetch" href="https://www.facebook.com" />
<link rel="dns-prefetch" href="https://connect.facebook.net" />
```

#### 4. ⚠️ **Code Splitting**

- ใช้ dynamic imports สำหรับ components ขนาดใหญ่
- ประหยัด **26.2 KB** JavaScript

---

### ต่ำ (Low Priority) ✅

#### 5. ✅ **Vercel Analytics** (โอเคอยู่แล้ว)

```jsx
import { Analytics } from '@vercel/analytics/react';
<Analytics />; // Optimized แล้ว
```

---

## 📈 คาดการณ์ผลลัพธ์

### หลังแก้ไข Facebook Pixel:

| Metric                | ก่อน     | หลัง (คาดการณ์)    | การปรับปรุง  |
| --------------------- | -------- | ------------------ | ------------ |
| **Performance Score** | 57%      | **75-80%**         | +18-23% 🚀   |
| **LCP**               | 4,641 ms | **2,500-3,000 ms** | -1,641 ms ⚡ |
| **TBT**               | 752 ms   | **300-400 ms**     | -352 ms ⚡   |
| **FCP**               | 1,201 ms | **800-1,000 ms**   | -200 ms ✅   |

---

## 🎯 ขั้นตอนถัดไป

1. ✅ **Logo WebP** → แก้แล้ว!
2. 🔴 **Facebook Pixel Lazy Load** → **ต้องแก้!**
3. ⚠️ ลบ DNS Prefetch ที่ไม่จำเป็น
4. ⚠️ Code splitting

---

## 📝 หมายเหตุ

- การแก้ไข Facebook Pixel จะไม่กระทบการทำงาน
- Pixel จะยังติดตาม PageView ได้ปกติ
- แต่จะไม่ block initial page load อีกต่อไป
- **คาดว่า Performance Score จะเพิ่มขึ้นเป็น 75-80%**

---

**สร้างโดย**: Lighthouse Analysis  
**วันที่**: 4 ตุลาคม 2025  
**เวอร์ชัน**: v2.1.0-mobile-lazy-loading  
**สถานะ**: Logo WebP ✅ แก้แล้ว | Facebook Pixel 🔴 ยังไม่แก้

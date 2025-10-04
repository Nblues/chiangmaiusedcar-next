# 🔍 Performance Optimization Phase 2 - Analysis Report

**วันที่**: 4 ตุลาคม 2025  
**สถานะ**: การวิเคราะห์หลังการ Optimize ครั้งที่ 1

---

## 📊 Performance Baseline (Before Optimization)

### Core Web Vitals:

- **Performance Score**: 57% ❌
- **LCP (Largest Contentful Paint)**: 4,641 ms ❌ (เป้าหมาย: ≤2,500 ms)
- **TBT (Total Blocking Time)**: 753 ms ⚠️ (เป้าหมาย: ≤200 ms)
- **CLS (Cumulative Layout Shift)**: 0.001 ✅

### Other Metrics:

- **FCP (First Contentful Paint)**: 1,201 ms ⚠️
- **Speed Index**: 7,973 ms ❌
- **TTI (Time to Interactive)**: 12,599 ms ❌

---

## ✅ การ Optimize ที่ทำไปแล้ว (Phase 1)

### 1. Logo WebP Optimization ✅

- **ก่อน**: `logo_main.png` - 1,050 KB
- **หลัง**: `logo_main.webp` - 48 KB
- **ลดลง**: 1,002 KB (95.5%)
- **ผลที่คาดหวัง**: LCP ลดลง ~1,500 ms

**Implementation:**

```jsx
// Navbar.jsx & Footer.jsx
<picture>
  <source srcSet="/logo/logo_main.webp" type="image/webp" />
  <img src="/logo/logo_main.png" alt="..." width="48" height="48" />
</picture>
```

### 2. Facebook Pixel Lazy Loading ✅

- **ก่อน**: Inline script blocking 216 ms
- **หลัง**: Lazy load หลัง 3 วินาที (0 ms blocking)
- **ลดลง**: 216 ms TBT

**Implementation:**

```jsx
// components/FacebookPixel.jsx
useEffect(() => {
  setTimeout(() => {
    // โหลด FB Pixel script
  }, 3000);
}, []);
```

### 3. Console.log Removal ✅

- **ลบ console.log/warn** จาก:
  - `FacebookPixel.jsx`
  - `pages/_app.jsx`
  - `utils/siteLocation.ts`
- **ผลที่คาดหวัง**: JavaScript bundle ลดลง ~1-2 KB

---

## 🎯 จุดที่ควรปรับเพิ่มเติม (Phase 2)

### 1. ⚠️ **Hero Banner Images ยังไม่เป็น WebP**

**ปัญหา:**

```
/public/herobanner/
├── cnxallcar.png ← ❌ PNG ขนาดใหญ่
├── (มีหลายรูป ยังเป็น PNG/JPEG)
```

**โซลูชัน:**

- แปลง hero banner ทั้งหมดเป็น WebP
- ใช้ `<picture>` tag เหมือนโลโก้
- คาดว่าลดได้ 200-500 KB ต่อรูป

**Priority**: 🔴 สูง (เพราะเป็นรูปที่โหลดก่อนบนหน้าแรก)

---

### 2. ⚠️ **Next.js Image Optimization ถูกปิด**

**ใน `next.config.js`:**

```javascript
images: {
  unoptimized: true, // ← ปิดไว้เพื่อหลีกเลี่ยง Vercel 402 Payment
}
```

**ปัญหา:**

- รูปภาพไม่ได้ถูก optimize โดย Next.js
- ไม่มี automatic WebP conversion
- ไม่มี responsive image srcset

**โซลูชัน:**

- เปิด optimization กลับ (`unoptimized: false`)
- ใช้ Vercel Edge Network (Free tier มี quota 1,000 images/month)
- หรือใช้ Shopify CDN สำหรับรูปรถ (มีอยู่แล้ว)

**Priority**: 🟡 กลาง (ต้องตรวจสอบ Vercel quota ก่อน)

---

### 3. ⚠️ **Preload Critical Resources**

**ยังไม่มี:**

```html
<link rel="preload" href="/logo/logo_main.webp" as="image" />
<link rel="preload" href="/fonts/prompt-thai.woff2" as="font" crossorigin />
```

**โซลูชัน:**

- เพิ่ม preload สำหรับโลโก้ (LCP element)
- Preload ฟอนต์ Prompt (ป้องกัน FOIT/FOUT)

**Priority**: 🟡 กลาง

**Implementation:**

```jsx
// pages/_document.jsx
<Head>
  <link rel="preload" href="/logo/logo_main.webp" as="image" type="image/webp" />
  <link rel="preload" href="/fonts/prompt-v9-thai-regular.woff2" as="font" type="font/woff2" crossorigin />
</Head>
```

---

### 4. ⚠️ **Service Worker Cache Strategy**

**ปัจจุบัน:**

- มี Service Worker แต่ไม่ได้ cache resources อย่างมีประสิทธิภาพ

**โซลูชัน:**

- ใช้ Workbox สำหรับ precaching
- Cache hero images, fonts, โลโก้
- Stale-While-Revalidate strategy

**Priority**: 🟢 ต่ำ (เพิ่ม repeat visit performance)

---

### 5. 🔍 **Font Loading Strategy**

**ปัจจุบัน:**

```css
/* ใช้ @fontsource/prompt */
```

**ปัญหา:**

- อาจมี FOUT (Flash of Unstyled Text)
- ไม่มี font-display strategy ที่ชัดเจน

**โซลูชัน:**

```css
@font-face {
  font-family: 'Prompt';
  font-display: swap; /* แสดงฟอนต์ fallback ก่อน */
  src: url('/fonts/prompt.woff2') format('woff2');
}
```

**Priority**: 🟢 ต่ำ

---

### 6. ⚠️ **Code Splitting & Dynamic Imports**

**ยังไม่เพียงพอ:**

- มี lazy loading บางส่วน (`CookieConsent`, `PWAInstallPrompt`)
- แต่ยังมี components อื่นที่ควร lazy load

**โซลูชัน:**

```jsx
// Lazy load non-critical components
const SocialShareButtons = dynamic(() => import('./SocialShareButtons'));
const ReviewSection = dynamic(() => import('./ReviewSection'));
const SimilarCars = dynamic(() => import('./SimilarCars'));
```

**Priority**: 🟡 กลาง

---

### 7. 🔍 **CSS Optimization**

**ตรวจสอบ:**

- มี unused CSS หรือไม่?
- Tailwind CSS purge ทำงานถูกต้องหรือไม่?

**โซลูชัน:**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  // Ensure purge is working
};
```

**Priority**: 🟢 ต่ำ

---

### 8. ⚠️ **Third-Party Scripts**

**ปัจจุบัน:**

- Facebook Pixel: ✅ Lazy loaded แล้ว
- Vercel Analytics: ✅ อยู่ท้าย layout
- EmailJS: ⚠️ โหลดเมื่อไหร่?
- Google reCAPTCHA: ⚠️ โหลดเมื่อไหร่?

**โซลูชัน:**

- ตรวจสอบว่า scripts เหล่านี้ block rendering หรือไม่
- ใช้ `next/script` กับ `strategy="lazyOnload"`

**Priority**: 🟡 กลาง

---

## 📈 ผลที่คาดหวังหลัง Phase 2

### ถ้าทำ Priority สูง (Hero Images + Preload):

- **Performance Score**: 57% → **75-80%** 🎯
- **LCP**: 4,641ms → **2,500-3,000ms** 🎯
- **TBT**: 753ms → **300-400ms** 🎯
- **FCP**: 1,201ms → **800-1,000ms** 🎯

### ถ้าทำครบทุกจุด:

- **Performance Score**: 57% → **85-90%** 🚀
- **LCP**: 4,641ms → **2,000-2,500ms** 🚀
- **TBT**: 753ms → **200-300ms** 🚀
- **FCP**: 1,201ms → **600-800ms** 🚀

---

## 🎬 แผนการดำเนินการแนะนำ

### ⭐ Priority 1 (ทำเลย - Impact สูง):

1. ✅ แปลง Hero Banner เป็น WebP
2. ✅ เพิ่ม Preload สำหรับโลโก้และฟอนต์
3. ✅ Lazy load third-party scripts (EmailJS, reCAPTCHA)

### ⭐ Priority 2 (ทำตาม - Impact กลาง):

1. Code splitting components
2. ตรวจสอบ unused CSS
3. Font loading optimization

### ⭐ Priority 3 (Optional - เพิ่ม UX):

1. Service Worker caching
2. Next.js Image optimization (ถ้า quota พอ)

---

## 📝 Notes

- **ไฟล์ report.json เก่า** = Performance ก่อน optimize
- **ต้องรัน Lighthouse ใหม่** หลัง deploy เพื่อดูผลจริง
- **Vercel deployment** จะเร็วกว่า localhost (มี Edge Network)

---

**Created**: 2025-10-04  
**Author**: GitHub Copilot  
**Status**: 🔄 Waiting for user decision

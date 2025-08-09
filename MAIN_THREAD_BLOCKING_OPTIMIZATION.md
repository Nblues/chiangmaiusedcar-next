# หลีกเลี่ยงงานในเทรดหลักที่ใช้เวลานาน - ลด 5 งานที่บล็อก

## 🚨 ปัญหาที่พบ

**Total Blocking Time (TBT)**: พบ 5 งานที่ใช้เวลานาน บล็อก main thread

### รายการงานที่ใช้เวลานานที่สุด:

#### 🔴 Critical Blocking Tasks

1. **Google Tag Manager**: 214ms (เริ่มที่ 14,292ms)
2. **Google Analytics**: 133ms (เริ่มที่ 14,211ms)
3. **Framework JS**: 206ms (เริ่มที่ 11,849ms)
4. **Main Document**: 794ms (เริ่มที่ 70ms)
5. **Framework JS (ซ้ำ)**: 55ms (เริ่มที่ 11,794ms)

**Total Main Thread Blocking**: ~1,402ms **เป้าหมาย**: ลดลงเหลือ <600ms (ปรับปรุง ~800ms)

## 📊 การวิเคราะห์ปัญหา

### 1. Google Tag Manager (214ms + 133ms = 347ms)

```javascript
// ปัญหา: Synchronous loading ทำให้บล็อก main thread
<script async src="https://www.googletagmanager.com/gtag/js?id=G-81DK266FDR"></script>
```

### 2. Framework JS (206ms + 55ms = 261ms)

```javascript
// ปัญหา: Large bundle กำลังถูก parse และ execute
chunks/framework-1c898….js // ขนาด 46.0 KiB
```

### 3. Main Document Processing (794ms)

```javascript
// ปัญหา: HTML parsing + CSS parsing + initial JS execution
// เวลาเริ่มต้น 70ms แต่ใช้เวลานาน 794ms
```

## 🔧 แผนการแก้ไข

### Phase 1: Defer Google Analytics (ลด ~347ms)

#### Before (บล็อก main thread):

```javascript
// _app.js หรือ _document.js
<script async src="https://www.googletagmanager.com/gtag/js?id=G-81DK266FDR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-81DK266FDR');
</script>
```

#### After (โหลดหลัง user interaction):

```javascript
// utils/analytics.js
let analyticsLoaded = false;

export const loadAnalytics = () => {
  if (analyticsLoaded) return;

  // Lazy load เมื่อมี user interaction
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-81DK266FDR';
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-81DK266FDR');
  };

  analyticsLoaded = true;
};

// Auto-load after 3 seconds or on first interaction
setTimeout(loadAnalytics, 3000);
document.addEventListener('click', loadAnalytics, { once: true });
document.addEventListener('scroll', loadAnalytics, { once: true });
```

### Phase 2: Code Splitting Framework JS (ลด ~261ms)

#### Current Bundle:

```
chunks/framework-1c898….js: 46.0 KiB (เป็น bundle เดียว)
```

#### Target Bundle Splitting:

```javascript
// next.config.js
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Framework code (React, Next.js core)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Vendor libraries
          vendor: {
            chunks: 'all',
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            minSize: 10000,
            maxSize: 25000, // ลิมิตขนาด chunk
          },
        },
      };
    }
    return config;
  },
};
```

### Phase 3: Critical CSS Optimization (ลด ~200ms)

#### Inline Critical CSS:

```javascript
// styles/critical.css (สำหรับ above-the-fold content)
.hero-banner { /* Critical LCP styles */ }
.navbar { /* Navigation styles */ }
.btn-primary { /* Important buttons */ }

// pages/_document.js
<style dangerouslySetInnerHTML={{
  __html: criticalCSS // Inline critical CSS
}} />
```

### Phase 4: Resource Hints Optimization (ลด ~100ms)

```html
<!-- pages/_document.js -->
<head>
  {/* DNS Prefetch - เร็วสุด */}
  <link rel="dns-prefetch" href="//googletagmanager.com" />
  <link rel="dns-prefetch" href="//google-analytics.com" />

  {/* Preconnect - สำหรับ critical resources */}
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="" />
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin="" />

  {/* Prefetch - สำหรับ secondary resources */}
  <link rel="prefetch" href="/gtag/js?id=G-81DK266FDR" />
</head>
```

## 🎯 Expected Results

### ก่อนการปรับปรุง:

```
Main Thread Tasks:
├── Google Tag Manager: 214ms (บล็อก)
├── Google Analytics: 133ms (บล็อก)
├── Framework JS: 206ms (บล็อก)
├── Main Document: 794ms (บล็อก)
├── Framework JS (dup): 55ms (บล็อก)
└── Total Blocking: 1,402ms ❌
```

### หลังการปรับปรุง (คาดการณ์):

```
Main Thread Tasks:
├── Google Tag Manager: 0ms (defer โหลด)
├── Google Analytics: 0ms (lazy โหลด)
├── Framework JS: 120ms (split chunks)
├── Main Document: 400ms (critical CSS)
├── Other tasks: 50ms
└── Total Blocking: 570ms ✅ (ปรับปรุง 59%)
```

### 📈 Performance Improvements:

- **Total Blocking Time**: 1,402ms → 570ms (ประหยัด 832ms)
- **First Input Delay**: ปรับปรุง ~300-500ms
- **Time to Interactive**: ปรับปรุง ~800ms-1.2s
- **PageSpeed Mobile Score**: คาดว่าเพิ่มขึ้น 20-30 คะแนน

## 🚀 Implementation Priority

### Priority 1 (ทำก่อน - Impact สูงสุด):

- [ ] Defer Google Analytics loading (ประหยัด 347ms)
- [ ] Code splitting framework JS (ประหยัด 261ms)

### Priority 2 (ทำต่อ - Impact ปานกลาง):

- [ ] Inline critical CSS (ประหยัด 200ms)
- [ ] Resource hints optimization (ประหยัด 100ms)

### Priority 3 (ทำหลัง - Future improvement):

- [ ] Service Worker caching
- [ ] Web Workers สำหรับ heavy tasks
- [ ] Progressive loading strategies

---

_เป้าหมาย: ลด Main Thread Blocking จาก 1,402ms → 570ms (ปรับปรุง 59%)_

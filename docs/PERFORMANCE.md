# Performance Monitoring Configuration

This document explains the enhanced performance monitoring setup for the Chiangmaiusedcar Next.js application.

## 🚀 Features Added to next.config.js

### 1. **Bundle Analysis** 📊

```bash
# Analyze bundle size
npm run analyze
# or
pnpm analyze

# View reports in ./analyze/ folder
```

### 2. **Enhanced Security Headers** 🔒

- **Content Security Policy (CSP)**: Comprehensive security policy
- **HSTS**: HTTP Strict Transport Security with preload
- **Enhanced Permissions Policy**: Restrictive device permissions
- **XSS Protection**: Advanced cross-site scripting protection

### 3. **Intelligent Bundle Splitting** ⚡

- **Vendor Chunk**: All node_modules in separate chunk
- **Common Chunk**: Shared code between pages
- **Optimized Chunks**: Better loading performance

### 4. **Internationalization Ready** 🌍

- **Locales**: Thai (default) and English prepared
- **Locale Detection**: Disabled for performance (manual switching)
- **SEO Ready**: hreflang support ready

### 5. **Performance Monitoring** 📈

- **Web Vitals Tracking**: LCP, FID, CLS, INP monitoring
- **Resource Timing**: Critical resource loading metrics
- **Custom Analytics**: Performance metrics collection

## 🛠️ Performance Monitoring System

### Setup

```javascript
// In your _app.js or layout component
import { initPerformanceObserver } from '../lib/performance';

// Initialize monitoring
useEffect(() => {
  initPerformanceObserver();
}, []);
```

### Web Vitals Integration

```javascript
// In _app.js
export function reportWebVitals(metric) {
  import('../lib/performance').then(({ checkWebVitals }) => {
    checkWebVitals(metric);
  });
}
```

### Environment Variables

```env
# Analytics
NEXT_PUBLIC_ANALYTICS_ENDPOINT=/api/analytics
VERCEL_ANALYTICS_ID=your_vercel_id
GA_MEASUREMENT_ID=your_ga_id
GA_API_SECRET=your_ga_secret
CUSTOM_ANALYTICS_ENDPOINT=your_custom_endpoint
CUSTOM_ANALYTICS_TOKEN=your_token

# Bundle Analysis
ANALYZE=true
```

## 📊 Performance Thresholds

| Metric  | Good    | Needs Improvement | Poor    |
| ------- | ------- | ----------------- | ------- |
| **LCP** | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| **FID** | ≤ 100ms | 100ms - 300ms     | > 300ms |
| **CLS** | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |
| **INP** | ≤ 200ms | 200ms - 500ms     | > 500ms |

## 🔧 Build Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Build with memory optimization
pnpm build:memory

# Bundle analysis
pnpm analyze

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🔍 Monitoring Endpoints

### `/api/analytics`

Receives performance metrics from client-side monitoring:

- **Navigation timing**
- **Resource loading metrics**
- **Web vitals data**
- **Custom performance events**

### Response Format

```json
{
  "success": true,
  "message": "Metrics received",
  "timestamp": "2025-09-08T23:15:00.000Z"
}
```

## 🚨 Security Enhancements

### Content Security Policy (CSP)

- **Script Sources**: Self, Google Analytics, Vercel Analytics
- **Style Sources**: Self, Google Fonts (inline allowed)
- **Image Sources**: Self, Shopify CDN, Unsplash
- **Frame Sources**: Facebook, LINE (for widgets)

### Headers Applied

- **HSTS**: 1 year with preload
- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin

## 📁 File Structure

```txt
├── lib/
│   └── performance.js      # Performance monitoring utilities
├── pages/
│   └── api/
│       └── analytics.js    # Analytics endpoint
├── analyze/                # Bundle analysis reports (generated)
│   ├── client.html
│   └── server.html
└── next.config.js          # Enhanced configuration
```

## 🎯 Optimization Tips

### 1. **Bundle Size**

- Use `pnpm analyze` to identify large dependencies
- Consider dynamic imports for heavy components
- Tree-shake unused code

### 2. **Images**

- Use WebP format (already configured)
- Optimize with Next.js Image component
- Set proper sizes and loading attributes

### 3. **Performance**

- Monitor Web Vitals regularly
- Use React.memo for expensive components
- Implement proper loading states

### 4. **SEO**

- Ensure all pages have proper meta tags
- Use structured data (JSON-LD)
- Optimize for Core Web Vitals

## 🔄 Cache Strategy

### HTML Pages

- **No Cache**: Always fresh content
- **Headers**: no-cache, no-store, must-revalidate

### Static Assets

- **Long Cache**: 1 year immutable
- **Includes**: Images, JS, CSS, fonts

### Service Workers

- **No Cache**: Always updated
- **Headers**: max-age=0, must-revalidate

## 📚 Additional Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/lcp/)
- [Bundle Analysis Guide](https://nextjs.org/docs/advanced-features/analyzing-bundles)

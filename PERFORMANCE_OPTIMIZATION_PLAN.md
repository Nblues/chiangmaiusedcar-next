# Performance Optimization Plan

## Current Performance Status

### Build Analysis Results
- **Total Pages**: 66 static pages generated
- **Build Time**: Successful completion
- **Bundle Size**: First Load JS shared by all: 256 kB
- **Static Generation**: ISR enabled (600s homepage, 300s all-cars)

### Performance Warnings
Large page data detected on 3 car detail pages:
1. Toyota Camry 2020: **312 kB** (143% over limit)
2. Honda Civic 2019: **311 kB** (142% over limit)
3. Nissan Almera 2021: **310 kB** (142% over limit)

*Threshold: 128 kB per page*

## Root Cause Analysis

### Image Data Volume
Car detail pages load multiple high-resolution images:
- Hero image (main car photo)
- Gallery images (6-12 additional photos)
- Thumbnail previews
- Image metadata and alt text

### Product Data Structure
Shopify product data includes:
- Complete product information
- All metafields (specifications)
- Variant data
- Pricing information
- Inventory status

### Component Overhead
Large components on car pages:
- Image gallery with full preloading
- Detailed specifications table
- Similar cars recommendations
- Review and FAQ sections

## Optimization Strategy

### Phase 1: Immediate Optimizations (Deploy Ready)
Current implementation is production-ready but can be optimized:

#### 1. Image Lazy Loading Enhancement
```javascript
// Current: PreLoad all images
// Optimized: Load hero + lazy load gallery
const ImageGallery = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState(1); // Hero only
  
  const loadMoreImages = useCallback(() => {
    setLoadedImages(prev => Math.min(prev + 3, images.length));
  }, [images.length]);
  
  return (
    <div>
      {images.slice(0, loadedImages).map(/* render */)}
      {loadedImages < images.length && (
        <button onClick={loadMoreImages}>โหลดรูปเพิ่ม</button>
      )}
    </div>
  );
};
```

#### 2. Data Splitting
```javascript
// Split heavy data into critical and non-critical
export async function getStaticProps({ params }) {
  const carData = await getCarByHandle(params.handle);
  
  // Critical data only
  const criticalData = {
    id: carData.id,
    title: carData.title,
    price: carData.price,
    images: carData.images.slice(0, 3), // First 3 only
    basicSpecs: {
      year: carData.metafields.year,
      brand: carData.metafields.brand,
      model: carData.metafields.model,
      mileage: carData.metafields.mileage
    }
  };
  
  return {
    props: { carData: criticalData },
    revalidate: 600
  };
}
```

#### 3. Component Code Splitting
```javascript
// Dynamic imports for heavy components
const SimilarCars = dynamic(() => import('../components/SimilarCars'), {
  loading: () => <div>กำลังโหลดรถที่คล้ายกัน...</div>
});

const ReviewSection = dynamic(() => import('../components/ReviewSection'), {
  loading: () => <div>กำลังโหลดรีวิว...</div>
});
```

### Phase 2: Advanced Optimizations (Post-Deployment)

#### 1. Progressive Image Loading
Implement intersection observer for gallery images:
```javascript
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};
```

#### 2. API Route for Non-Critical Data
```javascript
// pages/api/cars/[handle]/details.js
export default async function handler(req, res) {
  const { handle } = req.query;
  
  const additionalData = await getCarAdditionalData(handle);
  
  res.json({
    detailedSpecs: additionalData.specs,
    maintenanceHistory: additionalData.maintenance,
    similarCars: additionalData.similar
  });
}
```

#### 3. Image Format Optimization
Implement WebP with AVIF fallback:
```javascript
// next.config.js optimization
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false
  }
};
```

### Phase 3: Bundle Optimization (Future Enhancement)

#### 1. Webpack Bundle Analysis
```bash
# Install analyzer
pnpm add --dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true pnpm build
```

#### 2. Tree Shaking Optimization
Remove unused Shopify SDK functions:
```javascript
// Instead of importing entire SDK
import { Client } from 'shopify-buy';

// Import specific functions only
import { createClient } from 'shopify-buy/client';
import { buildQuery } from 'shopify-buy/query';
```

#### 3. Critical CSS Extraction
Inline critical CSS for above-the-fold content:
```javascript
// Use critical package for CSS optimization
const critical = require('critical');

critical.generate({
  inline: true,
  base: '.next/',
  src: 'index.html',
  dest: 'index.optimized.html',
  width: 1300,
  height: 900
});
```

## Implementation Timeline

### Week 1: Deploy Current Version
- [x] Production build successful
- [x] All features functional
- [ ] Deploy to production server
- [ ] Monitor real-world performance

### Week 2: Phase 1 Optimizations
- [ ] Implement lazy loading for gallery images
- [ ] Split critical vs non-critical data
- [ ] Add dynamic imports for heavy components
- [ ] Test performance improvements

### Week 3: Phase 2 Optimizations
- [ ] Progressive image loading with intersection observer
- [ ] API routes for additional data
- [ ] Advanced image format optimization
- [ ] Performance monitoring setup

### Week 4: Phase 3 Optimizations
- [ ] Bundle analysis and optimization
- [ ] Tree shaking implementation
- [ ] Critical CSS extraction
- [ ] Final performance audit

## Success Metrics

### Target Performance Scores
- **PageSpeed Insights**: >90 (mobile & desktop)
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

### Page Size Targets
- **Car Detail Pages**: <128 kB (current: 310-312 kB)
- **Homepage**: <100 kB
- **Listing Pages**: <150 kB

### User Experience Metrics
- **Time to Interactive**: <3s
- **First Contentful Paint**: <1.5s
- **Bounce Rate**: <40%

## Monitoring & Maintenance

### Performance Monitoring Tools
1. **Google PageSpeed Insights**: Monthly audits
2. **Core Web Vitals**: Real user monitoring
3. **Lighthouse CI**: Automated performance testing
4. **Vercel Analytics**: Built-in performance monitoring

### Maintenance Schedule
- **Weekly**: Performance metric review
- **Monthly**: PageSpeed audit and optimization
- **Quarterly**: Bundle analysis and cleanup
- **Annually**: Major performance architecture review

---

**Current Status**: Production ready with identified optimization opportunities  
**Next Action**: Deploy current version and implement Phase 1 optimizations  
**Performance Impact**: 60-70% reduction in page size expected with Phase 1

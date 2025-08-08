// Web Vitals และ Performance Monitoring
export function reportWebVitals(metric) {
  // Log สำหรับ development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric);
  }

  // ส่งข้อมูลไป Google Analytics หรือ tracking service อื่นๆ
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
      custom_parameter_3: metric.name,
    });
  }

  // Performance API สำหรับ monitoring
  if (typeof window !== 'undefined' && window.performance) {
    // เก็บ metrics ใน localStorage สำหรับ debugging
    const metrics = JSON.parse(localStorage.getItem('webVitals') || '[]');
    metrics.push({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      timestamp: Date.now(),
    });

    // เก็บแค่ 50 records ล่าสุด
    if (metrics.length > 50) {
      metrics.splice(0, metrics.length - 50);
    }

    localStorage.setItem('webVitals', JSON.stringify(metrics));
  }
}

// Performance observer สำหรับ Core Web Vitals
export function initPerformanceObserver() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[LCP]', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported:', e);
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.log('[FID]', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported:', e);
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('[CLS]', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported:', e);
    }
  }
}

// ฟังก์ชันสำหรับ track page performance
export function trackPagePerformance(pageName) {
  if (typeof window === 'undefined') return;

  // Navigation Timing API
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const performanceData = {
      page: pageName,
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: window.performance.getEntriesByType('paint')[0]?.startTime || 0,
      firstContentfulPaint: window.performance.getEntriesByType('paint')[1]?.startTime || 0,
      timestamp: Date.now(),
    };

    console.log('[Page Performance]', performanceData);

    // เก็บข้อมูลใน localStorage
    const pageMetrics = JSON.parse(localStorage.getItem('pageMetrics') || '[]');
    pageMetrics.push(performanceData);

    if (pageMetrics.length > 20) {
      pageMetrics.splice(0, pageMetrics.length - 20);
    }

    localStorage.setItem('pageMetrics', JSON.stringify(pageMetrics));
  }
}

// Helper function สำหรับแสดง performance report
export function getPerformanceReport() {
  if (typeof window === 'undefined') return null;

  return {
    webVitals: JSON.parse(localStorage.getItem('webVitals') || '[]'),
    pageMetrics: JSON.parse(localStorage.getItem('pageMetrics') || '[]'),
    connection: navigator.connection
      ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData,
        }
      : null,
  };
}

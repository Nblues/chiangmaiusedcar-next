/**
 * Performance monitoring and web vitals configuration
 * for Chiangmaiusedcar Next.js application
 */

// Web Vitals thresholds for monitoring
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift

  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTFB: 600, // Time to First Byte (ms)
  INP: 200, // Interaction to Next Paint (ms)
};

// Performance monitoring configuration
export const MONITORING_CONFIG = {
  // Enable/disable monitoring
  enabled: process.env.NODE_ENV === 'production',

  // Sample rate (0-1)
  sampleRate: 1.0,

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // API endpoint for sending metrics
  endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics',

  // Additional context
  context: {
    app: 'chiangmaiusedcar',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
};

// Performance observer for custom metrics
export function initPerformanceObserver() {
  if (typeof window === 'undefined') return;

  // Check if PerformanceObserver is supported
  if (!('PerformanceObserver' in window)) {
    console.warn('PerformanceObserver not supported');
    return;
  }

  try {
    // Observe navigation timing
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'navigation') {
          const metrics = {
            type: 'navigation',
            url: entry.name,
            duration: entry.duration,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            timestamp: Date.now(),
          };

          reportMetrics(metrics);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Observe resource timing for critical resources
    const resourceObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        // Only track critical resources
        if (
          entry.name.includes('.js') ||
          entry.name.includes('.css') ||
          entry.name.includes('.webp')
        ) {
          const metrics = {
            type: 'resource',
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize || entry.decodedBodySize,
            timestamp: Date.now(),
          };

          reportMetrics(metrics);
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Performance monitoring setup failed:', error);
  }
}

// Report metrics to analytics
export function reportMetrics(metrics) {
  if (!MONITORING_CONFIG.enabled) return;

  // Add context
  const enrichedMetrics = {
    ...metrics,
    ...MONITORING_CONFIG.context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    referrer: document.referrer,
  };

  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon(MONITORING_CONFIG.endpoint, JSON.stringify(enrichedMetrics));
  } else {
    // Fallback to fetch
    fetch(MONITORING_CONFIG.endpoint, {
      method: 'POST',
      body: JSON.stringify(enrichedMetrics),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(error => {
      if (MONITORING_CONFIG.debug) {
        console.warn('Failed to send metrics:', error);
      }
    });
  }

  // Debug logging
  if (MONITORING_CONFIG.debug) {
    // eslint-disable-next-line no-console
    console.log('Performance metrics:', enrichedMetrics);
  }
}

// Web Vitals helper
export function checkWebVitals(metric) {
  const threshold = PERFORMANCE_THRESHOLDS[metric.name];

  if (threshold && metric.value > threshold) {
    const attribution = metric && metric.name === 'CLS' ? metric.attribution : undefined;

    reportMetrics({
      type: 'web-vital-warning',
      name: metric.name,
      value: metric.value,
      threshold,
      exceeded: metric.value - threshold,
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      attribution:
        attribution && typeof attribution === 'object'
          ? {
              largestShiftTarget: attribution.largestShiftTarget,
              largestShiftValue: attribution.largestShiftValue,
              loadState: attribution.loadState,
              cumulativeLayoutShiftMainFrame: attribution.cumulativeLayoutShiftMainFrame,
            }
          : undefined,
      timestamp: Date.now(),
    });
  }
}

// Client-side WebP detection utility
let webpSupported = null;

export const detectWebPSupport = () => {
  if (typeof window === 'undefined') return false;

  if (webpSupported !== null) {
    return webpSupported;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    webpSupported = false;
  }

  return webpSupported;
};

export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl || typeof window === 'undefined') return originalUrl;

  const { format = 'auto', quality = 85, width, height } = options;

  // Skip data URLs and already optimized images
  if (originalUrl.startsWith('data:') || originalUrl.includes('.webp')) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl, window.location.origin);

    // Add format parameter for supported services
    if (format === 'auto' && detectWebPSupport()) {
      url.searchParams.set('format', 'webp');
    } else if (format !== 'auto') {
      url.searchParams.set('format', format);
    }

    // Add quality parameter
    url.searchParams.set('q', quality.toString());

    // Add dimensions if provided
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());

    return url.toString();
  } catch {
    // Return original URL if parsing fails
    return originalUrl;
  }
};

// Preload critical images
export const preloadImage = (src, options = {}) => {
  if (typeof window === 'undefined') return;

  const { as = 'image', crossorigin = 'anonymous', fetchpriority = 'auto' } = options;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.crossOrigin = crossorigin;
  link.fetchPriority = fetchpriority;

  document.head.appendChild(link);
};

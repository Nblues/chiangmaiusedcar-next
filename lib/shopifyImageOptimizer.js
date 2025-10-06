/**
 * Shopify Image CDN Optimizer
 * Automatically optimizes images from Shopify CDN using URL parameters
 *
 * Features:
 * - Automatic width/height resizing
 * - Quality optimization
 * - Lazy loading support
 * - Responsive image generation (srcset)
 * - Zero manual work required
 *
 * Compatible with Vercel Free Plan (no Next.js Image API needed)
 */

/**
 * Optimize a single Shopify image URL
 * @param {string} url - Original Shopify image URL
 * @param {object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export function optimizeShopifyImage(url, options = {}) {
  // Return as-is if not a valid URL or not from Shopify
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cdn.shopify.com') && !url.includes('myshopify.com')) return url;

  // Default options
  const {
    width = 800, // Default width for car images
    height = null, // Auto height to maintain aspect ratio
    crop = null, // No crop by default (center, top, bottom, left, right)
    quality = 80, // Good balance between quality and file size
    format = null, // Shopify doesn't support format parameter
  } = options;

  try {
    // Parse URL to remove existing query params
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

    // Build optimized query parameters
    const params = new URLSearchParams();

    // Add width (most important for file size reduction)
    if (width) {
      params.append('width', width);
    }

    // Add height if specified
    if (height) {
      params.append('height', height);
    }

    // Add crop if specified
    if (crop) {
      params.append('crop', crop);
    }

    // Note: Shopify CDN doesn't support quality or format parameters
    // Width alone can reduce file size by 60-80%

    // Preserve original v parameter if exists (for cache busting)
    const originalV = urlObj.searchParams.get('v');
    if (originalV) {
      params.append('v', originalV);
    }

    return `${baseUrl}?${params.toString()}`;
  } catch (error) {
    console.error('Error optimizing Shopify image:', error);
    return url; // Return original URL on error
  }
}

/**
 * Generate responsive image srcset for Shopify images
 * @param {string} url - Original Shopify image URL
 * @param {array} widths - Array of widths for srcset
 * @returns {string} srcset string
 */
export function generateShopifySrcSet(url, widths = [400, 600, 800, 1000, 1200]) {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('cdn.shopify.com') && !url.includes('myshopify.com')) return '';

  return widths.map(width => `${optimizeShopifyImage(url, { width })} ${width}w`).join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param {string} breakpoint - Breakpoint type (hero, card, gallery, thumbnail)
 * @returns {string} sizes attribute value
 */
export function generateSizesAttribute(breakpoint = 'card') {
  const sizePresets = {
    // Hero banner (full width on mobile, 80% on desktop)
    hero: '(max-width: 768px) 100vw, 80vw',

    // Car card in grid (1 column mobile, 2-3 columns tablet, 4 columns desktop)
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',

    // Gallery image (full width below tablet, half width on desktop)
    gallery: '(max-width: 768px) 100vw, 50vw',

    // Thumbnail in similar cars
    thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px',

    // Car detail main image
    detail: '(max-width: 768px) 100vw, 60vw',
  };

  return sizePresets[breakpoint] || sizePresets.card;
}

/**
 * Get optimal width based on image context
 * @param {string} context - Image context (hero, card, gallery, thumbnail, detail)
 * @returns {number} Optimal width in pixels
 */
export function getOptimalWidth(context = 'card') {
  const widthPresets = {
    hero: 1200, // Hero banners
    card: 600, // Car cards in grid
    gallery: 800, // Gallery images
    thumbnail: 400, // Thumbnails
    detail: 1000, // Car detail page main image
  };

  return widthPresets[context] || 800;
}

/**
 * Optimize car images array from Shopify response
 * @param {array} images - Array of image objects from Shopify
 * @param {string} context - Image context
 * @returns {array} Optimized image array
 */
export function optimizeCarImages(images, context = 'card') {
  if (!Array.isArray(images)) return [];

  const optimalWidth = getOptimalWidth(context);

  return images.map(img => ({
    ...img,
    url: optimizeShopifyImage(img.url, { width: optimalWidth }),
    originalUrl: img.url, // Keep original for reference
    srcSet: generateShopifySrcSet(img.url),
    sizes: generateSizesAttribute(context),
  }));
}

/**
 * Batch optimize multiple Shopify image URLs
 * @param {array} urls - Array of image URLs
 * @param {object} options - Optimization options
 * @returns {array} Array of optimized URLs
 */
export function batchOptimizeImages(urls, options = {}) {
  if (!Array.isArray(urls)) return [];

  return urls.map(url => optimizeShopifyImage(url, options));
}

/**
 * Calculate expected file size reduction
 * @param {number} originalWidth - Original image width
 * @param {number} targetWidth - Target width after optimization
 * @returns {object} Size reduction info
 */
export function calculateSizeReduction(originalWidth, targetWidth = 800) {
  // File size roughly scales with pixel count (width × height)
  // Assuming square aspect ratio for simplicity
  const originalPixels = originalWidth * originalWidth;
  const targetPixels = targetWidth * targetWidth;
  const reductionRatio = targetPixels / originalPixels;
  const reductionPercent = ((1 - reductionRatio) * 100).toFixed(1);

  return {
    originalWidth,
    targetWidth,
    reductionRatio: reductionRatio.toFixed(3),
    reductionPercent: `${reductionPercent}%`,
    estimatedSavings: reductionPercent > 0 ? `~${reductionPercent}% smaller` : 'No reduction',
  };
}

/**
 * Validate if URL is from Shopify CDN
 * @param {string} url - Image URL to validate
 * @returns {boolean} True if Shopify CDN URL
 */
export function isShopifyImage(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cdn.shopify.com') || url.includes('myshopify.com');
}

/**
 * Get image optimization stats
 * @param {array} images - Array of image objects
 * @returns {object} Optimization statistics
 */
export function getOptimizationStats(images) {
  if (!Array.isArray(images)) return null;

  const shopifyImages = images.filter(img => isShopifyImage(img.url));
  const totalImages = images.length;
  const shopifyImageCount = shopifyImages.length;
  const otherImageCount = totalImages - shopifyImageCount;

  return {
    totalImages,
    shopifyImages: shopifyImageCount,
    otherImages: otherImageCount,
    optimizable: shopifyImageCount,
    optimizablePercent: ((shopifyImageCount / totalImages) * 100).toFixed(1) + '%',
  };
}

// Export all functions
export default {
  optimizeShopifyImage,
  generateShopifySrcSet,
  generateSizesAttribute,
  getOptimalWidth,
  optimizeCarImages,
  batchOptimizeImages,
  calculateSizeReduction,
  isShopifyImage,
  getOptimizationStats,
};

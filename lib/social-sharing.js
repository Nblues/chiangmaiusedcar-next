/**
 * Generate optimized Open Graph images for social sharing
 * 2025 standards for Facebook, Twitter, LINE, and other platforms
 */

// Image sizes for different platforms (2025 standards)
export const SOCIAL_IMAGE_SIZES = {
  // Primary Open Graph (Facebook, LinkedIn)
  og_primary: { width: 1200, height: 630, ratio: '1.91:1' },

  // Twitter Card Large
  twitter_large: { width: 1200, height: 675, ratio: '16:9' },

  // Instagram/Square (for future compatibility)
  square: { width: 1080, height: 1080, ratio: '1:1' },

  // LINE (popular in Thailand)
  line: { width: 1200, height: 630, ratio: '1.91:1' },

  // WhatsApp
  whatsapp: { width: 400, height: 400, ratio: '1:1' },

  // Telegram
  telegram: { width: 1280, height: 720, ratio: '16:9' },
};

// Default images for each page type
export const DEFAULT_SOCIAL_IMAGES = {
  // Homepage - ใช้รูปที่แสดงจริงในหน้าแรก
  home: '/herobanner/newherobanner-1400w.webp',

  // Product pages (cars)
  car: '/herobanner/kn2carbanner.webp',

  // All cars listing - ใช้รูปที่แสดงจริงในหน้ารถทั้งหมด
  'all-cars': '/herobanner/heroallcars-1400w.webp',

  // Sell car - ใช้รูปที่แสดงจริงในหน้าขายรถ
  'sell-car': '/herobanner/chiangmaiusedcars.webp',

  // About/Team - ตรงกับที่ใช้แล้ว
  about: '/herobanner/team.webp',

  // Contact - ตรงกับที่ใช้แล้ว
  contact: '/herobanner/contact.webp',

  // Promotion - ใช้รูปที่แสดงจริงในหน้าโปรโมชั่น
  promotion: '/herobanner/cnxcontact.webp',

  // Credit check - ใช้รูปที่แสดงจริงในหน้าเช็คเครดิต
  'credit-check': '/herobanner/outdoorbanner.webp',

  // Payment calculator - ใช้รูปที่แสดงจริงในหน้าคำนวณค่างวด
  'payment-calculator': '/herobanner/paymentcalculator.webp',

  // Default fallback
  default: '/herobanner/chiangmaiusedcar.webp',
};

/**
 * Get optimized social image URL for a page
 */
const DEFAULT_SOCIAL_BASE_URL = 'https://www.chiangmaiusedcar.com';

export function getSocialImageUrl(pageType = 'default', baseUrl = DEFAULT_SOCIAL_BASE_URL) {
  const imagePath = DEFAULT_SOCIAL_IMAGES[pageType] || DEFAULT_SOCIAL_IMAGES.default;

  // Add cache busting with build time
  const timestamp = process.env.CUSTOM_BUILD_TIME
    ? new Date(process.env.CUSTOM_BUILD_TIME).getTime()
    : Date.now();

  return `${baseUrl}${imagePath}?v=${timestamp}`;
}

/**
 * Generate multiple image sizes for better platform compatibility
 */
export function generateSocialImageVariants(baseImageUrl) {
  const variants = [];

  Object.entries(SOCIAL_IMAGE_SIZES).forEach(([platform, size]) => {
    variants.push({
      url: baseImageUrl,
      width: size.width,
      height: size.height,
      type: 'image/webp',
      platform: platform,
      ratio: size.ratio,
    });
  });

  return variants;
}

/**
 * Get platform-specific image URL with proper dimensions
 */
export function getPlatformImage(pageType, platform = 'og_primary', baseUrl) {
  const resolvedBaseUrl = baseUrl || DEFAULT_SOCIAL_BASE_URL;
  const imageUrl = getSocialImageUrl(pageType, resolvedBaseUrl);
  const size = SOCIAL_IMAGE_SIZES[platform] || SOCIAL_IMAGE_SIZES.og_primary;

  return {
    url: imageUrl,
    width: size.width,
    height: size.height,
    type: 'image/webp',
    alt: `ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพดี`,
  };
}

/**
 * 2025 Social Media Optimization Tags
 */
export const SOCIAL_PLATFORMS_CONFIG = {
  facebook: {
    image_size: 'og_primary',
    required_tags: ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'],
    optimal_title_length: 60,
    optimal_description_length: 155,
  },

  twitter: {
    image_size: 'twitter_large',
    card_type: 'summary_large_image',
    required_tags: ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'],
    optimal_title_length: 70,
    optimal_description_length: 200,
  },

  line: {
    image_size: 'line',
    required_tags: ['line:title', 'line:description', 'line:image'],
    optimal_title_length: 60,
    optimal_description_length: 150,
  },

  whatsapp: {
    image_size: 'whatsapp',
    required_tags: ['whatsapp:title', 'whatsapp:description', 'whatsapp:image'],
    optimal_title_length: 65,
    optimal_description_length: 160,
  },

  telegram: {
    image_size: 'telegram',
    required_tags: ['telegram:title', 'telegram:description', 'telegram:image'],
    optimal_title_length: 70,
    optimal_description_length: 200,
  },
};

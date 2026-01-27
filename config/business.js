// Business Configuration
// สามารถปรับเปลี่ยนข้อมูลธุรกิจได้ที่นี่

const DEFAULT_BASE_URL = 'https://www.chiangmaiusedcar.com';

const normalizeBusinessBaseUrl = input => {
  let candidate = input || DEFAULT_BASE_URL;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);

    // Force canonical host to www for this domain.
    if (url.hostname === 'chiangmaiusedcar.com') {
      url.hostname = 'www.chiangmaiusedcar.com';
    }

    // Prefer HTTPS for canonical URLs.
    url.protocol = 'https:';

    // Base URL should not include path/query/hash.
    url.pathname = '';
    url.search = '';
    url.hash = '';

    return url.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_BASE_URL;
  }
};

export const BUSINESS_INFO = {
  // ข้อมูลพื้นฐาน
  name: 'ครูหนึ่งรถสวย',
  alternateName: 'KN2Car',

  // ข้อมูลติดต่อ
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '094-064-9018',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@chiangmaiusedcar.com',
  lineUrl: process.env.NEXT_PUBLIC_LINE_URL || 'https://lin.ee/8ugfzstD',

  // ข้อมูลเว็บไซต์
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'chiangmaiusedcar.com',
  baseUrl: normalizeBusinessBaseUrl(process.env.NEXT_PUBLIC_BASE_URL),

  // ข้อมูลที่ตั้ง (อัปเดตตาม Google Maps - 2026-01-06)
  address: {
    street: 'เลขที่ 324 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี',
    subdistrict: 'สันพระเนตร',
    district: 'สันทราย',
    province: 'เชียงใหม่',
    postalCode: '50210',
    country: 'TH',
  },

  // พิกัดร้าน (อัปเดตจาก Google Maps - 2026-01-06)
  coordinates: {
    latitude: 18.8049109,
    longitude: 99.0301679,
  },

  // Google Maps Place ID
  placeId: '0x30da25a34cba1f05:0x9cb559411066b7cb',

  // เวลาทำการ
  operatingHours: {
    format: 'Mo-Su 09:00-20:00',
    display: 'เปิดทุกวัน 9:00-20:00',
  },

  // โซเชียลมีเดีย
  socialMedia: {
    facebook: {
      main: 'https://www.facebook.com/KN2car',
      personal: 'https://www.facebook.com/nuengblues',
      fcGroup: 'https://www.facebook.com/groups/kru.nueng.goodcar',
    },
    tiktok: 'https://www.tiktok.com/@krunueng_usedcar',
    youtube: 'https://youtube.com/@chiangraiusedcar',
    lemon8: 'https://www.lemon8-app.com/@kn.goodcar?region=th',
    line: process.env.NEXT_PUBLIC_LINE_URL || 'https://lin.ee/8ugfzstD',
  },

  // Social proof (ตัวเลขผู้ติดตาม) - ปรับได้จากจุดเดียว
  socialFollowStats: {
    facebook: {
      main: { label: 'เพจหลัก', metricText: '1 ล้าน ติดตาม' },
      personal: { label: 'ส่วนตัว', metricText: '1.6 แสน ติดตาม' },
      fcGroup: { label: 'กลุ่ม FC', metricText: '7.3 หมื่น สมาชิก' },
    },
    tiktok: { label: 'วิดีโอสั้น', metricText: '1.6 แสน ติดตาม' },
    youtube: { label: 'วิดีโอรีวิว', metricText: '4 หมื่น+ ติดตาม' },
    lemon8: { label: 'ไลฟ์สไตล์', metricText: '26k+ ติดตาม' },
    line: { label: 'แชทสด', metricText: 'สอบถามเลย' },
  },

  // SEO และ Meta
  seo: {
    description: 'ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย 1 ปี',
    keywords: [
      'รถมือสองเชียงใหม่',
      'ครูหนึ่งรถสวย',
      'KN2Car',
      'รถยนต์มือสอง',
      'ฟรีดาวน์',
      'ผ่อนรถ',
    ].join(','),
  },
};

// ฟังก์ชันสำหรับสร้าง URL แบบปลอดภัย
export const createBusinessUrl = (path = '') => {
  return `${BUSINESS_INFO.baseUrl}${path}`;
};

// ฟังก์ชันสำหรับ phone link
export const createPhoneLink = () => {
  return `tel:${BUSINESS_INFO.phone.replace(/-/g, '')}`;
};

// ฟังก์ชันสำหรับ maps link
export const createMapsLink = () => {
  const { street, district, province, postalCode } = BUSINESS_INFO.address;
  const address = `${street} ${district} ${province} ${postalCode}`;
  return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
};

// ฟังก์ชันสำหรับ place link (ใช้ Place ID จาก Google Maps)
export const createPlaceLink = () => {
  const placeId = BUSINESS_INFO.placeId;
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
};

// --- SEO 2026 Centralized Configuration ---

export const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'TH',
  returnPolicyCategory: 'https://schema.org/MerchantReturnUnlimitedWindow',
  merchantReturnDays: 7,
  returnFees: 'http://schema.org/FreeReturn',
};

export const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'TH',
  },
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: 0,
    currency: 'THB',
  },
};

export const SELLER_INFO = {
  '@type': 'AutoDealer',
  '@id': `${BUSINESS_INFO.baseUrl}/#organization`,
  name: BUSINESS_INFO.name,
  url: BUSINESS_INFO.baseUrl,
  telephone: '+66940649018', // E.164 format
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.address.street,
    addressLocality: BUSINESS_INFO.address.province,
    addressRegion: BUSINESS_INFO.address.province,
    postalCode: BUSINESS_INFO.address.postalCode,
    addressCountry: BUSINESS_INFO.address.country || 'TH',
  },
};

export const COMMON_OFFER_EXTENSIONS = {
  hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
  shippingDetails: SHIPPING_DETAILS,
  seller: SELLER_INFO,
};

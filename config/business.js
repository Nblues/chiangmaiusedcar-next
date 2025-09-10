// Business Configuration
// สามารถปรับเปลี่ยนข้อมูลธุรกิจได้ที่นี่

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
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://chiangmaiusedcar.com',

  // ข้อมูลที่ตั้ง
  address: {
    street: 'เลขที่ 320 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี',
    district: 'สันพระเนตร',
    province: 'เชียงใหม่',
    postalCode: '50210',
    country: 'TH',
  },

  // พิกัดร้าน (พิกัดที่แม่นยำจาก Google Maps)
  coordinates: {
    latitude: 18.80508571828391,
    longitude: 99.03016129487551,
  },

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
    },
    tiktok: 'https://www.tiktok.com/@krunueng_usedcar',
    youtube: 'https://youtube.com/@chiangraiusedcar',
    lemon8: 'https://s.lemon8-app.com/al/GgUmdUUsrT',
    line: process.env.NEXT_PUBLIC_LINE_URL || 'https://lin.ee/8ugfzstD',
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

// ฟังก์ชันสำหรับ place link
export const createPlaceLink = () => {
  const { latitude, longitude } = BUSINESS_INFO.coordinates;
  return `https://www.google.com/maps/place/${BUSINESS_INFO.name}/@${latitude},${longitude},17z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d${latitude}!4d${longitude}!16s%2Fg%2F11c0qg8q8q`;
};

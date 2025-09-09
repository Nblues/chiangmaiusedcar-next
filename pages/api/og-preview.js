// pages/api/og-preview.js

export default async function handler(req, res) {
  const { url } = req.query;

  // Set headers for no cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    // Validate URL format
    if (url && !url.startsWith('/') && !url.startsWith('http')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
        message: 'URL must start with / or http',
      });
    }

    let preview = {
      title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
      description:
        'ศูนย์รวมรถมือสองคุณภาพดี รถบ้านแท้ 100% ฟรีดาวน์ 0% ผ่อนถูก รับประกัน 1 ปี ส่งฟรีทั่วไทย',
      image: 'https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp',
      url: 'https://chiangmaiusedcar.com',
      site_name: 'ครูหนึ่งรถสวย',
      locale: 'th_TH',
      type: 'website',
    };

    if (url) {
      // Handle different page types
      if (url.includes('/car/')) {
        // Car detail page - use generic car preview without network calls
        const handle = url.split('/car/')[1]?.split('?')[0];
        if (handle) {
          preview = {
            title: `รถมือสอง ${handle} ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย`,
            description: `รถมือสองคุณภาพดี ${handle} รถบ้านแท้ รับประกัน 1 ปี ฟรีดาวน์ 0% ผ่อนถูกสุด ส่งฟรีทั่วไทย โทร 094-064-9018`,
            image: 'https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp',
            url: `https://chiangmaiusedcar.com/car/${handle}`,
            type: 'product',
            product: {
              price: '0',
              currency: 'THB',
              brand: 'รถมือสอง',
              condition: 'used',
              availability: 'in stock',
            },
          };
        }
      } else if (url.includes('/all-cars')) {
        // All cars page
        preview = {
          title: 'รถมือสองทั้งหมด - รถบ้านแท้ ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย',
          description:
            'รถมือสองคุณภาพดีมากมาย รถบ้านแท้ 100% ฟรีดาวน์ 0% ผ่อนถูกสุด รับประกัน 1 ปี ส่งฟรีทั่วไทย Toyota Honda Nissan Mazda และอื่นๆ โทร 094-064-9018',
          image: 'https://chiangmaiusedcar.com/herobanner/allusedcars.webp',
          url: 'https://chiangmaiusedcar.com/all-cars',
          type: 'website',
        };
      } else if (url.includes('/about')) {
        // About page
        preview = {
          title: 'เกี่ยวกับครูหนึ่งรถสวย - จากครูดนตรีสู่ผู้เชี่ยวชาญรถมือสอง 10+ ปี',
          description:
            'เรื่องราวครูหนึ่งรถสวย จากอาจารย์สอนดนตรีสู่ผู้เชี่ยวชาญรถมือสองเชียงใหม่ Facebook 1M+ TikTok 150K+ YouTube 40K+ ติดตาม รับประกัน 1 ปี ส่งฟรีทั่วประเทศ',
          image: 'https://chiangmaiusedcar.com/herobanner/team.webp',
          url: 'https://chiangmaiusedcar.com/about',
          type: 'profile',
        };
      } else if (url.includes('/contact')) {
        // Contact page
        preview = {
          title: 'ติดต่อครูหนึ่งรถสวย - รถมือสองเชียงใหม่ โทร 094-064-9018',
          description:
            'ติดต่อครูหนึ่งรถสวย รถมือสองเชียงใหม่ โทร 094-064-9018 LINE: krunung1 ที่อยู่: 1/4 หมู่ 4 ตำบลหนองจ๊อม อำเภอสันทราย จังหวัดเชียงใหม่ 50210',
          image: 'https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp',
          url: 'https://chiangmaiusedcar.com/contact',
          type: 'website',
        };
      } else if (url.includes('/promotion')) {
        // Promotion page
        preview = {
          title: 'โปรโมชั่นสุดพิเศษ - ฟรีดาวน์ 0% ผ่อนนาน | ครูหนึ่งรถสวย',
          description:
            'โปรโมชั่นสุดพิเศษ ฟรีดาวน์ 0% ผ่อนนาน 72 เดือน ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย รถมือสองคุณภาพดี โทร 094-064-9018',
          image: 'https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp',
          url: 'https://chiangmaiusedcar.com/promotion',
          type: 'website',
        };
      }
    }

    res.status(200).json({
      success: true,
      preview,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('OG Preview API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      message: error.message,
    });
  }
}

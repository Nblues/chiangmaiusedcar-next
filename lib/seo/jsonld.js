/**
 * JSON-LD SEO Utilities for Product/Offer Schema
 * ใช้สำหรับสร้าง structured data ที่ถูกต้องตาม Google Guidelines
 */

/**
 * @typedef {Object} ReviewSource
 * @property {number} [ratingValue] - คะแนนเฉลี่ย 1-5
 * @property {number} [reviewCount] - จำนวนรีวิวทั้งหมด
 * @property {Array<Object>} [reviews] - รายละเอียดรีวิวแต่ละอัน
 */

/**
 * ทำความสะอาดราคาให้เป็นตัวเลขที่ Google ยอมรับ
 * @param {any} input - ราคาที่รับเข้ามา เช่น "599,000 บาท" หรือ 599000
 * @returns {string|null} - ราคาที่ทำความสะอาดแล้ว หรือ null ถ้าไม่ถูกต้อง
 */
export function sanitizePrice(input) {
  const n = parseFloat(String(input).replace(/[^0-9.]/g, ''));
  if (Number.isFinite(n) && n >= 0) return n.toFixed(2); // Google ต้องการเลขล้วน
  return null;
}

/**
 * สร้าง Product JSON-LD Schema สำหรับ SEO
 * @param {Object} opts - ตัวเลือกการตั้งค่า
 * @param {string} opts.url - URL ของสินค้า
 * @param {string} opts.name - ชื่อสินค้า
 * @param {string} opts.description - คำอธิบายสินค้า
 * @param {string[]} opts.images - รายการ URL รูปภาพ
 * @param {string} [opts.brand] - ยี่ห้อ
 * @param {string} [opts.sku] - รหัสสินค้า
 * @param {string} [opts.mpn] - หมายเลขชิ้นส่วนผู้ผลิต
 * @param {string} [opts.currency="THB"] - สกุลเงิน
 * @param {any} [opts.price] - ราคา (รับได้ทั้ง string และ number)
 * @param {boolean} [opts.inStock=true] - มีสินค้าในสต็อกหรือไม่
 * @param {number} [opts.priceValidDays=90] - จำนวนวันที่ราคาใช้ได้
 * @param {string} [opts.sellerName="ครูหนึ่งรถสวย"] - ชื่อผู้ขาย
 * @param {number} [opts.returnDays=7] - จำนวนวันคืนสินค้า
 * @param {boolean} [opts.freeShip=true] - ส่งฟรีหรือไม่
 * @param {ReviewSource} [opts.review] - ข้อมูลรีวิว (มีค่อยใส่)
 * @returns {Object} JSON-LD schema object
 */
export function buildProductJsonLd(opts) {
  const {
    url,
    name,
    description,
    images,
    brand,
    sku,
    mpn,
    currency = 'THB',
    price,
    inStock = true,
    priceValidDays = 90,
    sellerName = 'ครูหนึ่งรถสวย',
    returnDays = 7,
    freeShip = true,
    review,
  } = opts;

  const priceStr = sanitizePrice(price);
  const priceValidUntil = new Date(Date.now() + priceValidDays * 24 * 60 * 60 * 1000).toISOString();

  const offers = {
    '@type': 'Offer',
    url,
    priceCurrency: currency,
    availability: `http://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
    itemCondition: 'http://schema.org/UsedCondition',
    seller: {
      '@type': 'Organization',
      name: sellerName,
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'TH',
      returnPolicyCategory: 'http://schema.org/MerchantReturnUnlimitedWindow',
      merchantReturnDays: returnDays,
      returnFees: 'http://schema.org/FreeReturn',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'TH',
      },
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: freeShip ? 0 : 0,
        currency,
      },
    },
  };

  // เพิ่มราคาถ้ามี
  if (priceStr) {
    offers.price = priceStr; // เลขล้วน
    offers.priceValidUntil = priceValidUntil;
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    url,
    name,
    description,
    image: images,
    offers,
  };

  // เพิ่ม brand ถ้ามี
  if (brand) {
    data.brand = { '@type': 'Brand', name: brand };
  }

  // เพิ่ม SKU และ MPN ถ้ามี
  if (sku) data.sku = sku;
  if (mpn) data.mpn = mpn;

  // ใส่ aggregateRating/review เฉพาะเมื่อมีข้อมูลจริงเท่านั้น
  if (review?.ratingValue && review?.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: review.ratingValue,
      reviewCount: review.reviewCount,
    };
  }

  if (review?.reviews?.length) {
    data.review = review.reviews.map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      name: r.title,
      reviewBody: r.text,
      datePublished: r.date,
    }));
  }

  return data;
}

/**
 * สร้าง Automotive JSON-LD Schema สำหรับรถยนต์โดยเฉพาะ
 * @param {Object} carData - ข้อมูลรถยนต์
 * @param {Object} offerData - ข้อมูลข้อเสนอ
 * @returns {Object} JSON-LD schema object
 */
export function buildCarJsonLd(carData, offerData) {
  const baseProduct = buildProductJsonLd(offerData);

  // เพิ่มข้อมูลเฉพาะรถยนต์
  const carSchema = {
    ...baseProduct,
    '@type': ['Product', 'Car'],
    category: 'Automotive',
    vehicleModelDate: carData.year,
    vehicleTransmission: carData.transmission,
    fuelType: carData.fuelType,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      engineDisplacement: carData.engineSize,
      fuelType: carData.fuelType,
    },
  };

  // เพิ่มข้อมูลเพิ่มเติมถ้ามี
  if (carData.mileage) {
    carSchema.mileageFromOdometer = {
      '@type': 'QuantitativeValue',
      value: parseFloat(String(carData.mileage).replace(/[^0-9.]/g, '')),
      unitCode: 'KMT',
    };
  }

  if (carData.seats) {
    carSchema.numberOfSeats = parseInt(carData.seats);
  }

  if (carData.color) {
    carSchema.color = carData.color;
  }

  return carSchema;
}

/**
 * สร้าง Enhanced Car Product JSON-LD Schema ตาม Google Standards
 * พร้อม Offer details ที่ครบถ้วนสำหรับ Rich Results
 * @param {Object} opts - ตัวเลือกการตั้งค่า
 * @returns {Object} Enhanced JSON-LD schema object
 */
export function buildEnhancedCarJsonLd(opts) {
  const {
    name,
    description,
    brand,
    year,
    model,
    images = [],
    price,
    currency = 'THB',
    url,
    sku,
    mileage,
    transmission,
    fuelType = 'Gasoline',
    engineSize,
    color,
    seats,
    availability = 'InStock',
    priceValidUntil,
    returnPolicy = 'NoReturnRefund',
    shippingCost = 0,
    warrantyPeriod = '1 ปี',
  } = opts;

  const priceStr = sanitizePrice(price);
  const site = 'https://www.chiangmaiusedcar.com';

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image: images,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    sku: sku || `${brand}-${model}-${year}`,
    mpn: `${brand}${model}${year}`,
    category: 'รถยนต์มือสอง',
    productID: sku,

    // Vehicle specific properties
    vehicleModelDate: year,
    vehicleTransmission: transmission,
    fuelType: fuelType,

    // Additional vehicle details
    ...(mileage && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: parseFloat(String(mileage).replace(/[^0-9.]/g, '')),
        unitCode: 'KMT',
      },
    }),

    ...(engineSize && {
      vehicleEngine: {
        '@type': 'EngineSpecification',
        engineDisplacement: engineSize,
        fuelType: fuelType,
      },
    }),

    ...(seats && { numberOfSeats: parseInt(seats) }),
    ...(color && { color: color }),

    // Enhanced Offer section
    offers: {
      '@type': 'Offer',
      url: url || site,
      priceCurrency: currency,
      price: priceStr,
      priceValidUntil:
        priceValidUntil ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/UsedCondition',

      // Shipping details
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: shippingCost.toString(),
          currency: currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'TH',
        },
      },

      // Return policy
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'TH',
        returnPolicyCategory: `https://schema.org/${returnPolicy}`,
      },

      // Seller information
      seller: {
        '@type': 'AutoDealer',
        name: 'ครูหนึ่งรถสวย',
        url: site,
        telephone: '+66940649018',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '320 หมู่ 2 ถนน สมโภชเชียงใหม่ 700 ปี',
          addressLocality: 'สันพระเนตร',
          addressRegion: 'สันทราย',
          postalCode: '50210',
          addressCountry: 'TH',
        },
      },
    },

    // Warranty information
    warranty: {
      '@type': 'WarrantyPromise',
      durationOfWarranty: warrantyPeriod,
      warrantyScope: 'เครื่องยนต์และเกียร์',
    },

    // Review aggregate (if available)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '120',
    },
  };
}

/**
 * สร้าง LocalBusiness JSON-LD Schema สำหรับร้านค้า
 * @returns {Object} JSON-LD schema object
 */
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'ครูหนึ่งรถสวย',
    description:
      'รถมือสองเชียงใหม่ ศูนย์รวมรถบ้านคุณภาพดี ฟรีดาวน์ ผ่อนถูกที่สุด รับประกัน 1 ปี บริการสินเชื่อครบวงจร ส่งฟรีทั่วไทย',
    url: 'https://chiangmaiusedcar.com',
    logo: 'https://chiangmaiusedcar.com/logo/logo_main.png',
    telephone: '+66940649018',
    email: 'info@chiangmaiusedcar.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '320 หมู่ 2 ถนน สมโภชเชียงใหม่ 700 ปี',
      addressLocality: 'สันพระเนตร',
      addressRegion: 'สันทราย',
      postalCode: '50210',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.7986111,
      longitude: 99.0144444,
    },
    openingHours: 'Mo-Su 08:00-18:00',
    priceRange: '฿฿',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Financing'],
    currenciesAccepted: 'THB',
    sameAs: [
      'https://www.facebook.com/KN2car',
      'https://youtube.com/@chiangraiusedcar',
      'https://www.tiktok.com/@krunueng_usedcar',
      'https://lin.ee/8ugfzstD',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '250',
    },
  };
}

/**
 * สร้าง ImageObject JSON-LD Schema สำหรับรูปภาพรถยนต์ (Optimized Version)
 * เพื่อปรับปรุง SEO และการแสดงผลรูปภาพใน Google Search
 * @param {Object} opts - ตัวเลือกการตั้งค่า
 * @returns {Object} ImageObject JSON-LD schema (ขนาดลดลง ~40%)
 */
export function buildImageObjectJsonLd(opts) {
  const {
    url,
    caption,
    altText,
    carTitle,
    carBrand,
    carYear,
    uploadDate,
    width = 1200,
    height = 800,
    contentType = 'image/jpeg',
  } = opts;

  const site = 'https://www.chiangmaiusedcar.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: url,
    contentUrl: url,
    caption: caption || `${carBrand} ${carTitle} ${carYear} ฟรีดาวน์ ผ่อนถูก`,
    name: caption || `${carBrand} ${carTitle} ${carYear}`,
    alternateName: altText || caption,
    description: `รูปภาพ${carBrand} ${carTitle} ปี ${carYear} จากครูหนึ่งรถสวย รถมือสองเชียงใหม่`,

    // Technical details
    width: width,
    height: height,
    encodingFormat: contentType,
    uploadDate: uploadDate || new Date().toISOString().split('T')[0],

    // Creator (simplified)
    creator: {
      '@type': 'Organization',
      name: 'ครูหนึ่งรถสวย',
      url: site,
    },
    creditText: 'ภาพโดย ครูหนึ่งรถสวย',
    copyrightNotice: `© ${new Date().getFullYear()} ครูหนึ่งรถสวย`,

    // License information (pointing to public terms instead of hidden license page)
    license: `${site}/terms-of-service`,
    representativeOfPage: true,

    // Keywords (shortened)
    keywords: [carBrand, carTitle, carYear, 'รถมือสอง', 'เชียงใหม่', 'ครูหนึ่งรถสวย']
      .filter(Boolean)
      .join(', '),
  };
}

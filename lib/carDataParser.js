// Car data parser for extracting info from existing Shopify data
// Since metafields are null, we'll parse from title, tags, and description

/**
 * Parse car information from product title
 * @param {string} title - Product title
 * @returns {Object} - Parsed car info
 */
function parseCarTitle(title) {
  const parsed = {
    brand: null,
    model: null,
    year: null,
    engine: null,
    transmission: null,
  };

  if (!title || typeof title !== 'string') return parsed;

  const titleUpper = title.toUpperCase();

  // Extract brand
  const brands = [
    'TOYOTA',
    'HONDA',
    'MAZDA',
    'NISSAN',
    'MITSUBISHI',
    'ISUZU',
    'FORD',
    'CHEVROLET',
    'HYUNDAI',
    'KIA',
    'MERCEDES',
    'BMW',
    'AUDI',
    'LEXUS',
    'INFINITI',
  ];

  for (const brand of brands) {
    if (titleUpper.includes(brand)) {
      parsed.brand = brand.toLowerCase();
      break;
    }
  }

  // Extract year (4 digits)
  const yearMatch = title.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    parsed.year = yearMatch[0];
  }

  // Extract Thai year and convert to Western year
  const thaiYearMatch = title.match(/\b(25[0-9]{2})\b/);
  if (thaiYearMatch) {
    const thaiYear = parseInt(thaiYearMatch[0]);
    parsed.year = (thaiYear - 543).toString();
  }

  // Extract engine size
  const engineMatch = title.match(/(\d+\.?\d*)\s*[Ll]/);
  if (engineMatch) {
    parsed.engine = engineMatch[1] + 'L';
  }

  // Extract transmission
  if (titleUpper.includes('AUTO') || titleUpper.includes('ออโต้') || titleUpper.includes('A/T')) {
    parsed.transmission = 'อัตโนมัติ';
  } else if (
    titleUpper.includes('MANUAL') ||
    titleUpper.includes('MT') ||
    titleUpper.includes('เกียร์ธรรมดา')
  ) {
    parsed.transmission = 'เกียร์ธรรมดา';
  }

  // Extract model (simplified)
  const modelPatterns = [
    'CAMRY',
    'COROLLA',
    'VIOS',
    'YARIS',
    'FORTUNER',
    'HILUX',
    'REVO',
    'CIVIC',
    'CITY',
    'ACCORD',
    'CR-V',
    'HR-V',
    'JAZZ',
    'CX-3',
    'CX-5',
    'CX-7',
    'MAZDA2',
    'MAZDA3',
    'D-MAX',
    'MU-X',
    'MU-7',
    'RANGER',
    'EVEREST',
    'FOCUS',
    'PAJERO',
    'TRITON',
    'LANCER',
    'TUCSON',
    'SANTA FE',
    'ELANTRA',
    'SPORTAGE',
    'SORENTO',
    'CERATO',
  ];

  for (const model of modelPatterns) {
    if (titleUpper.includes(model)) {
      parsed.model = model.toLowerCase();
      break;
    }
  }

  return parsed;
}

/**
 * Parse car information from product tags
 * @param {Array} tags - Product tags array
 * @returns {Object} - Additional car info
 */
function parseCarTags(tags) {
  const parsed = {
    category: null,
    features: [],
    condition: 'มือสอง',
    body_type: null,
    fuel_type: null,
  };

  if (!Array.isArray(tags)) return parsed;

  const tagText = tags.join(' ').toLowerCase();

  // Determine category and body_type
  if (tagText.includes('กระบะ') || tagText.includes('pickup')) {
    parsed.category = 'รถกระบะ';
    parsed.body_type = 'Pickup';
  } else if (tagText.includes('suv')) {
    parsed.category = 'SUV';
    parsed.body_type = 'SUV';
  } else if (tagText.includes('เซดาน') || tagText.includes('sedan')) {
    parsed.category = 'เซดาน';
    parsed.body_type = 'Sedan';
  } else if (tagText.includes('แวน') || tagText.includes('van')) {
    parsed.category = 'แวน';
    parsed.body_type = 'Van';
  } else if (tagText.includes('แฮทช์แบ็ก') || tagText.includes('hatchback')) {
    parsed.category = 'แฮทช์แบ็ก';
    parsed.body_type = 'Hatchback';
  }

  // Determine fuel type
  if (tagText.includes('diesel') || tagText.includes('ดีเซล')) {
    parsed.fuel_type = 'Diesel';
  } else if (
    tagText.includes('gasoline') ||
    tagText.includes('เบนซิน') ||
    tagText.includes('น้ำมัน')
  ) {
    parsed.fuel_type = 'Gasoline';
  } else if (tagText.includes('hybrid') || tagText.includes('ไฮบริด')) {
    parsed.fuel_type = 'Hybrid';
  } else if (tagText.includes('electric') || tagText.includes('ไฟฟ้า')) {
    parsed.fuel_type = 'Electric';
  }

  // Extract features
  if (tagText.includes('ฟรีดาวน์') || tagText.includes('ไม่ใช้ดาวน์')) {
    parsed.features.push('ฟรีดาวน์');
  }
  if (tagText.includes('ผ่อนสบาย')) {
    parsed.features.push('ผ่อนสบาย');
  }
  if (tagText.includes('hybrid') || tagText.includes('ไฮบริด')) {
    parsed.features.push('ไฮบริด');
  }
  if (tagText.includes('4wd') || tagText.includes('4x4')) {
    parsed.features.push('เกียร์ 4WD');
  }

  return parsed;
}

/**
 * Parse car information from description
 * @param {string} description - Product description
 * @returns {Object} - Additional car info
 */
function parseCarDescription(description) {
  const parsed = {
    mileage: null,
    price_info: null,
    down_payment: null,
    installment: null,
  };

  if (!description || typeof description !== 'string') return parsed;

  // Extract mileage (km)
  const mileageMatch = description.match(/(\d{1,3}(?:,\d{3})*)\s*(?:km|กม|กิโลเมตร)/i);
  if (mileageMatch) {
    parsed.mileage = mileageMatch[1].replace(/,/g, '');
  }

  // Extract down payment
  const downMatch = description.match(/ดาวน์\s*(\d{1,3}(?:,\d{3})*)/);
  if (downMatch) {
    parsed.down_payment = downMatch[1].replace(/,/g, '');
  }

  // Extract installment
  const installmentMatch = description.match(/ส่ง\s*(\d{1,3}(?:,\d{3})*)/);
  if (installmentMatch) {
    parsed.installment = installmentMatch[1].replace(/,/g, '');
  }

  return parsed;
}

/**
 * Combine all parsing functions to create complete car data
 * @param {Object} product - Shopify product object
 * @returns {Object} - Complete car information
 */
function parseCarData(product) {
  const titleData = parseCarTitle(product.title || '');
  const tagData = parseCarTags(product.tags || []);
  const descData = parseCarDescription(product.description || '');

  return {
    // Basic info
    id: product.id,
    handle: product.handle,
    title: product.title,

    // Parsed car data
    brand:
      titleData.brand ||
      (product.vendor && product.vendor !== 'ครูหนึ่งรถสวย' ? product.vendor.toLowerCase() : null),
    model: titleData.model,
    year: titleData.year,
    engine: titleData.engine,
    transmission: titleData.transmission,

    // Category and type
    category: tagData.category || product.productType || null,
    condition: tagData.condition,
    body_type: tagData.body_type,
    fuel_type: tagData.fuel_type,

    // Financial info
    mileage: descData.mileage,
    down_payment: descData.down_payment,
    installment: descData.installment,

    // Features
    features: tagData.features,

    // Additional fields (with defaults)
    color: null, // Not parseable from existing data
    displacement: null, // Not parseable from existing data
    seats: null, // Not parseable from existing data
    vin: null, // Not parseable from existing data
    province: 'เชียงใหม่', // Default location
    warranty: null, // Not parseable from existing data

    // Original data
    vendor: product.vendor,
    tags: product.tags,
    productType: product.productType,
    price: product.price,
    images: product.images,
    description: product.description,
    availableForSale: product.availableForSale,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

const carDataParser = {
  parseCarTitle,
  parseCarTags,
  parseCarDescription,
  parseCarData,
};

module.exports = {
  parseCarTitle,
  parseCarTags,
  parseCarDescription,
  parseCarData,
  default: carDataParser,
};

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
    fuel_type: null,
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

  // Extract fuel type from title when explicitly present
  // Keep this conservative to avoid accidental EV detection from unrelated text.
  if (/\bDIESEL\b/i.test(title) || /ดีเซล/i.test(title) || /\bD4D\b/i.test(title)) {
    parsed.fuel_type = 'Diesel';
  } else if (/ไฮบริด/i.test(title) || /\bHYBRID\b/i.test(title)) {
    parsed.fuel_type = 'Hybrid';
  } else if (/รถไฟฟ้า/i.test(title) || /\bELECTRIC\b/i.test(title) || /\bBEV\b/i.test(title)) {
    parsed.fuel_type = 'Electric';
  } else if (/เบนซิน/i.test(title) || /\bGASOLINE\b/i.test(title) || /\bPETROL\b/i.test(title)) {
    parsed.fuel_type = 'Gasoline';
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

  const hasExplicitElectricTag = tags.some(t => {
    const s = String(t == null ? '' : t)
      .trim()
      .toLowerCase();
    return s === 'ไฟฟ้า' || s === 'รถไฟฟ้า' || s === 'electric' || s === 'ev' || s === 'bev';
  });
  const hasEvToken = /\bev\b/i.test(tagText) || tags.some(t => String(t || '').includes('อีวี'));

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

  // Determine fuel type (prioritize diesel/hybrid/electric; fallback to gasoline only if explicitly stated)
  if (tagText.includes('diesel') || tagText.includes('ดีเซล')) {
    parsed.fuel_type = 'Diesel';
  } else if (tagText.includes('hybrid') || tagText.includes('ไฮบริด')) {
    parsed.fuel_type = 'Hybrid';
  } else if (tagText.includes('electric') || hasExplicitElectricTag || hasEvToken) {
    parsed.fuel_type = 'Electric';
  } else if (tagText.includes('gasoline') || tagText.includes('เบนซิน')) {
    parsed.fuel_type = 'Gasoline';
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
    transmission: null,
    fuel_type: null,
    year: null,
  };

  if (!description || typeof description !== 'string') return parsed;

  // Extract year from description (Western or Thai Buddhist year)
  // Examples: "ปี 2018", "จดทะเบียนปี 2562"
  let yearMatch = description.match(
    /(?:ปี(?:รถ)?|ปีจดทะเบียน|จดทะเบียน(?:ปี)?)\s*[:：]?\s*(25\d{2}|(?:19|20)\d{2})/i
  );
  if (yearMatch) {
    const rawYear = yearMatch[1];
    if (/^25\d{2}$/.test(rawYear)) {
      const thaiYear = parseInt(rawYear, 10);
      parsed.year = Number.isFinite(thaiYear) ? String(thaiYear - 543) : null;
    } else {
      parsed.year = rawYear;
    }
  }

  // Extract mileage
  // Prefer explicit odometer phrases first (avoids grabbing service intervals like "เช็คระยะ 10,000 กม.")
  let mileageMatch = null;

  // Prefer explicit numeric odometer formats (4+ digits or comma groups), e.g. "ไมล์ 30,000"
  mileageMatch = description.match(/(?:เลขไมล์|ไมล์)\s*[:：]?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i);
  if (mileageMatch) {
    parsed.mileage = mileageMatch[1].replace(/,/g, '');
  }

  // Handle Thai magnitude words, e.g. "ไมล์ 3 หมื่น" -> 30000
  if (!parsed.mileage) {
    mileageMatch = description.match(
      /(?:เลขไมล์|ไมล์)\s*[:：]?\s*(\d{1,3}(?:\.\d+)?)\s*(หมื่น|แสน|ล้าน)\b/i
    );
    if (mileageMatch) {
      const base = Number(mileageMatch[1]);
      const unit = mileageMatch[2];
      const multiplier = unit === 'หมื่น' ? 10000 : unit === 'แสน' ? 100000 : 1000000;
      const computed = Number.isFinite(base) ? Math.round(base * multiplier) : null;
      if (computed && computed > 0) {
        parsed.mileage = String(computed);
      }
    }
  }

  // Handle Thai magnitude words with common phrasing, e.g. "วิ่ง 3 หมื่น" -> 30000
  // Guard against payment phrases like "ผ่อน 3 หมื่น" by requiring a mileage-ish keyword.
  if (!parsed.mileage) {
    mileageMatch = description.match(
      /(?:วิ่ง|ระยะทาง|odo|odometer)\s*[:：]?\s*(\d{1,3}(?:\.\d+)?)\s*(หมื่น|แสน|ล้าน)\b/i
    );
    if (mileageMatch) {
      const base = Number(mileageMatch[1]);
      const unit = mileageMatch[2];
      const multiplier = unit === 'หมื่น' ? 10000 : unit === 'แสน' ? 100000 : 1000000;
      const computed = Number.isFinite(base) ? Math.round(base * multiplier) : null;
      if (computed && computed > 0) {
        parsed.mileage = String(computed);
      }
    }
  }

  // Handle approximate formats like "65,xxx"
  if (!parsed.mileage) {
    mileageMatch = description.match(/(?:เลขไมล์|ไมล์)\s*[:：]?\s*(\d{1,3})\s*,?\s*x{2,3}/i);
    if (mileageMatch) {
      parsed.mileage = `${mileageMatch[1]},xxx`;
    }
  }

  // Fallback: generic "... km" formats (score candidates to avoid service intervals like "เช็คระยะ 10,000 กม.")
  if (!parsed.mileage) {
    const kmRegex = /(\d{1,3}(?:,\d{3})+|\d{4,})(?!\s*,?\s*x{2,3})\s*(?:km|กม|กิโลเมตร)\b/gi;
    let bestValue = null;
    let bestScore = -Infinity;

    const scoreCandidate = (valueRaw, context) => {
      const n = Number(String(valueRaw).replace(/,/g, ''));
      if (!Number.isFinite(n) || n <= 0) return -Infinity;
      // Extremely small numbers are more likely to be non-odometer text
      if (n < 1000) return -Infinity;

      let score = 0;
      if (/(เลขไมล์|ไมล์)/.test(context)) score += 6;
      if (/(วิ่ง|ระยะทาง)/.test(context)) score += 4;
      if (/(odo|odometer)/i.test(context)) score += 4;
      if (/(เช็คระยะ|เซอร์วิส|service|บำรุง)/i.test(context)) score -= 8;
      if (/(บาท|ผ่อน|ดาวน์)/.test(context)) score -= 6;
      // Prefer larger (but still plausible) odometer values when ties happen
      score += Math.min(3, Math.log10(n) - 3);
      return score;
    };

    for (const m of description.matchAll(kmRegex)) {
      const valueRaw = m[1];
      const idx = typeof m.index === 'number' ? m.index : 0;
      const context = description
        .slice(Math.max(0, idx - 24), Math.min(description.length, idx + 32))
        .toLowerCase();
      const score = scoreCandidate(valueRaw, context);
      if (score > bestScore) {
        bestScore = score;
        bestValue = valueRaw;
      }
    }

    if (bestValue) {
      parsed.mileage = String(bestValue).replace(/,/g, '');
    }
  }

  // Fallback: approximate mileage format like "6x,xxx km" or "65,xxx กม"
  // We keep it as a string (e.g., "65,xxx") so UI can display it as-is.
  if (!parsed.mileage) {
    mileageMatch = description.match(/(\d{1,3})\s*,?\s*x{2,3}\s*(?:km|กม|กิโลเมตร)/i);
    if (mileageMatch) {
      parsed.mileage = `${mileageMatch[1]},xxx`;
    }
  }
  if (!parsed.mileage) {
    mileageMatch = description.match(/(?:เลขไมล์|ไมล์)\s*[:：]?\s*(\d{1,3})\s*,?\s*x{2,3}/i);
    if (mileageMatch) {
      parsed.mileage = `${mileageMatch[1]},xxx`;
    }
  }

  // Extract down payment
  const downMatch = description.match(/ดาวน์\s*(\d{1,3}(?:,\d{3})*)/);
  if (downMatch) {
    parsed.down_payment = downMatch[1].replace(/,/g, '');
  }

  // Extract transmission from description when title/tags are missing
  if (!parsed.transmission) {
    const upper = description.toUpperCase();
    const lower = description.toLowerCase();

    if (
      upper.includes('A/T') ||
      upper.includes(' AUTO') ||
      upper.includes('AUTO') ||
      upper.includes('AT') ||
      upper.includes('CVT') ||
      lower.includes('automatic') ||
      description.includes('ออโต้') ||
      description.includes('อัตโนมัติ')
    ) {
      parsed.transmission = 'อัตโนมัติ';
    } else if (
      upper.includes('M/T') ||
      upper.includes('MT') ||
      lower.includes('manual') ||
      description.includes('เกียร์ธรรมดา') ||
      description.includes('ธรรมดา')
    ) {
      parsed.transmission = 'เกียร์ธรรมดา';
    }
  }

  // Extract fuel type from description when tags/metafields are missing
  if (!parsed.fuel_type) {
    const lower = description.toLowerCase();
    const hasExplicitElectric =
      lower.includes('electric') ||
      /\bev\b/i.test(lower) ||
      description.includes('อีวี') ||
      description.includes('รถไฟฟ้า') ||
      description.includes('พลังงานไฟฟ้า') ||
      /(?:เชื้อเพลิง|fuel)\s*[:：]?\s*(?:ไฟฟ้า|electric)/i.test(description);

    if (lower.includes('diesel') || description.includes('ดีเซล')) {
      parsed.fuel_type = 'Diesel';
    } else if (
      lower.includes('hybrid') ||
      description.includes('ไฮบริด') ||
      description.includes('ไฮบริดส์')
    ) {
      parsed.fuel_type = 'Hybrid';
    } else if (hasExplicitElectric) {
      parsed.fuel_type = 'Electric';
    } else if (
      lower.includes('gasoline') ||
      lower.includes('petrol') ||
      description.includes('เบนซิน')
    ) {
      parsed.fuel_type = 'Gasoline';
    }
  }

  // Extract installment - multiple patterns
  // Pattern 1: "ส่ง 12,000" or "ส่ง12,000"
  let installmentMatch = description.match(/ส่ง\s*(\d{1,3}(?:,\d{3})*)/i);
  if (installmentMatch) {
    parsed.installment = installmentMatch[1].replace(/,/g, '');
  }
  // Pattern 2: "ส่ง12000" (no commas)
  if (!parsed.installment) {
    installmentMatch = description.match(/ส่ง(\d{4,})/i);
    if (installmentMatch) {
      parsed.installment = installmentMatch[1];
    }
  }
  // Pattern 3: "ผ่อน X บาท/เดือน" or "ผ่อนเดือนละ X" or "ผ่อน 5,xxx/เดือน"
  if (!parsed.installment) {
    installmentMatch = description.match(
      /ผ่อน(?:\s*(?:เดือนละ|งวดละ))?\s*(\d{1,3}(?:,\d{3})*|\d{4,})\s*(?:บาท)?(?:\s*\/\s*|\s*)(?:เดือน|ด\.|mo)?/i
    );
    if (installmentMatch) {
      parsed.installment = installmentMatch[1].replace(/,/g, '');
    }
  }
  // Pattern 4: "งวดละ X"
  if (!parsed.installment) {
    installmentMatch = description.match(/งวดละ\s*(\d{1,3}(?:,\d{3})*)/i);
    if (installmentMatch) {
      parsed.installment = installmentMatch[1].replace(/,/g, '');
    }
  }
  // Pattern 5: "เริ่มต้น 5,xxx/เดือน" (common marketing phrasing)
  if (!parsed.installment) {
    installmentMatch = description.match(
      /เริ่ม(?:ต้น)?\s*(\d{1,3}(?:,\d{3})*|\d{4,})\s*(?:บาท)?\s*\/\s*(?:เดือน|ด\.|mo)/i
    );
    if (installmentMatch) {
      parsed.installment = installmentMatch[1].replace(/,/g, '');
    }
  }

  // Fallback: approximate installment like "ผ่อน 5,xxx/เดือน" or "ส่ง 12,xxx"
  // Keep string form ("5,xxx") for UI.
  if (!parsed.installment) {
    installmentMatch = description.match(
      /(?:ผ่อน(?:\s*(?:เดือนละ|งวดละ))?|ส่ง|งวดละ|เริ่ม(?:ต้น)?)\s*(\d{1,2})\s*,?\s*x{2,3}/i
    );
    if (installmentMatch) {
      parsed.installment = `${installmentMatch[1]},xxx`;
    }
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

  // Some older inventory doesn't include odometer in description but may have it in tags.
  // Keep this conservative: only fill mileage when we find explicit mileage patterns.
  const tagsText = Array.isArray(product.tags) ? product.tags.join(' ') : '';
  const tagMileage = parseCarDescription(tagsText).mileage;
  const titleMileage = parseCarDescription(product.title || '').mileage;
  const mileage = descData.mileage || tagMileage || titleMileage;

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
    year: titleData.year || descData.year,
    engine: titleData.engine,
    transmission: titleData.transmission || descData.transmission,

    // Category and type
    category: tagData.category || product.productType || null,
    condition: tagData.condition,
    body_type: tagData.body_type,
    fuel_type: tagData.fuel_type || titleData.fuel_type || descData.fuel_type,

    // Financial info
    mileage,
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

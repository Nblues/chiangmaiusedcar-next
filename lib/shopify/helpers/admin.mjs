import { hasValue, specFromMetafields } from './parsers.mjs';

export const needsAdminSpec = (productMetafields, variantMetafields, options = {}) => {
  const specProduct = specFromMetafields(productMetafields);
  const specVariant = specFromMetafields(variantMetafields);

  const includeCategory = Boolean(options.includeCategory);
  const includeBodyType = Boolean(options.includeBodyType);
  const includeDrivetrain = Boolean(options.includeDrivetrain);

  const getAny = keys => {
    for (const k of keys) {
      if (hasValue(specProduct[k])) return specProduct[k];
      if (hasValue(specVariant[k])) return specVariant[k];
    }
    return null;
  };

  const year = getAny(['year', 'ปี']);
  const mileage = getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']);
  const transmission = getAny([
    'transmission',
    'gear',
    'transmission_type',
    'transmission-type',
    'transmissionType',
    'gear_type',
    'gear-type',
    'gearType',
    'เกียร์',
  ]);
  const drivetrain = includeDrivetrain
    ? getAny([
        'drivetrain',
        'drive',
        'drive_type',
        'driveType',
        'wheel_drive',
        'wheelDrive',
        'drive-type',
        'wheel-drive',
        'ระบบขับเคลื่อน',
        'ขับเคลื่อน',
      ])
    : null;
  const fuel = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);

  const category = includeCategory
    ? getAny([
        'category',
        'car-type',
        'vehicle_category',
        'car_category',
        'vehicle_type',
        'car_type',
        'carType',
        'type',
        'ประเภทรถ',
        'หมวดหมู่',
        'ประเภท',
        'หมวดหมู่รถ',
        'ประเภทยานพาหนะ',
      ])
    : null;
  const bodyType = includeBodyType
    ? getAny([
        'body_type',
        'bodyType',
        'body-type',
        'body',
        'body_style',
        'bodyStyle',
        'ประเภทตัวถัง',
      ])
    : null;

  // If any core listing spec is missing, try Admin fallback.
  return (
    !hasValue(year) ||
    !hasValue(mileage) ||
    !hasValue(transmission) ||
    (includeDrivetrain && !hasValue(drivetrain)) ||
    !hasValue(fuel) ||
    (includeCategory && !hasValue(category)) ||
    (includeBodyType && !hasValue(bodyType))
  );
};

export const getShopifyAdminDomain = () => {
  const direct =
    process.env.SHOPIFY_ADMIN_DOMAIN ||
    process.env.SHOPIFY_MYSHOPIFY_DOMAIN ||
    process.env.MYSHOPIFY_DOMAIN;
  if (direct && direct !== 'undefined') return String(direct).trim();

  const storefrontDomain =
    process.env.SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (!storefrontDomain || storefrontDomain === 'undefined') return null;

  const d = String(storefrontDomain).trim();
  if (d.includes('myshopify.com')) return d;

  // Heuristic: if storefront domain is a custom domain (e.g. kn-goodcar.com),
  // infer store handle as the first hostname segment -> kn-goodcar.myshopify.com
  const host = d.split('/')[0];
  const store = host.split('.')[0];
  if (!store) return null;
  return `${store}.myshopify.com`;
};

export const isLikelyAdminToken = token => {
  if (!token || token === 'undefined') return false;
  const t = String(token).trim();
  return (
    t.startsWith('shpat_') ||
    t.startsWith('shpca_') ||
    t.startsWith('shpua_') ||
    t.startsWith('shpss_') ||
    t.startsWith('shppa_')
  );
};

export const getShopifyAdminToken = () => {
  const direct =
    process.env.SHOPIFY_ADMIN_TOKEN ||
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    process.env.SHOPIFY_ADMIN_API_TOKEN;
  if (direct && direct !== 'undefined') return String(direct).trim();

  // Legacy env var: only treat as admin token when it matches known admin token formats.
  const legacy = process.env.API_shopify || process.env.API_SHOPIFY;
  if (isLikelyAdminToken(legacy)) return String(legacy).trim();

  return null;
};

export const getShopifyAdminConfig = () => {
  const domain = getShopifyAdminDomain();
  const token = getShopifyAdminToken();
  const enabled = Boolean(domain) && String(domain).includes('myshopify.com') && Boolean(token);
  return { enabled, domain, token };
};

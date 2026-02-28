import { hasValue } from './parsers.mjs';

/**
 * Normalizes all spec values and pulls out standard car fields 
 * from the merged metafields, falling back to parsed car data where possible.
 */
export function normalizeCarSpec(mergedSpec, parsed, vendor) {
  const getAny = keys => {
    for (const k of keys) {
      if (hasValue(mergedSpec[k])) return mergedSpec[k];
    }
    return null;
  };

  const year = getAny(['year', 'ปี']) || (parsed && parsed.year);
  const mileage =
    getAny(['mileage', 'odometer', 'เลขไมล์', 'ไมล์', 'ระยะทาง', 'เลขไมล์แท้']) ||
    (parsed && parsed.mileage);
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
  const drivetrain = getAny([
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
  ]);
  const fuelType = getAny(['fuel_type', 'fuel', 'fuel-type', 'fuel-supply', 'เชื้อเพลิง']);
  const brand = hasValue(mergedSpec.brand) ? mergedSpec.brand : vendor;
  const model = hasValue(mergedSpec.model) ? mergedSpec.model : null;
  const installment = hasValue(mergedSpec.installment) ? mergedSpec.installment : null;

  const category = getAny([
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
  ]);

  const bodyType = getAny([
    'body_type',
    'bodyType',
    'body',
    'body_style',
    'bodyStyle',
    'ประเภทตัวถัง',
  ]);

  return {
    year,
    mileage,
    transmission,
    drivetrain,
    fuelType,
    brand,
    model,
    installment,
    category,
    bodyType,
  };
}

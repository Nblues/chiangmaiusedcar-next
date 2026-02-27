/**
 * Merges supplemental spec data (from client /api/public/car-specs or SSR pre-fetch)
 * into a base car object from Shopify.
 *
 * Keys normalised: fuelType / fuel_type, drivetrain / drive_type,
 * year, mileage, transmission, installment, category, body_type.
 *
 * Rules:
 * 1. Existing keys on `car` are never overwritten (car data is authoritative).
 * 2. Key aliasing: if fuelType is set but fuel_type is missing (or vice-versa), both are filled.
 * 3. Missing keys are backfilled from `extra` when available.
 *
 * @param {object} car   - Base car object (from SSR props)
 * @param {object|null} extra - Supplemental spec object keyed by handle, or null
 * @returns {object}
 */
export function mergeCarSpecs(car, extra) {
  const next = { ...car };

  const has = v => v != null && String(v).trim() !== '';

  const carFuel = car?.fuelType || car?.fuel_type || car?.['fuel-type'];
  const extraFuel = extra?.fuelType || extra?.fuel_type || extra?.['fuel-type'];

  const carDrive =
    car?.drivetrain ||
    car?.drive_type ||
    car?.driveType ||
    car?.['drive-type'] ||
    car?.wheel_drive ||
    car?.wheelDrive;
  const extraDrive =
    extra?.drivetrain ||
    extra?.drive_type ||
    extra?.driveType ||
    extra?.['drive-type'] ||
    extra?.wheel_drive ||
    extra?.wheelDrive;

  // Normalise fuel keys so all cards behave the same regardless of which key Shopify returns
  if (has(carFuel)) {
    if (!has(next.fuelType)) next.fuelType = carFuel;
    if (!has(next.fuel_type)) next.fuel_type = carFuel;
  }

  // Normalise drivetrain keys
  if (has(carDrive)) {
    if (!has(next.drivetrain)) next.drivetrain = carDrive;
    if (!has(next.drive_type)) next.drive_type = carDrive;
  }

  if (!extra) return next;

  if (!has(next.year) && has(extra.year)) next.year = extra.year;
  if (!has(next.mileage) && has(extra.mileage)) next.mileage = extra.mileage;
  if (!has(next.transmission) && has(extra.transmission)) next.transmission = extra.transmission;

  if (!has(carDrive) && has(extraDrive)) {
    next.drivetrain = extra.drivetrain || extraDrive;
    next.drive_type = extra.drive_type || extraDrive;
  }

  if (!has(carFuel) && has(extraFuel)) {
    next.fuelType = extra.fuelType || extraFuel;
    next.fuel_type = extra.fuel_type || extraFuel;
  }

  if (!has(next.installment) && has(extra.installment)) next.installment = extra.installment;
  if (!has(next.category) && has(extra.category)) next.category = extra.category;
  if (!has(next.body_type) && has(extra.body_type)) next.body_type = extra.body_type;

  return next;
}

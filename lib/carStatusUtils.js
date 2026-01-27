// Shared helpers to normalize car statuses across pages/components.
// Keep logic minimal and language-friendly (Thai/English).

function normalizeText(input) {
  return String(input || '')
    .trim()
    .toLowerCase();
}

function includesAny(haystack, needles) {
  return needles.some(n => haystack.includes(n));
}

export function normalizeCarStatus(status) {
  return normalizeText(status);
}

export function isReservedStatus(status) {
  const s = normalizeText(status);
  if (!s) return false;
  return s === 'reserved' || includesAny(s, ['จอง', 'reserve', 'booked', 'booking']);
}

export function isSoldStatus(status) {
  const s = normalizeText(status);
  if (!s) return false;
  return s === 'sold' || includesAny(s, ['ขาย', 'sold out', 'soldout']);
}

export function isReservedCar(car) {
  const status = car?.status;
  if (isReservedStatus(status)) return true;

  const tags = Array.isArray(car?.tags) ? car.tags : [];
  return tags.some(t => {
    const s = normalizeText(t);
    return s === 'reserved' || s.includes('จอง');
  });
}

export function isSoldCar(car) {
  const status = car?.status;
  if (isSoldStatus(status)) return true;

  const tags = Array.isArray(car?.tags) ? car.tags : [];
  return tags.some(t => {
    const s = normalizeText(t);
    return s === 'sold' || s.includes('ขาย') || s.includes('soldout') || s.includes('sold out');
  });
}

export function computeInStock({ status, availableForSale } = {}) {
  if (isReservedStatus(status) || isSoldStatus(status)) return false;
  if (typeof availableForSale === 'boolean') return availableForSale;
  return true;
}

export function computeSchemaAvailability({ status, availableForSale } = {}) {
  return computeInStock({ status, availableForSale }) ? 'InStock' : 'OutOfStock';
}

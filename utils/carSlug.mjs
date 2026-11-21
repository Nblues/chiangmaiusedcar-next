/**
 * Slug helpers for /car/[handle] URLs.
 * Kept as .mjs (no imports) so Next pages and plain Node scripts (sitemap generation) share one implementation.
 */

/**
 * สร้าง Pretty URL โดยลบคำภาษาไทยและอักขระพิเศษออก
 * @param {string} handle - Shopify handle ที่มีภาษาไทย encoded
 * @returns {string} URL ที่สะอาดและสั้นกว่า
 *
 * @example
 * Input:  "isuzu-d-max-v-cross-3-0-ddi-vgs-turbo-4x4-mt-ปี-2014"
 * Output: "isuzu-d-max-v-cross-3-0-ddi-vgs-turbo-4x4-mt-2014"
 */
export function createPrettyUrl(handle) {
  if (!handle) return '';

  const safeDecode = value => {
    try {
      return decodeURIComponent(String(value));
    } catch {
      return String(value);
    }
  };

  // Decode percent-encoded handles (Shopify handles sometimes contain encoded Thai)
  let cleanHandle = safeDecode(handle);

  // ลบคำภาษาไทยที่ไม่จำเป็นออก (เช่น "ปี")
  const thaiWords = ['ปี', 'รุ่น', 'ปีนี้', 'ปีนั้น'];

  thaiWords.forEach(word => {
    // ลบทั้งแบบ encoded และแบบไม่ encoded
    cleanHandle = cleanHandle.replace(new RegExp(`-${word}-`, 'g'), '-');
    cleanHandle = cleanHandle.replace(new RegExp(`-${encodeURIComponent(word)}-`, 'gi'), '-');
  });

  // Remove remaining Thai characters (helps avoid long %E0%B8.. sequences in shared URLs)
  cleanHandle = cleanHandle.replace(/[\u0E00-\u0E7F]+/g, '');

  // Normalize separators and remove any non URL-safe characters
  // Keep only letters/numbers/dashes to ensure clean, short, shareable URLs.
  cleanHandle = cleanHandle
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // ลบ dash ซ้ำซ้อน
  // (kept above; left here for backward-compat readability)

  return cleanHandle || safeDecode(handle);
}

/**
 * Maps every raw Shopify handle to the one slug its /car/ page is served (and canonicalised) at.
 * Usually that is the pretty slug. When two cars share a pretty slug, a car whose raw handle already
 * is that slug keeps it, otherwise the lowest raw handle does; the other cars keep their raw handle,
 * so each car stays reachable instead of everything landing on the first match.
 * @param {string[]} handles
 * @returns {Map<string, string>} raw handle -> slug
 */
export function buildCanonicalHandleMap(handles) {
  const unique = [
    ...new Set((Array.isArray(handles) ? handles : []).filter(h => h && typeof h === 'string')),
  ];
  const prettyOf = new Map(unique.map(h => [h, createPrettyUrl(h) || h]));

  const owner = new Map();
  for (const h of unique) if (prettyOf.get(h) === h) owner.set(h, h);
  for (const h of [...unique].sort())
    if (!owner.has(prettyOf.get(h))) owner.set(prettyOf.get(h), h);

  return new Map(unique.map(h => [h, owner.get(prettyOf.get(h)) === h ? prettyOf.get(h) : h]));
}

/**
 * Sets `canonicalHandle` on every car of a catalog list (in place, idempotent) and returns the list.
 * @param {Array<{handle?: string}>} cars
 */
export function withCanonicalHandles(cars) {
  if (!Array.isArray(cars) || cars.length === 0) return cars;
  const slugs = buildCanonicalHandleMap(cars.map(car => car?.handle));
  for (const car of cars) {
    if (car?.handle) car.canonicalHandle = slugs.get(car.handle);
  }
  return cars;
}

/**
 * Slug for a car's /car/ URL. Falls back to the plain pretty slug when the car was not annotated.
 * Encode it with encodeURIComponent when building a URL (raw-handle slugs contain Thai).
 */
export function getCarSlug(car) {
  return car?.canonicalHandle || createPrettyUrl(car?.handle) || car?.handle || '';
}

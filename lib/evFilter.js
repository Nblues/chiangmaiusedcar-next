/**
 * EV car detection utility
 * Used to identify (and exclude) electric vehicles from non-EV pages.
 */

/**
 * Returns true if the car is an EV (Battery Electric Vehicle / BEV).
 * Hybrid/HEV/PHEV are NOT considered EV.
 * @param {object} car - normalised car object from Shopify
 */
export function isEvCar(car) {
  if (!car || typeof car !== 'object') return false;

  const title = (car.title || '').toLowerCase();
  const tags = Array.isArray(car.tags) ? car.tags.join(' ').toLowerCase() : '';
  const fuel = ((car.fuelType || '') + ' ' + (car.fuel_type || '')).toLowerCase();

  // Exclude hybrids first (HEV / PHEV / e:HEV)
  if (
    title.includes('hev') ||
    tags.includes('hev') ||
    fuel.includes('hev') ||
    title.includes('hybrid') ||
    tags.includes('hybrid') ||
    fuel.includes('ไฮบริด') ||
    title.includes('phev') ||
    tags.includes('phev')
  ) {
    return false;
  }

  const text = title + ' ' + tags + ' ' + fuel;

  // Pure BEV text signals
  const isEv =
    text.includes(' ev ') ||
    text.includes('electric') ||
    text.includes('ไฟฟ้า') ||
    text.includes('100%');

  // Pure-EV brands / models (no ICE variants to worry about at this dealer)
  const isPureEvBrand =
    text.includes('byd') ||
    text.includes('tesla') ||
    text.includes('neta') ||
    text.includes('aion') ||
    text.includes('changan') ||
    text.includes('wuling') ||
    text.includes('gwm') ||
    text.includes('ora');

  // MG EV models specifically (MG also sells ICE/HEV)
  const isMgEv =
    text.includes('mg4') ||
    text.includes('mg ep') ||
    text.includes('mg zs ev') ||
    text.includes('mg maxus');

  return isEv || isPureEvBrand || isMgEv;
}

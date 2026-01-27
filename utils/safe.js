// Small, tree-shakeable utilities for client bundles.
// Keep this file ESM so Next.js can optimize it.

export function safeGet(obj, path, defaultValue = null) {
  if (obj === null || obj === undefined || typeof obj !== 'object') return defaultValue;

  if (Array.isArray(obj) && typeof path === 'number') {
    return obj[path] !== undefined ? obj[path] : defaultValue;
  }

  try {
    const keys = typeof path === 'string' ? path.split('.') : Array.isArray(path) ? path : [path];

    let current = obj;
    for (const key of keys) {
      if (
        current === null ||
        current === undefined ||
        !Object.prototype.hasOwnProperty.call(current, key)
      ) {
        return defaultValue;
      }
      current = current[key];
    }

    return current !== undefined && current !== null ? current : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeFormatPrice(amount, currency = 'THB', fallback = 'ติดต่อสอบถาม') {
  try {
    const num = Number(amount);
    const isValid = Number.isFinite(num) && num >= 0;

    return {
      valid: isValid,
      numeric: isValid ? String(num) : undefined,
      display: isValid ? num.toLocaleString('th-TH') : fallback,
      currency,
    };
  } catch {
    return {
      valid: false,
      numeric: undefined,
      display: fallback,
      currency,
    };
  }
}

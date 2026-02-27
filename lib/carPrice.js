/**
 * Shared price utilities for car listing pages and structured data builders.
 *
 * @param {*} amount - Raw price amount (number | string | null | undefined)
 * @param {{ allowZero?: boolean }} [options]
 *   allowZero: true (default) treats 0 as a valid price (free cars).
 *   allowZero: false rejects 0 and is used where a price of 0 represents "no price set".
 */
export function getPriceInfo(amount, { allowZero = true } = {}) {
  try {
    const num = Number(amount);
    const valid = Number.isFinite(num) && (allowZero ? num >= 0 : num > 0);
    return {
      valid,
      numeric: valid ? String(num) : undefined,
      // Specify locale to keep SSR/CSR consistent and avoid hydration churn
      display: valid ? num.toLocaleString('th-TH') : 'ติดต่อสอบถาม',
    };
  } catch {
    return { valid: false, numeric: undefined, display: 'ติดต่อสอบถาม' };
  }
}

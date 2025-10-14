/**
 * API Authentication Middleware
 * ป้องกัน API endpoints ที่สำคัญด้วย authentication
 */

import { isAuthenticated } from './adminAuth';

/**
 * ตรวจสอบว่า API route ต้องการ authentication หรือไม่
 */
export function requiresAuth(pathname) {
  const protectedPaths = [
    '/api/admin/',
    '/api/backup/',
    '/api/security/',
    '/api/logs/',
    '/api/cache/',
    '/api/database/',
  ];

  return protectedPaths.some(path => pathname.startsWith(path));
}

/**
 * Middleware สำหรับป้องกัน API routes
 */
export function withApiAuth(handler) {
  return async (req, res) => {
    // ตรวจสอบ authentication
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'กรุณา login ก่อนใช้งาน API นี้',
      });
    }

    // เพิ่ม rate limiting headers
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '99');
    res.setHeader('X-RateLimit-Reset', Date.now() + 60000);

    // เพิ่ม security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    return handler(req, res);
  };
}

/**
 * Validate input เบื้องต้น
 */
export function validateInput(data, rules) {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Required check
    if (rule.required && !value) {
      errors.push(`${field} is required`);
      continue;
    }

    // Type check
    if (value && rule.type) {
      if (rule.type === 'email' && !isValidEmail(value)) {
        errors.push(`${field} must be a valid email`);
      }
      if (rule.type === 'url' && !isValidUrl(value)) {
        errors.push(`${field} must be a valid URL`);
      }
      if (rule.type === 'number' && isNaN(value)) {
        errors.push(`${field} must be a number`);
      }
    }

    // Max length check
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${field} must be less than ${rule.maxLength} characters`);
    }

    // Pattern check
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${field} format is invalid`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper functions
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize output เพื่อป้องกัน XSS
 */
export function sanitizeOutput(data) {
  if (typeof data === 'string') {
    return data
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeOutput);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeOutput(value);
    }
    return sanitized;
  }

  return data;
}

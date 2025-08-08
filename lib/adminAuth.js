import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware ตรวจสอบ Admin auth
export function verifyAdminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized - Invalid role' });
    }

    // ตรวจสอบ token หมดอายุ
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Unauthorized - Token expired' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

// ตรวจสอบ IP ที่อนุญาต
export function checkAllowedIP(req, res, next) {
  const allowedIPs = (process.env.ALLOWED_ADMIN_IPS || '').split(',').filter(ip => ip.trim());

  if (allowedIPs.length === 0) {
    // ถ้าไม่ได้กำหนด IP ให้อนุญาตทุก IP
    return next();
  }

  const clientIP =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown';

  const ip = clientIP.split(',')[0].trim();

  if (!allowedIPs.includes(ip)) {
    return res.status(403).json({
      error: 'Access denied - IP not allowed',
      ip: process.env.NODE_ENV === 'development' ? ip : 'hidden',
    });
  }

  next();
}

// สร้าง admin route wrapper
export function adminRoute(handler) {
  return async (req, res) => {
    // ตรวจสอบ IP ก่อน
    checkAllowedIP(req, res, () => {
      // ตรวจสอบ Auth
      verifyAdminAuth(req, res, () => {
        handler(req, res);
      });
    });
  };
}

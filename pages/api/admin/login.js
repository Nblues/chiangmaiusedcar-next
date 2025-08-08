import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

// ข้อมูล Admin (ควรเก็บในฐานข้อมูลในการใช้งานจริง)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  passwordHash:
    process.env.ADMIN_PASSWORD_HASH ||
    crypto.createHash('sha256').update('301982Nueng@77').digest('hex'),
  twoFactorSecret: process.env.ADMIN_2FA_SECRET || 'KRNG5G5SMRPWEUDS',
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// ตรวจสอบ IP ที่อนุญาต
const ALLOWED_IPS = (process.env.ALLOWED_ADMIN_IPS || '').split(',').filter(ip => ip);

// Rate limiting
const loginAttempts = new Map();
const blockedIPs = new Map();

// ยืนยัน 2FA code
function verify2FA(token, secret) {
  const speakeasy = require('speakeasy');

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // อนุญาต ±2 ช่วงเวลา (60 วินาที)
  });
}

// สร้าง JWT token
function generateJWT(user) {
  const jwt = require('jsonwebtoken');

  const payload = {
    id: user.id,
    username: user.username,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60, // หมดอายุใน 2 ชั่วโมง
  };

  return jwt.sign(payload, JWT_SECRET);
}

// ตรวจสอบ Rate limiting
function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];

  // ลบ attempts ที่เก่ากว่า 15 นาที
  const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);

  if (recentAttempts.length >= 5) {
    blockedIPs.set(ip, now + 30 * 60 * 1000); // บล็อก 30 นาที
    return false;
  }

  return true;
}

// เพิ่ม attempt
function addLoginAttempt(ip) {
  const attempts = loginAttempts.get(ip) || [];
  attempts.push(Date.now());
  loginAttempts.set(ip, attempts);
}

// บันทึก log
async function logActivity(activity) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });

    const logFile = path.join(logDir, `admin-${new Date().toISOString().split('T')[0]}.log`);
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(activity)}\n`;

    await fs.appendFile(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write log:', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    // ตรวจสอบ IP ที่ถูกบล็อก
    const blockEnd = blockedIPs.get(clientIP);
    if (blockEnd && Date.now() < blockEnd) {
      await logActivity({
        action: 'LOGIN_BLOCKED',
        ip: clientIP,
        userAgent,
        reason: 'IP blocked due to too many attempts',
      });

      return res.status(429).json({
        success: false,
        message: 'IP ถูกบล็อกชั่วคราว กรุณาลองใหม่ภายหลัง',
      });
    }

    // ตรวจสอบ rate limiting
    if (!checkRateLimit(clientIP)) {
      await logActivity({
        action: 'LOGIN_RATE_LIMITED',
        ip: clientIP,
        userAgent,
      });

      return res.status(429).json({
        success: false,
        message: 'พยายามเข้าสู่ระบบบ่อยเกินไป',
      });
    }

    // ตรวจสอบ IP ที่อนุญาต (ถ้าได้กำหนดไว้)
    if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIP)) {
      await logActivity({
        action: 'LOGIN_UNAUTHORIZED_IP',
        ip: clientIP,
        userAgent,
      });

      return res.status(403).json({
        success: false,
        message: 'ไม่อนุญาตให้เข้าถึงจาก IP นี้',
      });
    }

    const { username, password, twoFactorCode, fingerprint } = req.body;

    // ตรวจสอบข้อมูลพื้นฐาน
    if (!username || !password) {
      addLoginAttempt(clientIP);

      await logActivity({
        action: 'LOGIN_MISSING_CREDENTIALS',
        ip: clientIP,
        userAgent,
        username,
      });

      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      });
    }

    // ตรวจสอบ username และ password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (
      username !== ADMIN_CREDENTIALS.username ||
      passwordHash !== ADMIN_CREDENTIALS.passwordHash
    ) {
      addLoginAttempt(clientIP);

      await logActivity({
        action: 'LOGIN_INVALID_CREDENTIALS',
        ip: clientIP,
        userAgent,
        username,
        fingerprint,
      });

      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
    }

    // ตรวจสอบ 2FA
    if (!twoFactorCode) {
      await logActivity({
        action: 'LOGIN_REQUIRE_2FA',
        ip: clientIP,
        userAgent,
        username,
      });

      return res.json({
        success: true,
        requireTwoFactor: true,
        message: 'กรุณากรอกรหัส 2FA',
      });
    }

    // ยืนยัน 2FA code
    if (!verify2FA(twoFactorCode, ADMIN_CREDENTIALS.twoFactorSecret)) {
      addLoginAttempt(clientIP);

      await logActivity({
        action: 'LOGIN_INVALID_2FA',
        ip: clientIP,
        userAgent,
        username,
        twoFactorCode,
      });

      return res.status(401).json({
        success: false,
        message: 'รหัส 2FA ไม่ถูกต้อง',
      });
    }

    // สร้าง JWT token
    const user = {
      id: 1,
      username: ADMIN_CREDENTIALS.username,
      role: 'admin',
    };

    const token = generateJWT(user);
    const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    // ล้าง login attempts สำหรับ IP นี้
    loginAttempts.delete(clientIP);
    blockedIPs.delete(clientIP);

    await logActivity({
      action: 'LOGIN_SUCCESS',
      ip: clientIP,
      userAgent,
      username,
      fingerprint,
    });

    res.json({
      success: true,
      token,
      expiry,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    await logActivity({
      action: 'LOGIN_ERROR',
      ip: clientIP,
      userAgent,
      error: error.message,
    });

    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    });
  }
}

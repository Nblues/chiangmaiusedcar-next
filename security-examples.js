/**
 * Security Configuration Examples
 * ตัวอย่างการปรับแต่งความปลอดภัยขั้นสูง
 */

// 1. การเปลี่ยนรหัสผ่าน Admin
// แก้ไขไฟล์: pages/admin/login.jsx

export const updateAdminCredentials = () => {
  // เปลี่ยนจาก:
  // if (username === 'admin' && password === 'admin123') {

  // เป็น:
  const ADMIN_USERNAME = 'your-new-username';
  const ADMIN_PASSWORD = 'your-secure-password-123!';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // login logic
  }
};

// 2. การเพิ่ม IP Whitelist
// แก้ไขไฟล์: middleware.js

export const ipWhitelistMiddleware = request => {
  const allowedIPs = [
    '192.168.1.100', // IP ของคุณ
    '203.xxx.xxx.xxx', // IP ออฟฟิศ
  ];

  const clientIP =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.ip;

  if (!allowedIPs.includes(clientIP)) {
    return new Response('Access Denied', { status: 403 });
  }
};

// 3. การเพิ่ม Rate Limiting
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 5, // จำกัด 5 ครั้งต่อ 15 นาที
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
};

// 4. การเข้ารหัส Session
export const sessionConfig = {
  secret: 'your-super-secret-session-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 ชั่วโมง
  },
};

// 5. การตั้งค่า Environment Variables
// สร้างไฟล์ .env.local

/*
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=your-session-secret-key
ALLOWED_IPS=192.168.1.100,203.xxx.xxx.xxx
*/

// 6. การเพิ่ม 2FA (Two-Factor Authentication)
export const twoFactorConfig = {
  serviceName: 'Chiangmaiusedcar Admin',
  issuer: 'Chiangmaiusedcar',
  window: 2,
  time: 30,
};

// 7. การ Backup อัตโนมัติ
export const backupConfig = {
  schedule: '0 2 * * *', // ทุกวันเวลา 02:00
  retention: 30, // เก็บไว้ 30 วัน
  location: '/backups/admin-data',
};

// 8. การ Monitor การเข้าถึง
export const monitoringConfig = {
  logLevel: 'info',
  logFile: '/logs/admin-access.log',
  alertEmail: 'admin@chiangmaiusedcar.com',
  maxFailedAttempts: 3,
};

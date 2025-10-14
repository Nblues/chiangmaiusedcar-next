/**
 * Test Environment Variables API
 * GET /api/test-env
 * ใช้สำหรับตรวจสอบว่า env vars ถูกโหลดหรือไม่
 */

export default function handler(req, res) {
  const hasAdmin = !!process.env.ADMIN_USERNAME;
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const hasSecret = !!process.env.SESSION_SECRET;

  // ไม่แสดงค่าจริง เพื่อความปลอดภัย
  const result = {
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    variables: {
      ADMIN_USERNAME: hasAdmin ? '✅ Set' : '❌ Not set',
      ADMIN_PASSWORD: hasPassword ? '✅ Set' : '❌ Not set',
      SESSION_SECRET: hasSecret ? '✅ Set' : '❌ Not set',
    },
    // แสดง 3 ตัวอักษรแรกเพื่อยืนยัน
    preview: {
      username: process.env.ADMIN_USERNAME
        ? process.env.ADMIN_USERNAME.substring(0, 3) + '...'
        : 'none',
      usernameLength: process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.length : 0,
      secretLength: process.env.SESSION_SECRET ? process.env.SESSION_SECRET.length : 0,
    },
  };

  return res.status(200).json(result);
}

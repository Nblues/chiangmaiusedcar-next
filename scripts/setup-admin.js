#!/usr/bin/env node

/**
 * Admin Setup Script
 * ตั้งค่าระบบ Admin รวมทั้ง 2FA
 */

const crypto = require('crypto');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { promises: fs } = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupAdmin() {
  console.log('🔧 ตั้งค่าระบบ Admin ครูหนึ่งรถสวย');
  console.log('='.repeat(50));

  try {
    // 1. ตั้งค่า username และ password
    const username = (await question('กรอกชื่อผู้ใช้ Admin (default: admin): ')) || 'admin';
    const password = await question('กรอกรหัสผ่าน (ต้องมีความแข็งแรง): ');

    if (!password || password.length < 8) {
      console.log('❌ รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      rl.close();
      return;
    }

    // 2. สร้าง password hash
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // 3. สร้าง 2FA secret
    const secret = speakeasy.generateSecret({
      name: 'ครูหนึ่งรถสวย Admin',
      issuer: 'ChiangMaiUsedCar',
      length: 20,
    });

    // 4. สร้าง JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');

    // 5. สร้าง QR Code สำหรับ Google Authenticator
    console.log('\n📱 ตั้งค่า Google Authenticator:');
    console.log('1. ติดตั้งแอป Google Authenticator บนมือถือ');
    console.log('2. สแกน QR Code ด้านล่าง หรือกรอก Secret key ด้วยตนเอง');
    console.log('\n🔑 Secret Key:', secret.base32);

    try {
      const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
      console.log('\n📷 QR Code URL:', qrCodeDataURL);
      console.log('💡 คัดลอก URL ด้านบนไปเปิดในเบราว์เซอร์เพื่อดู QR Code');
    } catch (error) {
      console.log('⚠️ ไม่สามารถสร้าง QR Code ได้ กรุณาใช้ Secret Key แทน');
    }

    // 6. ทดสอบ 2FA
    console.log('\n🔐 ทดสอบ 2FA:');
    const testToken = await question('กรอกรหัส 6 หลักจาก Google Authenticator เพื่อทดสอบ: ');

    const verified = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: testToken,
      window: 2,
    });

    if (!verified) {
      console.log('❌ รหัส 2FA ไม่ถูกต้อง กรุณาลองใหม่');
      rl.close();
      return;
    }

    console.log('✅ รหัส 2FA ถูกต้อง!');

    // 7. สร้างไฟล์ .env.local
    const envContent = `# Admin Configuration - Generated ${new Date().toISOString()}
# 🔒 อย่าแชร์ไฟล์นี้กับใครและอย่า commit ลง Git!

# Admin Credentials
ADMIN_USERNAME=${username}
ADMIN_PASSWORD_HASH=${passwordHash}

# 2FA Secret
ADMIN_2FA_SECRET=${secret.base32}

# JWT Secret
JWT_SECRET=${jwtSecret}

# Image Processing Token
IMAGE_PROCESS_TOKEN=${crypto.randomBytes(32).toString('hex')}

# Allowed Admin IPs (เว้นว่างหากต้องการอนุญาตทุก IP)
ALLOWED_ADMIN_IPS=

# Production Settings
NODE_ENV=production
`;

    const envPath = path.join(process.cwd(), '.env.local');
    await fs.writeFile(envPath, envContent);

    console.log('\n✅ ตั้งค่าเสร็จสิ้น!');
    console.log('='.repeat(50));
    console.log('📄 ไฟล์ .env.local ถูกสร้างแล้ว');
    console.log('🔗 เข้าสู่ระบบที่: http://localhost:3000/admin-login');
    console.log('\n📋 ข้อมูลการเข้าสู่ระบบ:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   2FA Secret: ${secret.base32}`);
    console.log('\n🔒 ข้อควรจำ:');
    console.log('   - อย่าแชร์ข้อมูลเหล่านี้กับใคร');
    console.log('   - สำรอง Secret Key ไว้ในที่ปลอดภัย');
    console.log('   - ใช้ VPN หรือ IP ที่ปลอดภัยในการเข้าถึง');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupAdmin();
}

module.exports = { setupAdmin };

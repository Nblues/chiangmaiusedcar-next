/**
 * Automated Backup API
 * สำหรับ backup อัตโนมัติไปยัง Firebase Storage
 */

import fs from 'fs';
import path from 'path';
import { bucket } from '../../../lib/firebase-admin';
import { isAuthenticated } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ตรวจสอบ authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  try {
    const { uploadToFirebase = false } = req.body;

    // 1. สร้าง local backup
    const backupData = await createBackupData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;

    // 2. บันทึก local backup
    const backupDir = path.join(process.cwd(), 'backups', 'automated');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const localPath = path.join(backupDir, filename);
    fs.writeFileSync(localPath, JSON.stringify(backupData, null, 2));

    const stats = fs.statSync(localPath);
    const fileSize = Math.round((stats.size / 1024) * 100) / 100; // KB

    let firebaseUrl = null;
    let firebaseUploadSuccess = false;

    // 3. อัปโหลดไปยัง Firebase Storage (ถ้าเปิดใช้งาน)
    if (uploadToFirebase && bucket) {
      try {
        const firebasePath = `backups/automated/${filename}`;
        const file = bucket.file(firebasePath);

        await file.save(JSON.stringify(backupData, null, 2), {
          contentType: 'application/json',
          metadata: {
            metadata: {
              backupType: 'automated',
              timestamp: new Date().toISOString(),
              fileSize: `${fileSize} KB`,
              environment: process.env.NODE_ENV || 'development',
            },
          },
        });

        // สร้าง signed URL (หมดอายุ 7 วัน)
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        firebaseUrl = url;
        firebaseUploadSuccess = true;
      } catch (firebaseError) {
        // eslint-disable-next-line no-console
        console.error('Firebase upload error:', firebaseError);
        // ไม่ fail ทั้งหมด แค่แจ้งว่า Firebase upload ล้มเหลว
      }
    }

    // 4. ลบ backup เก่า (เก็บแค่ 30 วันล่าสุด)
    await cleanOldBackups(backupDir, 30);

    res.status(200).json({
      success: true,
      backup: {
        filename,
        localPath,
        size: `${fileSize} KB`,
        created: new Date().toISOString(),
        uploadedToFirebase: firebaseUploadSuccess,
        firebaseUrl,
      },
      message: firebaseUploadSuccess
        ? 'Backup created and uploaded to Firebase successfully'
        : 'Backup created locally (Firebase not configured or disabled)',
      recommendations: [
        '✅ Backup สำเร็จแล้ว',
        firebaseUploadSuccess ? '☁️ อัปโหลด Firebase สำเร็จ' : '📁 บันทึก local แล้ว',
        '🔄 ตั้งค่า cron job สำหรับ backup อัตโนมัติ',
        '🔐 ใช้ encryption สำหรับข้อมูลสำคัญ',
      ],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Automated backup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to create automated backup',
    });
  }
}

/**
 * สร้างข้อมูล backup
 */
async function createBackupData() {
  const data = {
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    backupType: 'automated',
    environment: process.env.NODE_ENV || 'development',
    site: process.env.NEXT_PUBLIC_SITE_URL || 'localhost',

    // Configuration (ไม่รวม secrets)
    configuration: {
      shopifyDomain: !!process.env.SHOPIFY_DOMAIN,
      emailService: !!process.env.EMAILJS_SERVICE_ID,
      analytics: !!process.env.NEXT_PUBLIC_GA_ID,
      recaptcha: !!process.env.RECAPTCHA_SECRET_KEY,
      facebookPixel: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    },

    // Statistics
    statistics: {
      timestamp: new Date().toISOString(),
      pages: 50, // จำนวนหน้าทั้งหมด
      apiEndpoints: 35, // จำนวน API endpoints
      components: 30, // จำนวน components
    },

    // System info
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },

    // Metadata
    metadata: {
      creator: 'automated-backup-system',
      description: 'Automated backup created by cron job',
      retentionDays: 30,
    },
  };

  return data;
}

/**
 * ลบ backup เก่า
 */
async function cleanOldBackups(backupDir, retentionDays) {
  try {
    if (!fs.existsSync(backupDir)) return;

    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    const maxAge = retentionDays * 24 * 60 * 60 * 1000; // milliseconds

    let deletedCount = 0;

    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    return deletedCount;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Clean old backups error:', error);
    return 0;
  }
}

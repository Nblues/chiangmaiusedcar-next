/**
 * Cron Job - Daily Backup
 * เรียกทุกวันตอน 2:00 AM โดย Vercel Cron
 * หรือสามารถเรียกผ่าน curl สำหรับทดสอบ
 */

import { bucket } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  // ตรวจสอบ authorization (Vercel Cron secret)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  try {
    // 1. สร้าง backup data
    const backupData = {
      timestamp: new Date().toISOString(),
      type: 'daily',
      environment: process.env.NODE_ENV || 'production',
      configuration: {
        shopifyDomain: !!process.env.SHOPIFY_DOMAIN,
        emailService: !!process.env.EMAILJS_SERVICE_ID,
        analytics: !!process.env.NEXT_PUBLIC_GA_ID,
      },
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `daily-backup-${timestamp}.json`;

    // 2. อัปโหลดไปยัง Firebase
    let firebaseSuccess = false;
    if (bucket) {
      const file = bucket.file(`backups/daily/${filename}`);
      await file.save(JSON.stringify(backupData, null, 2), {
        contentType: 'application/json',
      });
      firebaseSuccess = true;
    }

    res.status(200).json({
      success: true,
      backup: {
        filename,
        timestamp: new Date().toISOString(),
        uploadedToFirebase: firebaseSuccess,
      },
      message: 'Daily backup completed successfully',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Daily backup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

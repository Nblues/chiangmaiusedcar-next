/**
 * Cron Job - Weekly Backup
 * เรียกทุกอาทิตย์ตอน 3:00 AM โดย Vercel Cron
 */

import { bucket } from '../../../lib/firebase-admin';

export default async function handler(req, res) {
  // ตรวจสอบ authorization
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  try {
    // สร้าง weekly backup
    const backupData = {
      timestamp: new Date().toISOString(),
      type: 'weekly',
      environment: process.env.NODE_ENV || 'production',
      configuration: {
        shopifyDomain: !!process.env.SHOPIFY_DOMAIN,
        emailService: !!process.env.EMAILJS_SERVICE_ID,
        analytics: !!process.env.NEXT_PUBLIC_GA_ID,
      },
    };

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `weekly-backup-${timestamp}.json`;

    // อัปโหลดไปยัง Firebase
    let firebaseSuccess = false;
    if (bucket) {
      const file = bucket.file(`backups/weekly/${filename}`);
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
      message: 'Weekly backup completed successfully',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Weekly backup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

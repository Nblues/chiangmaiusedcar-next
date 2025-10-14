/**
 * Create Backup API
 * สำรองข้อมูลเว็บไซต์
 */

import fs from 'fs';
import path from 'path';
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
      message: 'กรุณา login ก่อนสร้าง backup',
    });
  }

  try {
    const { timestamp } = req.body;
    const backupDir = path.join(process.cwd(), 'backups');
    const backupTimestamp = timestamp
      ? new Date(timestamp).toISOString().replace(/[:.]/g, '-')
      : new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `backup-${backupTimestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Collect backup data
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      site: process.env.NEXT_PUBLIC_SITE_URL || 'localhost',
      environment: process.env.NODE_ENV || 'development',
      metadata: {
        backupType: 'manual',
        creator: 'admin',
        description: 'Manual backup created from admin dashboard',
      },
      data: {
        // In production, include database exports, content, etc.
        config: {
          shopifyDomain: !!process.env.SHOPIFY_DOMAIN,
          emailService: !!process.env.EMAILJS_SERVICE_ID,
          analytics: !!process.env.NEXT_PUBLIC_GA_ID,
        },
        statistics: {
          pages: 15, // Count your actual pages
          apiEndpoints: 30, // Count your actual API endpoints
          components: 25, // Count your actual components
        },
      },
    };

    // Write backup file
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    // Get file size
    const stats = fs.statSync(backupPath);
    const fileSize = Math.round((stats.size / 1024) * 100) / 100; // KB

    res.status(200).json({
      success: true,
      backup: {
        filename: backupFilename,
        path: backupPath,
        size: `${fileSize} KB`,
        created: new Date().toISOString(),
        status: 'completed',
      },
      message: 'Backup created successfully',
      recommendations: [
        '✅ Backup สำเร็จแล้ว',
        '💾 เก็บ backup ไว้ในที่ปลอดภัย',
        '🔄 ควร backup เป็นประจำทุกสัปดาห์',
        '☁️ พิจารณา backup ไปยัง cloud storage',
      ],
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to create backup',
    });
  }
}

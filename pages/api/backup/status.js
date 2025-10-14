/**
 * Backup Status API
 * ตรวจสอบสถานะการสำรองข้อมูล
 */

import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ตรวจสอบ authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'กรุณา login ก่อนดูสถานะ backup',
    });
  }

  try {
    const backupDir = path.join(process.cwd(), 'backups');
    let backups = [];

    // Check if backup directory exists
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir);
      backups = files
        .filter(file => file.endsWith('.json') || file.endsWith('.backup'))
        .map(file => {
          const stats = fs.statSync(path.join(backupDir, file));
          const sizeInBytes = stats.size;
          const sizeInKB = Math.round((sizeInBytes / 1024) * 100) / 100;
          const sizeInMB = Math.round((sizeInBytes / 1024 / 1024) * 100) / 100;
          return {
            filename: file,
            sizeBytes: sizeInBytes,
            sizeKB: sizeInKB,
            sizeMB: sizeInMB,
            size: sizeInMB, // Keep for compatibility
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
        .sort((a, b) => b.created - a.created);
    }

    const lastBackup = backups.length > 0 ? backups[0] : null;
    const totalBackups = backups.length;
    const totalSizeBytes = backups.reduce((sum, backup) => sum + backup.sizeBytes, 0);
    const totalSizeKB = Math.round((totalSizeBytes / 1024) * 100) / 100;
    const totalSizeMB = Math.round((totalSizeBytes / 1024 / 1024) * 100) / 100;

    // Calculate backup health
    let status = 'good';
    let message = 'Backup system is healthy';

    if (!lastBackup) {
      status = 'warning';
      message = 'No backups found - create your first backup';
    } else {
      const hoursSinceLastBackup = (Date.now() - new Date(lastBackup.created)) / 1000 / 60 / 60;
      if (hoursSinceLastBackup > 168) {
        // 7 days
        status = 'error';
        message = 'Last backup was over 7 days ago';
      } else if (hoursSinceLastBackup > 72) {
        // 3 days
        status = 'warning';
        message = 'Last backup was over 3 days ago';
      }
    }

    // Format size display
    const formatSize = (sizeKB, sizeMB) => {
      if (sizeMB >= 1) {
        return `${sizeMB} MB`;
      } else {
        return `${sizeKB} KB`;
      }
    };

    const backupStatus = {
      timestamp: new Date().toISOString(),
      status,
      message,
      lastBackup: lastBackup
        ? {
            filename: lastBackup.filename,
            size: formatSize(lastBackup.sizeKB, lastBackup.sizeMB),
            sizeBytes: lastBackup.sizeBytes,
            created: lastBackup.created,
            age: getTimeAgo(lastBackup.created),
          }
        : null,
      statistics: {
        total: totalBackups,
        totalSize: formatSize(totalSizeKB, totalSizeMB),
        totalSizeBytes: totalSizeBytes,
        totalSizeKB: totalSizeKB,
        totalSizeMB: totalSizeMB,
        oldestBackup: backups.length > 0 ? backups[backups.length - 1].created : null,
      },
      recentBackups: backups.slice(0, 5).map(backup => ({
        ...backup,
        displaySize: formatSize(backup.sizeKB, backup.sizeMB),
      })),
      recommendations: getRecommendations(status, lastBackup),
    };

    res.status(200).json({
      success: true,
      backup: backupStatus,
      message: 'Backup status retrieved successfully',
    });
  } catch (error) {
    console.error('Backup status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve backup status',
    });
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

function getRecommendations(status, lastBackup) {
  const recommendations = [];

  if (status === 'error') {
    recommendations.push('🚨 สร้าง backup ใหม่ทันที!');
    recommendations.push('📅 ตั้งค่า automated backup schedule');
  } else if (status === 'warning') {
    recommendations.push('⚠️ ควรสร้าง backup ใหม่');
    recommendations.push('🔄 พิจารณาเพิ่มความถี่ของ backup');
  } else {
    recommendations.push('✅ Backup system ทำงานปกติ');
    if (lastBackup) {
      recommendations.push('💾 สำรองข้อมูลล่าสุดเมื่อ ' + getTimeAgo(lastBackup.created));
    }
  }

  recommendations.push('📊 ตรวจสอบ backup อย่างน้อยสัปดาห์ละครั้ง');

  return recommendations;
}

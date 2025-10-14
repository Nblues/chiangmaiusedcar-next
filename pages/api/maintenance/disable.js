/**
 * Disable Maintenance Mode API
 * ปิดโหมดปิดปรับปรุงเว็บไซต์
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
      message: 'กรุณา login ก่อนปิดโหมดปิดปรับปรุง',
    });
  }

  try {
    const maintenanceFlagPath = path.join(process.cwd(), '.maintenance');
    const wasEnabled = fs.existsSync(maintenanceFlagPath);

    if (!wasEnabled) {
      return res.status(200).json({
        success: true,
        message: 'Maintenance mode was already disabled',
        wasEnabled: false,
      });
    }

    // Read existing maintenance data before deleting
    let maintenanceData = {};
    try {
      maintenanceData = JSON.parse(fs.readFileSync(maintenanceFlagPath, 'utf-8'));
    } catch {
      maintenanceData = { startedAt: 'unknown' };
    }

    // Remove maintenance flag file
    fs.unlinkSync(maintenanceFlagPath);

    // Calculate duration
    let duration = 'unknown';
    if (maintenanceData.startedAt) {
      const start = new Date(maintenanceData.startedAt);
      const end = new Date();
      const durationMs = end - start;
      const minutes = Math.floor(durationMs / 1000 / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        duration = `${hours} ชั่วโมง ${minutes % 60} นาที`;
      } else {
        duration = `${minutes} นาที`;
      }
    }

    // Log activity
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const activityLogPath = path.join(logsDir, 'activity.log');

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'maintenance_disabled',
        user: 'admin',
        details: {
          startedAt: maintenanceData.startedAt,
          endedAt: new Date().toISOString(),
          duration,
          reason: maintenanceData.reason,
        },
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      };

      fs.appendFileSync(activityLogPath, JSON.stringify(logEntry) + '\n');
    } catch (logError) {
      console.error('Failed to log maintenance activity:', logError);
    }

    res.status(200).json({
      success: true,
      wasEnabled: true,
      duration,
      message: 'Maintenance mode disabled successfully',
      summary: {
        startedAt: maintenanceData.startedAt,
        endedAt: new Date().toISOString(),
        duration,
        reason: maintenanceData.reason || 'unknown',
      },
      instructions: [
        '✅ โหมดปิดปรับปรุงปิดแล้ว',
        '🌐 เว็บไซต์กลับมาทำงานปกติ',
        `⏱️ ใช้เวลาปิดปรับปรุง: ${duration}`,
        '📊 ตรวจสอบ activity logs เพื่อดูประวัติ',
      ],
    });
  } catch (error) {
    console.error('Disable maintenance error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to disable maintenance mode',
    });
  }
}

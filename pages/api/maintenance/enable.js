/**
 * Enable Maintenance Mode API
 * เปิดโหมดปิดปรับปรุงเว็บไซต์
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
      message: 'กรุณา login ก่อนเปิดโหมดปิดปรับปรุง',
    });
  }

  try {
    const { reason, estimatedDuration, message } = req.body;
    const maintenanceFlagPath = path.join(process.cwd(), '.maintenance');

    const maintenanceData = {
      enabled: true,
      startedAt: new Date().toISOString(),
      reason: reason || 'ปรับปรุงระบบ',
      estimatedDuration: estimatedDuration || '1 ชั่วโมง',
      message: message || 'เว็บไซต์กำลังปรับปรุง กรุณากลับมาใหม่ในภายหลัง',
      createdBy: 'admin',
    };

    // Create maintenance flag file
    fs.writeFileSync(maintenanceFlagPath, JSON.stringify(maintenanceData, null, 2));

    // Log activity
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const activityLogPath = path.join(logsDir, 'activity.log');

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'maintenance_enabled',
        user: 'admin',
        details: maintenanceData,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      };

      fs.appendFileSync(activityLogPath, JSON.stringify(logEntry) + '\n');
    } catch (logError) {
      console.error('Failed to log maintenance activity:', logError);
    }

    res.status(200).json({
      success: true,
      maintenance: maintenanceData,
      message: 'Maintenance mode enabled successfully',
      instructions: [
        '✅ โหมดปิดปรับปรุงเปิดแล้ว',
        '🚧 ผู้เยี่ยมชมจะเห็นหน้าปิดปรับปรุง',
        '⚠️ อย่าลืมปิดโหมดหลังเสร็จงาน',
        '📝 ตรวจสอบ activity logs เพื่อดูประวัติ',
      ],
    });
  } catch (error) {
    console.error('Enable maintenance error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to enable maintenance mode',
    });
  }
}

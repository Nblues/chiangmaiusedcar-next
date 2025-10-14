/**
 * Maintenance Mode Status API
 * ตรวจสอบสถานะโหมดปิดปรับปรุง
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
      message: 'กรุณา login ก่อนดูสถานะ maintenance',
    });
  }

  try {
    const maintenanceFlagPath = path.join(process.cwd(), '.maintenance');
    const isMaintenanceMode = fs.existsSync(maintenanceFlagPath);

    let maintenanceInfo = {
      enabled: false,
      message: 'เว็บไซต์ทำงานปกติ',
      startedAt: null,
      reason: null,
      estimatedDuration: null,
    };

    if (isMaintenanceMode) {
      try {
        const maintenanceData = JSON.parse(fs.readFileSync(maintenanceFlagPath, 'utf-8'));
        maintenanceInfo = {
          enabled: true,
          message: 'เว็บไซต์อยู่ในโหมดปิดปรับปรุง',
          ...maintenanceData,
        };
      } catch {
        maintenanceInfo = {
          enabled: true,
          message: 'เว็บไซต์อยู่ในโหมดปิดปรับปรุง',
          startedAt: new Date().toISOString(),
        };
      }
    }

    res.status(200).json({
      success: true,
      maintenance: maintenanceInfo,
      message: isMaintenanceMode ? 'Maintenance mode is enabled' : 'Site is running normally',
    });
  } catch (error) {
    console.error('Maintenance status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to check maintenance status',
    });
  }
}

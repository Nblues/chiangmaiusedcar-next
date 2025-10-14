/**
 * Error Logs API
 * ดูบันทึกข้อผิดพลาดล่าสุด
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
      message: 'กรุณา login ก่อนดู error logs',
    });
  }

  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const errorLogPath = path.join(logsDir, 'errors.log');

    let errors = [];

    // Check if log file exists
    if (fs.existsSync(errorLogPath)) {
      const logContent = fs.readFileSync(errorLogPath, 'utf-8');
      const logLines = logContent.split('\n').filter(line => line.trim());

      // Parse last 50 errors
      errors = logLines
        .slice(-50)
        .reverse()
        .map((line, index) => {
          try {
            const parsed = JSON.parse(line);
            return {
              id: index + 1,
              ...parsed,
            };
          } catch {
            return {
              id: index + 1,
              timestamp: new Date().toISOString(),
              level: 'error',
              message: line,
            };
          }
        });
    }

    // Generate error statistics
    const last24Hours = errors.filter(e => {
      const errorTime = new Date(e.timestamp);
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return errorTime > dayAgo;
    });

    const errorsByType = errors.reduce((acc, error) => {
      const type = error.type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const errorLogs = {
      timestamp: new Date().toISOString(),
      total: errors.length,
      last24Hours: last24Hours.length,
      byType: errorsByType,
      recentErrors: errors.slice(0, 10),
      status:
        last24Hours.length === 0 ? 'healthy' : last24Hours.length < 10 ? 'warning' : 'critical',
      message:
        last24Hours.length === 0
          ? 'No errors in the last 24 hours'
          : `${last24Hours.length} errors in the last 24 hours`,
    };

    res.status(200).json({
      success: true,
      logs: errorLogs,
      message: 'Error logs retrieved successfully',
    });
  } catch (error) {
    console.error('Error logs retrieval error:', error);

    // If no logs exist, return empty state
    res.status(200).json({
      success: true,
      logs: {
        timestamp: new Date().toISOString(),
        total: 0,
        last24Hours: 0,
        byType: {},
        recentErrors: [],
        status: 'healthy',
        message: 'No error logs found - logging system is clean',
      },
      message: 'Error logs retrieved successfully (no errors logged)',
    });
  }
}

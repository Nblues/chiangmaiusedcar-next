/**
 * Activity Logs API
 * ดูประวัติการใช้งานระบบ (Audit Trail)
 */

import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  // ตรวจสอบ authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'กรุณา login ก่อนดู activity logs',
    });
  }

  if (req.method === 'GET') {
    return getActivityLogs(req, res);
  } else if (req.method === 'POST') {
    return logActivity(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getActivityLogs(req, res) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const activityLogPath = path.join(logsDir, 'activity.log');

    let activities = [];

    // Check if log file exists
    if (fs.existsSync(activityLogPath)) {
      const logContent = fs.readFileSync(activityLogPath, 'utf-8');
      const logLines = logContent.split('\n').filter(line => line.trim());

      // Parse last 100 activities
      activities = logLines
        .slice(-100)
        .reverse()
        .map((line, index) => {
          try {
            const parsed = JSON.parse(line);
            return {
              id: index + 1,
              ...parsed,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }

    // Generate activity statistics
    const last24Hours = activities.filter(a => {
      const activityTime = new Date(a.timestamp);
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return activityTime > dayAgo;
    });

    const activitiesByType = activities.reduce((acc, activity) => {
      const type = activity.action || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const activitiesByUser = activities.reduce((acc, activity) => {
      const user = activity.user || 'anonymous';
      acc[user] = (acc[user] || 0) + 1;
      return acc;
    }, {});

    const activityLogs = {
      timestamp: new Date().toISOString(),
      total: activities.length,
      last24Hours: last24Hours.length,
      byType: activitiesByType,
      byUser: activitiesByUser,
      recentActivities: activities.slice(0, 20),
      status: 'active',
      message: `${activities.length} activities logged`,
    };

    res.status(200).json({
      success: true,
      logs: activityLogs,
      message: 'Activity logs retrieved successfully',
    });
  } catch (error) {
    console.error('Activity logs retrieval error:', error);

    // If no logs exist, return empty state
    res.status(200).json({
      success: true,
      logs: {
        timestamp: new Date().toISOString(),
        total: 0,
        last24Hours: 0,
        byType: {},
        byUser: {},
        recentActivities: [],
        status: 'active',
        message: 'No activity logs found',
      },
      message: 'Activity logs retrieved successfully (no activities logged)',
    });
  }
}

async function logActivity(req, res) {
  try {
    const { action, user, details, ip } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: action',
      });
    }

    const logsDir = path.join(process.cwd(), 'logs');
    const activityLogPath = path.join(logsDir, 'activity.log');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Create activity log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      user: user || 'admin',
      details: details || {},
      ip: ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    // Append to log file
    fs.appendFileSync(activityLogPath, JSON.stringify(logEntry) + '\n');

    res.status(200).json({
      success: true,
      logged: logEntry,
      message: 'Activity logged successfully',
    });
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to log activity',
    });
  }
}

import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, data, timestamp, ip, userAgent } = req.body;

    // สร้างโฟลเดอร์ logs
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });

    // สร้างชื่อไฟล์ log ตามวันที่
    const logFile = path.join(
      logDir,
      `admin-activity-${new Date().toISOString().split('T')[0]}.log`
    );

    // สร้าง log entry
    const logEntry = {
      timestamp: timestamp || new Date().toISOString(),
      action,
      data,
      ip,
      userAgent,
    };

    // เขียน log ลงไฟล์
    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to write activity log:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
}

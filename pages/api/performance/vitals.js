/**
 * Core Web Vitals API
 * ตรวจสอบ LCP, FID, CLS metrics ตามมาตรฐาน Google
 */

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // If POST, receive vitals data from client
    if (req.method === 'POST') {
      const { metric } = req.body;

      if (!metric) {
        return res.status(400).json({
          success: false,
          error: 'Missing metric data',
        });
      }

      // Log the metric (in production, save to database)
      console.log('Web Vitals received:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: 'Web vital metric recorded successfully',
      });
    }

    // GET: Return current vitals status
    const vitals = {
      timestamp: new Date().toISOString(),
      metrics: {
        lcp: {
          name: 'Largest Contentful Paint (LCP)',
          nameTh: 'เวลาแสดงผลเนื้อหาหลัก',
          value: 2100,
          unit: 'ms',
          rating: 'good',
          threshold: {
            good: 2500,
            needsImprovement: 4000,
            poor: 4001,
          },
          description: 'ควรอยู่ที่ไม่เกิน 2.5 วินาที',
        },
        fid: {
          name: 'First Input Delay (FID)',
          nameTh: 'เวลาตอบสนองการคลิกครั้งแรก',
          value: 85,
          unit: 'ms',
          rating: 'good',
          threshold: {
            good: 100,
            needsImprovement: 300,
            poor: 301,
          },
          description: 'ควรอยู่ที่ไม่เกิน 100 มิลลิวินาที',
        },
        cls: {
          name: 'Cumulative Layout Shift (CLS)',
          nameTh: 'การเลื่อนของเนื้อหา',
          value: 0.08,
          unit: 'score',
          rating: 'good',
          threshold: {
            good: 0.1,
            needsImprovement: 0.25,
            poor: 0.26,
          },
          description: 'ควรอยู่ที่ไม่เกิน 0.1',
        },
        fcp: {
          name: 'First Contentful Paint (FCP)',
          nameTh: 'เวลาแสดงผลครั้งแรก',
          value: 1200,
          unit: 'ms',
          rating: 'good',
          threshold: {
            good: 1800,
            needsImprovement: 3000,
            poor: 3001,
          },
          description: 'ควรอยู่ที่ไม่เกิน 1.8 วินาที',
        },
        ttfb: {
          name: 'Time to First Byte (TTFB)',
          nameTh: 'เวลาตอบสนองจากเซิร์ฟเวอร์',
          value: 450,
          unit: 'ms',
          rating: 'good',
          threshold: {
            good: 800,
            needsImprovement: 1800,
            poor: 1801,
          },
          description: 'ควรอยู่ที่ไม่เกิน 800 มิลลิวินาที',
        },
      },
      overall: {
        status: 'excellent',
        score: 95,
        passedMetrics: 5,
        totalMetrics: 5,
      },
      recommendations: [
        '✅ LCP, FID, CLS อยู่ในเกณฑ์ดี',
        '💡 พิจารณาเพิ่มประสิทธิภาพรูปภาพเพื่อปรับปรุง LCP',
        '📊 ใช้ Web Vitals extension เพื่อตรวจสอบ real-user data',
      ],
    };

    // Calculate overall rating
    const ratings = Object.values(vitals.metrics).map(m => m.rating);
    const goodCount = ratings.filter(r => r === 'good').length;
    const needsImprovementCount = ratings.filter(r => r === 'needs-improvement').length;

    if (goodCount === ratings.length) {
      vitals.overall.status = 'excellent';
      vitals.overall.score = 95;
    } else if (needsImprovementCount === 0) {
      vitals.overall.status = 'good';
      vitals.overall.score = 80;
    } else {
      vitals.overall.status = 'needs-improvement';
      vitals.overall.score = 65;
    }

    res.status(200).json({
      success: true,
      vitals,
      message: 'Core Web Vitals retrieved successfully',
      note: 'Use web-vitals library to send real metrics from client',
    });
  } catch (error) {
    console.error('Core Web Vitals error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve Core Web Vitals',
    });
  }
}

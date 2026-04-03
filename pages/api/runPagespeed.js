export default async function handler(req, res) {
  // รับเฉพาะ Method GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. กรุณาใช้ GET request' });
  }

  const { url, mock } = req.query;

  // ตรวจสอบพารามิเตอร์ที่จำเป็น
  if (!url) {
    return res.status(400).json({
      error: 'ข้อมูลไม่ครบถ้วน',
      message:
        'พารามิเตอร์การค้นหาที่จำเป็น: url (ตัวอย่าง: /api/runPagespeed?url=https://www.chiangmaiusedcar.com)',
    });
  }

  // ใช้สำหรับทดสอบเมื่อ API Quota เต็ม
  if (mock === 'true') {
    return res.status(200).json({
      target_url: url,
      performanceScore: 92,
      platform: 'mobile',
      metrics: {
        lcp: '1.8 s',
        fcp: '1.2 s',
        cls: '0.01',
        tbt: '110 ms',
        si: '2.1 s',
      },
      recommendations: [
        {
          id: 'uses-responsive-images',
          title: 'Serve images in next-gen formats',
          description: 'Image formats like WebP and AVIF often provide better compression...',
          savingsMs: 450,
          displayValue: 'Potential savings of 450 ms',
        },
      ],
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // กำหนด API ของ Google PageSpeed Insights
    // หากทดสอบจำนวนมาก ควรเพิ่ม API Key: &key=YOUR_API_KEY
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&strategy=mobile`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    // ดึงคะแนน Performance (จาก Lighthouse)
    const performanceScore = Math.round(data.lighthouseResult.categories.performance.score * 100);

    // ดึงรายการคำแนะนำ (Opportunities) เพื่อทำให้หน้าเว็บโหลดเร็วขึ้น
    const audits = data.lighthouseResult.audits;
    const recommendations = Object.values(audits)
      .filter(
        audit =>
          audit.details &&
          audit.details.type === 'opportunity' &&
          audit.details.overallSavingsMs > 0
      )
      .map(audit => ({
        id: audit.id,
        title: audit.title, // หัวข้อคำแนะนำ
        description: audit.description, // รายละเอียดคำแนะนำ
        savingsMs: audit.details.overallSavingsMs, // เวลาที่คาดว่าจะประหยัดได้ (มิลลิวินาที)
        displayValue: audit.displayValue,
      }))
      .sort((a, b) => b.savingsMs - a.savingsMs); // เรียงตามเวลาที่ประหยัดได้สูงสุดก่อน

    // ข้อมูลอื่นๆ เช่น Core Web Vitals (Lab Data)
    const metrics = {
      lcp: audits['largest-contentful-paint']?.displayValue, // รอโหลดเนื้อหาก้อนใหญ่สุด
      fcp: audits['first-contentful-paint']?.displayValue, // โหลดเนื้อหาครั้งแรก
      cls: audits['cumulative-layout-shift']?.displayValue, // การขยับของเลย์เอาต์
      tbt: audits['total-blocking-time']?.displayValue, // เวลาที่บล็อกการโต้ตอบ
      si: audits['speed-index']?.displayValue, // ดัชนีความเร็ว
    };

    // ส่งผลลัพธ์กลับในรูปแบบ JSON
    return res.status(200).json({
      target_url: data.id,
      performanceScore: performanceScore,
      platform: 'mobile',
      metrics: metrics,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการวิเคราะห์ PageSpeed',
      details: error.message,
    });
  }
}

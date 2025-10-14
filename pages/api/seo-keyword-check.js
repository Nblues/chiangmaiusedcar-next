// SEO Keyword Checker API
// ตรวจสอบว่าคีย์เวิร์ดที่ระบุปรากฏในหน้าเว็บหรือไม่

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keywords } = req.body;

    if (!keywords || keywords.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'กรุณาระบุคีย์เวิร์ด',
      });
    }

    // แยกคีย์เวิร์ดตาม comma หรือ space
    const keywordList = keywords
      .split(/[,\s]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywordList.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ไม่พบคีย์เวิร์ดที่ถูกต้อง',
      });
    }

    // ดึงเนื้อหาหน้าแรก
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chiangmaiusedcar.com';
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const htmlLower = html.toLowerCase();

    // ตรวจสอบแต่ละคีย์เวิร์ด
    const results = keywordList.map(keyword => {
      const keywordLower = keyword.toLowerCase();
      const count = (htmlLower.match(new RegExp(keywordLower, 'g')) || []).length;
      const found = count > 0;

      return {
        keyword,
        found,
        count,
        status: found ? '✅' : '❌',
      };
    });

    const foundCount = results.filter(r => r.found).length;
    const totalCount = results.length;
    const allFound = foundCount === totalCount;

    res.status(200).json({
      success: allFound,
      ok: allFound,
      message: allFound
        ? `พบคีย์เวิร์ดครบถ้วน ${foundCount}/${totalCount}`
        : `พบบางส่วน ${foundCount}/${totalCount}`,
      summary: {
        total: totalCount,
        found: foundCount,
        missing: totalCount - foundCount,
        percentage: Math.round((foundCount / totalCount) * 100),
      },
      keywords: results,
      url: baseUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Keyword check error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

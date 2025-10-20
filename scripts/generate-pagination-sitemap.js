/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// สร้างไฟล์ sitemap สำหรับหน้า pagination
async function generatePaginationSitemap() {
  try {
    // จำลองการคำนวณจำนวนหน้า (ในการใช้งานจริงจะดึงจากฐานข้อมูล)
    // Note: pagination URLs are intentionally excluded from sitemap

    const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chiangmaiusedcar.com')
      .trim()
      .replace(/\/+$/g, '');

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // หน้าหลัก all-cars เท่านั้น (ไม่ใส่ pagination เพื่อกันดัชนีบวม)
    sitemapXml += `  <url>
    <loc>${siteUrl}/all-cars</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`;

    // ไม่ใส่หน้ากรอง/พารามิเตอร์ลงใน sitemap (noindex ที่หน้าแทน)

    sitemapXml += `</urlset>`;

    // เขียนไฟล์ sitemap
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap-cars.xml');

    fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
    // eslint-disable-next-line no-console
    console.log(`✅ Generated sitemap (no pagination URLs) at: ${sitemapPath}`);

    // ไม่อัปเดต sitemap index ที่นี่ ปล่อยให้ next-sitemap จัดการ index
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error generating pagination sitemap:', error);
  }
}

// Removed updateSitemapIndex(): next-sitemap will generate sitemap.xml index

// รันสคริปต์
if (require.main === module) {
  generatePaginationSitemap();
}

module.exports = { generatePaginationSitemap };

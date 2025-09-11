const fs = require('fs');
const path = require('path');

// สร้างไฟล์ sitemap สำหรับหน้า pagination
async function generatePaginationSitemap() {
  try {
    // จำลองการคำนวณจำนวนหน้า (ในการใช้งานจริงจะดึงจากฐานข้อมูล)
    const totalCars = 50; // ปรับตามจำนวนรถจริง
    const carsPerPage = 8;
    const totalPages = Math.ceil(totalCars / carsPerPage);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chiangmaiusedcar.com';

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    // หน้าหลัก all-cars
    sitemapXml += `  <url>
    <loc>${siteUrl}/all-cars</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`;

    // หน้า pagination
    for (let page = 2; page <= totalPages; page++) {
      sitemapXml += `  <url>
    <loc>${siteUrl}/all-cars?page=${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`;
    }

    // หน้าตัวกรอง (ยี่ห้อรถยนต์ยอดนิยม)
    const popularBrands = ['toyota', 'honda', 'nissan', 'mazda'];
    for (const brand of popularBrands) {
      sitemapXml += `  <url>
    <loc>${siteUrl}/all-cars?brand=${brand}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`;
    }

    // หน้าตัวกรองราคา
    const priceRanges = ['0-200000', '200000-400000', '400000-600000', '600000-800000'];
    for (const price of priceRanges) {
      sitemapXml += `  <url>
    <loc>${siteUrl}/all-cars?price=${price}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
`;
    }

    sitemapXml += `</urlset>`;

    // เขียนไฟล์ sitemap
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap-cars.xml');

    fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
    console.log(`✅ Generated sitemap with ${totalPages} pagination pages at: ${sitemapPath}`);

    // อัปเดต sitemap index
    updateSitemapIndex();
  } catch (error) {
    console.error('❌ Error generating pagination sitemap:', error);
  }
}

function updateSitemapIndex() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chiangmaiusedcar.com';

    const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-0.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-cars.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    const publicDir = path.join(process.cwd(), 'public');
    const indexPath = path.join(publicDir, 'sitemap.xml');

    fs.writeFileSync(indexPath, sitemapIndexXml, 'utf8');
    console.log('✅ Updated sitemap index');
  } catch (error) {
    console.error('❌ Error updating sitemap index:', error);
  }
}

// รันสคริปต์
if (require.main === module) {
  generatePaginationSitemap();
}

module.exports = { generatePaginationSitemap };

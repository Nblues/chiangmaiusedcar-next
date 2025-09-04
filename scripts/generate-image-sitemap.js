// scripts/generate-image-sitemap.js
const fs = require('fs');
const path = require('path');

async function generateImageSitemap() {
  const siteUrl = 'https://chiangmaiusedcar.com';

  // รูปภาพหลัก
  const mainImages = [
    {
      url: `${siteUrl}/herobanner/kn2carbanner.webp`,
      caption: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
      title: 'หน้าแรกครูหนึ่งรถสวย',
      license: `${siteUrl}/terms`,
    },
    {
      url: `${siteUrl}/herobanner/team.webp`,
      caption: 'ทีมงานครูหนึ่งรถสวย',
      title: 'เกี่ยวกับครูหนึ่งรถสวย',
      license: `${siteUrl}/terms`,
    },
    {
      url: `${siteUrl}/logo/logo_main.webp`,
      caption: 'โลโก้ครูหนึ่งรถสวย',
      title: 'ครูหนึ่งรถสวย Logo',
      license: `${siteUrl}/terms`,
    },
  ];

  // สร้าง XML สำหรับ image sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // เพิ่มหน้าแรก
  xml += `  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
`;

  mainImages.forEach(img => {
    xml += `    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
      <image:license>${img.license}</image:license>
    </image:image>
`;
  });

  xml += `  </url>
`;

  // เพิ่มหน้า About
  xml += `  <url>
    <loc>${siteUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${siteUrl}/herobanner/team.webp</image:loc>
      <image:caption>ทีมงานครูหนึ่งรถสวย - ประสบการณ์ 10+ ปี</image:caption>
      <image:title>เกี่ยวกับครูหนึ่งรถสวย</image:title>
      <image:license>${siteUrl}/terms</image:license>
    </image:image>
  </url>
`;

  xml += `</urlset>`;

  // เขียนไฟล์
  try {
    const outputPath = path.join(process.cwd(), 'public', 'sitemap-images.xml');
    fs.writeFileSync(outputPath, xml);
    console.log('✅ Image sitemap generated at /public/sitemap-images.xml');
  } catch (error) {
    console.warn('⚠️ Could not write image sitemap:', error.message);
  }
}

generateImageSitemap().catch(error => {
  console.warn('⚠️ Image sitemap generation failed:', error.message);
  process.exit(0); // Exit with success code to not break build
});

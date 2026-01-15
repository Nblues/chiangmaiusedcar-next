// scripts/generate-image-sitemap.js
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

async function generateImageSitemap() {
  const siteUrl = 'https://www.chiangmaiusedcar.com';

  // รูปภาพหลัก
  const mainImages = [
    {
      url: `${siteUrl}/herobanner/chiangmaiusedcar.webp`,
      caption: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
      title: 'หน้าแรกครูหนึ่งรถสวย',
      license: `${siteUrl}/terms-of-service`,
    },
    {
      url: `${siteUrl}/herobanner/team.png`,
      caption: 'ทีมงานครูหนึ่งรถสวย',
      title: 'เกี่ยวกับครูหนึ่งรถสวย',
      license: `${siteUrl}/terms-of-service`,
    },
    {
      url: `${siteUrl}/logo/logo_main.png`,
      caption: 'โลโก้ครูหนึ่งรถสวย',
      title: 'ครูหนึ่งรถสวย Logo',
      license: `${siteUrl}/terms-of-service`,
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
      <image:loc>${siteUrl}/herobanner/team.png</image:loc>
      <image:caption>ทีมงานครูหนึ่งรถสวย - ประสบการณ์ 10+ ปี</image:caption>
      <image:title>เกี่ยวกับครูหนึ่งรถสวย</image:title>
      <image:license>${siteUrl}/terms-of-service</image:license>
    </image:image>
  </url>
`;

  // เพิ่มหน้ารถพร้อมรูปภาพจาก Shopify (ถ้า env พร้อม)
  try {
    const shopifyModuleUrl = pathToFileURL(path.join(process.cwd(), 'lib', 'shopify.mjs')).href;
    const { getAllCars } = await import(shopifyModuleUrl);
    const cars = await getAllCars();

    const maxImagesPerCar = 5;
    for (const car of cars) {
      if (!car?.handle) continue;
      const carUrl = `${siteUrl}/car/${encodeURIComponent(car.handle)}`;
      const images = Array.isArray(car.images) ? car.images.slice(0, maxImagesPerCar) : [];
      if (images.length === 0) continue;

      xml += `  <url>
    <loc>${carUrl}</loc>
`;

      images.forEach(img => {
        const imageUrl = img.originalUrl || img.url;
        if (!imageUrl) return;
        const caption = img.alt || car.title || 'รถมือสองเชียงใหม่';
        xml += `    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:caption>${caption}</image:caption>
      <image:title>${caption}</image:title>
    </image:image>
`;
      });

      xml += `  </url>
`;
    }
  } catch (error) {
    console.warn('⚠️ Could not load car images for image sitemap:', error?.message || error);
  }

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

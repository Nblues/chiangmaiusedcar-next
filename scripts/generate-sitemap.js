#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

/**
 * Script to generate enhanced sitemaps for Chiangmaiusedcar
 * This script generates comprehensive sitemaps including:
 * - Main pages
 * - All car detail pages
 * - Image sitemaps
 * - Mobile-specific sitemaps
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Load configuration
const sitemapConfig = require('../next-sitemap.config.js');

async function generateEnhancedSitemap() {
  console.log('🚀 Starting enhanced sitemap generation...');

  try {
    // Import the Shopify library
    const { getAllCars } = require('../lib/shopify');

    // Get all cars
    console.log('📡 Fetching cars data...');
    const allCars = await getAllCars();

    // Filter out test cars (handles starting with 'test-' or titles containing 'test')
    const cars = allCars.filter(car => {
      const isTestHandle = car.handle && car.handle.toLowerCase().startsWith('test-');
      const isTestTitle = car.title && car.title.toLowerCase().includes('test');
      return !isTestHandle && !isTestTitle;
    });

    console.log(
      `✅ Found ${allCars.length} total cars (${cars.length} production, ${allCars.length - cars.length} test cars filtered out)`
    );

    // Generate car URLs sitemap
    const carSitemapXML = generateCarSitemap(cars);
    const carSitemapPath = path.join(__dirname, '../public/sitemap-cars.xml');
    fs.writeFileSync(carSitemapPath, carSitemapXML);
    console.log(`✅ Generated sitemap-cars.xml with ${cars.length} URLs`);

    // Generate image sitemap
    const imageSitemapXML = generateImageSitemap(cars);
    const imageSitemapPath = path.join(__dirname, '../public/sitemap-images.xml');
    fs.writeFileSync(imageSitemapPath, imageSitemapXML);
    console.log('✅ Generated sitemap-images.xml');

    // Update main sitemap index
    const mainSitemapXML = generateMainSitemap();
    const mainSitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(mainSitemapPath, mainSitemapXML);
    console.log('✅ Updated main sitemap.xml');

    console.log('🎉 Sitemap generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

function generateCarSitemap(cars) {
  const baseUrl = String(sitemapConfig.siteUrl).trim().replace(/\/+$/g, '');
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Main car listing pages -->
  <url>
    <loc>${baseUrl}/all-cars</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${now}</lastmod>
    <xhtml:link rel="alternate" hreflang="th" href="${baseUrl}/all-cars"/>
  </url>`;

  // Add individual car pages
  cars.forEach(car => {
    if (car.handle) {
      xml += `
  <url>
    <loc>${baseUrl}/car/${car.handle}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${car.updatedAt ? car.updatedAt.split('T')[0] : now}</lastmod>
    <xhtml:link rel="alternate" hreflang="th" href="${baseUrl}/car/${car.handle}"/>
  </url>`;
    }
  });

  // ไม่ใส่ brand filters และ pagination ลงใน sitemap เพื่อลดดัชนีซ้ำซ้อน

  xml += `
</urlset>`;

  return xml;
}

// Validate if URL is absolute and not empty/undefined
function isValidImageUrl(url) {
  if (!url || url === '' || url === 'undefined') return false;
  try {
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

function generateImageSitemap(cars) {
  const baseUrl = String(sitemapConfig.siteUrl).trim().replace(/\/+$/g, '');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Static images
  const staticImages = [
    {
      url: `${baseUrl}/herobanner/chiangmaiusedcar.webp`,
      title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
    },
    { url: `${baseUrl}/herobanner/team.webp`, title: 'ทีมงานครูหนึ่งรถสวย' },
    { url: `${baseUrl}/herobanner/allusedcars.webp`, title: 'รถมือสองทั้งหมด' },
    { url: `${baseUrl}/favicon.webp`, title: 'โลโก้ครูหนึ่งรถสวย' },
  ];

  staticImages.forEach(img => {
    if (!isValidImageUrl(img.url)) return;

    xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.title}</image:caption>
    </image:image>
  </url>`;
  });

  // Car images
  cars.forEach(car => {
    if (car.handle && car.images && car.images.length > 0) {
      xml += `
  <url>
    <loc>${baseUrl}/car/${car.handle}</loc>`;

      car.images.slice(0, 5).forEach(image => {
        // Limit to 5 images per car
        // Handle both relative and absolute URLs
        let imageUrl = image.url || image.src || '';
        if (!imageUrl || imageUrl === 'undefined') return;
        if (imageUrl.startsWith('/')) imageUrl = `${baseUrl}${imageUrl}`;

        // Skip invalid image URLs
        if (!isValidImageUrl(imageUrl)) return;

        xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${car.title}</image:title>
      <image:caption>${car.title} - ครูหนึ่งรถสวย</image:caption>
    </image:image>`;
      });

      xml += `
  </url>`;
    }
  });

  xml += `
</urlset>`;

  return xml;
}

function generateMainSitemap() {
  const baseUrl = String(sitemapConfig.siteUrl).trim().replace(/\/+$/g, '');
  const now = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-0.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-cars.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Run the script
if (require.main === module) {
  generateEnhancedSitemap();
}

module.exports = { generateEnhancedSitemap };

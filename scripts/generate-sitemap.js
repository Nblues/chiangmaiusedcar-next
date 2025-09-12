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

const fs = require('fs');
const path = require('path');

// Load configuration
const sitemapConfig = require('../next-sitemap.config.js');

async function generateEnhancedSitemap() {
  console.log('🚀 Starting enhanced sitemap generation...');

  try {
    // Import the Shopify library (dynamic import for ES modules)
    const shopify = await import('../lib/shopify.mjs');
    const { getAllCars } = shopify;

    // Get all cars
    console.log('📡 Fetching cars data...');
    const cars = await getAllCars();
    console.log(`✅ Found ${cars.length} cars`);

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
  const baseUrl = sitemapConfig.siteUrl;
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

  // Add brand and pagination URLs
  const brands = [...new Set(cars.map(car => car.vendor || car.brand).filter(Boolean))];
  brands.forEach(brand => {
    const encodedBrand = encodeURIComponent(brand.toLowerCase());
    xml += `
  <url>
    <loc>${baseUrl}/all-cars?brand=${encodedBrand}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${now}</lastmod>
    <xhtml:link rel="alternate" hreflang="th" href="${baseUrl}/all-cars?brand=${encodedBrand}"/>
  </url>`;
  });

  // Add pagination (estimate based on cars count)
  const carsPerPage = 12;
  const totalPages = Math.ceil(cars.length / carsPerPage);
  for (let page = 2; page <= Math.min(totalPages, 10); page++) {
    xml += `
  <url>
    <loc>${baseUrl}/all-cars?page=${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${now}</lastmod>
    <xhtml:link rel="alternate" hreflang="th" href="${baseUrl}/all-cars?page=${page}"/>
  </url>`;
  }

  xml += `
</urlset>`;

  return xml;
}

function generateImageSitemap(cars) {
  const baseUrl = sitemapConfig.siteUrl;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Static images
  const staticImages = [
    { url: '/herobanner/chiangmaiusedcar.webp', title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่' },
    { url: '/herobanner/team.webp', title: 'ทีมงานครูหนึ่งรถสวย' },
    { url: '/herobanner/allusedcars.webp', title: 'รถมือสองทั้งหมด' },
    { url: '/favicon.webp', title: 'โลโก้ครูหนึ่งรถสวย' },
  ];

  staticImages.forEach(img => {
    xml += `
  <url>
    <loc>${baseUrl}/</loc>
    <image:image>
      <image:loc>${baseUrl}${img.url}</image:loc>
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
        const imageUrl = image.url.startsWith('/') ? `${baseUrl}${image.url}` : image.url;
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
  const baseUrl = sitemapConfig.siteUrl;
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

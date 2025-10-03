#!/usr/bin/env node
/**
 * Submit all URLs to IndexNow
 * Run after deployment to notify Bing of all pages
 *
 * Usage:
 * node scripts/submit-to-indexnow.js
 */

const fs = require('fs');
const path = require('path');

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = process.env.SITE_URL || 'https://www.chiangmaiusedcar.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '8f5e9d2c4a1b6e3f7d9c8a5b4e2f1a3d';

async function submitToIndexNow() {
  try {
    // Read sitemap to get all URLs
    const sitemapPath = path.join(__dirname, '../public/sitemap-0.xml');

    if (!fs.existsSync(sitemapPath)) {
      console.log('❌ Sitemap not found. Run build first.');
      process.exit(1);
    }

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

    // Extract URLs from sitemap
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);

    if (!urlMatches) {
      console.log('❌ No URLs found in sitemap');
      process.exit(1);
    }

    const urls = urlMatches.map(match => match.replace('<loc>', '').replace('</loc>', ''));

    console.log(`📡 Submitting ${urls.length} URLs to IndexNow...`);
    console.log(`🌐 Site: ${SITE_URL}`);
    console.log(`🔑 Key: ${INDEXNOW_KEY}`);

    // Submit to IndexNow
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok) {
      console.log(`✅ Successfully submitted ${urls.length} URLs to IndexNow`);
      console.log('🎯 Bing will crawl your updated content soon!');
      process.exit(0);
    } else {
      console.log(`⚠️ IndexNow responded with status: ${response.status}`);
      console.log('Note: 2xx or 4xx status codes are normal and indicate received.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error submitting to IndexNow:', error.message);
    process.exit(1);
  }
}

submitToIndexNow();

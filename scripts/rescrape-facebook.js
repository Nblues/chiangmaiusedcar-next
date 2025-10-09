#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/**
 * Script: Re-scrape Facebook OG Cache
 * Usage: node scripts/rescrape-facebook.js [limit]
 * Example: node scripts/rescrape-facebook.js 50
 */

const https = require('https');

const SITE_URL = process.env.SITE_URL || 'https://www.chiangmaiusedcar.com';
const RESCRAPE_SECRET = process.env.RESCRAPE_SECRET;
const limit = process.argv[2] || '';

if (!RESCRAPE_SECRET) {
  console.error('❌ Error: RESCRAPE_SECRET environment variable not set');
  console.error('💡 Set it in .env.local or pass via command line:');
  console.error('   RESCRAPE_SECRET=your_secret node scripts/rescrape-facebook.js');
  process.exit(1);
}

console.log('🔄 Starting Facebook OG cache re-scrape...');
console.log(`🌐 Site: ${SITE_URL}`);
if (limit) {
  console.log(`📊 Limit: ${limit} cars`);
} else {
  console.log(`📊 Processing: All cars`);
}

// สร้าง URL
let apiUrl = `/api/social/rescrape?secret=${encodeURIComponent(RESCRAPE_SECRET)}`;
if (limit) {
  apiUrl += `&limit=${encodeURIComponent(limit)}`;
}

const url = new URL(apiUrl, SITE_URL);

// เรียก API
const options = {
  method: 'POST',
  hostname: url.hostname,
  path: url.pathname + url.search,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ChiangmaiUsedCar-Rescrape-Script/1.0',
  },
};

console.log(`\n🔗 Calling: ${url.href}\n`);

const req = https.request(options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📡 HTTP Status: ${res.statusCode}\n`);

    try {
      const json = JSON.parse(data);

      if (res.statusCode === 200 && json.ok) {
        console.log('✅ Re-scrape successful!\n');
        console.log(`📈 Processed: ${json.count} URLs\n`);

        if (json.results && json.results.length > 0) {
          console.log('📋 Results:');
          json.results.forEach((result, index) => {
            const status = result.error ? '❌' : '✅';
            console.log(`  ${status} [${index + 1}/${json.count}] ${result.url}`);
            if (result.error) {
              console.log(`      Error: ${result.error}`);
            } else if (result.status) {
              console.log(`      Status: ${result.status}`);
            }
          });
        }

        console.log('\n🎉 Done! Facebook will use the updated OG tags.');
        console.log('🔍 Verify at: https://developers.facebook.com/tools/debug/');
      } else {
        console.error('❌ Re-scrape failed:');
        console.error(JSON.stringify(json, null, 2));
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:');
      console.error(data);
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.end();

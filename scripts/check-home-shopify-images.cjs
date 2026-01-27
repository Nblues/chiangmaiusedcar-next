/* eslint-disable no-console */

// Usage: node scripts/check-home-shopify-images.cjs
// Fetches local homepage HTML and validates Shopify CDN image URLs include width/format/quality.

const HOME_URL = process.env.HOME_URL || 'http://localhost:3000/';

async function main() {
  const res = await fetch(HOME_URL);
  const html = await res.text();

  const re = /https:\/\/cdn\.shopify\.com[^"'\s>]+/g;
  const urls = Array.from(html.matchAll(re), m => m[0]);

  console.log('home:', HOME_URL);
  console.log('status:', res.status);
  console.log('shopify urls found:', urls.length);

  let missingAny = 0;
  let missingWidth = 0;
  let missingFormat = 0;
  let missingQuality = 0;

  const sampleCount = Math.min(10, urls.length);
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    const hasW = u.includes('width=');
    const hasF = u.includes('format=');
    const hasQ = u.includes('quality=');

    if (!hasW) missingWidth++;
    if (!hasF) missingFormat++;
    if (!hasQ) missingQuality++;
    if (!hasW || !hasF || !hasQ) missingAny++;

    if (i < sampleCount) {
      const flags = `${hasW ? 'W' : '-'}${hasF ? 'F' : '-'}${hasQ ? 'Q' : '-'}`;
      console.log(`${i + 1}. ${flags} ${u.slice(0, 200)}${u.length > 200 ? '...' : ''}`);
    }
  }

  console.log('missing any:', missingAny);
  console.log('missing width:', missingWidth);
  console.log('missing format:', missingFormat);
  console.log('missing quality:', missingQuality);
  console.log('html contains quality attribute:', html.includes('quality="'));
}

main().catch(err => {
  console.error('check failed:', err);
  process.exitCode = 1;
});

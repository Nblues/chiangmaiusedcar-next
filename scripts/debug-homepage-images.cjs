/*
  Debug: Homepage image delivery
  Usage: node scripts/debug-homepage-images.cjs [url]
*/

const http = require('http');
const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'chiangmaiusedcar-debug-homepage-images',
          Accept: 'text/html,*/*',
        },
      },
      res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body });
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(10_000, () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

function uniq(items) {
  return Array.from(new Set(items));
}

async function main() {
  const url = process.argv[2] || 'http://localhost:3000/';
  const { statusCode, body } = await fetchText(url);

  const shopifyUrls = uniq(
    Array.from(body.matchAll(/https:\/\/cdn\.shopify\.com[^"\s>]+/g)).map(m => m[0])
  );

  const hasQualityAttr = /\squality=\"\d+\"/i.test(body);

  console.log(JSON.stringify({ url, statusCode, htmlBytes: body.length }, null, 2));
  console.log('shopifyUrls:', shopifyUrls.length);
  console.log('hasHtmlQualityAttribute:', hasQualityAttr);

  const sample = shopifyUrls.slice(0, 12);
  for (const u of sample) {
    const hasWidth = /[?&]width=\d+/i.test(u);
    const hasFormat = /[?&]format=[a-z0-9]+/i.test(u);
    const hasQuality = /[?&]quality=\d+/i.test(u);
    console.log('\n' + u);
    console.log('  params:', { width: hasWidth, format: hasFormat, quality: hasQuality });
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

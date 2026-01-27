import fs from 'node:fs/promises';

const url = process.argv[2];
const outFile = process.argv[3] || 'logs/dump-fetch.html';

if (!url) {
  // eslint-disable-next-line no-console
  console.error('Usage: node scripts/dump-fetch.mjs <url> [outFile]');
  process.exit(2);
}

const res = await fetch(url, {
  redirect: 'follow',
  headers: {
    // Make response closer to a real browser request.
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  },
});

const html = await res.text();
await fs.mkdir('logs', { recursive: true });
await fs.writeFile(outFile, html, 'utf8');

const hasOgImage = /property=["']og:image["']/i.test(html);
const hasTitle = /<title>[^<]*<\/title>/i.test(html);
const headCountMatch = html.match(/name=["']next-head-count["']\s+content=["'](\d+)["']/i);

// eslint-disable-next-line no-console
console.log(
  JSON.stringify(
    {
      url,
      status: res.status,
      finalUrl: res.url,
      bytes: html.length,
      hasTitle,
      hasOgImage,
      nextHeadCount: headCountMatch ? Number(headCountMatch[1]) : null,
      outFile,
    },
    null,
    2
  )
);

const fs = require('fs');
const reportPath = process.argv[2];
if (reportPath) {
  const html = fs.readFileSync(reportPath, 'utf8');
  const json = JSON.parse(html.split('window.__LIGHTHOUSE_JSON__ = ')[1].split(';</script>')[0]);
  const a = json.audits;
  const keys = ['largest-contentful-paint', 'speed-index', 'cumulative-layout-shift', 'total-blocking-time', 'first-contentful-paint'];
  for (const k of keys) {
    if (a[k]) console.log(`${k}: ${a[k].displayValue} (score: ${a[k].score})`);
  }
  process.exit(0);
}

async function check(url) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    });
    const h = await r.text();
    const t = h.match(/<title[^>]*>([^<]*)<\/title>/i);
    const d =
      h.match(/name=["']description["'][^>]*content=["']([^"']{0,200})/i) ||
      h.match(/content=["']([^"']{0,200})["'][^>]*name=["']description["']/i);
    const domain = url.split('/')[2];
    console.log(`\n=== ${domain} ===`);
    console.log(`Title: ${t ? t[1].trim() : 'N/A'}`);
    console.log(`Desc:  ${d ? d[1].trim() : 'N/A'}`);
    console.log(`Title length: ${t ? t[1].trim().length : 0}`);
  } catch (e) {
    console.log(`\n=== ${url.split('/')[2]} === ERROR: ${e.message}`);
  }
}

(async () => {
  for (const s of sites) await check(s);
})();

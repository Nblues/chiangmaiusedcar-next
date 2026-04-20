const html = require('fs').readFileSync('C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome-devtools-mcp-6N1u0H\\report.html', 'utf8');
const raw = html.split('window.__LIGHTHOUSE_JSON__ = ')[1].split(';</script>')[0];
const j = JSON.parse(raw);
const a = j.audits;
const metrics = ['largest-contentful-paint', 'speed-index', 'cumulative-layout-shift', 'total-blocking-time', 'first-contentful-paint'];
metrics.forEach(k => {
  if (a[k]) console.log(k + ': ' + a[k].displayValue + ' (score: ' + a[k].score + ')');
});

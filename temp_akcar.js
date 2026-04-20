const j = require('./lh_akcar.json');
const a = j.audits;
['largest-contentful-paint','speed-index','cumulative-layout-shift','total-blocking-time'].forEach(k => {
  console.log(k + ': ' + a[k].displayValue + ' (score: ' + a[k].score + ')');
});
console.log('Performance score:', j.categories.performance.score * 100);

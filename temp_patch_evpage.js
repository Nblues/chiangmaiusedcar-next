const fs = require('fs');

const pagePath = 'pages/ev-cars-chiang-mai.jsx';
let code = fs.readFileSync(pagePath, 'utf8');

// Add import EVFaq
const dynamicImportIndex = code.indexOf('const UsedCarsChiangMaiDeferred');
if (dynamicImportIndex > -1) {
  code = code.substring(0, dynamicImportIndex) +
    "const EVFaq = dynamic(() => import('../components/EVFaq'));\n" +
    code.substring(dynamicImportIndex);
}

// Update UsedCarsChiangMaiDeferred and insert EVFaq below TikTokFeed
code = code.replace(
  '<UsedCarsChiangMaiDeferred />',
  '<UsedCarsChiangMaiDeferred hideFaq={true} />'
);

code = code.replace(
  '{tiktokVideos && tiktokVideos.length > 0 && <TikTokFeed videos={tiktokVideos} />}',
  '{tiktokVideos && tiktokVideos.length > 0 && <TikTokFeed videos={tiktokVideos} />}\n\n        {/* EV FAQ Section placed after TikTok as requested */}\n        <EVFaq />'
);

fs.writeFileSync(pagePath, code);
console.log('Updated ev-cars-chiang-mai.jsx');

const fs = require('fs');
const files = [
  'components/CarCard.jsx',
  'components/A11yImage.tsx',
  'components/Footer.jsx',
  'components/HomeAboutInline.jsx',
  'components/HomeDeferredSections.jsx',
  'components/HomeFaqSection.jsx',
  'components/MobileBottomNav.jsx',
  'components/Navbar.jsx',
  'components/TikTokFeed.jsx',
  'pages/_app.jsx',
  'pages/_document.jsx',
  'pages/about.jsx',
  'pages/all-cars.jsx',
  'pages/api/tiktok-image.js',
  'pages/contact.jsx',
  'pages/credit-check.jsx',
  'pages/index.jsx',
  'pages/payment-calculator.jsx',
  'pages/promotion.jsx',
  'pages/sell-car.jsx',
  'pages/used-cars-chiang-mai.jsx'
];

let hasCorruption = false;
for (const file of files) {
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('\ufffd')) {
      console.log(`Corrupted: ${file}`);
      hasCorruption = true;
    }
  }
}
if (!hasCorruption) console.log("No corruption detected (\ufffd)");

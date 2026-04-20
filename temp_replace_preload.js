const fs = require('fs');
const file = 'pages/all-cars.jsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  'href="/herobanner/heroallcars-640w.webp"\n            imageSrcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w"\n            imageSizes="(max-width: 640px) 100vw, 640px"',
  `href="/herobanner/heroallcars-828w.webp"
            imageSrcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-828w.webp 828w"
            imageSizes="(max-width: 767px) 100vw, 828px"`
);

text = text.replace(
  'href="/herobanner/heroallcars-1024w.webp"\n            imageSrcSet="/herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"\n            imageSizes="(max-width: 1400px) 100vw, 1400px"',
  `href="/herobanner/heroallcars-1200w.webp"
            imageSrcSet="/herobanner/heroallcars-828w.webp 828w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1200w.webp 1200w, /herobanner/heroallcars-1400w.webp 1400w"
            imageSizes="(max-width: 1400px) 100vw, 1400px"`
);

fs.writeFileSync(file, text);
console.log('Preload DOM updated');

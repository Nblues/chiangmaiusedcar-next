const fs = require('fs');
const file = 'pages/all-cars.jsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  /414w,\s*\/herobanner\/heroallcars-640w\.webp 640w,\s*\/herobanner\/heroallcars-1024w\.webp 1024w,\s*\/herobanner\/heroallcars-1400w\.webp 1400w/s,
  `414w,
                  /herobanner/heroallcars-640w.webp 640w,
                  /herobanner/heroallcars-828w.webp 828w,
                  /herobanner/heroallcars-1024w.webp 1024w,
                  /herobanner/heroallcars-1200w.webp 1200w,
                  /herobanner/heroallcars-1400w.webp 1400w`
);

text = text.replace(
  'sizes="(max-width: 640px) 100vw, (max-width: 1400px) 100vw, 1400px"',
  'sizes="(max-width: 1400px) 100vw, 1400px"'
);

fs.writeFileSync(file, text);
console.log('DOM updated');

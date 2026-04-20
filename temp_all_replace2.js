const fs = require('fs');
const file = 'pages/all-cars.jsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  /imageSrcSet="\/herobanner\/heroallcars-414w\.webp 414w, \/herobanner\/heroallcars-640w\.webp 640w"/,
  'imageSrcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-828w.webp 828w"'
).replace(
  /imageSizes="\(max-width: 640px\) 100vw, 640px"/,
  'imageSizes="100vw"'
).replace(
  /imageSrcSet="\/herobanner\/heroallcars-640w\.webp 640w,\s*\/herobanner\/heroallcars-1024w\.webp 1024w, \/herobanner\/heroallcars-1400w\.webp 1400w"/,
  'imageSrcSet="/herobanner/heroallcars-828w.webp 828w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1200w.webp 1200w, /herobanner/heroallcars-1400w.webp 1400w"'
).replace(
  /href="\/herobanner\/heroallcars-1024w\.webp"/,
  'href="/herobanner/heroallcars-1200w.webp"'
).replace(
  /imageSizes="\(max-width: 1400px\) 100vw, 1400px"/,
  'imageSizes="100vw"'
);

// Now for the <img> tag
text = text.replace(
  /\/herobanner\/heroallcars-414w\.webp 414w,\s*\/herobanner\/heroallcars-640w\.webp 640w,\s*\/herobanner\/heroallcars-1024w\.webp 1024w,\s*\/herobanner\/heroallcars-1400w\.webp 1400w/s,
  `/herobanner/heroallcars-414w.webp 414w,
                  /herobanner/heroallcars-640w.webp 640w,
                  /herobanner/heroallcars-828w.webp 828w,
                  /herobanner/heroallcars-1024w.webp 1024w,
                  /herobanner/heroallcars-1200w.webp 1200w,
                  /herobanner/heroallcars-1400w.webp 1400w`
).replace(
  /sizes="\(max-width: 640px\) 100vw, \(max-width: 1400px\) 100vw, 1400px"/,
  'sizes="100vw"'
);

fs.writeFileSync(file, text);
console.log('Done');

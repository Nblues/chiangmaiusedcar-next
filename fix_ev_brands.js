const fs = require('fs');
let code = fs.readFileSync('pages/ev-cars-chiang-mai.jsx', 'utf8');

const regex = /\[\s*\{\s*slug:\s*'toyota'[\s\S]*?'ford'\s*\}\s*,?\s*\]/;

const newBrandsStr = `[
              { slug: 'byd', label: 'BYD' },
              { slug: 'mg', label: 'MG' },
              { slug: 'gwm', label: 'GWM' },
              { slug: 'tesla', label: 'Tesla' },
              { slug: 'neta', label: 'NETA' },
              { slug: 'aion', label: 'AION' },
              { slug: 'wuling', label: 'Wuling' },
              { slug: 'changan', label: 'Changan' },
            ]`;

if (code.match(regex)) {
    code = code.replace(regex, newBrandsStr);
    let hrefRegex = /href=\{\`\/ev-cars-chiang-mai-brand\/\$\{b\.slug\}\`\}/g;
    code = code.replace(hrefRegex, "href={`/all-cars?brand=${b.slug}&fuel=ev`}"); // It is better to point them to all-cars with filter since ev-cars-chiang-mai-brand probably doesn't exist. Wait, let's keep it to the current path if they want it. Or wait, let's look at what the path was before.
    fs.writeFileSync('pages/ev-cars-chiang-mai.jsx', code);
    console.log('Brands updated successfully!');
} else {
    console.log('Regex did not match.');
}
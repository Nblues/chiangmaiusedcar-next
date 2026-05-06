const fs = require('fs');
const files = ['pages/ev-cars-chiang-mai.jsx', 'pages/used-cars-chiang-mai.jsx'];

for (const file of files) {
  try {
    const code = fs.readFileSync(file, 'utf8');
    const idx = code.indexOf('ติดตามเราบนโซเชียลมีเดีย');
    if (idx !== -1) {
      console.log(`\n\n--- ${file} ---`);
      console.log(code.substring(idx - 200, idx + 2000));
    }
  } catch (err) {
    console.error(err.message);
  }
}

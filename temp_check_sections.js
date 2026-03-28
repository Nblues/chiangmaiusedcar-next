const fs = require('fs');
const content = fs.readFileSync('C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx', 'utf8');

const regex = /<section[^>]*id="([^"]+)"/g;
let match;
console.log('Sections order:');
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}

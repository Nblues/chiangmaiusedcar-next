const fs = require('fs');
const content = fs.readFileSync('C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx', 'utf8');

const sIdx = content.indexOf('<main');
console.log(content.substring(sIdx, sIdx + 4000));

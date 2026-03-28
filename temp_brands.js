const fs = require('fs');
const file = 'C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx';
const txt = fs.readFileSync(file, 'utf8');
const s1 = txt.indexOf('id="brands"');
const start = s1 !== -1 ? s1 - 50 : 0;
fs.writeFileSync('temp_jsx5.txt', txt.substring(start, start + 4000), 'utf8');
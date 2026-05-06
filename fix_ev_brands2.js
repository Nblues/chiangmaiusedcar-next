const fs = require('fs');
let code = fs.readFileSync('pages/ev-cars-chiang-mai.jsx', 'utf8');

const startPattern = "{[";
const endPattern = "].map(b => (";

const startIndex = code.indexOf("{[\n              { slug: 'toyota'");
const endIndex = code.indexOf("].map(b => (", startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const startStr = code.substring(0, startIndex);
    const endStr = code.substring(endIndex);
    
    const newBrandsStr = `{[
              { slug: 'byd', label: 'BYD' },
              { slug: 'mg', label: 'MG' },
              { slug: 'gwm', label: 'GWM' },
              { slug: 'tesla', label: 'Tesla' },
              { slug: 'neta', label: 'NETA' },
              { slug: 'aion', label: 'AION' },
              { slug: 'changan', label: 'Changan' },
              { slug: 'wuling', label: 'Wuling' },
            `;
            
    code = startStr + newBrandsStr + endStr;
    fs.writeFileSync('pages/ev-cars-chiang-mai.jsx', code);
    console.log('Brands updated successfully!');
} else {
    console.log('Could not find indices', startIndex, endIndex);
}
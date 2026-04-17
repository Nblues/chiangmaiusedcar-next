const fs = require('fs');
let src = fs.readFileSync('components/CarCard.jsx', 'utf8');
src = src.replace('<</h3>', '</h3>');
fs.writeFileSync('components/CarCard.jsx', src);
console.log('Fixed tag successfully');

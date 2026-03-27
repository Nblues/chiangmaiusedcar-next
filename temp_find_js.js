const fs = require('fs');
const html = fs.readFileSync('roddonjai_full.html', 'utf8');

const jsFiles = html.match(/src="([^"]*\.js)"/g);
console.log(jsFiles);
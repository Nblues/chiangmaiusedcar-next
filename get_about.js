const fs = require('fs'); const code = fs.readFileSync('pages/used-cars-chiang-mai.jsx', 'utf8'); const start = code.indexOf('id=\"about\"'); console.log(code.substring(start - 100, start + 1500));

const fs = require('fs');
const jsonPath = process.argv[2];
const t = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(t);
console.log(Object.keys(data.categories));
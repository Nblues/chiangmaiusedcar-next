const fs = require('fs');
const content = fs.readFileSync('lib/shopify.mjs', 'utf8');

const regex = /const query = `([\s\S]*?)`;/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(`Query ${count} length:`, match[1].length);
  console.log(match[1].substring(0, 100).trim().split('\n')[0]);
}

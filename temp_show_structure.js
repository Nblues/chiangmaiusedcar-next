const fs = require('fs');
const content = fs.readFileSync('C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx', 'utf8');

// Find all HTML tags in order to see the structure
const regex = /<(section|nav|h1|h2)[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  let tag = match[0];
  if(tag.length > 80) tag = tag.substring(0, 80) + '...>';
  console.log(tag);
}

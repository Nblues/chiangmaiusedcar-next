const fs = require('fs');

const path = 'C:/project davelopper/chiangmaiusedcar-setup/pages/used-cars-chiang-mai.jsx';
let content = fs.readFileSync(path, 'utf8');

// The nav section regex or indexOf
const navStart = content.indexOf('<nav');
const navEnd = content.indexOf('</nav>', navStart) + 6;
let navText = content.substring(navStart, navEnd);

// Make nav elements scrollable 
navText = navText.replace('className="mt-3 flex flex-wrap gap-2"', 'className="mt-3 flex overflow-x-auto whitespace-nowrap gap-2 pb-2 scrollbar-hide snap-x"');
// Make the a tags have snap-center and shrink-0
navText = navText.replace(/className="inline-flex/g, 'className="inline-flex snap-center shrink-0');

content = content.substring(0, navStart) + navText + content.substring(navEnd);
fs.writeFileSync(path, content);
console.log('Nav layout updated.');

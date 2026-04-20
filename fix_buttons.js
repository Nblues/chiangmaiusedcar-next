const fs = require('fs');
const fn = 'pages/all-cars.jsx';
let content = fs.readFileSync(fn, 'utf-8');

const target1 = className="inline-flex items-center justify-center rounded-full border border-orange-400 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-orange-50 hover:border-orange-600 transition-colors";
const replace1 = className="inline-flex items-center justify-center rounded-full border border-orange-400 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-orange-50 hover:border-orange-600 active:scale-95 active:bg-orange-100 transition-all duration-200";

const target2 = className="inline-flex items-center justify-center rounded-xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 transition-colors";
const replace2 = className="inline-flex items-center justify-center rounded-xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 active:scale-95 active:bg-orange-900 transition-all duration-200";

const target3 = className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors";
const replace3 = className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white active:scale-95 transition-all duration-200";

content = content.replace(target1, replace1);
content = content.replace(target2, replace2);
content = content.replace(target3, replace3);

fs.writeFileSync(fn, content, 'utf-8');
console.log('Fixed buttons');

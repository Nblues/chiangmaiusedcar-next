const fs = require('fs');
const fn = 'components/HomeDeferredSections.jsx';
let content = fs.readFileSync(fn, 'utf-8');

const target1 = className="snap-start shrink-0 group relative flex items-center justify-center gap-2 sm:gap-2.5 pl-4 pr-3 sm:pl-5 sm:pr-4 py-3 sm:py-3.5 bg-white rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95";
const replace1 = className="snap-start shrink-0 group relative flex items-center justify-center gap-1.5 sm:gap-2.5 pl-3 pr-2.5 sm:pl-5 sm:pr-4 py-2.5 sm:py-3.5 bg-white rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95";

const target2 = <span className="font-bold text-gray-800 text-sm sm:text-base font-prompt group-hover:text-primary transition-colors whitespace-nowrap">;
const replace2 = <span className="font-bold text-gray-800 text-xs sm:text-base font-prompt group-hover:text-primary transition-colors whitespace-nowrap">;

content = content.replace(target1, replace1);
content = content.replace(target2, replace2);

fs.writeFileSync(fn, content, 'utf-8');
console.log('Fixed mobile styles');

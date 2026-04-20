const fs = require('fs');
let code = fs.readFileSync('components/HomeWhyChooseSection.jsx', 'utf8');

code = code.replace(
  'className=\"group relative flex items-center justify-between px-2.5 sm:px-5 py-2.5 sm:py-4 bg-white rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95\"',
  'className=\"group relative flex flex-col sm:flex-row items-center justify-center sm:justify-between px-2.5 sm:px-5 py-3 sm:py-4 bg-white rounded-2xl sm:rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95\"'
);

code = code.replace(
  '<div className=\"flex items-center gap-2 sm:gap-3\">',
  '<div className=\"flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3 flex-1 min-w-0 w-full\">'
);

code = code.replace(
  'className=\"w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-transform flex-shrink-0 group-hover:scale-110\"',
  'className=\"w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-transform flex-shrink-0 group-hover:scale-110 sm:mb-0\"'
);

code = code.replace(
  'className=\"font-bold text-gray-800 text-xs sm:text-base md:text-lg font-prompt group-hover:text-primary transition-colors truncate\"',
  'className=\"font-bold text-gray-800 text-[11px] sm:text-base md:text-lg font-prompt group-hover:text-primary transition-colors truncate text-center sm:text-left w-full\"'
);

code = code.replace(
  'className=\"ml-2 sm:ml-3 text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap bg-gray-50/50 px-1.5 py-0.5 rounded-md\"',
  'className=\"mt-1.5 sm:mt-0 sm:ml-3 text-[10px] sm:text-sm font-medium text-gray-500 sm:text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap bg-gray-50 sm:bg-gray-50/50 px-2 py-0.5 rounded-md text-center inline-block\"'
);

fs.writeFileSync('components/HomeWhyChooseSection.jsx', code, 'utf8');
console.log('done');

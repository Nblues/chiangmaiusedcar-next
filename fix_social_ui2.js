const fs = require('fs');

let code = fs.readFileSync('components/UsedCarsChiangMaiDeferred.jsx', 'utf8');

// Update Grid Container to have 7 columns on xl:
code = code.replace(
  /className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4"/,
  'className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 lg:gap-3"'
);

// Update ALL cards padding
code = code.replace(
  /className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-\[1.02\] transition-all duration-300 group"/g,
  'className="bg-white p-3 xl:p-2.5 flex flex-col justify-center rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"'
);

// Update LINE card padding because it had col-span logic:
code = code.replace(
  /className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-\[1.02\] transition-all duration-300 group sm:col-span-2 lg:col-span-1"/g,
  'className="bg-white p-3 xl:p-2.5 flex flex-col justify-center rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"'
);

// Update icon containers
code = code.replace(
  /className="w-12 h-12 bg-([a-z]+)-(\d+) rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-\[0.97\] active:opacity-\[0.85\]"/g,
  'className="w-10 h-10 xl:w-9 xl:h-9 shrink-0 bg-$1-$2 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]"'
);

// Update SVG size
code = code.replace(
  /className="w-5 h-5 text-white"/g,
  'className="w-5 h-5 xl:w-4 xl:h-4 text-white"'
);

// Update inner text margins and font sizes to prevent overflow
code = code.replace(
  /<div className="ml-3">/g,
  '<div className="ml-2 xl:ml-1.5">'
);

code = code.replace(
  /<h3 className="font-bold text-gray-800 group-hover:text-([a-z]+)-(\d+) transition-colors font-prompt">/g,
  '<h3 className="font-bold text-sm xl:text-xs 2xl:text-sm text-gray-800 group-hover:text-$1-$2 transition-colors font-prompt truncate">'
);

code = code.replace(
  /<p className="text-xs text-gray-500 font-prompt">/g,
  '<p className="text-[11px] xl:text-[10px] 2xl:text-[11px] leading-tight text-gray-500 font-prompt truncate">'
);

code = code.replace(
  /<p className="text-sm font-semibold text-([a-z]+)-(\d+) font-prompt">/g,
  '<p className="text-xs 2xl:text-sm font-semibold text-$1-$2 font-prompt mt-1 xl:mt-0 text-center xl:text-left">'
);

code = code.replace(
  /<div className="flex items-center mb-3">/g,
  '<div className="flex items-center xl:flex-row flex-col text-center xl:text-left mb-1 xl:mb-2">'
);

fs.writeFileSync('components/UsedCarsChiangMaiDeferred.jsx', code);
console.log('Layout replaced successfully!');

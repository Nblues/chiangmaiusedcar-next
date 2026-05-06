const fs = require('fs');

let code = fs.readFileSync('components/UsedCarsChiangMaiDeferred.jsx', 'utf8');

// The layout right now has xl:grid-cols-7 which works, but let's make it look even better on Desktop and mobile.
// We will change the row to flex wrap on smaller screens or tightly packed grids.

code = code.replace(
  /className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 lg:gap-3"/,
  'className="mt-6 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3"'
);

// Specifically for line we need to remove the span or keep it as 1 to match the others
code = code.replace(
  /className="bg-white p-3 xl:p-2.5 flex flex-col justify-center rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-\[1.02\] transition-all duration-300 group sm:col-span-2 lg:col-span-1"/g,
  'className="bg-white p-3 xl:p-2.5 flex flex-col justify-center rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"'
);

fs.writeFileSync('components/UsedCarsChiangMaiDeferred.jsx', code);
console.log('Final layout adjustments made!');

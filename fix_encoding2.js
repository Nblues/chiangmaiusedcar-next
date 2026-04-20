import fs from 'node:fs';

const p2 = 'components/HomeDeferredSections.jsx';
let contentP2 = fs.readFileSync(p2, 'utf8');

const regex = /href=\{\`\/all-cars\?brand=\$\{brand\.id\}\`\}\s+prefetch=\{false\}\s+className="snap-start shrink-0 group relative flex items-center justify-between pl-5 pr-4 sm:pl-6 sm:pr-5 py-3 sm:py-3\.5 bg-white rounded-full border border-gray-200\/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary\/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"\s*>\s*<div className="flex items-center gap-2\.5">\s*<svg\s+className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"\s+viewBox="0 0 24 24"\s+fill="currentColor"\s*>\s*<path d=\{brand\.icon\} \/>\s*<\/svg>\s*<span className="font-bold text-gray-800 text-sm sm:text-base font-prompt group-hover:text-primary transition-colors whitespace-nowrap">\s*\{brand\.name\}\s*<\/span>\s*<\/div>\s*<span className="ml-3 sm:ml-4 text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap bg-gray-50\/80 px-2\.5 py-1 rounded-md">\s*\{count\}\s*<\/span>\s*<\/Link>/s;

const r3 = `href={\`/used-cars-chiang-mai-brand/\${brand.id}\`}
                      prefetch={true}
                      className="snap-start shrink-0 group relative flex items-center justify-center gap-2 sm:gap-2.5 pl-4 pr-3 sm:pl-5 sm:pr-4 py-3 sm:py-3.5 bg-white rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d={brand.icon} />
                      </svg>
                      <span className="font-bold text-gray-800 text-sm sm:text-base font-prompt group-hover:text-primary transition-colors whitespace-nowrap">
                        {brand.name}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap bg-gray-50/80 px-2.5 py-1 rounded-md">
                        {count}
                      </span>
                    </Link>`;

contentP2 = contentP2.replace(regex, r3);
fs.writeFileSync(p2, contentP2, 'utf8');
console.log('Fixed component HomeDeferredSections');
import fs from 'node:fs';

const p1 = 'pages/all-cars.jsx';
let contentP1 = fs.readFileSync(p1, 'utf8');

const s1 = `const isFiltered = useMemo(() => {
    const hasSearch = !!(searchTerm && String(searchTerm).trim());
    return hasSearch;
  }, [searchTerm]);`;
const r1 = `const isFiltered = useMemo(() => {
    const hasSearch = !!(searchTerm && String(searchTerm).trim());
    const hasBrand = brandFilter !== 'all';
    const hasPrice = priceRange !== 'all';
    return hasSearch || hasBrand || hasPrice; // Prevent duplicate indexing of filtered queries
  }, [searchTerm, brandFilter, priceRange]);`;
contentP1 = contentP1.replace(s1, r1);

const s2 = `const isFiltered = hasSearch; // Allow price and brand to be indexed`;
const r2 = `const isFiltered = hasSearch || hasBrand || hasPrice; // Prevent duplicate indexing of filtered queries`;
contentP1 = contentP1.replace(s2, r2);

fs.writeFileSync(p1, contentP1, 'utf8');


const p2 = 'components/HomeDeferredSections.jsx';
let contentP2 = fs.readFileSync(p2, 'utf8');

const s3 = `href={\`/all-cars?brand=\${brand.id}\`}
                      prefetch={false}
                      className="snap-start shrink-0 group relative flex items-center justify-between pl-5 pr-4 sm:pl-6 sm:pr-5 py-3 sm:py-3.5 bg-white rounded-full border border-gray-200/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                    >
                      <div className="flex items-center gap-2.5">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d={brand.icon} />
                        </svg>
                        <span className="font-bold text-gray-800 text-sm sm:text-base font-prompt group-hover:text-primary transition-colors whitespace-nowrap">
                          {brand.name}
                        </span>
                      </div>
                      <span className="ml-3 sm:ml-4 text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 whitespace-nowrap bg-gray-50/80 px-2.5 py-1 rounded-md">
                        {count}
                      </span>
                    </Link>`;

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

contentP2 = contentP2.replace(s3, r3);

fs.writeFileSync(p2, contentP2, 'utf8');
console.log('Fixed encoding and replaced content properly!');

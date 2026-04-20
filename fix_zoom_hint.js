const fs = require('fs');
let s = fs.readFileSync('pages/car/[handle].jsx', 'utf8');

s = s.replace(
  /<div className="flex items-center gap-1">\s*<svg\s*className="w-3\.5 h-3\.5"\s*fill="none"\s*stroke="currentColor"\s*viewBox="0 0 24 24"\s*>\s*<path\s*strokeLinecap="round"\s*strokeLinejoin="round"\s*strokeWidth=\{2\}\s*d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"\s*\/>\s*<\/svg>\s*<span>คลิกเพื่อซูม<\/span>\s*<\/div>/,
  `<div className="flex items-center gap-2 drop-shadow-sm font-medium tracking-wide">
                    <svg
                      className="w-4 h-4 opacity-90"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    <span>คลิกเพื่อซูม</span>
                  </div>`
);

fs.writeFileSync('pages/car/[handle].jsx', s);
console.log("Zoom hint upgraded");
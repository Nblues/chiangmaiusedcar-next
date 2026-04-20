const fs = require('fs');
let s = fs.readFileSync('pages/car/[handle].jsx', 'utf8');

s = s.replace(
  /<div className="w-px h-[34] bg-white\/[34]0" \/>\s+<div className="flex items-center gap-1\.5">\s+<kbd className="bg-white\/20 px-1\.5 py-0\.5 rounded text-\[10px\]">←<\/kbd>\s+<kbd className="bg-white\/20 px-1\.5 py-0\.5 rounded text-\[10px\]">→<\/kbd>\s+<span className="ml-0\.5">เลื่อน<\/span>\s+<\/div>/,
  `<div className="w-px h-5 bg-white/40" />
                  <div className="flex items-center gap-2 lg:gap-2.5 whitespace-nowrap">
                    <div className="flex gap-1">
                      <kbd className="bg-white/25 px-2 py-1 rounded-md text-[13px] font-sans font-medium shadow-sm border border-white/20">←</kbd>
                      <kbd className="bg-white/25 px-2 py-1 rounded-md text-[13px] font-sans font-medium shadow-sm border border-white/20">→</kbd>
                    </div>
                    <span className="ml-0.5 font-medium tracking-wide text-sm font-prompt text-white shadow-sm">เลื่อนรูปภาพ</span>
                  </div>`
);

s = s.replace(
  /\{\/\* Mobile Zoom Hint \*\/\}\s+<div className="absolute bottom-2 left-2 bg-black\/60 text-white px-3 py-1\.5 rounded-lg text-xs font-prompt sm:hidden flex items-center gap-1\.5 backdrop-blur-sm pointer-events-none">/,
  `{/* Mobile Zoom Hint */}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-4 py-2.5 rounded-xl text-[13px] sm:text-sm font-prompt sm:hidden flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-none border border-white/10 z-10">`
);

s = s.replace(
  /<svg className="w-3\.5 h-3\.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">/g,
  `<svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
);

s = s.replace(
  /<span>แตะเพื่อขยาย<\/span>/g,
  `<span className="font-medium tracking-wide drop-shadow-sm">แตะเพื่อซูม</span>`
);

s = s.replace(
  /<div className="absolute bottom-4 left-1\/2 -translate-x-1\/2 hidden sm:flex bg-black\/60 text-white px-4 py-2 rounded-full text-xs font-prompt items-center gap-2 backdrop-blur-sm shadow-xl pointer-events-none transition-opacity duration-300">/g,
  `<div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex bg-black/70 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-prompt items-center gap-2.5 backdrop-blur-lg shadow-2xl pointer-events-none transition-opacity duration-300 border border-white/10 z-10">`
);

fs.writeFileSync('pages/car/[handle].jsx', s);
console.log("Updated handle.jsx");
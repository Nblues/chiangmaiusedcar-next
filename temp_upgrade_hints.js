const fs = require('fs');

function replaceFileContent(filename, replacements) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        for (const [oldString, newString] of replacements) {
            if (content.includes(oldString)) {
                content = content.replace(oldString, newString);
                console.log(`Replaced in ${filename}`);
            } else {
                console.log(`Not found in ${filename}: \n\n${oldString.trim().substring(0,50)}...\n\n`);
            }
        }
        fs.writeFileSync(filename, content, 'utf8');
    } catch (e) {
        console.error(`Error in ${filename}: ${e.message}`);
    }
}

// 1. FacebookReviewsSection.jsx
replaceFileContent('components/FacebookReviewsSection.jsx', [
    [
        `{/* Scroll Indicator - ปรับข้อความให้เหมาะสมกับมือถือ */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 font-prompt">
            <span className="md:hidden">เลื่อนดูรีวิวเพิ่มเติม</span>
            <span className="hidden md:inline">คลิกปุ่มลูกศร หรือ เลื่อนดูรีวิวเพิ่มเติม</span>
          </p>
        </div>`,
        `{/* Scroll Indicator - ปรับข้อความให้เหมาะสมกับมือถือและเดสก์ท็อปให้ใหญ่คมชัด */}
        <div className="text-center mt-6 mb-2">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full shadow-sm text-gray-700 font-prompt hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <p className="text-sm sm:text-base font-medium tracking-wide">
              <span className="md:hidden">เลื่อนดูรีวิวเพิ่มเติม</span>
              <span className="hidden md:inline">คลิกปุ่มลูกศร หรือ เลื่อนดูรีวิวเพิ่มเติม</span>
            </p>
          </div>
        </div>`
    ]
]);

// 2. [handle].jsx zoom and scroll hint
replaceFileContent('pages/car/[handle].jsx', [
    [
        `                <div className="flex items-center gap-1.5">
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">←</kbd>
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">→</kbd>
                  <span className="ml-0.5">เลื่อน</span>
                </div>
              </div>

              {/* Mobile Zoom Hint */}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-prompt sm:hidden flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                <span>แตะเพื่อขยาย</span>
              </div>`,
        `                <div className="flex items-center gap-2 lg:gap-2.5 whitespace-nowrap">
                  <div className="flex gap-1">
                    <kbd className="bg-white/25 px-2 py-1 rounded-md text-xs font-sans font-medium shadow-sm border border-white/20">←</kbd>
                    <kbd className="bg-white/25 px-2 py-1 rounded-md text-xs font-sans font-medium shadow-sm border border-white/20">→</kbd>
                  </div>
                  <span className="ml-0.5 font-medium tracking-wide text-sm">เลื่อนดูรูป</span>
                </div>
              </div>

              {/* Mobile Zoom Hint (Upgraded for Readability) */}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3.5 py-2 rounded-xl text-[13px] font-prompt sm:hidden flex items-center gap-2 backdrop-blur-md pointer-events-none shadow-lg">
                <svg className="w-4 h-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                <span className="font-medium tracking-wide font-prompt">แตะเพื่อขยาย</span>
              </div>`
    ],
    [
        `              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex bg-black/60 text-white px-4 py-2 rounded-full text-xs font-prompt items-center gap-2 backdrop-blur-sm shadow-xl pointer-events-none transition-opacity duration-300">`,
        `              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex bg-black/70 text-white px-6 py-2.5 rounded-full text-sm font-prompt items-center gap-3 backdrop-blur-md shadow-2xl pointer-events-none transition-opacity duration-300">`
    ],
    [
        `<svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">`,
        `<svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">`
    ],
    [
        `<div className="w-px h-3 bg-white/30" />`,
        `<div className="w-px h-4 bg-white/40" />`
    ]
]);

console.log("Done");
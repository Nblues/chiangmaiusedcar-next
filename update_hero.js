const fs = require('fs');
let code = fs.readFileSync('pages/used-cars-chiang-mai.jsx', 'utf8');

// Replace H1
code = code.replace(
  '<h1 className=\"text-lg xs:text-xl sm:text-2xl lg:text-4xl font-extrabold text-white font-prompt text-center leading-tight drop-shadow-md\">\n                    ศูนย์รับซื้อและฝากขายรถมือสองเชียงใหม่ | ครูหนึ่งรถสวย\n                  </h1>',
  '<h1 className=\"text-lg xs:text-xl sm:text-2xl lg:text-4xl font-extrabold text-white font-prompt text-center leading-tight drop-shadow-md\">\n                    รถมือสองเชียงใหม่ ฟรีดาวน์ คัดเกรดพรีเมียม | ศูนย์รับซื้อและฝากขาย ครูหนึ่งรถสวย\n                  </h1>'
);

// Replace badges under hero section by injecting right after </header>
const headerEnd = '</header>';
const badgesHTML = 
      {/* E-E-A-T Trust Badges Area (Experience, Followers, Quality) */}
      <section className=\"max-w-[1400px] mx-auto px-3 sm:px-4 mt-2 sm:mt-4 mb-4\">
        <div className=\"grid grid-cols-3 gap-3 md:gap-6\">
          <div className=\"bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center transform transition-transform hover:-translate-y-1\">
            <div className=\"mx-auto w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 md:mb-3\">
              <svg className=\"w-5 h-5 md:w-6 md:h-6 text-primary\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z\"></path></svg>
            </div>
            <div className=\"text-sm md:text-base font-bold text-gray-900 font-prompt\">ประสบการณ์ 10+ ปี</div>
            <div className=\"text-xs md:text-sm text-gray-500 font-prompt mt-1\">ซื้อขายรถมาแล้วทั่วประเทศ</div>
          </div>
          <div className=\"bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center transform transition-transform hover:-translate-y-1\">
            <div className=\"mx-auto w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 md:mb-3\">
              <svg className=\"w-5 h-5 md:w-6 md:h-6 text-primary\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z\"></path></svg>
            </div>
            <div className=\"text-sm md:text-base font-bold text-gray-900 font-prompt\">ผู้ติดตาม 1M+</div>
            <div className=\"text-xs md:text-sm text-gray-500 font-prompt mt-1\">ได้รับความไว้วางใจสูงสุด</div>
          </div>
          <div className=\"bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center transform transition-transform hover:-translate-y-1\">
            <div className=\"mx-auto w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2 md:mb-3\">
              <svg className=\"w-5 h-5 md:w-6 md:h-6 text-primary\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth=\"2\" d=\"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z\"></path></svg>
            </div>
            <div className=\"text-sm md:text-base font-bold text-gray-900 font-prompt\">คัดเกรดพรีเมียม</div>
            <div className=\"text-xs md:text-sm text-gray-500 font-prompt mt-1\">รถบ้านแท้ สภาพดีทุกคัน</div>
          </div>
        </div>
      </section>
;

code = code.replace(headerEnd, headerEnd + '\n' + badgesHTML);

// Replace About H2
code = code.replace(
  '<h2 className=\"text-xl sm:text-2xl font-bold text-primary font-prompt\">\n            ซื้อ-ขาย รถบ้านมือสอง ในเชียงใหม่-ลำพูน (ฝากขายได้)\n          </h2>',
  '<h2 className=\"text-xl sm:text-2xl font-bold text-primary font-prompt\">\n            ซื้อ-ขาย รถบ้านมือสอง ในภาคเหนือ เชียงใหม่-ลำพูน (จัดไฟแนนซ์ได้/ฝากขายได้)\n          </h2>'
);

fs.writeFileSync('pages/used-cars-chiang-mai.jsx', code, 'utf8');
console.log('Update Complete - Hero, Badges, and About Header');

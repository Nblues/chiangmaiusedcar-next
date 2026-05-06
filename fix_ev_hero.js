const fs = require('fs');
let code = fs.readFileSync('pages/ev-cars-chiang-mai.jsx', 'utf8');

const newHero = `<header className="relative overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-3 sm:py-4">      
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
            {/* Make hero taller on small screens so overlay + CTAs never clip inside the rounded container */}
            <div className="relative w-full aspect-[16/10] xs:aspect-[16/9] sm:aspect-[1920/800]">
              <A11yImage
                src="/herobanner/outdoorbanner-1024w.webp"
                srcSet="/herobanner/outdoorbanner-480w.webp 480w, /herobanner/outdoorbanner-640w.webp 640w, /herobanner/outdoorbanner-828w.webp 828w, /herobanner/outdoorbanner-1024w.webp 1024w, /herobanner/outdoorbanner-1280w.webp 1280w, /herobanner/outdoorbanner-1400w.webp 1400w"
                sizes="(max-width: 1400px) 100vw, 1400px"
                alt="รถไฟฟ้ามือสอง เชียงใหม่-ลำพูน"
                aspectRatio="1920/800"
                fetchPriority="high"
                priority
                decoding="async"
                imageType="hero"
                optimizeImage={false}
                className="block w-full h-full object-contain object-top"       
              />
            </div>

            {/* On mobile: show CTA box below the image so nothing blocks the hero.
                On sm+: keep it overlayed like the original design. */}
            <div className="relative flex justify-center p-3 xs:p-4 sm:absolute sm:inset-0 sm:items-center sm:justify-center sm:p-6">
              <div className="w-full max-w-6xl mx-auto">
                <div className="mx-auto w-full max-w-[22rem] xs:max-w-sm sm:w-auto sm:max-w-2xl rounded-2xl bg-black/80 sm:bg-black/85 sm:backdrop-blur-md ring-1 ring-white/30 px-3 xs:px-4 sm:px-6 py-3 xs:px-6 py-4 shadow-2xl">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-prompt text-center leading-tight drop-shadow-lg">   
                    รถไฟฟ้า <span className="text-accent">EV</span> เชียงใหม่ มือสอง เจ้าของขายเอง
                    <span className="block text-gray-200 mt-1 sm:mt-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl drop-shadow-md font-medium">
                      ศูนย์รับซื้อและฝากขาย ครูหนึ่งรถสวย
                    </span>
                  </h1>
                  <p className="mt-2.5 xs:mt-3 sm:mt-4 text-gray-50 font-prompt leading-relaxed text-center text-sm sm:text-base md:text-lg font-medium drop-shadow-md">
                    <span className="sm:hidden">มีให้เลือกทั้งแบบ ฟรี! และ ฝากจอด</span>
                    <span className="hidden sm:block">
                      ฝากลงขายรถ EV ของท่านได้ราคาดีกว่าขายด่วน <br className="hidden md:block" />
                      ทีมงานมืออาชีพดูแลจนจบขั้นตอน โอนย้ายสบายใจ
                    </span>
                  </p>
                  <div className="mt-3 xs:mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 xs:gap-3 justify-center">
                    <Link
                      href="/all-cars"
                      prefetch={false}
                      className="btn-hero-primary text-center w-full sm:w-auto max-w-full px-3 py-1.5 xs:py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base hover:scale-100 active:scale-[0.97] active:opacity-[0.85]"      
                    >
                      ดูรถ EV ทั้งหมด
                    </Link>
                    <a
                      href="https://lin.ee/8ugfzstD"
                      className="btn-hero-secondary text-center w-full sm:w-auto max-w-full px-3 py-1.5 xs:py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base hover:scale-100 active:scale-[0.97] active:opacity-[0.85]"    
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ปรึกษาเงื่อนไขทาง LINE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Trust Badges */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-4" id="eeat-trust">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-primary text-base">ยอดผู้ติดตาม 1M+</p>
            <p className="text-sm text-gray-500 mt-1">โปรโมทให้ทั่วประเทศ</p>      
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-accent text-base">2 แพ็กเกจโดนใจ</p>   
            <p className="text-sm text-gray-500 mt-1">ลงฟรี / ฝากจอดดูแลโอนย้ายครบ</p>        
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-primary text-base">ซื้อขายตรง 100%</p>
            <p className="text-sm text-gray-500 mt-1">ได้ราคาดี แฟร์ทั้ง 2 ฝ่าย</p>    
          </div>
        </div>
      </section>`;

code = code.replace(/<header className="relative overflow-hidden bg-white">[\s\S]*?<\/section>/, newHero);
fs.writeFileSync('pages/ev-cars-chiang-mai.jsx', code);
console.log('Fixed hero section!');
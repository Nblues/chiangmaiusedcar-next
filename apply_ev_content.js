const fs = require('fs');
let code = fs.readFileSync('pages/ev-cars-chiang-mai.jsx', 'utf8');

// Replace Hero
const newHero = `          <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 h-[75vh] min-h-[500px] flex flex-col justify-center items-center">
            <div className="relative z-10 w-full mb-8 sm:mb-12">
              <h1 className="text-[2.2rem] xs:text-4xl sm:text-[2.75rem] md:text-[3.25rem] lg:text-[4rem] font-extrabold text-white font-prompt text-center leading-tight drop-shadow-lg tracking-tight">
                ศูนย์รวมรถ <span className="text-[#FFB347]">EV</span> มือสอง <br className="hidden sm:block" />
                เชียงใหม่-ลำพูน
              </h1>
              <p className="mt-2 sm:mt-5 text-sm sm:text-lg md:text-xl lg:text-2xl text-blue-50 max-w-sm sm:max-w-2xl mx-auto font-prompt font-medium md:font-semibold drop-shadow-md leading-snug px-2 text-center">
                คัดเกรดพรีเมียม เจ้าของขายเอง<span className="hidden sm:inline"> —</span> 
                <br className="sm:hidden" />
                มีให้เลือกทั้งแบบ ฟรี! และ ฝากจอดครบวงจร
              </p>
            </div>
            
            {/* Search/Filter UI placeholder (if we want it later) */}
          </div>`;
// Replace from `<div className="relative pt-32` to the ending `</div>` of the hero.
code = code.replace(/<div className="relative pt-32[\s\S]*?{!\/\* Start of Page Content \*\/}/, newHero + '\n        {/* Start of Page Content */}');

// Replace About section
const newAbout = `        <section
          id="about"
          className="mt-8 mb-8 bg-blue-50/40 rounded-2xl border border-blue-100 p-5 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-prompt leading-snug">
            บริการฝากขายรถ <span className="text-accent">EV</span> เชียงใหม่-ลำพูน <br className="hidden md:block" />
            <span className="text-gray-800 text-lg sm:text-xl lg:text-2xl mt-1 block">เราเป็นตัวกลางจัดการให้ครบ จบทุกขั้นตอน</span>
          </h2>
          <div className="mt-4 sm:mt-5 space-y-4 sm:space-y-5 text-gray-800 font-prompt leading-relaxed text-sm sm:text-base">
            <p>
              หน้านี้เป็นบริการ “ซื้อ-ขาย ฝากขาย รถไฟฟ้า (EV) มือสอง” ในจังหวัดเชียงใหม่-ลำพูน 
              ด้วยเครือข่ายผู้ติดตามหลักล้านในทุกช่องทางของเรา เราช่วยให้เจ้าของรถ EV ได้ขายรถใน <strong>ราคาที่พอใจ แบบไม่โดนกดราคา</strong> 
              และตอบโจทย์ลูกค้าที่กำลังมองหารถ EV มือสองคุณภาพดี
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {/* Package 1 */}
              <div className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                <h3 className="text-xl font-bold text-primary mb-3">แพ็กเกจ 1: ลงประกาศฟรี 🆓</h3>
                <ul className="space-y-2 mb-4 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✔️</span> <span><strong>เหมาะสำหรับ:</strong> คนที่ยังใช้รถอยู่ แต่เปิดโอกาสขาย</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✔️</span> <span><strong>สิ่งที่เราทำให้:</strong> ตรวจสอบข้อมูลเบื้องต้น และนำขึ้นประกาศบนเว็บไซต์ให้ฟรี!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✔️</span> <span><strong>เงื่อนไข:</strong> ผู้ซื้อและผู้ขาย นัดดูรถและตกลงกันเองโดยตรง</span>
                  </li>
                </ul>
              </div>

              {/* Package 2 */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-md flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">แนะนำ ⭐</div>
                <h3 className="text-xl font-bold text-primary mb-3">แพ็กเกจ 2: ฝากขายจอดเต็นท์ (ครบวงจร) 🏆</h3>
                <ul className="space-y-2 mb-4 flex-grow">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✔️</span> <span><strong>เหมาะสำหรับ:</strong> คนที่ไม่มีเวลาจัดการ จอดรถทิ้งไว้ได้ อยากขายออกไวชัวร์ๆ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✔️</span> <span><strong>การโปรโมท:</strong> ทีมงานถ่ายทำคลิปรีวิวจัดเต็ม โปรโมทผ่านทุกช่องทางโซเชียล (ผู้ติดตามหลักล้าน) ยกเว้นไม่เสียค่ารถแห่</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✔️</span> <span><strong>ความสะดวก:</strong> เราเป็นตัวกลางช่วยเจรจา ปิดการขาย ดูแลไฟแนนซ์ และจัดการเอกสารโอนให้ทั้งหมด</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✔️</span> <span><strong>ยืดหยุ่นสูง:</strong> สัญญาเดือนต่อเดือน ขายไม่ออก/เปลี่ยนใจ นำรถกลับได้ ไม่ผูกมัด!</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-gray-600 italic mt-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
              * โปรดทราบ: รถทุกคันเป็นการซื้อขายโดยตรง (Direct Sale) เพื่อให้ได้ราคาดีที่สุดทั้งสองฝ่าย ทางเราช่วยอำนวยความสะดวกด้านข้อมูลและเอกสาร 
              แนะนำให้ผู้ซื้อประเมิน แบตเตอรี่, ประกันศูนย์ และทดลองขับด้วยตนเอง เพื่อความสบายใจสูงสุดก่อนทำสัญญา (ไม่มีการรับประกันจากทางเต็นท์)
            </p>
          </div>
        </section>`;
code = code.replace(/<section\s+id="about"[\s\S]*?<\/section>/, newAbout);

// Replace Featured Cars to add Empty State
const carsSectionRegex = /{featuredCars\.length > 0 \? \([\s\S]*?}\)/;
const newCarsSection = `{featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="my-8 sm:my-10 p-6 sm:p-12 bg-white rounded-3xl border border-blue-100 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-accent to-blue-400"></div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary font-prompt mb-4 mt-2">
              พื้นที่นี้รอรถ EV ของคุณอยู่! ⚡
            </h3>
            <p className="text-gray-600 font-prompt text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              เตรียมพบกับแคตตาล็อกรถไฟฟ้า (EV) มือสอง คุณภาพเยี่ยม เร็วๆ นี้... <br className="hidden sm:block"/>
              เปิดโอกาสให้รถของคุณเป็น <strong>"คันแรก"</strong> ที่ได้โชว์ตรงนี้ กินทราฟฟิคยอดวิวแบบ Exclusive 100%!
            </p>
            <div className="bg-yellow-50 text-yellow-800 p-4 sm:p-5 rounded-2xl inline-block font-prompt text-sm sm:text-base border border-yellow-300 shadow-sm mx-auto mb-8">
              <p className="text-lg font-bold mb-1">🎁 โปรโมชั่นพิเศษ ฉลองเปิดโซน EV!</p>
              <p>สำหรับ <strong>5 คันแรก</strong> ที่นำรถมาฝากขายแบบจอดเต็นท์ (แพ็กเกจ 2)</p>
              <p className="text-accent font-semibold mt-1">รับสิทธิ์ทีมงานถ่ายทำคลิปวีดีโอรีวิวเจาะลึก จัดเต็มฟรี!! (ปกติมูลค่า x,xxx บาท)</p>
            </div>
            <div>
              <Link
                href="/sell-car"
                className="btn-primary font-prompt text-lg sm:text-xl px-8 py-3 rounded-full hover:scale-105 transition-transform duration-300 ease-out shadow-md"
              >
                ลงทะเบียนฝากขายรถ EV รับสิทธิ์เลย!
              </Link>
            </div>
          </div>
        )}`;
code = code.replace(carsSectionRegex, newCarsSection);

fs.writeFileSync('pages/ev-cars-chiang-mai.jsx', code);
console.log('Content updated');

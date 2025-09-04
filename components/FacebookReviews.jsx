import React from 'react';

export default function FacebookReviews() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
          รีวิวจากลูกค้าจริง
        </h2>
        <p className="text-lg text-accent font-prompt">
          ความประทับใจจากลูกค้าที่เลือกใช้บริการ ครูหนึ่งรถสวย
        </p>
      </div>
      <div className="relative overflow-hidden">
        {/* Desktop Arrow Buttons - ซ่อนในมือถือ */}
        <button
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          onClick={() => {
            const container = document.querySelector('.reviews-scroll-container');
            container.scrollBy({ left: -320, behavior: 'smooth' });
          }}
          aria-label="ดูรีวิวก่อนหน้า"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          onClick={() => {
            const container = document.querySelector('.reviews-scroll-container');
            container.scrollBy({ left: 320, behavior: 'smooth' });
          }}
          aria-label="ดูรีวิวถัดไป"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Reviews Container */}
        <div className="reviews-scroll-container flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:px-12">
          {/* Review 1 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  ก
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">กิตติ์ ชาญสงคราม</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;บริการดีเยี่ยม รถสวยตามรูป ครูหนึ่งแนะนำดี ดูแลหลังการขายดีมาก แนะนำเลยครับ
                ได้รถดีในราคาถูก&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 2 สัปดาห์ที่แล้ว</div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  น
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">นันทวัน โชติช่วง</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;ซื้อรถกับครูหนึ่ง ประทับใจมาก จัดไฟแนนซ์ให้ ส่งรถถึงบ้าน รับประกันครบ 1 ปี
                คุ้มค่ามากค่ะ&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 1 เดือนที่แล้ว</div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  ส
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">สมชาย วงษ์เจริญ</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;รถสภาพดี ราคาดี บริการเยี่ยม ครูหนึ่งใจดี ช่วยเหลือดีมาก ขายแล้วยังตามดูแลอีก
                เก่งจริงๆ&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 3 สัปดาห์ที่แล้ว</div>
            </div>
          </div>

          {/* Review 4 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  อ
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">อรุณี สงคราม</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;ได้รถตามต้องการ ราคาไม่แพง จัดไฟแนนซ์ให้เรียบร้อย บริการหลังการขายดี
                แนะนำเพื่อนมาซื้อแล้ว&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 2 เดือนที่แล้ว</div>
            </div>
          </div>

          {/* Review 5 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  ม
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">มานิต จันทร์เจริญ</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;ประทับใจบริการมาก ครูหนึ่งแนะนำดี ไม่หลอก รถสภาพดีจริง ราคาเป็นธรรม
                รับประกันครบถ้วน&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 1 สัปดาห์ที่แล้ว</div>
            </div>
          </div>

          {/* Review 6 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  จ
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">จิราพร สมใจ</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;คุ้มค่ามาก ได้รถดี ราคาถูก ครูหนึ่งซื่อสัตย์ ไม่โกหก บริการดี
                ส่งรถถึงบ้านให้ด้วย&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 3 เดือนที่แล้ว</div>
            </div>
          </div>

          {/* Review 7 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  ว
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">วิชัย มั่นคง</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;บริการเป็นเลิศ ครูหนึ่งดูแลดีมาก ให้คำแนะนำตรงไปตรงมา รถสภาพดี ราคาเหมาะสม
                แนะนำครับ&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 1 เดือนที่แล้ว</div>
            </div>
          </div>

          {/* Review 8 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  ป
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">ปราณี ใจดี</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;ซื้อรถที่นี่ครั้งที่ 2 แล้ว ประทับใจบริการทุกครั้ง ครูหนึ่งใส่ใจลูกค้าจริงๆ
                รถดี ราคาดี&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 2 สัปดาห์ที่แล้ว</div>
            </div>
          </div>

          {/* Review 9 */}
          <div className="flex-shrink-0 w-80 snap-start">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  ร
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-prompt">รัชนี สุขสันต์</h3>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed flex-grow font-prompt text-sm">
                &ldquo;เยี่ยมมากค่ะ ได้รถตัวจริงตามรูป ครูหนึ่งดูแลดี ช่วยจัดเงินให้ รับประกันครบ
                แนะนำทุกคนเลย&rdquo;
              </p>
              <div className="mt-4 text-xs text-gray-500">⏰ 4 สัปดาห์ที่แล้ว</div>
            </div>
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="md:hidden flex justify-center mt-6 gap-2">
          <div className="text-sm text-gray-500 font-prompt">เลื่อนเพื่อดูรีวิวเพิ่มเติม →</div>
        </div>
      </div>
    </section>
  );
}

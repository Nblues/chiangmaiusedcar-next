/* eslint-disable prettier/prettier */
import React, { useCallback, useRef } from 'react';

const REVIEWS = [
  {
    url: 'https://www.facebook.com/oonmaxx/posts/pfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl',
    name: 'Oon Thongna',
    text: 'รถสวยถูกใจ❤️ราคาน่ารัก🥰แนะนำเลยค่ะ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/tai.thanchanok.7/posts/pfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol',
    name: 'Tai Maewin Trekking Cnx',
    text: 'ไม่ผิดหวังเลย ที่ติดตามครูหนึ่งมานาน ได้รถที่ตั้งใจ อยากจะได้❤️...รถสภาพดีมากๆๆๆ (ก.ไก่ล้านตัว) ไม่ผิดหวังเลยจริงๆค่ะ, ..ขอแนะนำเป็นอย่างยิ่ง รถมือสองสภาพดีที่สุด ที่ครูหนึ่งรถสวยเท่านั้นนะค่ะ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/nongnoo.kookkook/posts/pfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl',
    name: 'นรวรรณ ไชยรัตน์',
    text: 'รถดี มีคุณภาพ ราคาไม่แพง บริการหลังการขายดีมาก ต้องครูหนึ่งรถสวย รถมือสองค่ะ ไม่ผิดหวัง ขายรถด้วยความจริงใจได้รถแท้ ไม่สวมทะเบียน และยังได้ความรู้เรื่องรถอีกมากมายค่ะ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/NaowaratUpachal/posts/pfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl',
    name: 'เนาวรัตน์ อุปชัย',
    text: 'คิดถูกทีสุดออกรถกับครูหนึ่งรถสวย สมชื่อครูหนึ่งรถสวยจริงๆค่ะ ได้รถคันนีมาสวยและถูกใจมากไม่ทำให้ผิดหวังเลยค่ะ การบริการก็ดี คำพูดก็ดี อีกอย่าง ขอชื่นชมครูหนึ่งรีวิวรถทำให้เราเข้าใจได้ง่ายเพราะเป็นคนไม่รู้เรื่องรถเลยแต่เชื่อใจครูหนึ่งและสามารถตัดสินได้เลยไม่ต้องคิดมาก เพราะติดตามเพจครูหนึ่งมานาน คิดอยู่อย่างเดียวครูหนึ่งเอารถมารีวิวเดียวไม่ทันคนอื่น คนอืนจองรถไวมาก ขอบคุณมากค่ะครู',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/nongtee.myson/posts/pfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el',
    name: 'Tily Pattaya Kaewdee',
    text: 'พึ่งเป็นลูกค้า และพึ่งซื้อรถกับครูหนึ่งคะ ซึ่งเพจมีผูติดตามหลักเเสน แต่ครูหนึ่งตอบเเชทเองตลอด ถามอะไรตอบตลอดเวลา ใส่ใจดูแลหลังการขายดีมาก ซึ่งไม่เคยได้รับจากเต้นรถมือสอง จากที่ได๋มาก่อนคะ ประทับใจคะ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/permalink.php?story_fbid=pfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl&id=100004184059361',
    name: 'นะโม ปัญญายม',
    text: 'รถสวยสภาพดี บริการคุณภาพ เป็นกันเอง มีสาระความรู้เรื่องรถมาแนะนำตลอด เรื่องรถไว้ใจได้ ดีเยี่ยมมากกๆๆๆครับ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/malee.daengprasert/posts/pfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl',
    name: 'Malee Daengprasert',
    text: 'ขอบคุณ ครูหนึ่งรถสวยมือสองมากๆได้รับเงินรางวัล 3000 บาทแล้วค่ะ และจะติดตามครูหนึ่งรถสวยมือสองตลอดไปค่ะ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/chalida.twoslim/posts/pfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l',
    name: 'Chalida Pakwan',
    text: 'ครูหนึ่งคือขายแต่รถดีๆจริงๆค่ะ ซื้อจากครูหนึ่งมาแล้ว 3 คัน',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/krunuengrodsauy/reviews',
    name: 'Siwagorn Tee',
    text: 'เพจผู้ติดตามหลักล้าน รถสวย โอน ต่อภาษีให้ ส่งถึงบ้าน บริการหลังการขายประทับใจ ติดต่อขอคำแนะนำได้ตลอดครับ ครูตอบแชทเอง👍👍👍🥰',
    rating: 5,
  },
];

// Helper สร้างตัวย่อชื่อลูกค้า
const getInitial = name => {
  const cleanName = name.replace(/^(คุณ|ลูกค้า)/, '').trim();
  return cleanName.charAt(0) || name.charAt(0);
};

// Helper สุ่มสีพื้นหลังอวตารตามชื่อ
const getBgColor = name => {
  const colors = [
    'bg-pink-100 text-pink-700',
    'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
    'bg-emerald-100 text-emerald-700',
    'bg-orange-100 text-orange-700',
    'bg-rose-100 text-rose-700',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function FacebookReviewsSection() {
  const containerRef = useRef(null);

  const scrollBy = useCallback(delta => {
    const el = containerRef.current;
    if (el && typeof el.scrollBy === 'function') {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto py-12 px-6 md:px-8 lg:px-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
          รีวิวจากลูกค้าจริง
        </h2>
        <p className="text-base sm:text-lg text-orange-700 font-prompt max-w-sm md:max-w-xl mx-auto px-4 leading-relaxed">
          ความประทับใจจากลูกค้า
          <br className="block sm:hidden" />
          <span className="hidden sm:inline"> </span>ที่เลือกใช้บริการ ครูหนึ่งรถสวย
        </p>
      </div>

      <div className="relative overflow-hidden group">
        {/* Desktop Arrow Buttons */}
        <button
          type="button"
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          onClick={() => scrollBy(-360)}
          aria-label="เลื่อนดูรีวิวก่อนหน้า"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          onClick={() => scrollBy(360)}
          aria-label="เลื่อนดูรีวิวถัดไป"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Horizontal Scroll Container */}
        <div
          ref={containerRef}
          className="reviews-scroll-container flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 pt-2 px-4 md:px-12 lg:px-16 mx-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {REVIEWS.map((review, i) => (
            <article
              key={i}
              className="flex-none w-[280px] sm:w-[320px] md:w-[360px] bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 snap-center flex flex-col relative group/card"
            >
              <div className="flex-1 p-5 lg:p-6 flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-4">
                  {/* 3. Avatar ดีไซน์ใหม่ สกัดตัวย่อ พร้อมไอคอน FB */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-prompt ${getBgColor(review.name)}`}
                    >
                      {getInitial(review.name)}
                    </div>
                    {/* Facebook Tiny Badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center p-[1px] shadow-sm border border-gray-100">
                      <svg
                        className="w-full h-full text-[#1877F2]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-gray-900 leading-tight truncate font-prompt">
                      {review.name}
                    </div>
                    <div className="flex items-center mt-0.5">
                      <div className="flex text-[#FFB400] text-sm">{'★'.repeat(review.rating)}</div>
                      <span className="ml-1.5 text-xs text-gray-500 font-medium pt-0.5">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm md:text-base text-gray-600 leading-relaxed flex-1 mb-6">
                  <q className="italic">{review.text}</q>
                </div>

                {/* 2. เปลี่ยนปุ่มอ่านรีวิวเต็ม เป็น Tag A เพื่อให้ Robot ของ Google ตรวจสอบ Link ได้ */}
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center mt-auto bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 border border-gray-100 hover:border-blue-600 font-prompt"
                  aria-label={`อ่านรีวิวฉบับเต็มของ ${review.name} บน Facebook`}
                >
                  อ่านรีวิวเต็ม
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-2 mb-2">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full shadow-sm text-gray-700 font-prompt hover:bg-gray-100 transition-colors">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="text-sm sm:text-base font-medium tracking-wide">
              <span className="md:hidden">เลื่อนดูรีวิวเพิ่มเติม</span>
              <span className="hidden md:inline">คลิกปุ่มลูกศร หรือ เลื่อนดูรีวิวเพิ่มเติม</span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.facebook.com/KN2car/reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 md:px-8 py-3.5 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 space-x-2 font-prompt"
          aria-label="ดูรีวิวลูกค้าเพิ่มเติมบนเพจ Facebook ครูหนึ่งรถสวย"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>ดูรีวิวทั้งหมดบน Facebook</span>
        </a>
      </div>
    </section>
  );
}

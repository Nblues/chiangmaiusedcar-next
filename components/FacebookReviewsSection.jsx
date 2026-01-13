/* eslint-disable prettier/prettier */
import React, { useCallback, useRef } from 'react';

const REVIEWS = [
  {
    url: 'https://www.facebook.com/oonmaxx/posts/pfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl',
    name: 'คุณอุ๋น',
    text: 'บริการดีมาก รถสวย คุณภาพดี ส่งมาถึงบ้านตามที่นัดหมาย แนะนำเลยครับ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/tai.thanchanok.7/posts/pfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol',
    name: 'คุณใต้',
    text: 'ขอบคุณครูหนึ่งรถสวยมากค่ะ ได้รถตามที่ใจหวัง ราคาดี คุ้มค่า',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/nongnoo.kookkook/posts/pfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl',
    name: 'คุณหนู',
    text: 'รถดีมาก เครื่องยนต์ดี ไม่มีปัญหา ขอบคุณที่ให้คำแนะนำดีๆ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/NaowaratUpachal/posts/pfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl',
    name: 'คุณเนาวรัตน์',
    text: 'พอใจมากค่ะ รถตรงปก ไม่โกหก จัดส่งตรงเวลา',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/nongtee.myson/posts/pfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el',
    name: 'คุณนงที',
    text: 'ประทับใจการบริการ ให้คำปรึกษาดี รถคุณภาพดี แนะนำเพื่อนๆ',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/permalink.php?story_fbid=pfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl&id=100004184059361',
    name: 'ลูกค้าครูหนึ่ง',
    text: 'ได้รถดีมาก ไม่มีปัญหา เอกสารครบถ้วน บริการดีเยี่ยม',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/na.mo.payya.ym/posts/pfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l',
    name: 'คุณนะโม',
    text: 'ขอบคุณครูหนึ่งรถสวย ได้รับรถตามเวลาที่นัด รถสภาพดี',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/malee.daengprasert/posts/pfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl',
    name: 'คุณมาลี',
    text: 'โอเคมากเลย ครูหนึ่งให้คำแนะนำดี รถดี ราคาเป็นธรรม',
    rating: 5,
  },
  {
    url: 'https://www.facebook.com/chalida.twoslim/posts/pfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l',
    name: 'คุณชลิดา',
    text: 'ดีใจมากที่ได้รถมา สวยมาก ไม่มีตำหนิ ขอบคุณครูหนึ่งค่ะ',
    rating: 5,
  },
];

export default function FacebookReviewsSection() {
  const containerRef = useRef(null);

  const scrollBy = useCallback(delta => {
    const el = containerRef.current;
    if (el && typeof el.scrollBy === 'function') {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, []);

  const openReview = useCallback(url => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore
    }
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto py-12 px-6 md:px-8 lg:px-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
          รีวิวจากลูกค้าจริง
        </h2>
        <p className="text-lg text-orange-700 font-prompt">
          ความประทับใจจากลูกค้าที่เลือกใช้บริการ ครูหนึ่งรถสวย
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Desktop Arrow Buttons - ซ่อนในมือถือ */}
        <button
          type="button"
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          onClick={() => scrollBy(-320)}
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
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          onClick={() => scrollBy(320)}
          aria-label="เลื่อนดูรีวิวถัดไป"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Horizontal Scroll Container */}
        <div
          ref={containerRef}
          className="reviews-scroll-container flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 mx-0 md:mx-16 lg:mx-20 px-4 md:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {REVIEWS.map((review, i) => (
            <article
              key={i}
              className="flex-none w-72 sm:w-80 md:w-96 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-44 sm:h-48 md:h-60 snap-center"
            >
              <div className="relative h-full">
                {/* ใช้ Static content แทน iframe สำหรับ production */}
                <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-3 md:p-4 overflow-hidden">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 md:w-6 md:h-6 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                        {review.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-1 md:mb-2">รีวิวจาก Facebook</div>
                      <div className="text-xs md:text-sm text-gray-700 line-clamp-3 md:line-clamp-4">
                        &ldquo;{review.text}&rdquo;
                      </div>
                      <div className="flex items-center mt-1 md:mt-2">
                        <div className="flex text-yellow-400 text-xs md:text-sm">
                          {'★'.repeat(review.rating)}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => openReview(review.url)}
                  className="absolute bottom-1 md:bottom-2 right-1 md:right-2 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                  aria-label={`ดูรีวิวเต็มของ ${review.name} บน Facebook`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openReview(review.url);
                    }
                  }}
                >
                  อ่านรีวิวเต็ม
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll Indicator - ปรับข้อความให้เหมาะสมกับมือถือ */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 font-prompt">
            <span className="md:hidden">เลื่อนดูรีวิวเพิ่มเติม</span>
            <span className="hidden md:inline">คลิกปุ่มลูกศร หรือ เลื่อนดูรีวิวเพิ่มเติม</span>
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.facebook.com/KN2car"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
          aria-label="ดูรีวิวลูกค้าเพิ่มเติมบน Facebook ครูหนึ่งรถสวย"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>ดูรีวิวลูกค้าเพิ่มเติม</span>
        </a>
      </div>
    </section>
  );
}

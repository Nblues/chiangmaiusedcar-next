/* eslint-disable prettier/prettier */
import React, { useCallback, useRef, useEffect } from 'react';

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
    url: 'https://www.facebook.com/krunuengrodsauy/reviews',
    name: 'Siwagorn Tee',
    text: 'เพจผู้ติดตามหลักล้าน รถสวย โอน ต่อภาษีให้ ส่งถึงบ้าน บริการหลังการขายประทับใจ ติดต่อขอคำแนะนำได้ตลอดครับ ครูตอบแชทเอง👍👍👍🥰',
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

  useEffect(() => {
    // เลื่อนรีวิวของ "เนาวรัตน์ อุปชัย" (index 3) ให้อยู่ตรงกลางจอเฉพาะหน้าจอมือถือตอนโหลด
    if (window.innerWidth < 768 && containerRef.current) {
      setTimeout(() => {
        const container = containerRef.current;
        const target = container.children[3]; // The 4th review
        if (target) {
          const scrollLeft = target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;
          container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'auto' });
        }
      }, 100);
    }
  }, []);

  const scrollBy = useCallback(delta => {
    const el = containerRef.current;
    if (el && typeof el.scrollBy === 'function') {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-50/50 to-white overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-50/50 blur-3xl rounded-full pointer-events-none opacity-50"></div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 font-prompt tracking-tight">
            รีวิวจากลูกค้าจริง
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-prompt max-w-sm md:max-w-2xl mx-auto leading-relaxed">
            ความประทับใจจากลูกค้า
            <br className="block sm:hidden" />
            <span className="hidden sm:inline"> </span>ที่เลือกไว้วางใจบริการของ
            <span className="text-primary font-semibold"> ครูหนึ่งรถสวย</span>
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
                className="flex-none w-[280px] sm:w-[320px] md:w-[360px] bg-white rounded-[24px] shadow-sm border border-gray-100/80 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1.5 snap-center flex flex-col relative group/card overflow-hidden"
              >
                {/* Background ambient Quote Icon */}
                <div className="absolute top-6 right-6 text-gray-50 opacity-50 transform group-hover/card:scale-110 transition-transform duration-500 pointer-events-none">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.017 21L16.417 14C16.6358 13.1259 16.6212 12.1979 16.3768 11.3323C16.1324 10.4667 15.669 9.70248 15.0456 9.13543L15.017 9.11C14.7126 8.83594 14.47 8.50854 14.3032 8.14725C14.1365 7.78595 14.0487 7.39806 14.045 7.006C14.0326 6.13222 14.3735 5.28637 14.9868 4.66579C15.6001 4.0452 16.4447 3.70425 17.318 3.717C18.1913 3.72975 19.0267 4.0952 19.6247 4.73146C20.2228 5.36772 20.5428 6.21921 20.525 7.093C20.5133 7.8288 20.354 8.55397 20.055 9.232C19.7561 9.91003 19.3226 10.53 18.776 11.062L15.317 21H14.017ZM6.01697 21L8.41697 14C8.63503 13.1253 8.62002 12.1965 8.37529 11.3303C8.13056 10.4642 7.66699 9.69973 7.04397 9.133L7.01697 9.11C6.71261 8.83594 6.47 8.50854 6.30325 8.14725C6.1365 7.78595 6.04874 7.39806 6.04502 7.006C6.0326 6.13222 6.37353 5.28637 6.98685 4.66579C7.60017 4.0452 8.44468 3.70425 9.31802 3.717C10.1913 3.72975 11.0267 4.0952 11.6248 4.73146C12.2228 5.36772 12.5428 6.21921 12.525 7.093C12.5134 7.82884 12.3541 8.55403 12.0552 9.23207C11.7562 9.9101 11.3228 10.5301 10.776 11.062L7.31697 21H6.01697Z" />
                  </svg>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col h-full relative z-10">
                  <div className="flex items-center space-x-4 mb-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-prompt ring-2 ring-white shadow-sm ${getBgColor(review.name)}`}
                      >
                        {getInitial(review.name)}
                      </div>
                      {/* Facebook Tiny Badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center p-[1px] shadow-sm ring-1 ring-gray-100">
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
                      <div className="text-lg font-semibold text-gray-900 leading-tight truncate font-prompt tracking-tight">
                        {review.name}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-[#FFB400] text-[15px] space-x-[1px]">
                          {'★'.repeat(review.rating)}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 font-medium">
                          {review.rating}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[15px] md:text-[16px] text-gray-700 leading-relaxed flex-1 mb-8">
                    <q className="block font-prompt text-gray-800">{review.text}</q>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center w-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ring-1 ring-inset ring-blue-600/20 hover:ring-transparent font-prompt group/btn"
                      aria-labelledby={`review-link-label-${i} review-link-context-${i}`}
                    >
                      <span id={`review-link-label-${i}`}>อ่านรีวิวเต็ม</span>
                      <span id={`review-link-context-${i}`} className="sr-only">
                        {` ของ ${review.name} บน Facebook`}
                      </span>
                      <svg
                        className="w-4 h-4 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="text-center mt-6 mb-2 relative z-10 md:hidden flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-gray-500 font-prompt">
              <svg
                className="w-4 h-4 text-gray-400 animate-pulse"
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
              <span className="text-[13px] font-medium tracking-wide">
                ปัดซ้าย-ขวา เพื่อดูรีวิว
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 md:mt-14 relative z-10">
          <a
            href="https://www.facebook.com/KN2car/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-[#1669D9] hover:bg-[#145fc4] text-white px-8 py-4 rounded-full font-semibold text-[16px] md:text-[17px] shadow-lg hover:shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-300 font-prompt ring-1 ring-[#1669D9]/50"
            aria-labelledby="all-facebook-reviews-label all-facebook-reviews-context"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span id="all-facebook-reviews-label" className="tracking-wide">
                ดูรีวิวทั้งหมด
              </span>
              <span id="all-facebook-reviews-context" className="sr-only">
                บนเพจ Facebook ครูหนึ่งรถสวย
              </span>
              <svg
                className="w-4 h-4 ml-0.5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Facebook } from 'lucide-react';
import GoogleReviewButton from '../components/GoogleReviewButton';

const GOOGLE_REVIEW_URL = 'https://g.page/r/Ccu3ZhBBWbWcEBM/review';
const FACEBOOK_REVIEW_URL = 'https://www.facebook.com/KN2car/reviews/';
const SITE_URL = 'https://www.chiangmaiusedcar.com';

export default function ReviewPage() {
  const handleReviewClick = e => {
    e.preventDefault();
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isFacebook =
      ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1 || ua.indexOf('Instagram') > -1;
    const isAndroid = /android/i.test(ua);

    if (isFacebook && isAndroid) {
      window.location.href =
        'intent://g.page/r/Ccu3ZhBBWbWcEBM/review#Intent;scheme=https;package=com.android.chrome;end;';
      setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL + '?openExternalBrowser=1'; // Fallback
      }, 500);
      return;
    }

    window.location.href = GOOGLE_REVIEW_URL + '?openExternalBrowser=1';
  };

  return (
    <>
      <Head>
        <title>ขอบคุณที่ไว้วางใจออกรถกับเรา | ครูหนึ่งรถสวยเชียงใหม่</title>
        <meta
          name="description"
          content="ขอขอบคุณลูกค้าทุกท่านที่ไว้วางใจออกรถกับครูหนึ่งรถสวย รบกวนเวลาสักนิดเพื่อรีวิวและให้คะแนนเราบน Google เพื่อเป็นกำลังใจให้ทีมงานครับ"
        />
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/review`} />
        <meta property="og:title" content=" ขอบคุณที่ไว้วางใจออกรถกับ ครูหนึ่งรถสวยเชียงใหม่" />
        <meta
          property="og:description"
          content="ขอให้รถคันนี้นำพาความสุขและโชคลาภมาให้ท่าน รบกวนเวลา 1 นาทีรีวิว 5 ดาวเพื่อเป็นกำลังใจให้ทีมงานหน่อยนะครับ "
        />
        {/* OG Image */}
        <meta property="og:image" content={`${SITE_URL}/herobanner/thank-you.webp`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${SITE_URL}/review`} />
        <meta name="twitter:title" content=" ขอบคุณที่ไว้วางใจออกรถกับ ครูหนึ่งรถสวยเชียงใหม่" />
        <meta
          name="twitter:description"
          content="ขอให้รถคันนี้นำพาความสุขและโชคลาภมาให้ท่าน รบกวนเวลา 1 นาทีรีวิว 5 ดาวเพื่อเป็นกำลังใจให้ทีมงานหน่อยนะครับ "
        />
        <meta name="twitter:image" content={`${SITE_URL}/herobanner/thank-you.webp`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center p-3 sm:p-5 lg:p-8 antialiased font-prompt relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] left-[-10%] w-[80%] h-[60%] sm:w-[60%] sm:h-[50%] bg-blue-300/15 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-5%] right-[-10%] w-[80%] h-[60%] sm:w-[60%] sm:h-[50%] bg-orange-300/15 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply"></div>
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[460px] bg-white/80 backdrop-blur-xl rounded-t-[2rem] rounded-b-[2rem] sm:rounded-[2.5rem] shadow-[0_12px_40px_-5px_rgba(0,0,0,0.06)] sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-white/80 p-6 sm:p-10 text-center z-10 relative flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 200, damping: 20 }}
            className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-white rounded-[1.75rem] sm:rounded-[2rem] shadow-[0_8px_25px_rgba(0,0,0,0.06)] mb-7 sm:mb-9 rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0"
          >
            <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] relative">
              <Image
                src="/favicon.webp"
                alt="โลโก้ ครูหนึ่งรถสวย"
                fill
                sizes="(max-width: 640px) 72px, 84px"
                className="object-contain drop-shadow-sm"
              />
            </div>
          </motion.div>

          <div className="w-full space-y-5 sm:space-y-6 mb-7 sm:mb-8">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-800 leading-[1.3] sm:leading-[1.25] tracking-tight">
              ขอบคุณที่ไว้วางใจ
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 inline-flex items-center justify-center gap-1.5 mt-1 sm:mt-2">
                ออกรถกับเรา <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              </span>
            </h1>

            <div className="w-full text-slate-600 space-y-5 sm:space-y-6">
              <p className="text-[15.5px] sm:text-[17px] font-medium leading-[1.7] sm:leading-[1.75] px-1">
                ขอให้รถคันนี้นำพาความสุข
                <br className="sm:hidden" /> โชคลาภ และความสำเร็จ
                <br className="hidden sm:block" /> มาให้ท่าน
                <br className="sm:hidden" />
                และครอบครัวตลอดไป
              </p>

              <div className="bg-slate-50/70 sm:bg-white p-5 sm:p-6 rounded-[1.25rem] text-slate-700 text-[14.5px] sm:text-[15px] border border-slate-100 sm:border-slate-50 sm:shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center gap-3 sm:gap-3.5">
                <HeartHandshake className="w-8 h-8 sm:w-9 sm:h-9 text-blue-500/80" />
                <p className="leading-[1.65] sm:leading-[1.7] font-light max-w-[290px] sm:max-w-full">
                  หากประทับใจบริการ <br className="sm:hidden" />
                  รบกวนให้เรตติ้ง <b>5 ดาว</b> <br className="sm:hidden" />
                  เพื่อเป็นกำลังใจให้ทีมงานนะครับ
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            {/* ปุ่ม Google Review */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2 pb-2 w-full flex justify-center cursor-pointer"
              onClick={handleReviewClick}
            >
              <div className="pointer-events-none w-full flex justify-center">
                <GoogleReviewButton reviewUrl="#" />
              </div>
            </motion.div>

            {/* ตัวแบ่ง */}
            <div className="flex items-center w-[90%] my-5 sm:my-6">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3.5 text-[13px] sm:text-[14px] text-slate-400 font-light">
                หรือทางเลือกอื่น
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* ปุ่ม Facebook Review */}
            <motion.a
              href={FACEBOOK_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2.5 w-full max-w-[300px] px-5 py-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-2xl shadow-[0_8px_20px_-6px_rgba(24,119,242,0.4)] transition-all font-medium text-[15.5px] cursor-pointer"
            >
              <svg className="w-[22px] h-[22px] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              รีวิวผ่านเพจ Facebook ให้เรา
            </motion.a>
          </div>

          <div className="w-full mt-7 sm:mt-9 pt-5 sm:pt-6 border-t border-slate-100 sm:border-slate-200/50 flex flex-col items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-[14px] sm:text-[15px] font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              &larr; กลับสู่หน้าแรก
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

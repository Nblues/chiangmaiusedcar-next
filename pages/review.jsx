import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake } from 'lucide-react';
import GoogleReviewButton from '../components/GoogleReviewButton';

const GOOGLE_REVIEW_URL = 'https://g.page/r/Ccu3ZhBBWbWcEBM/review?openExternalBrowser=1';
const SITE_URL = 'https://www.chiangmaiusedcar.com';

export default function ReviewPage() {
  const handleAutoRedirect = () => {
    // พยายามบังคับเตะออกไปแอปอื่นเวลาลูกค้ากดปุ่ม
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isFacebook =
      ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1 || ua.indexOf('Instagram') > -1;
    const isAndroid = /android/i.test(ua);

    // ถ้าเป็น Android และเปิดผ่าน FB ให้บังคับเด้งเข้า Chrome เลย
    if (isFacebook && isAndroid) {
      window.location.href =
        'intent://g.page/r/Ccu3ZhBBWbWcEBM/review#Intent;scheme=https;package=com.android.chrome;end;';
      // ใช้ delay เผื่อ fallback
      setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL;
      }, 500);
      return;
    }

    // หน้าปกติ หรือ iOS ให้ไปที่ URL เดิม
    window.location.href = GOOGLE_REVIEW_URL;
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
        <meta property="og:url" content="https://www.chiangmaiusedcar.com/review" />
        <meta property="og:title" content=" ขอบคุณที่ไว้วางใจออกรถกับ ครูหนึ่งรถสวยเชียงใหม่" />
        <meta
          property="og:description"
          content="ขอให้รถคันนี้นำพาความสุขและโชคลาภมาให้ท่าน รบกวนเวลา 1 นาทีรีวิว 5 ดาวเพื่อเป็นกำลังใจให้ทีมงานหน่อยนะครับ "
        />

        {/* OG Image */}
        <meta
          property="og:image"
          content="https://www.chiangmaiusedcar.com/herobanner/thank-you.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.chiangmaiusedcar.com/review" />
        <meta name="twitter:title" content=" ขอบคุณที่ไว้วางใจออกรถกับ ครูหนึ่งรถสวยเชียงใหม่" />
        <meta
          name="twitter:description"
          content="ขอให้รถคันนี้นำพาความสุขและโชคลาภมาให้ท่าน รบกวนเวลา 1 นาทีรีวิว 5 ดาวเพื่อเป็นกำลังใจให้ทีมงานหน่อยนะครับ "
        />
        <meta
          name="twitter:image"
          content="https://www.chiangmaiusedcar.com/herobanner/thank-you.webp"
        />

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
          className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-t-[1.75rem] rounded-b-[1.75rem] sm:rounded-[2.5rem] shadow-[0_8px_30px_-5px_rgba(0,0,0,0.06)] sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-white/80 p-5 sm:p-9 text-center z-10 relative flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 200, damping: 20 }}
            className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center bg-white rounded-3xl sm:rounded-[1.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-6 sm:mb-8 rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0"
          >
            <div className="w-14 h-14 sm:w-[68px] sm:h-[68px] relative">
              <Image
                src="/favicon.webp"
                alt="โลโก้ ครูหนึ่งรถสวย"
                fill
                sizes="(max-width: 640px) 56px, 68px"
                className="object-contain drop-shadow-sm"
              />
            </div>
          </motion.div>

          <div className="w-full space-y-5 sm:space-y-6 mb-7 sm:mb-8">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-slate-800 leading-[1.3] sm:leading-[1.25] tracking-tight">
              ขอบคุณที่ไว้วางใจ
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 inline-flex items-center justify-center gap-1.5 mt-1 sm:mt-2">
                ออกรถกับเรา <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </span>
            </h1>

            <div className="w-full text-slate-600 space-y-4 sm:space-y-5">
              <p className="text-[14px] sm:text-[15.5px] font-medium leading-[1.65] sm:leading-[1.7] px-1">
                ขอให้รถคันนี้นำพาความสุข
                <br className="sm:hidden" /> โชคลาภ และความสำเร็จ
                <br className="hidden sm:block" /> มาให้ท่าน
                <br className="sm:hidden" />
                และครอบครัวตลอดไป
              </p>

              <div className="bg-slate-50/70 sm:bg-white p-4 sm:p-5 rounded-2xl text-slate-700 text-[13px] sm:text-[14px] border border-slate-100 sm:border-slate-50 sm:shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center gap-2.5 sm:gap-3">
                <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500/80" />
                <p className="leading-[1.6] sm:leading-[1.65] font-light max-w-[280px] sm:max-w-full">
                  หากประทับใจบริการ <br className="sm:hidden" />
                  รบกวนเวลาสัก 1 นาที
                  <br className="hidden sm:block" />
                  ให้เรตติ้ง <b>5 ดาว</b> บน Google <br className="sm:hidden" />
                  เพื่อเป็นกำลังใจให้ทีมงานนะครับ
                </p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2 pb-2 w-full flex justify-center cursor-pointer"
            onClick={handleAutoRedirect}
          >
            <div className="pointer-events-none w-full flex justify-center">
              <GoogleReviewButton reviewUrl="#" />
            </div>
          </motion.div>

          <div className="w-full mt-7 sm:mt-9 pt-5 sm:pt-6 border-t border-slate-100 sm:border-slate-200/50 flex flex-col items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-[13px] sm:text-[14px] font-medium text-slate-400 hover:text-blue-600 transition-colors"
            >
              &larr; กลับสู่หน้าแรก
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

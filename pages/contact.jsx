import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import { buildLocalBusinessJsonLd } from '../lib/seo/jsonld';
import Head from 'next/head';
import A11yImage from '../components/A11yImage';
import { createMapEmbedUrl, createMapOpenUrl, clearLocationCache } from '../utils/siteLocation';
import { SEO_KEYWORD_MAP } from '../config/seo-keyword-map';
import { BUSINESS_INFO } from '../config/business';

export default function Contact({ seoContact }) {
  // State สำหรับแผนที่
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [mapOpenUrl, setMapOpenUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  // ดึงพิกัดจาก utility (client-side only)
  useEffect(() => {
    setMounted(true);
    try {
      // ล้าง cache เพื่อให้ใช้พิกัดใหม่
      clearLocationCache();

      const embedUrl = createMapEmbedUrl();
      const openUrl = createMapOpenUrl();

      setMapEmbedUrl(embedUrl);
      setMapOpenUrl(openUrl);
    } catch {
      // Silently fallback to static URLs if dynamic creation fails
      const fallbackEmbedUrl =
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.089193583984!2d99.02736887517952!3d18.804897754158845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da25a34cba1f05%3A0x9cb559411066b7cb!2z4LiE4Lij4Li54Lir4LiZ4Li24LmI4LiH4Lij4LiW4Liq4Lin4Lii!5e0!3m2!1sth!2sth!4v1694441234567!5m2!1sth!2sth';
      const fallbackOpenUrl =
        'https://www.google.com/maps/place/%E0%B8%84%E0%B8%A3%E0%B8%B9%E0%B8%AB%E0%B8%99%E0%B8%B6%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%96%E0%B8%AA%E0%B8%A7%E0%B8%A2/@18.8048977,99.0301667,17z';

      setMapEmbedUrl(fallbackEmbedUrl);
      setMapOpenUrl(fallbackOpenUrl);
    }
  }, []);

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ติดต่อครูหนึ่งรถสวยได้อย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สามารถติดต่อได้หลายช่องทาง: โทร 094-064-9018, LINE https://lin.ee/8ugfzstD, Facebook หรือช่องทางโซเชียลมีเดียอื่นๆ ของเรา',
        },
      },
      {
        '@type': 'Question',
        name: 'เวลาทำการของร้าน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เปิดทุกวัน 9:00 - 20:00 น. วันหยุดราชการปกติ',
        },
      },
      {
        '@type': 'Question',
        name: 'สามารถนัดดูรถได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ได้เลย! แนะนำให้นัดล่วงหน้าเพื่อให้ทีมงานเตรียมรถไว้รอ ติดต่อ 094-064-9018 หรือ LINE',
        },
      },
      {
        '@type': 'Question',
        name: 'ครูหนึ่งรถสวยมีช่องทางโซเชียลมีเดียอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Facebook 1 ล้านติดตาม, TikTok 1.5 แสนติดตาม, YouTube 4 หมื่นติดตาม, Lemon8 26k+ติดตาม และ LINE สำหรับสอบถาม',
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title={seoContact.title}
        description={seoContact.description}
        keywords={[seoContact.primary, ...seoContact.secondary, ...seoContact.longTail.slice(0, 5)]}
        url="/contact"
        image="https://www.chiangmaiusedcar.com/herobanner/contact.webp"
        pageType="contact"
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'ติดต่อเรา', url: '/contact' },
        ]}
      />
      <Head>
        

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <A11yImage
            src="/herobanner/contact-1024w.webp"
            srcSet="/herobanner/contact-480w.webp 480w, /herobanner/contact-640w.webp 640w, /herobanner/contact-828w.webp 828w, /herobanner/contact-1024w.webp 1024w, /herobanner/contact-1400w.webp 1400w"
            alt="ติดต่อเรา - ครูหนึ่งรถสวย"
            fill
            aspectRatio="16/9"
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Content over banner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-5xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 font-prompt drop-shadow-lg text-white">
                ติดต่อ ครูหนึ่งรถสวย รถมือสองเชียงใหม่
              </h1>
              <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-prompt drop-shadow-lg text-white font-semibold mb-4 md:mb-6">
                <p className="mb-1 md:mb-2">ครูหนึ่งรถสวย</p>
                <p className="text-xs sm:text-sm md:text-lg lg:text-xl mb-2 md:mb-3">
                  ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่
                </p>
              </div>

              {/* Quick Contact Info */}
              <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                <div className="px-2 py-1 bg-black/50 rounded-lg">
                  <span className="text-sm md:text-base lg:text-lg font-semibold text-white">
                    เปิดทุกวัน 9:00-20:00 น.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <section className="bg-white py-4 border-b border-gray-200 -mt-0">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 font-prompt">
              <Link href="/" className="hover:text-primary transition-colors">
                หน้าแรก
              </Link>
              <span>›</span>
              <span className="text-primary font-medium">ติดต่อเรา</span>
            </nav>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-4 font-prompt">
            ช่องทางติดต่อ
          </h2>
          <p className="text-gray-600 text-center mb-12 font-prompt">
            เลือกช่องทางที่สะดวกสำหรับคุณ
          </p>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300">
              <h3 className="font-bold text-primary mb-3 text-lg">โทรศัพท์</h3>
              <a
                href="tel:0940649018"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent/80 transition-colors text-lg"
                aria-label="โทร 094-064-9018"
              >
                094-064-9018
              </a>
            </div>
            <div className="bg-white border-2 border-accent/20 hover:border-accent p-6 rounded-xl shadow-lg transition-all duration-300">
              <h3 className="font-bold text-primary mb-3 text-lg">LINE</h3>
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent/80 transition-colors text-lg"
              >
                @kruneungcar
              </a>
            </div>
            <div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300">
              <h3 className="font-bold text-primary mb-3 text-lg">อีเมล (Email)</h3>
              <a
                href="mailto:info@chiangmaiusedcar.com"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-base break-all"
              >
                info@chiangmaiusedcar.com
              </a>
            </div>
            <div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300">
              <h3 className="font-bold text-primary mb-3 text-lg">เวลาทำการ</h3>
              <p className="text-gray-700 font-medium">จันทร์ - อาทิตย์ เวลา 9:00 - 20:00 น.</p>
            </div>
          </div>

          {/* CTA - ลิงก์ไปหน้ารถทั้งหมด */}
          <div className="flex justify-center mb-12">
            <Link
              href="/all-cars"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300"
            >
              ดูรถทั้งหมด
            </Link>
          </div>

          {/* Social Media Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary text-center mb-6">
              ติดตามเราบนโซเชียลมีเดีย
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Facebook Page */}
              <a
                href={BUSINESS_INFO.socialMedia.facebook.main}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.facebook.main.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-600">
                  {BUSINESS_INFO.socialFollowStats.facebook.main.metricText}
                </p>
              </a>

              {/* Facebook Personal */}
              <a
                href={BUSINESS_INFO.socialMedia.facebook.personal}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.facebook.personal.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-500">
                  {BUSINESS_INFO.socialFollowStats.facebook.personal.metricText}
                </p>
              </a>

              {/* Facebook Group */}
              <a
                href={BUSINESS_INFO.socialMedia.facebook.fcGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-700 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.facebook.fcGroup.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-700">
                  {BUSINESS_INFO.socialFollowStats.facebook.fcGroup.metricText}
                </p>
              </a>

              {/* TikTok */}
              <a
                href={BUSINESS_INFO.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-gray-900 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      TikTok
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.tiktok.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {BUSINESS_INFO.socialFollowStats.tiktok.metricText}
                </p>
              </a>

              {/* YouTube */}
              <a
                href={BUSINESS_INFO.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-600 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                      YouTube
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.youtube.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-red-600">
                  {BUSINESS_INFO.socialFollowStats.youtube.metricText}
                </p>
              </a>

              {/* Lemon8 */}
              <a
                href={BUSINESS_INFO.socialMedia.lemon8}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L19.82 5.63L16.55 11.37L23 12L16.55 12.63L19.82 18.37L13.09 15.74L12 22L10.91 15.74L4.18 18.37L7.45 12.63L1 12L7.45 11.37L4.18 5.63L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                      Lemon8
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.lemon8.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-yellow-600">
                  {BUSINESS_INFO.socialFollowStats.lemon8.metricText}
                </p>
              </a>

              {/* LINE */}
              <a
                href={BUSINESS_INFO.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transform hover:scale-105 active:scale-[0.95] transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-green-500 transition-colors">
                      LINE
                    </h3>
                    <p className="text-xs text-gray-500">
                      {BUSINESS_INFO.socialFollowStats.line.label}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-500">
                  {BUSINESS_INFO.socialFollowStats.line.metricText}
                </p>
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary text-center mb-6">แผนที่ร้าน</h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="aspect-video rounded-lg overflow-hidden">
                {mounted && mapEmbedUrl ? (
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    title="ที่ตั้งครูหนึ่งรถสวย รถมือสองเชียงใหม่"
                    aria-label="แผนที่ที่ตั้งร้านครูหนึ่งรถสวย"
                  ></iframe>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <div className="text-2xl mb-2">🗺️</div>
                      <div>กำลังโหลดแผนที่...</div>
                      <div className="text-sm mt-2">พิกัด: 18.8048977, 99.0301667</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                {mounted && mapOpenUrl ? (
                  <a
                    href={mapOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-600 transform hover:scale-105 active:scale-[0.95] transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    เปิดใน Google Maps
                  </a>
                ) : (
                  <div className="text-gray-500">กำลังโหลดลิงก์แผนที่...</div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                ติดต่อโดยตรง
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:0940649018"
                  className="flex items-center text-accent-700 hover:text-accent-600 font-semibold group"
                  aria-label="โทร 094-064-9018"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  094-064-9018
                </a>
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-700 font-semibold group"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  LINE: สอบถามเลย
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-accent">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                ที่ตั้งร้าน
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  เลขที่ 324 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี
                  <br />
                  ตำบลสันพระเนตร อำเภอสันทราย เชียงใหม่ 50210
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={createMapOpenUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transform hover:scale-105 active:scale-[0.95] transition-all duration-300"
                  >
                    Google Maps
                  </a>
                  <a
                    href="https://g.co/kgs/Fe9dhXt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-semibold transform hover:scale-105 active:scale-[0.95] transition-all duration-300"
                  >
                    รีวิว Google
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-primary text-center">
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-3 text-lg">
                  <span className="text-accent font-extrabold text-lg">Q:</span>
                  ติดต่อครูหนึ่งรถสวยได้อย่างไร?
                </summary>
                <div className="mt-4 pl-8 border-l-4 border-accent bg-accent/5 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    สามารถติดต่อได้หลายช่องทาง: โทร 094-064-9018, LINE, Facebook
                    หรือช่องทางโซเชียลมีเดียอื่นๆ ของเรา
                  </p>
                </div>
              </details>
              <details className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-3 text-lg">
                  <span className="text-accent font-extrabold text-lg">Q:</span>
                  เวลาทำการของร้าน?
                </summary>
                <div className="mt-4 pl-8 border-l-4 border-accent bg-accent/5 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    เปิดทุกวัน 9:00 - 20:00 น. วันหยุดราชการปกติ
                  </p>
                </div>
              </details>
              <details className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-3 text-lg">
                  <span className="text-accent font-extrabold text-lg">Q:</span>
                  สามารถนัดดูรถได้ไหม?
                </summary>
                <div className="mt-4 pl-8 border-l-4 border-accent bg-accent/5 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    ได้เลย! แนะนำให้นัดล่วงหน้าเพื่อให้ทีมงานเตรียมรถไว้รอ ติดต่อ 094-064-9018 หรือ
                    LINE
                  </p>
                </div>
              </details>
              <details className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-3 text-lg">
                  <span className="text-accent font-extrabold text-lg">Q:</span>
                  ครูหนึ่งรถสวยมีช่องทางโซเชียลมีเดียอะไรบ้าง?
                </summary>
                <div className="mt-4 pl-8 border-l-4 border-accent bg-accent/5 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    Facebook 1 ล้านติดตาม, TikTok 1.5 แสนติดตาม, YouTube 4 หมื่นติดตาม, Lemon8
                    26k+ติดตาม และ LINE สำหรับสอบถาม
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// SSR - Server Side Rendering
// ISR for better performance - contact page is mostly static
export async function getStaticProps() {
  return {
    props: { seoContact: require('../config/seo-keyword-map').SEO_KEYWORD_MAP.contact },
    revalidate: 1800, // 30 minutes - contact info may change occasionally
  };
}

import Link from 'next/link';
import SEO from '../components/SEO';
import { createMapEmbedUrl, createMapOpenUrl, getSiteLocation } from '../utils/siteLocation';

export default function Contact() {
  // ดึงพิกัดจาก utility
  const siteLocation = getSiteLocation();

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: 'https://chiangmaiusedcar.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ติดต่อเรา',
        item: 'https://chiangmaiusedcar.com/contact',
      },
    ],
  };

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

  // Organization Schema with Social Media
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'ครูหนึ่งรถสวย',
    alternateName: 'KN2Car',
    description: 'ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย 1 ปี',
    url: 'https://chiangmaiusedcar.com',
    telephone: '+66940649018',
    email: 'info@chiangmaiusedcar.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'เลขที่ 320 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี',
      addressLocality: 'สันพระเนตร',
      addressRegion: 'เชียงใหม่',
      postalCode: '50210',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteLocation.lat,
      longitude: siteLocation.lng,
    },
    openingHours: 'Mo-Su 09:00-20:00',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'THB',
    sameAs: [
      'https://www.facebook.com/KN2car',
      'https://www.facebook.com/nuengblues',
      'https://www.tiktok.com/@krunueng_usedcar',
      'https://youtube.com/@chiangraiusedcar',
      'https://s.lemon8-app.com/al/GgUmdUUsrT',
      'https://lin.ee/8ugfzstD',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+66940649018',
      contactType: 'customer service',
      availableLanguage: ['Thai'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    },
  };

  return (
    <>
      <SEO
        title="ติดต่อเรา - ครูหนึ่งรถสวย | รถมือสองเชียงใหม่ โทร 094-064-9018"
        description="ติดต่อครูหนึ่งรถสวยง่ายๆ ผ่านหลากหลายช่องทาง โทร 094-064-9018, LINE, Facebook 1 ล้านติดตาม, TikTok 1.5 แสนติดตาม, YouTube 4 หมื่นติดตาม | รถมือสองเชียงใหม่ คุณภาพดี"
        keywords="ติดต่อครูหนึ่งรถสวย,เบอร์โทรรถมือสองเชียงใหม่,LINE รถมือสอง,Facebook รถมือสอง,TikTok รถมือสอง,YouTube รถมือสอง,Lemon8 รถมือสอง,094-064-9018,สอบถามรถมือสอง,นัดดูรถ,ที่ตั้งร้านรถมือสอง"
        url="https://chiangmaiusedcar.com/contact"
        image="https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp"
        canonical="https://chiangmaiusedcar.com/contact"
        locale="th_TH"
        alternate={[{ href: 'https://chiangmaiusedcar.com/contact', hrefLang: 'th-TH' }]}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <main className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary to-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">ติดต่อเรา</h1>
            <p className="text-xl text-blue-100 mb-6">
              ครูหนึ่งรถสวย - ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">⏰ เปิดทุกวัน 9:00-20:00</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">📞 094-064-9018</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">📱 LINE สอบถาม</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-4">ช่องทางติดต่อ</h2>
          <p className="text-gray-600 text-center mb-12">เลือกช่องทางที่สะดวกสำหรับคุณ</p>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-bold text-primary mb-2">โทรศัพท์</h3>
              <a
                href="tel:0940649018"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent-600 transition-colors"
                aria-label="โทร 094-064-9018"
              >
                094-064-9018
              </a>
            </div>
            <div className="bg-accent/5 p-4 rounded-lg">
              <h3 className="font-bold text-primary mb-2">LINE</h3>
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold hover:text-accent-600 transition-colors"
              >
                @kruneungcar
              </a>
            </div>
            <div className="bg-gold/10 p-4 rounded-lg md:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-primary mb-2">เวลาทำการ</h3>
              <p className="text-gray-700">จันทร์ - อาทิตย์ เวลา 9:00 - 20:00 น.</p>
            </div>
          </div>

          {/* CTA - ลิงก์ไปหน้ารถทั้งหมด */}
          <div className="flex justify-center mb-12">
            <Link
              href="/all-cars"
              className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ดูรถทั้งหมด 🚗
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
                href="https://www.facebook.com/KN2car"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">เพจหลัก</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-600">1 ล้าน ติดตาม</p>
              </a>

              {/* Facebook Personal */}
              <a
                href="https://www.facebook.com/nuengblues"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
                      Facebook
                    </h3>
                    <p className="text-xs text-gray-500">ส่วนตัว</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-500">1 แสน+ ติดตาม</p>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@krunueng_usedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-gray-900 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      TikTok
                    </h3>
                    <p className="text-xs text-gray-500">วิดีโอสั้น</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">1.5 แสน ติดตาม</p>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@chiangraiusedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                      YouTube
                    </h3>
                    <p className="text-xs text-gray-500">วิดีโอรีวิว</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-red-600">4 หมื่น+ ติดตาม</p>
              </a>

              {/* Lemon8 */}
              <a
                href="https://s.lemon8-app.com/al/GgUmdUUsrT"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L19.82 5.63L16.55 11.37L23 12L16.55 12.63L19.82 18.37L13.09 15.74L12 22L10.91 15.74L4.18 18.37L7.45 12.63L1 12L7.45 11.37L4.18 5.63L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                      Lemon8
                    </h3>
                    <p className="text-xs text-gray-500">ไลฟ์สไตล์</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-yellow-600">26k+ ติดตาม</p>
              </a>

              {/* LINE */}
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-800 group-hover:text-green-500 transition-colors">
                      LINE
                    </h3>
                    <p className="text-xs text-gray-500">แชทสด</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-500">สอบถามเลย</p>
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary text-center mb-6">แผนที่ร้าน</h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={createMapEmbedUrl(17)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ที่ตั้งครูหนึ่งรถสวย รถมือสองเชียงใหม่"
                  aria-label="แผนที่ที่ตั้งร้านครูหนึ่งรถสวย"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a
                  href={createMapOpenUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-600 transform hover:scale-105 transition-all duration-300"
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
                  className="flex items-center text-accent hover:text-accent-600 font-semibold group"
                  aria-label="โทร 094-064-9018"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"
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
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"
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
                  เลขที่ 320 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี
                  <br />
                  ตำบลสันพระเนตร อำเภอสันทราย เชียงใหม่ 50210
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={createMapOpenUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
                  >
                    📍 Google Maps
                  </a>
                  <a
                    href="https://g.co/kgs/Fe9dhXt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                  >
                    ⭐ รีวิว Google
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
              <details className="bg-white p-6 rounded-lg shadow-md group">
                <summary className="font-semibold text-primary cursor-pointer flex justify-between items-center">
                  <span>Q: ติดต่อครูหนึ่งรถสวยได้อย่างไร?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className="pt-4 text-gray-700">
                  A: สามารถติดต่อได้หลายช่องทาง: โทร 094-064-9018, LINE, Facebook
                  หรือช่องทางโซเชียลมีเดียอื่นๆ ของเรา
                </div>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md group">
                <summary className="font-semibold text-primary cursor-pointer flex justify-between items-center">
                  <span>Q: เวลาทำการของร้าน?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className="pt-4 text-gray-700">
                  A: เปิดทุกวัน 9:00 - 20:00 น. วันหยุดราชการปกติ
                </div>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md group">
                <summary className="font-semibold text-primary cursor-pointer flex justify-between items-center">
                  <span>Q: สามารถนัดดูรถได้ไหม?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className="pt-4 text-gray-700">
                  A: ได้เลย! แนะนำให้นัดล่วงหน้าเพื่อให้ทีมงานเตรียมรถไว้รอ ติดต่อ 094-064-9018 หรือ
                  LINE
                </div>
              </details>
              <details className="bg-white p-6 rounded-lg shadow-md group">
                <summary className="font-semibold text-primary cursor-pointer flex justify-between items-center">
                  <span>Q: ครูหนึ่งรถสวยมีช่องทางโซเชียลมีเดียอะไรบ้าง?</span>
                  <svg
                    className="w-5 h-5 transform group-open:rotate-180 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className="pt-4 text-gray-700">
                  A: Facebook 1 ล้านติดตาม, TikTok 1.5 แสนติดตาม, YouTube 4 หมื่นติดตาม, Lemon8
                  26k+ติดตาม และ LINE สำหรับสอบถาม
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
export async function getServerSideProps() {
  return {
    props: {},
  };
}

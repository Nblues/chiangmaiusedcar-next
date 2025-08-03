import Link from 'next/link';
import SEO from '../components/SEO';

export default function Contact() {
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
      streetAddress: '123 ถนนห้วยแก้ว',
      addressLocality: 'เมือง',
      addressRegion: 'เชียงใหม่',
      postalCode: '50100',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.7986111,
      longitude: 99.0144444,
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
        image="https://chiangmaiusedcar.com/herobanner/kn2carsbanner.png"
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
              <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center space-x-2 border border-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>เปิดทุกวัน 9:00-20:00</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center space-x-2 border border-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>094-064-9018</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center space-x-2 border border-white/10">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <span>LINE สอบถาม</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Social Media Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary text-center mb-4">
              ติดตามเราบนโซเชียลมีเดีย
            </h2>
            <p className="text-gray-600 text-center mb-8">
              เชื่อมต่อกับเราผ่านช่องทางที่คุณชื่นชอบ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/KN2car"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-blue-50 p-6 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-base leading-5 mb-1 truncate">
                        Facebook
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">เพจหลัก</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      1 ล้าน ติดตาม
                    </div>
                  </div>
                </div>
              </a>

              {/* Facebook Personal */}
              <a
                href="https://www.facebook.com/nuengblues"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-indigo-50 p-6 rounded-3xl shadow-lg border border-indigo-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors text-base leading-5 mb-1 truncate">
                        Facebook
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">ส่วนตัว</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      1 แสน+ ติดตาม
                    </div>
                  </div>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@krunueng_usedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/5 to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors text-base leading-5 mb-1 truncate">
                        TikTok
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">วิดีโอสั้น</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      1.5 แสน ติดตาม
                    </div>
                  </div>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@chiangraiusedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-red-50 p-6 rounded-3xl shadow-lg border border-red-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors text-base leading-5 mb-1 truncate">
                        YouTube
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">วิดีโอรีวิว</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      4 หมื่น+ ติดตาม
                    </div>
                  </div>
                </div>
              </a>

              {/* Lemon8 */}
              <a
                href="https://s.lemon8-app.com/al/GgUmdUUsrT"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-yellow-50 p-6 rounded-3xl shadow-lg border border-yellow-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L19.82 5.63L16.55 11.37L23 12L16.55 12.63L19.82 18.37L13.09 15.74L12 22L10.91 15.74L4.18 18.37L7.45 12.63L1 12L7.45 11.37L4.18 5.63L10.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors text-base leading-5 mb-1 truncate">
                        Lemon8
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">ไลฟ์สไตล์</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      26k+ ติดตาม
                    </div>
                  </div>
                </div>
              </a>

              {/* LINE */}
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-white to-green-50 p-6 rounded-3xl shadow-lg border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden h-52 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors text-base leading-5 mb-1 truncate">
                        LINE
                      </h3>
                      <p className="text-xs text-gray-500 leading-4">แชทสด</p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2.5 rounded-xl text-center font-semibold text-xs leading-4">
                      สอบถามเลย
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact & Location Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary text-center mb-8">ติดต่อและนัดดูรถ</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Direct Contact */}
              <div className="group relative bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    ติดต่อโดยตรง
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:0940649018"
                      className="flex items-center text-accent hover:text-accent-600 font-semibold text-lg group/phone"
                    >
                      <svg
                        className="w-5 h-5 mr-3 group-hover/phone:scale-110 transition-transform"
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
                      className="flex items-center text-green-600 hover:text-green-700 font-semibold text-lg group/line"
                    >
                      <svg
                        className="w-5 h-5 mr-3 group-hover/line:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                      </svg>
                      LINE แชทสด
                    </a>
                    <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                      <p className="text-sm text-gray-600 mb-2">เวลาทำการ</p>
                      <p className="font-semibold text-primary">
                        จันทร์ - อาทิตย์ | 9:00 - 20:00 น.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="group relative bg-gradient-to-br from-white to-amber-50 p-8 rounded-3xl shadow-lg border border-amber-100 hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ที่ตั้งร้าน
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      123 ถนนห้วยแก้ว อำเภอเมือง
                      <br />
                      จังหวัดเชียงใหม่ 50100
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://www.google.com/maps/place/ครูหนึ่งรถสวย+รถมือสอง/@18.7986111,99.0144444,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/maps inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 group-hover/maps:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Google Maps</span>
                      </a>
                      <a
                        href="https://g.co/kgs/Fe9dhXt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/review inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        <svg
                          className="w-5 h-5 group-hover/review:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>รีวิว Google</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <Link
              href="/all-cars"
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>ดูรถทั้งหมด</span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-primary">คำถามที่พบบ่อย</h2>
              <p className="text-gray-600 text-lg">ข้อมูลที่ลูกค้าสนใจทราบบ่อยที่สุด</p>
            </div>
            <div className="space-y-6">
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <details className="p-8">
                  <summary className="font-bold text-primary text-lg cursor-pointer flex justify-between items-center group-hover:text-primary-600 transition-colors">
                    <span>ติดต่อครูหนึ่งรถสวยได้อย่างไร?</span>
                    <svg
                      className="w-6 h-6 transform group-open:rotate-180 transition-transform duration-300"
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
                  <div className="pt-6 text-gray-700 text-lg leading-relaxed">
                    โทร <strong className="text-accent">094-064-9018</strong>,{' '}
                    <strong className="text-green-600">LINE</strong>,{' '}
                    <strong className="text-blue-600">Facebook</strong>{' '}
                    หรือช่องทางโซเชียลมีเดียอื่นๆ ของเรา
                  </div>
                </details>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <details className="p-8">
                  <summary className="font-bold text-primary text-lg cursor-pointer flex justify-between items-center group-hover:text-primary-600 transition-colors">
                    <span>เวลาทำการของร้าน?</span>
                    <svg
                      className="w-6 h-6 transform group-open:rotate-180 transition-transform duration-300"
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
                  <div className="pt-6 text-gray-700 text-lg leading-relaxed">
                    <strong className="text-primary">เปิดทุกวัน 9:00 - 20:00 น.</strong>{' '}
                    วันหยุดราชการปกติ
                  </div>
                </details>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <details className="p-8">
                  <summary className="font-bold text-primary text-lg cursor-pointer flex justify-between items-center group-hover:text-primary-600 transition-colors">
                    <span>สามารถนัดดูรถได้ไหม?</span>
                    <svg
                      className="w-6 h-6 transform group-open:rotate-180 transition-transform duration-300"
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
                  <div className="pt-6 text-gray-700 text-lg leading-relaxed">
                    <strong className="text-green-600">ได้เลย!</strong>{' '}
                    แนะนำให้นัดล่วงหน้าเพื่อให้ทีมงานเตรียมรถไว้รอ ติดต่อ{' '}
                    <strong className="text-accent">094-064-9018</strong> หรือ{' '}
                    <strong className="text-green-600">LINE</strong>
                  </div>
                </details>
              </div>

              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <details className="p-8">
                  <summary className="font-bold text-primary text-lg cursor-pointer flex justify-between items-center group-hover:text-primary-600 transition-colors">
                    <span>ช่องทางโซเชียลมีเดียมีอะไรบ้าง?</span>
                    <svg
                      className="w-6 h-6 transform group-open:rotate-180 transition-transform duration-300"
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
                  <div className="pt-6 text-gray-700 text-lg leading-relaxed">
                    <strong className="text-blue-600">Facebook</strong> 1 ล้านติดตาม,{' '}
                    <strong className="text-gray-800">TikTok</strong> 1.5 แสนติดตาม,{' '}
                    <strong className="text-red-600">YouTube</strong> 4 หมื่นติดตาม,{' '}
                    <strong className="text-yellow-600">Lemon8</strong> 26k+ติดตาม และ{' '}
                    <strong className="text-green-600">LINE</strong> สำหรับสอบถาม
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

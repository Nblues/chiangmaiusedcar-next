import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import FAQSection from '../components/FAQSection';

export default function Home({ cars }) {
  // Client-only render for Facebook reviews
  const [showFbReviews, setShowFbReviews] = useState(false);
  useEffect(() => {
    setShowFbReviews(true);
  }, []);

  // Fallback to empty array if cars is undefined or null
  const safeCars = Array.isArray(cars) ? cars : [];

  return (
    <div>
      {/* SEO Meta Tags + Open Graph + Twitter Card */}
      <SEO
        title="รถมือสองเชียงใหม่ คุณภาพดี ฟรีดาวน์ ผ่อนถูก"
        description="ครูหนึ่งรถสวย ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนถูกที่สุด รับประกัน 1 ปี บริการสินเชื่อครบวงจร โทร 094-064-9018"
        keywords="รถมือสองเชียงใหม่, ครูหนึ่งรถสวย, รถบ้าน, ฟรีดาวน์, ผ่อนรถ, สินเชื่อรถยนต์, รถยนต์มือสอง, รถราคาดี, รับประกันรถ, รถมือสองคุณภาพ"
      />
      {/* ===== HERO BANNER ===== */}
      <header
        className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden top-0 left-0 font-prompt mt-0 md:mt-0"
        aria-label="Hero Banner รถมือสองเชียงใหม่ SEO 2025"
      >
        <Image
          id="hero-img"
          src="/herobanner/kn2carsbanner.png"
          alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectFit: 'cover' }}
          priority
        />
      </header>
      {/* ===== HERO CARD ===== */}
      <section id="hero" className="relative">
        <div className="hero-card mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-6 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
              รถมือสองเชียงใหม่
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-4">
              คุณภาพระดับพรีเมียม
            </h2>
            <p className="text-base leading-relaxed">
              ครูหนึ่งรถสวย ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์&nbsp;
              ผ่อนถูก&nbsp;รับประกันหลังการขาย&nbsp;พร้อมบริการสินเชื่อครบวงจร
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
            <a
              href="https://lin.ee/cJuakxZ"
              className="btn-primary text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              สอบถามเลย
            </a>
            <a href="#recommended-cars" className="btn-secondary">
              ดูรถทั้งหมด
            </a>
          </div>
        </div>
        <style jsx>{`
          .hero-card {
            max-width: 960px;
            width: 90%;
          }
          .btn-primary,
          .btn-secondary {
            display: inline-block;
            text-align: center;
            font-weight: 600;
            border-radius: 9999px;
            padding: 0.6rem 1.5rem;
            font-size: 1rem;
          }
          .btn-primary {
            background: #ffb200;
            color: #fff;
          }
          .btn-secondary {
            border: 2px solid #0036a0;
            color: #0036a0;
          }
          @media (min-width: 768px) {
            .btn-primary,
            .btn-secondary {
              padding: 0.5rem 1.25rem;
              font-size: 0.95rem;
            }
          }
        `}</style>
      </section>
      {/* Removed duplicate/old navbar. Main Navbar component is used globally. */}
      {/* Featured Cars Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-b from-white via-gold/10 to-gold/5 font-prompt">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-prompt">รถแนะนำ</h2>
          <p className="text-lg text-gold max-w-2xl mx-auto font-prompt">
            รถมือสองคุณภาพดีที่คัดสรรมาเป็นพิเศษ พร้อมรับประกันและบริการหลังการขาย
          </p>
        </div>
        <section aria-label="รถแนะนำ" className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {safeCars.slice(0, 8).map(car => (
            <article
              key={car.id}
              className="group bg-white rounded-3xl shadow-2xl hover:shadow-gold transition-all duration-300 overflow-hidden border-2 border-gold/40 hover:border-primary flex flex-col h-full relative font-prompt"
              itemScope
              itemType="https://schema.org/Product"
            >
              <Link
                href={`/car/${car.handle}`}
                className="block focus:outline-none"
                tabIndex={0}
                aria-label={`ดูรายละเอียดรถ ${car.title}`}
              >
                <figure className="relative w-full h-48 md:h-56 flex items-center justify-center overflow-hidden bg-gold/10">
                  <Image
                    src={
                      Array.isArray(car.images) && car.images.length > 0
                        ? car.images[0]?.url
                        : '/cover.jpg'
                    }
                    alt={car.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain transition-transform duration-300 border-b-2 border-gold bg-white"
                    itemProp="image"
                  />
                  <figcaption className="absolute top-4 left-4 bg-gold text-primary px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    รถแนะนำ
                  </figcaption>
                  <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    ใหม่
                  </span>
                </figure>
                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-extrabold text-xl text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2 font-prompt"
                    itemProp="name"
                  >
                    {car.title}
                  </h3>
                  <p
                    className="text-2xl font-bold text-gold mb-4 font-prompt"
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                  >
                    <span itemProp="price">฿{Number(car.price.amount).toLocaleString()}</span>
                    <meta itemProp="priceCurrency" content="THB" />
                  </p>
                  <ul
                    className="text-sm text-black mb-4 space-y-1 font-prompt"
                    aria-label="จุดเด่นรถ"
                  >
                    <li>ฟรีดาวน์</li>
                    <li>ผ่อนถูก</li>
                    <li>รับประกัน 1 ปี</li>
                  </ul>
                  <div className="flex items-center justify-between mt-auto mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-primary border border-gold">
                      รับประกัน 1 ปี
                    </span>
                    <span className="text-xs text-gold">SEO 2025</span>
                  </div>
                  {/* ปุ่ม LINE โทร แชร์ */}
                  <div className="flex gap-2 mt-2">
                    <a
                      href="https://lin.ee/cJuakxZ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="สอบถามผ่าน LINE ครูหนึ่งรถสวย"
                      title="สอบถามผ่าน LINE ครูหนึ่งรถสวย"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                      </svg>
                      LINE
                    </a>
                    <a
                      href="tel:0940649018"
                      className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="โทร 094-064-9018"
                      title="โทร 094-064-9018"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C7.163 23 1 16.837 1 9V8a2 2 0 012-2z"
                        />
                      </svg>
                      โทร
                    </a>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="แชร์รถคันนี้"
                      title="แชร์รถคันนี้"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: car.title,
                            url: `/car/${car.handle}`,
                          });
                        } else {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.origin + '/car/' + car.handle,
                            )}`,
                          );
                        }
                      }}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.83-4H7.83A3 3 0 105 8c0 .13.01.26.03.39l-2.02 1.01A3 3 0 003 15a3 3 0 002.83-2h4.34A3 3 0 1015 8zm-8 7a1 1 0 110-2 1 1 0 010 2zm8-12a1 1 0 110 2 1 1 0 010-2zm0 14a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      แชร์
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>

        {/* View All Cars Button */}
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            className="inline-flex items-center bg-primary hover:bg-gold text-white hover:text-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 border-2 border-gold font-prompt"
            aria-label="ดูรถทั้งหมด ครูหนึ่งรถสวย"
          >
            <span>ดูรถทั้งหมด</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </main>
      {/* Facebook Review Embeds (เฉพาะรีวิวจริงจาก Facebook) */}
      {showFbReviews && (
        <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center my-8">
          <section aria-label="รีวิวลูกค้าจริง Facebook" className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6 font-prompt">
              รีวิวจากลูกค้าจริง
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {/* 9 รีวิวจริงจากเพจหลัก */}
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Foonmaxx%2Fposts%2Fpfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl&show_text=true&width=500"
                width="100%"
                height="152"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review oonmaxx"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftai.thanchanok.7%2Fposts%2Fpfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol&show_text=true&width=500"
                width="100%"
                height="196"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review tai.thanchanok.7"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongnoo.kookkook%2Fposts%2Fpfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl&show_text=true&width=500"
                width="100%"
                height="196"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review nongnoo.kookkook"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNaowaratUpachal%2Fposts%2Fpfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl&show_text=true&width=500"
                width="100%"
                height="262"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review NaowaratUpachal"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongtee.myson%2Fposts%2Fpfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el&show_text=true&width=500"
                width="100%"
                height="174"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review nongtee.myson"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl%26id%3D100004184059361&show_text=true&width=500"
                width="100%"
                height="196"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review 100004184059361"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fna.mo.payya.ym%2Fposts%2Fpfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l&show_text=true&width=500"
                width="100%"
                height="174"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review na.mo.payya.ym"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmalee.daengprasert%2Fposts%2Fpfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl&show_text=true&width=500"
                width="100%"
                height="174"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review malee.daengprasert"
                loading="lazy"
              ></iframe>
              <iframe
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fchalida.twoslim%2Fposts%2Fpfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l&show_text=true&width=500"
                width="100%"
                height="152"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Review chalida.twoslim"
                loading="lazy"
              ></iframe>
            </div>
          </section>
        </div>
      )}
      {/* Customer Reviews Section (SEO/UX 2025) ถูกลบตามคำสั่ง */}
      {/* <ReviewSection /> */}
      {/* FAQ Section (SEO/UX 2025) */}
      <FAQSection />
      {/* Organization Schema (SEO 2025) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่',
            url: 'https://chiangmaiusedcar.com',
            logo: '/logo/logo_main.png',
            sameAs: [
              'https://facebook.com/krunuengusedcar',
              'https://www.tiktok.com/@krunueng_usedcar',
              'https://youtube.com/@chiangraiusedcar',
            ],
          }),
        }}
      />
    </div>
  );
}

export async function getStaticProps() {
  let cars = [];
  try {
    const result = await getAllCars();
    cars = Array.isArray(result) ? result.slice(0, 8) : [];
  } catch (e) {
    console.error('getAllCars error:', e);
    cars = [];
  }
  return { props: { cars }, revalidate: 600 };
}

import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

export default function Home({ cars }) {
  // Facebook reviews: render only client
  const [showFbReviews, setShowFbReviews] = useState(false);
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    setShowFbReviews(true);
    // load saved cars (localStorage)
    setSaved(JSON.parse(localStorage.getItem('savedCars') || '[]'));
  }, []);

  // Save/unsave cars
  function toggleSave(carId) {
    let s = JSON.parse(localStorage.getItem('savedCars') || '[]');
    if (s.includes(carId)) s = s.filter(id => id !== carId);
    else s.push(carId);
    setSaved(s);
    localStorage.setItem('savedCars', JSON.stringify(s));
  }

  const safeCars = Array.isArray(cars) ? cars : [];

  // Breadcrumb Schema
  const breadcrumbList = [{ name: 'หน้าแรก', url: 'https://chiangmaiusedcar.com/' }];

  // FAQ Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ดาวน์ 0% จริงไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชันและไฟแนนซ์',
        },
      },
      {
        '@type': 'Question',
        name: 'ติดเครดิตบูโรออกได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สอบถามข้อมูลได้ทาง LINE, ส่วนมากไฟแนนซ์ให้โอกาส! แจ้งรายละเอียดกับทีมงาน',
        },
      },
      {
        '@type': 'Question',
        name: 'มีรับประกันไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม',
        },
      },
    ],
  };

  return (
    <div>
      {/* SEO */}
      <SEO
        title="รถมือสองเชียงใหม่ ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย"
        description="ศูนย์รวมรถบ้านเชียงใหม่ ฟรีดาวน์ ผ่อนถูก รับประกัน 1 ปี ทุกคัน รีวิวลูกค้าจริง"
        keywords="รถมือสองเชียงใหม่, รถบ้าน, ฟรีดาวน์, ผ่อนรถ, รถคุณภาพ, ครูหนึ่งรถสวย"
        url="https://chiangmaiusedcar.com/"
        image="https://chiangmaiusedcar.com/cover.jpg"
        breadcrumb={breadcrumbList}
        faqJsonld={faqJsonLd}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbList.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              item: item.url,
            })),
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO Banner */}
      <header className="relative w-full min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/herobanner/kn2carsbanner.png"
          alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0"
          priority
        />
      </header>

      {/* HERO Card */}
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
              ครูหนึ่งรถสวย ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย
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
            <Link href="#recommended-cars" className="btn-secondary">
              ดูรถทั้งหมด
            </Link>
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
        `}</style>
      </section>

      {/* Featured Cars */}
      <main
        className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-b from-white via-gold/10 to-gold/5 font-prompt"
        id="recommended-cars"
      >
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
              <Link href={`/car/${car.handle}`} className="block focus:outline-none" tabIndex={0}>
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
                    loading="lazy"
                  />
                  <figcaption className="absolute top-4 left-4 bg-gold text-primary px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    รถแนะนำ
                  </figcaption>
                  {car.tags?.includes('ใหม่') && (
                    <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      ใหม่
                    </span>
                  )}
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
                  <ul className="text-sm text-black mb-4 space-y-1 font-prompt">
                    {car.tags?.includes('ฟรีดาวน์') && <li>ฟรีดาวน์</li>}
                    {car.tags?.includes('ผ่อนถูก') && <li>ผ่อนถูก</li>}
                    <li>รับประกัน 1 ปี</li>
                  </ul>
                  <div className="flex items-center justify-between mt-auto mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-primary border border-gold">
                      รับประกัน 1 ปี
                    </span>
                    <span className="text-xs text-gold">SEO 2025</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <a
                      href="https://lin.ee/cJuakxZ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="สอบถามผ่าน LINE ครูหนึ่งรถสวย"
                    >
                      LINE
                    </a>
                    <a
                      href={`tel:0940649018`}
                      className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="โทร 094-064-9018"
                    >
                      โทร
                    </a>
                    {/* แชร์ */}
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow`}
                      aria-label="แชร์รถคันนี้"
                      onClick={e => {
                        e.preventDefault();
                        if (navigator.share) {
                          navigator.share({ title: car.title, url: `/car/${car.handle}` });
                        } else {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.origin + '/car/' + car.handle,
                            )}`,
                          );
                        }
                      }}
                    >
                      แชร์
                    </button>
                    {/* บันทึก/Unsave */}
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold shadow border ${
                        saved.includes(car.id)
                          ? 'bg-pink-600 text-white'
                          : 'bg-white text-pink-600 border-pink-400'
                      }`}
                      onClick={e => {
                        e.preventDefault();
                        toggleSave(car.id);
                      }}
                      aria-label={saved.includes(car.id) ? 'ลบออกจากที่บันทึก' : 'บันทึกรถ'}
                      title="บันทึกดูทีหลัง"
                    >
                      <span className="material-icons" style={{ fontSize: 16 }}>
                        {saved.includes(car.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            className="inline-flex items-center bg-primary hover:bg-gold text-white hover:text-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 border-2 border-gold font-prompt"
            aria-label="ดูรถทั้งหมด ครูหนึ่งรถสวย"
          >
            <span>ดูรถทั้งหมด</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </main>

      {/* รีวิว Facebook 9 รีวิวจริง */}
      {showFbReviews && (
        <section className="max-w-6xl mx-auto py-8">
          <h2 className="text-xl font-bold mb-4 text-primary font-prompt text-center">
            รีวิวจากลูกค้าจริงบน Facebook
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              // 9 embed url (copy ของคุณเองมาได้เลย)
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Foonmaxx%2Fposts%2Fpfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftai.thanchanok.7%2Fposts%2Fpfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongnoo.kookkook%2Fposts%2Fpfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNaowaratUpachal%2Fposts%2Fpfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongtee.myson%2Fposts%2Fpfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl%26id%3D100004184059361&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fna.mo.payya.ym%2Fposts%2Fpfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmalee.daengprasert%2Fposts%2Fpfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl&show_text=true&width=500',
              'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fchalida.twoslim%2Fposts%2Fpfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l&show_text=true&width=500',
            ].map((src, i) => (
              <iframe
                key={i}
                src={src}
                width="100%"
                height="180"
                style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={`Facebook Review ${i + 1}`}
                loading="lazy"
              ></iframe>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="bg-gray-50 py-8 mt-6 rounded-2xl max-w-4xl mx-auto shadow">
        <h2 className="text-xl font-bold mb-4 text-primary font-prompt">คำถามที่พบบ่อย</h2>
        <div className="space-y-4">
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-primary cursor-pointer">ดาวน์ 0% จริงไหม?</summary>
            <div className="text-gray-700 pt-2">
              จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชันและไฟแนนซ์
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-primary cursor-pointer">
              ติดเครดิตบูโรออกได้ไหม?
            </summary>
            <div className="text-gray-700 pt-2">
              สอบถามข้อมูลได้ทาง LINE, ส่วนมากไฟแนนซ์ให้โอกาส! แจ้งรายละเอียดกับทีมงาน
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-primary cursor-pointer">มีรับประกันไหม?</summary>
            <div className="text-gray-700 pt-2">รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม</div>
          </details>
        </div>
      </section>
    </div>
  );
}

// SSG (getStaticProps)
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

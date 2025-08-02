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
        <div className="hero-card mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-6 py-8 rounded-2xl border border-orange-300 bg-white shadow-lg">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              รถมือสองเชียงใหม่
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-4">
              คุณภาพระดับพรีเมียม
            </h2>
            <p className="text-base leading-relaxed text-gray-800 font-medium">
              ครูหนึ่งรถสวย ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนสบาย
              ออกรถง่ายไม่ยุ่งยาก
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
            รถแนะนำเข้าใหม่วันนี้
          </h2>
          <div className="max-w-4xl mx-auto font-prompt">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                www.chiangmaiusedcar.com
              </p>

              <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">รถบ้านแท้</div>
                  <div className="text-xs font-bold text-red-600">เกรด A</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">มือเดียว</div>
                  <div className="text-xs font-bold text-red-600">สวยกริบ</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">ไมล์น้อย</div>
                  <div className="text-xs font-bold text-red-600">ใช้งานน้อย</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">ประวัติดี</div>
                  <div className="text-xs font-bold text-red-600">ตรวจสอบได้</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">ไม่มีชนหนัก</div>
                  <div className="text-xs font-bold text-red-600">ไม่จมน้ำ</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">โอนฟรี</div>
                  <div className="text-xs font-bold text-red-600">ส่งฟรีทั่วไทย</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">รับประกัน 1 ปี</div>
                  <div className="text-xs font-bold text-red-600">ไม่จำกัด ก.ม.</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">รถมีเล่ม</div>
                  <div className="text-xs font-bold text-red-600">ถูกกฎหมาย</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg h-12 flex flex-col justify-center">
                  <div className="font-bold text-xs text-gray-900">ซื้อโดยตรง</div>
                  <div className="text-xs font-bold text-red-600">จากเจ้าของ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section
          aria-label="รถเข้าใหม่แนะนำวันนี้"
          className="grid gap-8 grid-cols-2 lg:grid-cols-4"
        >
          {safeCars.slice(0, 8).map(car => (
            <article
              key={car.id}
              className="group bg-white rounded-3xl shadow-2xl hover:shadow-orange-600/50 transition-all duration-300 overflow-hidden border-2 border-orange-600/40 hover:border-primary flex flex-col h-full relative font-prompt"
              itemScope
              itemType="https://schema.org/Product"
            >
              <Link href={`/car/${car.handle}`} className="block focus:outline-none" tabIndex={0}>
                <figure className="relative w-full h-48 md:h-56 flex items-center justify-center overflow-hidden bg-orange-600/10">
                  <Image
                    src={
                      Array.isArray(car.images) && car.images.length > 0
                        ? car.images[0]?.url
                        : '/cover.jpg'
                    }
                    alt={car.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-contain transition-transform duration-300 border-b-2 border-orange-600 bg-white"
                    itemProp="image"
                    loading="lazy"
                  />
                  <figcaption className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    รถแนะนำ
                  </figcaption>
                  {car.tags?.includes('ใหม่') && (
                    <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      ใหม่
                    </span>
                  )}
                </figure>
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="font-extrabold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 font-prompt"
                    itemProp="name"
                  >
                    {car.title}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="text-2xl font-bold text-orange-600 font-prompt"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <span itemProp="price">฿{Number(car.price.amount).toLocaleString()}</span>
                      <meta itemProp="priceCurrency" content="THB" />
                    </p>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                      ส่งฟรี!
                    </span>
                  </div>
                  <ul className="text-sm text-gray-800 mb-3 space-y-1 font-prompt font-medium">
                    {car.tags?.includes('ฟรีดาวน์') && (
                      <li className="text-blue-600">✓ ฟรีดาวน์</li>
                    )}
                    {car.tags?.includes('ผ่อนถูก') && <li className="text-blue-600">✓ ผ่อนถูก</li>}
                    <li className="text-gray-900">✓ รับประกัน 1 ปี</li>
                  </ul>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href="https://lin.ee/cJuakxZ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
                      aria-label="สอบถามผ่าน LINE ครูหนึ่งรถสวย"
                    >
                      LINE
                    </a>
                    <a
                      href={`tel:0940649018`}
                      className="flex-1 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow"
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
                    {/* บันทึก/Unsave - ไอคอนดาว */}
                    <button
                      type="button"
                      className={`flex-1 flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold shadow border transition-all duration-200 ${
                        saved.includes(car.id)
                          ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-orange-600 hover:text-orange-600'
                      }`}
                      onClick={e => {
                        e.preventDefault();
                        toggleSave(car.id);
                      }}
                      aria-label={saved.includes(car.id) ? 'ลบออกจากที่บันทึก' : 'บันทึกรถ'}
                      title="บันทึกดูทีหลัง"
                    >
                      <svg
                        className="w-4 h-4"
                        fill={saved.includes(car.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={saved.includes(car.id) ? 0 : 2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
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
            className="inline-flex items-center bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 border-2 border-orange-600 font-prompt"
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
        <section className="max-w-7xl mx-auto py-12 px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-prompt">
              รีวิวจากลูกค้าจริง
            </h2>
            <p className="text-lg text-orange-600 font-prompt">
              ความประทับใจจากลูกค้าที่เลือกใช้บริการ ครูหนึ่งรถสวย
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                url: 'https://www.facebook.com/oonmaxx/posts/pfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Foonmaxx%2Fposts%2Fpfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/tai.thanchanok.7/posts/pfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Ftai.thanchanok.7%2Fposts%2Fpfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/nongnoo.kookkook/posts/pfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongnoo.kookkook%2Fposts%2Fpfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/NaowaratUpachal/posts/pfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNaowaratUpachal%2Fposts%2Fpfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/nongtee.myson/posts/pfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fnongtee.myson%2Fposts%2Fpfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/permalink.php?story_fbid=pfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl&id=100004184059361',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl%26id%3D100004184059361&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/na.mo.payya.ym/posts/pfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fna.mo.payya.ym%2Fposts%2Fpfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/malee.daengprasert/posts/pfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fmalee.daengprasert%2Fposts%2Fpfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl&show_text=true&width=500',
              },
              {
                url: 'https://www.facebook.com/chalida.twoslim/posts/pfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l',
                embed:
                  'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fchalida.twoslim%2Fposts%2Fpfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l&show_text=true&width=500',
              },
            ].map((review, i) => (
              <article
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-60"
              >
                <div className="relative h-full">
                  <iframe
                    src={review.embed}
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={`รีวิวลูกค้า ${i + 1} - ครูหนึ่งรถสวย`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-colors pointer-events-auto z-10"
                      aria-label={`ดูรีวิวเต็มบน Facebook - รีวิว ${i + 1}`}
                    >
                      ดูเต็ม
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.facebook.com/chiangmaiusedcar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
              aria-label="ดูรีวิวเพิ่มเติมบน Facebook ครูหนึ่งรถสวย"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>ดูรีวิวเพิ่มเติม</span>
            </a>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="bg-gray-50 py-8 mt-6 rounded-2xl max-w-4xl mx-auto shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 font-prompt px-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 px-4">
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">ดาวน์ 0% จริงไหม?</summary>
            <div className="text-gray-700 pt-2 font-medium">
              จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชันและไฟแนนซ์
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">
              ติดเครดิตบูโรออกได้ไหม?
            </summary>
            <div className="text-gray-700 pt-2 font-medium">
              สอบถามข้อมูลได้ทาง LINE, ส่วนมากไฟแนนซ์ให้โอกาส! แจ้งรายละเอียดกับทีมงาน
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">มีรับประกันไหม?</summary>
            <div className="text-gray-700 pt-2 font-medium">
              รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม
            </div>
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

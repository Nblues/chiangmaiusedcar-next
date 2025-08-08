import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SEO from '../../components/SEO';

export default function BlogImages() {
  const blogImages = [
    {
      src: '/images/blog/how-to-buy-used-car-chiangmai/banner.png',
      alt: 'วิธีซื้อรถมือสองเชียงใหม่',
      title: 'วิธีซื้อรถมือสองเชียงใหม่',
      category: 'คำแนะนำการซื้อรถ',
    },
    {
      src: '/images/blog/promotion-free-down/bannercars.png',
      alt: 'โปรโมชันฟรีดาวน์',
      title: 'โปรโมชันฟรีดาวน์',
      category: 'โปรโมชัน',
    },
    {
      src: '/images/blog/recommended-cars/banner2.png',
      alt: 'รถแนะนำ',
      title: 'รถยนต์แนะนำ',
      category: 'รถแนะนำ',
    },
    {
      src: '/images/reviewers/outdoorbanner.png',
      alt: 'แบนเนอร์รีวิว',
      title: 'แบนเนอร์รีวิวลูกค้า',
      category: 'รีวิว',
    },
  ];

  return (
    <div>
      <SEO
        title="รูปภาพข่าวสารและรีวิว - ครูหนึ่งรถสวย"
        description="รวมรูปภาพจากข่าวสารและรีวิวของลูกค้า ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        keywords="รูปภาพข่าวสาร, รีวิวลูกค้า, รถมือสองเชียงใหม่, ครูหนึ่งรถสวย"
        url="https://chiangmaiusedcar.com/blog/images"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-prompt">รูปภาพข่าวสารและรีวิว</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-prompt">
            รวมรูปภาพจากบทความและรีวิวของลูกค้า
          </p>
        </div>
      </section>

      {/* Images Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogImages.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-64 md:h-80 bg-gray-100">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold font-prompt">
                      {image.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2 font-prompt">{image.title}</h3>
                  <p className="text-gray-600 font-prompt">
                    รูปภาพจากข่าวสารและเนื้อหาของ ครูหนึ่งรถสวย
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-prompt">
            ดูบทความและรีวิวเพิ่มเติม
          </h2>
          <p className="text-xl mb-8 font-prompt">อ่านบทความความรู้และรีวิวจากลูกค้าจริง</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              📖 อ่านข่าวสาร
            </Link>
            <Link
              href="/"
              className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              🏠 กลับหน้าแรก
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

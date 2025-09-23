import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Mockup: Replace with real API fetch in production
const fetchFacebookReviews = async () => [
  {
    id: 'fb1',
    name: 'สมชาย ใจดี',
    avatar: '/reviewers/fb1.jpg',
    rating: 5,
    text: 'บริการดีมาก รถสวยตรงปก แนะนำเลยครับ!',
    source: 'Facebook',
    url: 'https://facebook.com/krunuengusedcar/reviews/1',
  },
  {
    id: 'fb2',
    name: 'Suda Suksan',
    avatar: '/reviewers/fb2.jpg',
    rating: 5,
    text: 'ซื้อรถที่นี่ประทับใจสุดๆ ทีมงานดูแลดีมากค่ะ',
    source: 'Facebook',
    url: 'https://facebook.com/krunuengusedcar/reviews/2',
  },
];

const fetchGoogleReviews = async () => [
  {
    id: 'gg1',
    name: 'Nattapong K.',
    avatar: '/reviewers/gg1.jpg',
    rating: 5,
    text: 'รถมือสองคุณภาพดีจริงๆ บริการหลังการขายเยี่ยม!',
    source: 'Google',
    url: 'https://goo.gl/maps/Fe9dhXt',
  },
  {
    id: 'gg2',
    name: 'Ploy P.',
    avatar: '/reviewers/gg2.jpg',
    rating: 5,
    text: 'แนะนำเลยค่ะ รถสวย ราคาดี บริการประทับใจ',
    source: 'Google',
    url: 'https://goo.gl/maps/Fe9dhXt',
  },
];

function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    Promise.all([fetchFacebookReviews(), fetchGoogleReviews()]).then(([fb, gg]) =>
      setReviews([...fb, ...gg])
    );
  }, []);

  return (
    <section
      className="max-w-5xl mx-auto px-4 py-12 md:py-16 mt-10 mb-8 bg-gradient-to-br from-white via-gold/10 to-primary/5 rounded-3xl shadow-2xl border border-gold"
      aria-label="รีวิวลูกค้าจริง รถมือสองเชียงใหม่"
      itemScope
      itemType="https://schema.org/Review"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center font-prompt uppercase tracking-wide">
        รีวิวจากลูกค้าจริง
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map(r => (
          <article
            key={r.id}
            className="flex flex-col md:flex-row items-center bg-white/90 rounded-2xl shadow-lg p-6 border border-gold/30 gap-4"
            itemProp="review"
            itemScope
            itemType="https://schema.org/Review"
          >
            <div className="flex-shrink-0">
              <Image
                src={r.avatar}
                alt={r.name}
                width={64}
                height={64}
                className="rounded-full border-2 border-gold shadow-md"
                quality={85}
              />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-primary text-lg" itemProp="author">
                  {r.name}
                </span>
                <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold">
                  {Array(r.rating)
                    .fill(0)
                    .map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="#FF9800" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                      </svg>
                    ))}
                </span>
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                  {r.source}
                </span>
              </div>
              <p className="text-gray-800 text-base mb-2" itemProp="reviewBody">
                {r.text}
              </p>
              <a
                href={r.url}
                target="_blank"
                rel="noopener"
                className="text-accent hover:underline text-sm font-semibold"
                aria-label={`อ่านรีวิวบน${r.source}`}
              >
                อ่านรีวิวบน {r.source}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;

import React from 'react';
import Head from 'next/head';

export default function SEO({
  title,
  description,
  url,
  keywords,
  author = 'ครูหนึ่งรถสวย',
  type = 'website',
}) {
  const site = process.env.SITE_URL || 'https://chiangmaiusedcar.com';
  const fullUrl = url ? `${site}${url}` : site;
  const metaTitle = title
    ? `${title} | ครูหนึ่งรถสวย`
    : 'รถมือสองเชียงใหม่ คุณภาพดี ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย';
  const metaDesc =
    description ||
    'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย ศูนย์รวมรถบ้านคุณภาพดี ฟรีดาวน์ ผ่อนถูกที่สุด รับประกัน 1 ปี บริการสินเชื่อครบวงจร ส่งฟรีทั่วไทย โทร 094-064-9018';
  const metaKeywords =
    keywords ||
    'รถมือสอง, รถมือสองเชียงใหม่, ครูหนึ่งรถสวย, รถบ้าน, ฟรีดาวน์, ผ่อนรถ, สินเชื่อรถยนต์, รถยนต์มือสอง, รถราคาดี, รับประกันรถ';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Thai" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="ครูหนึ่งรถสวย" />
      <meta property="og:locale" content="th_TH" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:site" content="@krunueng_usedcar" />
      <meta name="twitter:creator" content="@krunueng_usedcar" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="application-name" content="ครูหนึ่งรถสวย" />

      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="TH-50" />
      <meta name="geo.placename" content="Chiang Mai" />
      <meta name="geo.position" content="18.7986111;99.0144444" />
      <meta name="ICBM" content="18.7986111, 99.0144444" />

      {/* Business Information */}
      <meta name="contact" content="094-064-9018" />
      <meta name="coverage" content="Thailand" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Favicon */}
      <link rel="icon" href="/logo/logo_main.png" />
      <link rel="apple-touch-icon" href="/logo/logo_main.png" />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
            description: metaDesc,
            url: fullUrl,
            logo: `${site}/logo/logo_main.png`,
            telephone: '+66940649018',
            email: 'info@chiangmaiusedcar.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '320 หมู่ 2 ถนน สมโภชเชียงใหม่ 700 ปี',
              addressLocality: 'สันพระเนตร',
              addressRegion: 'สันทราย',
              postalCode: '50210',
              addressCountry: 'TH',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 18.7986111,
              longitude: 99.0144444,
            },
            openingHours: 'Mo-Su 08:00-18:00',
            priceRange: '฿฿',
            paymentAccepted: 'Cash, Credit Card, Bank Transfer, Financing',
            currenciesAccepted: 'THB',
            sameAs: [
              'https://www.facebook.com/KN2car',
              'https://youtube.com/@chiangraiusedcar',
              'https://www.tiktok.com/@krunueng_usedcar',
              'https://lin.ee/cJuakxZ',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '250',
            },
          }),
        }}
      />
    </Head>
  );
}

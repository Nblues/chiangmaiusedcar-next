import React from 'react';
import Head from 'next/head';

export default function SEO({
  title,
  description,
  url,
  keywords,
  author,
  type = 'website',
  image = null,
  carData = null,
}) {
  const site = process.env.SITE_URL || 'https://chiangmaiusedcar.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่';
  const defaultDescription =
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย ศูนย์รวมรถบ้านคุณภาพดี ฟรีดาวน์ ผ่อนถูกที่สุด รับประกัน 1 ปี บริการสินเชื่อครบวงจร ส่งฟรีทั่วไทย โทร 094-064-9018';
  const defaultKeywords =
    process.env.NEXT_PUBLIC_SITE_KEYWORDS ||
    'รถมือสอง, รถมือสองเชียงใหม่, ครูหนึ่งรถสวย, รถบ้าน, ฟรีดาวน์, ผ่อนรถ, สินเชื่อรถยนต์, รถยนต์มือสอง, รถราคาดี, รับประกันรถ';
  const siteAuthor = author || process.env.NEXT_PUBLIC_SITE_AUTHOR || 'ครูหนึ่งรถสวย';

  const fullUrl = url ? `${site}${url}` : site;
  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDesc = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;

  // Default image for social sharing - ใช้ hero banner เป็นค่าเริ่มต้น
  const defaultImage = `${site}/herobanner/kn2carbanner.png`;
  const metaImage = image || defaultImage;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={siteAuthor} />
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
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:image:secure_url" content={metaImage} />
      {carData && (
        <>
          <meta property="product:price:amount" content={carData.price?.amount || '0'} />
          <meta property="product:price:currency" content={carData.price?.currencyCode || 'THB'} />
          <meta property="product:brand" content={carData.brand || ''} />
          <meta property="product:condition" content="used" />
          <meta
            property="product:availability"
            content={carData.availableForSale ? 'in stock' : 'out of stock'}
          />
        </>
      )}
      <meta property="fb:app_id" content="393815362560599" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:site" content="@krunueng_usedcar" />
      <meta name="twitter:creator" content="@krunueng_usedcar" />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={metaTitle} />

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
            image: metaImage,
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
              'https://lin.ee/8ugfzstD',
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '250',
            },
          }),
        }}
      />

      {/* Car Product Schema (if carData is provided) */}
      {carData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Car',
              name: carData.title,
              description: carData.description || metaDesc,
              url: fullUrl,
              image: carData.images?.map(img => img.url) || [metaImage],
              brand: {
                '@type': 'Brand',
                name: carData.brand || 'Unknown',
              },
              model: carData.model || 'Unknown',
              vehicleModelDate: carData.year || new Date().getFullYear(),
              mileageFromOdometer: {
                '@type': 'QuantitativeValue',
                value: carData.mileage ? parseInt(carData.mileage.replace(/[^0-9]/g, '')) : null,
                unitCode: 'KMT',
              },
              vehicleTransmission: carData.transmission || 'Unknown',
              fuelType: carData.fuel_type || 'Gasoline',
              numberOfSeats: carData.seats ? parseInt(carData.seats) : null,
              vehicleConfiguration: carData.seats ? `${carData.seats} seats` : null,
              color: carData.color || 'Unknown',
              offers: {
                '@type': 'Offer',
                price: carData.price?.amount || '0',
                priceCurrency: carData.price?.currencyCode || 'THB',
                availability: carData.availableForSale
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                seller: {
                  '@type': 'AutoDealer',
                  name: 'ครูหนึ่งรถสวย',
                  telephone: '+66940649018',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'เชียงใหม่',
                    addressCountry: 'TH',
                  },
                },
                warranty: carData.warranty || 'รับประกัน 1 ปี',
              },
              seller: {
                '@type': 'AutoDealer',
                name: 'ครูหนึ่งรถสวย',
                url: site,
                telephone: '+66940649018',
              },
              itemCondition: 'https://schema.org/UsedCondition',
              vehicleIdentificationNumber: carData.sku || carData.id,
            }),
          }}
        />
      )}

      {/* Image Schema for better image indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            url: metaImage,
            width: '1200',
            height: '630',
            caption: metaTitle,
            description: metaDesc,
            author: {
              '@type': 'Organization',
              name: 'ครูหนึ่งรถสวย',
            },
            copyrightHolder: {
              '@type': 'Organization',
              name: 'ครูหนึ่งรถสวย',
            },
            license: `${site}/terms`,
          }),
        }}
      />
    </Head>
  );
}

import React, { useMemo } from 'react';
import Head from 'next/head';
import { buildCarJsonLd, buildLocalBusinessJsonLd } from '../lib/seo/jsonld.js';
import { getSiteLocation } from '../utils/siteLocation.js';

export default function SEO({
  title,
  description,
  url,
  author,
  type = 'website',
  image = null,
  carData = null,
  structuredData = null,
}) {
  // Memoize static values to prevent unnecessary re-renders
  const staticValues = useMemo(() => {
    const site = process.env.SITE_URL || 'https://www.chiangmaiusedcar.com';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่';
    const defaultDescription =
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย ศูนย์รวมรถบ้านคุณภาพดี ฟรีดาวน์ 0% ผ่อนถูกที่สุด รับประกัน 1 ปี บริการสินเชื่อครบวงจร เครดิตไม่ผ่านก็มีทาง ส่งฟรีทั่วไทย โทร 094-064-9018';

    // 2025 SEO: Keywords moved to structured data - keeping for compatibility
    const aiOptimizedKeywords = [
      // Core business
      'รถมือสองเชียงใหม่',
      'ครูหนึ่งรถสวย',
      'รถ ECO Car มือสอง',
      'รถประหยัดน้ำมัน',
      // Conversational/AI search
      'รถมือสองดีที่ไหนเชียงใหม่',
      'ซื้อรถมือสองเชียงใหม่ที่ไหนดี',
      'รถมือสองฟรีดาวน์เชียงใหม่',
      // Voice search
      'หารถมือสองเชียงใหม่',
      'รถมือสองราคาดีเชียงใหม่',
      'รถมือสองผ่อนถูกเชียงใหม่',
      // E-A-T keywords
      'ผู้เชี่ยวชาญรถมือสองเชียงใหม่',
      'รับรองคุณภาพรถมือสอง',
      'ประเมินราคารถยุติธรรม',
      // Local SEO
      'รถมือสองสันพระเนตร',
      'รถมือสองสันทราย',
      'รถมือสองหางดง',
    ].join(', ');
    const siteAuthor = author || process.env.NEXT_PUBLIC_SITE_AUTHOR || 'ครูหนึ่งรถสวย';
    const buildTime = process.env.CUSTOM_BUILD_TIME || new Date().toISOString();

    return {
      site,
      siteName,
      defaultDescription,
      aiOptimizedKeywords,
      siteAuthor,
      buildTime,
    };
  }, [author]);

  // Memoize computed values
  const computedValues = useMemo(() => {
    const { site, siteName, defaultDescription, buildTime } = staticValues;
    const siteLocation = getSiteLocation();

    const fullUrl = url ? `${site}${url}` : site;
    const metaTitle = title ? `${title} | ${siteName}` : siteName;
    const metaDesc = description || defaultDescription;

    // Use stable timestamp for cache busting (only change on build)
    const stableTimestamp = process.env.CUSTOM_BUILD_TIME || buildTime;
    const timestamp = new Date(stableTimestamp).getTime();

    // Default image for social sharing
    const defaultImage = `${site}/herobanner/chiangmaiusedcar.webp`;
    const metaImage = image || defaultImage;

    // Enhanced Open Graph for better link sharing
    const enhancedTitle = metaTitle.length > 60 ? metaTitle.substring(0, 57) + '...' : metaTitle;
    const enhancedDesc = metaDesc.length > 155 ? metaDesc.substring(0, 152) + '...' : metaDesc;

    return {
      fullUrl,
      metaTitle,
      metaDesc,
      timestamp,
      metaImage,
      enhancedTitle,
      enhancedDesc,
      defaultImage,
      siteLocation,
    };
  }, [title, description, url, staticValues, image]);

  // Memoize absolute image URL
  const absoluteImage = useMemo(() => {
    const { site } = staticValues;
    const { metaImage, defaultImage, timestamp } = computedValues;

    let imgUrl = metaImage;
    if (!imgUrl || imgUrl === site) {
      imgUrl = defaultImage;
    }
    if (imgUrl && !imgUrl.startsWith('http')) {
      imgUrl = imgUrl.startsWith('/') ? `${site}${imgUrl}` : `${site}/${imgUrl}`;
    }

    // Add cache busting if not already present (use stable timestamp)
    if (imgUrl && !imgUrl.includes('?v=') && !imgUrl.includes('&v=')) {
      const separator = imgUrl.includes('?') ? '&' : '?';
      imgUrl = `${imgUrl}${separator}v=${timestamp}`;
    }

    return imgUrl;
  }, [staticValues, computedValues]);

  // Memoize OG images array
  const ogImages = useMemo(
    () => [
      { url: absoluteImage, width: 1200, height: 630, type: 'image/webp' },
      { url: absoluteImage, width: 800, height: 600, type: 'image/webp' },
      { url: absoluteImage, width: 600, height: 315, type: 'image/webp' },
    ],
    [absoluteImage]
  );

  // Simplified debug - only log once per unique component props (disabled in production)
  const debugKey = useMemo(
    () => `${title}-${description}-${url}-${type}`,
    [title, description, url, type]
  );

  // Memoize debug logging to prevent spam
  useMemo(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Only log unique combinations and throttle logging
      const lastLogged = window.seoDebugCache || {};
      const now = Date.now();

      if (!lastLogged[debugKey] || now - lastLogged[debugKey] > 5000) {
        lastLogged[debugKey] = now;
        window.seoDebugCache = lastLogged;

        // eslint-disable-next-line no-console
        console.log(`🔍 SEO [${debugKey.substring(0, 20)}...]:`, {
          title: computedValues.enhancedTitle,
          url: computedValues.fullUrl,
          type,
        });
      }
    }
  }, [debugKey, computedValues, type]);

  const { site, buildTime, siteAuthor } = staticValues;
  const { fullUrl, metaTitle, metaDesc, enhancedTitle, enhancedDesc, timestamp } = computedValues;

  return (
    <Head>
      {/* 2025 Cache Control for Fresh Content */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      <meta name="last-modified" content={buildTime} />
      <meta name="cache-timestamp" content={timestamp.toString()} />

      {/* Force Facebook to refresh cache */}
      <meta property="og:updated_time" content={buildTime} />
      <meta property="article:modified_time" content={buildTime} />
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Enhanced Language and Locale Settings */}
      <meta httpEquiv="Content-Language" content="th" />
      <meta name="language" content="th-TH" />
      <meta name="country" content="TH" />
      <meta name="geo.region" content="TH-50" />
      <meta name="geo.placename" content="เชียงใหม่, ประเทศไทย" />

      {/* Basic Meta Tags - Updated for 2025 Standards */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="author" content={siteAuthor} />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta
        name="googlebot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta
        name="bingbot"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* 2025 SEO: Meta keywords deprecated - using structured data instead */}
      <meta name="google-site-verification" content="your-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />

      {/* Enhanced semantic and entity markup for 2025 */}
      <meta name="business-type" content="AutoDealer" />
      <meta name="service-area" content="สันพระเนตร, สันทราย, หางดง, เชียงใหม่" />
      <meta name="expertise" content="รถมือสอง, รถ ECO Car, สินเชื่อรถยนต์, ประเมินราคารถ" />
      <meta name="service-type" content="ขายรถมือสอง, รับซื้อรถ, สินเชื่อรถยนต์" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="color-scheme" content="light" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={fullUrl} />

      {/* Enhanced Open Graph Meta Tags for Better Link Sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={enhancedTitle} />
      <meta property="og:description" content={enhancedDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่" />
      <meta property="og:locale" content="th_TH" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Multiple Open Graph Images for better compatibility */}
      {ogImages.map((img, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={img.url} />
          <meta property="og:image:secure_url" content={img.url} />
          <meta property="og:image:type" content={img.type} />
          <meta property="og:image:width" content={img.width.toString()} />
          <meta property="og:image:height" content={img.height.toString()} />
          <meta
            property="og:image:alt"
            content={`${enhancedTitle} - รถมือสองเชียงใหม่ ครูหนึ่งรถสวย`}
          />
        </React.Fragment>
      ))}

      {/* Additional Open Graph tags for better social sharing */}
      <meta property="og:updated_time" content={buildTime} />
      <meta property="og:see_also" content={`${site}/all-cars`} />
      <meta property="article:publisher" content="https://www.facebook.com/KN2car" />
      <meta property="article:author" content="ครูหนึ่งรถสวย" />
      <meta property="article:section" content="รถยนต์" />
      <meta property="article:tag" content="รถมือสอง" />
      <meta property="article:tag" content="เชียงใหม่" />

      {/* Enhanced Car Product Meta Tags */}
      {carData && (
        <>
          <meta
            property="product:price:amount"
            content={carData.price?.amount ? carData.price.amount.toString() : '0'}
          />
          <meta property="product:price:currency" content={carData.price?.currencyCode || 'THB'} />
          <meta property="product:brand" content={carData.brand || carData.vendor || 'รถมือสอง'} />
          <meta property="product:condition" content="used" />
          <meta
            property="product:availability"
            content={carData.availableForSale ? 'in stock' : 'out of stock'}
          />
          <meta property="product:category" content="รถยนต์มือสอง" />
          <meta property="product:retailer_item_id" content={carData.id || carData.sku} />

          {/* Additional car-specific OG tags */}
          <meta property="og:type" content="product" />
          <meta
            property="product:original_price:amount"
            content={carData.compareAtPrice?.amount || carData.price?.amount || '0'}
          />
          <meta property="product:sale_price:amount" content={carData.price?.amount || '0'} />

          {/* Car specific Open Graph tags */}
          <meta property="auto:year" content={carData.year || ''} />
          <meta property="auto:make" content={carData.brand || carData.vendor || ''} />
          <meta property="auto:model" content={carData.model || ''} />
          <meta property="auto:mileage" content={carData.mileage || ''} />
          <meta property="auto:condition" content="used" />
        </>
      )}

      {/* Facebook App ID for better analytics */}
      <meta property="fb:app_id" content="393815362560599" />

      {/* Enhanced Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={enhancedTitle} />
      <meta name="twitter:description" content={enhancedDesc} />
      <meta name="twitter:site" content="@krunueng_usedcar" />
      <meta name="twitter:creator" content="@krunueng_usedcar" />
      <meta name="twitter:image" content={absoluteImage} />
      <meta
        name="twitter:image:alt"
        content={`${enhancedTitle} - รถมือสองเชียงใหม่ ครูหนึ่งรถสวย`}
      />
      <meta name="twitter:domain" content="chiangmaiusedcar.com" />
      <meta
        name="twitter:data1"
        content={
          carData?.price?.amount
            ? `${carData.price.amount.toLocaleString()} บาท`
            : 'ติดต่อสอบถามราคา'
        }
      />
      <meta name="twitter:label1" content="ราคา" />
      <meta name="twitter:data2" content={carData?.year || 'ติดต่อสอบถาม'} />
      <meta name="twitter:label2" content="ปี" />

      {/* LINE and WhatsApp specific tags - optimized for Thai market */}
      <meta property="line:card" content="summary_large_image" />
      <meta property="line:site" content="@krunueng_usedcar" />
      <meta property="line:title" content={enhancedTitle} />
      <meta property="line:description" content={enhancedDesc} />
      <meta property="line:image" content={absoluteImage} />

      {/* WhatsApp specific meta tags */}
      <meta property="whatsapp:title" content={enhancedTitle} />
      <meta property="whatsapp:description" content={enhancedDesc} />
      <meta property="whatsapp:image" content={absoluteImage} />

      {/* Telegram specific meta tags */}
      <meta property="telegram:title" content={enhancedTitle} />
      <meta property="telegram:description" content={enhancedDesc} />
      <meta property="telegram:image" content={absoluteImage} />

      {/* Additional Social Platform Support */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta property="pinterest:title" content={enhancedTitle} />
      <meta property="pinterest:description" content={enhancedDesc} />
      <meta property="pinterest:image" content={absoluteImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#ff5252" />
      <meta name="msapplication-TileColor" content="#ff5252" />
      <meta name="application-name" content="ครูหนึ่งรถสวย" />
      <meta name="apple-mobile-web-app-title" content="ครูหนึ่งรถสวย" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Geographic and Business Meta Tags */}
      <meta name="geo.position" content={`${computedValues.siteLocation.lat};${computedValues.siteLocation.lng}`} />
      <meta name="ICBM" content={`${computedValues.siteLocation.lat}, ${computedValues.siteLocation.lng}`} />
      <meta name="contact" content="094-064-9018" />
      <meta name="coverage" content="ประเทศไทย" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 day" />

      {/* Enhanced Favicon with cache busting - 2025 Standards */}
      <link rel="icon" href={`/favicon.png?v=${buildTime}`} type="image/png" />
      <link rel="icon" href={`/favicon.ico?v=${buildTime}`} type="image/x-icon" />
      <link rel="apple-touch-icon" href={`/favicon.png?v=${buildTime}`} />
      <link rel="shortcut icon" href={`/favicon.png?v=${buildTime}`} />

      {/* Additional favicon sizes for better search engine recognition */}
      <link rel="icon" type="image/png" sizes="16x16" href={`/favicon.png?v=${buildTime}`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`/favicon.png?v=${buildTime}`} />
      <link rel="icon" type="image/png" sizes="96x96" href={`/favicon.png?v=${buildTime}`} />
      <link rel="icon" type="image/png" sizes="192x192" href={`/favicon.png?v=${buildTime}`} />
      <link rel="icon" type="image/png" sizes="512x512" href={`/favicon.png?v=${buildTime}`} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLocalBusinessJsonLd()),
        }}
      />

      {/* Car Product Schema (if carData is provided) */}
      {carData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildCarJsonLd(
                {
                  year: carData.year,
                  transmission: carData.transmission || 'Unknown',
                  fuelType: carData.fuel_type || 'Gasoline',
                  engineSize: carData.engine,
                  mileage: carData.mileage,
                  seats: carData.seats,
                  color: carData.color,
                },
                {
                  url: fullUrl,
                  name: carData.title,
                  description: carData.description || metaDesc,
                  images: carData.images?.map(img => img.url) || [absoluteImage],
                  brand: carData.brand,
                  sku: carData.sku || carData.id,
                  price: carData.price?.amount,
                  currency: carData.price?.currencyCode || 'THB',
                  inStock: carData.availableForSale !== false,
                }
              )
            ),
          }}
        />
      )}

      {/* Local Business/Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            '@id': `${site}/#organization`,
            name: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ ฟรีดาวน์ 0%',
            alternateName: [
              'KruNueng Used Cars',
              'ครูหนึ่งรถสวย',
              'รถมือสองเชียงใหม่คุณภาพ',
              'ศูนย์รถมือสองเชียงใหม่',
            ],
            url: site,
            logo: {
              '@type': 'ImageObject',
              url: `${site}/favicon.png`,
              width: '512',
              height: '512',
              caption: 'ครูหนึ่งรถสวย Logo',
            },
            image: `${site}/herobanner/chiangmaiusedcar.webp`,
            description:
              'ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ 0% รับประกัน 1 ปี ส่งฟรีทั่วไทย เครดิตไม่ผ่านก็มีทาง รถ ECO Car ประหยัดน้ำมัน สินเชื่อผ่านง่าย',

            // 2025 SEO: Enhanced keywords in structured data
            keywords: [
              'รถมือสองเชียงใหม่',
              'ครูหนึ่งรถสวย',
              'รถ ECO Car มือสอง',
              'รถประหยัดน้ำมัน',
              'ฟรีดาวน์ 0%',
              'รถมือสองดีที่ไหนเชียงใหม่',
              'ซื้อรถมือสองเชียงใหม่ที่ไหนดี',
              'รถมือสองฟรีดาวน์เชียงใหม่',
            ],

            // E-A-T and expertise markers
            expertise: [
              'ผู้เชี่ยวชาญรถมือสอง 10+ ปี',
              'ประเมินราคายุติธรรม',
              'รับรองคุณภาพรถทุกคัน',
              'บริการครบวงจรรถมือสอง',
            ],

            serviceType: [
              'ขายรถมือสอง',
              'รับซื้อรถมือสอง',
              'ประเมินราคารถฟรี',
              'สินเชื่อรถมือสอง',
              'รับประกันหลังการขาย',
              'ส่งรถฟรีทั่วประเทศ',
            ],
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
              latitude: computedValues.siteLocation.lat,
              longitude: computedValues.siteLocation.lng,
            },
            telephone: '+66940649018',
            email: 'contact@chiangmaiusedcar.com',
            openingHours: ['Mo-Su 08:00-20:00'],
            priceRange: '฿฿',
            paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
            currenciesAccepted: 'THB',
            areaServed: {
              '@type': 'Country',
              name: 'Thailand',
            },
            serviceArea: {
              '@type': 'Country',
              name: 'Thailand',
            },
            sameAs: [
              'https://www.facebook.com/KN2car',
              'https://www.tiktok.com/@krunueng_usedcar',
              'https://youtube.com/@chiangraiusedcar',
              'https://lin.ee/8ugfzstD',
            ],
          }),
        }}
      />

      {/* WebSite Schema with Site Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${site}/#website`,
            url: site,
            name: 'ครูหนึ่งรถสวย',
            description: metaDesc,
            publisher: {
              '@id': `${site}/#organization`,
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${site}/all-cars?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
            inLanguage: 'th-TH',
          }),
        }}
      />

      {/* Image Schema for better image indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            url: absoluteImage,
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

      {/* Extra structured data (page specific) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

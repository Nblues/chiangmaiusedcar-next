import React, { useMemo } from 'react';
import Head from 'next/head';
import { buildCarJsonLd, buildLocalBusinessJsonLd } from '../lib/seo/jsonld.js';
import { getSiteLocation } from '../utils/siteLocation';
import {
  getSocialImageUrl,
  getPlatformImage,
  SOCIAL_PLATFORMS_CONFIG,
} from '../lib/social-sharing';

export default function SEO({
  title,
  description,
  url,
  author,
  type = 'website',
  image = null,
  carData = null,
  structuredData = null,
  pageType = 'default', // เพิ่มพารามิเตอร์ pageType สำหรับ social sharing 2025
  noindex = false, // เพิ่ม noindex prop สำหรับหน้าที่ไม่ต้องการให้แสดงในผลค้นหา
  breadcrumbs = null, // เพิ่ม breadcrumbs สำหรับ BreadcrumbList Schema (SEO 2025)
  keywords = null, // ใส่ keywords ลง structured data (แทน meta keywords)
}) {
  // Memoize static values to prevent unnecessary re-renders
  const staticValues = useMemo(() => {
    const site = 'https://www.chiangmaiusedcar.com';
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่';
    const defaultDescription =
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'ศูนย์รวมรถยนต์มือสองคุณภาพดีในเชียงใหม่ ครูหนึ่งรถสวย ตรวจสภาพครบถ้วน ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย เช็คประวัติรถ โทร 094-064-9018';

    // 2025 SEO: Keywords moved to structured data - keeping for compatibility
    const aiOptimizedKeywords = [
      // Core Business (Brand + Location)
      'รถมือสองเชียงใหม่',
      'รถยนต์มือสองเชียงใหม่',
      'ศูนย์รวมรถบ้านเชียงใหม่',
      'ครูหนึ่งรถสวย',
      'ตลาดรถมือสองล้านนา',
      'ศูนย์รถมือสองภาคเหนือ',

      // Popular Brands + Stock Count (AK Car Style)
      'Toyota มือสองเชียงใหม่ 50+ คัน',
      'Honda มือสองเชียงใหม่ 30+ คัน',
      'Nissan มือสองเชียงใหม่ 20+ คัน',
      'Mazda มือสองเชียงใหม่ 15+ คัน',

      // Special Offers & Benefits
      'ฟรีดาวน์ 0% เชียงใหม่',
      'ดอกเบี้ยต่ำเริ่มต้น 2.99%',
      'รับประกัน 1 ปีเต็ม',
      'ส่งรถฟรีทั่วประเทศ',
      'เครดิตไม่ผ่านก็มีทาง',

      // Vehicle Categories (Specific Types)
      'รถ ECO Car มือสองเชียงใหม่',
      'รถกระบะ Double Cab มือสอง',
      'รถ SUV 4WD มือสองเชียงใหม่',
      'รถครอบครัว 7 ที่นั่งมือสอง',

      // AI/Voice Search Ready
      'รถมือสองดีที่ไหนเชียงใหม่',
      'ซื้อรถมือสองเชียงใหม่ที่ไหนดี',
      'หารถมือสองเชียงใหม่ราคาถูก',
      'เต็นท์รถมือสองเชียงใหม่ไหนดี',

      // Local Areas (Multi-Location)
      'รถมือสองสันพระเนตร',
      'รถยนต์มือสองสันทราย',
      'ศูนย์รถมือสองหางดง',
      'ตลาดรถมือสองแม่ริม',
      'รถบ้านคุณภาพสันกำแพง',

      // Price Ranges (AK Car Approach)
      'รถมือสอง 200,000 บาทเชียงใหม่',
      'รถมือสอง 300,000 บาทเชียงใหม่',
      'รถมือสอง 500,000 บาทเชียงใหม่',
      'รถมือสองราคาดีเชียงใหม่',

      // E-A-T Keywords (Expertise)
      'ผู้เชี่ยวชาญรถมือสองเชียงใหม่',
      'รับรองคุณภาพรถมือสอง',
      'ประเมินราคารถยุติธรรม',

      // 2025 Trends
      'รถมือสอง Hybrid เชียงใหม่',
      'รถประหยัดน้ำมันเชียงใหม่',
      'รถมือสองเทคโนโลยีใหม่',
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

    // Fix canonical URL duplication - check if url already contains full domain
    // Use current page URL for canonical - more accurate for SEO 2025
    const fullUrl = url ? (url.startsWith('http') ? url : `${site}${url}`) : site;
    // ป้องกันชื่อธุรกิจซ้อนกันใน title
    let metaTitle = siteName;
    if (title) {
      // ถ้า title มีชื่อธุรกิจอยู่แล้ว ไม่ต้องเติมซ้ำ
      const normalizedTitle = title.replace(/\|/g, '').replace(/\s+/g, ' ').trim();
      const normalizedSiteName = siteName.replace(/\|/g, '').replace(/\s+/g, ' ').trim();
      if (
        normalizedTitle.includes(normalizedSiteName) ||
        normalizedTitle.includes('ครูหนึ่งรถสวย')
      ) {
        metaTitle = title;
      } else {
        metaTitle = `${title} | ${siteName}`;
      }
    }
    const metaDesc = description || defaultDescription;

    // Use stable timestamp for cache busting (only change on build)
    const stableTimestamp = process.env.CUSTOM_BUILD_TIME || buildTime;
    const timestamp = new Date(stableTimestamp).getTime();

    // 2025 Social Sharing: Use optimized social images based on page type
    const defaultImage = getSocialImageUrl(pageType, site);
    const metaImage = image || defaultImage;

    // Enhanced Open Graph for better link sharing with 2025 standards
    const enhancedTitle =
      metaTitle.length > SOCIAL_PLATFORMS_CONFIG.facebook.optimal_title_length
        ? metaTitle.substring(0, SOCIAL_PLATFORMS_CONFIG.facebook.optimal_title_length - 3) + '...'
        : metaTitle;
    const enhancedDesc =
      metaDesc.length > SOCIAL_PLATFORMS_CONFIG.facebook.optimal_description_length
        ? metaDesc.substring(0, SOCIAL_PLATFORMS_CONFIG.facebook.optimal_description_length - 3) +
          '...'
        : metaDesc;

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
  }, [title, description, url, staticValues, image, pageType]);

  const normalizedKeywords = useMemo(() => {
    if (!keywords) return null;
    if (Array.isArray(keywords)) {
      return keywords
        .map(k => (k == null ? '' : String(k)))
        .map(k => k.trim())
        .filter(Boolean)
        .join(', ');
    }
    const v = String(keywords).trim();
    return v.length > 0 ? v : null;
  }, [keywords]);

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

  // Memoize OG images array with 2025 social sharing standards
  const ogImages = useMemo(() => {
    // Return primary formats for Open Graph with enhanced 2025 compatibility
    return [
      { url: absoluteImage, width: 1200, height: 630, type: 'image/webp' },
      { url: absoluteImage, width: 1200, height: 675, type: 'image/webp' },
      { url: absoluteImage, width: 800, height: 600, type: 'image/webp' },
      { url: absoluteImage, width: 600, height: 315, type: 'image/webp' },
    ];
  }, [absoluteImage]);

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

  const { site, buildTime, siteAuthor, aiOptimizedKeywords } = staticValues;
  const { fullUrl, metaTitle, metaDesc, enhancedTitle, enhancedDesc, timestamp } = computedValues;

  const siteKeywords = normalizedKeywords || aiOptimizedKeywords;

  // Get platform-specific images for enhanced 2025 social sharing
  const twitterImage = getPlatformImage(pageType, 'twitter_large');
  const lineImage = getPlatformImage(pageType, 'line');
  const whatsappImage = getPlatformImage(pageType, 'whatsapp');
  const telegramImage = getPlatformImage(pageType, 'telegram');

  return (
    <Head>
      {/* Note: Manual preload removed - Next.js Image with priority prop handles it automatically */}

      {/* Essential HTML5 Meta Tags for Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

      {/* 2025 Cache Control for Fresh Content */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      <meta name="last-modified" content={buildTime} />
      <meta name="cache-timestamp" content={timestamp.toString()} />

      {/* Force Facebook to refresh cache */}
      <meta property="og:updated_time" content={buildTime} />
      <meta property="article:modified_time" content={buildTime} />

      {/* Enhanced Language and Locale Settings - Unified th-TH */}
      <meta httpEquiv="Content-Language" content="th-TH" />
      <meta name="language" content="th-TH" />
      <meta name="country" content="TH" />
      <meta name="geo.region" content="TH-50" />
      <meta name="geo.placename" content="เชียงใหม่, ประเทศไทย" />

      {/* Basic Meta Tags - Updated for 2025 Standards */}
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}
      <meta name="author" content={siteAuthor} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <meta
        name="googlebot"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />
      <meta
        name="bingbot"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />

      {/* 2025 SEO: Meta keywords deprecated - using structured data instead */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
      )}

      {/* Facebook Domain Verification */}
      <meta name="facebook-domain-verification" content="9hmqrusdwqmzwsj6ffc395xow44ek8" />

      {/* Enhanced semantic and entity markup for 2025 */}
      <meta name="business-type" content="AutoDealer" />
      <meta name="service-area" content="สันพระเนตร, สันทราย, หางดง, เชียงใหม่" />
      <meta name="expertise" content="รถมือสอง, รถ ECO Car, สินเชื่อรถยนต์, ประเมินราคารถ" />
      <meta name="service-type" content="ขายรถมือสอง, รับซื้อรถ, สินเชื่อรถยนต์" />

      <meta name="color-scheme" content="light" />
      <meta name="format-detection" content="telephone=yes" />
      <link rel="canonical" href={fullUrl} />
      {/* Hreflang alternates for Thai and default */}
      <link rel="alternate" hrefLang="th" href={fullUrl} />
      <link rel="alternate" hrefLang="th-TH" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Enhanced Open Graph Meta Tags for Better Link Sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={enhancedTitle} />
      <meta property="og:description" content={enhancedDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่" />
      <meta property="og:locale" content="th_TH" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Primary Open Graph Image - MUST be specified explicitly */}
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={`${enhancedTitle} - รถมือสองเชียงใหม่ ครูหนึ่งรถสวย`}
      />

      {/* Alternative Open Graph Images for better compatibility */}
      {ogImages.slice(1).map((img, index) => (
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

      {/* Enhanced Twitter Card Meta Tags - 2025 Standards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={enhancedTitle} />
      <meta name="twitter:description" content={enhancedDesc} />
      <meta name="twitter:site" content="@krunueng_usedcar" />
      <meta name="twitter:creator" content="@krunueng_usedcar" />
      <meta name="twitter:image" content={twitterImage.url} />
      <meta name="twitter:image:width" content={twitterImage.width.toString()} />
      <meta name="twitter:image:height" content={twitterImage.height.toString()} />
      <meta name="twitter:image:alt" content={twitterImage.alt} />
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

      {/* LINE Meta Tags - 2025 Thai Market Optimization */}
      <meta property="line:card" content="summary_large_image" />
      <meta property="line:site" content="@krunueng_usedcar" />
      <meta property="line:title" content={enhancedTitle} />
      <meta property="line:description" content={enhancedDesc} />
      <meta property="line:image" content={lineImage.url} />
      <meta property="line:image:width" content={lineImage.width.toString()} />
      <meta property="line:image:height" content={lineImage.height.toString()} />
      <meta property="line:image:alt" content={lineImage.alt} />

      {/* WhatsApp Meta Tags - 2025 Standards */}
      <meta property="whatsapp:title" content={enhancedTitle} />
      <meta property="whatsapp:description" content={enhancedDesc} />
      <meta property="whatsapp:image" content={whatsappImage.url} />
      <meta property="whatsapp:image:width" content={whatsappImage.width.toString()} />
      <meta property="whatsapp:image:height" content={whatsappImage.height.toString()} />
      <meta property="whatsapp:image:alt" content={whatsappImage.alt} />

      {/* Telegram Meta Tags - 2025 Standards */}
      <meta property="telegram:title" content={enhancedTitle} />
      <meta property="telegram:description" content={enhancedDesc} />
      <meta property="telegram:image" content={telegramImage.url} />
      <meta property="telegram:image:width" content={telegramImage.width.toString()} />
      <meta property="telegram:image:height" content={telegramImage.height.toString()} />
      <meta property="telegram:image:alt" content={telegramImage.alt} />

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
      <meta
        name="geo.position"
        content={`${computedValues.siteLocation.lat};${computedValues.siteLocation.lng}`}
      />
      <meta
        name="ICBM"
        content={`${computedValues.siteLocation.lat}, ${computedValues.siteLocation.lng}`}
      />
      <meta name="contact" content="094-064-9018" />
      <meta name="coverage" content="ประเทศไทย" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 day" />

      {/* Enhanced Favicon with cache busting - 2025 Standards */}
      <link rel="icon" href={`/logo/logo_favicon.webp?v=${buildTime}`} type="image/webp" />
      <link rel="icon" href={`/favicon.svg?v=${buildTime}`} type="image/svg+xml" />
      <link rel="icon" href={`/favicon.ico?v=${buildTime}`} type="image/x-icon" />
      <link rel="apple-touch-icon" href={`/logo/logo_favicon.webp?v=${buildTime}`} />
      <link rel="shortcut icon" href={`/logo/logo_favicon.webp?v=${buildTime}`} />

      {/* Additional favicon sizes for better search engine recognition */}
      <link
        rel="icon"
        type="image/webp"
        sizes="16x16"
        href={`/logo/logo_favicon.webp?v=${buildTime}`}
      />
      <link
        rel="icon"
        type="image/webp"
        sizes="32x32"
        href={`/logo/logo_favicon.webp?v=${buildTime}`}
      />
      <link
        rel="icon"
        type="image/webp"
        sizes="96x96"
        href={`/logo/logo_favicon.webp?v=${buildTime}`}
      />
      <link
        rel="icon"
        type="image/webp"
        sizes="192x192"
        href={`/logo/logo_favicon.webp?v=${buildTime}`}
      />
      <link
        rel="icon"
        type="image/webp"
        sizes="512x512"
        href={`/logo/logo_favicon.webp?v=${buildTime}`}
      />

      {/* Schema.org JSON-LD - Organization (Single Source of Truth) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLocalBusinessJsonLd()),
        }}
      />

      {/* Car Schema (only if carData is provided) - ลบการใส่ซ้ำ */}
      {carData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildCarJsonLd(
                {
                  year: carData.year,
                  transmission: carData.transmission || 'Manual',
                  fuelType: carData.fuel_type || 'Gasoline',
                  engineSize: carData.engine,
                  mileage: carData.mileage,
                  seats: carData.seats,
                  color: carData.color,
                  vin: carData.vin, // Optional - ไม่บังคับ
                  bodyType: carData.body_type, // เพิ่ม body type
                },
                {
                  url: fullUrl,
                  name: carData.title,
                  description: carData.description || metaDesc,
                  images: carData.images?.map(img => img.url) || [absoluteImage],
                  brand: carData.brand,
                  sku: carData.sku || carData.id,
                  mpn: carData.mpn,
                  price: carData.price?.amount,
                  currency: carData.price?.currencyCode || 'THB',
                  inStock: carData.availableForSale !== false,
                  review: carData.review, // เพิ่ม review support
                }
              )
            ),
          }}
        />
      )}

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
            keywords: siteKeywords,
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

      {/* Breadcrumb Schema (Single Source) - 2025 SEO */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: crumb.url ? `${site}${crumb.url}` : undefined,
              })),
            }),
          }}
        />
      )}

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

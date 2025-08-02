import Head from 'next/head';

export default function SEO({
  title = 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่',
  description = 'ซื้อ-ขายรถมือสองเชียงใหม่ ฟรีดาวน์ คัดคุณภาพ การันตีเครดิต อนุมัติง่าย รับประกันหลังการขาย',
  keywords = 'รถมือสองเชียงใหม่, รถบ้านเชียงใหม่, รถยนต์มือสอง, รถบ้านฟรีดาวน์, รถมือสองราคาถูก',
  url = 'https://chiangmaiusedcar.com',
  image = 'https://chiangmaiusedcar.com/cover.jpg',
  type = 'website',
  publishedTime,
  updatedTime,
  breadcrumb = [],
  productJsonld = null,
  orgJsonld = null,
}) {
  return (
    <Head>
      {/* Title/Description/Keywords */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ครูหนึ่งรถสวย" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {updatedTime && <meta property="article:modified_time" content={updatedTime} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon & Apple */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#ffb200" />

      {/* Geo & Business */}
      <meta name="geo.region" content="TH-50" />
      <meta name="geo.placename" content="Chiang Mai" />
      <meta name="geo.position" content="18.796143;98.979263" />
      <meta name="ICBM" content="18.796143, 98.979263" />

      {/* JSON-LD Organization (default) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            orgJsonld || {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่',
              url: 'https://chiangmaiusedcar.com',
              logo: 'https://chiangmaiusedcar.com/logo/logo_main.png',
              image: image,
              sameAs: [
                'https://facebook.com/krunuengusedcar',
                'https://www.tiktok.com/@krunueng_usedcar',
                'https://youtube.com/@chiangraiusedcar',
              ],
              telephone: '094-064-9018',
            },
          ),
        }}
      />
      {/* JSON-LD Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumb.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.name,
                item: item.url,
              })),
            }),
          }}
        />
      )}
      {/* JSON-LD Product (ถ้าหน้ารถแต่ละคัน) */}
      {productJsonld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonld),
          }}
        />
      )}
    </Head>
  );
}

import Head from 'next/head';

  const site = process.env.SITE_URL;
  const fullUrl = url ? `${site}${url}` : site;
  const metaTitle = title ? `${title} | ครูหนึ่งรถสวย` : 'รถมือสองเชียงใหม่ | ครูหนึ่งรถสวย';
  const metaDesc = description || 'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย รวมรถบ้านไมล์น้อย ฟรีดาวน์ ผ่อนถูก รับประกัน 1 ปี ส่งฟรีทั่วไทย';
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={fullUrl} />
      {/* OG */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      {/* Twitter */}
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
    </Head>
  );
}

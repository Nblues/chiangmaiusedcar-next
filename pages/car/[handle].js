import React from 'react';
import SEO from '../../components/SEO';
import { getAllCars } from '../../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import CarActionButtons from '../../components/CarActionButtons'; // ปุ่มเทพชุดที่แล้ว

function CarDetailPage({ car }) {
  if (!car) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-red-600">
        ไม่พบข้อมูลรถคันนี้{' '}
        <Link href="/all-cars" className="text-blue-700 underline">
          ← กลับหน้ารวมรถ
        </Link>
      </div>
    );
  }

  // Breadcrumb Schema
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: 'https://chiangmaiusedcar.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'รถทั้งหมด',
        item: 'https://chiangmaiusedcar.com/all-cars',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: car.title,
        item: `https://chiangmaiusedcar.com/car/${car.handle}`,
      },
    ],
  };

  // Product Schema
  const productLD = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.title,
    image: car.images?.[0]?.url || '/cover.jpg',
    description: car.description,
    brand: { '@type': 'Brand', name: car.vendor },
    offers: {
      '@type': 'Offer',
      priceCurrency: car.price?.currencyCode || 'THB',
      price: car.price?.amount,
      availability: car.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://chiangmaiusedcar.com/car/${car.handle}`,
    },
  };

  // Organization Schema (Logo, SameAs, Contact)
  const orgLD = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่',
    url: 'https://chiangmaiusedcar.com',
    logo: 'https://chiangmaiusedcar.com/logo/logo_main.png',
    sameAs: [
      'https://facebook.com/krunuengusedcar',
      'https://www.tiktok.com/@krunueng_usedcar',
      'https://youtube.com/@chiangraiusedcar',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+66940649018',
        contactType: 'customer service',
        areaServed: 'TH',
      },
    ],
  };

  // SEO meta
  return (
    <>
      <SEO
        title={`${car.title} | รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย`}
        description={car.description}
        image={car.images?.[0]?.url || '/cover.jpg'}
        keywords={`รถมือสอง, ${car.title}, ${car.vendor}, รถบ้าน, ฟรีดาวน์, ผ่อนถูก`}
        url={`https://chiangmaiusedcar.com/car/${car.handle}`}
        canonical={`https://chiangmaiusedcar.com/car/${car.handle}`}
        hreflang={[{ href: `https://chiangmaiusedcar.com/car/${car.handle}`, locale: 'th-TH' }]}
      />
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLD) }}
      />

      <main className="max-w-3xl mx-auto p-4">
        {/* Breadcrumb UI */}
        <nav className="text-sm mb-3 text-gray-500">
          <Link href="/" className="hover:underline">
            หน้าแรก
          </Link>{' '}
          &gt;{' '}
          <Link href="/all-cars" className="hover:underline">
            รถทั้งหมด
          </Link>{' '}
          &gt; <span className="text-primary font-semibold">{car.title}</span>
        </nav>

        {/* ชื่อรถ (H1) */}
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{car.title}</h1>
        <div className="text-base text-gray-600 mb-4">
          อัปเดตล่าสุด: {new Date(car.updatedAt).toLocaleDateString('th-TH')}
        </div>

        {/* รูปหลัก + แกลเลอรี่ (Lazy + Priority) */}
        <div className="w-full mb-4 rounded-xl overflow-hidden shadow border bg-gray-50 flex justify-center">
          <Image
            src={car.images?.[0]?.url || '/cover.jpg'}
            alt={car.title}
            width={800}
            height={500}
            className="object-contain w-full h-auto"
            loading="eager"
            priority
          />
        </div>

        {/* ถ้ามีหลายรูป ใส่แกลเลอรี่แนวนอน */}
        {car.images?.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {car.images.map((img, i) => (
              <Image
                key={i}
                src={img.url}
                alt={img.alt || car.title}
                width={120}
                height={80}
                className="rounded-lg border bg-white object-contain"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* รายละเอียดจุดเด่นรถ (H2, H3) */}
        <h2 className="text-xl font-bold text-gold mb-1">รายละเอียดรถ</h2>
        <div className="mb-4 text-base">{car.description}</div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div>
            <span className="font-bold">ยี่ห้อ:</span> {car.vendor}
          </div>
          <div>
            <span className="font-bold">รุ่น:</span> {car.model || '-'}
          </div>
          <div>
            <span className="font-bold">ปี:</span> {car.year || '-'}
          </div>
          <div>
            <span className="font-bold">สี:</span> {car.color || '-'}
          </div>
          <div>
            <span className="font-bold">เลขไมล์:</span> {car.mileage || '-'}
          </div>
          <div>
            <span className="font-bold">ราคา:</span>{' '}
            <span className="text-lg text-gold font-bold">
              ฿{Number(car.price.amount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <CarActionButtons car={car} />

        {/* ปุ่มกลับ */}
        <div className="mt-8 text-center">
          <Link
            href="/all-cars"
            className="inline-block px-6 py-2 rounded-xl bg-gray-100 hover:bg-gold/20 text-primary border border-gold font-semibold shadow transition text-lg"
          >
            ← กลับหน้ารวมรถ
          </Link>
        </div>
      </main>
    </>
  );
}

// Static Paths/Props
export async function getStaticPaths() {
  const cars = await getAllCars();
  const paths = cars.map(car => ({
    params: { handle: car.handle },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const cars = await getAllCars();
  const car = cars.find(c => c.handle === params.handle) || null;
  return { props: { car }, revalidate: 600 };
}

export default CarDetailPage;

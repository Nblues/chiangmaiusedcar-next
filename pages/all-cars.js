import { useState, useMemo, useRef } from 'react';
import SEO from '../components/SEO';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

const PER_PAGE = 12;

export default function AllCars({ cars }) {
  const [brand, setBrand] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const searchRef = useRef();

  // Filter + Search
  const filteredCars = useMemo(() => {
    let result = cars;
    if (brand) result = result.filter(c => c.vendor === brand);
    if (keyword)
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(keyword.toLowerCase()) ||
          c.description.toLowerCase().includes(keyword.toLowerCase()),
      );
    return result;
  }, [brand, keyword, cars]);

  // Pagination
  const total = filteredCars.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const showCars = filteredCars.slice(startIdx, startIdx + PER_PAGE);

  // Fix OG Images
  const ogImages = showCars.map(car => car?.images?.[0]?.url || '/cover.jpg');

  // JSON-LD Product
  const productsLD = showCars.map(car => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.title,
    image: car?.images?.[0]?.url || '/cover.jpg',
    description: car.description,
    brand: { '@type': 'Brand', name: car.vendor },
    offers: {
      '@type': 'Offer',
      priceCurrency: car.price.currencyCode || 'THB',
      price: car.price.amount,
      availability: car.availableForSale ? 'InStock' : 'OutOfStock',
      url: `https://chiangmaiusedcar.com/car/${car.handle}`,
    },
  }));

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
    ],
  };

  // Animation สำหรับ filter, เปลี่ยนหน้า
  const pageAnim = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
    transition: { duration: 0.22, type: 'spring' },
  };

  // ชื่อแบรนด์ (เพิ่มเองได้)
  const brands = [
    'Toyota',
    'Nissan',
    'Mitsubishi',
    'Mercedes Benz',
    'Honda',
    'Mazda',
    'Chevrolet',
    'Ford',
    'BMW',
    'KIA Carnival',
    'Isuzu',
  ];

  return (
    <>
      <SEO
        title="รถมือสองเชียงใหม่ รถบ้านฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย"
        description="รถมือสองเชียงใหม่ ครูหนึ่งรถสวย รวมรถบ้านเกรดเอ ฟรีดาวน์ ผ่อนถูก เช็ครถประวัติแท้ คัดเฉพาะรถสวย อัปเดตรถใหม่ทุกวัน ซื้อขายแลกเปลี่ยนรถยนต์เชียงใหม่-ภาคเหนือ รับประกันทุกคัน"
        image={ogImages[0]}
        keywords="รถมือสองเชียงใหม่, รถบ้าน, ฟรีดาวน์, รถมือสองราคาถูก, รถบ้านฟรีดาวน์, รถบ้านเชียงใหม่"
        url="https://chiangmaiusedcar.com/all-cars"
        canonical="https://chiangmaiusedcar.com/all-cars"
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsLD) }}
      />

      <main className="max-w-7xl mx-auto p-2 pt-5 md:p-6 min-h-screen">
        {/* Breadcrumb UI */}
        <nav className="text-sm mb-3 text-gray-500">
          <Link href="/" className="hover:underline">
            หน้าแรก
          </Link>{' '}
          &gt; <span className="text-primary font-semibold">รถทั้งหมด</span>
        </nav>

        {/* Filter/Search */}
        <section className="mb-4 flex flex-col md:flex-row md:items-end gap-2 md:gap-6 bg-white/80 p-3 rounded-lg shadow">
          <div>
            <label className="block text-sm font-semibold mb-1">ยี่ห้อ</label>
            <select
              className="form-input border rounded-lg w-full"
              value={brand}
              onChange={e => {
                setBrand(e.target.value);
                setPage(1);
              }}
            >
              <option value="">ทุกยี่ห้อ</option>
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">ค้นหา</label>
            <input
              ref={searchRef}
              className="form-input border rounded-lg w-full"
              type="text"
              value={keyword}
              placeholder="ค้นหา รุ่น, สี, ปี, ราคา..."
              onChange={e => {
                setKeyword(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <button
            className="px-5 py-2 bg-primary hover:bg-gold text-white font-semibold rounded-lg shadow mt-4 md:mt-0 transition"
            onClick={() => {
              setBrand('');
              setKeyword('');
              searchRef.current.value = '';
              setPage(1);
            }}
            type="button"
          >
            ล้างตัวกรอง
          </button>
        </section>

        {/* รวมรถ (แสดงผล + Animation + Skeleton) */}
        <div className="flex items-center justify-between mb-2 mt-5">
          <h1 className="text-2xl font-bold text-primary">รถมือสองเชียงใหม่ อัปเดตล่าสุด</h1>
          <span className="text-sm text-gray-500">พบทั้งหมด {filteredCars.length} คัน</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${brand}-${keyword}-${page}`}
            {...pageAnim}
            className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {showCars.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-12 text-lg">
                ไม่พบรถที่ค้นหา
              </div>
            )}
            {showCars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gold/50 shadow hover:shadow-xl transition relative flex flex-col"
              >
                <Link href={`/car/${car.handle}`} className="block">
                  <div className="relative w-full h-44 md:h-48 rounded-t-xl overflow-hidden bg-gray-100">
                    <Image
                      src={car?.images?.[0]?.url || '/cover.jpg'}
                      alt={car.title}
                      fill
                      className="object-cover"
                      loading={i < 4 ? 'eager' : 'lazy'}
                      priority={i < 4}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    {/* ป้ายพิเศษ */}
                    <div className="absolute left-2 top-2 flex flex-col gap-2 z-10">
                      {car.tags?.includes && car.tags.includes('ฟรีดาวน์') && (
                        <span className="inline-block bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow">
                          ฟรีดาวน์
                        </span>
                      )}
                      {car.tags?.includes && car.tags.includes('ผ่อนถูก') && (
                        <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow">
                          ผ่อนถูก
                        </span>
                      )}
                      <span className="inline-block bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow animate-pulse">
                        ใหม่
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h2 className="font-bold text-base text-primary line-clamp-2 mb-1">
                      {car.title}
                    </h2>
                    <div className="text-lg font-semibold text-gold mb-2">
                      ฿{Number(car.price.amount).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <span className="inline-block px-2 py-1 bg-gold/10 text-gold border border-gold/40 rounded text-xs font-semibold">
                        รับประกัน 1 ปี
                      </span>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-semibold">
                        อัปเดตล่าสุด
                      </span>
                    </div>
                  </div>
                </Link>
                {/* ปุ่มสอบถาม LINE */}
                <a
                  href={`https://lin.ee/cJuakxZ`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mx-3 mb-3 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-center shadow transition"
                  title="สอบถามผ่าน LINE"
                >
                  สอบถามผ่าน LINE
                </a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-8 select-none">
            <button
              className="px-3 py-2 rounded-l-lg bg-primary/90 text-white font-bold disabled:bg-gray-300 disabled:text-gray-400"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-2 ${
                  i + 1 === page
                    ? 'bg-gold text-primary font-bold'
                    : 'bg-white border text-gray-600'
                } border-gold hover:bg-gold/20 rounded`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-2 rounded-r-lg bg-primary/90 text-white font-bold disabled:bg-gray-300 disabled:text-gray-400"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              »
            </button>
          </div>
        )}
      </main>
    </>
  );
}

// getStaticProps
export async function getStaticProps() {
  const { getAllCars } = await import('../lib/shopify');
  const cars = await getAllCars();
  return { props: { cars }, revalidate: 600 };
}

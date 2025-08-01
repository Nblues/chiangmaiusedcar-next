import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

export default function AllCars({ cars }) {
  return (
    <>
      <SEO
        title="รวมรถมือสองเชียงใหม่ ทุกรุ่น ฟรีดาวน์ ราคาถูก | ครูหนึ่งรถสวย"
        description="รวมรถมือสองเชียงใหม่ รถบ้านคุณภาพ รถกระบะ รถเก๋ง รถครอบครัว รถบ้านแท้ ฟรีดาวน์ ผ่อนถูก ราคาหลักหมื่น-แสน คัดสภาพดีทุกคัน อนุมัติง่าย เครดิตเสียก็ซื้อได้ รับประกันหลังการขาย พร้อมรีวิวจริงจากลูกค้าทั่วประเทศ"
        keywords="รถมือสองเชียงใหม่, รถบ้านเชียงใหม่, รถมือสองราคาถูก, รถบ้านฟรีดาวน์, รถมือสองราคาถูกเชียงใหม่, รถมือสองใกล้ฉัน, รถกระบะมือสองเชียงใหม่, รถเก๋งมือสองเชียงใหม่, รถมือสองราคาไม่เกิน 50000, รถมือสองราคาไม่เกิน 100000, รถมือสองราคาไม่เกิน 150000, รถมือสองราคาไม่เกิน 200000, รถมือสองราคาไม่เกิน 300000, รถมือสองราคาไม่เกิน 500000, รถมือสองราคาไม่เกิน 700000, รถมือสองราคาไม่เกิน 800000, รถบ้านเจ้าของขายเอง, รถบ้านมือสอง, รถมือสองผ่อนถูก, รถมือสองดาวน์น้อย"
      />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">รถมือสองเชียงใหม่ อัปเดตล่าสุด</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {cars.map((car, i) => (
            <Link key={car.id} href={`/car/${car.handle}`}>
              <a className="border rounded shadow block hover:shadow-lg transition">
                <Image
                  src={car.images[0]?.url || '/cover.jpg'}
                  alt={`รถมือสอง ${car.title} เชียงใหม่ ฟรีดาวน์`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                  priority={i === 0}
                />
                <div className="p-2">
                  <h2 className="font-semibold text-base">{car.title}</h2>
                  <p className="text-accent-500 font-semibold">
                    ฿{Number(car.price.amount).toLocaleString()}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const cars = await getAllCars();
  return { props: { cars }, revalidate: 600 };
}

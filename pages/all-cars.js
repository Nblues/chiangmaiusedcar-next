import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

export default function AllCars({ cars }) {
  return (
    <>
      <SEO title="รถมือสองเชียงใหม่ รถบ้านฟรีดาวน์" />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">รถมือสองเชียงใหม่ อัปเดตล่าสุด</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {cars.map(car => (
            <Link key={car.id} href={`/car/${car.handle}`} className="card block group focus:outline-none">
              <div className="overflow-hidden rounded-t-lg">
                <Image 
                  src={car.images[0]?.url||'/cover.jpg'} 
                  alt={car.title} 
                  width={400} 
                  height={300} 
                  className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-200" 
                />
              </div>
              <div className="p-3">
                <h2 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors duration-200">
                  {car.title}
                </h2>
                <p className="text-primary-600 font-bold text-lg">
                  ฿{Number(car.price.amount).toLocaleString()}
                </p>
              </div>
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

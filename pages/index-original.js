import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

export default function Home({ cars }) {
  return (
    <>
      <SEO title="รถบ้านฟรีดาวน์ ผ่อนถูก" />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">รถมาใหม่</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {cars.map(car => (
            <Link key={car.id} href={`/car/${car.handle}`} className="border rounded shadow">
              <Image src={car.images[0]?.url||'/cover.jpg'} alt={car.title} width={400} height={300} className="object-cover" />
              <div className="p-2">
                <h2 className="font-semibold">{car.title}</h2>
                <p className="text-orange-600">฿{Number(car.price.amount).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const cars = (await getAllCars()).slice(0,6);
  return { props: { cars }, revalidate: 600 };
}

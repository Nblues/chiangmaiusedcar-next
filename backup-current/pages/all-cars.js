import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify';
import Link from 'next/link';

export default function AllCars({ cars }) {
  return (
    <>
      <SEO title="รถมือสองเชียงใหม่ รถบ้านฟรีดาวน์" />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">รถมือสองเชียงใหม่ อัปเดตล่าสุด</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {cars.map(car => (
            <Link key={car.id} href={`/car/${car.handle}`} className="border rounded shadow">
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
  const cars = await getAllCars();
  return { props: { cars }, revalidate: 600 };
}

import SEO from '../components/SEO';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const mockCars = [
    {
      id: '1',
      handle: 'honda-civic-2020',
      title: 'Honda Civic 2020',
      price: { amount: '680000' },
      images: [{ url: '/cover.jpg' }]
    },
    {
      id: '2', 
      handle: 'toyota-camry-2021',
      title: 'Toyota Camry 2021',
      price: { amount: '950000' },
      images: [{ url: '/cover.jpg' }]
    },
    {
      id: '3',
      handle: 'mazda-cx5-2019',
      title: 'Mazda CX-5 2019',
      price: { amount: '750000' },
      images: [{ url: '/cover.jpg' }]
    },
    {
      id: '4',
      handle: 'nissan-almera-2022',
      title: 'Nissan Almera 2022',
      price: { amount: '520000' },
      images: [{ url: '/cover.jpg' }]
    },
    {
      id: '5',
      handle: 'ford-focus-2020',
      title: 'Ford Focus 2020',
      price: { amount: '620000' },
      images: [{ url: '/cover.jpg' }]
    },
    {
      id: '6',
      handle: 'volkswagen-polo-2021',
      title: 'Volkswagen Polo 2021',
      price: { amount: '580000' },
      images: [{ url: '/cover.jpg' }]
    }
  ];

  return (
    <>
      <SEO title="รถบ้านฟรีดาวน์ ผ่อนถูก" />
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">รถมาใหม่</h1>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {mockCars.map(car => (
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
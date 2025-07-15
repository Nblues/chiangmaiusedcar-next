import SEO from '../../components/SEO';
import { getAllCars, getCarByHandle } from '../../lib/shopify';
import Image from 'next/image';

export default function CarDetail({ car }) {
  if (!car) return <p>ไม่พบข้อมูล</p>;
  return (
    <>
      <SEO title={car.title} description={car.description} url={`/car/${car.handle}`} image={car.images[0]?.url} />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">{car.title}</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Image src={car.images[0]?.url||'/cover.jpg'} alt={car.title} width={600} height={400} className="object-cover rounded" />
            <div className="grid grid-cols-5 gap-1 mt-2">
              {car.images.slice(0,10).map((img,i)=>(
                <Image key={i} src={img.url} alt={car.title} width={120} height={80} className="object-cover" />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-orange-600 text-2xl mb-2">฿{Number(car.variants.edges[0].node.price).toLocaleString()}</p>
            <p className="whitespace-pre-wrap">{car.description}</p>
            <div className="mt-4 space-x-2">
              <a href="https://lin.ee/cJuakxZ" className="bg-green-600 text-white px-4 py-2 rounded inline-block">สอบถามผ่าน LINE</a>
              <a href="https://facebook.com/nuengblues" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">ดูรถบน Facebook</a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const cars = await getAllCars();
  return {
    paths: cars.map(c=>({ params:{ handle:c.handle }})),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const car = await getCarByHandle(params.handle);
  if (!car) return { notFound: true };
  return { props: { car }, revalidate: 600 };
}

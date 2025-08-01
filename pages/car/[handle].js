import SEO from "../../components/SEO";
import { getAllCars, getCarByHandle } from "../../lib/shopify";
import Image from "next/image";

export default function CarDetail({ car }) {
  if (!car) return <p>ไม่พบข้อมูล</p>;
  const price = Number(car.variants.edges[0].node.price.amount);
  const formattedPrice = new Intl.NumberFormat('th-TH').format(price);
  return (
    <>
      <SEO
        title={car.title}
        description={car.description}
        url={`/car/${car.handle}`}
        image={car.images[0]?.url}
      />
      <main className="max-w-4xl mx-auto p-4 font-prompt">
        <h1 className="text-2xl font-bold mb-2 text-primary">{car.title}</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Image
              src={car.images[0]?.url || "/cover.jpg"}
              alt={car.title}
              width={600}
              height={400}
              className="object-cover rounded border-4 border-gold"
            />
            <div className="grid grid-cols-5 gap-1 mt-2">
              {car.images.slice(0, 10).map((img, i) => (
                <Image
                  key={i}
                  src={img.url || "/cover.jpg"}
                  alt={car.title}
                  width={120}
                  height={80}
                  className="object-cover border border-gold"
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gold text-2xl font-bold mb-2">
              {car?.variants?.edges?.[0]?.node?.price?.amount
                ? `฿${formattedPrice}`
                : "฿-"}
            </p>
            <p className="whitespace-pre-wrap mb-4">{car.description}</p>
            <div className="mt-4 space-x-2">
              <a
                href="https://lin.ee/cJuakxZ"
                className="bg-gold text-black px-6 py-3 rounded-full font-bold inline-block hover:bg-primary hover:text-white border-2 border-gold transition-all"
                target="_blank"
                rel="noopener"
              >
                สอบถามผ่าน LINE
              </a>
              <a
                href="https://facebook.com/nuengblues"
                className="bg-primary text-white px-6 py-3 rounded-full font-bold inline-block hover:bg-gold hover:text-black border-2 border-gold transition-all"
                target="_blank"
                rel="noopener"
              >
                ดูรถบน Facebook
              </a>
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
    paths: cars.map((c) => ({ params: { handle: c.handle } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const car = await getCarByHandle(params.handle);
  if (!car) return { notFound: true };
  return { props: { car }, revalidate: 600 };
}

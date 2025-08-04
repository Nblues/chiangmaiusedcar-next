import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// คอมโพเนนต์แนะนำรถที่คล้ายกัน
function SimilarCars({ currentCar, allCars = [] }) {
  // หาฟังก์ชันรถที่คล้ายกัน
  const findSimilarCars = () => {
    if (!currentCar || allCars.length === 0) return [];

    const currentPrice = Number(currentCar.price?.amount) || 0;
    const priceRange = currentPrice * 0.3; // ช่วงราคา ±30%

    return allCars
      .filter(
        car =>
          car.handle !== currentCar.handle && // ไม่ใช่รถปัจจุบัน
          car.availableForSale && // ยังขายอยู่
          Math.abs(Number(car.price?.amount) - currentPrice) <= priceRange // ราคาใกล้เคียง
      )
      .sort((a, b) => {
        // เรียงตามความคล้าย: ยี่ห้อเดียวกัน > ราคาใกล้เคียง
        const aScore =
          (a.vendor === currentCar.vendor ? 1000 : 0) +
          (1000 - Math.abs(Number(a.price?.amount) - currentPrice) / 1000);
        const bScore =
          (b.vendor === currentCar.vendor ? 1000 : 0) +
          (1000 - Math.abs(Number(b.price?.amount) - currentPrice) / 1000);
        return bScore - aScore;
      })
      .slice(0, 4); // แสดงแค่ 4 คัน
  };

  const similarCars = findSimilarCars();

  if (similarCars.length === 0) {
    return null; // ไม่แสดงถ้าไม่มีรถคล้ายกัน
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-prompt border-b-2 border-accent pb-2">
        รถที่แนะนำ ใกล้เคียงกัน
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarCars.map(car => (
          <article
            key={car.id}
            className="group bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-accent flex flex-col h-full"
          >
            <Link href={`/car/${car.handle}`} className="flex flex-col h-full">
              <figure className="relative w-full h-40 bg-white">
                <Image
                  src={
                    Array.isArray(car.images) && car.images.length > 0
                      ? car.images[0]?.url
                      : '/cover.jpg'
                  }
                  alt={car.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </figure>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2 font-prompt">
                  {car.title}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-accent font-prompt">
                    ฿{Number(car.price.amount).toLocaleString()}
                  </p>
                </div>
                <div className="text-xs text-gray-600 space-y-1 flex-grow">
                  {car.vendor && (
                    <div>
                      ยี่ห้อ: <span className="font-medium">{car.vendor}</span>
                    </div>
                  )}
                  {car.year && (
                    <div>
                      ปี: <span className="font-medium">{car.year}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="flex-1 text-center bg-accent hover:bg-accent-600 text-white text-xs py-2 rounded-lg transition-colors font-prompt">
                    ดูรายละเอียด
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/all-cars"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 font-prompt"
        >
          ดูรถทั้งหมด
        </Link>
      </div>
    </div>
  );
}

export default SimilarCars;

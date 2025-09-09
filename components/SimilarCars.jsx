import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// คอมโพเนนต์แนะนำรถที่คล้ายกัน
function SimilarCars({ currentCar, allCars = [] }) {
  // หาฟังก์ชันรถที่คล้ายกัน - อัลกอริทึมปรับปรุงใหม่
  const findSimilarCars = () => {
    // ป้องกันกรณีข้อมูลไม่ครบ
    if (!currentCar || !Array.isArray(allCars) || allCars.length === 0) return [];

    const currentPrice = Number(currentCar.price?.amount) || 0;
    const currentBrand = currentCar.vendor || currentCar.brand || '';
    const currentYear = Number(currentCar.year) || 0;

    return allCars
      .filter(
        car =>
          car && // ป้องกัน null/undefined
          car.handle !== currentCar.handle && // ไม่ใช่รถปัจจุบัน
          car.availableForSale !== false && // ยังขายอยู่
          car.price?.amount && // มีราคา
          Number(car.price.amount) > 0 // ราคามากกว่า 0
      )
      .map(car => {
        let score = 0;
        const carPrice = Number(car.price.amount);
        const carBrand = car.vendor || car.brand || '';
        const carYear = Number(car.year) || 0;

        // คะแนนตามยี่ห้อ (สำคัญที่สุด)
        if (carBrand && currentBrand && carBrand.toLowerCase() === currentBrand.toLowerCase()) {
          score += 1000;
        }

        // คะแนนตามราคา (ยิ่งใกล้เคียงยิ่งดี)
        const priceDiff = Math.abs(carPrice - currentPrice);
        const priceScore = Math.max(0, 500 - (priceDiff / currentPrice) * 500);
        score += priceScore;

        // คะแนนตามปี (ยิ่งใกล้เคียงยิ่งดี)
        if (currentYear > 0 && carYear > 0) {
          const yearDiff = Math.abs(carYear - currentYear);
          const yearScore = Math.max(0, 200 - yearDiff * 20);
          score += yearScore;
        }

        // คะแนนตามช่วงราคา (รถในระดับเดียวกัน)
        if (currentPrice > 0) {
          if (currentPrice >= 1000000) {
            // รถหรู 1M+
            if (carPrice >= 1000000) score += 100;
          } else if (currentPrice >= 500000) {
            // รถกลาง 500K-1M
            if (carPrice >= 500000 && carPrice < 1000000) score += 100;
          } else {
            // รถประหยัด <500K
            if (carPrice < 500000) score += 100;
          }
        }

        return { ...car, similarityScore: score };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 4); // แสดงแค่ 4 คันที่คล้ายที่สุด
  };

  const similarCars = findSimilarCars();

  if (similarCars.length === 0) {
    // แสดง empty state แทนการไม่แสดงอะไรเลย
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-prompt border-b-2 border-accent pb-2">
            🚗 รถที่แนะนำ
          </h2>
          <Link
            href="/all-cars"
            className="text-accent hover:text-accent-600 font-semibold text-sm font-prompt flex items-center gap-1"
          >
            ดูทั้งหมด
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600 font-prompt mb-4">
            ขออภัย ยังไม่มีรถที่ใกล้เคียงให้แนะนำ
          </p>
          <Link
            href="/all-cars"
            className="inline-flex items-center bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
          >
            <span>ดูรถทั้งหมด</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-prompt border-b-2 border-accent pb-2">
          🚗 รถที่แนะนำ ใกล้เคียงกัน
        </h2>
        <Link
          href="/all-cars"
          className="text-accent hover:text-accent-600 font-semibold text-sm font-prompt flex items-center gap-1"
        >
          ดูทั้งหมด
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarCars.map(car => (
          <article
            key={car.id}
            className="group bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-accent flex flex-col h-full transform hover:-translate-y-1"
          >
            <Link href={`/car/${car.handle}`} className="flex flex-col h-full">
              <figure className="relative w-full h-40 bg-white overflow-hidden">
                <Image
                  src={
                    Array.isArray(car.images) && car.images.length > 0
                      ? car.images[0]?.url
                      : '/herobanner/chiangmaiusedcar.webp'
                  }
                  alt={car.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Badge ยี่ห้อเดียวกัน */}
                {(car.vendor || car.brand) === (currentCar.vendor || currentCar.brand) && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold font-prompt">
                    ยี่ห้อเดียวกัน
                  </div>
                )}

                {/* Badge ราคาใกล้เคียง */}
                {currentCar.price?.amount &&
                  Math.abs(Number(car.price.amount) - Number(currentCar.price.amount)) <=
                    Number(currentCar.price.amount) * 0.15 && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold font-prompt">
                      ราคาใกล้เคียง
                    </div>
                  )}
              </figure>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2 font-prompt leading-snug">
                  {car.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-bold text-accent font-prompt">
                    ฿{Number(car.price.amount).toLocaleString()}
                  </p>

                  {/* ราคาต่างจากรถปัจจุบัน */}
                  {currentCar.price?.amount && (
                    <div className="text-xs text-gray-500 font-prompt">
                      {Number(car.price.amount) > Number(currentCar.price.amount) ? '↗' : '↘'}฿
                      {Math.abs(
                        Number(car.price.amount) - Number(currentCar.price.amount)
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-1 flex-grow font-prompt">
                  <div className="grid grid-cols-2 gap-1">
                    {car.vendor && (
                      <div className="truncate">
                        <span className="font-medium">{car.vendor}</span>
                      </div>
                    )}
                    {car.year && (
                      <div className="truncate text-right">
                        ปี <span className="font-medium">{car.year}</span>
                      </div>
                    )}
                  </div>
                  {car.mileage && (
                    <div className="truncate">
                      วิ่ง{' '}
                      <span className="font-medium">{Number(car.mileage).toLocaleString()}</span>{' '}
                      กม.
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <span className="block text-center bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-xs py-2 px-3 rounded-lg transition-all duration-300 font-prompt font-bold transform group-hover:scale-105">
                    ดูรายละเอียด →
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
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg font-prompt"
        >
          🔍 ค้นหารถเพิ่มเติม
        </Link>
      </div>
    </div>
  );
}

export default SimilarCars;

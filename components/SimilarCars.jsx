import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { carAlt } from '../utils/a11y';

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
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black font-prompt border-b-2 border-accent pb-2 flex-1 mr-4">
            รถที่แนะนำ
          </h2>
          <Link
            href="/all-cars"
            className="text-primary hover:text-blue-700 font-semibold text-xs sm:text-sm font-prompt flex items-center gap-1 transition-colors flex-shrink-0"
          >
            <span className="hidden sm:inline">ดูทั้งหมด</span>
            <span className="sm:hidden">ดูเพิ่ม</span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600 font-prompt mb-4">ขออภัย ยังไม่มีรถที่ใกล้เคียงให้แนะนำ</p>
          <Link
            href="/all-cars"
            className="bg-accent hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors font-prompt inline-block"
          >
            ดูรถทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black font-prompt border-b-2 border-accent pb-2 flex-1 mr-4">
          รถที่แนะนำ ใกล้เคียงกัน
        </h2>
        <Link
          href="/all-cars"
          className="text-primary hover:text-blue-700 font-semibold text-xs sm:text-sm font-prompt flex items-center gap-1 transition-colors flex-shrink-0"
        >
          <span className="hidden sm:inline">ดูทั้งหมด</span>
          <span className="sm:hidden">ดูเพิ่ม</span>
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {similarCars.map(car => (
          <article
            key={car.id}
            className="group bg-white rounded-lg border border-gray-200 hover:border-primary transition-all duration-200 overflow-hidden flex flex-col h-full"
          >
            <Link href={`/car/${car.handle}`} className="flex flex-col h-full">
              <figure className="relative w-full h-32 md:h-40 bg-gray-50 overflow-hidden">
                <Image
                  src={
                    Array.isArray(car.images) && car.images.length > 0
                      ? car.images[0]?.url
                      : '/herobanner/chiangmaiusedcar.webp'
                  }
                  alt={carAlt(car)}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Badge ยี่ห้อเดียวกัน */}
                {(car.vendor || car.brand) === (currentCar.vendor || currentCar.brand) && (
                  <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-accent text-white text-xs px-1 py-0.5 md:px-2 md:py-1 rounded-md font-bold font-prompt">
                    <span className="hidden md:inline">ยี่ห้อเดียวกัน</span>
                    <span className="md:hidden">ยี่ห้อเดียวกัน</span>
                  </div>
                )}

                {/* Badge ราคาใกล้เคียง */}
                {currentCar.price?.amount &&
                  Math.abs(Number(car.price.amount) - Number(currentCar.price.amount)) <=
                    Number(currentCar.price.amount) * 0.15 && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-primary text-white text-xs px-1 py-0.5 md:px-2 md:py-1 rounded-md font-bold font-prompt">
                      <span className="hidden md:inline">ราคาใกล้เคียง</span>
                      <span className="md:hidden">ใกล้เคียง</span>
                    </div>
                  )}
              </figure>

              <div className="p-2 md:p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-xs md:text-sm text-black mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 font-prompt leading-tight">
                  {car.title}
                </h3>

                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <p className="text-sm md:text-lg font-bold text-primary font-prompt">
                    ฿{Number(car.price.amount).toLocaleString()}
                  </p>

                  {/* ราคาต่างจากรถปัจจุบัน - ซ่อนในมือถือ */}
                  {currentCar.price?.amount && (
                    <div className="hidden md:block text-xs text-gray-500 font-prompt">
                      {Number(car.price.amount) > Number(currentCar.price.amount) ? '↗' : '↘'}฿
                      {Math.abs(
                        Number(car.price.amount) - Number(currentCar.price.amount)
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-1 flex-grow font-prompt">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {car.vendor && (
                      <div className="truncate">
                        <span className="font-medium">{car.vendor}</span>
                      </div>
                    )}
                    {car.year && (
                      <div className="truncate md:text-right">
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

                <div className="mt-2 md:mt-3">
                  <span className="block text-center bg-accent hover:bg-orange-600 text-white text-xs py-1.5 md:py-2 px-2 md:px-3 rounded-lg transition-colors font-prompt font-bold">
                    <span className="hidden md:inline">ดูรายละเอียด →</span>
                    <span className="md:hidden">ดูเพิ่ม</span>
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
          className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-prompt inline-block"
        >
          ค้นหารถเพิ่มเติม
        </Link>
      </div>
    </div>
  );
}

export default SimilarCars;

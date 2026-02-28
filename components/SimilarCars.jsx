import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CarCard from './CarCard';
import { scheduleAfterLoadThenIdle } from '../utils/scheduler';
import { mergeCarSpecs } from '../lib/mergeCarSpecs';

// คอมโพเนนต์แนะนำรถที่คล้ายกัน
function SimilarCars({ currentCar, allCars = [], recommendations = [] }) {
  const [specByHandle, setSpecByHandle] = useState({});
  const requestedSpecHandlesRef = useRef(new Set());
  const specFetchAttemptsRef = useRef(new Map());

  //  New Intersection Observer logic to eagerly load images right before they enter the screen
  const [shouldPreload, setShouldPreload] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined' || !window.IntersectionObserver)
      return;

    // Add margin to trigger loading before user scrolls to the cards
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !shouldPreload) {
          setShouldPreload(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      { rootMargin: '400px', threshold: 0 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [shouldPreload]);

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

  const similarCars =
    Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations
      : findSimilarCars();

  const safeSimilarCars = useMemo(
    () => (Array.isArray(similarCars) ? similarCars : []),
    [similarCars]
  );

  // Enrich missing quick specs for SimilarCars cards (ปี/ไมล์/เกียร์/เชื้อเพลิง)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (safeSimilarCars.length === 0) return;

    let cancelled = false;
    let cleanup = () => {};

    const needs = [];
    for (const car of safeSimilarCars) {
      const handle = car?.handle;
      if (!handle) continue;
      if (requestedSpecHandlesRef.current.has(handle)) continue;

      const attempts = Number(specFetchAttemptsRef.current.get(handle) || 0);
      if (attempts >= 2) continue;

      const extra = specByHandle?.[handle];
      const merged = mergeCarSpecs(car, extra);

      const hasYear = merged?.year != null && String(merged.year).trim() !== '';
      const hasMileage = merged?.mileage != null && String(merged.mileage).trim() !== '';
      const hasTransmission =
        merged?.transmission != null && String(merged.transmission).trim() !== '';
      const drive =
        merged?.drivetrain ||
        merged?.drive_type ||
        merged?.driveType ||
        merged?.['drive-type'] ||
        merged?.wheel_drive ||
        merged?.wheelDrive;
      const hasDrivetrain = drive != null && String(drive).trim() !== '';
      const fuel = merged?.fuelType || merged?.fuel_type;
      const hasFuel = fuel != null && String(fuel).trim() !== '';

      if (!(hasYear && hasMileage && hasTransmission && hasDrivetrain && hasFuel)) {
        needs.push(handle);
      }
    }

    if (needs.length === 0) return;
    needs.forEach(h => {
      requestedSpecHandlesRef.current.add(h);
      specFetchAttemptsRef.current.set(h, Number(specFetchAttemptsRef.current.get(h) || 0) + 1);
    });

    const fetchSpecs = async () => {
      try {
        if (cancelled) return;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const canonical = Array.from(new Set(needs.filter(Boolean))).sort();
        const params = new URLSearchParams({ handles: canonical.join(',') });
        const resp = await fetch(`/api/public/car-specs?${params.toString()}`, {
          // Allow browser + CDN caching to avoid competing with the image gallery.
          cache: 'force-cache',
          credentials: 'same-origin',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!resp.ok) {
          needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
          return;
        }
        const data = await resp.json();
        if (!data?.ok || !data?.specs) {
          needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
          return;
        }

        const returned = new Set(Object.keys(data.specs || {}));
        for (const h of needs) {
          if (!returned.has(h)) requestedSpecHandlesRef.current.delete(h);
        }

        setSpecByHandle(prev => ({
          ...(prev || {}),
          ...data.specs,
        }));

        // Treat requestedSpecHandlesRef as in-flight only.
        // If specs are still incomplete (e.g. drivetrain missing), allow a limited retry.
        needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
      } catch {
        needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
      }
    };

    cleanup = scheduleAfterLoadThenIdle(
      () => {
        fetchSpecs().catch(() => {});
      },
      { timeout: 5000, fallbackDelayMs: 3500 }
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [safeSimilarCars, specByHandle]);

  if (similarCars.length === 0) {
    // แสดง empty state แทนการไม่แสดงอะไรเลย
    return (
      <section ref={sectionRef} className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center py-8 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600 font-prompt mb-4">ขออภัย ยังไม่มีรถที่ใกล้เคียงให้แนะนำ</p>
          <Link
            href="/all-cars"
            className="bg-accent hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors font-prompt inline-block"
          >
            ดูรถทั้งหมด
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mb-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-center justify-between">
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
      </div>

      <div className="mt-4 car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
        {safeSimilarCars.map(car => {
          const handle = car?.handle;
          const extra = handle ? specByHandle?.[handle] : null;
          const mergedCar = mergeCarSpecs(car, extra);
          return <CarCard key={car.id} car={mergedCar} priority={shouldPreload} />;
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/all-cars"
          className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-prompt inline-block"
        >
          ค้นหารถเพิ่มเติม
        </Link>
      </div>
    </section>
  );
}

export default SimilarCars;

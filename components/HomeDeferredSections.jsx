import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import A11yImage from './A11yImage';
import CarCard from './CarCard';

const SocialShareButtons = dynamic(() => import('./SocialShareButtons'), { ssr: false });
const FacebookReviewsSection = dynamic(() => import('./FacebookReviewsSection'), { ssr: false });

export default function HomeDeferredSections({
  safeCars: inputCars,
  mergeSpecs,
  getBrandCount,
  homeItemListJsonLd,
}) {
  const router = useRouter();

  // Defer non-critical share widget to reduce long tasks during hydration
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [socialShareUrl, setSocialShareUrl] = useState('');

  // Facebook reviews: render only client
  const [showFbReviews, setShowFbReviews] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  // Memoize expensive computations
  const safeCars = useMemo(() => (Array.isArray(inputCars) ? inputCars : []), [inputCars]);

  // Memoize static data to prevent re-creation
  const brands = useMemo(
    () => ['all', 'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'isuzu', 'ford'],
    []
  );
  const priceRanges = useMemo(
    () => [
      { value: 'all', label: 'เธ—เธธเธเธเนเธงเธเธฃเธฒเธเธฒ' },
      { value: '0-100000', label: 'เธ•เนเธณเธเธงเนเธฒ 1 เนเธชเธ' },
      { value: '100000-200000', label: '1-2 เนเธชเธ' },
      { value: '200000-300000', label: '2-3 เนเธชเธ' },
      { value: '300000-400000', label: '3-4 เนเธชเธ' },
      { value: '400000-500000', label: '4-5 เนเธชเธ' },
      { value: '500000-600000', label: '5-6 เนเธชเธ' },
      { value: '600000-700000', label: '6-7 เนเธชเธ' },
      { value: '700000', label: '7 เนเธชเธเธเธถเนเธเนเธ' },
    ],
    []
  );

  // Optimize heavy functions with useCallback
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    const term = (searchTerm || '').trim().slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);

    const queryString = params.toString();
    const url = queryString ? `/all-cars?${queryString}` : '/all-cars';
    router.push(url);
  }, [searchTerm, priceRange, brandFilter, router]);

  // Load Facebook reviews only when the user is near that section.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showFbReviews) return;

    const anchor = document.getElementById('fb-reviews-anchor');
    if (!anchor) {
      const t = window.setTimeout(() => setShowFbReviews(true), 8000);
      return () => window.clearTimeout(t);
    }

    if (typeof window.IntersectionObserver !== 'function') {
      setShowFbReviews(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShowFbReviews(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [showFbReviews]);

  // Load SocialShareButtons after the page is idle or when user interacts.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showSocialShare) return;

    let done = false;
    let idleId;
    let timeoutId;

    const enable = () => {
      if (done) return;
      done = true;
      try {
        setSocialShareUrl(window.location.href);
      } catch {
        setSocialShareUrl('');
      }
      setShowSocialShare(true);
      cleanupListeners();
    };

    const onInteraction = () => enable();
    const events = ['scroll', 'click', 'touchstart', 'keydown'];

    const cleanupListeners = () => {
      for (const ev of events) {
        window.removeEventListener(ev, onInteraction);
      }
    };

    for (const ev of events) {
      try {
        window.addEventListener(ev, onInteraction, { passive: true, once: true });
      } catch {
        // Some older/in-app browsers don't support the options object.
        window.addEventListener(ev, onInteraction);
      }
    }

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 3500 });
    } else {
      timeoutId = window.setTimeout(enable, 2000);
    }

    // Fallback safety net: always show within 8s even if idle callback doesn't fire.
    const hardTimeoutId = window.setTimeout(enable, 8000);

    return () => {
      cleanupListeners();
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearTimeout(hardTimeoutId);
    };
  }, [showSocialShare]);

  return (
    <>
      {/* Why Choose Us Section - SEO Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 bg-white cv-auto-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center font-prompt">
            เธ—เธณเนเธกเธ•เนเธญเธเน€เธฅเธทเธญเธเธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข?
          </h2>

          {/* Main Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed font-prompt">
            {/* Paragraph 1 - Quality & Financing */}
            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg">
                <strong className="text-primary">
                  เธจเธนเธเธขเนเธฃเธงเธกเธฃเธ–เธเนเธฒเธเธเธธเธ“เธ เธฒเธเธ”เธต
                </strong>{' '}
                เนเธเธ•เธฅเธฒเธ”เธฃเธ–เธขเธเธ•เนเธกเธทเธญเธชเธญเธเธ เธฒเธเน€เธซเธเธทเธญ{' '}
                <strong className="text-gray-900">
                  เธเธฑเธ”เธชเธฃเธฃเธเธธเธ“เธ เธฒเธเธ—เธธเธเธเธฑเธ
                </strong>{' '}
                เธ•เธฃเธงเธเธชเธญเธเนเธ”เธขเธเธนเนเน€เธเธตเนเธขเธงเธเธฒเธ เธเธฃเนเธญเธก{' '}
                <strong className="text-green-700">
                  เธฃเธฑเธเธเธฃเธฐเธเธฑเธ 1 เธเธตเน€เธ•เนเธก
                </strong>{' '}
                เน€เธฃเธฒเธกเธต
                <strong className="text-accent-800"> เธเธฃเธตเธ”เธฒเธงเธเน 0%</strong>{' '}
                เธญเธฑเธ•เธฃเธฒเธ”เธญเธเน€เธเธตเนเธขเธเธดเน€เธจเธฉ เนเธฅเธฐ
                <strong className="text-primary"> เธญเธเธธเธกเธฑเธ•เธดเธเนเธฒเธข</strong>{' '}
                เธ”เนเธงเธขเธฃเธฐเธเธเธชเธดเธเน€เธเธทเนเธญเธ—เธตเนเธซเธฅเธฒเธเธซเธฅเธฒเธข{' '}
                <strong className="text-gray-900">เธเนเธญเธเธ–เธนเธ เธเนเธญเธเธชเธเธฒเธข</strong>
              </p>
            </div>

            {/* Paragraph 2 - Car Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg mb-4">
                <strong className="text-gray-900">
                  เน€เธฃเธฒเธกเธตเธฃเธ–เธขเธตเนเธซเนเธญเธ”เธฑเธเนเธซเนเน€เธฅเธทเธญเธเธกเธฒเธเธกเธฒเธข
                </strong>{' '}
                <Link
                  href="/all-cars?brand=toyota"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Toyota
                </Link>{' '}
                <Link
                  href="/all-cars?brand=honda"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Honda
                </Link>{' '}
                <Link
                  href="/all-cars?brand=nissan"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Nissan
                </Link>{' '}
                <Link
                  href="/all-cars?brand=mazda"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Mazda
                </Link>{' '}
                <Link
                  href="/all-cars?brand=isuzu"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Isuzu
                </Link>{' '}
                เธ—เธฑเนเธ
                <Link
                  href="/all-cars?type=เน€เธเนเธ"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  เธฃเธ–เน€เธเนเธ
                </Link>{' '}
                <Link
                  href="/all-cars?type=เธเธฃเธฐเธเธฐ"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  เธฃเธ–เธเธฃเธฐเธเธฐ
                </Link>{' '}
                <Link
                  href="/all-cars?type=SUV"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  เธฃเธ– SUV
                </Link>{' '}
                เนเธฅเธฐเธฃเธ–เธเธฃเธญเธเธเธฃเธฑเธง 7 เธ—เธตเนเธเธฑเนเธ เธเธฃเนเธญเธก
                <strong className="text-primary">
                  {' '}
                  เธชเนเธเธเธฃเธตเธ—เธฑเนเธงเธเธฃเธฐเน€เธ—เธจเนเธ—เธข
                </strong>
              </p>
            </div>

            {/* Paragraph 3 - Services & Contact */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg mb-4">
                <strong className="text-gray-900">
                  เธกเธตเธเธฑเธเธซเธฒเน€เธฃเธทเนเธญเธเธชเธดเธเน€เธเธทเนเธญ?
                </strong>{' '}
                <Link
                  href="/credit-check"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-semibold"
                >
                  เธเธฃเธถเธเธฉเธฒเนเธเนเธเธเธเนเธเธฃเธต
                </Link>{' '}
                เน€เธฃเธฒเธกเธตเธ—เธตเธกเธเธฒเธเธกเธทเธญเธญเธฒเธเธตเธเธเธญเธขเนเธซเนเธเธณเธเธฃเธถเธเธฉเธฒ{' '}
                <strong className="text-gray-900">เนเธฅเธฐเธญเธขเธฒเธเธเธฒเธขเธฃเธ–?</strong>{' '}
                <Link
                  href="/sell-car"
                  prefetch={false}
                  className="text-primary hover:underline font-semibold"
                >
                  เธเธฃเธฐเน€เธกเธดเธเธฃเธฒเธเธฒเธเธฃเธต เธฃเธฑเธเธเธทเนเธญเธ—เธฑเธเธ—เธต
                </Link>{' '}
                เธฃเธฒเธเธฒเธขเธธเธ•เธดเธเธฃเธฃเธก
              </p>

              {/* Contact CTA */}
              <p className="mt-6 pt-6 border-t border-orange-200 text-center text-sm sm:text-base mb-3 text-gray-700">
                <strong className="text-gray-900">เธเธฑเธ”เธซเธกเธฒเธขเธ”เธนเธฃเธ–</strong>
              </p>
              <a
                href="tel:0940649018"
                className="flex w-fit mx-auto items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-base sm:text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1  1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>094-064-9018</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <main
        className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-16 bg-white font-prompt cv-auto-md"
        id="recommended-cars"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
            เธเนเธเธซเธฒเธฃเธ–เธ—เธตเนเธเธธเธ“เธ•เนเธญเธเธเธฒเธฃ
          </h2>

          {/* Search Bar - 2025 Modern Design */}
          <div className="max-w-6xl mx-auto font-prompt">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div>
                  <label htmlFor="searchTerm" className="sr-only">
                    เธเนเธเธซเธฒเธฃเธ–
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    name="search"
                    placeholder="เธเนเธเธซเธฒเธฃเธ–..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label htmlFor="priceRange" className="sr-only">
                    เธเนเธงเธเธฃเธฒเธเธฒ
                  </label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={priceRange}
                    onChange={e => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label htmlFor="brandFilter" className="sr-only">
                    เธขเธตเนเธซเนเธญเธฃเธ–
                  </label>
                  <select
                    id="brandFilter"
                    name="brand"
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
                  >
                    <option value="all">เธ—เธธเธเธขเธตเนเธซเนเธญ</option>
                    {brands.slice(1).map(brand => (
                      <option key={brand} value={brand}>
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full bg-accent-800 hover:bg-accent-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 font-prompt shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    เธเนเธเธซเธฒ
                  </button>
                </div>
              </div>

              {/* Quick Links - Price Ranges (2025 Modern Clean Design) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/all-cars?price=0-100000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  เธ•เนเธณเธเธงเนเธฒ 1 เนเธชเธ ({'< 100K'})
                </Link>
                <Link
                  href="/all-cars?price=100000-200000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  1-2 เนเธชเธ (100K-200K)
                </Link>
                <Link
                  href="/all-cars?price=200000-300000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  2-3 เนเธชเธ (200K-300K)
                </Link>
                <Link
                  href="/all-cars?price=400000-500000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  4-5 เนเธชเธ (400K-500K)
                </Link>
                <Link
                  href="/all-cars?price=600000-700000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  6-7 เนเธชเธ (600K-700K)
                </Link>
                <Link
                  href="/all-cars?price=700000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-accent rounded-xl hover:bg-accent-800 hover:border-accent-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-accent-800 hover:text-white"
                >
                  7 เนเธชเธเธเธถเนเธเนเธ ({'> 700K'})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* เธฃเธ–เนเธเธฐเธเธณเน€เธเนเธฒเนเธซเธกเน */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-prompt">
            เธฃเธ–เนเธเธฐเธเธณเน€เธเนเธฒเนเธซเธกเนเธงเธฑเธเธเธตเน
          </h2>
          <p className="text-base text-gray-700 font-prompt leading-relaxed max-w-3xl mx-auto">
            เธฃเธ–เน€เธเนเธ เธฃเธ–เธเธฃเธฐเธเธฐ เธฃเธ–เธเธฃเธญเธเธเธฃเธฑเธง
            เธฃเธ–เธญเธตเนเธเนเธเธฒเธฃเน SUV เนเธเธฃเนเธงเธตเธฅ{' '}
            <span className="font-bold text-primary">
              เธเธฑเธ”เน€เธเธเธฒเธฐเธฃเธ–เธกเธทเธญเน€เธ”เธตเธขเธง เธเธฃเธฐเธงเธฑเธ•เธดเนเธช 100%
            </span>{' '}
            เธเธฑเธ”เธชเธฃเธฃเธกเธฒเน€เธเธทเนเธญเธเธธเธ“เนเธ”เธขเน€เธเธเธฒเธฐ
            เธเนเธฒเธเธเธฒเธฃเธ•เธฃเธงเธเธชเธญเธเธญเธขเนเธฒเธเธฅเธฐเน€เธญเธตเธขเธ”
            เน€เธเธทเนเธญเนเธซเนเธเธธเธ“เธกเธฑเนเธเนเธเนเธเธ—เธธเธเธเธฒเธฃเน€เธ”เธดเธเธ—เธฒเธ
          </p>
        </div>
        {/* Cars grid (standardized layout across pages) */}
        <div className="-mx-6 md:-mx-8 lg:-mx-12">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-5 ipadpro:px-3 lg:px-6">
            <section aria-label="เธฃเธ–เน€เธเนเธฒเนเธซเธกเนเนเธเธฐเธเธณเธงเธฑเธเธเธตเน">
              {safeCars.length === 0 ? (
                // Empty state when no cars available
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">๐—</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">
                    เธเธญเธญเธ เธฑเธข เธขเธฑเธเนเธกเนเธกเธตเธฃเธ–เนเธซเนเนเธชเธ”เธ
                  </h3>
                  <p className="text-gray-500 font-prompt mb-4">
                    เน€เธฃเธฒเธเธณเธฅเธฑเธเธญเธฑเธเน€เธ”เธ•เธฃเธ–เนเธซเธกเน
                    เธ•เธดเธ”เธ•เธฒเธกเนเธ”เนเธ—เธตเน Facebook เธซเธฃเธทเธญ LINE
                  </p>
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-accent-800 hover:bg-accent-900 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
                  >
                    <span>เธ•เธดเธ”เธ•เนเธญเธชเธญเธเธ–เธฒเธก</span>
                  </a>
                </div>
              ) : (
                <div className="car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
                  {safeCars.slice(0, 8).map((car, index) => {
                    const mergedCar = mergeSpecs(car, null);
                    return <CarCard key={car.id} car={mergedCar} priority={index < 2} />;
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            prefetch={false}
            className="inline-flex items-center bg-gray-900 hover:bg-accent-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 space-x-2 border-2 border-accent font-prompt"
            aria-label="เธ”เธนเธฃเธ–เธ—เธฑเนเธเธซเธกเธ” เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข"
          >
            <span>เธ”เธนเธฃเธ–เธ—เธฑเนเธเธซเธกเธ”</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </main>

      <section className="bg-white py-8 sm:py-10 mt-6 rounded-3xl max-w-6xl mx-auto border border-gray-200 shadow-sm cv-auto">
        <div className="px-4 sm:px-6">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
              เธเธณเธ–เธฒเธกเธ—เธตเนเธเธเธเนเธญเธข
            </h2>
            <p className="mt-1 text-sm sm:text-base text-gray-700 font-prompt">
              เธฃเธงเธกเธเธณเธ•เธญเธเน€เธฃเธทเนเธญเธเธ”เธฒเธงเธเน 0% เน€เธเธฃเธ”เธดเธ•เธเธนเนเธฃ
              เนเธฅเธฐเธฃเธฑเธเธเธฃเธฐเธเธฑเธ
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  เธ”เธฒเธงเธเน 0% เธเธฃเธดเธเนเธซเธก?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  เธ”เธนเธเธณเธ•เธญเธ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  เธเนเธญเธเธเธณเธ•เธญเธ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-accent-800">เธเธฃเธดเธ!</span>{' '}
                  เธฅเธนเธเธเนเธฒเธชเธฒเธกเธฒเธฃเธ–เธญเธญเธเธฃเธ–เธเธฃเธตเธ”เธฒเธงเธเนเธ•เธฒเธกเนเธเธฃเนเธกเธเธฑเธ
                  เธ•เธฃเธงเธเธชเธ เธฒเธเธเธฃเธเธ–เนเธงเธ
                  เนเธฅเธฐเธ•เธฃเธงเธเธชเธญเธเธเธฃเธฐเธงเธฑเธ•เธดเธฃเธ–เธเนเธญเธเธชเนเธเธกเธญเธ
                </div>
              </div>
            </details>

            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  เธ•เธดเธ”เน€เธเธฃเธ”เธดเธ•เธเธนเนเธฃเธญเธญเธเนเธ”เนเนเธซเธก?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  เธ”เธนเธเธณเธ•เธญเธ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  เธเนเธญเธเธเธณเธ•เธญเธ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-primary">เนเธ”เน!</span>
                  เน€เธฃเธฒเธกเธตเนเธเนเธเธเธเนเธซเธฅเธฒเธเธซเธฅเธฒเธขเนเธเธ
                  เนเธเธฐเธเธณเนเธซเนเธ—เธฑเธ LINE เธซเธฃเธทเธญเนเธ—เธฃ{' '}
                  <a href="tel:0940649018" className="text-primary font-bold hover:underline ml-1">
                    094-064-9018
                  </a>{' '}
                  เน€เธเธทเนเธญเธเธฃเธฐเน€เธกเธดเธเน€เธเธทเนเธญเธเธ•เนเธ
                </div>
              </div>
            </details>

            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  เธกเธตเธฃเธฑเธเธเธฃเธฐเธเธฑเธเนเธซเธก?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  เธ”เธนเธเธณเธ•เธญเธ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  เธเนเธญเธเธเธณเธ•เธญเธ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-accent-800">เธฃเธฑเธเธเธฃเธฐเธเธฑเธ</span>
                  เน€เธเธฃเธทเนเธญเธเธขเธเธ•เนเนเธฅเธฐเน€เธเธตเธขเธฃเน{' '}
                  <span className="font-bold text-primary">1 เธเธตเน€เธ•เนเธก</span>{' '}
                  เธ•เธฃเธงเธเธชเธ เธฒเธเธเธฃเธเธ–เนเธงเธเธเนเธญเธเธชเนเธเธกเธญเธ
                  เนเธฅเธฐเธกเธตเธเธฃเธดเธเธฒเธฃเธซเธฅเธฑเธเธเธฒเธฃเธเธฒเธข
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* เธฃเธตเธงเธดเธง Facebook 9 เธฃเธตเธงเธดเธงเธเธฃเธดเธ (เนเธซเธฅเธ”เน€เธกเธทเนเธญเนเธเธฅเน viewport) */}
      <div id="fb-reviews-anchor" className="h-px w-full" aria-hidden="true" />
      {showFbReviews && <FacebookReviewsSection />}

      {/* Why Choose Us Section - 2025 Modern Design */}
      <section className="py-16 mt-8 rounded-3xl max-w-[1400px] mx-auto shadow-xl overflow-hidden bg-white cv-auto-lg">
        <div className="px-6 md:px-10">
          {/* Header Banner (kn9) */}
          <div className="relative rounded-3xl overflow-hidden mb-12 lg:mb-4">
            <div className="relative h-[220px] sm:h-[260px] md:h-[280px] lg:h-[340px]">
              <A11yImage
                src="/images/kn9.webp"
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1400px) 1400px, 1400px"
                className="absolute inset-0 w-full h-full object-cover object-[50%_36%] sm:object-[50%_62%] lg:object-[50%_56%]"
              />
              <div className="absolute inset-0 bg-black/55 sm:bg-black/40" aria-hidden="true" />

              {/* Floating text above image */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-start text-center px-4 sm:px-8 pt-10 sm:pt-12">
                <h2 className="text-[19px] sm:text-3xl md:text-4xl font-bold text-white mb-4 font-prompt whitespace-nowrap sm:whitespace-normal leading-tight tracking-tight drop-shadow-sm">
                  เธฅเธนเธเธเนเธฒเธ—เธฑเนเธงเธเธฃเธฐเน€เธ—เธจเนเธงเนเธงเธฒเธเนเธเน€เธเธฃเธฒเธฐ?
                </h2>
                <p className="text-base sm:text-lg lg:text-base text-white/90 max-w-2xl lg:max-w-none mx-auto font-prompt leading-relaxed lg:leading-tight whitespace-normal lg:whitespace-nowrap drop-shadow-sm">
                  <span className="text-white font-semibold">
                    เธเธฃเธฐเธชเธเธเธฒเธฃเธ“เน 10 เธเธต+
                  </span>{' '}
                  <span className="font-semibold text-white">
                    เน€เธเธเธเธธเนเธเธเธนเนเธ•เธดเธ”เธ•เธฒเธก 1
                    เธฅเนเธฒเธเธเธเธ—เธฑเนเธงเธเธฃเธฐเน€เธ—เธจ
                  </span>{' '}
                  <span className="text-white font-semibold">
                    เธฅเธนเธเธเนเธฒ 90% เน€เธเธทเนเธญเธกเธฑเนเธ
                  </span>{' '}
                  <span
                    className="inline-block font-extrabold text-white tracking-tight text-lg sm:text-xl lg:text-lg px-2 py-0.5 rounded-lg bg-black/45"
                    style={{
                      textShadow:
                        '-2px 0 rgba(0,0,0,0.9), 2px 0 rgba(0,0,0,0.9), 0 -2px rgba(0,0,0,0.9), 0 2px rgba(0,0,0,0.9), -2px -2px rgba(0,0,0,0.9), 2px -2px rgba(0,0,0,0.9), -2px 2px rgba(0,0,0,0.9), 2px 2px rgba(0,0,0,0.9), 0 3px 18px rgba(0,0,0,0.45)',
                    }}
                  >
                    เนเธกเนเธ•เนเธญเธเธกเธฒเธ”เธนเธฃเธ–
                  </span>
                </p>
                <div className="w-32 h-1 bg-white/70 mx-auto rounded-full mt-6"></div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn2.webp"
                  alt="เนเธญเธเธญเธเธฃเธ–เธเนเธฒเธเนเธ—เน"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-primary font-semibold">
                  เธเธฑเธ”เน€เธเธเธฒเธฐเธฃเธ–เธกเธทเธญเน€เธ”เธตเธขเธง
                </span>
                <span className="block">
                  <span className="text-primary font-semibold">
                    เธเธฒเธเน€เธเนเธฒเธเธญเธเนเธ”เธขเธ•เธฃเธ
                  </span>{' '}
                  <span className="text-accent-800 font-semibold">
                    เนเธกเนเธกเธตเธฃเธ–เธเนเธณเธ—เนเธงเธก
                    เนเธกเนเธกเธตเธฃเธ–เธญเธธเธเธฑเธ•เธดเน€เธซเธ•เธธ
                  </span>{' '}
                  <span className="text-primary">
                    เธเธญเธ”เธนเน€เธฅเนเธกเธ—เธฐเน€เธเธตเธขเธเนเธ”เนเธ—เธธเธเธซเธเนเธฒ
                  </span>
                </span>
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn1.webp"
                  alt="เนเธญเธเธญเธเธเธฃเธตเธ”เธฒเธงเธเน 0%"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-orange-700 font-semibold">
                  เธญเธญเธเธฃเธ–เนเธกเนเธ•เนเธญเธเธงเธฒเธเน€เธเธดเธเธ”เธฒเธงเธเน
                </span>
                <span className="block">
                  เธ•เธฒเธกเน€เธเธทเนเธญเธเนเธเนเธเนเธเธเธเน{' '}
                  <span className="text-primary font-semibold">
                    เธญเธเธธเธกเธฑเธ•เธดเธเนเธฒเธข เธเนเธญเธเธชเธเธฒเธข
                  </span>
                </span>
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn6.webp"
                  alt="เนเธญเธเธญเธเธฃเธฑเธเธเธฃเธฐเธเธฑเธ"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block">
                  เธฃเธฑเธเธเธฃเธฐเธเธฑเธเน€เธเธฃเธทเนเธญเธเธขเธเธ•เนเนเธฅเธฐเน€เธเธตเธขเธฃเน
                </span>
                <span className="block">
                  <span className="text-primary font-semibold">
                    1 เธเธตเน€เธ•เนเธก เนเธกเนเธเธณเธเธฑเธ”เธเธดเนเธฅเน€เธกเธ•เธฃ
                  </span>{' '}
                  เธเธฃเนเธญเธก{' '}
                  <span className="text-orange-700 font-semibold">
                    เธเธฃเธดเธเธฒเธฃเธซเธฅเธฑเธเธเธฒเธฃเธเธฒเธข
                  </span>
                </span>
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn5.webp"
                  alt="เนเธญเธเธญเธเธชเนเธเธเธฃเธต"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-orange-700 font-semibold">
                  เธเธฑเธ”เธชเนเธเธเธฃเธตเธ—เธธเธเธเธฑเธเธซเธงเธฑเธ”
                </span>
                <span className="block">
                  เธเธฃเนเธญเธกเธเธฃเธฐเธเธฑเธเธเธฒเธฃเธเธเธชเนเธ{' '}
                  <span className="text-primary font-semibold">
                    เธฅเธนเธเธเนเธฒ 90% เน€เธเธทเนเธญเธกเธฑเนเธ
                  </span>
                </span>
                <span className="block">เนเธกเนเธ•เนเธญเธเธกเธฒเธ”เธนเธฃเธ–</span>
              </p>
            </div>
          </div>

          {/* Car Brands Section - Glass Effect */}
          <div className="relative rounded-3xl p-4 md:p-8 border border-gray-200 shadow-2xl overflow-hidden bg-white">
            {/* Animated Background Elements */}
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(26,35,126,0.03),transparent_50%)]"></div>
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.02),transparent_50%)]"></div>
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(37,99,235,0.02),transparent_50%)]"></div>

            <div className="relative z-10 text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 font-prompt leading-tight">
                เธจเธนเธเธขเนเธฃเธงเธกเนเธเธฃเธเธ”เนเธ”เธฑเธเธเธฃเธเธเธฃเธฑเธ
              </h3>
              <p className="text-gray-700 font-prompt text-sm md:text-lg leading-relaxed max-w-2xl mx-auto px-2">
                เธฃเธ–เธกเธทเธญเธชเธญเธเธเธธเธ“เธ เธฒเธเธเธฒเธเธ—เธธเธเนเธเธฃเธเธ”เนเธเธฑเนเธเธเธณ
                เธ•เธฒเธกเธกเธฒเธ•เธฃเธเธฒเธ เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข
              </p>
            </div>

            {/* Brand Grid - Ultra Glass Design */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              <Link
                href="/all-cars?brand=toyota"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-xl md:rounded-3xl p-3 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Toyota เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-sm md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Toyota
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('toyota')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=honda"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Honda เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Honda
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('honda')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=nissan"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Nissan เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Nissan
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('nissan')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mazda"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Mazda เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Mazda
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('mazda')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mitsubishi"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Mitsubishi เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Mitsubishi
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('mitsubishi')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=ford"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Ford เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Ford
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('ford')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=isuzu"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Isuzu เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Isuzu
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('isuzu')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=hyundai"
                prefetch={false}
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="เธ”เธนเธฃเธ– Hyundai เธ—เธฑเนเธเธซเธกเธ”"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Hyundai
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('hyundai')}
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Links - Ultra Modern 2025 Neomorphic Glass Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 px-2 md:px-0">
              <Link
                href="/contact"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เธ•เธดเธ”เธ•เนเธญเธชเธญเธเธ–เธฒเธกเธเนเธญเธกเธนเธฅเธฃเธ–เธขเธเธ•เน"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เธ•เธดเธ”เธ•เนเธญเน€เธฃเธฒ
                  </span>
                </div>
              </Link>

              <Link
                href="/about"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เน€เธฃเธตเธขเธเธฃเธนเนเน€เธเธดเนเธกเน€เธ•เธดเธกเน€เธเธตเนเธขเธงเธเธฑเธเธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เน€เธเธตเนเธขเธงเธเธฑเธเน€เธฃเธฒ
                  </span>
                </div>
              </Link>

              <Link
                href="/promotion"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เธ”เธนเนเธเธฃเนเธกเธเธฑเนเธเนเธฅเธฐเธเนเธญเน€เธชเธเธญเธเธดเน€เธจเธฉ"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,152,0,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เนเธเธฃเนเธกเธเธฑเนเธ
                  </span>
                </div>
              </Link>

              <Link
                href="/credit-check"
                prefetch={false}
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เธ•เธฃเธงเธเธชเธญเธเธชเธ–เธฒเธเธฐเธชเธดเธเน€เธเธทเนเธญ"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เธเธฃเธฐเน€เธกเธดเธเธชเธดเธเน€เธเธทเนเธญ
                  </span>
                </div>
              </Link>

              <Link
                href="/payment-calculator"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เธเธณเธเธงเธ“เน€เธเธดเธเธเนเธญเธเธฃเธ–เธขเธเธ•เน"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เธเธดเธ”เน€เธเธดเธเธเนเธญเธ
                  </span>
                </div>
              </Link>

              <Link
                href="/sell-car"
                prefetch={false}
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เธเธฒเธขเธฃเธ–เธเธฑเธเธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เธเธฒเธขเธฃเธ–
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Share Buttons - Fixed Position */}
      {showSocialShare && (
        <SocialShareButtons
          url={socialShareUrl}
          title="เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข - เธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเนเธเธธเธ“เธ เธฒเธเธ”เธต"
          description="เธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเนเธเธธเธ“เธ เธฒเธเธ”เธต เธเธฑเธ”เธชเธฃเธฃเธ—เธธเธเธเธฑเธ เธเธฃเธตเธ”เธฒเธงเธเน 0% เธฃเธฑเธเธเธฃเธฐเธเธฑเธ 1 เธเธต เธชเนเธเธเธฃเธตเธ—เธฑเนเธงเนเธ—เธข"
          position="fixed"
        />
      )}

      {/* Defer large JSON-LD parsing until after above-the-fold content */}
      {homeItemListJsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: homeItemListJsonLd }}
        />
      ) : null}
    </>
  );
}

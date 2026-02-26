import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const BRANDS = ['all', 'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'isuzu', 'ford'];

const PRICE_RANGES = [
  { value: 'all', label: 'ทุกช่วงราคา' },
  { value: '0-100000', label: 'ต่ำกว่า 1 แสน' },
  { value: '100000-200000', label: '1-2 แสน' },
  { value: '200000-300000', label: '2-3 แสน' },
  { value: '300000-400000', label: '3-4 แสน' },
  { value: '400000-500000', label: '4-5 แสน' },
  { value: '500000-600000', label: '5-6 แสน' },
  { value: '600000-700000', label: '6-7 แสน' },
  { value: '700000', label: '7 แสนขึ้นไป' },
];

const QUICK_PRICE_LINKS = [
  { href: '/all-cars?price=0-100000', label: "ต่ำกว่า 1 แสน (< 100K)", accent: false },
  { href: '/all-cars?price=100000-200000', label: '1-2 แสน (100K-200K)', accent: false },
  { href: '/all-cars?price=200000-300000', label: '2-3 แสน (200K-300K)', accent: false },
  { href: '/all-cars?price=400000-500000', label: '4-5 แสน (400K-500K)', accent: false },
  { href: '/all-cars?price=600000-700000', label: '6-7 แสน (600K-700K)', accent: false },
  { href: '/all-cars?price=700000', label: "7 แสนขึ้นไป (> 700K)", accent: true },
];

/**
 * HomeSearchSection – ค้นหารถ + quick price links.
 * Self-contained: manages its own filter state and navigates to /all-cars.
 * Extracted from pages/index.jsx to reduce initial bundle size.
 */
export default function HomeSearchSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    const term = (searchTerm || '').trim().slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);
    const qs = params.toString();
    router.push(qs ? `/all-cars?${qs}` : '/all-cars');
  }, [searchTerm, priceRange, brandFilter, router]);

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
        ค้นหารถที่คุณต้องการ
      </h2>

      <div className="max-w-6xl mx-auto font-prompt">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div>
              <label htmlFor="searchTerm" className="sr-only">
                ค้นหารถ
              </label>
              <input
                type="text"
                id="searchTerm"
                name="search"
                placeholder="ค้นหารถ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
              />
            </div>

            {/* Price Range */}
            <div>
              <label htmlFor="priceRange" className="sr-only">
                ช่วงราคา
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
              >
                {PRICE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label htmlFor="brandFilter" className="sr-only">
                ยี่ห้อรถ
              </label>
              <select
                id="brandFilter"
                name="brand"
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
              >
                <option value="all">ทุกยี่ห้อ</option>
                {BRANDS.slice(1).map(brand => (
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
                ค้นหา
              </button>
            </div>
          </div>

          {/* Quick Links - Price Ranges */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_PRICE_LINKS.map(({ href, label, accent }) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={
                  accent
                    ? 'text-center p-3 bg-white border-2 border-accent rounded-xl hover:bg-accent-800 hover:border-accent-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-accent-800 hover:text-white'
                    : 'text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white'
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export default function BlogSearch({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const searchParams = {
      q: query,
    };

    // Update URL without page reload
    const searchQuery = new URLSearchParams();
    if (query) searchQuery.set('q', query);

    const newUrl = searchQuery.toString() ? `/blog?${searchQuery.toString()}` : '/blog';

    router.push(newUrl, undefined, { shallow: true });

    if (onSearch) {
      onSearch(searchParams);
    }
  }, [query, router, onSearch]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce การค้นหา

    return () => clearTimeout(delayedSearch);
  }, [query, handleSearch]);

  const clearSearch = () => {
    setQuery('');
    router.push('/blog', undefined, { shallow: true });
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Search Input Only */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ค้นหาบทความ..."
          className="w-full px-4 py-3 pl-12 pr-12 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-prompt"
        />

        {/* Search Icon */}
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

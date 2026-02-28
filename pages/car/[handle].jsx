import Head from 'next/head';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import SimilarCars from '../../components/SimilarCars';
import { getAllCars, getCarByHandle } from '../../lib/shopify.mjs';
import { safeGet, safeFormatPrice } from '../../utils/safe';
import Link from 'next/link';
import A11yImage from '../../components/A11yImage';
import { carAlt } from '../../utils/a11y';
import { createPrettyUrl, createShareText, createShortShareUrl } from '../../utils/urlHelper';
import { optimizeShopifyImage } from '../../utils/imageOptimizer';
import { readCarStatuses } from '../../lib/carStatusStore.js';
import { isReservedCar, isSoldCar } from '../../lib/carStatusUtils.js';
import { buildCarDetailFaqs, buildFaqPageJsonLd } from '../../lib/seo/faq.js';

// Module-level cache: ป้องกัน getAllCars() ถูกเรียกซ้ำใน getStaticPaths + getStaticProps
let _allCarsCache = null;
let _allCarsCacheTime = 0;
const ALL_CARS_CACHE_TTL = 120_000; // 2 minutes
async function getAllCarsCached() {
  const now = Date.now();
  if (_allCarsCache && now - _allCarsCacheTime < ALL_CARS_CACHE_TTL) {
    return _allCarsCache;
  }
  const result = await getAllCars();
  _allCarsCache = result;
  _allCarsCacheTime = now;
  return result;
}

function CarDetailPage({ car, recommendedCars = [] }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const carImages = useMemo(() => {
    const rawImages = safeGet(car, 'images', []);
    const imagesArray = Array.isArray(rawImages) ? rawImages : [];

    const normalized = imagesArray
      .map(img => {
        const url = safeGet(img, 'url', '');
        if (!url) return null;
        return { ...img, url };
      })
      .filter(Boolean);

    if (normalized.length > 0) return normalized;
    return [{ url: '/herobanner/chiangmaiusedcar.webp', alt: safeGet(car, 'title', 'รถมือสอง') }];
  }, [car]);

  const currentImage = carImages[selectedImageIndex] || carImages[0];
  const [processedDescription, setProcessedDescription] = useState(null);
  const [mounted, setMounted] = useState(false);
  // สำหรับ back ที่ฉลาด: จำหน้าล่าสุดที่มาจากภายในเว็บ (เก็บใน sessionStorage เท่านั้น)
  // สถานะโหลดรูปหลัก (Hero)
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [showHeroLoading, setShowHeroLoading] = useState(false);
  const heroLoadingTimerRef = useRef(null);
  const heroImageRef = useRef(null); // เก็บ ref ของรูปหลักเพื่อเช็ค complete
  // สถานะโหลดรูป thumbnails (ติดตามแต่ละรูป)
  const [thumbnailLoadingState, setThumbnailLoadingState] = useState({});
  const desktopThumbStripRef = useRef(null);
  const mobileThumbStripRef = useRef(null);
  const prefetchedThumbKeysRef = useRef(new Set());
  const preloadedHeroRef = useRef(new Map());

  const thumbStateBatchRef = useRef({ rafId: null, pending: {} });
  const queueThumbState = useCallback((key, value) => {
    if (key == null) return;
    const k = String(key);
    thumbStateBatchRef.current.pending[k] = value;

    if (thumbStateBatchRef.current.rafId != null) return;
    if (typeof window === 'undefined') return;

    thumbStateBatchRef.current.rafId = window.requestAnimationFrame(() => {
      const pending = thumbStateBatchRef.current.pending;
      thumbStateBatchRef.current.pending = {};
      thumbStateBatchRef.current.rafId = null;

      setThumbnailLoadingState(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(pending).forEach(pKey => {
          if (next[pKey] !== pending[pKey]) {
            next[pKey] = pending[pKey];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    });
  }, []);

  useEffect(() => {
    const batch = thumbStateBatchRef.current;
    return () => {
      if (typeof window === 'undefined') return;
      if (batch.rafId != null) {
        try {
          window.cancelAnimationFrame(batch.rafId);
        } catch {
          // ignore
        }
        batch.rafId = null;
      }
      batch.pending = {};
    };
  }, []);

  const heroSwipeRef = useRef({
    active: false,
    canceled: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    pointerId: null,
  });

  const preloadHeroCandidate = useCallback((originalUrl, width, quality) => {
    if (typeof window === 'undefined') return;
    if (!originalUrl) return;

    const resolvedWidth = Number(width);
    if (!Number.isFinite(resolvedWidth) || resolvedWidth <= 0) return;

    const resolvedQuality =
      typeof quality === 'number' && Number.isFinite(quality)
        ? Math.max(1, Math.min(100, quality))
        : undefined;

    const optimizedUrl = optimizeShopifyImage(originalUrl, resolvedWidth, 'avif', resolvedQuality);
    if (!optimizedUrl) return;
    if (preloadedHeroRef.current.has(optimizedUrl)) return;

    const img = new window.Image();
    // Hint: keep these low-priority so they don't compete with the true LCP fetch.
    img.fetchPriority = 'low';
    img.decoding = 'async';
    img.src = optimizedUrl;

    preloadedHeroRef.current.set(optimizedUrl, img);

    // Keep cache bounded to avoid memory growth on long browsing sessions.
    const MAX = 18;
    if (preloadedHeroRef.current.size > MAX) {
      const firstKey = preloadedHeroRef.current.keys().next().value;
      if (firstKey) {
        try {
          const firstImg = preloadedHeroRef.current.get(firstKey);
          // Clearing src helps release memory on some browsers.
          if (firstImg) firstImg.src = '';
        } catch {
          // ignore
        }
        preloadedHeroRef.current.delete(firstKey);
      }
    }

    // Decode in idle time so swapping feels instant.
    const decode = () => {
      try {
        img.decode?.().catch(() => {});
      } catch {
        // ignore
      }
    };

    try {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(decode, { timeout: 1200 });
      } else {
        setTimeout(decode, 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const copyTextToClipboard = async text => {
    if (typeof window === 'undefined') return false;
    const value = String(text || '');
    if (!value) return false;

    // Preferred: Clipboard API (may be blocked by Permissions-Policy)
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // fall through to legacy copy
    }

    // Fallback: execCommand('copy') via temporary textarea
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(textarea);
      return Boolean(ok);
    } catch {
      return false;
    }
  };

  // Hydration protection
  useEffect(() => {
    setMounted(true);
  }, []);

  // คำนวณค่าผ่อน Flat Rate (memoized - ไม่คำนวณซ้ำทุก re-render)
  const installment = useMemo(() => {
    const carPrice = Number(safeGet(car, 'price.amount', 0));
    if (!carPrice) return null;

    const loanAmount = carPrice;
    const years = 6;
    const months = 72;
    const age = 35;

    const insuranceRatePerYear = age <= 40 ? 0.004 : 0.0062;
    const totalInsurance = loanAmount * insuranceRatePerYear * years;
    const monthlyInsurance = totalInsurance / months;

    // Normal rate (7.5%)
    const normalRate = 0.075;
    const normalTotalInterest = loanAmount * normalRate * years;
    const normalMonthlyPayment = (loanAmount + normalTotalInterest) / months;
    const normalVat = normalMonthlyPayment * 0.07;
    const normalTotalMonthly = normalMonthlyPayment + normalVat + monthlyInsurance;

    // Good credit rate (4.5%)
    const goodCreditRate = 0.045;
    const goodCreditTotalInterest = loanAmount * goodCreditRate * years;
    const goodCreditMonthlyPayment = (loanAmount + goodCreditTotalInterest) / months;
    const goodCreditVat = goodCreditMonthlyPayment * 0.07;
    const goodCreditTotalMonthly = goodCreditMonthlyPayment + goodCreditVat + monthlyInsurance;

    return {
      normalTotalMonthly,
      goodCreditTotalMonthly,
      savings: normalTotalMonthly - goodCreditTotalMonthly,
    };
  }, [car]);

  // ตั้งค่า initial loading state สำหรับ thumbnails
  useEffect(() => {
    if (!car) return;

    const images = safeGet(car, 'images', []);
    if (images.length === 0) return;

    // ตั้งค่าทุกรูปเป็น loading ตอนแรก
    const initialState = {};
    images.forEach((_, index) => {
      initialState[index] = true;
      initialState[`mobile-${index}`] = true;
    });
    setThumbnailLoadingState(initialState);

    // เช็ครูปที่โหลดเสร็จแล้วจาก cache หลัง render (ป้องกัน loading indicator ค้าง)
    setTimeout(() => {
      if (typeof document === 'undefined') return;

      const thumbnailImages = document.querySelectorAll('[alt*="รูปที่"]');
      thumbnailImages.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
          // หา index จาก alt text
          const altText = img.alt;
          const match = altText.match(/รูปที่ (\d+)/);
          if (match) {
            const idx = parseInt(match[1], 10) - 1;
            queueThumbState(idx, false);
            queueThumbState(`mobile-${idx}`, false);
          }
        }
      });
    }, 100);
  }, [car, queueThumbState]);

  // ตั้งสถานะโหลดรูปหลักทุกครั้งที่สลับรูป (กันกรณี cache/production ทำให้ UX เพี้ยน)
  useEffect(() => {
    if (!mounted || !car) return;

    const images = safeGet(car, 'images', []);
    if (images.length === 0) return;

    setIsHeroLoading(true);
    setShowHeroLoading(false);

    if (heroLoadingTimerRef.current) {
      clearTimeout(heroLoadingTimerRef.current);
    }

    // แสดง hint เฉพาะกรณีโหลดช้า (non-blocking)
    heroLoadingTimerRef.current = setTimeout(() => {
      setShowHeroLoading(true);
    }, 300);

    // เช็ครูปหลักที่โหลดเสร็จแล้วจาก cache (ป้องกัน loading indicator ค้าง)
    const checkImageLoaded = () => {
      const imgElement = heroImageRef.current;
      if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
        setIsHeroLoading(false);
        setShowHeroLoading(false);
        if (heroLoadingTimerRef.current) {
          clearTimeout(heroLoadingTimerRef.current);
          heroLoadingTimerRef.current = null;
        }
      }
    };

    // เช็คทันทีและหลังจาก render
    checkImageLoaded();
    setTimeout(checkImageLoaded, 50);

    return () => {
      if (heroLoadingTimerRef.current) {
        clearTimeout(heroLoadingTimerRef.current);
        heroLoadingTimerRef.current = null;
      }
    };
  }, [selectedImageIndex, car, mounted]);

  // จดจำหน้าเดิม (referrer) เพื่อให้กดย้อนกลับได้ถูกหน้า (เช่น all-cars ที่มี filter)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const ref = document.referrer;
      if (!ref) return;
      const refUrl = new URL(ref);
      const sameOrigin = refUrl.origin === window.location.origin;
      if (sameOrigin) {
        const refPath = refUrl.pathname + (refUrl.search || '') + (refUrl.hash || '');
        // เก็บไว้ใน sessionStorage เพื่อเรียกใช้กับปุ่ม "กลับ" ภายในหน้า
        sessionStorage.setItem('lastListUrl', refPath);
      }
    } catch {
      // ignore
    }
  }, []);

  const goBackSmart = () => {
    if (typeof window === 'undefined') return;
    const last = sessionStorage.getItem('lastListUrl');

    // 1) ถ้ามี lastListUrl ที่เราบันทึกไว้ ให้ลองย้อนกลับก่อน
    if (last) {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = last;
      return;
    }

    // 2) ไม่มี lastListUrl: ใช้ document.referrer ถ้ามาจากโดเมนเดียวกัน
    try {
      const ref = document.referrer;
      if (ref) {
        const refUrl = new URL(ref);
        if (refUrl.origin === window.location.origin) {
          if (window.history.length > 1) {
            window.history.back();
            return;
          }
          const refPath = refUrl.pathname + (refUrl.search || '') + (refUrl.hash || '');
          window.location.href = refPath || '/all-cars';
          return;
        }
      }
    } catch {
      // ignore
    }

    // 3) สำรองสุดท้าย: กลับหน้ารวมรถ
    window.location.href = '/all-cars';
  };

  // Clean URL - ลบ query parameters ที่ไม่จำเป็น (เช่น ?handle=...)
  useEffect(() => {
    if (!mounted || !router.isReady) return;

    // ถ้ามี query parameters ใดๆ ให้ลบออก (เพราะ car detail ไม่ต้องการ query params)
    if (
      Object.keys(router?.query || {}).length > 1 ||
      ((router?.query || {}).handle && (router?.asPath || '').includes('?'))
    ) {
      const cleanPath = `/car/${(router?.query || {}).handle}`;
      // ใช้ replace แทน push เพื่อไม่ให้เพิ่มใน history
      router?.replace(cleanPath, undefined, { shallow: true });
    }
  }, [router, mounted]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (!mounted || !car) return;
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;

    const handleKeyDown = e => {
      // ถ้ากำลังพิมพ์ใน input/textarea ให้ข้าม
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, car, mounted]);

  // Preload next/prev images for instant switching with optimization
  useEffect(() => {
    if (!mounted || !car) return;
    // อย่าให้ preload รูปถัดไป/ก่อนหน้าแย่ง bandwidth ตอน hero กำลังโหลดอยู่
    if (isHeroLoading) return;
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;
    if (typeof window === 'undefined') return;

    // Respect data saver / very slow networks.
    const saveData = Boolean(navigator?.connection?.saveData);
    const effectiveType = String(navigator?.connection?.effectiveType || '');
    const verySlow = /2g/i.test(effectiveType);

    // ⭐ Preload เฉพาะใกล้ๆ (ถัดไป/ก่อนหน้า) แต่ให้ตรงกับ hero srcset candidates
    const preloadIndexes = [];
    if (selectedImageIndex < images.length - 1) preloadIndexes.push(selectedImageIndex + 1);
    if (selectedImageIndex + 2 < images.length) preloadIndexes.push(selectedImageIndex + 2);
    if (selectedImageIndex > 0) preloadIndexes.push(selectedImageIndex - 1);

    // Gallery uses srcset [400, 800, 1200]
    // Calculate expected exact match for srcset to ensure cache hit.
    const viewportW = Number(window.innerWidth) || 0;
    const dpr = Number(window.devicePixelRatio) || 1;
    // For sizes="(max-width: 640px) 100vw, 100vw", rendered width is approx viewportW
    const requiredPixels = viewportW * dpr;

    let targetWidth = 1200;
    if (requiredPixels <= 400) targetWidth = 400;
    else if (requiredPixels <= 800) targetWidth = 800;

    const widths = saveData || verySlow ? [Math.min(targetWidth, 400)] : [targetWidth];

    preloadIndexes.forEach(idx => {
      const originalUrl = safeGet(images[idx], 'url', '');
      widths.forEach(w => preloadHeroCandidate(originalUrl, w, 80));
    });
  }, [selectedImageIndex, car, mounted, isHeroLoading, preloadHeroCandidate]);

  // Prefetch thumbnails เมื่อใกล้เข้ามาใน viewport (ช่วยตอนเลื่อนเร็ว ๆ แล้วรูปขึ้นทัน)
  useEffect(() => {
    if (!mounted || !car) return;
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;
    if (typeof window === 'undefined') return;

    const setupObserver = container => {
      if (!container) return null;
      if (typeof window.IntersectionObserver !== 'function') return null;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const key = el?.getAttribute?.('data-thumb-key');
            if (!key) return;
            if (prefetchedThumbKeysRef.current.has(key)) return;
            prefetchedThumbKeysRef.current.add(key);

            const idxStr = String(key).split('-')[1];
            const idx = Number(idxStr);
            if (!Number.isFinite(idx) || idx < 0 || idx >= images.length) return;

            const originalUrl = safeGet(images[idx], 'url', '');
            if (!originalUrl) return;

            const thumbUrl = optimizeShopifyImage(originalUrl, 240, 'avif');
            const img = new window.Image();
            img.src = thumbUrl;
            img.fetchPriority = 'low';
          });
        },
        {
          root: container,
          // Prefetch ก่อนเข้าจอเล็กน้อย เพื่อให้เลื่อนเร็วแล้วยังทัน
          rootMargin: '160px',
          threshold: 0.01,
        }
      );

      const targets = container.querySelectorAll('[data-thumb-key]');
      targets.forEach(t => observer.observe(t));
      return observer;
    };

    const desktopObserver = setupObserver(desktopThumbStripRef.current);
    const mobileObserver = setupObserver(mobileThumbStripRef.current);

    return () => {
      try {
        desktopObserver?.disconnect?.();
      } catch {
        // ignore
      }
      try {
        mobileObserver?.disconnect?.();
      } catch {
        // ignore
      }
    };
  }, [mounted, car]);

  // Keep selected thumbnail visible without forcing page scroll
  useEffect(() => {
    if (!mounted || !car) return;
    if (typeof window === 'undefined') return;

    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;

    const isDesktop =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(min-width: 640px)').matches
        : false;

    const container = isDesktop ? desktopThumbStripRef.current : mobileThumbStripRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerVisibleVertically =
      containerRect.bottom > 0 && containerRect.top < window.innerHeight;
    if (!containerVisibleVertically) return;

    const key = `${isDesktop ? 'd' : 'm'}-${selectedImageIndex}`;
    const el = container.querySelector(`[data-thumb-key="${key}"]`);
    if (!el) return;

    // Only scroll the strip if the selected thumb is outside the strip viewport.
    const elRect = el.getBoundingClientRect();
    const inView = elRect.left >= containerRect.left && elRect.right <= containerRect.right;
    if (inView) return;

    const reduceMotion =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    try {
      el.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    } catch {
      // ignore
    }
  }, [mounted, car, selectedImageIndex]);

  // Process and clean the car description into readable paragraphs and hashtags
  useEffect(() => {
    const processText = (input = '') => {
      const text = String(input || '')
        // Convert HTML line breaks to new lines
        .replace(/<br\s*\/?>/gi, '\n')
        // Remove any remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Normalize CRLF to LF
        .replace(/\r\n|\r/g, '\n')
        // Add line breaks before certain Thai keywords for readability
        .replace(/(ราคา)/gi, '\n$1')
        // Handle price ranges like "1,000 - " into a readable price line
        .replace(/(\d{1,3}(?:,\d{3})*)\s*-\s*/g, '\n\nราคา $1 บาท\n')
        .replace(/(ออกรถ\s*\d+\s*บาท)/gi, '\n$1')
        // Group common spec lines onto their own lines
        .replace(/(เครื่องยนต์[^\n#]*)/gi, '\n$1')
        .replace(/(รถบ้าน[^\n#]*)/gi, '\n$1')
        .replace(/(Option\s*เต็ม[^\n#]*)/gi, '\n$1')
        .trim();

      return text;
    };

    const processed = processText(car?.description || '');
    const hashtagMatches = processed.match(/#[\w\u0E00-\u0E7F]+/g) || [];
    const textWithoutHashtags = processed.replace(/#[\w\u0E00-\u0E7F]+/g, '').trim();
    const paragraphs = textWithoutHashtags
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    setProcessedDescription({
      paragraphs,
      hashtags: hashtagMatches,
    });
  }, [car?.description]);

  // ป้องกัน hydration error
  // ป้องกัน hydration error: เดิมใช้ return ตัดหน้าออก ทำให้บอทไม่ได้รับ OG meta
  // เปลี่ยนเป็นให้ UI แสดง loading ในส่วนคอนเทนต์ แต่คงส่วน <Head> ไว้ใน SSR เสมอ

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">ไม่พบข้อมูลรถคันนี้</h1>
          <p className="text-gray-500 font-prompt mb-6">
            รถคันนี้อาจถูกขายไปแล้ว หรือลิงก์อาจไม่ถูกต้อง
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/all-cars"
              className="inline-flex items-center bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
            >
              <span>← ดูรถทั้งหมด</span>
            </Link>
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
            >
              <span>สอบถามรถอื่น</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced SEO data for better link sharing - optimized for social media
  const _vendor = safeGet(car, 'vendor') || safeGet(car, 'brand');
  const _model = safeGet(car, 'model');
  // Shopify product title without year suffix — used as model fallback
  const _titleNoYear = safeGet(car, 'title', '')
    .replace(/\s*(ปี|year)\s*\d+.*/i, '')
    .trim();
  let brandModel;
  if (_vendor && _model) {
    brandModel = `${_vendor} ${_model}`;
  } else if (_model) {
    brandModel = _model;
  } else {
    // spec.model metafield is empty — fall back to product title with year part stripped
    brandModel = _titleNoYear || _vendor || safeGet(car, 'title', '');
  }

  const yearPrice = [
    safeGet(car, 'year') ? `ปี ${safeGet(car, 'year')}` : '',
    `${safeFormatPrice(safeGet(car, 'price.amount')).display}฿`,
  ]
    .filter(Boolean)
    .join(' ');

  // Social media optimized title (max 60 chars for Facebook)
  const enhancedTitle = `${brandModel} ${yearPrice} | ครูหนึ่งรถสวย`.substring(0, 58);

  // Social media optimized description (max 155 chars for Facebook)
  const enhancedDescription = [
    `${brandModel} ${yearPrice}`,
    safeGet(car, 'mileage')
      ? `วิ่ง ${Number(safeGet(car, 'mileage', 0)).toLocaleString()} กม.`
      : '',
    'รถบ้านแท้ รับประกัน เชียงใหม่',
  ]
    .filter(Boolean)
    .join(' • ')
    .substring(0, 150);

  const toAbsoluteUrl = input => {
    let u = String(input || '');
    if (!u) return '';
    if (u.startsWith('/')) return `https://www.chiangmaiusedcar.com${u}`;
    if (!u.startsWith('http')) return `https://www.chiangmaiusedcar.com/${u}`;
    // Ensure absolute URL with www for better compatibility
    return u.replace('https://chiangmaiusedcar.com', 'https://www.chiangmaiusedcar.com');
  };

  const withShopifySocialParams = (input, { width = 1200, height = 630 } = {}) => {
    const u = String(input || '');
    if (!u || !u.includes('cdn.shopify.com')) return u;
    try {
      const parsed = new URL(u);
      if (width) parsed.searchParams.set('width', String(width));
      if (height) {
        parsed.searchParams.set('height', String(height));
        if (!parsed.searchParams.has('crop')) parsed.searchParams.set('crop', 'center');
      }
      return parsed.toString();
    } catch {
      // Best-effort fallback if URL parsing fails.
      return u
        .replace(/([?&])width=\d+/i, `$1width=${width}`)
        .replace(/([?&])height=\d+/i, `$1height=${height}`);
    }
  };

  // Enhanced image for social sharing - ALWAYS use first image (not current selected)
  // This ensures consistent sharing preview regardless of which image user is viewing
  const firstCarImage = carImages[0] || currentImage;
  let socialImage = toAbsoluteUrl(safeGet(firstCarImage, 'url', ''));

  // Fallback to default high-quality image if no car image
  if (!socialImage || socialImage === 'https://www.chiangmaiusedcar.com' || socialImage === '') {
    socialImage = 'https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp';
  }

  // ⭐ Shopify CDN: บังคับขนาดรูปสำหรับ social preview ให้คงที่ (ไม่แก้ UI image)
  socialImage = withShopifySocialParams(socialImage, { width: 1200, height: 630 });

  // Server-rendered Open Graph essentials (SSR-safe, no client-only logic)
  // Build canonical URL and primary OG image directly from props to guarantee tags on first HTML
  const rawHandle = safeGet(car, 'handle', '');
  const prettyHandle = createPrettyUrl(rawHandle) || rawHandle;
  const canonicalUrl = `https://www.chiangmaiusedcar.com/car/${prettyHandle}`;

  // Final fallback to guaranteed local hero image
  const defaultOgImage = 'https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp';

  // ⭐ OG image for social (guaranteed 1200x630): generate server-side via /api/og
  // Clean Shopify URL params (width, height, etc.) to let /api/og handle resizing
  let ogSource = toAbsoluteUrl(safeGet(firstCarImage, 'url', '')) || defaultOgImage;
  if (ogSource && ogSource.includes('cdn.shopify.com')) {
    try {
      const cleanUrl = new URL(ogSource);
      // Remove Shopify's width/height params so /api/og can fetch original
      cleanUrl.searchParams.delete('width');
      cleanUrl.searchParams.delete('height');
      cleanUrl.searchParams.delete('crop');
      ogSource = cleanUrl.toString();
    } catch {
      // Keep original if URL parse fails
    }
  }

  let ogImage = `https://www.chiangmaiusedcar.com/api/og?src=${encodeURIComponent(ogSource)}&w=1200&h=630`;
  // Stable cache key for LINE/Facebook using car handle (not date - avoids daily cache bust)
  if (ogSource && ogSource.includes('cdn.shopify.com')) {
    const carHandle = safeGet(car, 'handle', '');
    try {
      const parsed = new URL(ogImage);
      if (!parsed.searchParams.has('v') && carHandle) {
        parsed.searchParams.set('v', carHandle);
      }
      ogImage = parsed.toString();
    } catch {
      // ignore
    }
  }
  const ogImageFinal = ogImage || socialImage || defaultOgImage;

  // High-res image URLs for JSON-LD (does not affect UI rendering)
  const seoImages = carImages
    .map(img => ({
      ...img,
      url: withShopifySocialParams(toAbsoluteUrl(safeGet(img, 'url', '')), {
        width: 1200,
        height: 630,
      }),
    }))
    .filter(img => img.url);

  const carFaqs = buildCarDetailFaqs({
    title: enhancedTitle,
    brand: safeGet(car, 'vendor') || safeGet(car, 'brand', ''),
    model: safeGet(car, 'model', ''),
  });
  const carFaqStructuredData = buildFaqPageJsonLd({ url: canonicalUrl, faqs: carFaqs });

  return (
    <>
      {/* SEO component handles all meta tags including OG tags */}
      <Head>
        <title>TEST TITLE OVERRIDE</title>
      </Head>
      <SEO
        title={enhancedTitle}
        description={enhancedDescription}
        image={ogImageFinal}
        url={canonicalUrl}
        type="product"
        pageType="car"
        structuredData={carFaqStructuredData}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถมือสองทั้งหมด', url: '/all-cars' },
          { name: brandModel || safeGet(car, 'title', 'รถมือสอง'), url: null },
        ]}
        carData={{
          ...car,
          title: enhancedTitle,
          description: enhancedDescription,
          brand: safeGet(car, 'vendor') || safeGet(car, 'brand', 'รถมือสอง'),
          model: _model || _titleNoYear || '',
          year: safeGet(car, 'year', ''),
          images: seoImages,
          // Ensure structured data has required fields for Google Rich Results
          price: {
            amount: safeGet(car, 'price.amount', 0),
            currencyCode: safeGet(car, 'price.currencyCode', 'THB'),
          },
          availableForSale:
            typeof car?.availableForSale === 'boolean' ? car.availableForSale : true,
        }}
        keywords={[
          safeGet(car, 'title'),
          safeGet(car, 'vendor') || safeGet(car, 'brand'),
          safeGet(car, 'model'),
          `${safeGet(car, 'vendor', '')} ${safeGet(car, 'model', '')}`,
          `รถมือสอง${safeGet(car, 'vendor', '')}`,
          `${safeGet(car, 'vendor', '')}มือสอง`,
          safeGet(car, 'year') ? `${safeGet(car, 'vendor', '')} ${safeGet(car, 'year')}` : '',
          'รถมือสองเชียงใหม่',
          'รถบ้านแท้',
          'ฟรีดาวน์',
          'ผ่อนถูก',
          'รับประกัน',
          'ส่งฟรีทั่วไทย',
          'ครูหนึ่งรถสวย',
        ]
          .filter(Boolean)
          .join(', ')}
      />

      {/* All JSON-LD schemas handled by SEO component */}

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
          <Breadcrumb carTitle={safeGet(car, 'title', 'รถมือสองคุณภาพดี')} />

          {/* ปุ่มย้อนกลับ */}
          <div className="mb-4">
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  router?.back();
                } else {
                  router.push('/all-cars');
                }
              }}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none group font-prompt"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5 h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              ย้อนกลับ
            </button>
          </div>

          {/* ชื่อรถ */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3 font-prompt">
              {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
            </h1>
          </div>

          {/* รูปรถ - Modern 2025 Style */}
          <div className="mb-6 sm:mb-8">
            <div
              className="relative w-full h-[220px] sm:h-[350px] md:h-[500px] lg:h-[600px] bg-white rounded-xl overflow-hidden border border-gray-200 touch-pan-y select-none"
              onPointerDown={e => {
                if (carImages.length < 2) return;
                // Left click / primary touch only
                if (typeof e.button === 'number' && e.button !== 0) return;
                // Don't treat button interactions as swipes
                if (e.target?.closest?.('button')) return;

                heroSwipeRef.current.active = true;
                heroSwipeRef.current.canceled = false;
                heroSwipeRef.current.startX = e.clientX;
                heroSwipeRef.current.startY = e.clientY;
                heroSwipeRef.current.startTime = Date.now();
                heroSwipeRef.current.pointerId = e.pointerId;

                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // ignore
                }
              }}
              onPointerMove={e => {
                const s = heroSwipeRef.current;
                if (!s.active) return;
                if (s.pointerId != null && e.pointerId !== s.pointerId) return;

                const dx = e.clientX - s.startX;
                const dy = e.clientY - s.startY;

                // If the user is mostly scrolling vertically, cancel swipe detection.
                if (!s.canceled && Math.abs(dy) > Math.max(18, Math.abs(dx))) {
                  s.canceled = true;
                }
              }}
              onPointerUp={e => {
                const s = heroSwipeRef.current;
                if (!s.active) return;
                if (s.pointerId != null && e.pointerId !== s.pointerId) return;

                s.active = false;

                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  // ignore
                }

                if (s.canceled) return;

                const dx = e.clientX - s.startX;
                const dy = e.clientY - s.startY;
                const dt = Date.now() - s.startTime;

                // Horizontal swipe: quick enough, not too vertical.
                if (Math.abs(dx) < 50) return;
                if (Math.abs(dy) > 80) return;
                if (dt > 900) return;

                if (dx < 0) {
                  setSelectedImageIndex(prev => (prev === carImages.length - 1 ? 0 : prev + 1));
                } else {
                  setSelectedImageIndex(prev => (prev === 0 ? carImages.length - 1 : prev - 1));
                }
              }}
              onPointerCancel={() => {
                heroSwipeRef.current.active = false;
                heroSwipeRef.current.canceled = true;
              }}
            >
              <A11yImage
                ref={heroImageRef}
                src={safeGet(currentImage, 'url', '/herobanner/chiangmaiusedcar.webp')}
                alt={carAlt(car)}
                fallbackAlt={safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                fill
                className="object-cover"
                priority={selectedImageIndex === 0} // ⭐ LCP มีแค่รูปแรกที่ render
                imageType="gallery" // ⭐ ระบุเป็นรูปหลัก (1920px)
                sizes="(max-width: 640px) 100vw, 100vw"
                quality={80}
                loading="eager" // ⭐ รูปใหญ่ใน viewport: eager เพื่อให้ตอบสนองตอนสลับรูป
                fetchpriority="high"
                decoding="async" // ⭐ Decode แบบ async ไม่บล็อก main thread
                onLoad={() => {
                  setIsHeroLoading(false);
                  setShowHeroLoading(false);
                  if (heroLoadingTimerRef.current) {
                    clearTimeout(heroLoadingTimerRef.current);
                    heroLoadingTimerRef.current = null;
                  }
                }}
                onError={() => {
                  // ถ้าโหลดผิดพลาด ให้ปิดสถานะโหลด เพื่อไม่ให้ผู้ใช้สับสน
                  setIsHeroLoading(false);
                  setShowHeroLoading(false);
                  if (heroLoadingTimerRef.current) {
                    clearTimeout(heroLoadingTimerRef.current);
                    heroLoadingTimerRef.current = null;
                  }
                }}
              />

              {/* Reserved Badge */}
              {(() => {
                const viewCar = {
                  status: safeGet(car, 'status'),
                  tags: safeGet(car, 'tags', []),
                };
                const reserved = isReservedCar(viewCar);
                const sold = isSoldCar(viewCar);
                if (!reserved && !sold) return null;

                return (
                  <div
                    className={
                      sold
                        ? 'absolute top-4 left-4 bg-gray-900/90 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-bold shadow-2xl font-prompt z-10 flex items-center gap-2'
                        : 'absolute top-4 left-4 bg-red-600 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-bold shadow-2xl animate-pulse font-prompt z-10 flex items-center gap-2'
                    }
                  >
                    {/* White ban icon for high contrast */}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <line x1="5" y1="19" x2="19" y2="5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>{sold ? 'ขายแล้ว' : 'จองแล้ว'}</span>
                  </div>
                );
              })()}

              {/* Loading hint for slow images (non-blocking) */}
              {isHeroLoading && showHeroLoading && (
                <div
                  className="absolute inset-x-0 bottom-2 sm:bottom-4 mx-auto w-fit flex items-center gap-2 bg-black/60 text-white px-3 py-2 rounded-md text-xs sm:text-sm font-prompt pointer-events-none"
                  aria-live="polite"
                >
                  <svg
                    className="w-4 h-4 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>กำลังโหลดรูป…</span>
                </div>
              )}

              {/* Navigation buttons */}
              {carImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === 0 ? carImages.length - 1 : prev - 1))
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white hover:bg-opacity-10 text-white p-3 rounded-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปก่อนหน้า"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === carImages.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white hover:bg-opacity-10 text-white p-3 rounded-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปถัดไป"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter Modern 2025 */}
              <div
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-prompt"
                role="status"
                aria-live="polite"
                aria-label={`กำลังดูรูปที่ ${selectedImageIndex + 1} จาก ${carImages.length} รูป`}
              >
                <span className="text-white">{selectedImageIndex + 1}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-300">{carImages.length}</span>
                <span className="text-gray-300 ml-2">ภาพรถจริง</span>
              </div>

              {/* Keyboard hint */}
              <div
                className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-prompt hidden sm:block"
                aria-hidden="true"
              >
                <span className="flex items-center gap-1.5">
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">←</kbd>
                  <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">→</kbd>
                  <span className="ml-1">เลื่อนรูป</span>
                </span>
              </div>
            </div>

            {/* Thumbnails - Modern 2025 Style with Lazy Loading */}
            {carImages.length > 1 && (
              <div
                ref={desktopThumbStripRef}
                className="hidden sm:flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-proximity overscroll-x-contain"
              >
                {carImages.map((img, index) => {
                  // ⭐ โหลด thumbnail ทั้งหมดแบบ lazy เพื่อลดการแย่ง bandwidth กับ hero
                  return (
                    <button
                      key={`${safeGet(img, 'url', 'thumb')}-${index}`}
                      data-thumb-key={`d-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedImageIndex(index);
                        }
                      }}
                      tabIndex={0}
                      className={`relative flex-shrink-0 w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 snap-start ${
                        selectedImageIndex === index
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      type="button"
                      aria-label={`ดูรูปที่ ${index + 1}`}
                    >
                      <A11yImage
                        src={safeGet(img, 'url', '/herobanner/chiangmaiusedcar.webp')}
                        alt={`${carAlt(car)} รูปที่ ${index + 1}`}
                        fallbackAlt={`รูปที่ ${index + 1}`}
                        fill
                        className="object-cover"
                        imageType="thumbnail" // ⭐ ระบุเป็น thumbnail (400px)
                        fetchpriority="low"
                        loading="lazy"
                        onLoad={e => {
                          queueThumbState(index, false);
                          // ถ้ารูปโหลดจาก cache (complete = true ทันที) ให้ซ่อน loading
                          if (e?.target?.complete) {
                            queueThumbState(index, false);
                          }
                        }}
                        onError={() => {
                          // ถ้าโหลดผิดพลาด ให้ซ่อน loading indicator
                          queueThumbState(index, false);
                        }}
                      />
                      {/* Loading indicator for thumbnail */}
                      {thumbnailLoadingState[index] && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 animate-spin text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        </div>
                      )}
                      {/* Selected indicator */}
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mobile Thumbnails */}
            {carImages.length > 1 && (
              <div className="sm:hidden">
                <div
                  ref={mobileThumbStripRef}
                  className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide px-1 snap-x snap-proximity overscroll-x-contain"
                >
                  {carImages.map((img, index) => (
                    <button
                      key={`mobile-${safeGet(img, 'url', 'thumb')}-${index}`}
                      data-thumb-key={`m-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border transition-all duration-200 snap-start ${
                        selectedImageIndex === index
                          ? 'border-primary ring-1 ring-primary/20'
                          : 'border-gray-200'
                      }`}
                      type="button"
                      aria-label={`ดูรูปที่ ${index + 1}`}
                    >
                      <A11yImage
                        src={safeGet(img, 'url', '/herobanner/chiangmaiusedcar.webp')}
                        alt={`${carAlt(car)} รูปที่ ${index + 1}`}
                        fallbackAlt={`รูปที่ ${index + 1}`}
                        fill
                        className="object-cover"
                        imageType="thumbnail"
                        fetchpriority="low"
                        sizes="64px"
                        loading="lazy"
                        onLoad={e => {
                          queueThumbState(`mobile-${index}`, false);
                          // ถ้ารูปโหลดจาก cache (complete = true ทันที) ให้ซ่อน loading
                          if (e?.target?.complete) {
                            queueThumbState(`mobile-${index}`, false);
                          }
                        }}
                        onError={() => {
                          // ถ้าโหลดผิดพลาด ให้ซ่อน loading indicator
                          queueThumbState(`mobile-${index}`, false);
                        }}
                      />
                      {/* Loading indicator for mobile thumbnail */}
                      {thumbnailLoadingState[`mobile-${index}`] && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 animate-spin text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ข้อมูลหลักรถ - Modern 2025 Style */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            {/* Social Sharing */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <p className="text-lg font-bold text-black mb-4 font-prompt">แชร์รถคันนี้</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={async () => {
                    // ใช้ URL จริงของ Shopify (ไม่แก้ไข) เพื่อป้องกัน 404
                    const shareUrl =
                      createShortShareUrl(safeGet(car, 'handle', '')) || canonicalUrl;
                    const shareText = createShareText(car);
                    const copyText = `${shareText}\n${shareUrl}`;

                    if (navigator.share) {
                      try {
                        await navigator.share({ title: shareText, url: shareUrl });
                      } catch {
                        // user cancelled / unsupported
                      }
                    } else {
                      const ok = await copyTextToClipboard(copyText);
                      if (ok) {
                        alert('✅ คัดลอกลิ้งค์แล้ว!');
                      } else {
                        // Last resort: allow manual copy without crashing
                        window.prompt('คัดลอกลิ้งค์นี้ได้เลย:', copyText);
                      }
                    }
                  }}
                  className="bg-white hover:bg-gray-50 text-black border border-gray-200 flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
                  aria-label="แชร์ข้อมูลรถคันนี้"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  แชร์รถคันนี้
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
                  aria-label="แชร์รถคันนี้บน Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  แชร์ Facebook
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent hover:bg-accent-700 text-white flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
                  aria-label="แชร์รถคันนี้ทาง LINE"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                  </svg>
                  แชร์ LINE
                </a>
              </div>
            </div>
            {/* สเปคหลัก - Modern 2025 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-black mb-6 font-prompt">
              {safeGet(car, 'mileage') && (
                <>
                  <span className="font-semibold">
                    {Number(safeGet(car, 'mileage', 0)).toLocaleString()} กม.
                  </span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'transmission') && (
                <>
                  <span className="font-semibold">{safeGet(car, 'transmission')}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'year') && (
                <>
                  <span className="font-semibold">{safeGet(car, 'year')}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'engine') && (
                <span className="font-semibold">{safeGet(car, 'engine')}</span>
              )}
            </div>
            {/* ราคาโดดเด่น Modern 2025 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* ราคาหลัก */}
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-prompt">
                  {safeFormatPrice(safeGet(car, 'price.amount')).display} บาท
                </div>
                {/* ค่าผ่อนประมาณ - สูตร Flat Rate */}
                <div className="space-y-3">
                  {installment && (
                    <>
                      {/* Normal rate */}
                      <div>
                        <div className="text-lg text-primary font-prompt">
                          {Math.round(installment.normalTotalMonthly).toLocaleString()} บาท /เดือน*
                        </div>
                        <div className="text-xs text-gray-500 font-prompt">
                          *อัตราปกติ 7.5% สำหรับ 72 งวด + VAT + ประกัน
                        </div>
                      </div>

                      {/* Good credit rate */}
                      <div className="bg-white border border-accent rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <svg
                            className="w-4 h-4 text-accent-800"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-semibold text-accent-800 font-prompt">
                            สำหรับลูกค้าเครดิตดี
                          </span>
                        </div>
                        <div className="text-lg font-bold text-primary font-prompt">
                          {Math.round(installment.goodCreditTotalMonthly).toLocaleString()} บาท
                          /เดือน*
                        </div>
                        <div className="text-xs text-gray-600 font-prompt mb-1">
                          *อัตราพิเศษ 4.5% สำหรับ 72 งวด + VAT + ประกัน
                        </div>
                        <div className="text-sm font-semibold text-accent-800 font-prompt">
                          ประหยัดได้ {Math.round(installment.savings).toLocaleString()} บาท/เดือน
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ปุ่มหลัก Modern 2025 */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/payment-calculator?price=${safeGet(car, 'price.amount', 0)}&from=car&carTitle=${encodeURIComponent(safeGet(car, 'title', 'รถมือสองคุณภาพดี'))}`}
                  className="bg-primary hover:bg-blue-700 text-white text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                >
                  คำนวณสินเชื่อแบบเปรียบเทียบ
                </Link>
                <div className="text-xs text-center text-gray-500 font-prompt mb-2">
                  ดูเปรียบเทียบอัตราปกติ vs เครดิตดี พร้อมรายละเอียดครบถ้วน
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0940649018"
                    className="bg-white hover:bg-gray-50 text-black border border-gray-200 text-center py-3 px-4 rounded-lg font-bold transition-colors font-prompt w-full"
                    aria-label="โทร 094-064-9018"
                  >
                    โทรหาฉัน
                  </a>
                  <a
                    href="https://lin.ee/8ugfzstD"
                    className="bg-accent hover:bg-accent-700 text-white text-center py-3 px-4 rounded-lg font-bold transition-colors font-prompt w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="แชท LINE ครูหนึ่งรถสวย"
                  >
                    ทดลองขับฟรี
                  </a>
                </div>
              </div>
            </div>
            {/* Badge ความน่าเชื่อถือ Modern 2025 */}
            <div className="bg-white border border-primary rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-black font-prompt">
                    ครูหนึ่งรถสวย การันตีคุณภาพ
                  </span>
                </div>
              </div>
              <div className="text-black text-sm font-prompt font-medium">
                ✓ ไม่มีข้อบกพร่อง ✓ ไม่ชนหนัก ✓ ไม่เคยผ่านน้ำท่วม ✓ ไม่มีความเสียหายจากไฟไหม้
              </div>
            </div>
            {/* ข้อมูลรายละเอียดรถ */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4 font-prompt">รายละเอียดรถยนต์</h2>

              {/* ข้อมูลพื้นฐาน */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {car.vendor && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ยี่ห้อ</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.vendor}</div>
                  </div>
                )}
                {car.model && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">รุ่น</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.model}</div>
                  </div>
                )}
                {car.year && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ปี</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.year}</div>
                  </div>
                )}
                {car.color && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">สี</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.color}</div>
                  </div>
                )}
                {car.mileage && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เลขไมล์</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {Number(car.mileage).toLocaleString()} กม.
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เกียร์</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {car.transmission}
                    </div>
                  </div>
                )}
                {(car.fuel_type || car.fuelType) && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เชื้อเพลิง</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {car.fuel_type || car.fuelType}
                    </div>
                  </div>
                )}
                {car.engine && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เครื่องยนต์</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.engine}</div>
                  </div>
                )}
                {(car.drivetrain || car.drive_type) && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ขับเคลื่อน</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {car.drivetrain || car.drive_type}
                    </div>
                  </div>
                )}
                {car.province && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">จังหวัด</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.province}</div>
                  </div>
                )}
              </div>

              {/* คำอธิบาย */}
              {car.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-black mb-3 font-prompt">คำอธิบาย</h3>
                  <div className="text-gray-700 bg-gray-50 border border-gray-200 p-4 rounded-lg font-prompt leading-relaxed">
                    {/* แสดงผลแบบรองรับการแบ่งบรรทัดและจัดรูปแบบข้อความจาก Shopify */}
                    <div className="space-y-3">
                      {processedDescription ? (
                        <>
                          {/* แสดงข้อความหลัก */}
                          {processedDescription.paragraphs.map((paragraph, index) => (
                            <div
                              key={`p-${index}-${paragraph.slice(0, 20)}`}
                              className="whitespace-pre-line break-words leading-relaxed"
                            >
                              {paragraph}
                            </div>
                          ))}

                          {/* แสดง hashtags ในบรรทัดเดียว */}
                          {processedDescription.hashtags.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-300">
                              <div className="flex flex-wrap gap-2">
                                {processedDescription.hashtags.map((hashtag, index) => (
                                  <a
                                    key={`tag-${hashtag}-${index}`}
                                    href={`/all-cars?search=${encodeURIComponent(hashtag.substring(1))}`}
                                    className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer font-prompt"
                                    onClick={e => {
                                      e.preventDefault();
                                      window.location.href = `/all-cars?search=${encodeURIComponent(hashtag.substring(1))}`;
                                    }}
                                  >
                                    {hashtag}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลการติดต่อและสถานที่ Modern 2025 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-black mb-4 font-prompt">ที่ตั้งรถและการติดต่อ</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* ข้อมูลสถานที่ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-black font-prompt">ครูหนึ่งรถสวย เชียงใหม่</span>
                </div>
                <div className="text-gray-600 font-prompt mb-4">
                  ร้านรถมือสองมาตรฐาน ตรวจสภาพละเอียด รับประกันคุณภาพ
                </div>
                <div className="text-sm text-gray-500 font-prompt">เปิดทุกวัน 09:00 - 20:00</div>
              </div>

              {/* ปุ่มติดต่อ Modern 2025 */}
              <div className="space-y-3">
                <a
                  href="tel:0940649018"
                  className="bg-primary hover:bg-blue-700 text-white block text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                  aria-label="โทร 094-064-9018"
                >
                  โทร 094-064-9018
                </a>
                <a
                  href="https://lin.ee/8ugfzstD"
                  className="bg-white hover:bg-gray-50 text-black border border-gray-200 block text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="แชท LINE ครูหนึ่งรถสวย"
                >
                  Line: @krunuengusedcar
                </a>
              </div>
            </div>
          </div>

          {/* Similar Cars Section */}
          <SimilarCars currentCar={car} recommendations={recommendedCars} />

          {/* FAQ (AEO) - visible content to match FAQPage schema */}
          {carFaqs?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-black mb-4 font-prompt">
                คำถามที่พบบ่อย (FAQ)
              </h2>
              <div className="space-y-3">
                {carFaqs.map(item => (
                  <details
                    key={item.q}
                    className="group rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-gray-900 font-prompt flex items-start justify-between gap-3">
                      <span>{item.q}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <div className="mt-2 text-sm text-gray-700 font-prompt leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* ขั้นตอนการซื้อรถ Modern 2025 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-black mb-6 font-prompt">ขั้นตอนการซื้อรถ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">ติดต่อสอบถาม</h3>
                <p className="text-gray-600 text-sm font-prompt">โทรหรือ Line สอบถามรายละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">นัดดูรถ</h3>
                <p className="text-gray-600 text-sm font-prompt">นัดหมายเวลาดูรถและทดลองขับ</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">ตรวจสภาพ</h3>
                <p className="text-gray-600 text-sm font-prompt">ตรวจสอบสภาพรถอย่างละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">จัดการเอกสาร</h3>
                <p className="text-gray-600 text-sm font-prompt">ดำเนินการโอนและจัดไฟแนนซ์</p>
              </div>
            </div>
          </div>

          {/* ปุ่มกลับ Modern 2025 */}
          <div className="text-center pb-8">
            <button
              onClick={goBackSmart}
              type="button"
              className="bg-primary hover:bg-blue-700 text-white inline-block px-6 py-3 rounded-lg font-semibold transition-colors text-lg font-prompt"
              aria-label="กลับไปหน้าก่อนหน้า"
            >
              กลับหน้าก่อนหน้า
            </button>
            <div className="mt-2">
              <Link href="/all-cars" className="text-sm text-gray-500 underline font-prompt">
                หรือกลับหน้ารวมรถ
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* All structured data handled by SEO component */}
    </>
  );
}

// Convert to SSR temporarily to debug
// ISR - Individual car pages - revalidate every 10 minutes
export async function getStaticPaths() {
  try {
    const cars = await getAllCarsCached();
    const safeCars = Array.isArray(cars) ? cars : [];

    const paths = safeCars
      .filter(car => car?.handle)
      .map(car => ({
        params: { handle: car.handle },
      }));

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new cars
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getStaticPaths error:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const cars = await getAllCarsCached();

    // ป้องกันกรณีที่ cars เป็น null หรือ undefined
    const safeCars = Array.isArray(cars) ? cars : [];

    // Load car statuses from file storage
    const carStatuses = await readCarStatuses();

    const requestedRaw = params?.handle || '';
    const requested = decodeURIComponent(requestedRaw);
    const requestedPrettyRaw = createPrettyUrl(requestedRaw);
    const requestedPretty = createPrettyUrl(requested);

    // 1) ตรงตัว
    let carMeta = safeCars.find(c => c?.handle === requestedRaw) || null;

    // 2) เทียบกับ decoded
    if (!carMeta) {
      carMeta = safeCars.find(c => c?.handle === requested) || null;
    }

    // 2.5) เทียบกับ pretty handle (ตัดคำไทยเช่น "ปี" ออกจาก slug)
    if (!carMeta) {
      const target = requestedPrettyRaw || requestedPretty;
      if (target) {
        carMeta = safeCars.find(c => c?.handle && createPrettyUrl(c.handle) === target) || null;
      }
    }

    // 3) เผื่อมีคำต่อท้าย เช่น -รุ่นท็อป ให้แมทช์แบบ prefix ที่ยาวสุด
    if (!carMeta) {
      const candidates = safeCars
        .filter(c => typeof c?.handle === 'string')
        .filter(c => requestedRaw.startsWith(c.handle) || requested.startsWith(c.handle))
        .sort((a, b) => b.handle.length - a.handle.length);
      carMeta = candidates[0] || null;
    }

    // ไม่พบจริง ๆ
    if (!carMeta) {
      return { notFound: true };
    }

    // Fetch full car detail (including full image gallery) via per-handle query.
    // getAllCars() is optimized for listings and may only include a single image.
    const car = await getCarByHandle(carMeta.handle);
    if (!car) {
      return { notFound: true };
    }

    // Add status to car object
    if (car) {
      car.status = carStatuses[car.id]?.status || 'available';
    }

    // Redirect ไป canonical URL ถ้าไม่ตรง
    const canonicalPretty = createPrettyUrl(car.handle) || car.handle;
    if ((requestedPrettyRaw || requestedPretty || requestedRaw) !== canonicalPretty) {
      return {
        redirect: {
          destination: `/car/${canonicalPretty}`,
          permanent: true,
        },
      };
    }

    // คำนวณรถที่แนะนำแบบชาญฉลาดบนฝั่งเซิร์ฟเวอร์ (Smart Recommendation)
    const currentPrice = Number(car.price?.amount) || 0;
    const currentBrand = car.vendor || car.brand || '';
    const currentYear = Number(car.year) || 0;
    const currentCategory = car.category || '';
    const currentBodyType = car.body_type || '';
    const currentModel = car.model || '';

    const recommendedCars = safeCars
      .filter(
        c =>
          c &&
          c.handle !== car.handle &&
          c.availableForSale !== false &&
          c.price?.amount &&
          Number(c.price.amount) > 0
      )
      .map(c => {
        let score = 0;
        const carPrice = Number(c.price.amount);
        const carBrand = c.vendor || c.brand || '';
        const carYear = Number(c.year) || 0;
        const carCategory = c.category || '';
        const carBodyType = c.body_type || '';
        const carModel = c.model || '';

        // 1. คะแนนตามหมวดหมู่ตัวถัง/ประเภท (สำคัญสุด กันแนะนำข้ามสายพันธุ์) (+1000)
        if (
          (currentCategory &&
            carCategory &&
            carCategory.toLowerCase() === currentCategory.toLowerCase()) ||
          (currentBodyType &&
            carBodyType &&
            carBodyType.toLowerCase() === currentBodyType.toLowerCase())
        ) {
          score += 1000;
        }

        // 2. คะแนนตามรุ่นรถ (ตรงรุ่นโชว์ก่อนเพื่อน) (+500)
        if (
          currentModel &&
          carModel &&
          carModel.toLowerCase().includes(currentModel.toLowerCase())
        ) {
          score += 500;
        }

        // 3. คะแนนตามช่วงราคา (พิกัดงบประมาณตรงกัน) (+500 สูงสุด)
        const priceDiff = Math.abs(carPrice - currentPrice);
        const priceScore =
          currentPrice > 0 ? Math.max(0, 500 - (priceDiff / currentPrice) * 500) : 0;
        score += priceScore;

        // 4. คะแนนตามยี่ห้อ (ให้อ่อนกว่าประเภทรถ เพื่อเปิดรับคู่แข่งสายเดียวกัน) (+300)
        if (carBrand && currentBrand && carBrand.toLowerCase() === currentBrand.toLowerCase()) {
          score += 300;
        }

        // 5. คะแนนตามปี (ใกล้เคียงดีกว่า) (+200)
        if (currentYear > 0 && carYear > 0) {
          const yearDiff = Math.abs(carYear - currentYear);
          const yearScore = Math.max(0, 200 - yearDiff * 30); // ห่าง 1 ปี หัก 30
          score += yearScore;
        }

        return { ...c, similarityScore: score };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 4)
      // ส่งเฉพาะฟิลด์ที่จำเป็นไปยัง client เพื่อลด payload
      .map(c => ({
        id: c.id,
        status: carStatuses?.[c.id]?.status || 'available',
        tags: Array.isArray(c.tags) ? c.tags : [],
        handle: c.handle,
        title: c.title,
        vendor: c.vendor || c.brand,
        brand: c.brand,
        year: c.year,
        mileage: c.mileage,
        transmission: c.transmission,
        installment: c.installment,
        fuelType: c.fuelType || c.fuel_type,
        fuel_type: c.fuel_type || c.fuelType,
        drivetrain: c.drivetrain || c.drive_type || c.wheel_drive,
        drive_type: c.drive_type || c.drivetrain,
        price: { amount: Number(c.price.amount) },
        images: Array.isArray(c.images) && c.images.length > 0 ? [{ url: c.images[0].url }] : [],
      }));

    return {
      props: {
        car,
        recommendedCars,
      },
      revalidate: 600, // 10 minutes
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getStaticProps error:', error);
    // Retry after 60s เพื่อป้องกัน permanent 404 กรณี Shopify API ล่มชั่วคราว
    return {
      notFound: true,
      revalidate: 60,
    };
  }
}

export default CarDetailPage;

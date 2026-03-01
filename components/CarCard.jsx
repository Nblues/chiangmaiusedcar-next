import React from 'react';
import Link from 'next/link';
import A11yImage from './A11yImage';
import { carAlt } from '../utils/a11y';
import { isReservedStatus, isSoldStatus } from '../lib/carStatusUtils';
import { safeGet } from '../utils/safe';
import { getPriceInfo } from '../lib/carPrice';

function SpecIcon({ type, className = '' }) {
  const baseClassName = `h-4 w-4 shrink-0 ${className}`;

  switch (type) {
    case 'year':
      // Calendar
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v2m8-2v2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7h16M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
          />
        </svg>
      );
    case 'mileage':
      // Speedometer
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13a8 8 0 1 0-16 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l3-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 16h11" />
        </svg>
      );
    case 'transmission':
      // Gear
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.2-2-3.5-2.3.7a8.2 8.2 0 0 0-1.7-1L13.8 5h-3.6L8.5 7.9a8.2 8.2 0 0 0-1.7 1l-2.3-.7-2 3.5 2 1.2a7.9 7.9 0 0 0 .1 2l-2 1.2 2 3.5 2.3-.7a8.2 8.2 0 0 0 1.7 1L10.2 23h3.6l1.7-2.9a8.2 8.2 0 0 0 1.7-1l2.3.7 2-3.5-2.1-1.3z"
          />
        </svg>
      );
    case 'fuelType':
      // Fuel pump
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 20V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 20h12" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 7h5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={'M18 10l2 ' + '2v6a2 2 0 0 1-2 2'}
          />
        </svg>
      );
    case 'drivetrain':
      // Drivetrain / wheels
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClassName}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 17h10M9 7v10m6-10v10" />
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="7" r="2" />
          <circle cx="6" cy="17" r="2" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    default:
      return null;
  }
}

function toPositiveNumber(value) {
  if (value == null) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  const raw = String(value);
  // Don't try to parse approximate values like "5,xxx" (would incorrectly become 5)
  if (/[xX]/.test(raw)) return null;

  const cleaned = raw.replace(/,/g, '');
  const match = cleaned.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const num = Number(match[0]);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function normalizeApproxNumber(value) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (!/[xX]/.test(raw)) return null;

  let s = raw.replace(/\s+/g, '');
  s = s.replace(/X/g, 'x');
  s = s.replace(/x{2,}/g, 'xxx');
  // Ensure common formatting: "65xxx" or "65,xxx" -> "65,xxx"
  s = s.replace(/^(\d{1,3}),?xxx$/i, '$1,xxx');
  return s;
}

function formatMaskedWithCommas(input) {
  const s = String(input || '').trim();
  if (!s) return null;
  const parts = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join(',');
}

function formatMileage(value) {
  const approx = normalizeApproxNumber(value);
  if (approx) return `${approx} กม.`;
  const num = toPositiveNumber(value);
  if (!num) return null;

  // If the mileage includes zeros, show a masked pattern like 15x,xxx (0 -> x)
  const digits = String(Math.trunc(num));
  if (digits.includes('0')) {
    const masked = digits.replace(/0/g, 'x');
    const formatted = formatMaskedWithCommas(masked);
    return `${formatted || masked} กม.`;
  }

  return `${num.toLocaleString('th-TH')} กม.`;
}

function normalizeTransmission(value) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const upper = raw.toUpperCase();
  const lower = raw.toLowerCase();

  if (
    upper.includes('A/T') ||
    upper.includes('AT') ||
    upper.includes('AUTO') ||
    lower.includes('automatic') ||
    raw.includes('ออโต้') ||
    raw.includes('อัตโนมัติ')
  ) {
    return 'ออโต้';
  }

  // Standardize CVT under automatic for consistent display
  if (upper.includes('CVT')) return 'ออโต้';

  if (
    upper.includes('M/T') ||
    upper.includes('MT') ||
    lower.includes('manual') ||
    raw.includes('เกียร์ธรรมดา')
  ) {
    return 'ธรรมดา';
  }

  return raw;
}

function CarCard({ car, liveStatus, priority = false, className = '', variant = 'default' }) {
  if (!car) return null;

  const handle = car.handle || '';
  const href = handle ? `/car/${handle}` : '/all-cars';
  const priceInfo = getPriceInfo(safeGet(car, 'price.amount'));

  // Status check - prefer liveStatus if available (prevents hydration thrashing)
  const rawStatus = typeof liveStatus !== 'undefined' ? liveStatus : car.status;
  const status = typeof rawStatus === 'string' ? rawStatus.trim() : '';

  // Check tags safely
  const tags = Array.isArray(car.tags) ? car.tags : [];

  const isReserved = isReservedStatus(status);
  const isSold = isSoldStatus(status);
  const isNew = tags.includes('ใหม่');

  // Image logic
  const image = safeGet(car, 'images.0'); // usually images[0]
  const imageUrl = image?.url || '/herobanner/cnxcar.webp';
  const imageWidth = image?.width || 800;
  const imageHeight = image?.height || 600;

  const mileage = safeGet(car, 'mileage') ?? safeGet(car, 'metafields.spec.mileage');
  const yearRaw = safeGet(car, 'year') ?? safeGet(car, 'metafields.spec.year');
  const transmissionRaw =
    safeGet(car, 'transmission') ?? safeGet(car, 'metafields.spec.transmission');
  const drivetrainRaw =
    safeGet(car, 'drivetrain') ??
    safeGet(car, 'drive') ??
    safeGet(car, 'drive_type') ??
    safeGet(car, 'wheel_drive') ??
    safeGet(car, 'metafields.spec.drivetrain') ??
    safeGet(car, 'metafields.spec.drive') ??
    safeGet(car, 'metafields.spec.drive_type') ??
    safeGet(car, 'metafields.spec.wheel_drive') ??
    safeGet(car, 'metafields.custom.drivetrain') ??
    safeGet(car, 'metafields.custom.drive') ??
    safeGet(car, 'metafields.custom.drive_type') ??
    safeGet(car, 'metafields.custom.wheel_drive');
  const fuelType =
    safeGet(car, 'fuelType') ??
    safeGet(car, 'fuel_type') ??
    car?.metafields?.custom?.fuelType ??
    car?.metafields?.custom?.fuel_type ??
    car?.metafields?.custom?.['fuel-type'] ??
    safeGet(car, 'metafields.spec.fuel_type') ??
    safeGet(car, 'metafields.spec.fuel') ??
    car?.metafields?.spec?.['fuel-type'];

  const normalizeFuel = value => {
    if (value == null) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    const lower = raw.toLowerCase();

    const hasEvToken = /\bev\b/i.test(lower) || raw.includes('อีวี');
    const hasThaiElectric =
      raw === 'ไฟฟ้า' || raw.includes('รถไฟฟ้า') || raw.includes('พลังงานไฟฟ้า');

    if (lower.includes('diesel') || raw.includes('ดีเซล')) return 'ดีเซล';
    if (lower.includes('gasoline') || lower.includes('petrol') || raw.includes('เบนซิน'))
      return 'เบนซิน';
    if (lower.includes('hybrid') || raw.includes('ไฮบริด')) return 'ไฮบริด';
    if (lower.includes('electric') || hasEvToken || hasThaiElectric) return 'ไฟฟ้า';

    return raw;
  };

  const normalizeDrivetrain = (value, fallbackText, carTags) => {
    const tags = Array.isArray(carTags) ? carTags : [];
    const raw = String(value ?? '').trim();

    const normalize = text => {
      const lower = String(text || '')
        .trim()
        .toLowerCase();
      if (!lower) return null;

      // Prefer AWD over 4WD when explicitly present (e.g. CR-V AWD)
      if (lower.includes('awd') || lower.includes('all wheel')) return 'AWD';

      // 2WD / 4x2 (keep as 2WD when axle isn't specified)
      if (
        lower.includes('2wd') ||
        lower.includes('2-wd') ||
        lower.includes('4x2') ||
        lower.includes('4×2') ||
        lower.includes('2x4') ||
        lower.includes('2×4') ||
        lower.includes('two wheel') ||
        lower.includes('ขับ2') ||
        lower.includes('ขับ 2') ||
        lower.includes('สองล้อ')
      ) {
        return '2WD';
      }

      // 4WD / 4x4
      if (
        lower.includes('4wd') ||
        lower.includes('4-wd') ||
        lower.includes('4x4') ||
        lower.includes('4×4') ||
        lower.includes('four wheel')
      ) {
        return '4WD';
      }

      if (lower.includes('fwd') || lower.includes('front wheel')) return 'FWD';
      if (lower.includes('rwd') || lower.includes('rear wheel')) return 'RWD';

      // Thai hints
      if (lower.includes('ขับ4') || lower.includes('ขับ 4') || lower.includes('ขับเคลื่อน4'))
        return '4WD';
      if (lower.includes('สี่ล้อ') || lower.includes('4 ล้อ')) return '4WD';
      if (lower.includes('ขับหน้า') || lower.includes('ล้อหน้า')) return 'FWD';
      if (lower.includes('ขับหลัง') || lower.includes('ล้อหลัง')) return 'RWD';

      return null;
    };

    // 1) Prefer explicit field value from Shopify/specs
    const fromValue = normalize(raw);
    if (fromValue) return fromValue;

    // 2) If the field is missing, infer from title/handle (more reliable than tags)
    const inferred = normalize(String(fallbackText || ''));
    if (inferred) return inferred;

    // 3) Fall back to tags only when the field is missing
    const tagText = tags
      .map(t => String(t == null ? '' : t))
      .join(' ')
      .trim();
    return normalize(tagText);
  };

  const mileageLabel = formatMileage(mileage);
  const transmission = normalizeTransmission(transmissionRaw);
  const fuelLabel = normalizeFuel(fuelType);
  const drivetrainLabel = normalizeDrivetrain(drivetrainRaw, `${car?.title || ''} ${handle}`, tags);

  const normalizeYear = value => {
    if (value == null) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    const match = raw.match(/\b(\d{4})\b/);
    if (!match) return null;
    const y = parseInt(match[1], 10);
    if (!Number.isFinite(y)) return null;
    // Convert Thai year (B.E.) to A.D.
    if (y >= 2500 && y <= 2600) return String(y - 543);
    if (y >= 1900 && y <= 2100) return String(y);
    return null;
  };

  // Strict: do not infer year from title; display only if provided by Shopify metafields.
  const year = normalizeYear(yearRaw);

  const quickSpecs = [
    {
      key: 'year',
      value: year ? String(year) : '-',
      isPlaceholder: !year,
    },
    {
      key: 'drivetrain',
      value: drivetrainLabel ? String(drivetrainLabel) : '-',
      isPlaceholder: !drivetrainLabel,
    },
    {
      key: 'transmission',
      value: transmission ? String(transmission) : '-',
      isPlaceholder: !transmission,
    },
    {
      key: 'fuelType',
      value: fuelLabel ? String(fuelLabel) : '-',
      isPlaceholder: !fuelLabel,
    },
  ];

  const isCompact = variant === 'compact';

  // Keep card layout consistent across default grids: quick specs never exceed 2 rows on mobile.
  const quickSpecsFixed = (() => {
    const items = quickSpecs.slice(0, 4);
    while (items.length < 4) items.push(null);
    return items;
  })();

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`ดูรายละเอียด ${car.title || 'รถมือสองเชียงใหม่'}`}
      className={`group block rounded-3xl border border-accent-800/60 bg-white ring-1 ring-black/5 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 motion-reduce:transition-none motion-reduce:hover:transform-none ${className}`}
      onClick={() => {
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(
              'lastListUrl',
              window.location.pathname + window.location.search + window.location.hash
            );
          }
        } catch {
          // ignore
        }
      }}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <A11yImage
          src={imageUrl}
          alt={carAlt(car)}
          width={imageWidth}
          height={imageHeight}
          priority={priority}
          fetchpriority={priority ? 'auto' : undefined}
          decoding="async"
          fill
          aspectRatio="4/3"
          imageType="card"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badges */}
        {(isReserved || isSold) && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={
                isSold
                  ? 'inline-flex items-center rounded-full bg-gray-900/90 px-3 py-1 text-xs font-bold text-white font-prompt shadow-sm'
                  : 'inline-flex items-center rounded-full bg-accent-800/95 px-3 py-1 text-xs font-bold text-white font-prompt shadow-sm'
              }
            >
              {isSold ? 'ขายแล้ว' : 'จองแล้ว'}
            </span>
          </div>
        )}

        {!isReserved && !isSold && isNew && (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center rounded-full bg-primary/95 px-3 py-1 text-xs font-bold text-white font-prompt shadow-sm">
              มาใหม่
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col">
        <div
          className="font-extrabold text-gray-900 font-prompt overflow-hidden break-words group-hover:text-primary transition-colors text-[15px] leading-[18px] h-[36px] sm:text-base sm:leading-[22px] sm:h-[44px]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {car.title || 'รถมือสองเชียงใหม่'}
        </div>

        <div className="mt-0.5 min-h-[1.25rem] text-sm font-prompt font-semibold text-gray-700">
          {mileageLabel ? (
            <>เลขไมล์ {mileageLabel}</>
          ) : (
            <span aria-hidden="true" className="invisible">
              -
            </span>
          )}
        </div>

        {/* Quick Specs (hide only in compact variant) */}
        {!isCompact && (
          <div className="mt-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-[3.25rem]">
            {quickSpecsFixed.map((spec, idx) => (
              <span
                key={spec?.key || `placeholder-${idx}`}
                aria-hidden={!spec}
                className={
                  spec
                    ? `min-w-0 flex items-center gap-1.5 px-0.5 py-0.5 text-[13px] leading-tight sm:text-sm font-semibold font-prompt ${spec.isPlaceholder ? 'text-gray-400' : 'text-gray-900'}`
                    : 'min-w-0 flex items-center gap-1.5 px-0.5 py-0.5 text-[13px] leading-tight sm:text-sm font-semibold text-gray-400 font-prompt'
                }
                title={spec && !spec.isPlaceholder ? spec.value : ''}
              >
                {spec ? (
                  <SpecIcon
                    type={spec.key}
                    className={spec.isPlaceholder ? 'text-gray-300' : 'text-primary/80'}
                  />
                ) : null}
                {spec?.isPlaceholder ? (
                  <span
                    aria-hidden="true"
                    className={`inline-block animate-pulse rounded bg-gray-200/80 ${
                      spec.key === 'year'
                        ? 'h-3 w-10 sm:h-3.5 sm:w-12'
                        : spec.key === 'drivetrain'
                          ? 'h-3 w-12 sm:h-3.5 sm:w-16'
                          : 'h-3 w-12 sm:h-3.5 sm:w-16'
                    }`}
                  />
                ) : (
                  <span className="truncate flex-1 min-w-0">{spec?.value || '-'}</span>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3.5">
          <div className="flex min-w-0 items-baseline gap-1 font-prompt font-extrabold tabular-nums">
            <span className="text-accent-800 text-sm sm:text-lg leading-none">฿</span>
            <span className="truncate tracking-tight text-accent-800 text-lg sm:text-2xl leading-none">
              {priceInfo.valid ? priceInfo.display : 'ติดต่อสอบถาม'}
            </span>
          </div>
        </div>

        <div className="mt-auto flex min-h-[44px] items-center justify-between gap-3 border-t border-accent-200/70 pt-2 transition-colors group-hover:border-accent-300/80 group-focus-visible:border-accent-300/80">
          <span className="min-w-0 text-sm text-gray-600 font-prompt font-semibold transition-colors group-hover:text-gray-800 group-focus-visible:text-gray-800">
            ดูรายละเอียด
          </span>
          <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-gray-500 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-accent group-focus-visible:bg-accent group-focus-visible:text-white group-focus-visible:border-accent group-focus-visible:ring-2 group-focus-visible:ring-accent/30">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(CarCard);

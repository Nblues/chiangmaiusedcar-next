/**
 * Shopify CDN image URL helper (suffix-based)
 *
 * Generates URLs like: image_400x.jpg?v=123
 * Optionally adds query params like `format=webp` and `quality=75`.
 *
 * Important: This file is additive. It does not modify existing optimizer utils.
 */

export function isShopifyImageUrl(url) {
  return (
    typeof url === 'string' &&
    url.length > 0 &&
    (url.includes('cdn.shopify.com') || url.includes('myshopify.com'))
  );
}

function stripTrailingShopifySizeSuffix(nameWithoutExt) {
  // Common Shopify patterns:
  // - _400x
  // - _400x400
  // - _x400
  // - _400x@2x
  // - _400x400@2x
  // Keep conservative: only strip if suffix is at end.
  return nameWithoutExt.replace(/_(?:\d+)?x(?:\d+)?(?:@2x)?$/i, '');
}

export function shopifyImageWithWidthSuffix(url, width, options = {}) {
  const { format = 'webp', quality } = options || {};

  if (!url || typeof url !== 'string') return url;
  if (!isShopifyImageUrl(url)) return url;

  const resolvedWidth = Number(width);
  if (!Number.isFinite(resolvedWidth) || resolvedWidth <= 0) return url;

  try {
    const urlObj = new URL(url);

    // Remove width param if present (suffix controls sizing).
    urlObj.searchParams.delete('width');

    // Update pathname by inserting _{width}x before extension.
    const pathname = urlObj.pathname || '';
    const lastSlash = pathname.lastIndexOf('/');
    const dir = lastSlash >= 0 ? pathname.slice(0, lastSlash + 1) : '/';
    const filename = lastSlash >= 0 ? pathname.slice(lastSlash + 1) : pathname;

    const extIndex = filename.lastIndexOf('.');
    if (extIndex <= 0 || extIndex === filename.length - 1) {
      // Unexpected format; keep URL as-is.
      return urlObj.toString();
    }

    const name = filename.slice(0, extIndex);
    const ext = filename.slice(extIndex);

    const cleanName = stripTrailingShopifySizeSuffix(name);
    const nextFilename = `${cleanName}_${resolvedWidth}x${ext}`;

    urlObj.pathname = `${dir}${nextFilename}`;

    // Allow format/quality as query params.
    if (format) {
      urlObj.searchParams.set('format', String(format));
    } else {
      urlObj.searchParams.delete('format');
    }

    if (typeof quality === 'number' && Number.isFinite(quality)) {
      urlObj.searchParams.set('quality', String(Math.max(1, Math.min(100, quality))));
    } else {
      urlObj.searchParams.delete('quality');
    }

    return urlObj.toString();
  } catch {
    // If parsing fails, return original.
    return url;
  }
}

export function generateShopifySuffixSrcSet(url, widths, options = {}) {
  if (!url || typeof url !== 'string') return '';
  if (!Array.isArray(widths) || widths.length === 0) return '';

  return widths
    .map(w => {
      const resolvedWidth = Number(w);
      if (!Number.isFinite(resolvedWidth) || resolvedWidth <= 0) return null;
      const u = shopifyImageWithWidthSuffix(url, resolvedWidth, options);
      if (!u) return null;
      return `${u} ${resolvedWidth}w`;
    })
    .filter(Boolean)
    .join(', ');
}

/**
 * Custom Image Loader for Next.js
 * Bypasses Next.js image optimization to prevent Jest worker errors
 * Returns original image URL without processing
 */

export default function imageLoader({ src }) {
  // If it's already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // For relative paths, construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chiangmaiusedcar.com';
  return `${baseUrl}${src}`;
}

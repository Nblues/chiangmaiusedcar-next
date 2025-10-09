import React from 'react';
import {
  optimizeShopifyImage,
  generateSrcSet,
  generateSizes,
  BLUR_DATA_URL,
} from '../utils/imageOptimizer';

interface A11yImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  fallbackAlt?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
  imageType?: 'hero' | 'card' | 'thumbnail' | 'gallery' | 'default';
  optimizeImage?: boolean; // ⭐ เปิด/ปิด optimization (default: true)
}

export default function A11yImage({
  fallbackAlt,
  alt,
  priority,
  // quality, // Reserved for future use
  fill,
  sizes: customSizes, // เปลี่ยนชื่อเพื่อไม่ชนกับ generated sizes
  fetchpriority,
  className,
  style,
  loading,
  imageType = 'default',
  optimizeImage = true, // ⭐ เปิด optimization ตามค่า default
  src,
  srcSet: customSrcSet, // ยอมรับ srcSet แบบกำหนดเอง
  ...props
}: A11yImageProps) {
  const finalAlt = alt && alt.trim().length > 0 ? alt : (fallbackAlt ?? 'รูปภาพประกอบ');

  // ⭐ Optimize Shopify images automatically
  let optimizedSrc = src;
  let generatedSrcSet = customSrcSet;
  let generatedSizes = customSizes;

  if (optimizeImage && src && typeof src === 'string') {
    // กำหนดขนาดตาม imageType
    const widthMap = {
      hero: 1920,
      card: 1024,
      thumbnail: 240, // ⭐ ลดจาก 400 → 240 เพื่อโหลดเร็วขึ้น (thumbnail เล็ก)
      gallery: 800,
      default: 1200,
    };
    const targetWidth = widthMap[imageType] || widthMap.default;

    // ปรับขนาดรูป
    optimizedSrc = optimizeShopifyImage(src, targetWidth, 'webp');

    // สร้าง srcSet ถ้ายังไม่มี
    if (!customSrcSet) {
      const srcSetWidths = {
        hero: [640, 1024, 1920],
        card: [320, 640, 1024],
        thumbnail: [120, 240], // ⭐ ลดขนาด srcSet สำหรับ thumbnail
        gallery: [400, 800, 1200],
        default: [640, 1024, 1920],
      };
      generatedSrcSet = generateSrcSet(src, srcSetWidths[imageType] || srcSetWidths.default);
    }

    // สร้าง sizes ถ้ายังไม่มี
    if (!customSizes) {
      generatedSizes = generateSizes(imageType);
    }
  }

  // ⭐ ตั้งค่า loading attribute อัตโนมัติ
  // - ถ้า priority=true → eager loading (โหลดทันที)
  // - ถ้าไม่ระบุ → lazy loading (โหลดเมื่อใกล้ viewport)
  const loadingAttr = priority ? 'eager' : loading || 'lazy';

  // ⭐ ตั้งค่า fetchpriority attribute
  // - รูป priority=true → fetchpriority="high" (โหลดก่อนทรัพยากรอื่น)
  const fetchPriorityAttr = priority ? 'high' : fetchpriority || 'auto';

  // ถ้าใช้ fill={true} ให้ใช้ absolute positioning
  const finalStyle = fill
    ? {
        ...style,
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
      }
    : style;

  const finalClassName = fill ? `${className || ''} absolute inset-0`.trim() : className;

  // ⭐ Build img attributes manually to use lowercase 'fetchpriority'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imgAttributes: Record<string, any> = {
    ...props,
    src: optimizedSrc,
    alt: finalAlt,
    loading: loadingAttr,
    style: finalStyle,
    className: finalClassName,
  };

  // เพิ่ม srcSet และ sizes ถ้ามี
  if (generatedSrcSet) {
    imgAttributes.srcSet = generatedSrcSet;
  }
  if (generatedSizes) {
    imgAttributes.sizes = generatedSizes;
  }

  // Add fetchpriority as lowercase attribute (HTML spec)
  if (fetchPriorityAttr !== 'auto') {
    imgAttributes['fetchpriority'] = fetchPriorityAttr;
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...imgAttributes} />;
}

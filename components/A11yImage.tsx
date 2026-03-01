/* eslint-disable @next/next/no-img-element */
import React, { forwardRef } from 'react';
import { optimizeShopifyImage, generateSrcSet, generateSizes } from '../utils/imageOptimizer';

interface A11yImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  fallbackAlt?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
  imageType?: 'hero' | 'card' | 'thumbnail' | 'gallery' | 'default';
  optimizeImage?: boolean; // ⭐ เปิด/ปิด optimization (default: true)
  aspectRatio?: string; // ⭐ ป้องกัน CLS ด้วย aspect-ratio (เช่น "16/9", "4/3")
}

const A11yImage = forwardRef<HTMLImageElement, A11yImageProps>(
  (
    {
      fallbackAlt,
      alt,
      priority,
      quality,
      fill,
      sizes: customSizes, // เปลี่ยนชื่อเพื่อไม่ชนกับ generated sizes
      fetchPriority,
      fetchpriority,
      className,
      style,
      loading,
      imageType = 'default',
      optimizeImage = true, // ⭐ เปิด optimization ตามค่า default
      aspectRatio, // ⭐ ป้องกัน CLS
      src,
      srcSet: customSrcSet, // ยอมรับ srcSet แบบกำหนดเอง
      ...props
    },
    ref
  ) => {
    const finalAlt =
      alt === '' ? '' : alt && alt.trim().length > 0 ? alt : (fallbackAlt ?? 'รูปภาพประกอบ');

    // ⭐ Optimize Shopify images automatically
    const optimizedSrc = src;
    let generatedSrcSet = customSrcSet;
    let generatedSizes = customSizes;

    if (optimizeImage && src && typeof src === 'string') {
      // กำหนดขนาดตาม imageType
      const widthMap = {
        hero: 1920,
        // การ์ดบนมือถือส่วนใหญ่แสดง ~50vw; 640px เพียงพอสำหรับ DPR 2-3 และช่วยลด bytes
        card: 576,
        thumbnail: 240, // ⭐ ลดจาก 400 → 240 เพื่อโหลดเร็วขึ้น (thumbnail เล็ก)
        gallery: 800,
        default: 1200,
      };
      const targetWidth = widthMap[imageType] || widthMap.default;

      // Shopify รองรับ quality parameter (1-100). ตั้งค่า default ให้เหมาะกับแต่ละประเภท
      // AVIF ให้คุณภาพสูงที่ quality ต่ำกว่า JPEG มาก: AVIF 50 ≈ JPEG 80 ในเชิง perceptual
      const qualityMap: Record<NonNullable<A11yImageProps['imageType']>, number> = {
        hero: 72,
        card: 50, // ลดจาก 65 → 50 (AVIF สูญเสียคุณภาพน้อยมาก, ลดขนาดไฟล์ ~25%)
        thumbnail: 50, // ลดจาก 60 → 50
        gallery: 65, // ลดจาก 70 → 65
        default: 65, // ลดจาก 70 → 65
      };
      const resolvedQuality =
        typeof quality === 'number' && Number.isFinite(quality)
          ? Math.max(1, Math.min(100, quality))
          : (qualityMap[imageType] ?? qualityMap.default);

      // ปรับขนาดรูป
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const optimizedSrc = optimizeShopifyImage(src, targetWidth, 'avif', resolvedQuality);

      // สร้าง srcSet ถ้ายังไม่มี
      if (!customSrcSet) {
        const srcSetWidths = {
          hero: [640, 1024, 1920],
          // Add 576w to better match ~2-column mobile grids at DPR 3
          // (reduces waste vs jumping straight to 640w).
          card: [240, 360, 480, 576],
          thumbnail: [120, 240], // 🔹ลดขนาด srcset สำหรับ thumbnail
          gallery: [400, 800, 1200],
          default: [640, 1024, 1920],
        };
        generatedSrcSet = generateSrcSet(
          src,
          srcSetWidths[imageType] || srcSetWidths.default,
          'avif',
          resolvedQuality
        );
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
    // - ถ้าเป็นรูปที่ไม่สำคัญ (thumbnail/gallery/card) ให้ default เป็น "low" เพื่อลดแย่งแบนด์วิดท์
    let fetchPriorityAttr: 'high' | 'low' | 'auto';
    // Allow explicit fetchpriority to override priority (useful when we want eager loading
    // but don't want to steal priority from the true LCP hero image).
    const explicitFetchPriority = fetchpriority || fetchPriority;
    if (explicitFetchPriority) {
      fetchPriorityAttr = explicitFetchPriority;
    } else if (priority) {
      fetchPriorityAttr = 'high';
    } else if (imageType === 'thumbnail' || imageType === 'gallery' || imageType === 'card') {
      fetchPriorityAttr = 'low';
    } else {
      fetchPriorityAttr = 'auto';
    }

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
      : aspectRatio
        ? {
            ...style,
            aspectRatio: aspectRatio,
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
      // ⭐ ตั้งค่า decoding ค่าเริ่มต้นเป็น 'async' สำหรับรูป non-LCP เพื่อลดบล็อกการเรนเดอร์
      decoding: props && 'decoding' in props && props.decoding ? props.decoding : 'async',
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

    // Add onLoad and onError handlers from props
    if (props.onLoad) {
      imgAttributes.onLoad = props.onLoad;
    }
    if (props.onError) {
      imgAttributes.onError = props.onError;
    }

    // eslint-disable-next-line jsx-a11y/alt-text
    return <img ref={ref} {...imgAttributes} />;
  }
);

A11yImage.displayName = 'A11yImage';

export default A11yImage;

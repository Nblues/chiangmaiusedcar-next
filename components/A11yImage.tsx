import React from 'react';

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
}

export default function A11yImage({
  fallbackAlt,
  alt,
  priority,
  // quality, // Reserved for future use
  fill,
  // sizes, // Reserved for future use
  fetchpriority,
  className,
  style,
  loading,
  ...props
}: A11yImageProps) {
  const finalAlt = alt && alt.trim().length > 0 ? alt : (fallbackAlt ?? 'รูปภาพประกอบ');

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
    alt: finalAlt,
    loading: loadingAttr,
    style: finalStyle,
    className: finalClassName,
  };

  // Add fetchpriority as lowercase attribute (HTML spec)
  if (fetchPriorityAttr !== 'auto') {
    imgAttributes['fetchpriority'] = fetchPriorityAttr;
  }

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...imgAttributes} />;
}

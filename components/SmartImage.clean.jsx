import React, { useState } from 'react';
import Image from 'next/image';

// Alt text generation function (simplified version for client-side)
function generateAltText(src, context = '', carData = null) {
  // Remove file extension and clean filename
  const fileName = src.split('/').pop() || '';
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  const cleanName = baseName.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim().toLowerCase();

  // Common car-related words mapping
  const carTerms = {
    front: 'หน้ารถ',
    back: 'ท้ายรถ',
    side: 'ด้านข้างรถ',
    interior: 'ภายในรถ',
    engine: 'เครื่องยนต์',
    wheel: 'ล้อรถ',
    seat: 'เบาะรถ',
    dashboard: 'แผงหน้ารถ',
    logo: 'โลโก้',
    badge: 'เครื่องหมาย',
  };

  let altText = cleanName;

  // Replace common terms
  Object.entries(carTerms).forEach(([eng, thai]) => {
    altText = altText.replace(new RegExp(eng, 'gi'), thai);
  });

  // Add context if provided
  if (context) {
    altText = `${context} - ${altText}`;
  }

  // Add car data if available
  if (carData && carData.title) {
    altText = `${carData.title} ${altText}`;
  }

  // Fallback
  if (!altText || altText.trim() === '') {
    altText = context || 'รูปภาพรถยนต์มือสอง';
  }

  return altText;
}

/**
 * SmartImage Component
 * Optimized image component with lazy loading and responsive design
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  context = '',
  carData = null,
  placeholderBlur = true,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate alt text if not provided
  const finalAlt = alt || generateAltText(src, context, carData);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Error fallback
  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">ไม่สามารถโหลดรูปภาพ</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={finalAlt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={placeholderBlur ? 'blur' : 'empty'}
        blurDataURL={
          placeholderBlur
            ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
            : undefined
        }
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
    </div>
  );
}

/**
 * ResponsiveCarImage Component
 * Specialized component for car images with responsive breakpoints
 */
export function ResponsiveCarImage({
  src,
  alt,
  context = 'รถยนต์มือสอง',
  carData = null,
  priority = false,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  ...props
}) {
  return (
    <div className={`relative ${aspectRatio} ${className}`}>
      <SmartImage
        src={src}
        alt={alt}
        context={context}
        carData={carData}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover hover:scale-105 transition-transform duration-300"
        {...props}
      />
    </div>
  );
}

/**
 * CarGallery Component
 * Grid layout for multiple car images
 */
export function CarGallery({ images = [], context = 'แกลเลอรี่รถยนต์', className = '', ...props }) {
  if (!images || images.length === 0) {
    return <div className="bg-gray-100 p-8 text-center text-gray-500">ไม่มีรูปภาพ</div>;
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`} {...props}>
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square">
          <SmartImage
            src={image.src || image}
            alt={image.alt}
            context={context}
            fill
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}

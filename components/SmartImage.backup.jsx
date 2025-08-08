import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

// Alt text generation function (simplified version for client-side)
function generateAltText(src, context = '', carData = null) {
  // Remove file extension and clean filename
  const fileName = src.split('/').pop() || '';
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  const cleanName = baseName.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim().toLowerCase();

  // Context-based alt text generation
  if (context === 'car' || context === 'car-thumbnail' || context === 'car-detail') {
    if (carData) {
      const brand = carData.brand || '';
      const model = carData.model || '';
      const year = carData.year || '';

      return `${brand} ${model} ${year} รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย`.trim();
    }
    return `รถมือสองคุณภาพดี - ครูหนึ่งรถสวย เชียงใหม่`;
  }

  if (context === 'hero' || context === 'banner') {
    return 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่ ฟรีดาวน์ ผ่อนถูก มีรับประกัน';
  }

  if (context === 'logo') {
    return 'โลโก้ ครูหนึ่งรถสวย - ศูนย์รวมรถมือสองเชียงใหม่';
  }

  if (context === 'review' || context === 'customer') {
    return 'รีวิวลูกค้า ครูหนึ่งรถสวย - ประสบการณ์ซื้อรถมือสองเชียงใหม่';
  }

  return (
    `${cleanName} - ครูหนึ่งรถสวย เชียงใหม่`.replace(/\s+/g, ' ').trim() ||
    'รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย'
  );
}

/**
 * SmartImage Component
 * - Automatically generates alt text based on context
 * - Handles WebP conversion and responsive sizing
 * - Provides fallback for missing images
 * - Optimized for SEO and accessibility
 */
export default function SmartImage({
  src,
  alt,
  context = '',
  carData = null,
  className = '',
  width,
  height,
  fill = false,
  priority = false,
  sizes = '100vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejVkrWA+Y8F8UYFe7qNY1jj3pxoVzRv//Z',
  fallbackSrc = '/cover.jpg',
  ...props
}) {
  // Auto-generate alt text if not provided - ensure it's never empty
  const autoAlt =
    alt || generateAltText(src, context, carData) || 'รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย';

  // Ensure alt text is never empty or undefined
  const safeAlt =
    typeof autoAlt === 'string' && autoAlt.trim()
      ? autoAlt.trim()
      : 'รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย';

  // Convert to WebP if not already
  const optimizedSrc = src?.endsWith('.webp')
    ? src
    : src?.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp') || fallbackSrc;

  // Generate responsive sizes based on context
  const getResponsiveSizes = () => {
    switch (context) {
      case 'hero':
        return '100vw';
      case 'car-thumbnail':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw';
      case 'car-detail':
        return '(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw';
      case 'logo':
        return '(max-width: 768px) 150px, 200px';
      case 'banner':
        return '100vw';
      default:
        return sizes;
    }
  };

  // Get optimized dimensions based on context
  const getOptimizedDimensions = () => {
    switch (context) {
      case 'car-thumbnail':
        return { width: 400, height: 300 };
      case 'car-detail':
        return { width: 800, height: 600 };
      case 'logo':
        return { width: 200, height: 80 };
      case 'hero':
        return { width: 1920, height: 800 };
      default:
        return { width, height };
    }
  };

  const responsiveSizes = getResponsiveSizes();
  const dimensions = getOptimizedDimensions();

  // Error handler for failed image loads
  const handleError = e => {
    console.warn(`Failed to load image: ${optimizedSrc}, falling back to ${fallbackSrc}`);
    e.target.src = fallbackSrc;
  };

  // Common image props
  const imageProps = {
    src: optimizedSrc,
    alt: safeAlt,
    className: `${className} transition-opacity duration-300`,
    priority,
    quality,
    sizes: responsiveSizes,
    placeholder,
    blurDataURL,
    onError: handleError,
    ...props,
  };

  // Handle fill images (for containers with position: relative)
  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    );
  }

  // Handle images with specific dimensions
  if (dimensions.width && dimensions.height) {
    return (
      <Image
        {...imageProps}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: dimensions.width,
        }}
      />
    );
  }

  // Fallback for other cases
  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  );
}

/**
 * ResponsiveCarImage - Specialized component for car images
 */
export function ResponsiveCarImage({
  car,
  imageIndex = 0,
  context = 'car-thumbnail',
  className = '',
  ...props
}) {
  const carImage = car?.images?.[imageIndex];
  const src = carImage?.url || '/cover.jpg';

  const carData = {
    brand: car?.vendor || '',
    model: car?.title?.split(' ')[0] || '',
    year: car?.title?.match(/\d{4}/)?.[0] || '',
  };

  return (
    <SmartImage
      src={src}
      context={context}
      carData={carData}
      alt={`${carData.brand} ${carData.model} ${carData.year} - รถมือสองเชียงใหม่`}
      className={className}
      {...props}
    />
  );
}

/**
 * LazyImage - Component with intersection observer for performance
 */
export function LazyImage({
  src,
  alt,
  context = '',
  className = '',
  rootMargin = '50px',
  ...props
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={imgRef} className={`${className} ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
      {isInView && (
        <SmartImage
          src={src}
          alt={alt}
          context={context}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * ImageGallery - Responsive image gallery with WebP support
 */
export function ImageGallery({
  images = [],
  context = 'gallery',
  className = '',
  cols = 'auto',
  gap = 4,
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid ${gridCols[cols]} ${gapClass} ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <SmartImage
            src={image.url || image.src}
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

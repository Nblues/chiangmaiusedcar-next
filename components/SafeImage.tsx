import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  quality = 80,
  priority = false,
  loading = 'lazy',
  sizes,
  placeholder = 'empty',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  fallbackSrc = '/images/placeholder-car.jpg',
}: SafeImageProps) {
  const [mounted, setMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle image error with fallback
  const handleError = () => {
    if (!hasError && fallbackSrc) {
      console.warn(`Failed to load image: ${imgSrc}, trying fallback`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Convert to WebP if supported (client-side only)
  const getOptimizedSrc = (originalSrc: string) => {
    if (!mounted || typeof window === 'undefined') return originalSrc;

    // Check if browser supports WebP
    const canvas = document.createElement('canvas');
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (
      supportsWebP &&
      originalSrc &&
      !originalSrc.includes('.webp') &&
      !originalSrc.startsWith('data:')
    ) {
      // Convert to WebP for better performance
      const url = new URL(originalSrc, window.location.origin);
      url.searchParams.set('format', 'webp');
      return url.toString();
    }

    return originalSrc;
  };

  // Show placeholder during SSR or before mounting
  if (!mounted) {
    const placeholderClasses = fill
      ? `w-full h-full min-h-[200px] bg-gray-200 animate-pulse flex items-center justify-center ${className}`
      : `bg-gray-200 animate-pulse flex items-center justify-center min-h-[200px] ${className}`;

    return (
      <div className={placeholderClasses}>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const optimizedSrc = getOptimizedSrc(imgSrc);

  // Use Next.js Image component for better performance
  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={className}
        quality={quality}
        priority={priority}
        loading={loading}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width || 500}
      height={height || 300}
      className={className}
      quality={quality}
      priority={priority}
      loading={loading}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleError}
    />
  );
}

// Basic version for simple use cases
export function SimpleSafeImage({ src, alt }: { src: string; alt: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <img src={src} alt={alt} />;
}

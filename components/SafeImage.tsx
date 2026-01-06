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

// Generate better blur placeholder
const generateBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  quality = 75, // Optimized for mobile performance
  priority = false,
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc = '/images/placeholder-car.jpg',
}: SafeImageProps) {
  const [mounted, setMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate blur placeholder if not provided
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    if (typeof window !== 'undefined') {
      return generateBlurDataURL();
    }
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  };

  // Handle image error with fallback
  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Optimized sizes for responsive images
  const getOptimizedSizes = () => {
    if (sizes) return sizes;
    if (fill) return '100vw';
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  };

  // Show loading placeholder during SSR
  if (!mounted) {
    const placeholderClasses = fill
      ? `absolute inset-0 w-full h-full bg-gray-200 animate-pulse ${className}`
      : `bg-gray-200 animate-pulse min-h-[200px] ${className}`;

    return <div className={placeholderClasses} />;
  }

  // Common Image props
  const imageProps = {
    src: imgSrc,
    alt,
    quality,
    priority,
    loading,
    sizes: getOptimizedSizes(),
    placeholder,
    blurDataURL: getBlurDataURL(),
    onError: handleError,
    onLoad: handleLoad,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
  };

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />;
  }

  return <Image {...imageProps} alt={alt} width={width || 500} height={height || 300} />;
}

// Basic version for simple use cases
export function SimpleSafeImage({
  src,
  alt,
  width = 500,
  height = 300,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Image src={src} alt={alt} width={width} height={height} />;
}

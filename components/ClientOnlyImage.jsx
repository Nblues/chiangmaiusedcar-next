import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * ClientOnlyImage - Renders images only on client side to prevent hydration mismatches
 * This component ensures server and client HTML match by not rendering the image during SSR
 */
const ClientOnlyImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  sizes,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  fallbackSrc = '/images/placeholder-car.jpg',
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Only render on client side to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show placeholder during SSR and before mounting
  if (!isMounted) {
    return (
      <div
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
        aria-label={`Loading ${alt}`}
      >
        <div className="text-gray-400 text-sm">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Handle image error by showing fallback
  const handleError = () => {
    setHasError(true);
  };

  // Show fallback image if main image failed to load
  if (hasError && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        style={fill ? { position: 'absolute', inset: 0, objectFit: 'cover' } : { width, height }}
        onError={() => setHasError(false)} // Prevent infinite error loop
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleError}
      {...props}
    />
  );
};

export default ClientOnlyImage;

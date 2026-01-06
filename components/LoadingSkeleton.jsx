import { memo } from 'react';

export const ImageGallerySkeleton = memo(function ImageGallerySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="w-full h-64 bg-gray-200 rounded-lg" />
      <div className="flex space-x-2 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />
        ))}
      </div>
    </div>
  );
});

export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
      <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
});

const loadingSkeleton = { CardSkeleton, ImageGallerySkeleton };

export default loadingSkeleton;

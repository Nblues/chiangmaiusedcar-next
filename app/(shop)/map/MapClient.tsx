// Example of optimized Client Component - keep it minimal and at leaf nodes
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for heavy components to reduce initial bundle
const MapComponent = dynamic(() => import('./MapImpl'), { 
  ssr: false, 
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    </div>
  )
});

interface MapClientProps {
  center?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; title: string }>;
  className?: string;
}

export default function MapClient({ 
  center = { lat: 18.7883, lng: 98.9853 }, // Chiang Mai coordinates
  markers = [],
  className = ''
}: MapClientProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* Only render the map when needed */}
      <MapComponent
        center={center}
        markers={markers}
        onLoad={() => setIsMapLoaded(true)}
        onMarkerClick={setSelectedMarker}
      />
      
      {/* Map controls */}
      {isMapLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
          <button 
            className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
            onClick={() => setSelectedMarker(null)}
          >
            รีเซ็ต
          </button>
        </div>
      )}
      
      {/* Selected marker info */}
      {selectedMarker !== null && markers[selectedMarker] && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4 max-w-sm">
          <h3 className="font-semibold">{markers[selectedMarker].title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            พิกัด: {markers[selectedMarker].lat.toFixed(4)}, {markers[selectedMarker].lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { MarkerPosition } from '@/types/map.type';
import { Loader2Icon } from 'lucide-react';

type Props = {
  markerPosition?: MarkerPosition;
  onMarkerPositionChange?: (position: MarkerPosition) => void;
  currentCenter: [number, number];
  setCurrentCenter: (center: [number, number]) => void;
  zoom: number;
  setCurrentZoom: (zoom: number) => void;
};

// Dynamic import with SSR disabled
const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted text-muted-foreground flex h-[500px] w-full items-center justify-center rounded-xl">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
});

const LocationPickerWrapper = ({
  markerPosition,
  onMarkerPositionChange,
  currentCenter,
  setCurrentCenter,
  zoom,
  setCurrentZoom,
}: Props) => {
  return (
    <LocationPicker
      markerPosition={markerPosition}
      onMarkerPositionChange={onMarkerPositionChange}
      currentCenter={currentCenter}
      setCurrentCenter={setCurrentCenter}
      zoom={zoom}
      setCurrentZoom={setCurrentZoom}
    />
  );
};

export default LocationPickerWrapper;

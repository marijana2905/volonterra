'use client';

import dynamic from 'next/dynamic';
import { MarkerPosition } from '@/types/map.type';
import { Loader2Icon } from 'lucide-react';

type Props = {
  markers: MarkerPosition[];
  zoom: number;
  height: string;
};

// Dynamic import with SSR disabled
const MapWithMarkers = dynamic(() => import('./MapWithMarkers'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted text-muted-foreground flex h-76 w-full items-center justify-center rounded-xl">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
});

const DynamicMap = ({ markers, zoom, height }: Props) => {
  return <MapWithMarkers markers={markers} zoom={zoom} height={height} />;
};

export default DynamicMap;

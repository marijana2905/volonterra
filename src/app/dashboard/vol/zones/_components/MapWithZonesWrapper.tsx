'use client';

import dynamic from 'next/dynamic';
import { Loader2Icon } from 'lucide-react';
import { Zone } from '@/types/zones.type';

type Props = {
  zones: Zone[];
};

// Dynamic import with SSR disabled
const MapWithZones = dynamic(() => import('./MapWithZones'), {
  ssr: false,
  loading: () => (
    <div className="bg-accent text-muted-foreground flex h-full w-full items-center justify-center rounded-xl">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
});

const MapWithZonesWrapper = (props: Props) => {
  return (
    <div className="h-full w-full">
      <MapWithZones {...props} />
    </div>
  );
};

export default MapWithZonesWrapper;

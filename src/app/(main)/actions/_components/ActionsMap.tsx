'use client';

import { MarkerPosition } from '@/types/map.type';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LocateFixedIcon } from 'lucide-react';

type ActionMarkers = {
  lat: number;
  lng: number;
  title: string;
  slug: string;
};

type Props = {
  markers: ActionMarkers[];
  height: string;
};

const DEFAULT_ZOOM = 7;
const SINGLE_MARKER_ZOOM = 13;

const FitBounds = ({
  markers,
  resetTrigger,
}: {
  markers: ActionMarkers[];
  resetTrigger: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;

    if (markers.length === 1) {
      const marker = markers[0];
      if (marker === undefined) return;

      // focus on a single marker with a closer zoom level
      map.setView([marker.lat, marker.lng], SINGLE_MARKER_ZOOM);
    } else {
      const bounds = new LatLngBounds(
        markers.map(marker => [marker.lat, marker.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map, resetTrigger]);

  return null;
};

// Create the icon directly
const markerIcon = new Icon({
  iconUrl: '/marker_icon.svg',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [46, 61],
  shadowAnchor: [15, 61],
});

const ActionsMap = ({ markers, height }: Props) => {
  const currentCenter: MarkerPosition = {
    lat: markers[0]?.lat ?? 44.0165,
    lng: markers[0]?.lng ?? 21.0059,
  };

  const [isClient, setIsClient] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const resetMapView = () => {
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className="relative h-full">
      <Button
        className="absolute top-4 right-4 z-10"
        variant={'default'}
        size={'icon'}
        onClick={resetMapView}
      >
        <LocateFixedIcon />
      </Button>

      <MapContainer
        center={currentCenter}
        zoom={DEFAULT_ZOOM}
        style={{ height, width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds markers={markers} resetTrigger={resetTrigger} />

        {markers.map(marker => (
          <Fragment key={marker.slug}>
            <Marker position={[marker.lat, marker.lng]} icon={markerIcon}>
              <Popup>{marker.title}</Popup>
            </Marker>
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default ActionsMap;

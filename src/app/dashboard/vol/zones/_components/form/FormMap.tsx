'use client';

import { Circle } from 'react-leaflet';

import { MarkerPosition } from '@/types/map.type';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { useFormContext } from 'react-hook-form';
import { ZoneFormSchemaType } from '@/schemas/zoneSchema';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {};

const markerIcon = new Icon({
  iconUrl: '/marker_icon.svg',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [46, 61],
  shadowAnchor: [15, 61],
});

function ClickHandler({ setMarker }: { setMarker: (pos: MarkerPosition) => void }) {
  const form = useFormContext<ZoneFormSchemaType>();
  useMapEvents({
    async click(e) {
      setMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
      form.setValue('center.latitude', e.latlng.lat);
      form.setValue('center.longitude', e.latlng.lng);
      await form.trigger(['center']);
    },
  });
  return null;
}

const FormMap = ({}: Props) => {
  const form = useFormContext<ZoneFormSchemaType>();

  const lat = form.getValues('center.latitude');
  const lng = form.getValues('center.longitude');
  const radius = form.getValues('radius');

  const hasCenter = lat !== undefined && lng !== undefined && lat !== null && lng !== null;
  const hasError = form.formState.errors.center !== undefined;

  const initialCenter: MarkerPosition = {
    lat: lat || 44,
    lng: lng || 22,
  };

  const [marker, setMarker] = useState<MarkerPosition | null>(hasCenter ? { lat, lng } : null);

  // Prilagodi zoom u odnosu na radius (veći radius = manji zoom)
  const getZoomFromRadius = (radiusKm: number) => {
    if (!radiusKm) return 13;
    // Ova formula je aproksimacija za Leaflet/OSM
    // Zoom = 14 - log2(radius u km)
    const zoom = Math.max(1, Math.min(18, Math.round(14 - Math.log2(radiusKm))));
    return zoom;
  };

  const zoom = hasCenter ? getZoomFromRadius(radius) : 7;

  return (
    <div className={cn(hasError && 'border-destructive rounded-xl border')}>
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        style={{
          height: '350px',
          width: '100%',
          borderRadius: '0.75rem',
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasCenter && (
          <Circle
            center={initialCenter}
            radius={radius * 1000} // radius in meters
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
          />
        )}

        <ClickHandler setMarker={setMarker} />
        {marker && <Marker position={marker} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
};

export default FormMap;

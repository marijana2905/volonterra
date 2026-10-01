'use client';

import { MarkerPosition } from '@/types/map.type';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { Zone } from '@/types/zones.type';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResetIcon } from '@radix-ui/react-icons';
import { LocateFixedIcon } from 'lucide-react';

type Props = {
  zones: Zone[];
};

const markerIcon = new Icon({
  iconUrl: '/marker_icon.svg',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [46, 61],
  shadowAnchor: [15, 61],
});

// Prilagodi zoom u odnosu na radius (veći radius = manji zoom)
const getZoomFromRadius = (radiusKm: number) => {
  if (!radiusKm) return 13;
  // Ova formula je aproksimacija za Leaflet/OSM
  // Zoom = 14 - log2(radius u km)
  const zoom = Math.max(1, Math.min(18, Math.round(14 - Math.log2(radiusKm))));
  return zoom;
};

// Fit the map bounds to the zones
const FitBounds = ({ zones, resetTrigger }: { zones: Zone[]; resetTrigger: number }) => {
  const map = useMap();

  useEffect(() => {
    if (zones.length === 0) return;

    if (zones.length === 1) {
      const zone = zones[0];
      if (zone === undefined) return;

      const zoom = getZoomFromRadius(zone.radius);
      map.setView([zone.latitude, zone.longitude], zoom);
    } else {
      const bounds = new LatLngBounds(
        zones.map(zone => [zone.latitude, zone.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [zones, map, resetTrigger]);

  return null;
};

const MapWithZones = ({ zones }: Props) => {
  const currentCenter: MarkerPosition = {
    lat: 44,
    lng: 22,
  };

  const mapRef = useRef<any>(null);

  // hack to force againt fit bounds component to recenter
  const [resetTrigger, setResetTrigger] = useState(0);

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
        ref={mapRef}
        center={currentCenter}
        zoom={7}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds zones={zones} resetTrigger={resetTrigger} />

        {zones.map(zone => (
          <Fragment key={zone.id}>
            <Marker position={[zone.latitude, zone.longitude]} icon={markerIcon}>
              <Popup>
                {zone.name}, {zone.radius} km
              </Popup>
            </Marker>
            <Circle
              center={[zone.latitude, zone.longitude]}
              radius={zone.radius * 1000}
              pathOptions={{ fillColor: 'green', color: 'green', weight: 2 }}
            />
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWithZones;

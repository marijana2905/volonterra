'use client';

import { MarkerPosition } from '@/types/map.type';

import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';

type Props = {
  markerPosition?: MarkerPosition;
  onMarkerPositionChange?: (position: MarkerPosition) => void;
  currentCenter: [number, number];
  setCurrentCenter: (center: [number, number]) => void;
  zoom: number;
  setCurrentZoom: (zoom: number) => void;
};

const markerIcon = new Icon({
  iconUrl: '/marker_icon.svg',
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [46, 61],
  shadowAnchor: [15, 61],
});

const LocationPicker = ({
  markerPosition,
  onMarkerPositionChange,
  currentCenter,
  setCurrentCenter,
  zoom,
  setCurrentZoom,
}: Props) => {
  function LocationMarker() {
    useMapEvents({
      click: e => {
        if (setCurrentCenter) {
          setCurrentCenter([e.latlng.lat, e.latlng.lng]);
        }
        if (onMarkerPositionChange) {
          onMarkerPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      },
    });
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <MapContainer
      center={currentCenter}
      zoom={zoom}
      style={{ height: '500px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Reaguj na promene props-a center/zoom i pomeri mapu */}
      <SetViewOnChange center={currentCenter} zoom={zoom} />

      <LocationMarker />
      {markerPosition && markerIcon && (
        <Marker position={[markerPosition.lat, markerPosition.lng]} icon={markerIcon} />
      )}

      {/* Zoom and Center Listeners */}
      <ZoomListener setCurrentZoom={setCurrentZoom} />
      <ViewportListener onCenterChange={setCurrentCenter} />
    </MapContainer>
  );
};

export default LocationPicker;

const SetViewOnChange = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ZoomListener = ({ setCurrentZoom }: { setCurrentZoom: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: event => {
      const map = event.target;
      if (setCurrentZoom) {
        setCurrentZoom(map.getZoom());
      }
    },
  });
  return null;
};

const ViewportListener = ({
  onCenterChange,
}: {
  onCenterChange?: (center: [number, number]) => void;
}) => {
  useMapEvents({
    moveend: event => {
      const map = event.target;
      if (onCenterChange) {
        const latlng = map.getCenter();
        onCenterChange([latlng.lat, latlng.lng]);
      }
    },
  });
  return null;
};

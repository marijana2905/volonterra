'use client';

import { MarkerPosition } from '@/types/map.type';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';

type Props = {
  markers: MarkerPosition[];
  zoom: number;
  height: string;
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

const MapWithMarkers = ({ markers, zoom, height }: Props) => {
  const currentCenter: MarkerPosition = {
    lat: markers[0]?.lat || 0,
    lng: markers[0]?.lng || 0,
  };

  return (
    <MapContainer
      center={currentCenter}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={markerIcon} />
      ))}
    </MapContainer>
  );
};

export default MapWithMarkers;

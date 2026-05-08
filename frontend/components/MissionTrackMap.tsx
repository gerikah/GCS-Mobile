import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L, { LatLng, LatLngBounds, Icon } from 'leaflet';

// This imports the marker icons as URLs so Vite can find them.
import iconUrl from 'leaflet/dist/images/marker-icon.png?url';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url';

import { mapStyleProviders } from '../utils/mapStyles';

const DefaultIcon = new Icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapOverlaysProps {
  track: { lat: number, lon: number }[];
}

const MapOverlays: React.FC<MapOverlaysProps> = ({ track }) => {
  const positions: LatLng[] = track.map(p => new LatLng(p.lat, p.lon));

  return (
    <>
      {positions.length > 0 && (
        <>
          <Polyline pathOptions={{ color: '#F97316', weight: 3 }} positions={positions} />
          <Marker position={positions[positions.length - 1]} icon={DefaultIcon} />
        </>
      )}
    </>
  );
};

const MemoizedMapOverlays = React.memo(MapOverlays, (prevProps, nextProps) => {
  if (prevProps.track.length !== nextProps.track.length) return false;
  return (
    prevProps.track[prevProps.track.length - 1]?.lat === nextProps.track[nextProps.track.length - 1]?.lat &&
    prevProps.track[prevProps.track.length - 1]?.lon === nextProps.track[nextProps.track.length - 1]?.lon
  );
});

interface MissionTrackMapProps {
  track: { lat: number, lon: number }[];
  mapStyle: string;
}

const MissionTrackMap: React.FC<MissionTrackMapProps> = ({ track, mapStyle }) => {
  const { url, attribution } = mapStyleProviders[mapStyle] || mapStyleProviders['Default'];
  const [map, setMap] = React.useState<L.Map | null>(null);

  React.useEffect(() => {
    if (map && track.length > 0) {
      const positions: LatLng[] = track.map(p => new LatLng(p.lat, p.lon));
      const bounds = new LatLngBounds(positions);
      map.fitBounds(bounds);
    }
  }, [map, track]);

  return (
    <MapContainer
      center={[14.5995, 120.9842]}
      zoom={13}
      scrollWheelZoom={true}
      whenCreated={setMap}
      className="w-full h-full"
    >
      <TileLayer
        url={url}
        attribution={attribution}
      />
      <MemoizedMapOverlays track={track} />
    </MapContainer>
  );
};

export default React.memo(MissionTrackMap);
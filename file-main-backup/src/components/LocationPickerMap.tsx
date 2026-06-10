import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sub-component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e: any) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Sub-component to fly to a new position
function FlyToPosition({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 16, { duration: 1.5 });
    }, [lat, lng, map]);
    return null;
}

interface LocationPickerMapProps {
    position: { lat: number; lng: number };
    hasSelected: boolean;
    cafeIcon: any;
    onMapClick: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ position, hasSelected, cafeIcon, onMapClick }: LocationPickerMapProps) {
    return (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={hasSelected ? 16 : 5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hasSelected && cafeIcon && (
                <Marker position={[position.lat, position.lng]} icon={cafeIcon} />
            )}
            <MapClickHandler onMapClick={onMapClick} />
            {hasSelected && <FlyToPosition lat={position.lat} lng={position.lng} />}
        </MapContainer>
    );
}

import { useState } from 'react';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LocationPickerProps {
    onLocationSelect: (data: {
        address: string;
        lat: number;
        lng: number;
    }) => void;
    initialAddress?: string;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationPicker({
    onLocationSelect,
    initialAddress = '',
    initialLat,
    initialLng,
}: LocationPickerProps) {
    const defaultLat = initialLat || 17.385;
    const defaultLng = initialLng || 78.4867;

    const [position, setPosition] = useState({ lat: defaultLat, lng: defaultLng });
    const [address, setAddress] = useState(initialAddress);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSelected, setHasSelected] = useState(!!initialLat);
    const [zoom, setZoom] = useState(hasSelected ? 16 : 5);

    // Reverse geocode: lat/lng -> address
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            if (data.display_name) {
                setAddress(data.display_name);
                onLocationSelect({ address: data.display_name, lat, lng });
            }
        } catch (err) {
            console.error('Reverse geocode failed:', err);
        }
    };

    // Forward geocode: search query -> lat/lng
    const searchLocation = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                setPosition({ lat: newLat, lng: newLng });
                setAddress(display_name);
                setHasSelected(true);
                setZoom(16);
                onLocationSelect({ address: display_name, lat: newLat, lng: newLng });
            } else {
                alert('Location not found. Try a different search.');
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearching(false);
        }
    };

    // Get current location via browser GPS
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });
                setHasSelected(true);
                setZoom(16);
                reverseGeocode(latitude, longitude);
                setIsLocating(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                alert('Unable to get your location. Please allow location access or search manually.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Build OpenStreetMap embed URL with marker
    const getMapUrl = () => {
        if (hasSelected) {
            return `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.005},${position.lat - 0.003},${position.lng + 0.005},${position.lat + 0.003}&layer=mapnik&marker=${position.lat},${position.lng}`;
        }
        // Default India view
        return `https://www.openstreetmap.org/export/embed.html?bbox=68.7,6.7,97.4,35.5&layer=mapnik`;
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#be9d80]" />
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                searchLocation();
                            }
                        }}
                        placeholder="Search for a location..."
                        className="h-11 pl-10 bg-[#faf8f5] border-[#be9d80]/40"
                    />
                </div>
                <Button
                    type="button"
                    onClick={searchLocation}
                    disabled={isSearching}
                    className="h-11 bg-[#8b5943] hover:bg-[#6b4423] text-white px-4"
                >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
            </div>

            {/* Use Current Location Button */}
            <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLocating}
                variant="outline"
                className="w-full h-11 border-[#be9d80] text-[#3b1f0e] hover:bg-[#be9d80]/10 flex items-center gap-2"
            >
                {isLocating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#8b5943]" />
                        <span>Getting your location...</span>
                    </>
                ) : (
                    <>
                        <Navigation className="w-4 h-4 text-[#8b5943]" />
                        <span>📍 Use My Current Location</span>
                    </>
                )}
            </Button>

            {/* Map Display - OpenStreetMap iframe */}
            <div className="rounded-xl overflow-hidden border-2 border-[#be9d80]/40 shadow-md" style={{ height: '350px' }}>
                <iframe
                    key={`${position.lat}-${position.lng}-${zoom}`}
                    src={getMapUrl()}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Café Location Map"
                />
            </div>

            {/* Help text */}
            <p className="text-[12px] text-[#6b4423] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Search for your café location or use GPS to auto-detect it
            </p>

            {/* Selected Address Display */}
            {hasSelected && address && (
                <div className="p-4 bg-[#fff8f0] border-2 border-[#be9d80]/40 rounded-xl">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#8b5943] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[14px] text-[#3b1f0e] font-medium">Selected Location</p>
                            <p className="text-[13px] text-[#6b4423] mt-1">{address}</p>
                            <p className="text-[11px] text-[#be9d80] mt-1">
                                Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

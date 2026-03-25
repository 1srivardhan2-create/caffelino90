import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, MapPin, Clock, Filter, ChevronDown, Coffee, Store, BadgeCheck, Loader2, DollarSign } from 'lucide-react';
import { Cafe } from '../utils/cafesData';
import { getApprovedCafes } from '../services/cafeService';

interface AllCafesPageProps {
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Default cafe photo when none available
const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';

export default function AllCafesPage({ onNavigate, onBack }: AllCafesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cafe' | 'restaurant'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [dbCafes, setDbCafes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch approved cafes from MongoDB on mount
  useEffect(() => {
    const fetchApprovedCafes = async () => {
      setIsLoading(true);
      try {
        const result = await getApprovedCafes();
        if (result.success && result.cafes) {
          setDbCafes(result.cafes);
        }
      } catch (err) {
        console.error('Failed to fetch approved cafes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedCafes();
  }, []);

  // Convert MongoDB cafe docs into the Cafe interface format
  // Helper to resolve image URLs (prepend server base for /uploads/ paths)
  const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return `https://caffelino90-9v4a.onrender.com${url}`;
    return url;
  };

  const convertedDbCafes: Cafe[] = dbCafes.map((dbCafe: any, index: number) => {
    // Pick the best image: profilePicture first, then first Cafe_photo, then default
    let rawImage = dbCafe.profilePicture
      || ((dbCafe.Cafe_photos && dbCafe.Cafe_photos.length > 0) ? dbCafe.Cafe_photos[0] : null)
      || null;

    const resolveImg = (imgStr: string | null) => {
      if (!imgStr) return DEFAULT_CAFE_IMAGE;
      if (imgStr.startsWith('/uploads/')) return `https://caffelino90-9v4a.onrender.com${imgStr}`;
      return imgStr; // Handles data: image/... and http://... natively
    };

    const resolvedImage = resolveImg(rawImage);

    return {
      id: `db-cafe-${dbCafe._id || index}`,
      name: dbCafe.Name || 'Unnamed Cafe',
      image: resolvedImage,
      rating: 0,
      reviews: 0,
      cuisine: dbCafe.establishmentType || 'Cafe',
      deliveryTime: 'New',
      priceForTwo: parseInt(dbCafe.Average_Cost) || 0,
      location: dbCafe.Cafe_Address || dbCafe.cafe_location || 'Location not set',
      distance: '',
      isOpen: true,
      tags: [dbCafe.establishmentType || 'Cafe', 'Verified'].filter(Boolean),
      menu: [],
      photos: (dbCafe.Cafe_photos || []).map((p: string) => resolveImageUrl(p)),
      // Extra fields for display
      _isFromDB: true,
      _aboutCafe: dbCafe.AboutCafe || '',
      _managerName: dbCafe.managerName || '',
      _phone: dbCafe.Phonenumber || '',
      _latitude: dbCafe.latitude || 0,
      _longitude: dbCafe.longitude || 0,
      _openingHours: dbCafe.opening_hours || {},
      _tables: dbCafe.tables || 0,
      _originalDbCafe: dbCafe,
    };
  }) as any[];

  // Final list: ONLY verified cafes from database
  const allCafes = convertedDbCafes;

  // Filter and search
  const filteredCafes = allCafes.filter(cafe => {
    const matchesSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesType = true;
    if (selectedFilter === 'cafe') {
      matchesType = cafe.cuisine.toLowerCase().includes('cafe');
    } else if (selectedFilter === 'restaurant') {
      matchesType = cafe.cuisine.toLowerCase().includes('restaurant');
    }
    
    return matchesSearch && matchesType;
  });

  // Sort cafes
  const sortedCafes = filteredCafes;

  const filterOptions = [
    { value: 'all', label: 'All Outlets', icon: '🏪' },
    { value: 'cafe', label: 'Cafes', icon: '☕' },
    { value: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  ];

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#0a0a0a]" />
            </button>
            <div>
              <h1 className="font-['Arial:Bold',sans-serif] text-[24px] text-[#0a0a0a]">
                All Cafes
              </h1>
              <p className="font-['Arial:Regular',sans-serif] text-[14px] text-gray-600">
                {isLoading ? 'Loading cafes...' : `${sortedCafes.length} cafes available`}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for cafes, cuisines, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8b5943] font-['Arial:Regular',sans-serif] text-[16px] text-[#0a0a0a] placeholder:text-gray-400"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8b5943] text-white rounded-full text-[14px] font-medium whitespace-nowrap transition-all hover:bg-[#7a4a35]"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedFilter(option.value as any);
                  setShowFilterMenu(false);
                }}
                className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all ${selectedFilter === option.value
                  ? 'bg-[#8b5943] text-white'
                  : 'bg-white border border-gray-300 text-[#0a0a0a] hover:border-[#8b5943]'
                  }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Dropdown Menu */}
      {showFilterMenu && (
        <div className="bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <p className="font-['Arial:Bold',sans-serif] text-[14px] text-gray-700 mb-3">Sort By</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedFilter(option.value as any);
                    setShowFilterMenu(false);
                  }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${selectedFilter === option.value
                    ? 'bg-[#8b5943]/10 border-[#8b5943]'
                    : 'bg-white border-gray-200 hover:border-[#8b5943]/50'
                    }`}
                >
                  <div className="text-[24px] mb-1">{option.icon}</div>
                  <p className="font-['Arial:Bold',sans-serif] text-[14px] text-[#0a0a0a]">
                    {option.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b5943] mx-auto mb-3" />
            <p className="text-[14px] text-[#6b4423]">Loading cafes...</p>
          </div>
        </div>
      )}



      {/* Cafes Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!isLoading && filteredCafes.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="font-['Arial:Bold',sans-serif] text-[20px] text-[#0a0a0a] mb-2">
              No cafes found
            </p>
            <p className="font-['Arial:Regular',sans-serif] text-[14px] text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCafes.map((cafe: any) => (
              <div
                key={cafe.id}
                onClick={() => onNavigate('cafe-details', { dbCafe: cafe._originalDbCafe })}
                className="bg-white rounded-[16px] shadow-md hover:shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 hover:scale-[1.03] active:scale-[0.98] group relative"
              >
                {/* Verified Badge */}
                <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Partner
                </div>

                {/* Cafe Image */}
                <div className="relative h-[200px] bg-[#fdfaf7] flex items-center justify-center overflow-hidden rounded-t-[14px]">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300"
                    onError={(e: any) => { e.target.src = DEFAULT_CAFE_IMAGE; }}
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-lg z-10">
                    OPEN
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Cafe Info */}
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Store className="w-5 h-5 text-[#8b5943] flex-shrink-0 mt-0.5" />
                    <h3 className="font-['Arial:Bold',sans-serif] text-[18px] text-[#0a0a0a] line-clamp-1">
                      {cafe.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-[#8b5943]/10 text-[#8b5943] text-[12px] rounded-full font-medium">
                      {cafe.cuisine}
                    </span>
                    {cafe._tables > 0 && (
                      <span className="text-[12px] text-gray-500">
                        {cafe._tables} tables
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
                    <span className="text-[12px] line-clamp-2">{cafe.location}</span>
                  </div>

                  {cafe.priceForTwo > 0 && (
                    <div className="flex items-center gap-1 text-gray-600 mb-2">
                      <DollarSign className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
                      <span className="text-[13px] font-medium">₹{cafe.priceForTwo} for one</span>
                    </div>
                  )}

                  {cafe._aboutCafe && (
                    <p className="text-[12px] text-gray-500 line-clamp-2 mt-2 italic">
                      "{cafe._aboutCafe}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Coffee className="w-4 h-4 text-[#be9d80]" />
                      <span className="text-[12px] text-[#8b5943] font-medium">
                        {cafe._managerName || 'Cafe Partner'}
                      </span>
                    </div>
                    {cafe._phone && (
                      <span className="text-[11px] text-gray-400">
                        📞 {cafe._phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Info Banner */}
      {sortedCafes.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#8b5943] to-[#a88968] text-white py-3 shadow-lg z-10">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <p className="font-['Arial:Regular',sans-serif] text-[14px]">
              🎉 {convertedDbCafes.length > 0 ? `${convertedDbCafes.length} verified partner cafe${convertedDbCafes.length > 1 ? 's' : ''}` : 'All cafes available for order and meetups'}
            </p>
            <button
              onClick={onBack}
              className="bg-white text-[#8b5943] px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

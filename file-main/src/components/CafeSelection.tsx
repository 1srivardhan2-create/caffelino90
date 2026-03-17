import { useState } from 'react';
import { ArrowLeft, Coffee, MapPin, Star, Users, DollarSign, Sparkles, Check, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface CafeSelectionProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface Cafe {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  avgCostPerPerson: number;
  ambiance: string;
  image: string;
  description: string;
  reviewCount: number;
  categories: string[];
  type: 'cafe' | 'restaurant';
}

export default function CafeSelection({ user, meetupData, onNavigate, onBack }: CafeSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<'voting' | 'no-voting' | null>(null);
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [viewingCafe, setViewingCafe] = useState<Cafe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cafe' | 'restaurant'>('cafe');

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  // Mock cafe data
  const cafes: Cafe[] = [
    {
      id: '1',
      name: 'Espresso House',
      location: 'Nehru Place',
      distance: '1.8 km',
      rating: 4.8,
      avgCostPerPerson: 250,
      ambiance: 'Cozy & Modern',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      description: 'A perfect blend of contemporary design and comfortable seating. Great for long conversations with warm lighting and acoustic background music.',
      reviewCount: 423,
      categories: ['Coffee', 'Sandwiches', 'Desserts'],
      type: 'cafe'
    },
    {
      id: '2',
      name: 'Brewed Awakening',
      location: 'Khan Market',
      distance: '2.5 km',
      rating: 4.7,
      avgCostPerPerson: 300,
      ambiance: 'Casual & Vibrant',
      image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
      description: 'Lively atmosphere with colorful interiors and energetic vibes. Perfect for group meetups with upbeat music and friendly staff.',
      reviewCount: 189,
      categories: ['Coffee', 'Breakfast', 'Snacks'],
      type: 'cafe'
    },
    {
      id: '3',
      name: 'Café Delight',
      location: 'Connaught Place',
      distance: '3.2 km',
      rating: 4.9,
      avgCostPerPerson: 400,
      ambiance: 'Elegant & Luxurious',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description: 'Premium cafe with sophisticated decor, plush seating, and exceptional service. Features live piano music on weekends.',
      reviewCount: 312,
      categories: ['Coffee', 'Gourmet', 'Pastries'],
      type: 'cafe'
    },
    {
      id: '4',
      name: 'Urban Grind',
      location: 'Saket',
      distance: '4.1 km',
      rating: 4.6,
      avgCostPerPerson: 320,
      ambiance: 'Industrial & Trendy',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800',
      description: 'Modern industrial design with exposed brick walls and Edison bulbs. Popular among young professionals and creatives.',
      reviewCount: 201,
      categories: ['Coffee', 'Brunch', 'Salads'],
      type: 'cafe'
    },
    {
      id: '5',
      name: 'Garden Café',
      location: 'Hauz Khas',
      distance: '2.8 km',
      rating: 4.7,
      avgCostPerPerson: 380,
      ambiance: 'Outdoor & Peaceful',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      description: 'Beautiful outdoor seating surrounded by greenery and fountains. Perfect for a relaxed brunch with natural ambiance.',
      reviewCount: 267,
      categories: ['Coffee', 'Continental', 'Drinks'],
      type: 'cafe'
    },
    {
      id: '6',
      name: 'The Bistro',
      location: 'Cyber Hub',
      distance: '5.2 km',
      rating: 4.5,
      avgCostPerPerson: 450,
      ambiance: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
      description: 'Upscale restaurant with refined cuisine and elegant table settings. Perfect for special occasions.',
      reviewCount: 156,
      categories: ['Italian', 'Continental', 'Wine'],
      type: 'restaurant'
    }
  ];

  const handleCafeToggle = (cafeId: string) => {
    if (selectionMode === 'voting') {
      // Voting mode: Allow up to 3 selections
      if (selectedCafes.includes(cafeId)) {
        setSelectedCafes(selectedCafes.filter(id => id !== cafeId));
      } else {
        if (selectedCafes.length < 3) {
          setSelectedCafes([...selectedCafes, cafeId]);
        } else {
          toast.error('You can select maximum 3 cafes for voting');
        }
      }
    } else {
      // No-voting mode: Only 1 selection
      if (selectedCafes.includes(cafeId)) {
        setSelectedCafes([]);
      } else {
        setSelectedCafes([cafeId]);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (selectionMode === 'voting') {
      if (selectedCafes.length !== 3) {
        toast.error('Please select exactly 3 cafes for voting');
        return;
      }
      // In voting mode, navigate to voting page
      const selectedCafeObjects = cafes.filter(cafe => selectedCafes.includes(cafe.id));
      const updatedMeetupData = {
        ...meetupData,
        selectedCafesForVoting: selectedCafeObjects,
        votingMode: true
      };
      toast.success('3 cafes selected! Moving to voting...');
      onNavigate('cafe-voting-page', updatedMeetupData);
    } else {
      if (selectedCafes.length !== 1) {
        toast.error('Please select 1 cafe');
        return;
      }
      // In no-voting mode, directly select the cafe
      const selectedCafe = cafes.find(cafe => cafe.id === selectedCafes[0]);
      const updatedMeetupData = {
        ...meetupData,
        selectedCafe,
        votingMode: false
      };
      toast.success(`${selectedCafe?.name} selected!`);
      onNavigate('meetup-chat', updatedMeetupData);
    }
  };

  const handleViewAmbiance = (cafe: Cafe) => {
    setViewingCafe(cafe);
  };

  const filteredCafes = cafes
    .filter(cafe => cafe.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(cafe => filterType === 'all' || cafe.type === filterType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#be9d80]/10 via-white to-[#d9bf9d]/10">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 shadow-md sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Select Café</h1>
              <p className="text-white/80 text-[12px] font-['Arial:Regular',_sans-serif]">
                {meetupData.meetupName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-32">
        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6 mb-6">
          <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-4">
            Choose Selection Mode
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectionMode('voting');
                setSelectedCafes([]);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectionMode === 'voting'
                  ? 'border-[#be9d80] bg-[#be9d80]/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#be9d80]" />
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                  Voting
                </span>
              </div>
              <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Select 3 cafes for group voting
              </p>
            </button>

            <button
              onClick={() => {
                setSelectionMode('no-voting');
                setSelectedCafes([]);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectionMode === 'no-voting'
                  ? 'border-[#be9d80] bg-[#be9d80]/10'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-[#be9d80]" />
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                  No Voting
                </span>
              </div>
              <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Select 1 cafe directly
              </p>
            </button>
          </div>

          {/* Selection Counter */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-[13px] text-blue-900 font-['Arial:Regular',_sans-serif] text-center">
              {selectionMode === 'voting' 
                ? `Selected ${selectedCafes.length}/3 cafes for voting`
                : `Selected ${selectedCafes.length}/1 cafe`
              }
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6 mb-6">
          <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-4">
            Filter & Search
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full p-4 pl-10 rounded-lg border border-neutral-200 focus:border-[#be9d80] focus:outline-none"
              />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'cafe' | 'restaurant')}
                className="w-full p-4 rounded-lg border border-neutral-200 focus:border-[#be9d80] focus:outline-none"
              >
                <option value="all">All</option>
                <option value="cafe">Cafés</option>
                <option value="restaurant">Restaurants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cafes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => {
            const isSelected = selectedCafes.includes(cafe.id);
            return (
              <div
                key={cafe.id}
                className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all hover:shadow-lg ${
                  isSelected ? 'border-[#be9d80] ring-2 ring-[#be9d80]/20' : 'border-neutral-200'
                }`}
              >
                {/* Cafe Image */}
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#be9d80] text-white p-2 rounded-full">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  {/* Selection Number (Voting Mode) */}
                  {isSelected && selectionMode === 'voting' && (
                    <div className="absolute top-3 left-3 bg-white text-[#be9d80] w-8 h-8 rounded-full flex items-center justify-center font-['Arial:Bold',_sans-serif] text-[16px]">
                      {selectedCafes.indexOf(cafe.id) + 1}
                    </div>
                  )}
                </div>

                {/* Cafe Details */}
                <div className="p-4">
                  <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-2">
                    {cafe.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                      {cafe.location} ({cafe.distance})
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-green-600 fill-green-600" />
                      <span className="text-[13px] font-['Arial:Regular',_sans-serif] text-green-900">
                        {cafe.rating}
                      </span>
                    </div>
                    <span className="text-[12px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                      ({cafe.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Avg Cost Per Person */}
                  <div className="flex items-center gap-2 mb-3 bg-blue-50 p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-[11px] text-blue-700 font-['Arial:Regular',_sans-serif]">
                        Avg Cost per Person
                      </p>
                      <p className="text-[14px] font-['Arial:Bold',_sans-serif] text-blue-900">
                        ₹{cafe.avgCostPerPerson}
                      </p>
                    </div>
                  </div>

                  {/* Ambiance */}
                  <div className="flex items-center justify-between mb-4 bg-purple-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-[11px] text-purple-700 font-['Arial:Regular',_sans-serif]">
                          Ambiance
                        </p>
                        <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-purple-900">
                          {cafe.ambiance}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewAmbiance(cafe)}
                      className="text-[12px] text-purple-700 underline hover:text-purple-900 font-['Arial:Regular',_sans-serif]"
                    >
                      View
                    </button>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleCafeToggle(cafe.id)}
                    className={`w-full py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] transition-colors ${
                      isSelected
                        ? 'bg-[#be9d80] text-white hover:bg-[#a88a6f]'
                        : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Café'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Button - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 p-4 shadow-lg">
        <div className="max-w-[1200px] mx-auto">
          <Button
            onClick={handleConfirmSelection}
            disabled={
              (selectionMode === 'voting' && selectedCafes.length !== 3) ||
              (selectionMode === 'no-voting' && selectedCafes.length !== 1)
            }
            className="w-full bg-[#be9d80] hover:bg-[#a88968] text-white py-4 text-[16px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectionMode === 'voting'
              ? `Confirm Selection (${selectedCafes.length}/3)`
              : selectedCafes.length === 1
              ? 'Confirm & Continue'
              : 'Select a Café to Continue'
            }
          </Button>
        </div>
      </div>

      {/* Ambiance View Modal */}
      {viewingCafe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Image */}
            <div className="relative h-[300px] overflow-hidden">
              <img
                src={viewingCafe.image}
                alt={viewingCafe.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setViewingCafe(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-900 rotate-90" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-[24px] font-['Arial:Bold',_sans-serif] text-neutral-900 mb-2">
                {viewingCafe.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  {viewingCafe.location} ({viewingCafe.distance})
                </p>
              </div>

              {/* Rating & Cost */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-green-600 fill-green-600" />
                    <span className="text-[16px] font-['Arial:Bold',_sans-serif] text-green-900">
                      {viewingCafe.rating}
                    </span>
                  </div>
                  <p className="text-[12px] text-green-700 font-['Arial:Regular',_sans-serif]">
                    {viewingCafe.reviewCount} reviews
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-[12px] text-blue-700 font-['Arial:Regular',_sans-serif] mb-1">
                    Avg Cost/Person
                  </p>
                  <p className="text-[16px] font-['Arial:Bold',_sans-serif] text-blue-900">
                    ₹{viewingCafe.avgCostPerPerson}
                  </p>
                </div>
              </div>

              {/* Ambiance */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-[16px] font-['Arial:Bold',_sans-serif] text-purple-900">
                    Ambiance
                  </h3>
                </div>
                <p className="text-[14px] text-purple-800 font-['Arial:Regular',_sans-serif]">
                  {viewingCafe.ambiance}
                </p>
              </div>

              {/* Description */}
              <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] mb-6">
                {viewingCafe.description}
              </p>

              {/* Close Button */}
              <button
                onClick={() => setViewingCafe(null)}
                className="w-full bg-[#be9d80] hover:bg-[#a88968] text-white py-3 rounded-lg text-[15px] font-['Arial:Regular',_sans-serif]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

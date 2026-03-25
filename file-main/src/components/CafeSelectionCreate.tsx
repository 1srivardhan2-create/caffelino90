import { useState, useEffect } from 'react';
import { ArrowRight, Users, Coffee, MapPin, Star, Check, Search, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { getApprovedCafes } from '../services/cafeService';
import { safeStorage } from '../utils/safeStorage';
import { BASE_URL } from '../utils/api';

interface CafeSelectionCreateProps {
  user: any;
  meetupData: {
    adminName: string;
    date: string;
    time: string;
    adminId: string;
    joinCode: string;
    members?: any[];
    [key: string]: any;
  };
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}



// Members come from meetupData (real MongoDB data)


export default function CafeSelectionCreate({ user, meetupData, onNavigate, onBack }: CafeSelectionCreateProps) {
  // Hardcode voting to false for direct selection flow
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cafes, setCafes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCafes() {
      try {
        const response = await getApprovedCafes();
        if (response && response.success) {
          const mappedCafes = (response.cafes || []).map((cafe: any) => {
            // Pick best location string: prefer cafe_location, then Cafe_Address, skip coordinate-like values
            const rawLoc = cafe.cafe_location || cafe.location || '';
            const isCoordLike = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(rawLoc);
            const location = (!rawLoc || isCoordLike)
              ? (cafe.Cafe_Address || 'Unknown')
              : rawLoc;

            return {
              id: cafe._id,
              name: cafe.Name || cafe.cafeName || 'Cafe',
              costPerPerson: cafe.Average_Cost || cafe.averageCostPerPerson || 200,
              image: cafe.profilePicture || (cafe.Cafe_photos && cafe.Cafe_photos.length > 0 ? cafe.Cafe_photos[0] : null) || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
              location,
              rating: cafe.rating || 4.5,
              ambience: cafe.establishmentType || 'café',
            };
          });
          setCafes(mappedCafes);
        }
      } catch (error) {
        console.error('Error fetching cafes:', error);
      }
    }
    fetchCafes();
  }, []);

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleToggleVoting = () => {
    setVotingEnabled(!votingEnabled);
    setSelectedCafes([]);
    toast.success(votingEnabled ? 'Voting disabled - Select 1 cafe' : 'Voting enabled - Select 3 cafes');
  };

  const handleSelectCafe = (cafeId: string) => {
    if (votingEnabled) {
      if (selectedCafes.includes(cafeId)) {
        setSelectedCafes(selectedCafes.filter(id => id !== cafeId));
      } else {
        if (selectedCafes.length < 3) {
          setSelectedCafes([...selectedCafes, cafeId]);
        } else {
          toast.error('You can only select 3 cafes for voting');
        }
      }
    } else {
      setSelectedCafes([cafeId]);
    }
  };

  const handleContinue = async () => {
    const maxSelection = votingEnabled ? 3 : 1;
    const minSelection = votingEnabled ? 3 : 1;

    if (selectedCafes.length < minSelection) {
      toast.error(`Please select ${votingEnabled ? '3 cafes' : '1 cafe'}`);
      return;
    }

    const selectedCafeObjects = cafes.filter(cafe => selectedCafes.includes(cafe.id));

    const completeData = {
      ...meetupData,
      votingEnabled,
      selectedCafes: selectedCafeObjects,
      members: meetupData?.members || [],
    };

    if (votingEnabled) {
      onNavigate('cafe-voting-create', completeData);
    } else {
      try {
        // Direct Selection: Save to backend immediately so late joiners see it
        const res = await fetch(`${BASE_URL}/api/meetups/select-cafe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetupId: meetupData._id || meetupData.id,
            userId: meetupData.adminId || user?.id,
            cafe: {
              cafeId: selectedCafeObjects[0].id,
              cafeName: selectedCafeObjects[0].name,
              name: selectedCafeObjects[0].name,
              image: selectedCafeObjects[0].image,
              location: selectedCafeObjects[0].location
            }
          })
        });

        const data = await res.json();
        if (data.success) {
          toast.success(`${selectedCafeObjects[0].name} selected!`);

          // Complete the local data with the backend response
          completeData.selectedCafe = data.selectedCafe;

          // Go to Meetup Code generation next
          onNavigate('meetup-code', completeData);
        } else {
          toast.error(data.message || 'Failed to select cafe');
        }
      } catch (error) {
        console.error('Direct cafe selection error:', error);
        toast.error('Network error while saving selection');
      }
    }
  };

  const filteredCafes = cafes.filter(cafe => {
    const searchLower = searchQuery.toLowerCase();
    return (
      cafe.name.toLowerCase().includes(searchLower) ||
      cafe.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#fffbf5] pb-32">
      {/* Brown Gradient Background */}
      <div
        className="absolute top-0 left-0 right-0 h-full -z-10"
        style={{
          background: "linear-gradient(180deg, #967259 0%, #c9b5a0 100%)"
        }}
      />

      {/* Header with Back Button and Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-[#0a0a0a] hover:text-[#525252] transition-colors font-['Arial:Regular',sans-serif] text-[16px] flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#a8825d]" />
            <h1 className="font-['Arial:Bold',sans-serif] text-[18px] text-[#0a0a0a]">Select Café</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00c950] text-white flex items-center justify-center shadow-sm">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="font-['Arial:Bold',sans-serif] text-[14px] text-[#0a0a0a]">Details</span>
        </div>
        <div className="w-20 h-0.5 bg-[#00c950]"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9b5a0] text-[#0a0a0a] flex items-center justify-center shadow-sm">
            <span className="font-['Arial:Bold',sans-serif] text-[16px]">2</span>
          </div>
          <span className="font-['Arial:Bold',sans-serif] text-[14px] text-[#0a0a0a]">Café</span>
        </div>
        <div className="w-20 h-0.5 bg-[#d4c5b3]"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e6dcd0] text-[#8b7355] flex items-center justify-center shadow-sm">
            <span className="font-['Arial:Bold',sans-serif] text-[16px]">3</span>
          </div>
          <span className="font-['Arial:Bold',sans-serif] text-[14px] text-[#8b7355]">Code</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* We removed Meetup Info Card (Code + Members) and Voting Toggle to adhere to the explicit Create Flow */}

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2c1810]" />
          <input
            type="text"
            placeholder="Search cafés by name or area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-[#a8825d] rounded-2xl focus:outline-none focus:border-[#8b5943] font-['Arial:Regular',sans-serif] text-[16px] text-[#2c1810] placeholder:text-[#2c1810] bg-[rgba(168,130,93,0.15)]"
          />
        </div>

        {/* Select Cafes Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Arial:Bold',sans-serif] text-[18px] text-[#101828]">
              Select Café
            </h2>
            <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#1e1e1e]">
              {selectedCafes.length} / 1 selected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCafes.map(cafe => {
              const isSelected = selectedCafes.includes(cafe.id);
              return (
                <button
                  key={cafe.id}
                  onClick={() => handleSelectCafe(cafe.id)}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all text-left hover:shadow-lg ${isSelected
                    ? 'border-[#00c950] shadow-md scale-[1.02]'
                    : 'border-[#e5e7eb] hover:border-[#8b5943]'
                    }`}
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[#00c950] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-['Arial:Bold',sans-serif] text-[16px] text-[#101828] mb-2">{cafe.name}</h4>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#4a5565]" />
                        <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#4a5565]">{cafe.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-[#FFB900] text-[#FFB900]" />
                        <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#4a5565]">{cafe.rating}</span>
                        <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#99a1af]">•</span>
                        <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#6a7282]">{cafe.ambience}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <span className="font-['Arial:Bold',sans-serif] text-[16px] text-[#be9d80]">₹{cafe.costPerPerson}</span>
                        <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#6a7282]">per person</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCafes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No cafés found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 py-4 z-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={handleContinue}
            disabled={selectedCafes.length < (votingEnabled ? 3 : 1)}
            className="w-full py-4 bg-[#c9b5a0] text-[#0a0a0a] rounded-2xl font-['Arial:Bold',sans-serif] text-[16px] hover:bg-[#b8a490] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Confirm Café →
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

import { saveGroupState, updateGroupStage } from '../utils/groupStateManager';

interface Cafe {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  averageCost: number;
}

interface CafeSelectionAdminProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Cafes are fetched from backend in useEffect

import { getApprovedCafes } from '../services/cafeService';

export default function CafeSelectionAdmin({ user, meetupData, onNavigate, onBack }: CafeSelectionAdminProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [showAmbienceModal, setShowAmbienceModal] = useState<Cafe | null>(null);
  const [votingEnabled, setVotingEnabled] = useState<boolean>(true); // Default: voting enabled
  const [cafesList, setCafesList] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setIsLoading(true);
        const data = await getApprovedCafes();
        if (data && data.success && data.cafes) {
          const mappedCafes = data.cafes.map((c: any) => ({
            id: c._id,
            name: c.Name || c.cafeName || 'Cafe',
            location: c.cafe_location || c.location || `${c.area || ''}, ${c.city || ''}`.trim().replace(/^, /, '') || 'Unknown',
            image: c.profilePicture || (c.Cafe_photos && c.Cafe_photos.length > 0 ? c.Cafe_photos[0] : null) || c.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
            rating: c.rating || 4.5,
            averageCost: c.Average_Cost || c.avgCost || c.averageCostPerPerson || 200
          }));
          setCafesList(mappedCafes);
        } else {
          toast.error('Failed to load cafes data');
        }
      } catch (error) {
        console.error('Error fetching cafes:', error);
        toast.error('Network error loading cafes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafes();
  }, []);

  const filteredCafes = cafesList.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cafe.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCafeToggle = (cafeId: string) => {
    if (votingEnabled) {
      // Voting mode: select up to 3 cafes
      if (selectedCafes.includes(cafeId)) {
        setSelectedCafes(selectedCafes.filter(id => id !== cafeId));
      } else {
        if (selectedCafes.length >= 3) {
          toast.error('You can only select up to 3 cafés');
          return;
        }
        setSelectedCafes([...selectedCafes, cafeId]);
      }
    } else {
      // Skip voting mode: select only 1 cafe
      if (selectedCafes.includes(cafeId)) {
        setSelectedCafes([]);
      } else {
        setSelectedCafes([cafeId]);
      }
    }
  };

  const handleDone = async () => {
    if (votingEnabled) {
      // Enable Voting: Must select EXACTLY 3 cafés
      if (selectedCafes.length !== 3) {
        if (selectedCafes.length < 3) {
          toast.error(`Please select ${3 - selectedCafes.length} more café${3 - selectedCafes.length > 1 ? 's' : ''} (${selectedCafes.length}/3 selected)`);
        } else {
          toast.error('You can only select 3 cafés for voting');
        }
        return;
      }

      const selected = cafesList.filter(cafe => selectedCafes.includes(cafe.id));
      setIsSaving(true);

      try {
        // Save to backend
        const res = await fetch('http://localhost:5000/api/meetups/add-cafes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetupId: meetupData._id,
            cafes: selected.map(c => ({
              cafeId: c.id,
              cafeName: c.name,
              cafeImage: c.image
            }))
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success('3 cafés selected. Voting starts now!');

          const votingData = {
            ...meetupData,
            selectedCafes: selected,
            votingEnabled: true,
            votingPhase: 'voting',
            votingClosed: false,
            cafesForVoting: data.meetup.cafesForVoting,
          };

          // Save locally if needed
          updateGroupStage(
            user.id,
            meetupData.code,
            'voting',
            'Voting',
            'cafe-voting-create',
            votingData
          );

          onNavigate('cafe-voting-create', votingData);
        } else {
          toast.error(data.message || 'Failed to save cafes for voting');
        }
      } catch (err) {
        console.error('Save cafes err:', err);
        toast.error('Network error while saving cafes');
      } finally {
        setIsSaving(false);
      }

    } else {
      // Skip Voting: Must select ONLY 1 café
      if (selectedCafes.length !== 1) {
        if (selectedCafes.length === 0) {
          toast.error('Please select 1 café as the meetup location');
        } else {
          toast.error('You can only select 1 café when voting is skipped');
        }
        return;
      }

      const selected = cafesList.find(cafe => cafe.id === selectedCafes[0]);
      setIsSaving(true);

      try {
        // Here we could update the meetup directly with the selected cafe, but for now just move forward
        toast.success(`${selected?.name} selected as the meetup location!`);

        const groupData = {
          ...meetupData,
          winnerCafe: selected,
          selectedCafeId: selected?.id,
          selectedCafe: selected,
          votingEnabled: false,
          votingSkipped: true,
          votingClosed: true,
        };

        updateGroupStage(
          user.id,
          meetupData.code,
          'cafe-selected',
          'Café Selected',
          'meetup-chat-billing',
          groupData
        );

        onNavigate('meetup-chat-billing', groupData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Select Cafés</h1>
          </div>
          {/* Code in top-right corner */}
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white text-[14px] font-['Arial:Regular',_sans-serif] font-medium">
              Code: {meetupData?.code}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Step Indicator */}
        <div className="text-center mb-6">
          <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 3 of 3</p>
          <div className="flex gap-2 justify-center mt-2">
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
          </div>
        </div>

        {/* Voting Mode Toggle */}
        <div className="mb-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] font-medium mb-3 text-center">
              Choose Selection Mode
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Enable Voting Button */}
              <button
                onClick={() => {
                  setVotingEnabled(true);
                  setSelectedCafes([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${votingEnabled
                    ? 'border-green-500 bg-green-50'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${votingEnabled ? 'bg-green-500' : 'bg-neutral-300'
                    }`}>
                    {votingEnabled && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-[14px] font-['Arial:Regular',_sans-serif] font-bold ${votingEnabled ? 'text-green-700' : 'text-neutral-700'
                    }`}>
                    ✅ Enable Voting
                  </span>
                </div>
                <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] text-center">
                  Select 3 cafés • Members vote • Winner by votes
                </p>
              </button>

              {/* Skip Voting Button */}
              <button
                onClick={() => {
                  setVotingEnabled(false);
                  setSelectedCafes([]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${!votingEnabled
                    ? 'border-[#8b5943] bg-[#8b5943]/5'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${!votingEnabled ? 'bg-[#8b5943]' : 'bg-neutral-300'
                    }`}>
                    {!votingEnabled && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-[14px] font-['Arial:Regular',_sans-serif] font-bold ${!votingEnabled ? 'text-[#8b5943]' : 'text-neutral-700'
                    }`}>
                    ❌ Skip Voting (Admin Selects)
                  </span>
                </div>
                <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] text-center">
                  Select 1 café • Direct selection • No voting needed
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-4 mb-6">
          <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] text-center">
            {votingEnabled ? (
              <>
                Select exactly <span className="font-bold text-[#8b5943]">3 cafés or restaurants</span> for your group to vote on
              </>
            ) : (
              <>
                Select <span className="font-bold text-[#8b5943]">1 café or restaurant</span> as the final meetup location
              </>
            )}
          </p>
          <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] text-center mt-1">
            Selected: {selectedCafes.length}/{votingEnabled ? 3 : 1}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cafés and restaurants..."
              className="w-full bg-white border border-neutral-300 rounded-lg pl-12 pr-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent"
            />
          </div>
        </div>

        {/* Cafe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredCafes.map((cafe) => {
            const isSelected = selectedCafes.includes(cafe.id);
            return (
              <div
                key={cafe.id}
                className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${isSelected ? 'border-[#8b5943] shadow-lg' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
              >
                {/* Cafe Image */}
                <div className="relative h-[160px] bg-neutral-200">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#8b5943] text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Cafe Info */}
                <div className="p-4">
                  <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium mb-1">
                    {cafe.name}
                  </h3>
                  <div className="flex items-center gap-1 text-neutral-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <p className="text-[12px] font-['Arial:Regular',_sans-serif]">{cafe.location}</p>
                  </div>

                  <p className="text-[12px] font-['Arial:Regular',_sans-serif] text-neutral-600 mb-3">
                    Avg Cost: ₹{cafe.averageCost} per person
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAmbienceModal(cafe)}
                      className="flex-1 bg-white border border-[#8b5943] text-[#8b5943] h-[36px] rounded-lg flex items-center justify-center gap-2 font-['Arial:Regular',_sans-serif] text-[12px] hover:bg-[#8b5943]/5 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ambience View
                    </button>
                    <button
                      onClick={() => handleCafeToggle(cafe.id)}
                      className={`flex-1 h-[36px] rounded-lg font-['Arial:Regular',_sans-serif] text-[12px] transition-colors ${isSelected
                          ? 'bg-[#8b5943] text-white hover:bg-[#8b5943]/90'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Padding - Prevents content from being hidden behind fixed button */}
        <div className="h-[80px]"></div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md z-40">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <button
            onClick={handleDone}
            disabled={votingEnabled ? selectedCafes.length !== 3 : selectedCafes.length !== 1}
            className={`w-full h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] text-white transition-all ${votingEnabled ? (selectedCafes.length === 3 ? 'bg-[#030213] hover:bg-[#030213]/90 cursor-pointer' : 'bg-neutral-300 cursor-not-allowed') :
                (selectedCafes.length === 1 ? 'bg-[#030213] hover:bg-[#030213]/90 cursor-pointer' : 'bg-neutral-300 cursor-not-allowed')
              }`}
          >
            Done {votingEnabled ? (selectedCafes.length === 3 ? '- Start Voting' : `(${selectedCafes.length}/3 selected)`) : (selectedCafes.length === 1 ? '- Confirm Selection' : `(${selectedCafes.length}/1 selected)`)}
          </button>
        </div>
      </div>

      {/* Ambience Modal */}
      {showAmbienceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAmbienceModal(null)}>
          <div className="bg-white rounded-lg max-w-[600px] w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">{showAmbienceModal.name}</h2>
            <img
              src={showAmbienceModal.image}
              alt={showAmbienceModal.name}
              className="w-full h-[400px] object-cover rounded-lg mb-4"
            />
            <p className="text-[14px] text-neutral-600 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {showAmbienceModal.location}
            </p>
            <button
              onClick={() => setShowAmbienceModal(null)}
              className="w-full bg-[#030213] text-white h-[44px] rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] hover:bg-[#030213]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

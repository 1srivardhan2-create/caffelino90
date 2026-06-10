import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star, Check, Clock, Crown, Coffee, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface CafeSelectionPageProps {
  onNavigate: (page: string, data?: any) => void;
  groupData?: any;
  isAdmin: boolean;
}

import { getApprovedCafes } from '../services/cafeService';

export default function CafeSelectionPage({ onNavigate, groupData, isAdmin }: CafeSelectionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafes, setSelectedCafes] = useState<string[]>([]);
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [cafes, setCafes] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCafes() {
      try {
        const response = await getApprovedCafes();
        if (response && response.success) {
          const mappedCafes = (response.cafes || []).map((cafe: any) => ({
            id: cafe._id,
            name: cafe.cafeName || 'Cafe',
            type: cafe.establishmentType || 'café',
            rating: cafe.rating || 4.0,
            reviews: cafe.reviews || 0,
            location: cafe.location || 'Unknown',
            distance: 'N/A',
            cuisine: ['Coffee', 'Snacks'],
            averageCost: cafe.averageCostPerPerson || 200,
            image: cafe.profilePicture || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
            badge: null,
            offer: null,
            logo: cafe.profilePicture || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80'
          }));
          setCafes(mappedCafes);
        }
      } catch (err) {
        console.error("Error fetching cafes:", err);
      }
    }
    loadCafes();
  }, []);

  const maxSelections = votingEnabled ? 3 : 1;

  // Use real data from groupData (from MongoDB)
  const meetupName = groupData?.meetupName || groupData?.title || 'Meetup';
  const meetupDate = groupData?.date || '';
  const meetupTime = groupData?.time || '';
  const meetupCode = groupData?.code || groupData?.meetupCode || '';
  const members = (groupData?.members || []).map((m: any) => ({
    id: m.userId || m.id,
    name: m.name,
    avatar: '👤',
  }));

  const handleSelectCafe = (cafeId: string) => {
    if (selectedCafes.includes(cafeId)) {
      setSelectedCafes(selectedCafes.filter(id => id !== cafeId));
    } else {
      if (selectedCafes.length >= maxSelections) {
        toast.error(
          votingEnabled 
            ? 'You can select maximum 3 cafés for voting' 
            : 'Voting is OFF. You can select only 1 café.'
        );
        return;
      }
      setSelectedCafes([...selectedCafes, cafeId]);
    }
  };

  const handleToggleVoting = (enabled: boolean) => {
    setVotingEnabled(enabled);
    if (!enabled && selectedCafes.length > 1) {
      setSelectedCafes([]);
      toast.info('Voting disabled. Please select 1 café directly.');
    }
  };

  const handleContinue = () => {
    if (votingEnabled && selectedCafes.length !== 3) {
      toast.error('Please select exactly 3 cafés for voting');
      return;
    }
    
    if (!votingEnabled && selectedCafes.length !== 1) {
      toast.error('Please select 1 café');
      return;
    }

    const selectedCafeData = cafes.filter(cafe => selectedCafes.includes(cafe.id));
    
    if (!votingEnabled || selectedCafes.length === 1) {
      onNavigate('group-interaction', {
        ...groupData,
        cafe: selectedCafeData[0],
        cafeFinalized: true
      });
      toast.success(`${selectedCafeData[0].name} selected!`);
    } else {
      onNavigate('invite-members', {
        ...groupData,
        cafeOptions: selectedCafeData,
        votingEnabled: true
      });
      toast.success('Cafés selected for group voting!');
    }
  };

  const filteredCafes = cafes.filter(cafe => {
    if (searchQuery) {
      return cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             cafe.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3f0] pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-[#be9d80] px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('create-meetup')}
            className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            ← Back
          </button>
          
          <h1 className="text-xl text-white absolute left-1/2 transform -translate-x-1/2">Select Café</h1>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white py-6 px-4">
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            {/* Step 1 - Admin (Complete) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>

            <div className="w-16 h-0.5 bg-green-500"></div>

            {/* Step 2 - Code (Complete) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-gray-700">Code</span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300"></div>

            {/* Step 3 - Café (Current) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#be9d80] flex items-center justify-center text-white font-bold shadow-md">
                3
              </div>
              <span className="text-sm font-medium text-gray-700">Café</span>
            </div>
          </div>
        </div>

        {/* Meetup Summary Card */}
        <div className="px-4 py-4">
          <Card className="p-5 bg-white rounded-2xl shadow-sm border-2 border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 text-[#be9d80] mt-0.5" />
                <div>
                  <h2 className="font-bold text-gray-800 text-lg mb-1">{meetupName}</h2>
                  <p className="text-sm text-gray-600">
                    {meetupDate} • {meetupTime}
                  </p>
                </div>
              </div>
              <div className="bg-[#be9d80] text-white px-4 py-2 rounded-xl font-bold text-sm">
                {meetupCode}
              </div>
            </div>

            {/* Joined Members */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                <Users className="w-4 h-4" />
                <span className="font-semibold">Joined Members ({members.length})</span>
              </div>
              <div className="flex items-center gap-4">
                {members.map((member) => (
                  <div key={member.id} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl mb-1.5 shadow-sm">
                      {member.avatar}
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Enable Voting Toggle */}
        <div className="px-4 mb-4">
          <Card className="p-5 bg-white rounded-2xl shadow-sm border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-base mb-1">Enable Voting</h3>
                <p className="text-sm text-gray-600">
                  Select 3 cafes for members to vote
                </p>
              </div>
              
              {/* Toggle Switch - Teal/Green */}
              <button
                onClick={() => handleToggleVoting(!votingEnabled)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors shadow-sm ${
                  votingEnabled ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                    votingEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Selection Counter Info */}
        {votingEnabled && (
          <div className="px-4 mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">📊</span>
              <p className="text-sm text-gray-800 font-medium">
                Select exactly 3 cafes for voting ({selectedCafes.length}/3 selected)
              </p>
            </div>
          </div>
        )}

        {/* Available Cafés Header */}
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Available Cafés</h2>
            <span className="text-sm text-gray-600">{filteredCafes.length} cafés</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by cafe name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#be9d80] focus:border-[#be9d80] bg-white"
            />
          </div>
        </div>

        {/* Horizontal Scrollable Café Cards */}
        <div className="px-4 mb-4">
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div 
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredCafes.map((cafe) => {
                const isSelected = selectedCafes.includes(cafe.id);
                
                return (
                  <div 
                    key={cafe.id} 
                    className={`flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all relative border-2 ${
                      isSelected ? 'border-[#be9d80] ring-4 ring-[#be9d80]/20' : 'border-gray-200'
                    }`}
                    onClick={() => isAdmin && handleSelectCafe(cafe.id)}
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={cafe.image} 
                        alt={cafe.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Badge */}
                      {cafe.badge && (
                        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-md ${
                          cafe.badge === 'Exclusive' ? 'bg-orange-500' : 'bg-teal-500'
                        }`}>
                          {cafe.badge === 'Exclusive' ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3 fill-white" />}
                          {cafe.badge}
                        </div>
                      )}

                      {/* Cafe Logo */}
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-white border-3 border-white overflow-hidden shadow-lg">
                        <img 
                          src={cafe.logo} 
                          alt={`${cafe.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Title & Rating */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-800 text-base flex-1 leading-tight">{cafe.name}</h3>
                        <div className="flex items-center gap-1 ml-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-bold text-gray-800">{cafe.rating}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-1.5 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 line-clamp-1 leading-relaxed">{cafe.location}</p>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <p className="text-xs text-gray-600">{cafe.distance}</p>
                      </div>

                      {/* Offer */}
                      <div className="flex items-start gap-1.5 mb-3">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                        <p className="text-xs text-orange-600 font-semibold line-clamp-2 leading-relaxed">{cafe.offer}</p>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="pt-3 border-t-2 border-[#be9d80]/30 flex items-center justify-center gap-2 text-[#be9d80]">
                          <Check className="w-5 h-5" strokeWidth={3} />
                          <span className="text-sm font-bold">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl p-4 z-50">
        <div className="max-w-4xl mx-auto">
          <Button 
            className="w-full h-14 bg-[#be9d80] hover:bg-[#a88970] text-white rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg" 
            onClick={handleContinue}
            disabled={votingEnabled ? selectedCafes.length !== 3 : selectedCafes.length !== 1}
          >
            Continue →
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

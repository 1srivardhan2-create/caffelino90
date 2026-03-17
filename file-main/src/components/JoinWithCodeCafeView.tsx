import { useState } from 'react';
import { ArrowLeft, MapPin, Image as ImageIcon, Users, Calendar, Clock, Lock } from 'lucide-react';

interface Cafe {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  averageCost: number;
}

interface JoinWithCodeCafeViewProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function JoinWithCodeCafeView({ user, meetupData, onNavigate, onBack }: JoinWithCodeCafeViewProps) {
  const [showAmbienceModal, setShowAmbienceModal] = useState<Cafe | null>(null);

  // Get cafes from meetupData based on voting settings
  const votingEnabled = meetupData?.votingEnabled ?? true;
  const cafesToDisplay = votingEnabled ? meetupData?.selectedCafes?.slice(0, 3) || [] : [meetupData?.winnerCafe].filter(Boolean);

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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
              {meetupData?.groupName || 'Meetup Details'}
            </h1>
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
        {/* Meetup Info Header */}
        <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium">
              {meetupData?.groupName}
            </h2>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <Users className="w-4 h-4 text-green-700" />
              <span className="text-[13px] text-green-700 font-['Arial:Regular',_sans-serif] font-medium">
                {meetupData?.members?.length || 1} Members
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-neutral-600">
              <Calendar className="w-4 h-4" />
              <span className="text-[14px] font-['Arial:Regular',_sans-serif]">
                {meetupData?.date ? new Date(meetupData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Date not set'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-neutral-600">
              <Clock className="w-4 h-4" />
              <span className="text-[14px] font-['Arial:Regular',_sans-serif]">
                {meetupData?.time || 'Time not set'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#be9d80]/20">
            <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              <span className="font-medium text-neutral-800">Admin:</span> {meetupData?.adminName || 'Group Admin'}
            </p>
          </div>
        </div>

        {/* READ-ONLY Notice */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[15px] text-blue-900 font-['Arial:Regular',_sans-serif] font-bold mb-1">
                View-Only Mode
              </p>
              <p className="text-[13px] text-blue-800 font-['Arial:Regular',_sans-serif]">
                {votingEnabled 
                  ? 'The admin has selected 3 cafés for voting. You can view details but cannot modify selections or place orders.'
                  : 'The admin has selected the meetup location. You can view details but cannot modify selections or place orders.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Voting Mode Display */}
        {votingEnabled !== undefined && (
          <div className="mb-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] font-medium mb-2 text-center">
                Selection Mode
              </p>
              <div className={`p-3 rounded-lg border-2 ${
                votingEnabled 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-[#8b5943] bg-[#8b5943]/5'
              }`}>
                <p className={`text-[14px] font-['Arial:Regular',_sans-serif] font-bold text-center ${
                  votingEnabled ? 'text-green-700' : 'text-[#8b5943]'
                }`}>
                  {votingEnabled ? '✅ Voting Enabled' : '❌ Admin Selected (No Voting)'}
                </p>
                <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] text-center mt-1">
                  {votingEnabled 
                    ? 'Members will vote to choose the final café' 
                    : 'Admin has directly selected the meetup location'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-4">
          <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium">
            {votingEnabled ? 'Cafés for Voting' : 'Selected Café'}
          </h3>
          <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif] mt-1">
            {votingEnabled 
              ? `Viewing ${cafesToDisplay.length} café${cafesToDisplay.length !== 1 ? 's' : ''} selected by the admin`
              : 'Final meetup location selected by admin'
            }
          </p>
        </div>

        {/* Cafe Grid - EXACT MATCH of Admin Dashboard */}
        {cafesToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cafesToDisplay.map((cafe: Cafe) => (
              <div
                key={cafe.id}
                className="bg-white border-2 border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 transition-all"
              >
                {/* Cafe Image */}
                <div className="relative h-[160px] bg-neutral-200">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {!votingEnabled && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-[11px] font-bold">
                      SELECTED
                    </div>
                  )}
                </div>

                {/* Cafe Info - EXACT MATCH */}
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

                  {/* View-Only Button */}
                  <button
                    onClick={() => setShowAmbienceModal(cafe)}
                    className="w-full bg-white border border-[#8b5943] text-[#8b5943] h-[36px] rounded-lg flex items-center justify-center gap-2 font-['Arial:Regular',_sans-serif] text-[12px] hover:bg-[#8b5943]/5 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Ambience View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-12 text-center">
            <p className="text-[15px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              No cafés have been selected yet by the admin.
            </p>
          </div>
        )}

        {/* Menu Section - READ-ONLY Notice */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[15px] text-amber-900 font-['Arial:Regular',_sans-serif] font-bold mb-1">
                Menu & Ordering Disabled
              </p>
              <p className="text-[13px] text-amber-800 font-['Arial:Regular',_sans-serif]">
                Members who join via code cannot select menu items or place orders. Only the admin can manage menu selection and ordering.
              </p>
            </div>
          </div>
        </div>

        {/* Action Restrictions */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
          <p className="text-[14px] text-red-900 font-['Arial:Regular',_sans-serif] font-bold mb-2">
            ⛔ Restricted Actions for Join-with-Code Members
          </p>
          <ul className="space-y-1.5">
            <li className="text-[13px] text-red-800 font-['Arial:Regular',_sans-serif] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
              Cannot select or change cafés
            </li>
            <li className="text-[13px] text-red-800 font-['Arial:Regular',_sans-serif] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
              Cannot select menu items or place orders
            </li>
            <li className="text-[13px] text-red-800 font-['Arial:Regular',_sans-serif] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
              Cannot edit group preferences or settings
            </li>
            <li className="text-[13px] text-red-800 font-['Arial:Regular',_sans-serif] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
              View-only access to all group information
            </li>
          </ul>
        </div>

        {/* Bottom Spacing */}
        <div className="h-[80px]"></div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md z-40">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <button
            onClick={() => {
              // Determine next step based on voting state
              const votingEnabled = meetupData?.votingEnabled ?? true;
              const votingClosed = meetupData?.votingClosed || false;
              const votingSkipped = meetupData?.votingSkipped || meetupData?.votingEnabled === false;

              if (votingSkipped || votingClosed) {
                // Voting was skipped or already closed → Go to Group Chat
                onNavigate('meetup-group-page', meetupData);
              } else if (votingEnabled && !votingClosed) {
                // Voting is enabled and open → Go to Voting Screen
                onNavigate('meetup-voting', meetupData);
              } else {
                // Fallback → Go to Group Chat
                onNavigate('meetup-group-page', meetupData);
              }
            }}
            className="w-full h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] bg-[#030213] hover:bg-[#030213]/90 text-white transition-all"
          >
            {(() => {
              const votingEnabled = meetupData?.votingEnabled ?? true;
              const votingClosed = meetupData?.votingClosed || false;
              const votingSkipped = meetupData?.votingSkipped || meetupData?.votingEnabled === false;

              if (votingSkipped || votingClosed) {
                return 'Continue to Group Chat';
              } else if (votingEnabled && !votingClosed) {
                return 'Continue to Vote';
              } else {
                return 'Continue';
              }
            })()}
          </button>
        </div>
      </div>

      {/* Ambience Modal - EXACT MATCH */}
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
import { useState, useEffect } from 'react';
import { MapPin, Image as ImageIcon, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import { updateGroupStage } from '../utils/groupStateManager';

interface MeetupVotingPageProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function MeetupVotingPage({ user, meetupData, onNavigate }: MeetupVotingPageProps) {
  const [votes, setVotes] = useState<{ [cafeId: string]: number }>({});
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [showAmbienceModal, setShowAmbienceModal] = useState<any>(null);
  const [members, setMembers] = useState(meetupData?.members || []);
  const [votingClosed, setVotingClosed] = useState(meetupData?.votingClosed || false);
  const [winnerCafe, setWinnerCafe] = useState<any>(meetupData?.winnerCafe || null);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  const isLateJoin = meetupData?.isLateJoin || false;
  
  // Safety check for selectedCafes
  const selectedCafes = meetupData?.selectedCafes || [];

  // Save navigation state when component mounts
  useEffect(() => {
    if (user?.id && meetupData?.code) {
      updateGroupStage(
        user.id,
        meetupData.code,
        'voting',
        'Voting',
        'meetup-voting',
        meetupData
      );
    }
  }, []);

  const handleVote = (cafeId: string) => {
    if (votingClosed) {
      toast.error('Voting has been closed');
      return;
    }

    // If user already voted, remove previous vote
    if (selectedVote) {
      setVotes(prev => ({
        ...prev,
        [selectedVote]: Math.max((prev[selectedVote] || 0) - 1, 0)
      }));
    }

    // Add new vote
    setSelectedVote(cafeId);
    setVotes(prev => ({
      ...prev,
      [cafeId]: (prev[cafeId] || 0) + 1
    }));
    
    if (selectedVote === cafeId) {
      toast.success('Vote confirmed!');
    } else if (selectedVote) {
      toast.success('Vote changed successfully!');
    } else {
      toast.success('Vote submitted!');
    }
  };

  const handleCloseVoting = () => {
    if (selectedCafes.length === 0) {
      toast.error('No cafes available for voting');
      return;
    }
    
    setVotingClosed(true);
    
    // Determine winner
    let winnerCafe = selectedCafes[0];
    let maxVotes = votes[winnerCafe.id] || 0;

    selectedCafes.forEach((cafe: any) => {
      const cafeVotes = votes[cafe.id] || 0;
      if (cafeVotes > maxVotes) {
        maxVotes = cafeVotes;
        winnerCafe = cafe;
      }
    });

    // Show result popup
    setTimeout(() => {
      onNavigate('voting-result', {
        ...meetupData,
        winnerCafe,
        votes
      });
    }, 500);
  };

  const votedCount = members.filter((m: any) => {
    // Check if this member has voted
    return selectedVote !== null || m.voted;
  }).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">{meetupData?.groupName}</h1>
            <p className="text-white/80 text-[12px] font-['Arial:Regular',_sans-serif]">Vote for your preferred café</p>
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
        {/* Voting Instructions or Status */}
        {!votingClosed && !isLateJoin && !selectedVote && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif] text-center">
              Click on your preferred café to vote. You can change your vote anytime before voting closes.
            </p>
          </div>
        )}

        {votingClosed && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
            <p className="text-[16px] text-green-900 font-['Arial:Regular',_sans-serif] text-center font-bold mb-1">
              ✅ Voting closed. Café selected.
            </p>
            <p className="text-[13px] text-green-700 font-['Arial:Regular',_sans-serif] text-center">
              {winnerCafe ? `${winnerCafe.name} has been selected for the meetup!` : 'The winning café has been selected.'}
            </p>
          </div>
        )}

        {isLateJoin && !votingClosed && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6">
            <p className="text-[14px] text-amber-900 font-['Arial:Regular',_sans-serif] text-center">
              <span className="font-bold">Voting in progress.</span> Results will be shown when admin closes voting.
            </p>
          </div>
        )}

        {/* Cafe Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {selectedCafes.length === 0 ? (
            <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <p className="text-[16px] text-yellow-900 font-['Arial:Regular',_sans-serif] mb-2">
                No cafes available for voting
              </p>
              <p className="text-[14px] text-yellow-700 font-['Arial:Regular',_sans-serif]">
                The admin needs to select cafes for voting first.
              </p>
            </div>
          ) : (
            selectedCafes.map((cafe: any) => {
              const cafeVotes = votes[cafe.id] || 0;
              const isUserVote = selectedVote === cafe.id;
              const isWinner = votingClosed && winnerCafe && cafe.id === winnerCafe.id;
              
              return (
                <div
                  key={cafe.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden transition-all ${
                    isWinner 
                      ? 'border-amber-500 shadow-2xl ring-4 ring-amber-200' 
                      : isUserVote 
                        ? 'border-green-500 shadow-lg' 
                        : 'border-neutral-200'
                  } ${!votingClosed && !isLateJoin ? 'cursor-pointer hover:border-[#8b5943]/50' : 'cursor-not-allowed'}`}
                  onClick={() => !votingClosed && !isLateJoin && handleVote(cafe.id)}
                >
                  {/* Cafe Image */}
                  <div className="relative h-[200px] bg-neutral-200">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    {isWinner && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <span className="text-[16px]">🏆</span>
                        <span className="text-[14px] font-['Arial:Regular',_sans-serif] font-bold">WINNER</span>
                      </div>
                    )}
                    {isUserVote && !isWinner && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Check className="w-4 h-4" />
                        <span className="text-[12px] font-['Arial:Regular',_sans-serif] font-bold">Your Vote</span>
                      </div>
                    )}
                    {votingClosed && !isWinner && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-[14px] font-['Arial:Regular',_sans-serif] font-bold">Not Selected</span>
                      </div>
                    )}
                  </div>

                  {/* Cafe Info */}
                  <div className="p-4">
                    <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium mb-2">
                      {cafe.name}
                    </h3>
                    <div className="flex items-center gap-1 text-neutral-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <p className="text-[12px] font-['Arial:Regular',_sans-serif]">{cafe.location}</p>
                    </div>
                    
                    <p className="text-[12px] font-['Arial:Regular',_sans-serif] text-neutral-600 mb-4">
                      Avg Cost: ₹{cafe.averageCost} per person
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAmbienceModal(cafe);
                      }}
                      className="w-full bg-white border border-[#8b5943] text-[#8b5943] h-[36px] rounded-lg flex items-center justify-center gap-2 font-['Arial:Regular',_sans-serif] text-[12px] hover:bg-[#8b5943]/5 transition-colors mb-3"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ambience View
                    </button>

                    {/* Vote Count */}
                    <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-3 text-center">
                      <p className="text-[24px] font-bold text-[#8b5943]">{cafeVotes}</p>
                      <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                        {cafeVotes === 1 ? 'vote' : 'votes'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Member Count and Close Voting - MOVED TO BOTTOM */}
        <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8b5943]" />
              <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-700">
                <span className="font-bold text-[#8b5943]">{members.length}</span> {members.length === 1 ? 'member' : 'members'} joined
              </p>
              {selectedVote && (
                <span className="text-[12px] text-green-600 flex items-center gap-1 ml-4">
                  <Check className="w-4 h-4" />
                  You have voted
                </span>
              )}
            </div>
            {isAdmin && !votingClosed && (
              <button
                onClick={handleCloseVoting}
                className="bg-[#030213] text-white px-6 py-2.5 rounded-lg text-[13px] font-['Arial:Regular',_sans-serif] font-medium hover:bg-[#030213]/90 transition-colors"
              >
                Close Voting
              </button>
            )}
            {votingClosed && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-[12px] font-['Arial:Regular',_sans-serif] font-medium">
                🔒 Voting Closed
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">Meetup Details</h3>
          <div className="space-y-1">
            <p className="text-[14px] text-neutral-700">
              <span className="font-medium">Date:</span> {new Date(meetupData?.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[14px] text-neutral-700">
              <span className="font-medium">Time:</span> {meetupData?.time} IST
            </p>
            <p className="text-[14px] text-neutral-700">
              <span className="font-medium">Admin:</span> {meetupData?.adminName}
            </p>
          </div>
        </div>
        
        {/* Bottom spacing for fixed button */}
        <div className="h-[100px]"></div>
      </div>

      {/* Fixed Continue Button - Shows when voting is closed */}
      {votingClosed && winnerCafe && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md z-40">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <button
              onClick={() => onNavigate('meetup-group-page', { ...meetupData, votingClosed: true, winnerCafe })}
              className="w-full h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] bg-[#030213] hover:bg-[#030213]/90 text-white transition-all"
            >
              Continue to Group Chat
            </button>
          </div>
        </div>
      )}

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

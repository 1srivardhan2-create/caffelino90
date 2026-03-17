import { useState, useEffect } from 'react';
import { ArrowLeft, Coffee, MapPin, Star, Users, DollarSign, Sparkles, Check, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface CafeVotingProps {
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
}

interface Member {
  id: string;
  name: string;
  role: string;
  hasVoted: boolean;
  votedCafeId?: string;
}

export default function CafeVoting({ user, meetupData, onNavigate, onBack }: CafeVotingProps) {
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [votingComplete, setVotingComplete] = useState(false);
  const [winningCafe, setWinningCafe] = useState<Cafe | null>(null);
  const [viewingCafe, setViewingCafe] = useState<Cafe | null>(null);

  // Initialize members with mock data if not provided
  const initialMembers: Member[] = meetupData.members || [
    {
      id: user.id,
      name: user.name || user.firstName || 'Admin',
      role: 'admin',
      hasVoted: false
    },
    {
      id: '2',
      name: 'Sarah',
      role: 'member',
      hasVoted: false
    },
    {
      id: '3',
      name: 'John',
      role: 'member',
      hasVoted: false
    },
    {
      id: '4',
      name: 'Emma',
      role: 'member',
      hasVoted: false
    }
  ];

  const [members, setMembers] = useState<Member[]>(initialMembers);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  const cafesForVoting = meetupData.selectedCafesForVoting || meetupData.selectedCafes || [];

  // Initialize votes object from meetupData or create new
  useEffect(() => {
    if (meetupData.votes) {
      // Use existing votes from mock data
      setVotes(meetupData.votes);
    } else {
      // Create new votes object
      const initialVotes: Record<string, number> = {};
      cafesForVoting.forEach((cafe: Cafe) => {
        initialVotes[cafe.id] = 0;
      });
      setVotes(initialVotes);
    }
  }, [cafesForVoting]);

  // Check if current user has already voted
  useEffect(() => {
    const currentMember = members.find(m => m.id === user.id || m.name === user.name);
    if (currentMember?.hasVoted) {
      setHasVoted(true);
      setSelectedCafeId(currentMember.votedCafeId || null);
    }
  }, [members, user]);

  // Auto redirect members to chat when voting is complete
  useEffect(() => {
    if (votingComplete && !isAdmin && winningCafe) {
      const timer = setTimeout(() => {
        onNavigate('meetup-chat', {
          ...meetupData,
          selectedCafe: winningCafe,
          votingComplete: true,
          votes: votes
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [votingComplete, isAdmin, winningCafe]);

  const handleVote = (cafeId: string) => {
    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }
    setSelectedCafeId(cafeId);
  };

  const handleSubmitVote = () => {
    if (!selectedCafeId) {
      toast.error('Please select a cafe to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted!');
      return;
    }

    // Update votes
    setVotes(prev => ({
      ...prev,
      [selectedCafeId]: (prev[selectedCafeId] || 0) + 1
    }));

    // Mark user as voted
    setMembers(prev => prev.map(member =>
      (member.id === user.id || member.name === user.name)
        ? { ...member, hasVoted: true, votedCafeId: selectedCafeId }
        : member
    ));

    setHasVoted(true);
    toast.success('Your vote has been submitted!');

    // Check if all members have voted
    const updatedMembers = members.map(member =>
      (member.id === user.id || member.name === user.name)
        ? { ...member, hasVoted: true, votedCafeId: selectedCafeId }
        : member
    );

    const allVoted = updatedMembers.every(member => member.hasVoted);
    if (allVoted) {
      // Calculate winner after a delay
      setTimeout(() => {
        calculateWinner();
      }, 1000);
    }
  };

  const calculateWinner = () => {
    // Find cafe with highest votes
    let maxVotes = 0;
    let winningCafeId = '';

    Object.entries(votes).forEach(([cafeId, voteCount]) => {
      const updatedVoteCount = cafeId === selectedCafeId ? voteCount + 1 : voteCount;
      if (updatedVoteCount > maxVotes) {
        maxVotes = updatedVoteCount;
        winningCafeId = cafeId;
      }
    });

    const winner = cafesForVoting.find((cafe: Cafe) => cafe.id === winningCafeId);
    setWinningCafe(winner);
    setVotingComplete(true);
  };

  const handleEndVotingApi = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/meetups/${meetupData._id || meetupData.id}/end-voting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id || user._id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Voting ended successfully!');
        const winner = cafesForVoting.find((c: Cafe) => c.id === data.meetup.selectedCafe.cafeId || c.id === data.meetup.selectedCafe._id);
        if (winner) {
          setWinningCafe(winner);
        }
        setVotingComplete(true);
      } else {
        toast.error(data.message || 'Failed to end voting');
      }
    } catch (err) {
      toast.error('Error ending voting');
      console.error(err);
    }
  };

  const handleCompleteVoting = () => {
    if (!winningCafe) {
      toast.error('No winning cafe selected');
      return;
    }

    const updatedMeetupData = {
      ...meetupData,
      selectedCafe: winningCafe,
      votingComplete: true,
      votes: votes
    };

    toast.success(`${winningCafe.name} has been selected!`);
    onNavigate('meetup-chat', updatedMeetupData);
  };

  const handleViewAmbiance = (cafe: Cafe) => {
    setViewingCafe(cafe);
  };

  const votedCount = members.filter(m => m.hasVoted).length;
  const totalMembers = members.length;
  const votingProgress = (votedCount / totalMembers) * 100;

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
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Café Voting</h1>
              <p className="text-white/80 text-[12px] font-['Arial:Regular',_sans-serif]">
                {meetupData.meetupName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-32">
        {/* Voting Progress */}
        <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#be9d80]" />
              <div>
                <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                  Voting Progress
                </h2>
                <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  {votedCount} of {totalMembers} members have voted
                </p>
              </div>
            </div>
            {!votingComplete && (
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-5 h-5" />
                <span className="text-[13px] font-['Arial:Regular',_sans-serif]">In Progress</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#be9d80] to-[#d9bf9d] h-full transition-all duration-500"
              style={{ width: `${votingProgress}%` }}
            />
          </div>

          {/* Members List */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className={`p-3 rounded-lg border-2 ${member.hasVoted
                    ? 'border-green-500 bg-green-50'
                    : 'border-neutral-300 bg-neutral-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${member.hasVoted ? 'bg-green-500' : 'bg-neutral-300'
                    }`}>
                    {member.hasVoted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white text-[12px] font-['Arial:Bold',_sans-serif]">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-neutral-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                      {member.hasVoted ? 'Voted' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voting Complete - Winner Announcement */}
        {votingComplete && winningCafe && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h2 className="text-[24px] font-['Arial:Bold',_sans-serif] text-neutral-900">
                Winner Announced!
              </h2>
            </div>
            <div className="text-center">
              <p className="text-[16px] text-neutral-700 font-['Arial:Regular',_sans-serif] mb-2">
                The winning café is:
              </p>
              <p className="text-[28px] font-['Arial:Bold',_sans-serif] text-[#be9d80] mb-4">
                {winningCafe.name}
              </p>
              <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                {votes[winningCafe.id] + 1} votes
              </p>
            </div>
          </div>
        )}

        {/* Instruction Banner */}
        {!votingComplete && !hasVoted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif] text-center">
              📊 Vote for your preferred café from the options below
            </p>
          </div>
        )}

        {!votingComplete && hasVoted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-[14px] text-green-900 font-['Arial:Regular',_sans-serif] text-center">
              ✅ You have voted! Waiting for other members to vote...
            </p>
          </div>
        )}

        {/* Cafes for Voting */}
        <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-4">
          Select Your Preferred Café
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafesForVoting.map((cafe: Cafe) => {
            const voteCount = votes[cafe.id] || 0;
            const isSelected = selectedCafeId === cafe.id;
            const isWinner = votingComplete && winningCafe?.id === cafe.id;

            return (
              <div
                key={cafe.id}
                className={`bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all hover:shadow-lg ${isWinner
                    ? 'border-yellow-400 ring-4 ring-yellow-400/30'
                    : isSelected
                      ? 'border-[#be9d80] ring-2 ring-[#be9d80]/20'
                      : 'border-neutral-200'
                  }`}
              >
                {/* Cafe Image */}
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {isWinner && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-[12px] font-['Arial:Bold',_sans-serif]">Winner</span>
                    </div>
                  )}
                  {isSelected && !votingComplete && (
                    <div className="absolute top-3 right-3 bg-[#be9d80] text-white p-2 rounded-full">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  {votingComplete && (
                    <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full">
                      <span className="text-[14px] font-['Arial:Bold',_sans-serif] text-neutral-900">
                        {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                      </span>
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
                      {cafe.location} • {cafe.distance}
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

                  {/* Avg Cost */}
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

                  {/* Vote Button */}
                  {!votingComplete && (
                    <button
                      onClick={() => handleVote(cafe.id)}
                      disabled={hasVoted}
                      className={`w-full py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] transition-colors ${isSelected
                          ? 'bg-[#be9d80] text-white'
                          : hasVoted
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        }`}
                    >
                      {isSelected ? 'Selected' : hasVoted ? 'Already Voted' : 'Vote for this Café'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Vote Button - Fixed at Bottom */}
      {!votingComplete && !hasVoted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 p-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto">
            <Button
              onClick={handleSubmitVote}
              disabled={!selectedCafeId}
              className="w-full bg-[#be9d80] hover:bg-[#a88968] text-white py-4 text-[16px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedCafeId ? 'Submit My Vote' : 'Select a Café to Vote'}
            </Button>
          </div>
        </div>
      )}

      {/* End Voting Early Button for Admin */}
      {!votingComplete && isAdmin && hasVoted && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 p-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto">
            <Button
              onClick={handleEndVotingApi}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-[16px] rounded-lg"
            >
              End Voting & Show Winner
            </Button>
          </div>
        </div>
      )}

      {/* Complete Voting Button - Fixed at Bottom */}
      {votingComplete && isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 p-4 shadow-lg">
          <div className="max-w-[1200px] mx-auto">
            <Button
              onClick={handleCompleteVoting}
              className="w-full bg-gradient-to-r from-[#be9d80] to-[#d9bf9d] hover:from-[#a88968] hover:to-[#c9af8d] text-white py-4 text-[16px] rounded-lg"
            >
              Continue with {winningCafe?.name}
            </Button>
          </div>
        </div>
      )}

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
                  {viewingCafe.location} • {viewingCafe.distance}
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

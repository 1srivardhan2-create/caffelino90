import { useState, useEffect } from 'react';
import { Star, MapPin, Check, Clock, Users, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';

interface CafeVotingPageProps {
  onNavigate: (page: string, data?: any) => void;
  groupData: any;
  user?: any;
}



export default function CafeVotingPage({ onNavigate, groupData, user }: CafeVotingPageProps) {
  const [votes, setVotes] = useState<{ [key: string]: string[] }>({});
  const [userVote, setUserVote] = useState<string | null>(null);
  const realMembers = (groupData?.members || []).map((m: any) => ({
    id: m.userId || m.id,
    name: m.name,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`,
    hasVoted: false,
  }));
  const [members, setMembers] = useState(realMembers);
  const [daysLeft, setDaysLeft] = useState(2);

  // Initialize votes with some mock data
  useEffect(() => {
    if (groupData.cafeOptions) {
      const initialVotes: { [key: string]: string[] } = {};
      groupData.cafeOptions.forEach((cafe: any) => {
        // Randomly assign some members to have voted
        const randomVoters = realMembers.slice(0, Math.floor(Math.random() * 2));
        initialVotes[cafe.id] = randomVoters.map(m => m.id);
      });
      setVotes(initialVotes);
    }
  }, [groupData.cafeOptions]);

  const handleVote = (cafeId: string) => {
    if (userVote === cafeId) {
      // Unvote
      setUserVote(null);
      setVotes(prev => ({
        ...prev,
        [cafeId]: prev[cafeId].filter(id => id !== 'current-user')
      }));
      toast.info('Vote removed');
    } else {
      // Remove previous vote if exists
      if (userVote) {
        setVotes(prev => ({
          ...prev,
          [userVote]: prev[userVote].filter(id => id !== 'current-user')
        }));
      }
      
      // Add new vote
      setUserVote(cafeId);
      setVotes(prev => ({
        ...prev,
        [cafeId]: [...(prev[cafeId] || []), 'current-user']
      }));
      toast.success('Vote recorded!', {
        description: 'You can change your vote anytime',
      });
    }
  };

  const getVotersForCafe = (cafeId: string) => {
    const voterIds = votes[cafeId] || [];
    const voters = voterIds.map(id => {
      if (id === 'current-user') {
        return { id: 'current-user', name: 'You', photo: '', hasVoted: true };
      }
      return members.find(m => m.id === id);
    }).filter(Boolean);
    return voters;
  };

  const totalVotes = Object.values(votes).reduce((sum, voterIds) => sum + voterIds.length, 0);
  const totalMembers = members.length + 1; // +1 for current user
  const allVoted = totalVotes >= totalMembers;

  // Check if current user is admin
  const isAdmin = user && groupData.createdBy === user.id;

  const handleFinishVoting = () => {
    if (!userVote) {
      toast.error('Please vote for a café before finishing');
      return;
    }

    // Find the café with most votes
    let winningCafeId = '';
    let maxVotes = 0;
    Object.entries(votes).forEach(([cafeId, voterIds]) => {
      if (voterIds.length > maxVotes) {
        maxVotes = voterIds.length;
        winningCafeId = cafeId;
      }
    });

    const winningCafe = groupData.cafeOptions?.find((c: any) => c.id === winningCafeId);

    toast.success('Voting completed!', {
      description: `${winningCafe?.name} wins with ${maxVotes} votes!`,
    });

    // Navigate to voting complete screen with the winning café
    setTimeout(() => {
      onNavigate('voting-complete', {
        ...groupData,
        selectedCafe: winningCafe,
        votingResults: votes
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('invite-members', groupData)}
          className="caffelino-back-btn mb-6"
        >
          ← Back
        </button>

        {/* Voting Status Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-[16px] text-amber-600 font-medium">
              Voting open — {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-[32px] leading-[40px] text-neutral-950 mb-2">
              Vote for Your Spot
            </h1>
            <p className="text-[16px] text-slate-600">
              {groupData.invitedMembers?.length || totalMembers} members voting
            </p>
          </div>

          {/* Voting Progress */}
          <Card className="p-4 bg-slate-100 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Voting Progress</span>
              <span className="text-sm font-medium text-neutral-950">
                {totalVotes}/{totalMembers} voted
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalVotes / totalMembers) * 100}%` }}
              />
            </div>
          </Card>

          {/* Admin Member Overview - Only visible to admin */}
          {isAdmin && (
            <Card className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-neutral-950">Admin Overview</h3>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                  Admin Only
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Total Members */}
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-slate-600">Total Members</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-950">{totalMembers}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Including you
                  </p>
                </div>

                {/* Members Voted */}
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-slate-600">Voted</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-950">{totalVotes}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {((totalVotes / totalMembers) * 100).toFixed(0)}% participation
                  </p>
                </div>
              </div>

              {/* Member List */}
              <div className="mt-4 bg-white rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-600 mb-2 font-medium">Member Status</p>
                <div className="space-y-2">
                  {/* Current User */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">
                          {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-950">You (Admin)</span>
                    </div>
                    {userVote ? (
                      <Badge className="bg-green-500 text-white text-xs">Voted</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Not Voted</Badge>
                    )}
                  </div>

                  {/* Other Members */}
                  {members.map((member) => {
                    const hasVoted = Object.values(votes).some(voterIds => 
                      voterIds.includes(member.id)
                    );
                    return (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={member.photo} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-[10px]">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-neutral-950">{member.name}</span>
                        </div>
                        {hasVoted ? (
                          <Badge className="bg-green-500 text-white text-xs">Voted</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Not Voted</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Café Cards */}
        <div className="space-y-4">
          {groupData.cafeOptions?.map((cafe: any) => {
            const cafeVoters = getVotersForCafe(cafe.id);
            const hasUserVoted = userVote === cafe.id;
            const voteCount = cafeVoters.length;

            return (
              <Card key={cafe.id} className="overflow-hidden">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="w-32 h-32 flex-shrink-0 relative">
                    <img 
                      src={cafe.image} 
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    {hasUserVoted && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          Voted
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Café Details */}
                  <div className="flex-1 p-4">
                    {/* Name */}
                    <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-2">
                      {cafe.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-[14px] text-neutral-950">{cafe.rating}</span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      <span className="text-[14px] text-slate-600">{cafe.distance}</span>
                    </div>

                    {/* Voters Section */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] text-slate-500">Voters ({voteCount})</span>
                      </div>
                      
                      {cafeVoters.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* Circular Checkbox */}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            voteCount > 0 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {voteCount > 0 && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>

                          {/* Voter Avatars */}
                          <div className="flex -space-x-2">
                            {cafeVoters.slice(0, 4).map((voter: any, index) => (
                              <Avatar 
                                key={voter?.id || index} 
                                className="w-8 h-8 border-2 border-white"
                              >
                                {voter?.photo ? (
                                  <AvatarImage src={voter.photo} />
                                ) : null}
                                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                                  {voter?.name?.charAt(0) || '?'}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {cafeVoters.length > 4 && (
                              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-slate-600">
                                  +{cafeVoters.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          <span className="text-[12px] text-slate-400">No votes yet</span>
                        </div>
                      )}
                    </div>

                    {/* Vote Button */}
                    <Button 
                      onClick={() => handleVote(cafe.id)}
                      className={`w-full h-[44px] rounded-[8px] ${
                        hasUserVoted 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-[#030213] hover:bg-[#030213]/90'
                      }`}
                    >
                      {hasUserVoted ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Voted
                        </span>
                      ) : 'Vote'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            💡 You can change your vote anytime before voting closes
          </p>
        </Card>
      </div>

      {/* Footer - Finish Voting Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            className={`w-full h-[52px] rounded-[8px] text-[16px] ${
              !userVote
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed hover:bg-slate-300'
                : 'bg-[#030213] hover:bg-[#030213]/90 text-white'
            }`}
            onClick={handleFinishVoting}
            disabled={!userVote}
          >
            {!userVote 
              ? 'Waiting for your vote...' 
              : allVoted 
                ? 'Finish Voting' 
                : `Finish Voting (${totalVotes}/${totalMembers} voted)`}
          </Button>
          <p className="text-xs text-center text-slate-500 mt-2">
            {!userVote 
              ? 'Select a café to continue' 
              : allVoted
                ? '✓ Everyone has voted!'
                : `Waiting for ${totalMembers - totalVotes} more vote${totalMembers - totalVotes !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </div>
  );
}

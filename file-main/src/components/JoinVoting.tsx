import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Users, Check, TrendingUp, Coffee, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { socketService } from '../services/socketService';

interface JoinVotingProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function JoinVoting({ user, meetupData, onNavigate, onBack }: JoinVotingProps) {
  if (!meetupData || !meetupData.selectedCafes || meetupData.selectedCafes.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading meetup data...</p>
        </div>
      </div>
    );
  }

  const [votes, setVotes] = useState<any[]>(meetupData.votes || []);
  const [voteCounts, setVoteCounts] = useState<{ [cafeId: string]: number }>({});
  const [myVote, setMyVote] = useState<string | null>(null);
  const [votedMembers, setVotedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>(meetupData.members || []);

  useEffect(() => {
    if (meetupData._id) {
      socketService.joinMeetupRoom(meetupData._id);

      const handleVoteUpdate = (data: any) => {
        if (data.meetupId !== meetupData._id) return;

        setVotes(data.votes);
        setVoteCounts(data.voteCounts);

        const vMembers = data.votes.map((v: any) => v.userId);
        setVotedMembers(vMembers);

        if (data.status === 'ordering' || data.selectedCafe) {
          toast.success('Voting complete! A café has been selected.');
          setTimeout(() => {
            onNavigate('meetup-chat-billing', {
              ...meetupData,
              selectedCafe: data.selectedCafe,
              status: data.status,
              votes: data.votes
            });
          }, 2000);
        }
      };

      const handleMemberJoined = (data: any) => {
        toast.success(data.message || 'A new member joined!');
        if (data.meetup && data.meetup.members) {
          setMembers(data.meetup.members);
        }
      };

      socketService.socket?.on('vote_update', handleVoteUpdate);
      socketService.socket?.on('member_joined', handleMemberJoined);

      if (meetupData.votes) {
        const initialVMembers = meetupData.votes.map((v: any) => v.userId);
        setVotedMembers(initialVMembers);
        const myV = meetupData.votes.find((v: any) => v.userId === user?.id);
        if (myV) setMyVote(myV.cafeId);

        const initVoteCounts: Record<string, number> = {};
        meetupData.votes.forEach((v: any) => {
          initVoteCounts[v.cafeId] = (initVoteCounts[v.cafeId] || 0) + 1;
        });
        setVoteCounts(initVoteCounts);
      }

      return () => {
        socketService.socket?.off('vote_update', handleVoteUpdate);
        socketService.socket?.off('member_joined', handleMemberJoined);
      };
    }
  }, [meetupData._id, meetupData, onNavigate, user?.id]);

  const membersArray = members || [];
  const totalMembers = membersArray.length;
  const totalVotedMembers = votedMembers.length;
  const votingProgress = totalMembers > 0 ? Math.round((totalVotedMembers / totalMembers) * 100) : 0;

  const handleVote = async (cafeId: string) => {
    setMyVote(cafeId);

    try {
      const res = await fetch('https://caffelino90-9v4a.onrender.com/api/meetups/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupId: meetupData._id,
          userId: user?.id,
          cafeId
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Vote submitted! 🗳️');
      } else {
        toast.error('Failed to submit vote');
        setMyVote(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to vote.');
      setMyVote(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#be9d80]" />
            <h1 className="text-gray-900 text-lg font-bold">Vote for Café</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Success Banner (if voted) */}
      {myVote && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" strokeWidth={3} />
            </div>
            <p className="text-white font-bold text-lg">Your vote has been recorded!</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Voting Stats */}
        <div className="bg-gradient-to-br from-[#f5ebe0] to-[#e3d5ca] rounded-2xl p-6 mb-8 border border-[#be9d80]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#be9d80]" />
                {meetupData.adminName}'s Meetup
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Vote for your favorite café
              </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
              <p className="text-[#be9d80] font-mono font-bold tracking-wider">{meetupData.joinCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#be9d80]/30">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              <p className="text-xs text-gray-600 mt-1">Total Members</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{votedMembers}</p>
              <p className="text-xs text-gray-600 mt-1">Members Voted</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalMembers - votedMembers}</p>
              <p className="text-xs text-gray-600 mt-1">Pending Votes</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🗳️</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Cast Your Vote</h3>
              <p className="text-sm text-gray-700">
                The admin has selected {meetupData.selectedCafes.length} cafés. Vote for your favorite! The café with the most votes wins.
              </p>
            </div>
          </div>
        </div>

        {/* Café Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {meetupData.selectedCafes.map((cafe: any) => {
            const cafeVoteCount = voteCounts[cafe.id] || 0;
            const hasVoted = myVote === cafe.id;
            const votePercentage = totalVotedMembers > 0 ? Math.round((cafeVoteCount / totalVotedMembers) * 100) : 0;

            return (
              <div
                key={cafe.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${hasVoted
                    ? 'border-green-500 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {hasVoted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-2">
                      <Check className="w-4 h-4" strokeWidth={3} />
                      <span className="text-sm">Voted</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800 text-sm">{cafe.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cafe.name}</h3>

                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#be9d80]" />
                    <div className="text-sm">
                      <p>{cafe.address || cafe.location}</p>
                      {cafe.distance && <p className="text-gray-500 mt-1">{cafe.distance} away</p>}
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">Cost per person</p>
                    <p className="text-xl font-bold text-green-700">
                      ₹{cafe.costPerPerson || '300-500'}
                    </p>
                    {cafe.ambience && (
                      <p className="text-xs text-gray-600 mt-1">{cafe.ambience}</p>
                    )}
                  </div>

                  {/* Vote Stats */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-gray-600 mb-1">Votes</p>
                      <p className="text-lg font-bold text-gray-900">{cafeVoteCount}</p>
                    </div>
                    <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-3">
                      <p className="text-xs text-gray-600 mb-1">Share</p>
                      <p className="text-lg font-bold text-purple-700">{votePercentage}%</p>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <Button
                    onClick={() => handleVote(cafe.id)}
                    disabled={hasVoted}
                    className={`w-full py-3 text-base font-semibold rounded-xl transition-all ${hasVoted
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-[#be9d80] hover:bg-[#a88968] text-white'
                      }`}
                  >
                    {hasVoted ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Voted
                      </span>
                    ) : (
                      'Vote for this Café'
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Members Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members ({members.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
                <span className="text-lg">{member.avatarEmoji}</span>
                <span className="text-sm font-medium text-gray-700">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

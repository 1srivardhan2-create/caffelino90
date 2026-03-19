import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://caffelino90-9v4a.onrender.com/api';

interface JoinWithCodeProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function JoinWithCode({ user, onNavigate, onBack }: JoinWithCodeProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinMeetup = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    if (!user) {
      toast.error('Please login to join a meetup');
      return;
    }

    setIsJoining(true);

    try {
      const code = joinCode.toUpperCase().trim();
      const userId = user.id || user._id || `user-${Date.now()}`;
      const userName = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : (user.name || user.firstName || 'User');

      // First look up the meetup
      const lookupRes = await fetch(`${API_BASE}/meetups/code/${code}`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData.success) {
        toast.error('Invalid join code. Please check and try again.');
        setIsJoining(false);
        return;
      }

      // Join the meetup via API
      const joinRes = await fetch(`${API_BASE}/meetups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupCode: code,
          userId,
          name: userName,
        }),
      });

      const joinData = await joinRes.json();

      if (!joinRes.ok || !joinData.success) {
        toast.error(joinData.message || 'Failed to join meetup');
        setIsJoining(false);
        return;
      }

      const meetup = joinData.meetup;
      toast.success(`Successfully joined: ${meetup.title}!`);

      // Navigate based on meetup state
      const meetupNavData = {
        ...meetup,
        meetupName: meetup.title,
        adminName: meetup.organizerName,
        adminId: meetup.organizerId,
        joinCode: meetup.meetupCode,
        members: meetup.members,
        isAdmin: meetup.organizerId === userId,
      };

      if (meetup.status === 'voting' && meetup.cafesForVoting?.length > 0) {
        onNavigate('join-voting', {
          ...meetupNavData,
          selectedCafes: meetup.cafesForVoting,
          hasVoting: true,
        });
      } else if (meetup.selectedCafe) {
        onNavigate('meetup-chat-billing', {
          ...meetupNavData,
          selectedCafe: meetup.selectedCafe,
        });
      } else {
        onNavigate('cafe-selection-create', meetupNavData);
      }
    } catch (error) {
      console.error('Join meetup error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsJoining(false);
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
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Join a Meetup</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Join Meetup Content */}
      <div className="max-w-[600px] mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-neutral-900 mb-2">Enter Join Code</h2>
            <p className="text-neutral-600 text-sm">
              Enter the 6-character code shared by the meetup host
            </p>
          </div>

          {/* Join Code Input */}
          <div className="mb-6">
            <label className="block text-sm text-neutral-700 mb-2">
              Join Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinMeetup()}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#be9d80] text-center text-2xl tracking-widest uppercase"
              disabled={isJoining}
            />
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinMeetup}
            disabled={isJoining || !joinCode.trim() || joinCode.trim().length < 6}
            className="w-full py-4 bg-[#be9d80] text-white rounded-lg hover:bg-[#a88968] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isJoining ? 'Joining...' : 'Join Meetup'}
          </button>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600 text-center">
              Don't have a code? Ask your friend to share their meetup code with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

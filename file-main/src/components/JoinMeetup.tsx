import { useState } from 'react';
import { Coffee, Users, Key } from 'lucide-react';
import { toast } from 'sonner';
import { socketService } from '../services/socketService';
import { BASE_URL } from '../utils/api';

const API_BASE = `${BASE_URL}/api`;

export default function JoinMeetup({ onNavigate, onBack, user }: JoinMeetupProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }

    const code = joinCode.toUpperCase().trim();

    if (code.length < 6) {
      toast.error('Please enter a valid 6-character code');
      return;
    }

    setIsValidating(true);

    try {
      // First, look up the meetup by code
      const lookupRes = await fetch(`${API_BASE}/meetups/code/${code}`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData.success) {
        setIsValidating(false);
        toast.error('Invalid join code. Please check and try again.');
        return;
      }

      const meetup = lookupData.meetup;

      // Now join the meetup
      const userId = user?.id || user?._id || `user-${Date.now()}`;
      const userName = user?.name || user?.firstName || 'User';

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
        setIsValidating(false);
        toast.error(joinData.message || 'Failed to join meetup');
        return;
      }

      toast.success(`Joined meetup: ${joinData.meetup.title}!`);

      const updatedMeetup = joinData.meetup;

      // Connect socket and join room, then emit member_joined so admin sees name in chat
      socketService.connect();
      socketService.joinMeetupRoom(updatedMeetup._id);
      socketService.socket?.emit('member_joined', {
        meetupId: updatedMeetup._id,
        userId,
        name: userName,
        members: updatedMeetup.members,
        meetup: updatedMeetup,
        message: `${userName} joined the meetup! 👋`,
      });

      // Navigate to chat — explicitly mark as non-admin (joined via code)
      onNavigate('meetup-chat-billing', {
        ...updatedMeetup,
        meetupName: updatedMeetup.title,
        adminName: updatedMeetup.organizerName,
        adminId: updatedMeetup.organizerId,
        joinCode: updatedMeetup.meetupCode,
        selectedCafe: updatedMeetup.selectedCafe || updatedMeetup.cafesForVoting?.[0],
        members: updatedMeetup.members,
        isAdmin: false,
        joinedViaCode: true,
      });
    } catch (error) {
      console.error('Join meetup error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      className="min-h-screen relative size-full"
      style={{ backgroundImage: "linear-gradient(235.157deg, rgb(139, 89, 67) 3.9852%, rgb(217, 191, 157) 42.96%, rgb(139, 89, 67) 81.936%)" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="font-['Arial:Regular',sans-serif] text-[16px] text-[#364153] hover:text-[#101828] transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#8b5943]" />
            <h1 className="font-['Arial:Bold',sans-serif] text-[18px] text-[#101828]">Join Meetup</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-[#8b5943] to-[#6b4423] rounded-2xl mb-6 shadow-lg">
            <Users className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-['Arial:Bold',sans-serif] text-[30px] text-[#101828] mb-3">
            Join a Café Meetup
          </h2>
          <p className="font-['Arial:Regular',sans-serif] text-[18px] text-[#4a5565]">
            Enter the meetup code shared by your friend to join
          </p>
        </div>

        {/* Join Code Card - Brown Gradient matching Figma */}
        <div
          className="rounded-2xl p-8 mb-12 border border-[#e5e7eb] shadow-sm"
          style={{
            backgroundImage: "linear-gradient(247.573deg, rgb(139, 89, 67) 1.4667%, rgb(217, 191, 157) 49.297%, rgb(139, 89, 67) 99.968%)"
          }}
        >
          <div className="mb-6">
            <label className="block font-['Arial:Bold',sans-serif] text-[14px] text-[#0a0a0a] mb-3">
              Meetup Join Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-[#0a0a0a]" />
              </div>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="ENTER 6-CHARACTER CODE"
                maxLength={6}
                className="w-full pl-12 pr-4 py-4 border-2 border-[#0a0a0a] rounded-2xl focus:outline-none focus:border-[#8b5943] font-['Consolas:Regular',sans-serif] text-[18px] text-[#0a0a0a] placeholder:text-[#0a0a0a]/60 tracking-widest uppercase bg-transparent"
              />
            </div>
            <p className="mt-3 font-['Arial:Regular',sans-serif] text-[14px] text-[#0a0a0a]">
              The code is case-insensitive and contains letters and numbers
            </p>
          </div>

          {/* Join Button - Matching Figma beige button */}
          <button
            onClick={handleJoin}
            disabled={isValidating || joinCode.trim().length < 6}
            className="w-full bg-[#c9b5a0] hover:bg-[#b8a48f] text-[#0a0a0a] py-4 rounded-2xl font-['Arial:Bold',sans-serif] text-[16px] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Meetup</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          {/* How It Works - Green */}
          <div className="bg-[#f0fdf4] border border-[#b9f8cf] rounded-2xl p-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#00c950] rounded-2xl flex items-center justify-center">
                  <span className="text-[20px]">💡</span>
                </div>
              </div>
              <div>
                <h4 className="font-['Arial:Bold',sans-serif] text-[16px] text-[#101828] mb-3">
                  How It Works
                </h4>
                <div className="space-y-2">
                  <p className="font-['Arial:Regular',sans-serif] text-[14px] text-[#364153]">
                    1. Get the join code from your friend
                  </p>
                  <p className="font-['Arial:Regular',sans-serif] text-[14px] text-[#364153]">
                    2. Enter the 6-character code above
                  </p>
                  <p className="font-['Arial:Regular',sans-serif] text-[14px] text-[#364153]">
                    3. Vote for café options (if voting is enabled)
                  </p>
                  <p className="font-['Arial:Regular',sans-serif] text-[14px] text-[#364153]">
                    4. Chat, view menu, and split bills together!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Permissions - Yellow */}
          <div className="bg-[#fffbeb] border border-[#fee685] rounded-2xl p-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#fe9a00] rounded-2xl flex items-center justify-center">
                  <span className="text-[20px]">👥</span>
                </div>
              </div>
              <div>
                <h4 className="font-['Arial:Bold',sans-serif] text-[16px] text-[#101828] mb-3">
                  Your Permissions
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00a63e] text-[16px]">✓</span>
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#364153]">
                      Vote for cafés
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00a63e] text-[16px]">✓</span>
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#364153]">
                      View menu & chat
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00a63e] text-[16px]">✓</span>
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#364153]">
                      Pay your share of bill
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#e7000b] text-[16px]">✗</span>
                    <p className="font-['Arial:Regular',sans-serif] text-[16px] text-[#364153]">
                      Place orders (admin only)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

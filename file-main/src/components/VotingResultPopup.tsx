import { useEffect } from 'react';
import { Check } from 'lucide-react';

import { updateGroupStage } from '../utils/groupStateManager';

interface VotingResultPopupProps {
  meetupData: any;
  user?: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function VotingResultPopup({ meetupData, user, onNavigate }: VotingResultPopupProps) {
  useEffect(() => {
    // Voting result is managed via meetupData props (from MongoDB)


    const groupData = { ...meetupData, votingClosed: true, selectedCafeId: meetupData.winnerCafe?.id };

    // Save to localStorage before navigating
    if (user?.id && meetupData?.code) {
      updateGroupStage(
        user.id,
        meetupData.code,
        'voting-complete',
        'Voting Complete',
        'group-chat',
        groupData
      );
    }

    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      onNavigate('group-chat', groupData);
    }, 2000);

    return () => clearTimeout(timer);
  }, [meetupData, onNavigate]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-[500px] w-full p-8 text-center animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
          Café Selected!
        </h2>

        {/* Winner Cafe */}
        <div className="bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-lg p-6 mb-4">
          <img
            src={meetupData?.winnerCafe?.image}
            alt={meetupData?.winnerCafe?.name}
            className="w-full h-[200px] object-cover rounded-lg mb-4"
          />
          <h3 className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold mb-2">
            {meetupData?.winnerCafe?.name}
          </h3>
          <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
            {meetupData?.winnerCafe?.location}
          </p>
        </div>

        {/* Redirecting message */}
        <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
          Redirecting to group page...
        </p>
      </div>
    </div>
  );
}
import { X, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

interface InvitationModalProps {
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  groupData: {
    name: string;
    inviterName?: string;
    memberCount?: number;
    cafeOptions?: any[];
    scheduledDate?: string;
  };
}

export default function InvitationModal({ 
  onClose, 
  onAccept, 
  onDecline, 
  groupData 
}: InvitationModalProps) {
  
  const handleAccept = () => {
    toast.success('Invitation accepted! Welcome to the group! 🎉', {
      description: `You've joined ${groupData.name}`,
    });
    onAccept();
  };

  const handleDecline = () => {
    toast.info('Invitation declined', {
      description: 'You can always join later if you change your mind',
    });
    onDecline();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-[12px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[28px] leading-[36px] mb-2">
              You're invited!
            </h2>
            <p className="text-white/90 text-sm">
              {groupData.inviterName || 'A friend'} invited you to join a meetup
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Group Name */}
          <div className="mb-6 text-center">
            <p className="text-slate-600 text-sm mb-2">Join group</p>
            <h3 className="text-[24px] text-neutral-950 mb-1">
              {groupData.name}
            </h3>
            <p className="text-slate-600">
              Accept to join this meetup
            </p>
          </div>

          {/* Group Details */}
          <div className="space-y-3 mb-6 bg-slate-50 rounded-[8px] p-4">
            {groupData.memberCount && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Members</p>
                  <p className="text-neutral-950 font-medium">{groupData.memberCount} people invited</p>
                </div>
              </div>
            )}

            {groupData.cafeOptions && groupData.cafeOptions.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Venue Options</p>
                  <p className="text-neutral-950 font-medium">
                    {groupData.cafeOptions.length} {groupData.cafeOptions.length === 1 ? 'option' : 'options'} to vote on
                  </p>
                </div>
              </div>
            )}

            {groupData.scheduledDate && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Date</p>
                  <p className="text-neutral-950 font-medium">{groupData.scheduledDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-[8px]">
            <p className="text-xs text-amber-900 text-center">
              🔒 This is a friends & family meetup. Your information is only visible to group members.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 h-[48px] rounded-[8px] border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 h-[48px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-[8px] shadow-md"
            >
              Accept
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

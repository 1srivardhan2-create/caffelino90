import { Calendar, MapPin, Users, Crown, CheckCircle, Vote, MessageCircle, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { GroupState } from '../utils/groupStateManager';

interface MyGroupCardProps {
  group: GroupState;
  onClick: () => void;
  onDelete?: (groupId: string) => void;
}

export default function MyGroupCard({ group, onClick, onDelete }: MyGroupCardProps) {
  // Get status icon based on current stage
  const getStatusIcon = () => {
    switch (group.currentStage) {
      case 'created':
        return <CheckCircle className="w-4 h-4" />;
      case 'voting':
        return <Vote className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      case 'menu-selection':
        return <ShoppingBag className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Get status color based on current stage
  const getStatusColor = () => {
    switch (group.currentStage) {
      case 'created':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'voting':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'chat':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'menu-selection':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'payment':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Format date and time
  const formatDateTime = () => {
    if (!group.meetupDate && !group.meetupTime) return 'Date & time to be decided';

    const dateStr = group.meetupDate || 'TBD';
    const timeStr = group.meetupTime || '';

    if (dateStr === 'TBD') return 'Date & time to be decided';

    // Smart date formatting - only show year if different from current year
    const meetupDate = new Date(dateStr);
    const currentYear = new Date().getFullYear();
    const meetupYear = meetupDate.getFullYear();

    let formattedDate;
    if (meetupYear === currentYear) {
      // Same year - don't show year
      formattedDate = meetupDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } else {
      // Different year - show year
      formattedDate = meetupDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    return `${formattedDate}${timeStr ? ` • ${timeStr}` : ''}`;
  };

  // Get action text based on stage
  const getActionText = () => {
    return 'Chat';
  };

  return (
    <Card className="relative p-5 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#be9d80]/40 bg-gradient-to-br from-white to-[#f9f6f3]">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Group Name */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[18px] text-neutral-950 truncate">
                {group.groupName}
              </h3>
              {group.userRole === 'creator' && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-[#be9d80] text-white border-[#be9d80]">
                  <Crown className="w-3 h-3 mr-1 inline" />
                  Creator
                </Badge>
              )}
            </div>

            {/* Group Code (if creator) */}
            {group.userRole === 'creator' && group.groupCode && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] text-neutral-600">Code:</span>
                <code className="bg-[#be9d80]/10 text-[#8b5943] px-2 py-0.5 rounded text-[13px] font-mono">
                  {group.groupCode}
                </code>
              </div>
            )}

            {/* Group Description */}
            {group.groupDescription && (
              <p className="text-[13px] text-neutral-600 line-clamp-2">
                {group.groupDescription}
              </p>
            )}
          </div>

          {/* Status Badge & Delete */}
          <div className="flex flex-col items-end gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="whitespace-nowrap">{group.status}</span>
            </div>
            {onClick && group.userRole && (
              /* Using a conditional render to keep layout aligned but we add the delete button here */
              null
            )}
          </div>
        </div>

        {/* Absolute Delete Button for Top Right */}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(group.groupId);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}

        {/* Details Section */}
        <div className="space-y-2">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-[14px] text-neutral-600">
            <Calendar className="w-4 h-4 flex-shrink-0 text-[#8b5943]" />
            <span className="truncate">{formatDateTime()}</span>
          </div>

          {/* Cafe Name */}
          {group.cafeName ? (
            <div className="flex items-center gap-2 text-[14px] text-neutral-600">
              <MapPin className="w-4 h-4 flex-shrink-0 text-[#8b5943]" />
              <span className="truncate">{group.cafeName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[14px] text-neutral-400 italic">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Café not selected yet</span>
            </div>
          )}

          {/* Member Count */}
          {group.memberCount && (
            <div className="flex items-center gap-2 text-[14px] text-neutral-600">
              <Users className="w-4 h-4 flex-shrink-0 text-[#8b5943]" />
              <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
            </div>
          )}
        </div>

        {/* Resume Button */}
        <Button
          onClick={onClick}
          className="w-full bg-[#be9d80] hover:bg-[#a88968] text-white h-[44px] text-[15px] mt-2"
        >
          {getActionText()}
        </Button>
      </div>
    </Card>
  );
}
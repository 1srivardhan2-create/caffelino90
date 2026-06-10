import { Calendar, MapPin, Users, ChevronRight, Vote, MessageCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MeetupState } from '../utils/meetupStateManager';

interface ActiveMeetupCardProps {
  meetup: MeetupState;
  onClick: () => void;
}

export default function ActiveMeetupCard({ meetup, onClick }: ActiveMeetupCardProps) {
  // Get status icon based on current screen
  const getStatusIcon = () => {
    switch (meetup.currentScreen) {
      case 'voting':
        return <Vote className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      case 'menu-selection':
        return <ShoppingBag className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  // Get status color based on current screen
  const getStatusColor = () => {
    switch (meetup.currentScreen) {
      case 'voting':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'chat':
        return 'bg-green-100 text-green-700 border-green-200';
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
    if (!meetup.date && !meetup.time) return 'Date & time pending';
    
    const dateStr = meetup.date || 'TBD';
    const timeStr = meetup.time || '';
    
    if (dateStr === 'TBD') return 'Date & time pending';
    
    return `${dateStr}${timeStr ? ` • ${timeStr}` : ''}`;
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-[#be9d80]/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Meetup Name */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[16px] text-neutral-950 truncate">
              {meetup.meetupName}
            </h3>
            {meetup.userRole === 'admin' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-[#be9d80]/10 text-[#8b5943] border-[#be9d80]">
                Admin
              </Badge>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-1.5 text-[13px] text-neutral-600 mb-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{formatDateTime()}</span>
          </div>

          {/* Cafe Name */}
          {meetup.cafeName && (
            <div className="flex items-center gap-1.5 text-[13px] text-neutral-600 mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{meetup.cafeName}</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] border ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{meetup.status}</span>
            </div>
            {meetup.memberCount && (
              <div className="inline-flex items-center gap-1 text-[12px] text-neutral-500">
                <Users className="w-3.5 h-3.5" />
                <span>{meetup.memberCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0 self-center">
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </div>
      </div>
    </Card>
  );
}

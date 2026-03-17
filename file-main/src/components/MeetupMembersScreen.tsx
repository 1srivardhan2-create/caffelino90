import { ArrowLeft, Crown, CheckCircle, Clock, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getAvatarById } from '../utils/avatarData';

interface MeetupMembersScreenProps {
  meetupData: any;
  user: any;
  isAdmin: boolean;
  onBack: () => void;
}

export default function MeetupMembersScreen({ 
  meetupData, 
  user, 
  isAdmin,
  onBack 
}: MeetupMembersScreenProps) {
  // Get members from meetupData
  const members = meetupData?.members || [];
  const adminMember = members.find((m: any) => m.isAdmin);
  const regularMembers = members.filter((m: any) => !m.isAdmin);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
                Group Members
              </h1>
              <p className="text-white/80 text-[13px] font-['Arial:Regular',_sans-serif]">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 py-6 space-y-6">
        {/* Meetup Info Card */}
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold mb-1">
                {meetupData?.groupName || 'Group'}
              </h2>
              <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                {meetupData?.meetupName || 'Meetup'}
              </p>
            </div>
          </div>
        </Card>

        {/* Admin Section */}
        {adminMember && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                Admin
              </h3>
            </div>
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 bg-yellow-600 border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-2xl">
                    {adminMember.avatarEmoji || (adminMember.avatarId ? getAvatarById(adminMember.avatarId)?.emoji : '👑')}
                  </span>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      {adminMember.firstName || adminMember.name}
                    </p>
                    {adminMember.id === user?.id && (
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-[11px] px-2 py-0">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[12px] px-2 py-0.5">
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Members Section */}
        {regularMembers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                Members
              </h3>
              <Badge className="bg-blue-100 text-blue-700 border-0 text-[12px]">
                {regularMembers.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {regularMembers.map((member: any) => (
                <Card key={member.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-blue-600 flex items-center justify-center">
                  <span className="text-2xl">
                    {member.avatarEmoji || (member.avatarId ? getAvatarById(member.avatarId)?.emoji : '👤')}
                  </span>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      {member.firstName || member.name}
                    </p>
                        {member.id === user?.id && (
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-[11px] px-2 py-0">
                            You
                          </Badge>
                        )}
                      </div>
                      <Badge className={`text-[12px] px-2 py-0.5 border ${getStatusColor(member.status)}`}>
                        <span className="mr-1">{getStatusIcon(member.status)}</span>
                        {member.status === 'approved' ? 'Active' : member.status === 'pending' ? 'Pending Approval' : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {regularMembers.length === 0 && (
          <Card className="p-8 text-center bg-slate-50">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-600">
              No members yet
            </p>
            <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-neutral-500 mt-1">
              Invite people to join this group
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

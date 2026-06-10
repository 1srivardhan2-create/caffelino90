import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Check, Link2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import InvitationModal from './InvitationModal';

interface JoinGroupProps {
  onNavigate: (page: string, data?: any) => void;
  user: any;
  groupId?: string;
}

export default function JoinGroup({ onNavigate, user, groupId }: JoinGroupProps) {
  const [joined, setJoined] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(true);

  // Mock group data - in a real app, this would fetch from server using groupId
  const mockGroup = {
    id: groupId || '123abc',
    title: 'Friday Coffee Hangout',
    description: 'Let\'s catch up over coffee and discuss weekend plans',
    cafe: 'Café Milano, Hitech City',
    date: '2025-10-30',
    time: '18:00',
    maxMembers: '6',
    memberCount: 3,
    creator: 'John Doe',
    creatorId: '1',
    tags: ['Coffee', 'Networking'],
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
    isPrivate: true, // Mark as private
    members: [
      {
        id: '1',
        name: 'John Doe',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        verified: true
      },
      {
        id: '2',
        name: 'Sarah Smith',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        verified: true
      },
      {
        id: '3',
        name: 'Mike Johnson',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        verified: false
      }
    ]
  };

  const handleJoin = () => {
    if (!user) {
      toast.error('Please login to join this meetup');
      onNavigate('home');
      return;
    }

    if (mockGroup.memberCount >= parseInt(mockGroup.maxMembers)) {
      toast.error('This meetup is full');
      return;
    }

    // Mock joining
    setJoined(true);
    toast.success('You\'ve joined the meetup!');
  };

  const handleGoToGroup = () => {
    onNavigate('group-detail', mockGroup);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="caffelino-back-btn mb-6"
        >
          ← Back
        </button>

        {joined ? (
          /* Success State */
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-6 rounded-full">
                <Check className="size-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-[32px] leading-[40px] text-neutral-950 mb-2">
              You're In! 🎉
            </h1>
            <p className="text-[16px] text-slate-600">
              Looking forward to seeing you at the meetup
            </p>
          </div>
        ) : (
          /* Join Invitation */
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="size-5 text-indigo-600" />
              <span className="text-[14px] text-slate-600">You've been invited to join</span>
            </div>
            <h1 className="text-[32px] leading-[40px] text-neutral-950 mb-2">
              {mockGroup.title}
            </h1>
            <p className="text-[16px] text-slate-600">
              Organized by {mockGroup.creator}
            </p>
          </div>
        )}

        {/* Group Image */}
        <div className="mb-6 rounded-[16px] overflow-hidden">
          <img
            src={mockGroup.image}
            alt={mockGroup.title}
            className="w-full h-[240px] object-cover"
          />
        </div>

        {/* Group Details Card */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {mockGroup.description && (
              <div>
                <p className="text-[16px] text-slate-700">{mockGroup.description}</p>
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-slate-500">Location</p>
                  <p className="text-[14px] text-neutral-950">{mockGroup.cafe}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-slate-500">Date</p>
                  <p className="text-[14px] text-neutral-950">
                    {new Date(mockGroup.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-slate-500">Time</p>
                  <p className="text-[14px] text-neutral-950">{mockGroup.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-slate-500">Group Size</p>
                  <p className="text-[14px] text-neutral-950">
                    {joined ? mockGroup.memberCount + 1 : mockGroup.memberCount} of {mockGroup.maxMembers} friends
                  </p>
                </div>
              </div>
            </div>

            {mockGroup.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {mockGroup.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Members Card */}
        <Card className="p-6 mb-6">
          <h3 className="text-[18px] leading-[26px] text-neutral-950 mb-4">
            Who's Coming ({joined ? mockGroup.members.length + 1 : mockGroup.members.length})
          </h3>
          <div className="space-y-3">
            {mockGroup.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={member.photo} />
                  <AvatarFallback className="bg-slate-200 text-neutral-950">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-neutral-950">{member.name}</span>
                    {member.verified && (
                      <span className="text-green-600 text-[12px]">✓</span>
                    )}
                    {member.id === mockGroup.creatorId && (
                      <Badge variant="secondary" className="text-[10px] h-5">Organizer</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {joined && (
              <div className="flex items-center gap-3 bg-green-50 p-2 rounded-[8px] border border-green-200">
                <Avatar className="size-10">
                  <AvatarImage src={user?.photo} />
                  <AvatarFallback className="bg-green-200 text-green-800">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-neutral-950">{user?.name} (You)</span>
                    <Badge className="text-[10px] h-5 bg-green-600">Just Joined</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!joined && mockGroup.memberCount >= parseInt(mockGroup.maxMembers) && (
            <div className="mt-4 p-3 bg-amber-50 rounded-[8px] border border-amber-200">
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-900">
                  This meetup is currently full. You can still join the waitlist.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Info Card */}
        {!joined && (
          <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-[14px] text-blue-900">
                <strong>Meetup:</strong> This is a meetup created by {mockGroup.creator}. 
                Only people with this invite link can join.
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {!joined ? (
          <div className="space-y-3">
            <Button
              onClick={handleJoin}
              className="w-full h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
              disabled={mockGroup.memberCount >= parseInt(mockGroup.maxMembers)}
            >
              {mockGroup.memberCount >= parseInt(mockGroup.maxMembers) ? 'Meetup Full' : 'Join This Meetup'}
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              className="w-full h-[44px] rounded-[8px]"
            >
              Maybe Later
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleGoToGroup}
              className="w-full h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
            >
              Go to Meetup Details
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              className="w-full h-[44px] rounded-[8px]"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {showInvitationModal && (
        <InvitationModal
          onClose={() => setShowInvitationModal(false)}
          onAccept={() => {
            setShowInvitationModal(false);
            handleJoin();
            toast.success('Member joined', {
              description: `Welcome to ${mockGroup.title}!`,
            });
          }}
          onDecline={() => {
            setShowInvitationModal(false);
            onNavigate('home');
          }}
          groupData={{
            name: mockGroup.title,
            inviterName: mockGroup.creator,
            memberCount: mockGroup.memberCount,
            scheduledDate: new Date(mockGroup.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })
          }}
        />
      )}
    </div>
  );
}

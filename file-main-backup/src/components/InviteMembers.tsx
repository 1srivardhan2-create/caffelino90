import { useState } from 'react';
import { Search, Plus, X, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface InviteMembersProps {
  onNavigate: (page: string, data?: any) => void;
  groupData: any;
}

const MAX_MEMBERS = 50;

export default function InviteMembers({ onNavigate, groupData }: InviteMembersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const handleAddMember = () => {
    if (emailInput.trim()) {
      if (invitedMembers.includes(emailInput.trim())) {
        toast.error('This member is already invited');
        return;
      }
      if (invitedMembers.length >= MAX_MEMBERS) {
        toast.error(`Maximum ${MAX_MEMBERS} members allowed`);
        return;
      }
      setInvitedMembers([...invitedMembers, emailInput.trim()]);
      setEmailInput('');
      toast.success('Member added to invite list');
    }
  };

  const handleRemoveMember = (email: string) => {
    setInvitedMembers(invitedMembers.filter(m => m !== email));
    toast.success('Member removed from invite list');
  };

  const handleSendInvites = () => {
    if (invitedMembers.length === 0) {
      toast.error('Please add at least one member to invite');
      return;
    }

    // Show success toast for each member
    invitedMembers.forEach((email, index) => {
      setTimeout(() => {
        toast.success('Invitation sent', {
          description: `Invitation sent to ${email}`,
        });
      }, index * 200); // Stagger the notifications
    });

    // Navigate to voting screen with invited members after a short delay
    setTimeout(() => {
      onNavigate('cafe-voting', {
        ...groupData,
        invitedMembers: invitedMembers,
        members: invitedMembers.length + 1 // +1 for admin
      });
    }, invitedMembers.length * 200 + 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigate('cafe-selection', groupData)}
            className="caffelino-back-btn mb-4"
          >
            ← Back
          </button>
          <h1 className="text-[32px] leading-[40px] text-neutral-950 mb-3">
            Invite members
          </h1>
          <p className="text-[16px] text-slate-600">
            Add friends and family to your meetup
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search contacts or enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddMember();
                }
              }}
              className="w-full pl-11 pr-4 h-[48px] rounded-[8px] border-slate-300 focus:ring-2 focus:ring-[#8b5943]"
            />
          </div>
          <Button
            onClick={handleAddMember}
            className="w-full mt-3 h-[44px] bg-slate-700 hover:bg-slate-800 rounded-[8px]"
          >
            Add to Invite List
          </Button>
        </div>

        {/* Avatar Placeholders */}
        <Card className="p-6 mb-6">
          <h3 className="text-[18px] text-neutral-950 mb-4">
            Invited Members ({invitedMembers.length}/{MAX_MEMBERS})
          </h3>
          
          {invitedMembers.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <UserPlus className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-3">No members invited yet</p>
              <button
                onClick={() => document.querySelector('input')?.focus()}
                className="text-[#8b5943] hover:text-[#6d4734] text-sm font-medium underline"
              >
                Add from contacts
              </button>
            </div>
          ) : (
            // Filled State
            <div className="flex flex-wrap gap-4">
              {invitedMembers.map((email, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleRemoveMember(email)}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                    aria-label="Remove member"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  <p className="text-xs text-center mt-2 text-slate-700 max-w-[72px] truncate font-medium">
                    {email.split('@')[0]}
                  </p>
                </div>
              ))}

              {/* Add More Button */}
              {invitedMembers.length < MAX_MEMBERS && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => document.querySelector('input')?.focus()}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    aria-label="Add more members"
                  >
                    <Plus className="w-6 h-6 text-slate-600" />
                  </button>
                  <p className="text-xs text-center mt-2 text-slate-600">
                    Add more
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-amber-50 border-amber-200 mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-900">
                Only invited members can vote and join this meetup.
              </p>
            </div>
          </div>
        </Card>

        {/* Selected Cafés Summary */}
        <Card className="p-4 bg-slate-100 border-slate-200">
          <h3 className="text-[16px] text-neutral-950 mb-3">
            Selected Options ({groupData.cafeOptions?.length || 0})
          </h3>
          <div className="space-y-2">
            {groupData.cafeOptions?.map((cafe: any, index: number) => (
              <div key={cafe.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={cafe.image} 
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-950">{cafe.name}</p>
                  <p className="text-xs text-slate-600">{cafe.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer - Send Invites Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            className="w-full h-[52px] bg-[#030213] hover:bg-[#030213]/90 text-white rounded-[8px] text-[16px]"
            onClick={handleSendInvites}
            disabled={invitedMembers.length === 0}
          >
            {invitedMembers.length === 0 
              ? 'Add members to continue' 
              : `Send Invites (${invitedMembers.length} member${invitedMembers.length > 1 ? 's' : ''})`}
          </Button>
          <p className="text-xs text-center text-slate-500 mt-2">
            {invitedMembers.length > 0 
              ? '✓ Invites will be sent via email' 
              : 'Add at least one member to send invites'}
          </p>
        </div>
      </div>
    </div>
  );
}

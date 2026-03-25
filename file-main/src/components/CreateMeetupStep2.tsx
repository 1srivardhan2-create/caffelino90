import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

import { copyToClipboard } from '../utils/clipboard';
import { saveGroupState } from '../utils/groupStateManager';

interface CreateMeetupStep2Props {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function CreateMeetupStep2({ user, meetupData, onNavigate, onBack }: CreateMeetupStep2Props) {
  const [copied, setCopied] = useState(false);
  
  const inviteLink = `https://caffelino.app/join/${meetupData?.code}`;

  // Smart date formatting - only show year if different from current year
  const formatMeetupDate = (dateString: string) => {
    const meetupDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const meetupYear = meetupDate.getFullYear();
    
    // If same year, don't show year
    if (meetupYear === currentYear) {
      return meetupDate.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    // If different year, show year
    return meetupDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Meetup is already stored in MongoDB via POST /api/meetups/create
  // Save to local groupStateManager so it appears in "Your Meetups"
  useEffect(() => {
    if (meetupData?.code && user?.id) {
      saveGroupState(user.id, {
        groupId: meetupData.code,
        groupName: meetupData.groupName,
        groupCode: meetupData.code,
        meetupDate: meetupData.date,
        meetupTime: meetupData.time,
        currentStage: 'created',
        status: 'Created',
        userRole: 'creator',
        isApproved: true,
        memberCount: 1,
        lastNavigationPage: 'cafe-selection-admin',
        navigationData: meetupData,
      });
      console.log('✅ Group saved to Your Meetups:', meetupData.groupName);
    }
  }, [meetupData, user]);


  const handleCopyCode = async () => {
    const code = meetupData?.code || '';
    
    try {
      await copyToClipboard(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy. Please copy manually: ' + code);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `☕ *You're Invited to a Caffelino Meetup!*\n\n` +
      `🏪 *Cafe:* To be decided\n` +
      `👤 *Hosted by:* ${meetupData?.adminName || 'Admin'}\n\n` +
      `🔑 *Join Code:* ${meetupData?.code}\n\n` +
      `Join our meetup and connect with amazing people!\n\n` +
      `👉 Use this code in the Caffelino app to join.\n\n` +
      `🌐 Visit: https://www.caffelino.in`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNext = () => {
    onNavigate('cafe-selection-admin', meetupData);
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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Invite Members</h1>
          </div>
          {/* Code in top-right corner */}
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white text-[14px] font-['Arial:Regular',_sans-serif] font-medium">
              Code: {meetupData?.code}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="text-center mb-8">
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 2 of 3</p>
            <div className="flex gap-2 justify-center mt-2">
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
            </div>
          </div>

          {/* Meetup Details Summary */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Meetup Details</h2>
            <div className="space-y-2">
              <p className="text-[14px] text-neutral-700">
                <span className="font-medium">Group:</span> {meetupData?.groupName}
              </p>
              <p className="text-[14px] text-neutral-700">
                <span className="font-medium">Date:</span> {formatMeetupDate(meetupData?.date)}
              </p>
              <p className="text-[14px] text-neutral-700">
                <span className="font-medium">Time:</span> {meetupData?.time} IST
              </p>
              <p className="text-[14px] text-neutral-700">
                <span className="font-medium">Admin:</span> {meetupData?.adminName}
              </p>
            </div>
          </div>

          {/* Join Code Section */}
          <div className="bg-white border-2 border-[#8b5943] rounded-lg p-6 text-center">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">Join Code</h2>
            <p className="text-[14px] text-neutral-600 mb-6">Share this code with your friends and family</p>
            
            {/* Code Display */}
            <div className="bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-lg p-8 mb-6">
              <p className="text-[48px] font-['Arial:Regular',_sans-serif] font-bold text-[#8b5943] tracking-wider">
                {meetupData?.code}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 bg-[#030213] hover:bg-[#030213]/90 text-white h-[44px] rounded-lg flex items-center justify-center gap-2 font-['Arial:Regular',_sans-serif] text-[14px] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white h-[44px] rounded-lg flex items-center justify-center gap-2 font-['Arial:Regular',_sans-serif] text-[14px] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share via WhatsApp
              </button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <p className="text-[12px] text-neutral-600 mb-2 font-['Arial:Regular',_sans-serif]">Or share this link:</p>
            <a
              href={inviteLink}
              className="text-[14px] text-[#8b5943] hover:underline break-all font-['Arial:Regular',_sans-serif]"
            >
              {inviteLink}
            </a>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full bg-[#030213] hover:bg-[#030213]/90 text-white h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] transition-colors"
          >
            Next: Select Cafés
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Copy, Share2, ArrowRight, Check, Coffee, Key, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface MeetupCodeProps {
  user: any;
  meetupData: {
    adminName: string;
    date: string;
    time: string;
    adminId: string;
    code?: string;
    meetupCode?: string;
    joinCode?: string;
  };
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function MeetupCode({ user, meetupData, onNavigate, onBack }: MeetupCodeProps) {
  // Use the REAL code from the API (stored in meetupData by CreateMeetupStep1)
  const joinCode = meetupData?.code || meetupData?.meetupCode || meetupData?.joinCode || '';
  const [copied, setCopied] = useState(false);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      toast.success('Join code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleShareWhatsApp = () => {
    const message = `🎉 *Join our Caffélino Meetup!*\\n\\n` +
      `📅 *Date:* ${formatDate(meetupData.date)}\\n` +
      `🕐 *Time:* ${formatTime(meetupData.time)}\\n` +
      `👤 *Organized by:* ${meetupData.adminName}\\n\\n` +
      `🔑 *Join Code:* *${joinCode}*\\n\\n` +
      `Use this code to join our group on Caffélino!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleNext = () => {
    const completeData = {
      ...meetupData,
      joinCode,
    };
    onNavigate('meetup-chat-billing', completeData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#be9d80]" />
            <h1 className="text-gray-900 text-lg font-bold">Create Meetup</h1>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Clean Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Details</span>
          </div>
          <div className="w-8 sm:w-20 h-0.5 bg-green-500"></div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Café</span>
          </div>
          <div className="w-8 sm:w-20 h-0.5 bg-green-500"></div>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#be9d80] text-white flex items-center justify-center font-bold shadow-sm text-sm sm:text-base">
              3
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">Code</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#be9d80] to-[#a88968] rounded-2xl mb-6 shadow-lg">
            <Key className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Your Meetup Code
          </h2>
          <p className="text-gray-600 text-lg">
            Share this code with friends to join your meetup
          </p>
        </div>

        {/* Meetup Details Card */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Meetup Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 min-w-[100px]">Organizer</span>
              <span className="text-sm font-bold text-gray-900">{meetupData.adminName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 min-w-[100px]">Date</span>
              <span className="text-sm text-gray-900">{formatDate(meetupData.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 min-w-[100px]">Time</span>
              <span className="text-sm text-gray-900">{formatTime(meetupData.time)}</span>
            </div>
          </div>
        </div>

        {/* Join Code Display */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#be9d80] to-[#a88968] p-4 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>

            <div className="relative text-center">
              <p className="text-white text-xs sm:text-sm font-semibold mb-3 sm:mb-4 uppercase tracking-wide">Join Code</p>
              <div className="inline-block bg-white px-4 py-4 sm:px-10 sm:py-7 rounded-xl shadow-2xl w-full max-w-[280px] sm:max-w-none">
                <p className="text-2xl sm:text-5xl md:text-6xl font-bold text-[#be9d80] tracking-[0.1em] sm:tracking-[0.25em] font-mono break-all leading-relaxed">
                  {joinCode || '------'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          {/* Copy Code Button */}
          <Button
            onClick={handleCopyCode}
            className={`w-full py-4 text-base font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 ${copied
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Code</span>
              </>
            )}
          </Button>

          {/* Share on WhatsApp Button */}
          <Button
            onClick={handleShareWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 text-base font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share on WhatsApp</span>
          </Button>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-xl">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">How to use this code</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Share this unique code with your friends. They can use it to join your meetup group on Caffélino.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!joinCode}
            className="w-full bg-[#be9d80] hover:bg-[#a88968] text-white py-4 text-base font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Go to Meetup Chat</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          This code will remain visible from the meetup chat interface
        </p>
      </div>
    </div>
  );
}

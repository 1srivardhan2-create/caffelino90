import { XCircle } from 'lucide-react';

interface JoinRequestRejectedProps {
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function JoinRequestRejected({ meetupData, onNavigate }: JoinRequestRejectedProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif] text-center">
            Request Declined
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
              Your Request Was Declined
            </h2>
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              The admin has declined your request to join this meetup
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
              What happened?
            </h3>
            <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif]">
              The admin of <span className="font-bold">{meetupData.groupName}</span> has decided not to accept your join request at this time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => onNavigate('join-with-code')}
              className="w-full bg-[#030213] hover:bg-[#030213]/90 text-white h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] transition-colors"
            >
              Try Another Code
            </button>
            
            <button
              onClick={() => onNavigate('home')}
              className="w-full bg-white border-2 border-neutral-300 hover:bg-neutral-50 text-neutral-700 h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] transition-colors"
            >
              Go Back Home
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-6">
            <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-2">
              Want to create your own meetup?
            </p>
            <button
              onClick={() => onNavigate('create-meetup-step1')}
              className="text-[14px] text-[#8b5943] hover:underline font-['Arial:Regular',_sans-serif]"
            >
              Create a new meetup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

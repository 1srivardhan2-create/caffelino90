import { useState, useEffect } from 'react';
import { Clock, Calendar, Users, Loader2 } from 'lucide-react';

interface JoinRequestWaitingProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

// Global state for join requests (in real app, this would be managed by backend/state management)
const PENDING_REQUESTS: { [meetupCode: string]: any[] } = {};

export default function JoinRequestWaiting({ user, meetupData, onNavigate }: JoinRequestWaitingProps) {
  const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    // Add this user to pending requests
    if (!PENDING_REQUESTS[meetupData.code]) {
      PENDING_REQUESTS[meetupData.code] = [];
    }

    // Check if request already exists
    const existingRequest = PENDING_REQUESTS[meetupData.code].find(
      (r: any) => r.id === meetupData.joiningUserId
    );

    if (!existingRequest) {
      PENDING_REQUESTS[meetupData.code].push({
        id: meetupData.joiningUserId,
        name: meetupData.joiningUserName,
        avatar: meetupData.joiningUserAvatar,
        status: 'pending',
        timestamp: Date.now()
      });
    }

    // Poll for status changes (in real app, this would use WebSocket or similar)
    const pollInterval = setInterval(() => {
      const currentRequest = PENDING_REQUESTS[meetupData.code]?.find(
        (r: any) => r.id === meetupData.joiningUserId
      );

      if (currentRequest) {
        if (currentRequest.status === 'approved') {
          setRequestStatus('approved');
          clearInterval(pollInterval);
          
          // Redirect to group page after 1 second
          setTimeout(() => {
            onNavigate('meetup-group-page', {
              ...meetupData,
              userRole: 'member',
              isLateJoin: meetupData.votingClosed
            });
          }, 1000);
        } else if (currentRequest.status === 'rejected') {
          setRequestStatus('rejected');
          clearInterval(pollInterval);
          
          // Redirect to rejection screen
          setTimeout(() => {
            onNavigate('join-request-rejected', meetupData);
          }, 1000);
        }
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [meetupData, onNavigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif] text-center">
            Join Request
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center mb-8">
            {requestStatus === 'pending' && (
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
              </div>
            )}
            {requestStatus === 'approved' && (
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {requestStatus === 'rejected' && (
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="text-center mb-8">
            {requestStatus === 'pending' && (
              <>
                <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
                  Join Request Sent to Admin
                </h2>
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  Waiting for Admin approval...
                </p>
              </>
            )}
            {requestStatus === 'approved' && (
              <>
                <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-green-600 mb-2">
                  Request Approved!
                </h2>
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  Redirecting to group page...
                </p>
              </>
            )}
            {requestStatus === 'rejected' && (
              <>
                <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-red-600 mb-2">
                  Request Declined
                </h2>
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  Redirecting...
                </p>
              </>
            )}
          </div>

          {/* Meetup Details */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
              Meetup Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#8b5943]" />
                <div>
                  <p className="text-[12px] text-neutral-600">Group Name</p>
                  <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                    {meetupData.groupName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#8b5943]" />
                <div>
                  <p className="text-[12px] text-neutral-600">Date</p>
                  <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                    {new Date(meetupData.date).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#8b5943]" />
                <div>
                  <p className="text-[12px] text-neutral-600">Time</p>
                  <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                    {meetupData.time} IST
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#8b5943]" />
                <div>
                  <p className="text-[12px] text-neutral-600">Admin</p>
                  <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                    {meetupData.adminName}
                  </p>
                </div>
              </div>

              {meetupData.votingClosed && (
                <div className="mt-4 pt-4 border-t border-neutral-300">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-[12px] text-yellow-800 font-['Arial:Regular',_sans-serif]">
                      <span className="font-bold">Note:</span> Voting has ended. You'll join as a member with limited access.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {requestStatus === 'pending' && (
            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-neutral-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-[14px] font-['Arial:Regular',_sans-serif]">
                  Please wait while the admin reviews your request...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export PENDING_REQUESTS so other components can access it
export { PENDING_REQUESTS };

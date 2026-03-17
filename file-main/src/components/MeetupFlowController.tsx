import { useEffect, useState } from 'react';
import { Loader2, Lock, CheckCircle, Coffee } from 'lucide-react';
import { toast } from 'sonner';

interface MeetupFlowControllerProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function MeetupFlowController({ user, meetupData, onNavigate }: MeetupFlowControllerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState('Validating...');

  useEffect(() => {
    const determineMeetupRoute = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Step 1: Validate meetup data
        setCurrentStep('Checking meetup details...');
        await new Promise(resolve => setTimeout(resolve, 600));

        if (!meetupData) {
          setError('Meetup data not found');
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch meetup state
        setCurrentStep('Loading meetup state...');
        await new Promise(resolve => setTimeout(resolve, 800));

        const state = meetupData.state || 'voting_open';
        const userRole = meetupData.userRole || 'member';
        const isVotingOpen = meetupData.votingEnabled && !meetupData.votingClosed;
        const hasAdminStartedOrdering = meetupData.orderingStarted || false;
        const isOrderConfirmed = meetupData.orderConfirmed || false;

        console.log('🔄 Meetup Flow Controller - Routing Decision:', {
          state,
          userRole,
          isVotingOpen,
          hasAdminStartedOrdering,
          isOrderConfirmed,
          votingEnabled: meetupData.votingEnabled,
          votingClosed: meetupData.votingClosed,
          selectedCafes: meetupData.selectedCafes?.length || 0,
          winnerCafe: !!meetupData.winnerCafe
        });

        // Step 3: Route based on meetup state
        setCurrentStep('Determining best route...');
        await new Promise(resolve => setTimeout(resolve, 400));

        // RULE 2a: If voting is OPEN → Show voting screen
        if (isVotingOpen && meetupData.selectedCafes && meetupData.selectedCafes.length > 0) {
          toast.success('📍 Vote for your preferred café!');
          onNavigate('meetup-voting', {
            ...meetupData,
            userRole: 'member',
            isAdmin: false,
            readOnly: false,
            joinedViaCode: true
          });
          return;
        }

        // RULE 2b: If voting is CLOSED but no winner yet → Go to Group Chat
        if (meetupData.votingClosed && !meetupData.winnerCafe) {
          toast.info('⏳ Waiting for voting results...');
          onNavigate('group-chat', {
            ...meetupData,
            userRole: 'member',
            isAdmin: false,
            joinedViaCode: true,
            showWaitingMessage: true,
            waitingFor: 'voting_results'
          });
          return;
        }

        // RULE 2c: If voting is CLOSED and winner café selected → Go to Group Chat
        if (meetupData.votingClosed || meetupData.winnerCafe) {
          // If admin has started ordering → Show Menu in READ-ONLY mode
          if (hasAdminStartedOrdering) {
            toast.info('📋 Viewing menu (read-only mode)');
            onNavigate('group-home', {
              ...meetupData,
              userRole: 'member',
              isAdmin: false,
              readOnlyMenu: true,
              viewOnly: true,
              joinedViaCode: true,
              canViewMenu: true,
              canModifyOrder: false
            });
            return;
          }

          // If order is confirmed → Show Group Chat with bill
          if (isOrderConfirmed) {
            toast.success('✅ Order confirmed! View bill in chat.');
            onNavigate('group-chat', {
              ...meetupData,
              userRole: 'member',
              isAdmin: false,
              joinedViaCode: true,
              showBillSummary: true,
              orderConfirmed: true
            });
            return;
          }

          // Default: Go to Group Chat (waiting for admin to start ordering)
          toast.info('☕ Welcome to the group chat!');
          onNavigate('group-chat', {
            ...meetupData,
            userRole: 'member',
            isAdmin: false,
            joinedViaCode: true,
            showWaitingMessage: true,
            waitingFor: 'admin_ordering'
          });
          return;
        }

        // RULE 3: If ordering has STARTED → Allow VIEW-ONLY menu access
        if (hasAdminStartedOrdering && !isOrderConfirmed) {
          toast.info('📋 Viewing menu (read-only mode)');
          onNavigate('unified-cafe-menu', {
            ...meetupData,
            userRole: 'member',
            isAdmin: false,
            readOnlyMenu: true,
            viewOnly: true,
            joinedViaCode: true,
            canViewMenu: true,
            canModifyOrder: false,
            selectedCafeId: meetupData.winnerCafe?.id || meetupData.selectedCafeId
          });
          return;
        }

        // RULE 5: If order is CONFIRMED → Show bill in Group Chat
        if (isOrderConfirmed) {
          toast.success('✅ Order placed! View details in chat.');
          onNavigate('group-chat', {
            ...meetupData,
            userRole: 'member',
            isAdmin: false,
            joinedViaCode: true,
            showBillSummary: true,
            orderConfirmed: true,
            canViewBill: true
          });
          return;
        }

        // DEFAULT FALLBACK: Go to Group Chat
        console.warn('⚠️ Unknown state, defaulting to Group Chat');
        toast.info('Welcome! Join the conversation.');
        onNavigate('group-chat', {
          ...meetupData,
          userRole: 'member',
          isAdmin: false,
          joinedViaCode: true
        });

      } catch (err) {
        console.error('❌ Error determining meetup route:', err);
        setError('Failed to load meetup. Please try again.');
        
        // Show error for 3 seconds, then redirect to home
        setTimeout(() => {
          toast.error('Failed to load meetup');
          onNavigate('home');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    determineMeetupRoute();
  }, [meetupData, user, onNavigate]);

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-[20px] text-red-900 font-['Arial:Regular',_sans-serif] font-bold mb-2">
              Error Loading Meetup
            </h2>
            <p className="text-[14px] text-red-700 font-['Arial:Regular',_sans-serif] mb-4">
              {error}
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#030213] text-white px-6 py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] hover:bg-[#030213]/90 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif] text-center">
            {meetupData?.groupName || 'Loading Meetup...'}
          </h1>
        </div>
      </div>

      {/* Loading Content */}
      <div className="max-w-[600px] mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Main Loader */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-full flex items-center justify-center">
                <Coffee className="w-12 h-12 text-[#8b5943] animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Loader2 className="w-8 h-8 text-[#8b5943] animate-spin" />
              </div>
            </div>
          </div>

          {/* Loading Message */}
          <div>
            <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
              Setting up your experience...
            </h2>
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              {currentStep}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <div className="space-y-4">
              {/* Step 1: Code Validated */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] font-bold">
                    Code validated
                  </p>
                  <p className="text-[12px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                    Successfully joined meetup
                  </p>
                </div>
              </div>

              {/* Step 2: Joined Meetup */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] font-bold">
                    Added to group
                  </p>
                  <p className="text-[12px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                    You're now a member
                  </p>
                </div>
              </div>

              {/* Step 3: Loading State */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8b5943] rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] text-neutral-700 font-['Arial:Regular',_sans-serif] font-bold">
                    {currentStep}
                  </p>
                  <p className="text-[12px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                    Finding the best route for you
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif] mb-1">
                  <span className="font-bold">Read-only access</span>
                </p>
                <p className="text-[13px] text-blue-800 font-['Arial:Regular',_sans-serif]">
                  You can view menus, orders, and bills, but only the admin can make changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

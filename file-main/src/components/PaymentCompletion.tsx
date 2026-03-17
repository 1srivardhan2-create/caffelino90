import { useEffect } from 'react';
import { CheckCircle, Download, Home } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCompletionProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function PaymentCompletion({ user, meetupData, onNavigate }: PaymentCompletionProps) {
  useEffect(() => {
    // Show success message
    toast.success('All payments completed successfully!');
  }, []);

  const handleViewReceipt = () => {
    onNavigate('digital-receipt', meetupData);
  };

  const handleGoHome = () => {
    onNavigate('meetup-group-page', meetupData);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Success Animation */}
      <div className="max-w-[600px] w-full px-4 py-12 text-center">
        {/* Step Indicator */}
        <div className="mb-8">
          <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 5 of 5</p>
          <div className="flex gap-2 justify-center mt-2">
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
            <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
          </div>
        </div>

        {/* Success Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          {/* Confetti effect (simple) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[48px] animate-bounce">🎉</div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-[32px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
          All Payments Complete!
        </h1>
        <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-8">
          Everyone has successfully paid their share. The meetup payment is now settled!
        </p>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6 mb-8">
          <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[14px] text-neutral-700">Meetup:</span>
              <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.groupName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] text-neutral-700">Total Amount:</span>
              <span className="text-[14px] text-neutral-950 font-medium">₹{meetupData?.billDetails?.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] text-neutral-700">Members:</span>
              <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.members?.length}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#8b5943]/20">
              <span className="text-[14px] text-neutral-700">Status:</span>
              <span className="text-[14px] text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Fully Paid
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleViewReceipt}
            className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            View Digital Receipt
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-white border-2 border-[#8b5943] text-[#8b5943] h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Group
          </button>
        </div>

        {/* Celebration Message */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-[14px] text-yellow-900 font-['Arial:Regular',_sans-serif]">
            🎊 <span className="font-bold">Meetup Complete!</span> All payments are settled. Time to enjoy your next meetup together!
          </p>
        </div>
      </div>
    </div>
  );
}

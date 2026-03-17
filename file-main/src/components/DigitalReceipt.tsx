import { Check, Download, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface DigitalReceiptProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function DigitalReceipt({ user, meetupData, onNavigate, onBack }: DigitalReceiptProps) {
  const userPayment = PAYMENT_STATUS[meetupData?.code]?.[user.id];
  const receiptNumber = `RCP${meetupData?.code}${user.id.slice(0, 4)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleDownload = () => {
    toast.success('Receipt downloaded!');
    // In real app, this would generate and download PDF
  };

  const handleShare = () => {
    const message = `Payment Receipt - Caffélino\n\nMeetup: ${meetupData?.groupName}\nAmount Paid: ₹${userPayment?.amount?.toFixed(2)}\nReceipt #: ${receiptNumber}\n\nThank you for using Caffélino!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Payment Receipt',
        text: message
      }).catch(() => {
        copyToClipboard(message);
        toast.success('Receipt details copied to clipboard!');
      });
    } else {
      copyToClipboard(message);
      toast.success('Receipt details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Digital Receipt</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#8b5943] to-[#d9bf9d] px-8 py-8 text-white">
            <div className="text-center mb-6">
              <h2 className="text-[28px] font-['Arial:Regular',_sans-serif] font-bold mb-2">Caffélino</h2>
              <p className="text-[14px] opacity-90">Find people. Meet. Eat. Connect.</p>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="text-[18px] font-['Arial:Regular',_sans-serif]">Payment Successful</span>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="px-8 py-8">
            {/* Receipt Info */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-neutral-600">Receipt Number</span>
                <span className="text-[12px] text-neutral-950 font-medium">{receiptNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[12px] text-neutral-600">Date</span>
                <span className="text-[12px] text-neutral-950 font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-neutral-600">Payment Time</span>
                <span className="text-[12px] text-neutral-950 font-medium">
                  {userPayment?.paidAt ? new Date(userPayment.paidAt).toLocaleTimeString('en-IN') : 'N/A'}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-neutral-300 my-6"></div>

            {/* Meetup Details */}
            <div className="mb-6">
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Meetup Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Group Name:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Café:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.winnerCafe?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Meetup Code:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.code}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-neutral-300 my-6"></div>

            {/* Payment Details */}
            <div className="mb-6">
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Payment Details</h3>
              <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Paid By:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Total Bill:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">₹{meetupData?.billDetails?.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Total Members:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">{meetupData?.members?.length}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-300">
                  <span className="text-[14px] text-neutral-700">Your Share:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">₹{userPayment?.amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center border-2 border-green-200">
              <p className="text-[14px] text-green-700 mb-2">Amount Paid</p>
              <p className="text-[36px] font-['Arial:Regular',_sans-serif] text-green-700 font-bold">
                ₹{userPayment?.amount?.toFixed(2)}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-[12px] text-green-700 font-medium">Paid Successfully</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[12px] text-neutral-600 mb-2">
                Thank you for using Caffélino!
              </p>
              <p className="text-[10px] text-neutral-500">
                This is a digital receipt. No signature required.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          
          <button
            onClick={handleShare}
            className="w-full bg-white border-2 border-[#8b5943] text-[#8b5943] h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share Receipt
          </button>
        </div>

        {/* Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-[12px] text-blue-900 font-['Arial:Regular',_sans-serif]">
            <span className="font-bold">Note:</span> Keep this receipt for your records. You can access it anytime from the meetup page.
          </p>
        </div>
      </div>
    </div>
  );
}

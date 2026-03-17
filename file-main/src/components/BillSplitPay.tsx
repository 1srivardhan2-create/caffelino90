import { useState } from 'react';
import { ArrowLeft, DollarSign, Plus, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface BillSplitPayProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function BillSplitPay({ user, meetupData, onNavigate, onBack }: BillSplitPayProps) {
  const [billAmount, setBillAmount] = useState('');
  const [tax, setTax] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  // Calculate total
  const billNum = parseFloat(billAmount) || 0;
  const taxNum = parseFloat(tax) || 0;
  const serviceNum = parseFloat(serviceCharge) || 0;
  const totalAmount = billNum + taxNum + serviceNum;

  const handleLockBill = () => {
    if (!billAmount || billNum <= 0) {
      toast.error('Please enter a valid bill amount');
      return;
    }

    // Navigate to split confirmation
    onNavigate('bill-split-confirmation', {
      ...meetupData,
      billDetails: {
        billAmount: billNum,
        tax: taxNum,
        serviceCharge: serviceNum,
        totalAmount: totalAmount,
        locked: true
      }
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <Lock className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
            Admin Only
          </h2>
          <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
            Only the group admin can enter bill details.
          </p>
          <button
            onClick={onBack}
            className="mt-6 bg-[#8b5943] text-white px-6 py-3 rounded-lg hover:bg-[#8b5943]/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Bill Split & Pay</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 1 of 5</p>
            <div className="flex gap-2 justify-center mt-2">
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
            </div>
          </div>

          {/* Bill Overview Card */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#8b5943] rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950">Bill Overview</h2>
                <p className="text-[12px] text-neutral-600">Enter the total bill details</p>
              </div>
            </div>

            {/* Bill Amount */}
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-700 mb-2">
                  Total Bill Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">₹</span>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    placeholder="0"
                    disabled={isLocked}
                    className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent disabled:bg-neutral-100"
                  />
                </div>
              </div>

              {/* Tax */}
              <div>
                <label className="block text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-700 mb-2">
                  Tax (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">₹</span>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    placeholder="0"
                    disabled={isLocked}
                    className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent disabled:bg-neutral-100"
                  />
                </div>
              </div>

              {/* Service Charge */}
              <div>
                <label className="block text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-700 mb-2">
                  Service Charge (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">₹</span>
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    placeholder="0"
                    disabled={isLocked}
                    className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent disabled:bg-neutral-100"
                  />
                </div>
              </div>
            </div>

            {/* Total Display */}
            <div className="mt-6 pt-6 border-t-2 border-[#8b5943]/20">
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium">
                  Final Payable Amount
                </span>
                <span className="text-[24px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif] mb-2">
              <span className="font-bold">Breakdown:</span>
            </p>
            <div className="space-y-1 text-[12px] text-blue-800">
              <div className="flex justify-between">
                <span>Bill Amount:</span>
                <span>₹{billNum.toFixed(2)}</span>
              </div>
              {taxNum > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{taxNum.toFixed(2)}</span>
                </div>
              )}
              {serviceNum > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge:</span>
                  <span>₹{serviceNum.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Lock and Continue Button */}
          <button
            onClick={handleLockBill}
            disabled={!billAmount || billNum <= 0}
            className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Lock Bill & Continue
          </button>

          {/* Info */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Note:</span> Once you lock the bill, it will be divided equally among all members. You won't be able to edit the amounts after locking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

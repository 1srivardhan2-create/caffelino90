import { useState, useEffect } from 'react';
import { ArrowLeft, Users, DollarSign, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface BillSplitConfirmationProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function BillSplitConfirmation({ user, meetupData, onNavigate, onBack }: BillSplitConfirmationProps) {
  const members = meetupData?.members || [];
  const billDetails = meetupData?.billDetails;
  const totalAmount = billDetails?.totalAmount || 0;
  const perPersonAmount = members.length > 0 ? totalAmount / members.length : 0;

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  const handleConfirmSplit = () => {
    // Initialize payment status for all members
    if (!PAYMENT_STATUS[meetupData.code]) {
      PAYMENT_STATUS[meetupData.code] = {};
    }

    members.forEach((member: any) => {
      PAYMENT_STATUS[meetupData.code][member.id] = {
        memberId: member.id,
        memberName: member.name,
        amount: perPersonAmount,
        status: 'pending',
        paidAt: null
      };
    });

    toast.success('Bill split confirmed! Redirecting to payment...');

    // Navigate to appropriate screen
    if (isAdmin) {
      // Admin goes to dashboard to monitor payments
      setTimeout(() => {
        onNavigate('payment-status-dashboard', {
          ...meetupData,
          splitAmount: perPersonAmount
        });
      }, 1000);
    } else {
      // Members go to payment screen
      setTimeout(() => {
        onNavigate('member-payment-screen', {
          ...meetupData,
          splitAmount: perPersonAmount
        });
      }, 1000);
    }
  };

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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Confirm Bill Split</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 2 of 5</p>
            <div className="flex gap-2 justify-center mt-2">
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Bill Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[14px] text-neutral-700">Bill Amount:</span>
                <span className="text-[14px] text-neutral-950 font-medium">₹{billDetails?.billAmount?.toFixed(2)}</span>
              </div>
              {billDetails?.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Tax:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">₹{billDetails?.tax?.toFixed(2)}</span>
                </div>
              )}
              {billDetails?.serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-[14px] text-neutral-700">Service Charge:</span>
                  <span className="text-[14px] text-neutral-950 font-medium">₹{billDetails?.serviceCharge?.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-[#8b5943]/20 flex justify-between">
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">Total Amount:</span>
                <span className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Split Calculation */}
          <div className="bg-white border-2 border-[#8b5943] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8b5943]/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-[#8b5943]" />
              </div>
              <div>
                <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950">Auto Bill Splitting</h3>
                <p className="text-[12px] text-neutral-600">Equally divided among all members</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-lg p-6 text-center mb-4">
              <p className="text-[14px] text-neutral-600 mb-2">Each Person Pays</p>
              <p className="text-[36px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                ₹{perPersonAmount.toFixed(2)}
              </p>
              <p className="text-[12px] text-neutral-600 mt-2">
                {members.length} member{members.length !== 1 ? 's' : ''} × ₹{perPersonAmount.toFixed(2)} = ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white border border-neutral-200 rounded-lg p-4">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">Members ({members.length})</h3>
            <div className="space-y-2">
              {members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8b5943]/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-[#8b5943]" />
                    </div>
                    <span className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                      {member.name}
                      {member.id === user.id && ' (You)'}
                    </span>
                  </div>
                  <span className="text-[14px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-medium">
                    ₹{perPersonAmount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmSplit}
            className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm & Proceed to Payment
          </button>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[12px] text-blue-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Note:</span> After confirmation, each member will be able to pay their share. The bill amount is now locked and cannot be changed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface PaymentMethodChoiceProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function PaymentMethodChoice({ user, meetupData, onNavigate, onBack }: PaymentMethodChoiceProps) {
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'cash' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  
  // Get current user's payment info from PAYMENT_STATUS
  const userPaymentInfo = PAYMENT_STATUS[meetupData?.code]?.[user.id];
  const userAmount = userPaymentInfo?.amount || 0;

  const handleMethodSelect = (method: 'online' | 'cash') => {
    setSelectedMethod(method);
  };

  const handleConfirm = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsConfirming(true);

    // Update payment status with selected method
    if (!PAYMENT_STATUS[meetupData.code]) {
      PAYMENT_STATUS[meetupData.code] = {};
    }

    if (selectedMethod === 'cash') {
      // Mark as cash - pending
      PAYMENT_STATUS[meetupData.code][user.id] = {
        ...userPaymentInfo,
        paymentType: 'cash',
        status: 'pending-cash', // Special status for cash payments
        selectedAt: new Date().toISOString()
      };

      toast.success('Cash payment selected! You can pay at the meetup.', {
        description: 'You can still join the chat and meetup'
      });

      setTimeout(() => {
        // Navigate to payment status dashboard or back to group
        if (isAdmin) {
          onNavigate('payment-status-dashboard', meetupData);
        } else {
          onNavigate('payment-status-dashboard', meetupData);
        }
      }, 1500);
    } else if (selectedMethod === 'online') {
      // Mark as online payment type and proceed to payment gateway
      PAYMENT_STATUS[meetupData.code][user.id] = {
        ...userPaymentInfo,
        paymentType: 'online',
        status: 'pending', // Standard pending status for online payment
        selectedAt: new Date().toISOString()
      };

      toast.success('Proceeding to payment gateway...');

      setTimeout(() => {
        // Navigate to payment gateway
        onNavigate('payment-gateway', {
          ...meetupData,
          paymentAmount: userAmount,
          paymentFor: 'order',
          userId: user.id
        });
      }, 1000);
    }

    setIsConfirming(false);
  };

  if (!userPaymentInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
            Loading payment information...
          </p>
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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Choose Payment Method</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6 text-center">
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-2">
              Your Order Amount
            </p>
            <p className="text-[48px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
              ₹{userAmount.toFixed(2)}
            </p>
            <div className="mt-4 pt-4 border-t border-[#8b5943]/20">
              <p className="text-[12px] text-neutral-600">
                Order: ₹{userPaymentInfo.orderAmount?.toFixed(2) || 0}
                {userPaymentInfo.additionalCharges > 0 && (
                  <> + Additional Charges: ₹{userPaymentInfo.additionalCharges?.toFixed(2) || 0}</>
                )}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Choose how you want to pay:</span>
              <br />
              • <strong>Pay Online:</strong> Complete payment now via UPI/Card/Wallet
              <br />
              • <strong>Pay Cash at Meetup:</strong> Pay when you arrive at the café
            </p>
          </div>

          {/* Payment Method Options */}
          <div className="space-y-4">
            {/* Online Payment Option */}
            <Card
              onClick={() => handleMethodSelect('online')}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedMethod === 'online'
                  ? 'border-2 border-[#8b5943] bg-[#8b5943]/5'
                  : 'border-2 border-neutral-200 hover:border-[#8b5943]/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedMethod === 'online'
                    ? 'bg-[#8b5943] text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      Pay Online
                    </h3>
                    {selectedMethod === 'online' && (
                      <CheckCircle className="w-5 h-5 text-[#8b5943]" />
                    )}
                  </div>
                  <p className="text-[14px] text-neutral-600 mb-3">
                    Complete payment now via UPI, Card, or Wallet
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Secure payment gateway</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Digital receipt</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cash Payment Option */}
            <Card
              onClick={() => handleMethodSelect('cash')}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedMethod === 'cash'
                  ? 'border-2 border-[#8b5943] bg-[#8b5943]/5'
                  : 'border-2 border-neutral-200 hover:border-[#8b5943]/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedMethod === 'cash'
                    ? 'bg-[#8b5943] text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      Pay Cash at Meetup
                    </h3>
                    {selectedMethod === 'cash' && (
                      <CheckCircle className="w-5 h-5 text-[#8b5943]" />
                    )}
                  </div>
                  <p className="text-[14px] text-neutral-600 mb-3">
                    Pay when you arrive at the café
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>No online payment needed</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Pay at your convenience</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Full access to chat & meetup</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-[12px] text-amber-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">📌 Important:</span> Regardless of your payment choice, you can still join the group chat and attend the meetup. Cash payments will be marked as "Pending" until paid at the café.
            </p>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            disabled={!selectedMethod || isConfirming}
            className={`w-full h-[56px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] ${
              !selectedMethod || isConfirming
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-[#8b5943] text-white hover:bg-[#8b5943]/90'
            }`}
          >
            {isConfirming ? (
              'Processing...'
            ) : selectedMethod === 'online' ? (
              'Proceed to Payment Gateway'
            ) : selectedMethod === 'cash' ? (
              'Confirm Cash Payment'
            ) : (
              'Select a Payment Method'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

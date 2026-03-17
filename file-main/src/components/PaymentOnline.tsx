import { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { notifyPaymentSuccess } from '../utils/notificationManager';

interface PaymentOnlineProps {
  user: any;
  meetupData: {
    orderId: string;
    amount: number;
    splitBill: boolean;
    billData: any;
    adminName: string;
    joinCode: string;
    selectedCafe?: any;
    members: any[];
    isTokenPayment?: boolean;
    remainingAmount?: number;
    numberOfPeople?: number;
    orderItems?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
  onNotificationUpdate?: () => void; // Add callback for notification updates
}

export default function PaymentOnline({ user, meetupData, onNavigate, onBack, onNotificationUpdate }: PaymentOnlineProps) {
  const [selectedMethod, setSelectedMethod] = useState<'gpay' | 'phonepe' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsProcessing(false);
    setPaymentSuccess(true);

    toast.success('Payment successful! 🎉');

    // Add notification for online payment
    notifyPaymentSuccess({
      amount: meetupData.amount,
      transactionId: meetupData.orderId,
      paymentMethod: selectedMethod === 'gpay' ? 'Google Pay' : 'PhonePe',
      groupName: `${meetupData.selectedCafe?.name || 'Café'} Meetup`,
      cafeName: meetupData.selectedCafe?.name,
      orderNumber: meetupData.orderId,
      orderItems: meetupData.orderItems,
    });

    // Trigger notification update in App.tsx
    if (onNotificationUpdate) {
      onNotificationUpdate();
    }

    // Redirect back to chat after 2 seconds
    setTimeout(() => {
      // Navigate back to chat with token payment completed status
      onNavigate('meetup-chat-billing-completed', {
        ...meetupData,
        paymentCompleted: meetupData.isTokenPayment ? false : true, // Only mark as fully paid if not token payment
        tokenPaid: meetupData.isTokenPayment ? true : false,
        paymentMethod: selectedMethod,
      });
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {meetupData.isTokenPayment ? 'Token Payment Successful!' : 'Payment Successful!'}
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            ₹{meetupData.amount?.toFixed(2) || '0.00'} paid via {selectedMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}
          </p>
          {meetupData.isTokenPayment && meetupData.remainingAmount && (
            <p className="text-sm text-orange-600 mb-2 font-medium">
              Remaining ₹{meetupData.remainingAmount?.toFixed(2) || '0.00'} to be paid at café counter
            </p>
          )}
          <p className="text-sm text-gray-500 mb-4">
            Order ID: <span className="font-mono font-bold">{meetupData.orderId}</span>
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting to chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5ebe0] to-[#e3d5ca]">
      {/* Header */}
      <div className="bg-[#be9d80] border-b border-[#a88968] sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="text-white hover:text-white/80 transition-colors flex items-center gap-2 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chat
          </button>
          <h1 className="text-white text-2xl font-bold">Complete Payment</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#be9d80]">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#be9d80]" />
            Payment Summary
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-bold text-blue-600">{meetupData.orderId}</span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-600">Café:</span>
              <span className="font-bold">{meetupData.selectedCafe?.name || 'Selected Café'}</span>
            </div>

            {meetupData.splitBill && (
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-600">Split Between:</span>
                <span className="font-bold">{meetupData.members.length} members</span>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Amount to Pay:</span>
                <span className="text-3xl font-bold text-blue-600">₹{meetupData.amount?.toFixed(2) || '0.00'}</span>
              </div>
              {meetupData.splitBill && meetupData.billData && (
                <p className="text-xs text-gray-600 mt-2">
                  Your share of ₹{(meetupData.billData.grandTotal || meetupData.billData.totalWithTax || meetupData.billData.finalPayable || 0).toFixed(2)}
                </p>
              )}
              {meetupData.isTokenPayment && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  🔔 Token Payment Only - Pay remaining at counter
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Select Payment Method</h3>

          <div className="space-y-3">
            {/* Google Pay */}
            <button
              onClick={() => setSelectedMethod('gpay')}
              className={`w-full p-6 rounded-xl border-2 transition-all ${
                selectedMethod === 'gpay'
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  selectedMethod === 'gpay' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                      fill={selectedMethod === 'gpay' ? 'white' : '#4285F4'}
                    />
                    <path
                      d="M15 12h-2v2h-2v-2H9v-2h2V8h2v2h2v2z"
                      fill={selectedMethod === 'gpay' ? 'white' : '#4285F4'}
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-800 text-lg">Google Pay</h4>
                  <p className="text-sm text-gray-600">Fast & secure UPI payment</p>
                </div>
                {selectedMethod === 'gpay' && (
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                )}
              </div>
            </button>

            {/* PhonePe */}
            <button
              onClick={() => setSelectedMethod('phonepe')}
              className={`w-full p-6 rounded-xl border-2 transition-all ${
                selectedMethod === 'phonepe'
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  selectedMethod === 'phonepe' ? 'bg-purple-600' : 'bg-gray-100'
                }`}>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7v10c0 5.52 3.84 10.68 9 12 5.16-1.32 9-6.48 9-12V7l-10-5z"
                      fill={selectedMethod === 'phonepe' ? 'white' : '#5F259F'}
                    />
                    <path
                      d="M12 6L6 9v6c0 3.31 2.3 6.41 5.4 7.2 3.1-.79 5.4-3.89 5.4-7.2V9l-6-3z"
                      fill={selectedMethod === 'phonepe' ? '#A855F7' : 'white'}
                    />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-gray-800 text-lg">PhonePe</h4>
                  <p className="text-sm text-gray-600">Instant UPI payment</p>
                </div>
                {selectedMethod === 'phonepe' && (
                  <CheckCircle className="w-6 h-6 text-purple-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              <span>Pay ₹{meetupData.amount?.toFixed(2) || '0.00'}</span>
            </>
          )}
        </Button>

        {/* Security Info */}
        <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Secure Payment</h4>
              <p className="text-xs text-gray-600">
                Your payment is protected with bank-level encryption. We never store your payment information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

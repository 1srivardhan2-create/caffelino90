import { useState } from 'react';
import { ArrowLeft, Wallet, CreditCard, Smartphone, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethodSelectionProps {
  onNavigate: (page: string, data?: any) => void;
  orderData: any;
  meetupData: any;
  user: any;
}

export default function PaymentMethodSelection({ 
  onNavigate, 
  orderData, 
  meetupData,
  user 
}: PaymentMethodSelectionProps) {
  const [paymentType, setPaymentType] = useState<'cash' | 'online' | null>(null);
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState<'gpay' | 'phonepe' | null>(null);

  const handleCashPayment = () => {
    toast.success('Order confirmed! Pay at the café.');
    
    // Navigate to chat with cash payment method
    onNavigate('group-chat', {
      ...meetupData,
      userOrder: {
        ...orderData,
        paymentMethod: 'cash',
        paymentStatus: 'pending'
      }
    });
  };

  const handleOnlinePayment = (method: 'gpay' | 'phonepe') => {
    setSelectedOnlineMethod(method);
    
    // Simulate payment processing
    setTimeout(() => {
      toast.success(`Payment via ${method === 'gpay' ? 'GPay' : 'PhonePe'} successful!`);
      
      // Navigate to chat with online payment method
      onNavigate('group-chat', {
        ...meetupData,
        userOrder: {
          ...orderData,
          paymentMethod: method,
          paymentStatus: 'paid'
        }
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#be9d80] sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('menu-selection-member', meetupData)}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Arial:Regular',_sans-serif] text-[16px]">Back</span>
          </button>
          <h1 className="font-['Arial:Regular',_sans-serif] text-[18px] text-white">
            Payment Method
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 mb-6">
          <h2 className="font-['Arial:Bold',_sans-serif] text-[18px] text-neutral-950 mb-4">
            Order Summary
          </h2>
          
          {/* Items */}
          <div className="space-y-2 mb-4">
            {orderData.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-[14px]">
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Bill Breakdown */}
          <div className="border-t border-neutral-200 pt-3 space-y-2">
            <div className="flex justify-between text-[14px]">
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">Item Total:</span>
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{orderData.subtotal}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">CGST (2.5%):</span>
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{orderData.cgst}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">SGST (2.5%):</span>
              <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{orderData.sgst}</span>
            </div>
            <div className="flex justify-between text-[20px] font-['Arial:Bold',_sans-serif] pt-2 border-t-2 border-neutral-300">
              <span className="text-neutral-950">Grand Total:</span>
              <span className="text-green-600">₹{orderData.total}</span>
            </div>
          </div>

          {/* Split Bill Info */}
          {meetupData.numberOfPeople > 1 && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[20px]">💰</span>
                <span className="font-['Arial:Bold',_sans-serif] text-[14px] text-amber-900">
                  Split Bill
                </span>
              </div>
              <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-amber-800">
                Each person pays: ₹{(orderData.total / meetupData.numberOfPeople).toFixed(2)}
              </p>
              <p className="font-['Arial:Regular',_sans-serif] text-[12px] text-amber-700">
                Total {meetupData.numberOfPeople} members
              </p>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
          <h3 className="font-['Arial:Bold',_sans-serif] text-[18px] text-neutral-950 mb-4">
            Choose Payment Method:
          </h3>

          {/* Main Payment Type Selection */}
          {!paymentType && (
            <div className="space-y-3">
              {/* Cash Option */}
              <button
                onClick={() => setPaymentType('cash')}
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-300 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-['Arial:Bold',_sans-serif] text-[16px] text-neutral-950">
                      Cash
                    </h4>
                    <p className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-600">
                      Pay at the café
                    </p>
                  </div>
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </button>

              {/* Online Option */}
              <button
                onClick={() => setPaymentType('online')}
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-['Arial:Bold',_sans-serif] text-[16px] text-neutral-950">
                      Online Payment
                    </h4>
                    <p className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-600">
                      Pay now via UPI
                    </p>
                  </div>
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </button>
            </div>
          )}

          {/* Cash Payment Confirmation */}
          {paymentType === 'cash' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <h4 className="font-['Arial:Bold',_sans-serif] text-[16px] text-green-900">
                    Cash Payment Selected
                  </h4>
                </div>
                <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-green-800">
                  You will pay ₹{orderData.total} at the café
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentType(null)}
                  className="flex-1 bg-neutral-200 text-neutral-700 py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-neutral-300 transition-colors"
                >
                  Change
                </button>
                <button
                  onClick={handleCashPayment}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-green-700 transition-colors"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}

          {/* Online Payment Options */}
          {paymentType === 'online' && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <button
                onClick={() => setPaymentType(null)}
                className="mb-3 text-[#be9d80] font-['Arial:Regular',_sans-serif] text-[14px] hover:underline"
              >
                ← Back to payment options
              </button>

              {/* GPay Button */}
              <button
                onClick={() => handleOnlinePayment('gpay')}
                disabled={selectedOnlineMethod !== null}
                className="w-full bg-[#4285F4] hover:bg-[#3574E3] text-white py-4 rounded-xl font-['Arial:Bold',_sans-serif] text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {selectedOnlineMethod === 'gpay' ? 'Processing...' : 'Pay with GPay'}
              </button>

              {/* PhonePe Button */}
              <button
                onClick={() => handleOnlinePayment('phonepe')}
                disabled={selectedOnlineMethod !== null}
                className="w-full bg-[#5f259f] hover:bg-[#4f1f8f] text-white py-4 rounded-xl font-['Arial:Bold',_sans-serif] text-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {selectedOnlineMethod === 'phonepe' ? 'Processing...' : 'Pay with PhonePe'}
              </button>

              <p className="text-center font-['Arial:Regular',_sans-serif] text-[12px] text-neutral-500 mt-3">
                You will be redirected to complete the payment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

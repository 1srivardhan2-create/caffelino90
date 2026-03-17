import { useState } from 'react';
import { CheckCircle, Clock, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface ChatPaymentMessageProps {
  user: any;
  meetupData: any;
  totalAmount: number;
  userAmount: number;
  onNavigate: (page: string, data?: any) => void;
}

export default function ChatPaymentMessage({ 
  user, 
  meetupData, 
  totalAmount, 
  userAmount,
  onNavigate 
}: ChatPaymentMessageProps) {
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'cash' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'split' | 'one-person'>('split');

  // Get current payment status
  const paymentStatus = PAYMENT_STATUS[meetupData.code]?.[user.id];
  const hasSelected = paymentStatus?.paymentType !== undefined;
  const currentMethod = paymentStatus?.paymentType;
  const currentStatus = paymentStatus?.status;

  // Get ordered items from adminOrder
  const orderedItems = meetupData.adminOrder?.items || [];
  const memberCount = meetupData.members?.length || 1;

  // Calculate bill breakdown
  const calculateBillBreakdown = () => {
    const subtotal = orderedItems.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    const cgst = subtotal * 0.05; // 5% CGST
    const sgst = subtotal * 0.05; // 5% SGST
    const totalWithTax = subtotal + cgst + sgst;
    const perPerson = totalWithTax / memberCount;

    return { subtotal, cgst, sgst, totalWithTax, perPerson };
  };

  const { subtotal, cgst, sgst, totalWithTax, perPerson } = calculateBillBreakdown();

  const handlePaymentSelection = async (method: 'online' | 'cash') => {
    setSelectedMethod(method);
    setIsProcessing(true);

    // Calculate amount based on payment mode
    const paymentAmount = paymentMode === 'split' ? perPerson : totalWithTax;

    // Initialize payment status
    if (!PAYMENT_STATUS[meetupData.code]) {
      PAYMENT_STATUS[meetupData.code] = {};
    }

    if (method === 'cash') {
      // Mark as cash payment - no gateway needed
      PAYMENT_STATUS[meetupData.code][user.id] = {
        memberId: user.id,
        memberName: user.name,
        amount: paymentAmount,
        orderAmount: paymentAmount,
        additionalCharges: 0,
        items: meetupData.adminOrder?.items || [],
        status: 'cash-pending',
        paymentType: 'cash',
        selectedAt: new Date().toISOString(),
        paidAt: null,
        paymentMode: paymentMode // Store the payment mode
      };

      setTimeout(() => {
        setIsProcessing(false);
        toast.success('Cash payment selected. You will pay at the meetup!');
      }, 1000);
    } else {
      // Online payment - redirect to gateway
      PAYMENT_STATUS[meetupData.code][user.id] = {
        memberId: user.id,
        memberName: user.name,
        amount: paymentAmount,
        orderAmount: paymentAmount,
        additionalCharges: 0,
        items: meetupData.adminOrder?.items || [],
        status: 'pending',
        paymentType: 'online',
        selectedAt: new Date().toISOString(),
        paidAt: null,
        paymentMode: paymentMode // Store the payment mode
      };

      toast.success('Redirecting to payment gateway...');
      
      setTimeout(() => {
        setIsProcessing(false);
        onNavigate('payment-gateway', meetupData);
      }, 1000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 w-full max-w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-['Arial:Regular',_sans-serif] font-bold text-blue-900">
            Group Order Confirmed
          </p>
          <p className="text-[10px] text-blue-700">
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {/* Order ID Badge */}
        {meetupData.adminOrder?.orderId && (
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full">
            <p className="text-[11px] font-['Arial:Regular',_sans-serif] font-bold">
              {meetupData.adminOrder.orderId}
            </p>
          </div>
        )}
      </div>

      {/* Ordered Items Section */}
      {orderedItems.length > 0 && (
        <div className="bg-white rounded-lg p-3 mb-3">
          <p className="text-[11px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-700 mb-2">
            Order Items:
          </p>
          <div className="space-y-1.5">
            {orderedItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-700">
                    {item.name} × {item.quantity}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-950 font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Tax Breakdown */}
          <div className="mt-3 pt-2 border-t border-neutral-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-neutral-600">Subtotal</span>
              <span className="text-[11px] text-neutral-700">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-neutral-600">CGST (5%)</span>
              <span className="text-[11px] text-neutral-700">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-neutral-600">SGST (5%)</span>
              <span className="text-[11px] text-neutral-700">₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-neutral-300">
              <span className="text-[11px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-950">Total</span>
              <span className="text-[12px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-950">₹{totalWithTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bill Summary with Split */}
      <div className="bg-white rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-neutral-600">Total Bill:</span>
          <span className="text-[16px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-950">
            ₹{totalWithTax.toFixed(2)}
          </span>
        </div>
        
        {/* Payment Mode Toggle */}
        <div className="mb-3 pb-3 border-b border-neutral-200">
          <p className="text-[11px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-700 mb-2">
            Choose Payment Mode:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Split Between Everyone */}
            <button
              onClick={() => setPaymentMode('split')}
              className={`p-2.5 rounded-lg border-2 transition-all ${
                paymentMode === 'split'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMode === 'split' ? 'border-blue-500' : 'border-neutral-300'
                }`}>
                  {paymentMode === 'split' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className={`text-[11px] font-['Arial:Regular',_sans-serif] font-bold ${
                  paymentMode === 'split' ? 'text-blue-900' : 'text-neutral-700'
                }`}>
                  Split Between Everyone
                </span>
              </div>
              <p className={`text-[9px] ${
                paymentMode === 'split' ? 'text-blue-700' : 'text-neutral-500'
              }`}>
                Each person pays their share
              </p>
            </button>

            {/* One Person Pays All */}
            <button
              onClick={() => setPaymentMode('one-person')}
              className={`p-2.5 rounded-lg border-2 transition-all ${
                paymentMode === 'one-person'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMode === 'one-person' ? 'border-orange-500' : 'border-neutral-300'
                }`}>
                  {paymentMode === 'one-person' && (
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  )}
                </div>
                <span className={`text-[11px] font-['Arial:Regular',_sans-serif] font-bold ${
                  paymentMode === 'one-person' ? 'text-orange-900' : 'text-neutral-700'
                }`}>
                  One Person Pays All
                </span>
              </div>
              <p className={`text-[9px] ${
                paymentMode === 'one-person' ? 'text-orange-700' : 'text-neutral-500'
              }`}>
                Treat Mode 🎂
              </p>
            </button>
          </div>
        </div>

        {/* Display amount based on payment mode */}
        {paymentMode === 'split' ? (
          <>
            <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-2">
              <span>Split among {memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              <span>₹{perPerson.toFixed(2)} per person</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <span className="text-[12px] text-neutral-600">Your Amount:</span>
              <span className="text-[18px] font-['Arial:Regular',_sans-serif] font-bold text-[#8b5943]">
                ₹{perPerson.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-[12px] text-neutral-600">You Pay (Full Bill):</span>
            <span className="text-[18px] font-['Arial:Regular',_sans-serif] font-bold text-orange-600">
              ₹{totalWithTax.toFixed(2)}
            </span>
          </div>
        )}
        
        <p className="text-[10px] text-neutral-500 mt-2">
          Please complete your payment below
        </p>
      </div>

      {/* Payment Status or Options */}
      {hasSelected ? (
        // Show current status
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentMethod === 'online' ? (
                <CreditCard className="w-4 h-4 text-green-600" />
              ) : (
                <Banknote className="w-4 h-4 text-orange-600" />
              )}
              <div>
                <p className="text-[12px] font-['Arial:Regular',_sans-serif] font-bold text-neutral-950">
                  {currentMethod === 'online' ? 'Online Payment' : 'Cash Payment'}
                </p>
                <p className="text-[10px] text-neutral-600">
                  {currentStatus === 'paid' && '✅ Paid Successfully'}
                  {currentStatus === 'pending' && '🕒 Payment Pending'}
                  {currentStatus === 'cash-pending' && '🕒 To be paid at meetup'}
                </p>
              </div>
            </div>
            {currentStatus === 'paid' ? (
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                ✅ Paid
              </span>
            ) : currentMethod === 'cash' ? (
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                🕒 Cash Pending
              </span>
            ) : (
              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                🕒 Pending
              </span>
            )}
          </div>
        </div>
      ) : (
        // Show payment options
        <div className="space-y-2">
          <p className="text-[12px] font-['Arial:Regular',_sans-serif] font-bold text-blue-900 mb-2">
            Select Payment Method:
          </p>
          
          {/* Online Payment Button */}
          <button
            onClick={() => handlePaymentSelection('online')}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[13px] font-['Arial:Regular',_sans-serif] font-bold">Pay Online</p>
                <p className="text-[10px] opacity-90">Immediate payment via gateway</p>
              </div>
            </div>
            <span className="text-[14px] font-bold">
              ₹{(paymentMode === 'split' ? perPerson : totalWithTax).toFixed(2)}
            </span>
          </button>

          {/* Cash Payment Button */}
          <button
            onClick={() => handlePaymentSelection('cash')}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              <div className="text-left">
                <p className="text-[13px] font-['Arial:Regular',_sans-serif] font-bold">Pay Cash at Meetup</p>
                <p className="text-[10px] opacity-90">Pay when you arrive at café</p>
              </div>
            </div>
            <span className="text-[14px] font-bold">
              ₹{(paymentMode === 'split' ? perPerson : totalWithTax).toFixed(2)}
            </span>
          </button>

          {isProcessing && (
            <div className="text-center">
              <p className="text-[11px] text-blue-700 animate-pulse">Processing...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

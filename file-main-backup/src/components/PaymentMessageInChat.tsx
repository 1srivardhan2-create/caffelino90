import { useState, useEffect } from 'react';
import { CreditCard, Banknote, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface MemberPaymentInfo {
  memberId: string;
  memberName: string;
  amount: number;
  paymentType: 'online' | 'cash' | null;
  status: 'paid' | 'pending-cash' | 'cash-collected' | 'pending';
  paidAt?: string;
  cashCollectedAt?: string;
}

interface PaymentMessageProps {
  groupCode: string;
  orderNumber: string;
  totalBill: number;
  currentUserId: string;
  currentUserName: string;
  memberOrders: Array<{
    memberId: string;
    memberName: string;
    total: number;
  }>;
}

export default function PaymentMessageInChat({
  groupCode,
  orderNumber,
  totalBill,
  currentUserId,
  currentUserName,
  memberOrders
}: PaymentMessageProps) {
  const [paymentStatuses, setPaymentStatuses] = useState<MemberPaymentInfo[]>([]);
  const [currentUserPayment, setCurrentUserPayment] = useState<MemberPaymentInfo | null>(null);
  const [summary, setSummary] = useState({
    totalBill: 0,
    onlinePaid: 0,
    cashPending: 0,
    cashCollected: 0,
    remainingBalance: 0
  });

  useEffect(() => {
    initializePaymentStatus();
    const interval = setInterval(loadPaymentStatus, 1000); // Real-time updates
    return () => clearInterval(interval);
  }, [groupCode]);

  const initializePaymentStatus = () => {
    // Initialize payment status for all members
    if (!PAYMENT_STATUS[groupCode]) {
      PAYMENT_STATUS[groupCode] = {};
      
      memberOrders.forEach(member => {
        PAYMENT_STATUS[groupCode][member.memberId] = {
          memberId: member.memberId,
          memberName: member.memberName,
          amount: member.total,
          paymentType: null,
          status: 'pending'
        };
      });
    }
    
    loadPaymentStatus();
  };

  const loadPaymentStatus = () => {
    const paymentData = PAYMENT_STATUS[groupCode] || {};
    const statuses = Object.values(paymentData) as MemberPaymentInfo[];
    setPaymentStatuses(statuses);

    // Find current user's payment status
    const userPayment = statuses.find(p => p.memberId === currentUserId);
    setCurrentUserPayment(userPayment || null);

    // Calculate summary
    const onlinePaid = statuses
      .filter(p => p.paymentType === 'online' && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const cashPending = statuses
      .filter(p => p.paymentType === 'cash' && p.status === 'pending-cash')
      .reduce((sum, p) => sum + p.amount, 0);

    const cashCollected = statuses
      .filter(p => p.paymentType === 'cash' && p.status === 'cash-collected')
      .reduce((sum, p) => sum + p.amount, 0);

    const remainingBalance = totalBill - (onlinePaid + cashCollected);

    setSummary({
      totalBill,
      onlinePaid,
      cashPending,
      cashCollected,
      remainingBalance: Math.max(0, remainingBalance)
    });
  };

  const handlePaymentTypeSelection = (type: 'online' | 'cash') => {
    if (!currentUserPayment || currentUserPayment.paymentType) {
      toast.error('Payment type already selected');
      return;
    }

    const paymentData = PAYMENT_STATUS[groupCode];
    if (!paymentData || !paymentData[currentUserId]) return;

    if (type === 'online') {
      // Redirect to payment gateway
      paymentData[currentUserId].paymentType = 'online';
      paymentData[currentUserId].status = 'pending';
      
      toast.success('Redirecting to payment gateway...');
      
      // Simulate payment gateway redirect
      setTimeout(() => {
        // Simulate successful payment
        paymentData[currentUserId].status = 'paid';
        paymentData[currentUserId].paidAt = new Date().toISOString();
        toast.success('Payment successful! ✅');
        loadPaymentStatus();
      }, 2000);
    } else {
      // Cash payment
      paymentData[currentUserId].paymentType = 'cash';
      paymentData[currentUserId].status = 'pending-cash';
      toast.success('Cash payment selected. Pay at the cafe! 💵');
    }

    loadPaymentStatus();
  };

  const isFullyPaid = summary.remainingBalance === 0 && summary.totalBill > 0;

  return (
    <Card className="p-4 border-2 border-[#8b5943] bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#8b5943] text-white size-10 rounded-full flex items-center justify-center">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Group Order Confirmed</h4>
            <p className="text-xs text-slate-600">Order #{orderNumber}</p>
          </div>
        </div>
        <Badge className={isFullyPaid ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}>
          {isFullyPaid ? '✅ Fully Paid' : 'Pending'}
        </Badge>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">Total Bill</p>
            <p className="font-bold text-blue-900">₹{summary.totalBill.toFixed(2)}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600">Online Paid</p>
            <p className="font-bold text-green-900">₹{summary.onlinePaid.toFixed(2)}</p>
          </div>
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-600">Cash Collected</p>
            <p className="font-bold text-emerald-900">₹{summary.cashCollected.toFixed(2)}</p>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-600">Cash Pending</p>
            <p className="font-bold text-amber-900">₹{summary.cashPending.toFixed(2)}</p>
          </div>
        </div>

        <div className={`text-center p-2 rounded-lg ${isFullyPaid ? 'bg-green-100' : 'bg-red-50'}`}>
          <p className={`text-xs ${isFullyPaid ? 'text-green-600' : 'text-red-600'}`}>Remaining Balance</p>
          <p className={`font-bold ${isFullyPaid ? 'text-green-900' : 'text-red-900'}`}>
            ₹{summary.remainingBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Current User Payment Selection */}
      {currentUserPayment && !currentUserPayment.paymentType && (
        <div className="bg-white rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-slate-900 mb-3">
            Your Amount: ₹{currentUserPayment.amount.toFixed(2)}
          </p>
          <p className="text-xs text-slate-600 mb-3">Select your payment method:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handlePaymentTypeSelection('online')}
              className="bg-green-600 hover:bg-green-700 text-white h-[44px]"
            >
              <CreditCard className="size-4 mr-2" />
              Pay Online
            </Button>
            <Button
              onClick={() => handlePaymentTypeSelection('cash')}
              className="bg-[#8b5943] hover:bg-[#8b5943]/90 text-white h-[44px]"
            >
              <Banknote className="size-4 mr-2" />
              Pay Cash
            </Button>
          </div>
        </div>
      )}

      {/* Current User Payment Status */}
      {currentUserPayment && currentUserPayment.paymentType && (
        <div className="bg-white rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentUserPayment.paymentType === 'online' ? (
                <CreditCard className="size-4 text-green-600" />
              ) : (
                <Banknote className="size-4 text-amber-600" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">Your Payment</p>
                <p className="text-xs text-slate-600">₹{currentUserPayment.amount.toFixed(2)}</p>
              </div>
            </div>
            <Badge className={
              currentUserPayment.status === 'paid' || currentUserPayment.status === 'cash-collected'
                ? 'bg-green-500 text-white'
                : 'bg-amber-500 text-white'
            }>
              {currentUserPayment.status === 'paid' && '✅ Paid'}
              {currentUserPayment.status === 'pending-cash' && '🕒 Cash Pending'}
              {currentUserPayment.status === 'cash-collected' && '✅ Cash Collected'}
              {currentUserPayment.status === 'pending' && '⏳ Processing'}
            </Badge>
          </div>
        </div>
      )}

      {/* All Members Payment Status */}
      <div className="bg-white rounded-lg p-3">
        <p className="text-xs font-medium text-slate-700 mb-2">Payment Status ({paymentStatuses.length} members)</p>
        <div className="space-y-1.5">
          {paymentStatuses.map((member) => (
            <div key={member.memberId} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`size-6 rounded-full flex items-center justify-center ${
                  member.status === 'paid' || member.status === 'cash-collected'
                    ? 'bg-green-100'
                    : 'bg-amber-100'
                }`}>
                  {member.paymentType === 'online' ? (
                    <CreditCard className={`size-3 ${member.status === 'paid' ? 'text-green-600' : 'text-blue-600'}`} />
                  ) : member.paymentType === 'cash' ? (
                    <Banknote className={`size-3 ${member.status === 'cash-collected' ? 'text-green-600' : 'text-amber-600'}`} />
                  ) : (
                    <Clock className="size-3 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">{member.memberName}</p>
                  <p className="text-[10px] text-slate-600">₹{member.amount.toFixed(2)}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                {member.status === 'paid' && '✅ Paid'}
                {member.status === 'pending-cash' && '🕒 Cash'}
                {member.status === 'cash-collected' && '✅ Collected'}
                {member.status === 'pending' && '⏳ Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Fully Paid Message */}
      {isFullyPaid && (
        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-900">✅ Payment Completed Successfully</p>
              <p className="text-xs text-green-700">
                Total Bill: ₹{summary.totalBill.toFixed(2)} - Status: Fully Settled
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

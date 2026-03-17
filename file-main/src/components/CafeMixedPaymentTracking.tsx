import { useState, useEffect } from 'react';
import { Clock, CreditCard, Banknote, Users, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';
import { safeStorage } from '../utils/safeStorage';

interface Order {
  orderNumber: string;
  meetupName: string;
  groupName: string;
  groupCode: string;
  totalMembers: number;
  totalBill: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed';
  orderDate: string;
  items: any[];
}

interface MemberPaymentInfo {
  memberId: string;
  memberName: string;
  amount: number;
  paymentType: 'online' | 'cash';
  status: 'paid' | 'pending-cash' | 'cash-collected' | 'pending';
  paidAt?: string;
  cashCollectedAt?: string;
}

interface PaymentSummary {
  totalBill: number;
  onlinePaid: number;
  cashPending: number;
  cashCollected: number;
  remainingBalance: number;
  settlementStatus: 'partial' | 'fully-paid';
}

export default function CafeMixedPaymentTracking({ isOnline }: { isOnline: boolean }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCashCollectionDialog, setShowCashCollectionDialog] = useState(false);
  const [memberPayments, setMemberPayments] = useState<MemberPaymentInfo[]>([]);
  const [cashAmounts, setCashAmounts] = useState<{ [memberId: string]: string }>({});

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
    // Only show orders that have billing confirmed
    const ordersWithBilling = storedOrders.filter((order: any) => 
      order.status !== 'rejected' && order.groupCode
    );
    
    // Map orders to match interface (convert totalAmount to totalBill)
    const mappedOrders = ordersWithBilling.map((order: any) => ({
      ...order,
      totalBill: order.totalAmount || order.totalBill || 0,
      totalMembers: order.memberCount || order.totalMembers || 0
    }));
    
    setOrders(mappedOrders);
  };

  const getPaymentSummary = (order: Order): PaymentSummary => {
    const paymentData = PAYMENT_STATUS[order.groupCode] || {};
    const members = Object.values(paymentData) as MemberPaymentInfo[];

    const onlinePaid = members
      .filter(m => m.paymentType === 'online' && m.status === 'paid')
      .reduce((sum, m) => sum + m.amount, 0);

    const cashPending = members
      .filter(m => m.paymentType === 'cash' && m.status === 'pending-cash')
      .reduce((sum, m) => sum + m.amount, 0);

    const cashCollected = members
      .filter(m => m.paymentType === 'cash' && m.status === 'cash-collected')
      .reduce((sum, m) => sum + m.amount, 0);

    const remainingBalance = order.totalBill - (onlinePaid + cashCollected);
    const settlementStatus = remainingBalance <= 0 ? 'fully-paid' : 'partial';

    return {
      totalBill: order.totalBill,
      onlinePaid,
      cashPending,
      cashCollected,
      remainingBalance: Math.max(0, remainingBalance),
      settlementStatus
    };
  };

  const getMemberPayments = (order: Order): MemberPaymentInfo[] => {
    const paymentData = PAYMENT_STATUS[order.groupCode] || {};
    return Object.values(paymentData) as MemberPaymentInfo[];
  };

  const handleOpenCashCollection = (order: Order) => {
    setSelectedOrder(order);
    const members = getMemberPayments(order);
    setMemberPayments(members);
    
    // Initialize cash amounts with pending cash amounts
    const initialAmounts: { [key: string]: string } = {};
    members
      .filter(m => m.paymentType === 'cash' && m.status === 'pending-cash')
      .forEach(m => {
        initialAmounts[m.memberId] = m.amount.toFixed(2);
      });
    setCashAmounts(initialAmounts);
    
    setShowCashCollectionDialog(true);
  };

  const handleMarkCashCollected = () => {
    if (!selectedOrder) return;

    const paymentData = PAYMENT_STATUS[selectedOrder.groupCode];
    if (!paymentData) return;

    let totalCollected = 0;
    let updatedCount = 0;

    // Update each member's cash collection status
    Object.keys(cashAmounts).forEach(memberId => {
      const amount = parseFloat(cashAmounts[memberId] || '0');
      if (amount > 0 && paymentData[memberId]) {
        paymentData[memberId].status = 'cash-collected';
        paymentData[memberId].cashCollectedAt = new Date().toISOString();
        totalCollected += amount;
        updatedCount++;
      }
    });

    toast.success(`Cash collected from ${updatedCount} member${updatedCount !== 1 ? 's' : ''}: ₹${totalCollected.toFixed(2)}`);
    
    setShowCashCollectionDialog(false);
    setSelectedOrder(null);
    setCashAmounts({});
    loadOrders();
  };

  const handleCashAmountChange = (memberId: string, value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCashAmounts(prev => ({
        ...prev,
        [memberId]: value
      }));
    }
  };

  if (!isOnline) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-slate-200 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="size-10 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">You're Offline</h3>
          <p className="text-slate-600 text-sm">
            Turn on online status to view payment tracking
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-blue-100 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="size-10 text-blue-600" />
          </div>
          <h3 className="text-slate-900 mb-2">No Orders Yet</h3>
          <p className="text-slate-600 text-sm">
            Payment tracking will appear here when orders are placed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-[24px] text-neutral-950 font-['Arial:Regular',_sans-serif] mb-2">
          Mixed Payment Tracking
        </h2>
        <p className="text-[14px] text-neutral-600">
          Track online and cash payments for each group order
        </p>
      </div>

      {orders.map((order) => {
        const summary = getPaymentSummary(order);
        const members = getMemberPayments(order);
        const hasCashPending = summary.cashPending > 0;

        return (
          <Card key={order.orderNumber} className="p-6 border-2 border-slate-200">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#8b5943] text-white px-3 py-1 rounded-full">
                    <span className="text-[11px] font-['Arial:Regular',_sans-serif] font-bold">
                      Order ID: {order.orderNumber}
                    </span>
                  </div>
                  <Badge className={
                    summary.settlementStatus === 'fully-paid' 
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-500 text-white'
                  }>
                    {summary.settlementStatus === 'fully-paid' ? '✅ Fully Paid' : 'Partial Paid'}
                  </Badge>
                </div>
                <h3 className="text-[20px] text-neutral-950 font-['Arial:Regular',_sans-serif] mb-1">
                  {order.groupName}
                </h3>
                <p className="text-[14px] text-neutral-600">{order.meetupName}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-neutral-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-[14px]">{order.totalMembers} members</span>
                </div>
                <div className="text-[12px] text-neutral-500">{order.orderDate}</div>
              </div>
            </div>

            {/* Payment Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {/* Total Bill */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-[12px] text-blue-700">Total Bill</span>
                </div>
                <p className="text-[24px] text-blue-900 font-bold">
                  ₹{summary.totalBill.toFixed(2)}
                </p>
              </div>

              {/* Online Paid */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="text-[12px] text-green-700">Online Paid</span>
                </div>
                <p className="text-[24px] text-green-900 font-bold">
                  ₹{summary.onlinePaid.toFixed(2)}
                </p>
              </div>

              {/* Cash Collected */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-[12px] text-emerald-700">Cash Collected</span>
                </div>
                <p className="text-[24px] text-emerald-900 font-bold">
                  ₹{summary.cashCollected.toFixed(2)}
                </p>
              </div>

              {/* Cash Pending */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span className="text-[12px] text-amber-700">Cash Pending</span>
                </div>
                <p className="text-[24px] text-amber-900 font-bold">
                  ₹{summary.cashPending.toFixed(2)}
                </p>
              </div>

              {/* Remaining Balance */}
              <div className={`bg-gradient-to-br rounded-lg p-4 ${
                summary.remainingBalance === 0 
                  ? 'from-green-50 to-green-100' 
                  : 'from-red-50 to-red-100'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 ${
                    summary.remainingBalance === 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-[12px] ${
                    summary.remainingBalance === 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Balance
                  </span>
                </div>
                <p className={`text-[24px] font-bold ${
                  summary.remainingBalance === 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  ₹{summary.remainingBalance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Member Payment Details */}
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="text-[14px] text-neutral-950 font-medium mb-3">Member Payments</h4>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.memberId} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        member.status === 'paid' || member.status === 'cash-collected'
                          ? 'bg-green-100'
                          : 'bg-amber-100'
                      }`}>
                        {member.paymentType === 'online' ? (
                          <CreditCard className={`w-4 h-4 ${
                            member.status === 'paid' ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        ) : (
                          <Banknote className={`w-4 h-4 ${
                            member.status === 'cash-collected' ? 'text-green-600' : 'text-amber-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] text-neutral-950 font-medium">
                          {member.memberName}
                        </p>
                        <p className="text-[12px] text-neutral-600">
                          ₹{member.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {member.paymentType === 'online' && member.status === 'paid' && (
                        <Badge className="bg-green-500 text-white text-[11px]">
                          ✅ Online - Paid
                        </Badge>
                      )}
                      {member.paymentType === 'cash' && member.status === 'cash-collected' && (
                        <Badge className="bg-emerald-500 text-white text-[11px]">
                          ✅ Cash - Collected
                        </Badge>
                      )}
                      {member.paymentType === 'cash' && member.status === 'pending-cash' && (
                        <Badge className="bg-amber-500 text-white text-[11px]">
                          🕒 Cash - Pending
                        </Badge>
                      )}
                      {member.status === 'pending' && (
                        <Badge variant="outline" className="text-[11px]">
                          ⏳ Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Collection Button */}
            {hasCashPending && (
              <Button
                onClick={() => handleOpenCashCollection(order)}
                className="w-full bg-[#8b5943] hover:bg-[#8b5943]/90 text-white h-[48px] rounded-lg text-[16px]"
              >
                <Banknote className="w-5 h-5 mr-2" />
                Mark Cash as Collected
              </Button>
            )}

            {/* Final Settlement Summary */}
            {summary.settlementStatus === 'fully-paid' && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[16px] text-green-900 font-bold">✅ Fully Settled</h4>
                    <p className="text-[12px] text-green-700">
                      Online: ₹{summary.onlinePaid.toFixed(2)} + Cash: ₹{summary.cashCollected.toFixed(2)} = ₹{summary.totalBill.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Cash Collection Dialog */}
      {showCashCollectionDialog && selectedOrder && (
        <Dialog open={showCashCollectionDialog} onOpenChange={setShowCashCollectionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Cash as Collected</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[12px] text-blue-900">
                  <span className="font-bold">Order:</span> {selectedOrder.orderNumber}
                  <br />
                  <span className="font-bold">Group:</span> {selectedOrder.groupName}
                </p>
              </div>

              <div className="space-y-3">
                {memberPayments
                  .filter(m => m.paymentType === 'cash' && m.status === 'pending-cash')
                  .map((member) => (
                    <div key={member.memberId} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-[14px] text-neutral-950 font-medium">
                            {member.memberName}
                          </p>
                          <p className="text-[12px] text-neutral-600">
                            Expected: ₹{member.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] text-neutral-600 mb-1 block">
                          Amount Collected (₹)
                        </label>
                        <input
                          type="text"
                          value={cashAmounts[member.memberId] || ''}
                          onChange={(e) => handleCashAmountChange(member.memberId, e.target.value)}
                          placeholder="0.00"
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#8b5943]"
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCashCollectionDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMarkCashCollected}
                  className="flex-1 bg-[#8b5943] hover:bg-[#8b5943]/90 text-white"
                  disabled={Object.keys(cashAmounts).length === 0}
                >
                  Confirm Collection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

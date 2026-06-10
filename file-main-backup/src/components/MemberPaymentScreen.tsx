import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Wallet, Smartphone, Check, Clock, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { generateUniqueOrderId, storeCompletedOrder } from '../utils/orderIdGenerator';
import PaymentSuccessScreen from './PaymentSuccessScreen';

interface MemberPaymentScreenProps {
  orderNumber: string;
  orderData: {
    meetupName: string;
    groupName: string;
    groupId?: string;
    totalAmount: number;
    memberCount: number;
    items: any[];
    cafeName?: string;
    orderDate?: string;
  };
  currentMember: {
    id: string;
    name: string;
    isAdmin: boolean;
  };
  onNavigate: (page: string) => void;
}

interface MemberPaymentStatus {
  memberId: string;
  memberName: string;
  amount: number;
  status: 'pending' | 'paid';
  paidAt?: string;
  paymentMethod?: string;
}

export default function MemberPaymentScreen({ 
  orderNumber, 
  orderData, 
  currentMember,
  onNavigate 
}: MemberPaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card' | 'cash' | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<MemberPaymentStatus[]>([]);
  const [myPaymentStatus, setMyPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    loadPaymentStatuses();
    const interval = setInterval(loadPaymentStatuses, 2000); // Real-time sync every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPaymentStatuses = () => {
    const storageKey = `payment_status_${orderNumber}`;
    const statuses = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // If no statuses exist, initialize with mock members
    if (statuses.length === 0) {
      const perPersonAmount = Math.ceil(orderData.totalAmount / orderData.memberCount);
      const mockMembers = [
        { memberId: currentMember.id, memberName: currentMember.name, amount: perPersonAmount, status: 'pending' },
        { memberId: '2', memberName: 'Priya Sharma', amount: perPersonAmount, status: 'pending' },
        { memberId: '3', memberName: 'Rahul Kumar', amount: perPersonAmount, status: 'pending' },
        { memberId: '4', memberName: 'Ananya Patel', amount: perPersonAmount, status: 'pending' },
      ].slice(0, orderData.memberCount);
      
      localStorage.setItem(storageKey, JSON.stringify(mockMembers));
      setPaymentStatuses(mockMembers as any);
    } else {
      setPaymentStatuses(statuses);
    }

    // Check current member's payment status
    const myStatus = statuses.find((s: any) => s.memberId === currentMember.id);
    if (myStatus) {
      setMyPaymentStatus(myStatus.status);
    }

    // Check if all paid and update order status
    if (statuses.length > 0 && statuses.every((s: any) => s.status === 'paid')) {
      updateOrderPaymentStatus('completed');
    }
  };

  const updateOrderPaymentStatus = (status: string) => {
    const orders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
    const updatedOrders = orders.map((order: any) =>
      order.orderNumber === orderNumber
        ? { ...order, paymentStatus: status, allMembersPaid: true }
        : order
    );
    localStorage.setItem('cafeOrders', JSON.stringify(updatedOrders));
  };

  const handlePaymentMethodSelect = (method: 'upi' | 'wallet' | 'card' | 'cash') => {
    setPaymentMethod(method);
    setShowPaymentMethods(false);
    processPayment(method);
  };

  const processPayment = async (method: 'upi' | 'wallet' | 'card' | 'cash') => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update payment status
    const storageKey = `payment_status_${orderNumber}`;
    const statuses = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedStatuses = statuses.map((s: any) =>
      s.memberId === currentMember.id
        ? {
            ...s,
            status: 'paid',
            paidAt: new Date().toISOString(),
            paymentMethod: method.toUpperCase()
          }
        : s
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedStatuses));

    setIsProcessing(false);
    setMyPaymentStatus('paid');
    toast.success('Payment successful! ✅');
    loadPaymentStatuses();

    // Generate and store order ID
    const orderId = generateUniqueOrderId();
    const myPayment = updatedStatuses.find((s: any) => s.memberId === currentMember.id);
    
    storeCompletedOrder({
      orderId,
      cafeOrderNumber: orderNumber,
      groupId: orderData.groupId || 'group-1',
      groupName: orderData.groupName,
      meetupName: orderData.meetupName,
      userId: currentMember.id,
      userName: currentMember.name,
      totalAmount: orderData.totalAmount,
      userAmount: myPayment?.amount || myAmount,
      paymentMethod: method.toUpperCase(),
      cafeName: orderData.cafeName || 'The Coffee House',
      orderDate: orderData.orderDate || new Date().toLocaleDateString('en-IN'),
      completedAt: new Date().toISOString(),
      items: orderData.items,
    });

    setGeneratedOrderId(orderId);

    // Show success screen
    setTimeout(() => {
      setShowSuccessScreen(true);
    }, 500);
  };

  const myAmount = paymentStatuses.find(s => s.memberId === currentMember.id)?.amount || 
    Math.ceil(orderData.totalAmount / orderData.memberCount);

  const paidCount = paymentStatuses.filter(s => s.status === 'paid').length;
  const pendingCount = paymentStatuses.filter(s => s.status === 'pending').length;
  const allPaid = pendingCount === 0 && paymentStatuses.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-[#be9d80] text-white px-4 py-3 border-b border-[#a88968]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('group-home')} 
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">Split Payment</h2>
            <p className="text-sm text-white/80">{orderNumber}</p>
          </div>
          {allPaid && (
            <Badge className="bg-green-500 text-white">
              <Check className="size-3 mr-1" />
              All Paid
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Order Summary */}
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-1">Order Summary</div>
          <h3 className="text-white mb-2">{orderData.meetupName}</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Bill</div>
              <div className="text-2xl">₹{orderData.totalAmount}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Split Equally</div>
              <div className="flex items-center gap-1">
                <Users className="size-4" />
                <span>{orderData.memberCount} members</span>
              </div>
            </div>
          </div>
        </Card>

        {/* My Payment Amount */}
        <Card className={`p-6 ${myPaymentStatus === 'paid' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="text-center">
            <div className={`text-sm mb-2 ${myPaymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>
              Your Share
            </div>
            <div className={`text-4xl mb-2 ${myPaymentStatus === 'paid' ? 'text-green-900' : 'text-orange-900'}`}>
              ₹{myAmount}
            </div>
            {myPaymentStatus === 'paid' ? (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Check className="size-5" />
                <span>Payment Completed</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-orange-700">
                <Clock className="size-5" />
                <span>Payment Pending</span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-900">Payment Status</h3>
            <Badge className={allPaid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {paidCount}/{paymentStatuses.length} Paid
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(paidCount / paymentStatuses.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Member List */}
          <div className="space-y-2">
            {paymentStatuses.map((member) => (
              <div 
                key={member.memberId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  member.status === 'paid' ? 'bg-green-50' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center ${
                    member.status === 'paid' ? 'bg-green-500' : 'bg-slate-300'
                  }`}>
                    {member.status === 'paid' ? (
                      <Check className="size-4 text-white" />
                    ) : (
                      <Clock className="size-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-slate-900">
                      {member.memberName}
                      {member.memberId === currentMember.id && ' (You)'}
                    </div>
                    {member.status === 'paid' && member.paymentMethod && (
                      <div className="text-xs text-green-700">
                        Paid via {member.paymentMethod}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${member.status === 'paid' ? 'text-green-900' : 'text-slate-900'}`}>
                    ₹{member.amount}
                  </div>
                  {member.status === 'paid' ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">Paid ✓</Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Methods */}
        {myPaymentStatus === 'pending' && !isProcessing && (
          <Card className="p-4 space-y-3">
            <h3 className="text-slate-900">Choose Payment Method</h3>
            
            {/* UPI Payment */}
            <Button
              onClick={() => handlePaymentMethodSelect('upi')}
              className="w-full justify-start bg-white text-slate-900 border-2 border-slate-200 hover:border-[#8b5943] hover:bg-slate-50"
            >
              <Smartphone className="size-5 mr-3 text-[#8b5943]" />
              <div className="flex-1 text-left">
                <div>Pay Online (UPI)</div>
                <div className="text-xs text-slate-600">Fast & Secure Payment</div>
              </div>
            </Button>

            {/* Cash Payment */}
            <Button
              onClick={() => handlePaymentMethodSelect('cash')}
              className="w-full justify-start bg-white text-slate-900 border-2 border-slate-200 hover:border-[#8b5943] hover:bg-slate-50"
            >
              <Wallet className="size-5 mr-3 text-[#8b5943]" />
              <div className="flex-1 text-left">
                <div>Pay Cash at Meetup</div>
                <div className="text-xs text-slate-600">Pay directly at the café</div>
              </div>
            </Button>
          </Card>
        )}

        {/* Processing */}
        {isProcessing && (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin size-12 border-4 border-[#8b5943] border-t-transparent rounded-full mx-auto" />
              <p className="text-slate-600">Processing payment...</p>
            </div>
          </Card>
        )}

        {/* All Paid Success */}
        {allPaid && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-green-900">All Payments Completed!</h4>
                <p className="text-sm text-green-700">
                  Order {orderNumber} has been fully paid
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Admin View - Mark as Completed */}
        {currentMember.isAdmin && allPaid && (
          <Button
            onClick={() => {
              updateOrderPaymentStatus('completed');
              toast.success('Payment marked as completed! ✅');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Check className="size-4 mr-2" />
            Confirm All Payments Received
          </Button>
        )}
      </div>

      {/* Payment Success Screen */}
      {showSuccessScreen && (
        <PaymentSuccessScreen
          orderId={generatedOrderId!}
          orderData={orderData}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

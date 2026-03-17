import { useState, useEffect } from 'react';
import { ArrowLeft, Receipt, Users, IndianRupee, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { meetupMemberDB, orderDB, paymentDB } from '../utils/database';

interface MemberBillingScreenProps {
  onNavigate: (page: string, data?: any) => void;
  meetupData: any;
  userOrders: any[];
  user: any;
}

export default function MemberBillingScreen({ 
  onNavigate, 
  meetupData, 
  userOrders,
  user 
}: MemberBillingScreenProps) {
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  // Add null safety check
  if (!meetupData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-['Arial:Regular',_sans-serif] text-[20px] text-neutral-950 mb-2">
            No Meetup Data
          </h2>
          <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600 mb-4">
            Unable to load billing information
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#be9d80] text-white px-6 py-3 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-[#a88a6f] transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      // Fetch all members from localStorage
      const membersResponse = await meetupMemberDB.getByMeetup(meetupData.meetupId);
      const members = membersResponse.data || [];
      setAllMembers(members);

      // Fetch all orders for this meetup from localStorage
      const ordersResponse = await orderDB.getByMeetup(meetupData.meetupId);
      const orders = ordersResponse.data || [];
      setAllOrders(orders);
      
      // Calculate total bill from all orders
      const totalBill = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      
      // Fetch payment info from localStorage
      const paymentsResponse = await paymentDB.getByMeetup(meetupData.meetupId);
      const payments = paymentsResponse.data || [];
      let payment = payments[0]; // Get first payment record

      // If no payment exists, create one
      if (!payment) {
        const newPayment = {
          id: `payment-${meetupData.meetupId}-${Date.now()}`,
          meetup_id: meetupData.meetupId,
          payment_type: 'individual' as const,
          payer_user_id: user.id,
          payer_name: user.name,
          total_bill: totalBill,
          amount_per_person: members.length > 0 ? totalBill / members.length : totalBill,
          paymentMethod: 'online' as const,
          paymentStatus: 'pending' as const,
          createdAt: new Date().toISOString(),
        };

        await paymentDB.save(newPayment);
        payment = newPayment;
      }

      setBillingInfo(payment);
    } catch (error) {
      console.error('Error fetching billing info:', error);
      toast.error('Failed to load billing information');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTotal = () => {
    return userOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const handleProceedToChat = () => {
    onNavigate('group-chat', {
      ...meetupData,
      billingInfo,
      isAdmin: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#be9d80] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-600">
            Loading billing information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
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
            Order Summary
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Meetup Info */}
        <div className="bg-white rounded-[12px] p-4 shadow-sm border border-neutral-200">
          <h2 className="font-['Arial:Regular',_sans-serif] text-[20px] text-neutral-950 mb-1">
            {meetupData.meetupName}
          </h2>
          <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600">
            📍 {meetupData.cafeName}
          </p>
        </div>

        {/* Read-Only Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4">
          <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-blue-900">
            <span className="font-bold">ℹ️ Note:</span> This is a read-only view. Only the host/admin can modify payment settings.
          </p>
        </div>

        {/* Your Order */}
        <div className="bg-white rounded-[12px] p-4 shadow-sm border border-neutral-200">
          <h3 className="font-['Arial:Regular',_sans-serif] text-[18px] text-neutral-950 mb-3 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#be9d80]" />
            Your Order
          </h3>
          <div className="space-y-2">
            {userOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="font-['Arial:Regular',_sans-serif] text-[15px] text-neutral-950">
                    {order.item_name}
                  </p>
                  <p className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-600">
                    Qty: {order.quantity} × ₹{order.price}
                  </p>
                </div>
                <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950">
                  ₹{order.total}
                </p>
              </div>
            ))}
            <div className="pt-2 border-t-2 border-neutral-200">
              <div className="flex justify-between items-center">
                <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950 font-bold">
                  Your Total
                </p>
                <p className="font-['Arial:Regular',_sans-serif] text-[18px] text-[#be9d80] font-bold">
                  ₹{getUserTotal()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Bill & Payment Info */}
        {billingInfo && (
          <div className="bg-white rounded-[12px] p-4 shadow-sm border border-neutral-200">
            <h3 className="font-['Arial:Regular',_sans-serif] text-[18px] text-neutral-950 mb-3 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#be9d80]" />
              Billing Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <p className="font-['Arial:Regular',_sans-serif] text-[15px] text-neutral-600">
                  Total Bill (All Members)
                </p>
                <p className="font-['Arial:Regular',_sans-serif] text-[18px] text-neutral-950 font-bold">
                  ₹{billingInfo.total_bill}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 bg-amber-50 px-3 rounded-[8px]">
                <p className="font-['Arial:Regular',_sans-serif] text-[15px] text-amber-900">
                  Payment Mode
                </p>
                <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-amber-900 font-bold capitalize">
                  {billingInfo.payment_type === 'split' ? 'Split Equally' : 'Single Payer'}
                </p>
              </div>
              {billingInfo.payment_type === 'split' && (
                <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-[8px]">
                  <p className="font-['Arial:Regular',_sans-serif] text-[15px] text-green-900">
                    Amount Per Person
                  </p>
                  <p className="font-['Arial:Regular',_sans-serif] text-[18px] text-green-900 font-bold">
                    ₹{Math.round(billingInfo.amount_per_person)}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <p className="font-['Arial:Regular',_sans-serif] text-[15px] text-neutral-600 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Total Members
                </p>
                <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950">
                  {allMembers.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proceed to Chat Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t-2 border-neutral-200 -mx-4">
          <button
            onClick={handleProceedToChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[16px] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Proceed to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

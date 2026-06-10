import { useState, useEffect } from 'react';
import { ArrowLeft, Users, ShoppingCart, CheckCircle, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface OrderSummaryProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function OrderSummary({ user, meetupData, onNavigate, onBack }: OrderSummaryProps) {
  const [orders, setOrders] = useState(meetupData?.orders || {});
  
  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  const allMembers = meetupData?.members || [];
  
  // In the new model, there's only ONE order placed by admin for the entire group
  // Not individual orders per member
  const adminOrder = meetupData?.adminOrder || null;
  
  // Get Order ID
  const orderId = adminOrder?.orderId || 'N/A';
  
  // Get GST values from admin order
  const subtotal = adminOrder?.subtotal || 0;
  const cgst = adminOrder?.cgst || 0;
  const sgst = adminOrder?.sgst || 0;
  const totalAmount = adminOrder?.total || 0;
  
  // Poll for updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, fetch from backend
    }, 2000);

    return () => clearInterval(interval);
  }, [meetupData]);

  const handleProceedToPayment = () => {
    if (totalAmount === 0) {
      toast.error('No orders placed yet');
      return;
    }

    // Navigate to individual bill payment
    onNavigate('order-based-billing', meetupData);
  };

  const handleAddMoreItems = () => {
    onNavigate('menu-selection', meetupData);
  };

  const handleSendReminder = () => {
    toast.success('Reminder sent to members who haven\'t ordered yet');
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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Order Summary</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Overview Card */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Group Orders Overview</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-[12px] text-neutral-600 mb-1">Total Members</p>
                <p className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">{allMembers.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-[12px] text-neutral-600 mb-1">Orders Placed</p>
                <p className="text-[24px] font-['Arial:Regular',_sans-serif] text-green-600 font-bold">{adminOrder ? 1 : 0}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-[12px] text-neutral-600 mb-1">Pending</p>
                <p className="text-[24px] font-['Arial:Regular',_sans-serif] text-orange-600 font-bold">{adminOrder ? 0 : allMembers.length}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-[#8b5943]/20">
              <div className="flex justify-between items-center">
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-medium">
                  Total Bill Amount
                </span>
                <span className="text-[28px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                  ₹{totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* User's Order Status */}
          {!adminOrder && isAdmin && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[14px] text-orange-900 font-['Arial:Regular',_sans-serif] font-bold mb-1">
                    No group order yet
                  </p>
                  <p className="text-[12px] text-orange-700 mb-3">
                    As admin, you can place an order for the entire group
                  </p>
                  <button
                    onClick={handleAddMoreItems}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-[14px] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Place Group Order
                  </button>
                </div>
              </div>
            </div>
          )}

          {!adminOrder && !isAdmin && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif] font-bold mb-1">
                    Waiting for Admin
                  </p>
                  <p className="text-[12px] text-blue-700">
                    The admin will place the group order. You'll be able to view it here once it's ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Group Order Display */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Individual Orders</h3>
            
            {adminOrder ? (
              <div className="space-y-4">
                <div
                  className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                          {adminOrder.userName}
                          {adminOrder.userId === user.id && ' (You)'}
                        </p>
                        <p className="text-[12px] text-neutral-600">
                          {adminOrder.items.length} item{adminOrder.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                        ₹{totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-lg p-3 space-y-2">
                    {adminOrder.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <p className="text-[12px] text-neutral-700">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-[12px] text-neutral-950 font-medium">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Edit Button */}
                  {adminOrder.userId === user.id && (
                    <button
                      onClick={handleAddMoreItems}
                      className="mt-3 w-full bg-white border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-[12px]"
                    >
                      Add More Items
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-[14px] text-neutral-600">No orders placed yet</p>
              </div>
            )}
          </div>

          {/* Members Without Orders */}
          {adminOrder ? 0 : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-orange-900 font-bold">
                    {allMembers.length} member{allMembers.length !== 1 ? 's' : ''} haven't ordered yet
                  </p>
                  <p className="text-[12px] text-orange-700">
                    Waiting for: {allMembers.map((m: any) => m.name).join(', ')}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleSendReminder}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-[12px]"
                  >
                    Send Reminder
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!adminOrder && isAdmin ? (
              <button
                onClick={handleAddMoreItems}
                className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Place Group Order
              </button>
            ) : adminOrder && isAdmin ? (
              <>
                {/* "Proceed to Payment" button removed - payment now happens in chat */}
                
                <button
                  onClick={handleAddMoreItems}
                  className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Edit Group Order
                </button>
              </>
            ) : null}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[12px] text-blue-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Note:</span> {isAdmin 
                ? 'As admin, you can place orders for the entire group. The bill will be split equally among all members.'
                : 'Only the admin can place orders. You can view the menu and current order. The bill will be split equally among all members.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Edit2, Trash2, Plus, Minus, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

interface UnifiedOrderSummaryProps {
  meetupData: any;
  user: any;
  isAdmin: boolean;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function UnifiedOrderSummary({ 
  meetupData, 
  user, 
  isAdmin,
  onNavigate,
  onBack 
}: UnifiedOrderSummaryProps) {
  const [orderItems, setOrderItems] = useState(meetupData?.orderItems || []);
  const [isConfirming, setIsConfirming] = useState(false);

  // Check if order is already confirmed
  const isOrderConfirmed = meetupData?.orderConfirmed || false;

  const updateQuantity = (itemId: string, delta: number) => {
    if (!isAdmin || isOrderConfirmed) {
      toast.error('Only admin can modify the order');
      return;
    }

    setOrderItems((prev: any[]) => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeItem = (itemId: string) => {
    if (!isAdmin || isOrderConfirmed) {
      toast.error('Only admin can modify the order');
      return;
    }

    setOrderItems((prev: any[]) => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from order');
  };

  const calculateBill = () => {
    const subtotal = orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const cgst = subtotal * 0.05; // 5% CGST
    const sgst = subtotal * 0.05; // 5% SGST
    const total = subtotal + cgst + sgst;

    return { subtotal, cgst, sgst, total };
  };

  const handleConfirmOrder = async () => {
    if (!isAdmin) {
      toast.error('Only admin can confirm the order');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add items to order');
      return;
    }

    setIsConfirming(true);

    try {
      const bill = calculateBill();
      const orderNumber = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();

      // Send to real backend
      try {
        await fetch(`${BASE_URL}/api/meetups/order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetupId: meetupData?._id || meetupData?.id,
            userId: user?.id || 'guest',
            userName: user?.name || user?.firstName || 'Guest',
            cafeId: meetupData?.winnerCafe?.cafeId || meetupData?.winnerCafe?.id || meetupData?.cafe?.id || meetupData?.cafe?._id || '',
            items: orderItems.map((i: any) => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
            subtotal: bill.subtotal,
            cgst: bill.cgst,
            sgst: bill.sgst,
            commission: parseFloat((bill.total * 0.06).toFixed(2)),
            total: bill.total,
            splitEnabled: false,
            members: meetupData?.members || [],
            perPersonAmount: bill.total,
            status: 'PENDING',
            orderId: orderNumber,
          })
        });
      } catch (err) {
        console.error('Failed to save order to backend:', err);
      }

      // Create bill data
      const billData = {
        orderNumber,
        orderId: `${Date.now()}`,
        orderDate: now.toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        orderTime: now.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        items: orderItems,
        subtotal: bill.subtotal,
        cgst: bill.cgst,
        sgst: bill.sgst,
        total: bill.total,
        cafeName: meetupData?.winnerCafe?.name || meetupData?.cafe?.name || 'Café',
        cafeAddress: meetupData?.winnerCafe?.address || '',
        meetupName: meetupData?.groupName || meetupData?.meetupName || 'Group Meetup',
        adminName: user?.name || meetupData?.adminName || 'Admin',
        memberCount: meetupData?.members?.length || 1,
        status: 'confirmed',
        confirmedAt: now.toISOString()
      };

      // Store bill in localStorage (simulate database)
      const meetupId = meetupData?.meetupId || meetupData?.code || 'default';
      const meetupKey = `meetup_${meetupId}`;
      
      const updatedMeetup = {
        ...meetupData,
        orderConfirmed: true,
        orderNumber,
        billData,
        orderItems,
        confirmedAt: now.toISOString()
      };

      localStorage.setItem(meetupKey, JSON.stringify(updatedMeetup));

      toast.success('Order confirmed successfully! 🎉');

      // Navigate to bill screen
      setTimeout(() => {
        onNavigate('unified-bill-screen', {
          ...updatedMeetup,
          isAdmin,
          viewOnly: !isAdmin
        });
      }, 500);

    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const bill = calculateBill();
  const totalItems = orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-[#be9d80] text-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] leading-[28px] font-['Arial:Regular',_sans-serif]">
                {isOrderConfirmed ? 'Order Confirmed' : 'Order Summary'}
              </h1>
              <p className="text-[13px] text-white/90 mt-1">
                {meetupData?.winnerCafe?.name || meetupData?.cafe?.name || 'Café'}
              </p>
            </div>
            {isOrderConfirmed && (
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirmed
              </Badge>
            )}
            {!isAdmin && (
              <Badge className="bg-white/20 text-white border-0">
                Member
              </Badge>
            )}
          </div>

          {/* Read-Only Banner for Members */}
          {!isAdmin && (
            <div className="bg-blue-500/20 border border-blue-300/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white" />
                <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-white">
                  View only – Admin manages the order
                </p>
              </div>
            </div>
          )}

          {/* Order Confirmed Banner */}
          {isOrderConfirmed && isAdmin && (
            <div className="bg-green-500/20 border border-green-300/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-white">
                  Order confirmed successfully!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {orderItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
              No Items in Order
            </h2>
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-6">
              {isAdmin ? 'Add items from the menu to create an order' : 'Waiting for admin to add items'}
            </p>
            {isAdmin && (
              <Button
                onClick={onBack}
                className="bg-[#030213] hover:bg-[#030213]/90"
              >
                Go to Menu
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                Order Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>
              {isAdmin && !isOrderConfirmed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="h-[32px]"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Order
                </Button>
              )}
            </div>

            {/* Items List */}
            {orderItems.map((item: any) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image?.startsWith('/uploads/') ? `${BASE_URL}${item.image}` : item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                          {item.name}
                        </h3>
                        <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          ₹{item.price} each
                        </p>
                      </div>
                      {/* Veg/Non-Veg Indicator */}
                      <div className={`w-5 h-5 rounded-sm flex items-center justify-center border-2 ${
                        item.veg ? 'bg-white border-green-600' : 'bg-white border-red-600'
                      }`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          item.veg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      {isAdmin && !isOrderConfirmed ? (
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-neutral-700" />
                          </button>
                          <span className="text-[15px] font-medium text-neutral-950 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-neutral-700" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[15px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          Quantity: <span className="font-medium text-neutral-950">{item.quantity}</span>
                        </div>
                      )}

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-[18px] font-medium text-neutral-950">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button (Admin Only) */}
                  {isAdmin && !isOrderConfirmed && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="w-5 h-5 text-neutral-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
              </Card>
            ))}

            {/* Bill Summary */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-slate-50 to-white">
              <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Bill Summary
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                    Subtotal
                  </span>
                  <span className="text-neutral-950 font-medium">
                    ₹{bill.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                    CGST (5%)
                  </span>
                  <span className="text-neutral-950 font-medium">
                    ₹{bill.cgst.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                    SGST (5%)
                  </span>
                  <span className="text-neutral-950 font-medium">
                    ₹{bill.sgst.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      Total Amount
                    </span>
                    <span className="text-[24px] font-bold text-green-600">
                      ₹{Math.ceil(bill.total)}
                    </span>
                  </div>
                </div>

                {/* Split Info */}
                {meetupData?.members?.length > 1 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                      Split among {meetupData.members.length} members: <span className="font-bold">₹{Math.ceil(bill.total / meetupData.members.length)}</span> per person
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Action Footer - Only for Admin */}
      {isAdmin && !isOrderConfirmed && orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
                <p className="text-[20px] font-bold text-neutral-950">
                  ₹{Math.ceil(bill.total)}
                </p>
              </div>
              <Button
                onClick={handleConfirmOrder}
                disabled={isConfirming}
                className="h-[52px] bg-green-600 hover:bg-green-700 rounded-lg px-8 min-w-[180px]"
              >
                {isConfirming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Footer - For Members */}
      {!isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t-2 border-blue-200 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                {isOrderConfirmed 
                  ? 'Order confirmed by admin. Check bill details above.'
                  : 'You can view the order. Admin will confirm when ready.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed Order Footer */}
      {isOrderConfirmed && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-50 border-t-2 border-green-200 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-[15px] text-green-900 font-['Arial:Regular',_sans-serif] font-bold">
                    Order Confirmed
                  </p>
                  <p className="text-[13px] text-green-700 font-['Arial:Regular',_sans-serif]">
                    {meetupData?.orderNumber || 'Order placed successfully'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onNavigate('unified-bill-screen', { ...meetupData, isAdmin, viewOnly: !isAdmin })}
                className="bg-green-600 hover:bg-green-700"
              >
                View Full Bill
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

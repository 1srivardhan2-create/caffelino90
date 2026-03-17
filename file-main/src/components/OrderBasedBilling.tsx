import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';
import { useState } from 'react';
import BillSplitUI from './BillSplitUI';

interface OrderBasedBillingProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function OrderBasedBilling({ user, meetupData, onNavigate, onBack }: OrderBasedBillingProps) {
  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  const [splitMethod, setSplitMethod] = useState<'split' | 'single'>('split');
  
  // Handle both old (orders object) and new (adminOrder) data structures
  const adminOrder = meetupData?.adminOrder;
  const ordersObject = meetupData?.orders || {};
  
  // Get Order ID from admin order
  const orderId = adminOrder?.orderId || 'N/A';
  
  // Convert adminOrder to orders array format if it exists
  // Calculate total dynamically from items
  const ordersArray = adminOrder 
    ? [{
        userId: adminOrder.userId,
        userName: adminOrder.userName,
        items: adminOrder.items || [],
        total: adminOrder.items 
          ? adminOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
          : 0
      }]
    : Object.values(ordersObject);

  // Get GST values from admin order or calculate them
  const subtotal = adminOrder?.subtotal || ordersArray.reduce((sum: number, order: any) => sum + order.total, 0);
  const cgst = adminOrder?.cgst || 0;
  const sgst = adminOrder?.sgst || 0;
  const finalTotal = adminOrder?.total || subtotal;
  
  // Calculate number of people in the group
  const numberOfPeople = meetupData?.members?.length || ordersArray.length || 1;

  const handleConfirmBilling = () => {
    if (ordersArray.length === 0) {
      toast.error('No orders to process');
      return;
    }

    if (finalTotal <= 0) {
      toast.error('Total amount must be greater than ₹0');
      return;
    }

    // Store payment status for each member based on split method
    if (!PAYMENT_STATUS[meetupData.code]) {
      PAYMENT_STATUS[meetupData.code] = {};
    }

    if (splitMethod === 'split') {
      // Split equally among all members
      const amountPerPerson = Math.round((finalTotal / numberOfPeople) * 100) / 100;
      
      // Get all members or use orders array
      const allMembers = meetupData?.members || ordersArray.map((order: any) => ({
        userId: order.userId,
        name: order.userName
      }));
      
      allMembers.forEach((member: any) => {
        PAYMENT_STATUS[meetupData.code][member.userId || member.id] = {
          memberId: member.userId || member.id,
          memberName: member.name || member.userName,
          amount: amountPerPerson,
          orderAmount: amountPerPerson,
          additionalCharges: 0,
          items: [],
          status: 'pending',
          paidAt: null
        };
      });
    } else {
      // Single person (admin) pays everything
      PAYMENT_STATUS[meetupData.code][user.id] = {
        memberId: user.id,
        memberName: user.name || user.firstName,
        amount: finalTotal,
        orderAmount: finalTotal,
        additionalCharges: 0,
        items: [],
        status: 'pending',
        paidAt: null
      };
    }

    // Store billing details in meetupData
    meetupData.billDetails = {
      subtotal,
      tax: 0,
      serviceCharge: 0,
      totalAmount: finalTotal,
      billingType: splitMethod === 'split' ? 'equal-split' : 'single-payer',
      splitMethod: splitMethod,
      locked: true
    };

    toast.success('Billing confirmed! Redirecting to payment...');

    // Navigate based on role and split method
    setTimeout(() => {
      if (splitMethod === 'single') {
        // Admin pays everything, go directly to payment
        onNavigate('payment-method-choice', meetupData);
      } else {
        // Split between everyone, show payment dashboard
        onNavigate('payment-status-dashboard', meetupData);
      }
    }, 1000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
            Waiting for admin to confirm billing...
          </p>
          <button
            onClick={onBack}
            className="mt-6 bg-[#8b5943] text-white px-6 py-3 rounded-lg hover:bg-[#8b5943]/90 transition-colors"
          >
            Go Back
          </button>
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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Confirm Billing</h1>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Order ID Badge */}
          <div className="flex justify-center">
            <div className="bg-[#8b5943] text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-[14px] font-['Arial:Regular',_sans-serif] font-bold">
                Order ID: {orderId}
              </span>
            </div>
          </div>

          {/* Orders Summary */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Order Items</h2>
            
            <div className="space-y-3 mb-4">
              {ordersArray.map((order: any) => (
                <div key={order.userId} className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                      {order.userName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-[13px] text-neutral-600">
                          {item.emoji || '🍽️'} {item.name} × {item.quantity}
                        </span>
                        <span className="text-[13px] text-neutral-900 font-medium">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Breakdown with GST - Same as Cafe Owner View */}
            <div className="bg-white rounded-lg p-4 space-y-2">
              <h3 className="text-[15px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold mb-3 pb-2 border-b border-neutral-200">
                Bill Breakdown
              </h3>
              
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-neutral-600">Subtotal</span>
                <span className="text-[14px] text-neutral-900 font-medium">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              
              {/* CGST */}
              {cgst > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-neutral-600">CGST (2.5%)</span>
                  <span className="text-[14px] text-neutral-900 font-medium">
                    ₹{cgst.toFixed(2)}
                  </span>
                </div>
              )}
              
              {/* SGST */}
              {sgst > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-neutral-600">SGST (2.5%)</span>
                  <span className="text-[14px] text-neutral-900 font-medium">
                    ₹{sgst.toFixed(2)}
                  </span>
                </div>
              )}
              
              {/* Total - Bold and highlighted */}
              <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-neutral-300">
                <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                  Total Amount
                </span>
                <span className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
              
              {/* Split Info */}
              {numberOfPeople > 1 && (
                <div className="bg-blue-50 rounded-md p-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-blue-900">
                      Split among {numberOfPeople} member{numberOfPeople > 1 ? 's' : ''}
                    </span>
                    <span className="text-[13px] text-blue-900 font-bold">
                      ₹{(finalTotal / numberOfPeople).toFixed(2)} per person
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bill Split Options */}
          <BillSplitUI
            totalBill={finalTotal}
            numberOfPeople={numberOfPeople}
            onSplitMethodChange={(method) => setSplitMethod(method)}
            onAmountCalculated={(amount) => {
              console.log('Amount calculated:', amount);
            }}
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[12px] text-blue-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Note:</span> {splitMethod === 'split' 
                ? 'Each member will pay an equal share of the total bill.'
                : 'One person (admin) will pay the complete bill amount.'}
            </p>
          </div>

          {/* Confirm Button - Only show if subtotal > 0 */}
          {subtotal > 0 && (
            <button
              onClick={handleConfirmBilling}
              className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Proceed to Payment
            </button>
          )}

          {/* No Orders Message */}
          {subtotal === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-[14px] text-amber-900 font-['Arial:Regular',_sans-serif]">
                ⚠️ No orders to process. Please add items to the cart first.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Clock, Users, DollarSign, CreditCard, Banknote, Receipt, CheckCircle, XCircle, ChevronDown, ChevronUp, Package, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { addOrderEarnings } from '../utils/cafeEarningsTracker';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface EnhancedCafeOrderCardProps {
  order: any;
  summary: any;
  members: any[];
  hasCashPending: boolean;
  hasPaymentTracking: boolean;
  handleOpenCashCollection: (order: any) => void;
  handleCompleteOrder: (order: any) => void;
  handleStatusChange: (order: any, status: string) => void;
  handleAccept: (order: any) => void;
  handleReject: (order: any) => void;
  handleDeleteOrder?: (order: any) => void;
}

export default function EnhancedCafeOrderCard({ 
  order, 
  summary, 
  members, 
  hasCashPending, 
  hasPaymentTracking,
  handleOpenCashCollection, 
  handleCompleteOrder, 
  handleStatusChange, 
  handleAccept, 
  handleReject,
  handleDeleteOrder
}: EnhancedCafeOrderCardProps) {
  const [isCollectingCash, setIsCollectingCash] = useState(false);
  const [showItems, setShowItems] = useState(false);
  
  // Calculate group-level payment breakdown (no individual names)
  const paymentData = order.groupCode ? PAYMENT_STATUS[order.groupCode] || {} : {};
  const memberPayments = Object.values(paymentData) as any[];
  
  // Only track cash payments - Cash Pending = Total Bill
  const cashCollected = memberPayments.filter(m => m.paymentType === 'cash' && m.status === 'cash-collected');
  
  const totalCashCollected = cashCollected.reduce((sum, m) => sum + m.amount, 0);
  const totalCollected = totalCashCollected; // Only cash
  const totalCashPending = (order.totalAmount || 0) - totalCashCollected; // Remaining amount to collect
  const remainingBalance = totalCashPending;
  
  const isFullyPaid = remainingBalance <= 0;

  // Handle group cash collection (no individual member tracking)
  const handleCollectCash = () => {
    if (!order.groupCode) return;
    
    setIsCollectingCash(true);
    
    const paymentData = PAYMENT_STATUS[order.groupCode];
    if (!paymentData) {
      setIsCollectingCash(false);
      return;
    }
    
    let totalCollected = 0;
    
    // Mark all pending cash as collected
    cashCollected.forEach(member => {
      if (paymentData[member.memberId]) {
        paymentData[member.memberId].status = 'cash-collected';
        paymentData[member.memberId].cashCollectedAt = new Date().toISOString();
        totalCollected += member.amount;
      }
    });
    
    setTimeout(() => {
      setIsCollectingCash(false);
      toast.success(`✅ Cash collected: ₹${totalCollected.toFixed(2)}`, {
        duration: 3000
      });
      
      // Check if fully paid now
      const newTotal = totalCashCollected;
      if (newTotal >= order.totalAmount) {
        toast.success('✅ Full payment received! Ready to mark as completed.', { 
          duration: 5000 
        });
      }
    }, 800);
  };

  // Handle complete order with revenue update
  const handleMarkAsCompleted = () => {
    if (remainingBalance > 0) {
      toast.error('Cannot complete - payment not fully received!');
      return;
    }
    
    // Add to revenue
    addOrderEarnings(
      order.orderNumber,
      order.totalAmount,
      0, // No online payments
      totalCashCollected
    );
    
    // Mark as completed
    handleCompleteOrder(order);
    
    toast.success('✅ Full amount received. Bill added to revenue.', {
      description: `Total: ₹${order.totalAmount.toFixed(2)}`,
      duration: 5000
    });
  };

  return (
    <Card className="p-0 border-2 border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Status Badge */}
      <div className="px-5 pt-4 pb-2">
        {isFullyPaid ? (
          <Badge className="bg-green-100 text-green-800 border border-green-300 px-3 py-1 text-[12px] font-bold">
            ✅ Completed
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 text-[12px] font-bold">
            ⏳ Pending
          </Badge>
        )}
      </div>

      {/* GROUP BILL SUMMARY */}
      <div className="px-5 pb-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Arial',sans-serif] text-[18px] text-[#1a1a1a] font-bold">
                Group Bill
              </span>
            </div>
            <span className="font-['Arial',sans-serif] text-[14px] text-slate-600">
              {order.orderTime}
            </span>
          </div>

          {/* Meetup Date / Time */}
          {(order.meetupDate || order.meetupTime) && (
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-200/50">
              <span className="font-['Arial',sans-serif] text-[15px] text-[#1a1a1a]">
                Scheduled For:
              </span>
              <span className="font-['Arial',sans-serif] text-[15px] text-blue-800 font-bold">
                {order.meetupDate} {order.meetupTime && `at ${order.meetupTime}`}
              </span>
            </div>
          )}

          {/* Order ID */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-200/50">
            <span className="font-['Arial',sans-serif] text-[15px] text-[#1a1a1a]">
              Order ID:
            </span>
            <span className="font-['Arial',sans-serif] text-[18px] text-blue-600 font-bold">
              {order.orderNumber}
            </span>
          </div>

          {/* VIEW ITEMS TOGGLE BUTTON */}
          <div className="mb-4">
            <button
              onClick={() => setShowItems(!showItems)}
              className="w-full bg-white hover:bg-blue-50 border-2 border-blue-300 rounded-lg px-4 py-3 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <span className="font-['Arial',sans-serif] text-[15px] text-[#1a1a1a] font-bold">
                  View Items
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-300">
                  {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                </Badge>
              </div>
              <div className="text-blue-600">
                {showItems ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* COLLAPSIBLE ITEMS LIST */}
            {showItems && (
              <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto bg-white rounded-lg p-4 border-2 border-blue-200 shadow-inner">
                {order.items.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-start py-3 px-2 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 rounded transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-['Arial',sans-serif] text-[15px] text-[#1a1a1a] font-semibold mb-1">
                        {item.name}
                      </p>
                      <p className="font-['Arial',sans-serif] text-[13px] text-slate-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Arial',sans-serif] text-[16px] text-blue-600 font-bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Items Total Inside */}
                <div className="pt-3 mt-2 border-t-2 border-blue-300 flex justify-between items-center">
                  <span className="font-['Arial',sans-serif] text-[15px] text-[#1a1a1a] font-bold">
                    Items Subtotal:
                  </span>
                  <span className="font-['Arial',sans-serif] text-[18px] text-blue-700 font-bold">
                    ₹{(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="space-y-2 pt-2">
            {/* CGST */}
            <div className="flex justify-between items-center">
              <span className="font-['Arial',sans-serif] text-[14px] text-slate-600">
                CGST (2.5%):
              </span>
              <span className="font-['Arial',sans-serif] text-[14px] text-slate-600">
                ₹{(order.cgst || 0).toFixed(2)}
              </span>
            </div>

            {/* SGST */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-['Arial',sans-serif] text-[14px] text-slate-600">
                SGST (2.5%):
              </span>
              <span className="font-['Arial',sans-serif] text-[14px] text-slate-600">
                ₹{(order.sgst || 0).toFixed(2)}
              </span>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
              <span className="font-['Arial',sans-serif] text-[18px] text-[#1a1a1a] font-bold">
                Grand Total:
              </span>
              <span className="font-['Arial',sans-serif] text-[28px] text-blue-600 font-bold">
                ₹{(order.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT STATUS - GROUP LEVEL ONLY */}
      <div className="px-5 pb-4">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-slate-700" />
            <h4 className="font-['Arial',sans-serif] text-[16px] text-slate-900 font-bold">
              Payment Status
            </h4>
          </div>

          <div className="space-y-3">
            {/* Cash Pending Amount */}
            <div className="bg-white rounded-lg border-2 border-amber-300 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span className="font-['Arial',sans-serif] text-[14px] text-amber-800 font-bold">
                    Cash Pending:
                  </span>
                </div>
                <span className="font-['Arial',sans-serif] text-[20px] text-amber-700 font-bold">
                  ₹{totalCashPending.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total Bill Summary */}
            <div className="bg-blue-100 rounded-lg border-2 border-blue-400 p-3">
              <div className="flex items-center justify-between">
                <span className="font-['Arial',sans-serif] text-[15px] text-blue-900 font-bold">
                  Total Bill:
                </span>
                <span className="font-['Arial',sans-serif] text-[22px] text-blue-700 font-bold">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OWNER ACTIONS */}
      <div className="px-5 pb-5">
        <div className="space-y-2">
          {(order.status === 'pending' || order.status === 'PENDING') && (
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-[15px] font-bold"
              onClick={() => handleAccept(order)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Accept Order
            </Button>
          )}
          
          {(order.status === 'accepted' || order.status === 'ACCEPTED' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready') && (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-lg text-[15px] font-bold"
              onClick={() => handleOpenCashCollection(order)}
              disabled={isCollectingCash}
            >
              <Banknote className="w-5 h-5 mr-2" />
              {isCollectingCash ? 'Collecting...' : `Cash Collected (₹${order.totalAmount.toFixed(2)})`}
            </Button>
          )}

          {/* Delete Button - Always visible unless completed */}
          {handleDeleteOrder && order.status !== 'completed' && order.status !== 'COMPLETED' && (
            <Button
              variant="outline"
              className="w-full border-2 border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-[13px] font-bold"
              onClick={() => handleDeleteOrder(order)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Delete Order
            </Button>
          )}
        </div>
      </div>

      {isFullyPaid && remainingBalance === 0 && (order.status === 'completed' || order.status === 'COMPLETED') && (
        <div className="px-5 pb-4">
          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-['Arial',sans-serif] text-[15px] text-green-900 font-bold">
              Payment Completed
            </p>
            <p className="font-['Arial',sans-serif] text-[13px] text-green-700">
              ₹{order.totalAmount.toFixed(2)} added to revenue
            </p>
          </div>
        </div>
      )}

      {/* Group Info Footer */}
      <div className="bg-slate-100 px-5 py-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-[12px] text-slate-600">
          <span>{order.groupName || order.meetupName || 'Table Order'}</span>
          <span>{order.orderDate} {order.orderTime}</span>
        </div>
      </div>
    </Card>
  );
}

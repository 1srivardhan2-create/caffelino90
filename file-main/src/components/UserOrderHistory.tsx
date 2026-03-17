import { useState, useEffect } from 'react';
import { ArrowLeft, Receipt, CreditCard, Banknote, CheckCircle, Clock, Package } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface UserOrder {
  orderId: string;
  orderNumber: string;
  groupName: string;
  meetupName: string;
  groupCode: string;
  amount: number;
  paymentType: 'online' | 'cash' | null;
  paymentStatus: 'paid' | 'pending-cash' | 'cash-collected' | 'pending';
  orderDate: string;
  orderTime: string;
  paidAt?: string;
  cashCollectedAt?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    emoji: string;
  }>;
}

interface UserOrderHistoryProps {
  userId: string;
  userName: string;
  onBack: () => void;
}

export default function UserOrderHistory({ userId, userName, onBack }: UserOrderHistoryProps) {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  useEffect(() => {
    loadUserOrders();
  }, [userId]);

  const loadUserOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
    const userOrdersList: UserOrder[] = [];

    allOrders.forEach((order: any) => {
      if (order.groupCode && PAYMENT_STATUS[order.groupCode]) {
        const paymentData = PAYMENT_STATUS[order.groupCode];
        const userPayment = paymentData[userId];

        if (userPayment) {
          // Get user's items from the order
          const orderKey = `group_order_${order.groupCode}`;
          const groupOrder = JSON.parse(localStorage.getItem(orderKey) || '{}');
          const userItems = groupOrder.memberOrders?.[userId]?.items || [];

          userOrdersList.push({
            orderId: order.orderNumber + '-' + userId,
            orderNumber: order.orderNumber,
            groupName: order.groupName,
            meetupName: order.meetupName,
            groupCode: order.groupCode,
            amount: userPayment.amount,
            paymentType: userPayment.paymentType,
            paymentStatus: userPayment.status,
            orderDate: order.orderDate,
            orderTime: order.orderTime,
            paidAt: userPayment.paidAt,
            cashCollectedAt: userPayment.cashCollectedAt,
            items: userItems
          });
        }
      }
    });

    // Sort by date (newest first)
    userOrdersList.sort((a, b) => {
      const dateA = new Date(a.orderDate + ' ' + a.orderTime);
      const dateB = new Date(b.orderDate + ' ' + b.orderTime);
      return dateB.getTime() - dateA.getTime();
    });

    setOrders(userOrdersList);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'cash-collected':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'pending-cash':
        return <Clock className="size-4 text-amber-600" />;
      default:
        return <Clock className="size-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">✅ Paid</Badge>;
      case 'cash-collected':
        return <Badge className="bg-green-500 text-white">✅ Cash Collected</Badge>;
      case 'pending-cash':
        return <Badge className="bg-amber-500 text-white">🕒 Cash Pending</Badge>;
      default:
        return <Badge className="bg-slate-400 text-white">⏳ Pending</Badge>;
    }
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-[#be9d80] text-white p-4 sticky top-0 z-10">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-lg">
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold">Order Details</h1>
              <p className="text-xs text-white/90">#{selectedOrder.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-4 max-w-4xl mx-auto space-y-4">
          {/* Order Info Card */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900">{selectedOrder.meetupName}</h3>
                <p className="text-sm text-slate-600">{selectedOrder.groupName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedOrder.orderDate} • {selectedOrder.orderTime}
                </p>
              </div>
              {getStatusBadge(selectedOrder.paymentStatus)}
            </div>

            {/* Items */}
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-slate-700 mb-2">Your Items</p>
              {selectedOrder.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-700">
                        {item.emoji} {item.name} × {item.quantity}
                      </span>
                      <span className="text-slate-900 font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No items found</p>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-2">Payment Details</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Amount:</span>
                  <span className="font-bold text-blue-900">₹{selectedOrder.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Payment Type:</span>
                  <div className="flex items-center gap-1">
                    {selectedOrder.paymentType === 'online' ? (
                      <>
                        <CreditCard className="size-3 text-green-600" />
                        <span className="text-green-900 font-medium">Online</span>
                      </>
                    ) : selectedOrder.paymentType === 'cash' ? (
                      <>
                        <Banknote className="size-3 text-amber-600" />
                        <span className="text-amber-900 font-medium">Cash</span>
                      </>
                    ) : (
                      <span className="text-slate-500">Not Selected</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Status:</span>
                  <span className="font-medium text-blue-900">
                    {selectedOrder.paymentStatus === 'paid' && 'Paid'}
                    {selectedOrder.paymentStatus === 'cash-collected' && 'Cash Collected'}
                    {selectedOrder.paymentStatus === 'pending-cash' && 'Cash Pending'}
                    {selectedOrder.paymentStatus === 'pending' && 'Processing'}
                  </span>
                </div>
                {selectedOrder.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Paid At:</span>
                    <span className="text-blue-900 text-xs">
                      {new Date(selectedOrder.paidAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {selectedOrder.cashCollectedAt && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Collected At:</span>
                    <span className="text-blue-900 text-xs">
                      {new Date(selectedOrder.cashCollectedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#be9d80] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold">Order History</h1>
            <p className="text-xs text-white/90">{userName}</p>
          </div>
          <Receipt className="size-5" />
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 max-w-4xl mx-auto space-y-3">
        {orders.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Package className="size-16 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-900 mb-2">No Orders Yet</h3>
              <p className="text-sm text-slate-600">
                Your order history will appear here once you place an order
              </p>
            </div>
          </Card>
        ) : (
          orders.map((order) => (
            <Card
              key={order.orderId}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(order.paymentStatus)}
                    <h3 className="font-medium text-slate-900">{order.meetupName}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{order.groupName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Order #{order.orderNumber}
                  </p>
                </div>
                {getStatusBadge(order.paymentStatus)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {order.paymentType === 'online' ? (
                    <CreditCard className="size-4 text-green-600" />
                  ) : order.paymentType === 'cash' ? (
                    <Banknote className="size-4 text-amber-600" />
                  ) : (
                    <Clock className="size-4 text-slate-400" />
                  )}
                  <span className="text-xs text-slate-600">
                    {order.orderDate} • {order.orderTime}
                  </span>
                </div>
                <p className="font-bold text-[#8b5943]">₹{order.amount.toFixed(2)}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

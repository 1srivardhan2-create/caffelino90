import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface OrderItem {
  memberId: string;
  memberName: string;
  items: Array<{ name: string; quantity: number; emoji: string; price: number }>;
  total: number;
}

interface LiveOrderProps {
  groupCode: string;
  groupName: string;
  isOrderLocked: boolean;
}

export default function LiveGroupOrder({ groupCode, groupName, isOrderLocked }: LiveOrderProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    loadLiveOrder();
    const interval = setInterval(loadLiveOrder, 1000); // Real-time updates every second
    return () => clearInterval(interval);
  }, [groupCode]);

  const loadLiveOrder = () => {
    const key = `group_order_${groupCode}`;
    const storedOrder = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (storedOrder.memberOrders) {
      const memberOrderArray: OrderItem[] = Object.values(storedOrder.memberOrders);
      setOrderItems(memberOrderArray);
      
      // Calculate grand total
      const total = memberOrderArray.reduce((sum, member) => sum + member.total, 0);
      setGrandTotal(total);
    }
  };

  if (orderItems.length === 0) {
    return (
      <Card className="p-4 border-2 border-slate-200">
        <div className="text-center py-8">
          <ShoppingBag className="size-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No items added yet</p>
          <p className="text-slate-400 text-xs mt-1">Start adding items to begin the order</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Live Order Header */}
      <Card className="p-4 border-2 border-[#8b5943] bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOrderLocked ? (
              <CheckCircle className="size-5 text-green-600" />
            ) : (
              <Clock className="size-5 text-[#8b5943] animate-pulse" />
            )}
            <div>
              <h3 className="text-slate-900 font-medium">
                {isOrderLocked ? 'Order Confirmed' : 'Live Order in Progress'}
              </h3>
              <p className="text-xs text-slate-600">{groupName}</p>
            </div>
          </div>
          <Badge className={isOrderLocked ? 'bg-green-500 text-white' : 'bg-[#8b5943] text-white'}>
            {isOrderLocked ? 'Locked' : 'Live'}
          </Badge>
        </div>
      </Card>

      {/* Member Orders */}
      <div className="space-y-2">
        {orderItems.map((memberOrder) => (
          <Card key={memberOrder.memberId} className="p-3 border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#8b5943] text-white size-8 rounded-full flex items-center justify-center text-xs font-medium">
                  {memberOrder.memberName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{memberOrder.memberName}</p>
                  <p className="text-xs text-slate-500">{memberOrder.items.length} items</p>
                </div>
              </div>
              <p className="text-sm font-bold text-[#8b5943]">₹{memberOrder.total.toFixed(2)}</p>
            </div>
            
            {/* Items List */}
            <div className="bg-slate-50 rounded-lg p-2 space-y-1">
              {memberOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-700">
                    {item.emoji} {item.name} × {item.quantity}
                  </span>
                  <span className="text-slate-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Grand Total */}
      <Card className="p-4 border-2 border-[#8b5943] bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-[#8b5943]" />
            <div>
              <p className="text-xs text-slate-600">Total Members: {orderItems.length}</p>
              <p className="text-sm font-medium text-slate-900">Grand Total</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#8b5943]">₹{grandTotal.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  );
}

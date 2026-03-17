import { useState, useEffect } from 'react';
import { Search, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { safeStorage } from '../utils/safeStorage';

interface Order {
  orderNumber: string;
  meetupName: string;
  groupName: string;
  memberCount: number;
  items: Array<{ name: string; quantity: number; emoji: string; price: number }>;
  totalAmount: number;
  orderDate: string;
  orderTime: string;
  status: string;
  billData?: any;
  completedAt?: string;
}

export default function CafeOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'rejected'>('all');

  useEffect(() => {
    loadOrderHistory();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, filterStatus]);

  const loadOrderHistory = () => {
    const allOrders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
    // Only show completed or rejected orders
    const historyOrders = allOrders.filter(
      (order: Order) => ['completed', 'rejected'].includes(order.status)
    );
    // Sort by date (newest first)
    historyOrders.sort((a: any, b: any) => {
      const dateA = new Date(a.completedAt || a.orderDate);
      const dateB = new Date(b.completedAt || b.orderDate);
      return dateB.getTime() - dateA.getTime();
    });
    setOrders(historyOrders);
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.meetupName.toLowerCase().includes(query) ||
        order.groupName.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + (order.billData?.totalAmount || order.totalAmount), 0);

  const completedCount = orders.filter(o => o.status === 'completed').length;
  const rejectedCount = orders.filter(o => o.status === 'rejected').length;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="size-4 text-green-600" />
            <span className="text-sm text-green-900">Completed</span>
          </div>
          <div className="text-2xl text-green-900">{completedCount}</div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="size-4 text-red-600" />
            <span className="text-sm text-red-900">Rejected</span>
          </div>
          <div className="text-2xl text-red-900">{rejectedCount}</div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="size-4 text-blue-600" />
            <span className="text-sm text-blue-900">Revenue</span>
          </div>
          <div className="text-2xl text-blue-900">₹{totalRevenue}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by order number, meetup name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'bg-[#8b5943]' : ''}
          >
            All ({orders.length})
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('completed')}
            className={filterStatus === 'completed' ? 'bg-green-600' : ''}
          >
            Completed ({completedCount})
          </Button>
          <Button
            variant={filterStatus === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('rejected')}
            className={filterStatus === 'rejected' ? 'bg-red-600' : ''}
          >
            Rejected ({rejectedCount})
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="bg-slate-100 size-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="size-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">No Orders Found</h3>
          <p className="text-sm text-slate-600">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Your order history will appear here'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.orderNumber} className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-[#8b5943] text-white">
                      {order.orderNumber}
                    </Badge>
                    <Badge
                      className={
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {order.status === 'completed' ? (
                        <>
                          <CheckCircle className="size-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3 mr-1" />
                          Rejected
                        </>
                      )}
                    </Badge>
                  </div>
                  <h4 className="text-slate-900">{order.meetupName}</h4>
                  <p className="text-sm text-slate-600">{order.groupName}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {order.orderDate}
                  </div>
                  <div>{order.orderTime}</div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                <div className="text-sm text-slate-700 mb-2">
                  {order.memberCount} members • {order.items.length} items
                </div>
                <div className="space-y-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-sm text-slate-600">
                      {item.emoji} {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-slate-500">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  {order.status === 'completed' ? 'Bill Amount' : 'Order Amount'}
                </span>
                <span className="text-lg text-slate-900">
                  ₹{order.billData?.totalAmount || order.totalAmount}
                </span>
              </div>

              {/* Payment Status */}
              {order.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  {(() => {
                    const paymentStatusKey = `payment_status_${order.orderNumber}`;
                    const paymentStatuses = JSON.parse(safeStorage.getItem(paymentStatusKey) || '[]');
                    const allPaid = paymentStatuses.length > 0 && 
                      paymentStatuses.every((s: any) => s.status === 'paid');
                    const paidCount = paymentStatuses.filter((s: any) => s.status === 'paid').length;
                    const totalCount = paymentStatuses.length;

                    if (allPaid) {
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle className="size-4" />
                            <span>Payment Completed ✅</span>
                          </div>
                          <div className="text-xs text-green-600">
                            All {totalCount} members have paid their share
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-orange-700">
                            <Clock className="size-4" />
                            <span>Waiting for Member Payments ⏳</span>
                          </div>
                          <div className="text-xs text-orange-600">
                            {paidCount}/{totalCount} members have paid
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {/* Bill Status */}
              {order.status === 'completed' && order.billData && (
                <div className="mt-2 text-xs text-slate-500">
                  Bill uploaded and verified
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
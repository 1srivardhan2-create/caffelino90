import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, IndianRupee, ChevronDown, ChevronUp, CreditCard, Banknote, Users, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';
import { addOrderEarnings } from '../utils/cafeEarningsTracker';
import { orderAPI, paymentAPI, earningsAPI, BASE_URL } from '../utils/api';
import EnhancedCafeOrderCard from './EnhancedCafeOrderCard';
import { safeStorage } from '../utils/safeStorage';
import { socketService } from '../services/socketService';

interface Order {
  orderNumber: string;
  meetupName: string;
  groupName: string;
  groupCode?: string;
  meetupId?: string;
  memberCount: number;
  items: Array<{ id?: string; name: string; quantity: number; emoji?: string; price: number; category?: string; description?: string }>;
  totalAmount: number;
  orderDate: string;
  orderTime: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
  adminName: string;
  adminPhone: string;
  createdAt?: string; // Add createdAt field for sorting
  subtotal?: number; // Subtotal without GST
  cgst?: number; // CGST amount
  sgst?: number; // SGST amount
  billBreakdown?: {
    cgst?: number;
    sgst?: number;
    splitAmong?: number;
    perPerson?: number;
  };
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

export default function CafeLiveOrders({ isOnline, cafeId }: { isOnline: boolean; cafeId?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deletedOrders, setDeletedOrders] = useState<Order[]>([]);
  const [showDeletedOrders, setShowDeletedOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCashCollectionDialog, setShowCashCollectionDialog] = useState(false);
  const [memberPayments, setMemberPayments] = useState<MemberPaymentInfo[]>([]);
  const [cashAmounts, setCashAmounts] = useState<{ [memberId: string]: string }>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Check if we're in browser environment
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  // Resolve cafeId from props or localStorage
  const resolvedCafeId = cafeId || safeStorage.getItem('myCafeOwnerId') || safeStorage.getItem('myCafeId') || safeStorage.getItem('userId') || '';

  // Load orders from backend meetup-orders endpoint + socket live updates
  useEffect(() => {
    loadOrders();
    loadDeletedOrders();
    const interval = setInterval(() => {
      loadOrders();
      setLastUpdate(new Date());
    }, 5000); // Refresh every 5 seconds

    // --- Socket: join cafe room for live order updates ---
    if (resolvedCafeId) {
      socketService.connect();
      socketService.joinCafeRoom(resolvedCafeId);

      const handleOrderCreated = (data: any) => {
        console.log('📦 Live order received via socket:', data);
        toast.success(`🆕 New order from ${data.groupName || 'Meetup'}!`, {
          description: `${data.items?.length || 0} items • ₹${(data.totalAmount || 0).toFixed(2)}`,
          duration: 8000,
        });

        // Add to orders list (avoid duplicates)
        setOrders(prev => {
          const exists = prev.some(o => o.orderNumber === data.orderNumber);
          if (exists) return prev;
          return [data as Order, ...prev];
        });
      };

      const handleOrderStatusUpdate = (data: any) => {
        console.log('🔄 Order status update received:', data);
        setOrders(prev => {
          // If status is completed or rejected, remove it from live orders
          if (['completed', 'rejected', 'COMPLETED', 'REJECTED'].includes(data.status)) {
            return prev.filter(o => o.orderId !== data.orderId && o._id !== data.orderId);
          }
          // Otherwise update its status
          return prev.map(o => {
            if (o.orderId === data.orderId || o._id === data.orderId) {
              return { ...o, status: data.status };
            }
            return o;
          });
        });
      };

      const handleOrderDeleted = (data: any) => {
        console.log('🗑 Order deleted notification received:', data);
        setOrders(prev => prev.filter(o => o.orderId !== data.orderId && o._id !== data.orderId));
      };

      socketService.socket?.on('order-created', handleOrderCreated);
      socketService.socket?.on('order-status-update', handleOrderStatusUpdate);
      socketService.socket?.on('order-deleted', handleOrderDeleted);

      return () => {
        clearInterval(interval);
        socketService.socket?.off('order-created', handleOrderCreated);
        socketService.socket?.off('order-status-update', handleOrderStatusUpdate);
        socketService.socket?.off('order-deleted', handleOrderDeleted);
      };
    }

    return () => clearInterval(interval);
  }, [resolvedCafeId]);

  const loadOrders = async () => {
    // Try to fetch meetup orders from the new endpoint
    if (resolvedCafeId) {
      try {
        const res = await fetch(`${BASE_URL}/api/cafe/meetup-orders/${resolvedCafeId}`);
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
          const activeOrders = data.orders
            .filter((order: Order) => !['completed', 'rejected', 'COMPLETED', 'REJECTED'].includes(order.status))
            .sort((a: Order, b: Order) => {
              const timeA = new Date(a.createdAt || a.orderDate).getTime();
              const timeB = new Date(b.createdAt || b.orderDate).getTime();
              return timeB - timeA;
            });
          setOrders(activeOrders);
          console.log(`✅ Loaded ${activeOrders.length} meetup orders for cafe ${resolvedCafeId}`);
          return;
        }
      } catch (error) {
        console.error('Error loading meetup orders:', error);
      }
    }

    // Fallback: try backend cafe orders (auth-based)
    try {
      const response = await orderAPI.getAllOrders();
      if (response.success && response.orders && response.orders.length > 0) {
        const activeOrders = response.orders
          .filter((order: Order) => !['completed', 'rejected', 'COMPLETED', 'REJECTED'].includes(order.status))
          .sort((a: Order, b: Order) => {
            const timeA = new Date(a.createdAt || a.orderDate).getTime();
            const timeB = new Date(b.createdAt || b.orderDate).getTime();
            return timeB - timeA;
          });
        setOrders(activeOrders);
        return;
      }
    } catch (error) {
      console.error('Error loading orders from backend:', error);
    }
    
    // Fallback to localStorage
    if (isBrowser) {
      const storedOrders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
      const activeOrders = storedOrders
        .filter((order: Order) => !['completed', 'rejected', 'COMPLETED', 'REJECTED'].includes(order.status))
        .sort((a: Order, b: Order) => {
          const timeA = new Date(a.createdAt || a.orderDate).getTime();
          const timeB = new Date(b.createdAt || b.orderDate).getTime();
          return timeB - timeA;
        });
      setOrders(activeOrders);
    }
  };

  const loadDeletedOrders = async () => {
    if (!resolvedCafeId) return;

    try {
      const res = await fetch(`${BASE_URL}/api/meetup-orders/deleted/${resolvedCafeId}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setDeletedOrders(data.orders);
        console.log(`✅ Loaded ${data.orders.length} deleted orders for cafe ${resolvedCafeId}`);
        return;
      }
    } catch (error) {
      console.error('Error loading deleted orders from backend:', error);
    }

    // Fallback to localStorage if backend fails
    if (isBrowser) {
      const stored = JSON.parse(safeStorage.getItem('cafeDeletedOrders') || '[]');
      setDeletedOrders(stored);
    }
  };

  // ─── DELETE ORDER ───────────────────────────────────────────────────────────
  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`Delete order ${order.orderNumber}?\n\nThis order will be moved to Deleted Orders.`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/meetup-orders/${order.orderId || order.orderNumber}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'manual delete' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order moved to Deleted Orders');
        loadOrders();
        loadDeletedOrders();
        
        // Remove from localStorage fallback
        if (isBrowser) {
          const storedOrders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
          const updatedOrders = storedOrders.filter((o: Order) => o.orderNumber !== order.orderNumber);
          safeStorage.setItem('cafeOrders', JSON.stringify(updatedOrders));
        }
      } else {
        toast.error('Failed to delete order');
      }
    } catch (err) {
      console.error('Delete order error:', err);
      toast.error('Network error while deleting order');
    }
  };

  // ─── ACTIVE ORDER ACTIONS ─────────────────────────────────────────────────────
  const handleAccept = async (order: Order) => {
    try {
      const id = (order as any)._id || order.orderId || order.orderNumber;
      const res = await fetch(`${BASE_URL}/api/meetup-orders/${id}/accept`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order accepted! 🎉');
        loadOrders();
      } else {
        toast.error('Failed to accept order');
      }
    } catch (err) {
      console.error('Accept error:', err);
      toast.error('Network error');
    }
  };

  const handleStatusChange = async (order: Order, newStatus: Order['status']) => {
    // For legacy support if needed, but we mostly just use accept and complete now
    updateOrderStatus(order.orderNumber, newStatus);
  };

  // ─── CASH COLLECTION ────────────────────────────────────────────────────────
  const handleOpenCashCollection = (order: Order) => {
    setSelectedOrder(order);
    setCashAmounts({ 'full-order': order.totalAmount.toFixed(2) });
    setShowCashCollectionDialog(true);
  };

  const handleMarkCashCollected = async () => {
    if (!selectedOrder) return;

    const amount = parseFloat(cashAmounts['full-order'] || '0');
    if (amount <= 0) {
      toast.error('❌ Error: Please enter valid amount.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/meetup-orders/${selectedOrder.orderId || selectedOrder.orderNumber}/cash-collected`, {
        method: 'PATCH',
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`✅ Cash Collected: ₹${amount.toFixed(2)}`, {
          description: `Order #${selectedOrder.orderNumber} completed and added to earnings.`,
          duration: 5000,
        });

        // Also update Supabase for legacy components
        try {
          await orderAPI.updateOrderStatus(selectedOrder.orderNumber, 'COMPLETED');
        } catch (e) { /* ignore */ }
        
        setShowCashCollectionDialog(false);
        setSelectedOrder(null);
        setCashAmounts({});
        loadOrders();
      } else {
        toast.error('Failed to mark cash as collected');
      }
    } catch (err) {
      console.error('Cash collect error:', err);
      toast.error('Network error');
    }
  };

  const handleCashAmountChange = (memberId: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setCashAmounts(prev => ({ ...prev, [memberId]: value }));
    }
  };

  const handleCompleteOrder = (order: Order) => {
    // Fallback if needed, but we use Cash Collected button mostly now
  };

  const getPaymentSummary = (order: Order): PaymentSummary => {
    const isCompleted = order.status === 'completed' || order.status === 'COMPLETED';
    return {
      totalBill: order.totalAmount,
      onlinePaid: 0,
      cashPending: isCompleted ? 0 : order.totalAmount,
      cashCollected: isCompleted ? order.totalAmount : 0,
      remainingBalance: isCompleted ? 0 : order.totalAmount,
      settlementStatus: isCompleted ? 'fully-paid' : 'partial'
    };
  };

  const getMemberPayments = (order: Order): MemberPaymentInfo[] => {
    return [];
  };

  const handleReject = () => {
    toast.info('Rejection is no longer supported directly. Please use Delete Order.');
  };

  const handleRestoreOrder = (order: Order) => {
    toast.info('Restoring deleted orders is under construction.');
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
            Turn on online status to receive new orders
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-green-100 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-10 text-green-600" />
          </div>
          <h3 className="text-slate-900 mb-2">All Caught Up!</h3>
          <p className="text-slate-600 text-sm">
            No active orders at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      {/* Real-time Auto-Update Indicator */}
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg px-4 py-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div>
            <p className="text-[13px] text-green-900 font-bold">
              🔄 Live Orders - Auto-Refreshing
            </p>
            <p className="text-[11px] text-green-700">
              Updates every 3 seconds • Last update: {lastUpdate.toLocaleTimeString('en-IN')}
            </p>
          </div>
        </div>
        <Badge className="bg-green-600 text-white text-[11px]">
          {orders.length} Active
        </Badge>
      </div>

      {/* Toggle Button for Deleted Orders */}
      {deletedOrders.length > 0 && (
        <Button
          variant="outline"
          onClick={() => setShowDeletedOrders(!showDeletedOrders)}
          className="w-full border-2 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 px-4 py-3 rounded-lg text-[14px] font-bold flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{showDeletedOrders ? 'Hide' : 'View'} Deleted Orders</span>
          </div>
          <Badge className="bg-red-500 text-white">
            {deletedOrders.length}
          </Badge>
        </Button>
      )}

      {/* Deleted Orders Section */}
      {showDeletedOrders && deletedOrders.length > 0 && (
        <div className="space-y-4 border-2 border-red-200 rounded-xl p-4 bg-red-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-red-800 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Deleted Orders
            </h3>
            <Badge className="bg-red-600 text-white text-[12px]">
              {deletedOrders.length} orders
            </Badge>
          </div>

          {deletedOrders.map((order) => {
            const summary = getPaymentSummary(order);
            const members = getMemberPayments(order);
            
            return (
              <Card key={order.orderNumber} className="p-4 border-2 border-red-300 bg-white">
                <div className="space-y-3">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[16px] font-bold text-neutral-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-[13px] text-neutral-600">
                        {order.groupName} • {order.orderDate}
                      </p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 border border-red-300">
                      Deleted
                    </Badge>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-neutral-600">Total Amount:</span>
                      <span className="font-bold text-neutral-900">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-neutral-600">Items:</span>
                      <span className="text-neutral-700">{order.items.length} items</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-neutral-600">Deleted At:</span>
                      <span className="text-neutral-700">
                        {new Date((order as any).deletedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Restore Button */}
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-[13px] font-bold"
                    onClick={() => handleRestoreOrder(order)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Restore to Live Orders
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Live Orders */}
      {orders.map((order) => {
        const summary = getPaymentSummary(order);
        const members = getMemberPayments(order);
        const hasCashPending = summary.cashPending > 0;
        const hasPaymentTracking = order.groupCode && Object.keys(PAYMENT_STATUS[order.groupCode] || {}).length > 0;
        
        return (
        <EnhancedCafeOrderCard key={order.orderNumber} order={order} summary={summary} members={members} hasCashPending={hasCashPending} hasPaymentTracking={hasPaymentTracking} handleOpenCashCollection={handleOpenCashCollection} handleCompleteOrder={handleCompleteOrder} handleStatusChange={handleStatusChange} handleAccept={handleAccept} handleReject={handleReject} handleDeleteOrder={handleDeleteOrder} />
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
                  <span className="font-bold">Order ID:</span> {selectedOrder.orderNumber}
                  <br />
                  <span className="font-bold">Group:</span> {selectedOrder.groupName}
                  <br />
                  <span className="font-bold">Total Amount:</span> ₹{selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="space-y-3">
                {memberPayments.length > 0 ? (
                  // Show member-based payment collection
                  memberPayments
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
                    ))
                ) : (
                  // Show full order cash collection
                  <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-amber-600 p-2 rounded-full">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-amber-900">
                          Full Order Cash Payment
                        </p>
                        <p className="text-[12px] text-amber-700">
                          Collect total bill amount
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-amber-300 rounded-lg p-3">
                      <label className="text-[12px] text-neutral-600 mb-1 block">
                        Cash Amount to Collect (₹)
                      </label>
                      <input
                        type="text"
                        value={cashAmounts['full-order'] || ''}
                        onChange={(e) => handleCashAmountChange('full-order', e.target.value)}
                        placeholder="0.00"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                      <p className="text-[11px] text-amber-700 mt-2">
                        ✓ Default: ₹{selectedOrder.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
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
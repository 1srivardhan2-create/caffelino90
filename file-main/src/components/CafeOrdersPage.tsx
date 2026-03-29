import { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Download, Check, X, CreditCard, Smartphone, Banknote, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import CoffeeLoader from './CoffeeLoader';

interface Order {
  id: string;
  groupName: string;
  tableName: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMode: 'upi' | 'cash' | 'card';
  status: 'paid' | 'pending' | 'cancelled';
  orderTime: string;
  paidAt?: string;
}

const MOCK_ORDERS: Order[] = [];

export default function CafeOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading effect
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      // Simulate fetching orders data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const handleMarkPaid = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId
        ? { ...o, status: 'paid' as const, paidAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
        : o
    ));
    toast.success('Order marked as paid!');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: 'cancelled' as const } : o
    ));
    toast.success('Order cancelled');
  };

  const handleDownloadInvoice = (order: Order) => {
    setSelectedOrder(order);
    setShowInvoiceDialog(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalOrders: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const getPaymentIcon = (mode: string) => {
    switch (mode) {
      case 'upi': return <Smartphone className="size-4" />;
      case 'card': return <CreditCard className="size-4" />;
      case 'cash': return <Banknote className="size-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] leading-[36px] text-neutral-950 mb-2">🛒 Orders & Payments</h1>
        <p className="text-[14px] text-slate-600">Track and manage all orders and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Total Orders</p>
          <p className="text-[24px] leading-[32px] text-neutral-950">{stats.totalOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Paid</p>
          <p className="text-[24px] leading-[32px] text-green-600">{stats.paid}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Pending</p>
          <p className="text-[24px] leading-[32px] text-amber-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Cancelled</p>
          <p className="text-[24px] leading-[32px] text-red-600">{stats.cancelled}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-[12px] text-green-700 mb-1">Total Revenue</p>
          <p className="text-[24px] leading-[32px] text-green-600">₹{stats.totalRevenue}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by order ID or group name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-0"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'paid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('paid')}
            >
              Paid
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('cancelled')}
            >
              Cancelled
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Group/Table</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-[14px]">{order.id}</TableCell>
                <TableCell className="text-[14px]">
                  <div>
                    <p>{order.groupName}</p>
                    <p className="text-[12px] text-slate-500">{order.tableName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-[14px]">
                  <div className="text-[12px] text-slate-600">
                    {order.items.length} items
                  </div>
                </TableCell>
                <TableCell className="text-[14px]">₹{order.totalAmount}</TableCell>
                <TableCell className="text-[14px]">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(order.paymentMode)}
                    <span className="capitalize">{order.paymentMode}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'paid' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                          'outline'
                    }
                    className={
                      order.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-red-100 text-red-700 border-red-200'
                    }
                  >
                    {order.status === 'paid' ? '✅ Paid' :
                      order.status === 'pending' ? '⏳ Pending' :
                        '❌ Cancelled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkPaid(order.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    )}
                    {order.status === 'paid' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(order)}
                      >
                        <Download className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="size-16 text-slate-300 mx-auto mb-4" />
            <p className="text-[14px] text-slate-600">No orders found</p>
          </div>
        )}
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-[24px] leading-[32px] text-neutral-950">Café Milano</h2>
                <p className="text-[12px] text-slate-600">123 Coffee Street, Downtown</p>
                <p className="text-[12px] text-slate-600">Phone: +91 98765 43210</p>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Order ID:</span>
                  <span className="text-neutral-950">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Group:</span>
                  <span className="text-neutral-950">{selectedOrder.groupName}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Table:</span>
                  <span className="text-neutral-950">{selectedOrder.tableName}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-slate-600">Order Time:</span>
                  <span className="text-neutral-950">{selectedOrder.orderTime}</span>
                </div>
                {selectedOrder.paidAt && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-slate-600">Paid At:</span>
                    <span className="text-neutral-950">{selectedOrder.paidAt}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="border-t border-b py-4">
                <p className="text-[14px] text-neutral-950 mb-3">Items:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-[14px]">
                      <span className="text-slate-700">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-neutral-950">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-[18px] leading-[26px] text-neutral-950">Total Amount:</span>
                <span className="text-[24px] leading-[32px] text-green-600">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>

              {/* Payment Mode */}
              <div className="flex items-center justify-center gap-2 text-[14px] text-slate-600 bg-slate-50 p-3 rounded-lg">
                {getPaymentIcon(selectedOrder.paymentMode)}
                <span>Paid via {selectedOrder.paymentMode.toUpperCase()}</span>
              </div>

              {/* Download Button */}
              <Button
                onClick={() => toast.success('Invoice downloaded!')}
                className="w-full"
              >
                <Download className="size-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

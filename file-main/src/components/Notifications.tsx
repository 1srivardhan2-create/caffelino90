import { useState, useEffect } from 'react';
import { ArrowLeft, Users, DollarSign, ThumbsUp, Bell, CheckCheck, Trash2, Calendar, AlertCircle, UserPlus, X, Receipt, Download, CreditCard, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

interface NotificationsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'group' | 'payment' | 'vote' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionLabel?: string;
  actionData?: any;
  icon?: any;
  iconColor?: string;
  paymentDetails?: {
    amount: number;
    transactionId: string;
    paymentMethod: string;
    paidAt: string;
    groupName: string;
    cafeName?: string;
    orderNumber?: string;
    receiptUrl?: string;
    totalBill?: number;
    orderItems?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export default function Notifications({ user, onNavigate, onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  // Load notifications from localStorage on mount and set up real-time sync
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user || !user.id) return;
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications.map((n: any) => ({
          id: n._id,
          type: 'payment',
          title: 'Bill Update',
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          isRead: n.isRead,
          paymentDetails: n.metadata?.paymentDetails || {
             amount: n.message.match(/₹(\d+(?:\.\d+)?)/)?.[1] || 0,
             transactionId: n.orderId || 'N/A',
             paymentMethod: 'Cash/Online',
             paidAt: n.createdAt,
             groupName: 'Meetup Order',
          }
        })));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  // Filter only payment notifications (bills)
  const billNotifications = notifications.filter(notification => notification.type === 'payment');
  const unreadCount = billNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
    toast.success('All bills marked as read');
  };

  const deleteNotification = (id: string) => {
    const filtered = notifications.filter(n => n.id !== id);
    setNotifications(filtered);
    localStorage.setItem('userNotifications', JSON.stringify(filtered));
    toast.success('Bill deleted');
  };

  const clearAll = () => {
    const filtered = notifications.filter(n => n.type !== 'payment');
    setNotifications(filtered);
    localStorage.setItem('userNotifications', JSON.stringify(filtered));
    toast.success('All bills cleared');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="caffelino-back-btn mb-6"
        >
          ← Back
        </button>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Bills</h1>
            <p className="text-slate-600">
              {billNotifications.length > 0 
                ? `${billNotifications.length} bill${billNotifications.length > 1 ? 's' : ''}${unreadCount > 0 ? `, ${unreadCount} unread` : ''}` 
                : 'No bills yet'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {billNotifications.length > 0 && (
          <div className="flex gap-3 mb-6">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          </div>
        )}

        {/* Bills List */}
        <ScrollArea className="h-[600px]">
          {billNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-xl mb-2">No bills</h3>
              <p className="text-slate-600">
                Your payment bills will appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {billNotifications.map((notification) => {
                const Icon = notification.icon || Receipt;
                
                return (
                  <Card 
                    key={notification.id} 
                    className={`p-4 transition-all hover:shadow-md ${
                      !notification.isRead ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notification.iconColor || 'text-green-600 bg-green-100'}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className={!notification.isRead ? '' : 'text-slate-700'}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            aria-label="Delete notification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-slate-600 text-sm mb-2">
                          {notification.message}
                        </p>

                        {/* Bill Details Section - Expandable */}
                        {notification.paymentDetails && (
                          <div className="mt-3 mb-2">
                            <button
                              onClick={() => setExpandedNotification(
                                expandedNotification === notification.id ? null : notification.id
                              )}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
                            >
                              <Receipt className="w-4 h-4" />
                              {expandedNotification === notification.id ? 'Hide Bill Details' : 'View Bill Details'}
                            </button>

                            {expandedNotification === notification.id && (
                              <div className="mt-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                {/* Transaction Header */}
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                      <Receipt className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-600">Payment Receipt</p>
                                      <p className="font-mono text-xs text-slate-500">
                                        {notification.paymentDetails.transactionId}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-300">
                                    ✅ Paid
                                  </Badge>
                                </div>

                                {/* Amount */}
                                <div className="mb-4 text-center py-3 bg-white rounded-lg">
                                  <p className="text-sm text-slate-600 mb-1">Amount Paid</p>
                                  <p className="text-3xl font-bold text-green-600">
                                    ₹{notification.paymentDetails.amount}
                                  </p>
                                </div>

                                {/* Total Bill (if exists) */}
                                {notification.paymentDetails.totalBill !== undefined && (
                                  <div className="mb-4 text-center py-3 bg-white rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Total Food Bill</p>
                                    <p className="text-xl font-bold text-slate-800">
                                      ₹{notification.paymentDetails.totalBill}
                                    </p>
                                  </div>
                                )}

                                {/* Order Items */}
                                {notification.paymentDetails.orderItems && notification.paymentDetails.orderItems.length > 0 && (
                                  <div className="mb-4 p-3 bg-white rounded-lg">
                                    <p className="text-xs text-slate-500 mb-2">Order Items</p>
                                    <ul className="space-y-1">
                                      {notification.paymentDetails.orderItems.map((item, index) => (
                                        <li key={index} className="flex justify-between text-sm">
                                          <span className="text-slate-700">{item.name} x {item.quantity}</span>
                                          <span className="font-medium text-slate-900">₹{item.price}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Details Grid */}
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-slate-500 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-xs text-slate-500">Payment Method</p>
                                      <p className="text-sm font-medium text-slate-900">
                                        {notification.paymentDetails.paymentMethod}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-xs text-slate-500">Group Name</p>
                                      <p className="text-sm font-medium text-slate-900">
                                        {notification.paymentDetails.groupName}
                                      </p>
                                    </div>
                                  </div>

                                  {notification.paymentDetails.cafeName && (
                                    <div className="flex items-start gap-3">
                                      <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-500">Café</p>
                                        <p className="text-sm font-medium text-slate-900">
                                          {notification.paymentDetails.cafeName}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {notification.paymentDetails.orderNumber && (
                                    <div className="flex items-start gap-3">
                                      <Receipt className="w-5 h-5 text-slate-500 mt-0.5" />
                                      <div className="flex-1">
                                        <p className="text-xs text-slate-500">Order Number</p>
                                        <p className="text-sm font-medium text-slate-900">
                                          {notification.paymentDetails.orderNumber}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-xs text-slate-500">Paid At</p>
                                      <p className="text-sm font-medium text-slate-900">
                                        {new Date(notification.paymentDetails.paidAt).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Download Receipt Button */}
                                <Button
                                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                  onClick={() => toast.success('Receipt downloaded successfully')}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Receipt
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-3 mt-2">
                          <span className="text-xs text-slate-500">
                            {notification.time}
                          </span>

                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

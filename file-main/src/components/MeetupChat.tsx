import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Users, Receipt, UtensilsCrossed, ShoppingCart, CreditCard, Check, X, MapPin, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface MeetupChatProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'system' | 'bill' | 'payment';
  senderId?: string;
  senderName?: string;
  message?: string;
  timestamp: number;
  data?: any;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export default function MeetupChat({ user, meetupData, onNavigate, onBack }: MeetupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showBillingOptions, setShowBillingOptions] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [billGenerated, setBillGenerated] = useState(false);
  const [selectedBillingType, setSelectedBillingType] = useState<'split' | 'treat' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  const cafeFinalized = meetupData?.selectedCafe;

  // Mock cafe menu
  const cafeMenu: MenuItem[] = [
    { id: '1', name: 'Cappuccino', price: 150, category: 'Coffee' },
    { id: '2', name: 'Latte', price: 160, category: 'Coffee' },
    { id: '3', name: 'Espresso', price: 120, category: 'Coffee' },
    { id: '4', name: 'Cold Coffee', price: 180, category: 'Coffee' },
    { id: '5', name: 'Club Sandwich', price: 250, category: 'Food' },
    { id: '6', name: 'Veg Burger', price: 220, category: 'Food' },
    { id: '7', name: 'Pasta', price: 280, category: 'Food' },
    { id: '8', name: 'Chocolate Cake', price: 150, category: 'Dessert' },
    { id: '9', name: 'Brownie', price: 140, category: 'Dessert' },
    { id: '10', name: 'Fresh Juice', price: 130, category: 'Beverage' },
  ];

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        type: 'system',
        message: `Welcome to ${meetupData.meetupName || 'Meetup'}! All members can chat here.`,
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
    }

    // Set members from meetupData
    setMembers(meetupData?.members || [{ id: user.id, name: user.name, isAdmin }]);

    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send text message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      type: 'user',
      senderId: user.id,
      senderName: user.name,
      message: newMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add item to order
  const handleAddItem = (menuItem: MenuItem) => {
    const existing = orderItems.find((item) => item.menuItem.id === menuItem.id);
    if (existing) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems((prev) => [...prev, { menuItem, quantity: 1 }]);
    }
    toast.success(`Added ${menuItem.name}`);
  };

  const handleRemoveItem = (menuItemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.menuItem.id !== menuItemId));
  };

  const handleUpdateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(menuItemId);
      return;
    }
    setOrderItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Confirm order (Admin only)
  const handleConfirmOrder = () => {
    if (orderItems.length === 0) {
      toast.error('Please add items to order');
      return;
    }

    // Add system message
    const orderMsg: Message = {
      id: Date.now().toString(),
      type: 'system',
      message: `${user.name} confirmed the order with ${orderItems.length} items.`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, orderMsg]);
    setShowMenuModal(false);
    setShowBillingOptions(true);
    toast.success('Order confirmed! Choose billing option.');
  };

  // Generate bill
  const handleGenerateBill = (billingType: 'split' | 'treat') => {
    setSelectedBillingType(billingType);

    // Calculate bill
    const itemTotal = orderItems.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    const cgst = itemTotal * 0.025; // 2.5%
    const sgst = itemTotal * 0.025; // 2.5%
    const grandTotal = itemTotal + cgst + sgst;

    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    const amountPerPerson = billingType === 'split' ? grandTotal / members.length : grandTotal;

    // Add bill message to chat
    const billMsg: Message = {
      id: Date.now().toString(),
      type: 'bill',
      message: 'Bill Generated',
      timestamp: Date.now(),
      data: {
        orderId,
        adminName: user.name,
        items: orderItems,
        itemTotal,
        cgst,
        sgst,
        grandTotal,
        billingType,
        amountPerPerson,
        totalMembers: members.length,
      },
    };

    setMessages((prev) => [...prev, billMsg]);
    setBillGenerated(true);
    setShowBillingOptions(false);
    toast.success('Bill generated successfully!');
  };

  // Handle payment
  const handlePayment = (method: 'gpay' | 'phonepe') => {
    const paymentMsg: Message = {
      id: Date.now().toString(),
      type: 'payment',
      message: `Payment initiated via ${method === 'gpay' ? 'GPay' : 'PhonePe'}`,
      timestamp: Date.now(),
      data: {
        method,
        status: 'pending',
        user: user.name,
      },
    };

    setMessages((prev) => [...prev, paymentMsg]);
    
    // Simulate payment success after 2 seconds
    setTimeout(() => {
      const successMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        message: `✅ ${user.name} completed payment via ${method === 'gpay' ? 'GPay' : 'PhonePe'}`,
        timestamp: Date.now() + 1,
      };
      setMessages((prev) => [...prev, successMsg]);
      toast.success('Payment successful!');
    }, 2000);

    toast.info(`Redirecting to ${method === 'gpay' ? 'GPay' : 'PhonePe'}...`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Group menu by category
  const menuByCategory = cafeMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#be9d80]/10 via-white to-[#d9bf9d]/10 flex flex-col">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-[18px] font-['Arial:Regular',_sans-serif]">
                {meetupData.meetupName || 'Meetup Chat'}
              </h1>
              <p className="text-white/80 text-[12px] font-['Arial:Regular',_sans-serif]">
                {members.length} members
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('meetup-members', { ...meetupData, members })}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Users className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Selected Café Details Card */}
      {cafeFinalized && (
        <div className="bg-white border-b-2 border-neutral-200 shadow-sm">
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-gradient-to-br from-white to-neutral-50 rounded-xl border-2 border-[#be9d80] shadow-md overflow-hidden">
              {/* Café Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cafeFinalized.image}
                  alt={cafeFinalized.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Check className="w-4 h-4" />
                  <span className="text-[12px] font-['Arial:Bold',_sans-serif]">Selected</span>
                </div>
              </div>

              {/* Café Details */}
              <div className="p-4">
                <h3 className="text-[18px] font-['Arial:Bold',_sans-serif] text-neutral-900 mb-2">
                  {cafeFinalized.name}
                </h3>

                <div className="space-y-2">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[13px] font-['Arial:Regular',_sans-serif]">
                      {cafeFinalized.location} • {cafeFinalized.distance}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-green-600 text-green-600" />
                      <span className="text-[13px] font-['Arial:Bold',_sans-serif] text-green-700">
                        {cafeFinalized.rating}
                      </span>
                    </div>
                    <span className="text-[12px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                      ({cafeFinalized.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-[13px] font-['Arial:Regular',_sans-serif]">
                      Avg Cost per Person:
                    </span>
                    <span className="text-[15px] font-['Arial:Bold',_sans-serif]">
                      ₹{cafeFinalized.price}
                    </span>
                  </div>

                  {/* Ambiance */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-[13px] font-['Arial:Regular',_sans-serif] text-purple-600">
                      Ambiance: {cafeFinalized.ambiance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => {
            // System Message
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-blue-100 border border-blue-200 rounded-full px-4 py-2">
                    <p className="text-[13px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            }

            // Bill Message
            if (msg.type === 'bill' && msg.data) {
              const { orderId, adminName, items, itemTotal, cgst, sgst, grandTotal, billingType, amountPerPerson, totalMembers } = msg.data;
              return (
                <div key={msg.id} className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Receipt className="w-6 h-6 text-green-600" />
                    <h3 className="text-[18px] font-['Arial:Bold',_sans-serif] text-neutral-900">
                      Bill Generated
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Order ID */}
                    <div className="flex justify-between py-2 border-b border-neutral-200">
                      <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                        Order ID:
                      </span>
                      <span className="text-[14px] font-['Arial:Bold',_sans-serif] text-neutral-900">
                        {orderId}
                      </span>
                    </div>

                    {/* Admin Name */}
                    <div className="flex justify-between py-2 border-b border-neutral-200">
                      <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                        Admin:
                      </span>
                      <span className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                        {adminName}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="py-2">
                      <p className="text-[14px] text-neutral-600 font-['Arial:Bold',_sans-serif] mb-2">
                        Items:
                      </p>
                      {items.map((item: OrderItem, idx: number) => (
                        <div key={idx} className="flex justify-between py-1">
                          <span className="text-[13px] text-neutral-700 font-['Arial:Regular',_sans-serif]">
                            {item.menuItem.name} x {item.quantity}
                          </span>
                          <span className="text-[13px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-neutral-300 pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          Item Total:
                        </span>
                        <span className="text-[14px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          CGST (2.5%):
                        </span>
                        <span className="text-[14px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                          {formatCurrency(cgst)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          SGST (2.5%):
                        </span>
                        <span className="text-[14px] text-neutral-900 font-['Arial:Regular',_sans-serif]">
                          {formatCurrency(sgst)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-neutral-300">
                        <span className="text-[16px] font-['Arial:Bold',_sans-serif] text-neutral-900">
                          Grand Total:
                        </span>
                        <span className="text-[16px] font-['Arial:Bold',_sans-serif] text-green-600">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Billing Type */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      {billingType === 'split' ? (
                        <div>
                          <p className="text-[14px] font-['Arial:Bold',_sans-serif] text-yellow-900 mb-1">
                            💰 Split Bill
                          </p>
                          <p className="text-[13px] text-yellow-800 font-['Arial:Regular',_sans-serif]">
                            Each person pays: <span className="font-['Arial:Bold',_sans-serif]">{formatCurrency(amountPerPerson)}</span>
                          </p>
                          <p className="text-[12px] text-yellow-700 font-['Arial:Regular',_sans-serif] mt-1">
                            Total {totalMembers} members
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[14px] font-['Arial:Bold',_sans-serif] text-yellow-900 mb-1">
                            🎁 Host is Paying
                          </p>
                          <p className="text-[13px] text-yellow-800 font-['Arial:Regular',_sans-serif]">
                            {adminName} will pay the full amount
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Buttons */}
                    {billingType === 'split' || (billingType === 'treat' && isAdmin) ? (
                      <div className="space-y-2 mt-4">
                        <p className="text-[14px] font-['Arial:Bold',_sans-serif] text-neutral-900 mb-2">
                          Choose Payment Method:
                        </p>
                        <button
                          onClick={() => handlePayment('gpay')}
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <CreditCard className="w-5 h-5" />
                          <span className="text-[15px] font-['Arial:Regular',_sans-serif]">Pay with GPay</span>
                        </button>
                        <button
                          onClick={() => handlePayment('phonepe')}
                          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <CreditCard className="w-5 h-5" />
                          <span className="text-[15px] font-['Arial:Regular',_sans-serif]">Pay with PhonePe</span>
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-neutral-500 text-right mt-3 font-['Arial:Regular',_sans-serif]">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              );
            }

            // Payment Message
            if (msg.type === 'payment') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2">
                    <p className="text-[13px] text-purple-900 font-['Arial:Regular',_sans-serif]">
                      💳 {msg.message}
                    </p>
                  </div>
                </div>
              );
            }

            // User Message
            const isCurrentUser = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-[#be9d80] text-white text-[14px]">
                    {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isCurrentUser && (
                    <p className="text-[12px] text-neutral-600 mb-1 px-1 font-['Arial:Regular',_sans-serif]">
                      {msg.senderName}
                    </p>
                  )}
                  <div
                    className={`rounded-[12px] px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-[#be9d80] text-white'
                        : 'bg-white border border-neutral-200 text-neutral-950'
                    }`}
                  >
                    <p className="text-[15px] break-words font-['Arial:Regular',_sans-serif]">
                      {msg.message}
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 px-1 font-['Arial:Regular',_sans-serif]">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions (Admin Only - After Cafe Finalized) */}
      {isAdmin && cafeFinalized && !billGenerated && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t border-neutral-200 p-3 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setShowMenuModal(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-[15px] font-['Arial:Regular',_sans-serif]">
                {orderItems.length > 0 ? `View Order (${orderItems.length} items)` : 'Select Menu Items'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 p-4 shadow-lg">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 h-[48px] px-4 border-2 border-neutral-300 rounded-[24px] text-[15px] text-neutral-950 font-['Arial:Regular',_sans-serif] focus:outline-none focus:border-[#be9d80] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-[48px] h-[48px] rounded-full bg-[#be9d80] hover:bg-[#a88a6f] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Menu Modal (Admin Only) */}
      {showMenuModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#be9d80] p-4 flex items-center justify-between">
              <h2 className="text-[18px] font-['Arial:Bold',_sans-serif] text-white">
                Select Menu Items
              </h2>
              <button onClick={() => setShowMenuModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Current Order */}
              {orderItems.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="text-[16px] font-['Arial:Bold',_sans-serif] text-green-900 mb-3">
                    Current Order ({orderItems.length} items)
                  </h3>
                  {orderItems.map((item) => (
                    <div key={item.menuItem.id} className="flex items-center justify-between py-2 border-b border-green-200 last:border-0">
                      <div>
                        <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                          {item.menuItem.name}
                        </p>
                        <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          {formatCurrency(item.menuItem.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-700 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-[14px] font-['Arial:Bold',_sans-serif]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="w-7 h-7 bg-green-100 hover:bg-green-200 text-green-700 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-green-300 flex justify-between">
                    <span className="text-[15px] font-['Arial:Bold',_sans-serif] text-green-900">
                      Subtotal:
                    </span>
                    <span className="text-[15px] font-['Arial:Bold',_sans-serif] text-green-900">
                      {formatCurrency(
                        orderItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Menu Items by Category */}
              {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-[16px] font-['Arial:Bold',_sans-serif] text-neutral-900 mb-3 pb-2 border-b border-neutral-200">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <div>
                          <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddItem(item)}
                          className="px-4 py-2 bg-[#be9d80] hover:bg-[#a88a6f] text-white rounded-lg text-[13px] font-['Arial:Regular',_sans-serif] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 p-4">
              <button
                onClick={handleConfirmOrder}
                disabled={orderItems.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-[15px] font-['Arial:Regular',_sans-serif] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Order ({orderItems.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Options Modal */}
      {showBillingOptions && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-[20px] font-['Arial:Bold',_sans-serif] text-neutral-900 mb-4">
              Choose Billing Option
            </h2>
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-6">
              How would you like to split the bill?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleGenerateBill('split')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[16px] font-['Arial:Bold',_sans-serif]">Split Bill</p>
                    <p className="text-[13px] text-white/90 font-['Arial:Regular',_sans-serif]">
                      Divide equally among all members
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleGenerateBill('treat')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-4 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[16px] font-['Arial:Bold',_sans-serif]">No Split (Treat)</p>
                    <p className="text-[13px] text-white/90 font-['Arial:Regular',_sans-serif]">
                      You pay the full amount
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowBillingOptions(false)}
              className="w-full mt-4 text-neutral-600 hover:text-neutral-900 py-2 text-[14px] font-['Arial:Regular',_sans-serif]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

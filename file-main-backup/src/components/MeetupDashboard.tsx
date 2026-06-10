import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Check, MapPin, Users, Calendar, Clock, Send, ShoppingBag, Receipt, Vote } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { BASE_URL } from '../utils/api';

interface MeetupDashboardProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Mock cafe data
const MOCK_CAFES: any[] = [];

// Mock menu data
const MOCK_MENU: any[] = [];

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'action' | 'billing';
  sender?: string;
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; action: string; data?: any }>;
  billingData?: any;
}

export default function MeetupDashboard({ user, meetupData, onNavigate, onBack }: MeetupDashboardProps) {
  const [localMeetupData, setLocalMeetupData] = useState(meetupData);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cafes, setCafes] = useState<any[]>(MOCK_CAFES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: `Welcome to ${meetupData.meetupName}! Voting for café selection is now open.`,
      timestamp: new Date()
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Safety check
  if (!meetupData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">No meetup data found</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-[#be9d80] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = localMeetupData?.isAdmin === true;
  const joinedUsers = localMeetupData?.members || [];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle copy join code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(localMeetupData.code);
    setCodeCopied(true);
    toast.success('Join code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Handle cafe voting
  const handleVoteCafe = (cafeId: string) => {
    setCafes(prevCafes => 
      prevCafes.map(cafe => 
        cafe.id === cafeId 
          ? { ...cafe, votes: cafe.votes + 1 }
          : cafe
      )
    );
    
    const votedCafe = cafes.find(c => c.id === cafeId);
    
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      sender: user.name || user.firstName,
      content: `Voted for ${votedCafe?.name}`,
      timestamp: new Date()
    }]);

    toast.success(`Voted for ${votedCafe?.name}!`);
  };

  // Handle finalize café (admin only)
  const handleFinalizeCafe = () => {
    if (!isAdmin) {
      toast.error('Only admin can finalize café');
      return;
    }

    // Find café with most votes
    const winnerCafe = [...cafes].sort((a, b) => b.votes - a.votes)[0];

    setLocalMeetupData({
      ...localMeetupData,
      cafeSelectionPhase: 'finalized',
      finalizedCafe: winnerCafe,
      menuItems: MOCK_MENU
    });

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: `✅ Café finalized: ${winnerCafe.name}. Menu is now available!`,
      timestamp: new Date()
    }]);

    toast.success(`${winnerCafe.name} finalized!`);
  };

  // Handle add item to order (admin only)
  const handleAddItem = (item: any) => {
    if (!isAdmin) {
      toast.error('Only admin can add items to order');
      return;
    }

    const existingItem = orderItems.find(i => i.id === item.id);
    
    if (existingItem) {
      setOrderItems(prev => 
        prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setOrderItems(prev => [...prev, { ...item, quantity: 1 }]);
    }

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: `Added ${item.name} to order`,
      timestamp: new Date()
    }]);

    toast.success(`${item.name} added!`);
  };

  // Handle place order (admin only)
  const handlePlaceOrder = () => {
    if (!isAdmin) {
      toast.error('Only admin can place orders');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Add items to order first');
      return;
    }

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: '⏳ Order placed! Waiting for café owner confirmation...',
      timestamp: new Date()
    }]);

    toast.success('Order placed!');

    // Simulate café owner confirmation after 3 seconds
    setTimeout(() => {
      setLocalMeetupData((prev: any) => ({
        ...prev,
        orderStatus: 'confirmed'
      }));

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'action',
        content: '✅ Order confirmed by café owner! Please select billing option:',
        timestamp: new Date(),
        actions: isAdmin ? [
          { label: 'Split Bill', action: 'split-bill' },
          { label: 'No Split (Treat)', action: 'no-split' }
        ] : []
      }]);

      toast.success('Order confirmed!');
    }, 3000);
  };

  // Calculate bill with GST
  const calculateBill = () => {
    const itemTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cgst = itemTotal * 0.025; // 2.5%
    const sgst = itemTotal * 0.025; // 2.5%
    const totalTax = cgst + sgst;
    const grandTotal = itemTotal + totalTax;
    
    return { itemTotal, cgst, sgst, totalTax, grandTotal };
  };

  // Handle billing action from chat
  const handleChatAction = (action: string, data?: any) => {
    if (action === 'split-bill') {
      if (!isAdmin) {
        toast.error('Only admin can select billing type');
        return;
      }

      const bill = calculateBill();
      const perPersonAmount = Math.ceil(bill.grandTotal / joinedUsers.length);

      setLocalMeetupData({
        ...localMeetupData,
        billingType: 'split'
      });

      // Generate Order ID
      const orderId = `ORD${Date.now().toString().slice(-8)}`;

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'billing',
        content: '💰 Bill Split Selected',
        timestamp: new Date(),
        billingData: {
          orderId,
          type: 'split',
          ...bill,
          perPersonAmount,
          numberOfPeople: joinedUsers.length
        },
        actions: [
          { label: 'Pay Online', action: 'pay-online' },
          { label: 'Pay Cash', action: 'pay-cash' }
        ]
      }]);

      toast.success('Bill will be split equally!');
    } else if (action === 'no-split') {
      if (!isAdmin) {
        toast.error('Only admin can select billing type');
        return;
      }

      const bill = calculateBill();
      const orderId = `ORD${Date.now().toString().slice(-8)}`;

      setLocalMeetupData({
        ...localMeetupData,
        billingType: 'no-split'
      });

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'billing',
        content: '💚 No Split (Treat)',
        timestamp: new Date(),
        billingData: {
          orderId,
          type: 'no-split',
          ...bill,
          message: isAdmin ? 'You will cover the entire bill' : 'Payment handled by host'
        },
        actions: isAdmin ? [
          { label: 'Pay Online', action: 'pay-online' },
          { label: 'Pay Cash', action: 'pay-cash' }
        ] : []
      }]);

      toast.success(isAdmin ? 'You will cover the bill' : 'Host will cover the bill');
    } else if (action === 'pay-online' || action === 'pay-cash') {
      const paymentMethod = action === 'pay-online' ? 'Online' : 'Cash';
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: `💳 Payment initiated via ${paymentMethod}...`,
        timestamp: new Date()
      }]);

      toast.success(`${paymentMethod} payment initiated!`);
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      sender: user.name || user.firstName,
      content: messageInput,
      timestamp: new Date()
    }]);

    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Meetup Dashboard</h1>
              {/* Role Badge */}
              <span className={cn(
                "px-3 py-1 rounded-full text-[11px] font-['Arial:Bold',_sans-serif]",
                isAdmin 
                  ? "bg-yellow-400/90 text-yellow-900" 
                  : "bg-blue-400/90 text-blue-900"
              )}>
                {isAdmin ? "ADMIN" : "MEMBER"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT COLUMN: Fixed Sections */}
          <div className="lg:col-span-1 space-y-4">
            {/* 1️⃣ Meetup Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
              <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-4">
                {localMeetupData.meetupName}
              </h2>
              
              <div className="space-y-3 text-[14px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{localMeetupData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{localMeetupData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Admin: {localMeetupData.adminName}</span>
                </div>
              </div>

              {/* Join Code (Admin Only) */}
              {isAdmin && (
                <div className="mt-4 bg-gradient-to-r from-[#be9d80]/10 to-[#d9bf9d]/10 rounded-lg p-4 border border-[#be9d80]/20">
                  <p className="text-[12px] text-neutral-600 mb-1">Join Code</p>
                  <div className="flex items-center gap-3">
                    <code className="text-[20px] font-['Arial:Bold',_sans-serif] text-[#8b5943] tracking-widest">
                      {localMeetupData.code}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-[#be9d80]/20 rounded-lg transition-colors"
                    >
                      {codeCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#8b5943]" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2️⃣ Café Selection (Voting) */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                  Café Selection
                </h3>
                {localMeetupData.cafeSelectionPhase === 'finalized' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] rounded-full">
                    Finalized
                  </span>
                )}
              </div>

              {localMeetupData.cafeSelectionPhase === 'finalized' && localMeetupData.finalizedCafe ? (
                // Show finalized cafe
                <div className="border border-green-200 rounded-lg overflow-hidden bg-green-50/50">
                  <img
                    src={localMeetupData.finalizedCafe.ambience}
                    alt={localMeetupData.finalizedCafe.name}
                    className="w-full h-[150px] object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-1">
                      {localMeetupData.finalizedCafe.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[13px] text-neutral-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{localMeetupData.finalizedCafe.location}</span>
                    </div>
                    <p className="text-[14px] text-neutral-700">
                      ₹{localMeetupData.finalizedCafe.avgCost}/person
                    </p>
                  </div>
                </div>
              ) : (
                // Show voting
                <div className="space-y-3">
                  {cafes.map((cafe) => (
                    <div
                      key={cafe.id}
                      className="border border-neutral-200 rounded-lg overflow-hidden hover:border-[#be9d80] transition-all"
                    >
                      <img
                        src={cafe.ambience}
                        alt={cafe.name}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="p-3">
                        <h4 className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-1">
                          {cafe.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[12px] text-neutral-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{cafe.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] text-neutral-700">₹{cafe.avgCost}/person</p>
                          <button
                            onClick={() => handleVoteCafe(cafe.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-[#be9d80] hover:bg-[#a88968] text-white text-[12px] rounded-lg transition-colors"
                          >
                            <Vote className="w-3 h-3" />
                            Vote ({cafe.votes})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAdmin && (
                    <Button
                      onClick={handleFinalizeCafe}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Finalize Café
                    </Button>
                  )}

                  {!isAdmin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-[12px] text-blue-700">
                        ⏳ Waiting for admin to finalize café...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menu Section (After Café Finalized) */}
            {localMeetupData.cafeSelectionPhase === 'finalized' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900 mb-4">
                  Menu
                </h3>

                <div className="space-y-3">
                  {MOCK_MENU.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border border-neutral-200 rounded-lg p-3">
                      <img
                        src={item.image?.startsWith('/uploads/') ? `${BASE_URL}${item.image}` : item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-[13px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-neutral-600">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                          ₹{item.price}
                        </p>
                        {isAdmin && localMeetupData.orderStatus === 'pending' && (
                          <button
                            onClick={() => handleAddItem(item)}
                            className="text-[11px] text-[#be9d80] hover:text-[#a88968] mt-1"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isAdmin && localMeetupData.orderStatus === 'pending' && orderItems.length > 0 && (
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 bg-[#be9d80] hover:bg-[#a88968] text-white"
                  >
                    Place Order ({orderItems.length} items)
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Chat (PRIMARY CONTROL CENTER) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 h-[calc(100vh-120px)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200">
                <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-900">
                  💬 Group Chat & Actions
                </h3>
                <p className="text-[12px] text-neutral-600">
                  All ordering and billing happens here
                </p>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ 
                  backgroundImage: "linear-gradient(243.359deg, rgb(139, 89, 67) 1.444%, rgb(217, 191, 157) 50.058%, rgb(139, 89, 67) 99.616%)" 
                }}
              >
                {chatMessages.map((message) => (
                  <div key={message.id}>
                    {message.type === 'system' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <p className="text-[13px] text-blue-700">{message.content}</p>
                      </div>
                    )}

                    {message.type === 'user' && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#be9d80] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[12px]">
                            {message.sender?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[12px] text-neutral-600 mb-1">{message.sender}</p>
                          <div className="bg-neutral-100 rounded-lg p-3">
                            <p className="text-[14px] text-neutral-900">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {message.type === 'action' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-[14px] text-green-700 mb-3">{message.content}</p>
                        {message.actions && message.actions.length > 0 && (
                          <div className="flex gap-2">
                            {message.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleChatAction(action.action, action.data)}
                                className={cn(
                                  "px-4 py-2 rounded-lg text-[13px] transition-colors",
                                  action.action === 'split-bill'
                                    ? "bg-[#be9d80] hover:bg-[#a88968] text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                )}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {message.type === 'billing' && message.billingData && (
                      <div className="bg-gradient-to-br from-[#be9d80]/10 to-[#d9bf9d]/10 border border-[#be9d80]/30 rounded-lg p-4">
                        <p className="text-[16px] font-['Arial:Bold',_sans-serif] text-[#8b5943] mb-3">
                          {message.content}
                        </p>
                        
                        <div className="bg-white rounded-lg p-4 mb-3 border border-neutral-200">
                          <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Order ID:</span>
                              <span className="font-['Arial:Bold',_sans-serif] text-neutral-900">
                                {message.billingData.orderId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Item Total:</span>
                              <span className="text-neutral-900">₹{message.billingData.itemTotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">CGST (2.5%):</span>
                              <span className="text-neutral-900">₹{message.billingData.cgst?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">SGST (2.5%):</span>
                              <span className="text-neutral-900">₹{message.billingData.sgst?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-neutral-200 pt-2">
                              <span className="text-neutral-600">Total Tax:</span>
                              <span className="text-neutral-900">₹{message.billingData.totalTax?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-['Arial:Bold',_sans-serif] border-t-2 border-neutral-300 pt-2">
                              <span className="text-neutral-900">Grand Total:</span>
                              <span className="text-[#8b5943] text-[16px]">
                                ₹{message.billingData.grandTotal?.toFixed(2)}
                              </span>
                            </div>
                            
                            {message.billingData.type === 'split' && (
                              <div className="flex justify-between bg-blue-50 p-2 rounded mt-2">
                                <span className="text-blue-700 font-['Arial:Bold',_sans-serif]">Your Share:</span>
                                <span className="text-blue-700 font-['Arial:Bold',_sans-serif] text-[16px]">
                                  ₹{message.billingData.perPersonAmount}
                                </span>
                              </div>
                            )}

                            {message.billingData.message && (
                              <div className="bg-green-50 p-2 rounded mt-2">
                                <p className="text-[12px] text-green-700 text-center font-['Arial:Bold',_sans-serif]">
                                  ✅ {message.billingData.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {message.actions && message.actions.length > 0 ? (
                          <div className="space-y-2">
                            {message.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleChatAction(action.action, action.data)}
                                className={cn(
                                  "w-full px-4 py-3 rounded-lg text-[14px] transition-colors",
                                  action.action === 'pay-online'
                                    ? "bg-[#be9d80] hover:bg-[#a88968] text-white"
                                    : "bg-white hover:bg-neutral-50 border-2 border-[#be9d80] text-[#8b5943]"
                                )}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          message.billingData.type === 'no-split' && !isAdmin && (
                            <div className="bg-neutral-100 border border-neutral-300 rounded-lg p-3 text-center">
                              <p className="text-[12px] text-neutral-600 italic">
                                Payment buttons visible to host only
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-neutral-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#be9d80] focus:ring-2 focus:ring-[#be9d80]/20"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-[#be9d80] hover:bg-[#a88968] text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

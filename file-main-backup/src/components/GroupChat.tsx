import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Users, Receipt, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { chatAPI } from '../utils/api';
import { meetupMemberDB } from '../utils/database';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { updateGroupStage } from '../utils/groupStateManager';

interface GroupChatProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function GroupChat({ user, meetupData, onNavigate, onBack }: GroupChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  // Check if user just placed an order and add it to chat
  useEffect(() => {
    if (meetupData.userOrder) {
      const orderMessage = {
        id: `order-${Date.now()}`,
        meetup_id: meetupData.meetupId,
        sender_id: user.id,
        sender_name: user.name || user.email,
        type: 'order',
        timestamp: new Date().toISOString(),
        orderData: meetupData.userOrder
      };
      
      // Add order to messages
      setMessages(prev => [...prev, orderMessage]);
      
      // Add order to userOrders state
      setUserOrders(prev => [...prev, meetupData.userOrder]);
      
      toast.success('Your order has been added to the chat!');
    }
  }, []);

  // Save navigation state when component mounts
  useEffect(() => {
    if (user?.id && meetupData?.code) {
      const stage = meetupData.orderConfirmed ? 'payment' : (meetupData.orderingStarted ? 'menu-selection' : 'chat');
      const status = meetupData.orderConfirmed ? 'Payment' : (meetupData.orderingStarted ? 'Ordering' : 'Active');
      
      updateGroupStage(
        user.id,
        meetupData.code,
        stage,
        status,
        'group-chat',
        meetupData
      );
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchMembers();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMembers = async () => {
    try {
      const response = await meetupMemberDB.getByMeetup(meetupData.meetupId);
      setMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages(meetupData.meetupId);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    try {
      const message = {
        id: `msg-${meetupData.meetupId}-${user.id}-${Date.now()}`,
        meetup_id: meetupData.meetupId,
        sender_id: user.id,
        sender_name: user.name || user.email,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      await chatAPI.saveMessage(meetupData.meetupId, message);
      setMessages([...messages, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#be9d80] sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Arial:Regular',_sans-serif] text-[16px]">Back</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="font-['Arial:Regular',_sans-serif] text-[18px] text-white">
              {meetupData.meetupName}
            </h1>
            <p className="font-['Arial:Regular',_sans-serif] text-[12px] text-white/80">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => onNavigate('meetup-members', { ...meetupData, members })}
            className="text-white"
          >
            <Users className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Billing Info Banner */}
      {meetupData.billingInfo && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-700" />
              <div>
                <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-green-900">
                  Total Bill: ₹{meetupData.billingInfo.total_bill}
                </p>
                <p className="font-['Arial:Regular',_sans-serif] text-[12px] text-green-700">
                  {meetupData.billingInfo.payment_type === 'split' 
                    ? `₹${Math.round(meetupData.billingInfo.amount_per_person)} per person`
                    : 'Single payer mode'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('member-billing-screen', meetupData)}
              className="text-green-700 font-['Arial:Regular',_sans-serif] text-[13px] underline hover:text-green-900"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-600">
              No messages yet
            </p>
            <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-500 mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender_id === user.id;
            
            // Order Message
            if (msg.type === 'order' && msg.orderData) {
              const order = msg.orderData;
              return (
                <div key={msg.id} className="bg-white rounded-xl border-2 border-[#be9d80] shadow-lg p-6 mx-auto max-w-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-6 h-6 text-[#be9d80]" />
                      <div>
                        <h3 className="font-['Arial:Bold',_sans-serif] text-[18px] text-neutral-950">
                          {isCurrentUser ? 'Your Order' : `${msg.sender_name}'s Order`}
                        </h3>
                        <p className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-600">
                          Order #{order.orderId}
                        </p>
                      </div>
                    </div>
                    <p className="font-['Arial:Regular',_sans-serif] text-[12px] text-neutral-500">
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 space-y-2">
                    <h4 className="font-['Arial:Bold',_sans-serif] text-[14px] text-neutral-700 mb-2">Items:</h4>
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-950">
                            {item.name}
                          </span>
                          <span className="font-['Arial:Regular',_sans-serif] text-[13px] text-neutral-600">
                            x {item.quantity}
                          </span>
                        </div>
                        <span className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-950">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bill Breakdown */}
                  <div className="border-t border-neutral-200 pt-4 space-y-2">
                    <div className="flex justify-between text-[14px]">
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">Subtotal</span>
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">CGST (5%)</span>
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{order.cgst}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">SGST (5%)</span>
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{order.sgst}</span>
                    </div>
                    <div className="flex justify-between text-[18px] font-['Arial:Bold',_sans-serif] pt-2 border-t border-neutral-300">
                      <span className="text-neutral-950">Total</span>
                      <span className="text-[#be9d80]">₹{order.total}</span>
                    </div>
                  </div>

                  {/* Add More Items Button - Only show for current user */}
                  {isCurrentUser && (
                    <button
                      onClick={() => onNavigate('menu-selection-member', meetupData)}
                      className="w-full mt-4 bg-[#030213] text-white py-3 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-[#030213]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <UtensilsCrossed className="w-5 h-5" />
                      Add More Items
                    </button>
                  )}

                  {/* Payment Status Badge */}
                  {order.paymentMethod && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between">
                        <span className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600">
                          Payment Method:
                        </span>
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'cash' ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[13px] font-['Arial:Regular',_sans-serif]">
                              💵 Cash
                            </span>
                          ) : order.paymentMethod === 'gpay' ? (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[13px] font-['Arial:Regular',_sans-serif]">
                              💳 GPay
                            </span>
                          ) : (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[13px] font-['Arial:Regular',_sans-serif]">
                              💳 PhonePe
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600">
                          Status:
                        </span>
                        {order.paymentStatus === 'paid' ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[13px] font-['Arial:Regular',_sans-serif]">
                            ✅ Paid
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[13px] font-['Arial:Regular',_sans-serif]">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Regular Text Message
            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-[#be9d80] text-white text-[14px]">
                    {msg.sender_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isCurrentUser && (
                    <p className="font-['Arial:Regular',_sans-serif] text-[12px] text-neutral-600 mb-1 px-1">
                      {msg.sender_name}
                    </p>
                  )}
                  <div
                    className={`rounded-[12px] px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-[#be9d80] text-white'
                        : 'bg-white border border-neutral-200 text-neutral-950'
                    }`}
                  >
                    <p className="font-['Arial:Regular',_sans-serif] text-[15px] break-words">
                      {msg.message}
                    </p>
                  </div>
                  <p className="font-['Arial:Regular',_sans-serif] text-[11px] text-neutral-500 mt-1 px-1">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions Bar */}
      <div className="sticky bottom-[72px] bg-white border-t border-neutral-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            onClick={() => onNavigate('unified-cafe-menu', { 
              ...meetupData, 
              isAdmin,
              viewOnly: !isAdmin,
              readOnlyMenu: !isAdmin 
            })}
            variant="outline"
            className="flex-1 h-[44px] bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:from-orange-100 hover:to-amber-100 text-orange-700 font-['Arial:Regular',_sans-serif] text-[15px]"
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            {isAdmin ? 'Manage Menu' : 'View Menu'}
          </Button>
          {isAdmin && meetupData.orderConfirmed && (
            <Button
              onClick={() => onNavigate('unified-bill-screen', meetupData)}
              className="flex-1 h-[44px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-['Arial:Regular',_sans-serif] text-[15px]"
            >
              <Receipt className="w-5 h-5 mr-2" />
              View Bill
            </Button>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t-2 border-neutral-200 p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 h-[48px] px-4 border-2 border-neutral-300 rounded-[24px] font-['Arial:Regular',_sans-serif] text-[15px] text-neutral-950 focus:outline-none focus:border-[#be9d80] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="w-[48px] h-[48px] rounded-full bg-[#be9d80] hover:bg-[#a88a6f] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

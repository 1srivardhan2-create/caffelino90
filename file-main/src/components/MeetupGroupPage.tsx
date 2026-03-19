import { 
  MapPin, 
  Users, 
  MessageCircle,
  ShoppingCart,
  Bell,
  Send,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import imgLogo from '../assets/logo.svg';
import { getAvatarById } from '../utils/avatarData';
import GenderAvatar from './GenderAvatar';
import ChatPaymentMessage from './ChatPaymentMessage';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface MeetupGroupPageProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
}

type Tab = 'chat' | 'members';

export default function MeetupGroupPage({ user, meetupData, onNavigate }: MeetupGroupPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>(() => {
    const initialMessages = [
      { id: '1', sender: 'System', message: `Welcome to ${meetupData?.groupName}!`, timestamp: new Date(), type: 'text' }
    ];
    
    // If order confirmed, add payment message
    if (meetupData?.orderConfirmed && meetupData?.adminOrder) {
      // Calculate total dynamically from items
      const items = meetupData.adminOrder.items || [];
      const totalAmount = items.reduce((sum: number, item: any) => 
        sum + (item.price * item.quantity), 0
      );
      const memberCount = meetupData.members?.length || 1;
      const perPersonAmount = totalAmount / memberCount;
      
      initialMessages.push({
        id: 'payment-' + Date.now(),
        sender: 'System',
        type: 'payment',
        totalAmount,
        userAmount: perPersonAmount,
        timestamp: new Date()
      });
    }
    
    return initialMessages;
  });
  const [members, setMembers] = useState(meetupData?.members || [
    { id: user.id, name: user.name, avatar: user.avatar, status: 'approved' }
  ]);

  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: user.name,
        message: chatMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  useEffect(() => {
    if (meetupData?.paymentStatus) {
      const paymentMessage = new ChatPaymentMessage({
        sender: 'System',
        message: `Payment status: ${PAYMENT_STATUS[meetupData.paymentStatus]}`,
        timestamp: new Date()
      });
      setChatMessages([...chatMessages, paymentMessage]);
    }
  }, [meetupData?.paymentStatus]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Exact Figma Design */}
      <div className="bg-[#be9d80] border-b border-[#a88968]">
        {/* Top Header Bar - Back Button + Logo + Bell + Avatar */}
        <div className="h-14 px-3 md:px-4 flex items-center justify-between border-b border-[#a88968]/30">
          {/* Left Section - Back Button + Logo */}
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full hover:bg-[#a88968] transition-colors w-9 h-9 flex items-center justify-center"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            {/* Logo */}
            <div
              className="cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <img
                src={imgLogo}
                alt="Logo"
                className="h-[32px] md:h-[40px] w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Section - Bell + Avatar (Exact Figma) */}
          <div className="relative h-9 w-[84px]">
            {/* Bell Button - Position: left 0 */}
            <button
              className="absolute left-0 top-0 p-2 rounded-full hover:bg-[#a88968] transition-colors w-9 h-9 flex items-center justify-center"
              aria-label="Notifications"
              onClick={() => onNavigate('notifications')}
            >
              <Bell className="w-5 h-5 text-white" />
            </button>

            {/* Avatar Button - Position: left 48px */}
            <button
              onClick={() => onNavigate('profile')}
              aria-label="Profile"
              className="absolute left-12 top-0 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white/20 border-[1.6px] border-white/40 hover:opacity-80 transition-opacity"
            >
              {user.avatarId && (user.gender === 'male' || user.gender === 'female') && user.firstName ? (
                <span className="text-2xl">
                  {getAvatarById(user.avatarId)?.emoji}
                </span>
              ) : (
                <GenderAvatar
                  photo={user.photo}
                  gender={user.gender}
                  name={user.firstName || user.name}
                  size="sm"
                />
              )}
            </button>
          </div>
        </div>

        {/* Meetup Info Section */}
        <div className="px-4 py-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-black text-[20px] font-['Arial:Regular',_sans-serif]">{meetupData?.groupName}</h1>
                <div className="flex items-center gap-2 text-black/70 text-[12px] font-['Arial:Regular',_sans-serif] mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{meetupData?.winnerCafe?.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg mb-1">
                  <p className="text-black text-[14px] font-['Arial:Regular',_sans-serif] font-medium">
                    Code: {meetupData?.code}
                  </p>
                </div>
                <p className="text-black/70 text-[12px] font-['Arial:Regular',_sans-serif]">
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] whitespace-nowrap transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#8b5943]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] whitespace-nowrap transition-colors ${
                  activeTab === 'members'
                    ? 'bg-white text-[#8b5943]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Users className="w-4 h-4" />
                Members
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
            {/* View Menu Banner for Members */}
            {!isAdmin && meetupData?.winnerCafe && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-green-900 font-bold">
                        Menu Available
                      </p>
                      <p className="text-[12px] text-green-700">
                        View what the admin has ordered for the group
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('menu-preview', meetupData)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-[14px] font-['Arial:Regular',_sans-serif] font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    View Menu
                  </button>
                </div>
              </div>
            )}
            
            {/* Chat Messages - Scrollable Area with padding for button */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-[140px]">
              {chatMessages.map((msg) => {
                // Render payment message component
                if (msg.type === 'payment') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="w-full max-w-[600px]">
                        <ChatPaymentMessage
                          user={user}
                          meetupData={meetupData}
                          totalAmount={msg.totalAmount}
                          userAmount={msg.userAmount}
                          onNavigate={onNavigate}
                        />
                      </div>
                    </div>
                  );
                }
                
                // Render regular text message
                return (
                  <div key={msg.id} className={`flex ${msg.sender === user.name ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'System'
                        ? 'bg-neutral-100 text-center w-full max-w-full'
                        : msg.sender === user.name
                        ? 'bg-[#8b5943] text-white'
                        : 'bg-neutral-100 text-neutral-900'
                    }`}>
                      {msg.sender !== 'System' && (
                        <p className="text-[12px] font-medium mb-1 opacity-80">{msg.sender}</p>
                      )}
                      <p className="text-[14px] font-['Arial:Regular',_sans-serif]">{msg.message}</p>
                      <p className="text-[10px] opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input - Fixed at bottom of chat area */}
            <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3">
              <div className="max-w-[1400px] mx-auto flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-neutral-300 rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-[#8b5943] text-white px-6 py-3 rounded-lg hover:bg-[#8b5943]/90 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Members</h2>
            
            {/* Members List */}
            <div className="space-y-2">
              {members.map((member: any) => (
                <div key={member.id} className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#8b5943]/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#8b5943]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">{member.name}</p>
                      {member.id === user.id && (
                        <p className="text-[12px] text-neutral-600">You</p>
                      )}
                    </div>
                  </div>
                  {(member.name === meetupData?.adminName || member.id === meetupData?.adminId) && (
                    <span className="bg-[#8b5943] text-white px-3 py-1 rounded-full text-[12px] font-['Arial:Regular',_sans-serif]">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button - Place Order (Admin Only) */}
      {isAdmin && meetupData?.winnerCafe && (
        <div className="fixed bottom-4 right-6 z-50">
          <button
            onClick={() => onNavigate('menu-selection', meetupData)}
            className="bg-green-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-105 flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-[16px] font-['Arial:Regular',_sans-serif] font-medium">
              {meetupData?.adminOrder ? 'Edit Order' : 'Place Order'}
            </span>
          </button>
        </div>
      )}
      
      {/* Info Banner - Café Not Selected Yet (Admin) */}
      {isAdmin && !meetupData?.winnerCafe && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[600px] w-[calc(100%-2rem)]">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-lg">
            <p className="text-[13px] text-amber-900 font-['Arial:Regular',_sans-serif] text-center">
              ⚠️ <span className="font-bold">Menu not available yet.</span> Complete café selection and voting first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
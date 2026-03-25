import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Users, Coffee, Send, ShoppingCart, Plus, Minus, Receipt, CreditCard, Banknote, Check, Edit2, MapPin, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import POSMenuInterface, { POSConfirmData } from './POSMenuInterface';
import { saveGroupState } from '../utils/groupStateManager';
import { notifyPaymentSuccess, getUnreadCount } from '../utils/notificationManager';
import { socketService } from '../services/socketService';
import { getAvatarById } from '../utils/avatarData';
import { BASE_URL } from '../utils/api';

interface MeetupChatBillingProps {
  user: any;
  meetupData: {
    _id?: string;
    id?: string;
    adminName: string;
    adminId: string;
    organizerId?: string;
    date: string;
    time: string;
    joinCode: string;
    meetupCode?: string;
    selectedCafe?: any;
    selectedCafes?: any[];
    members: any[];
    isAdmin?: boolean;
    joinedViaCode?: boolean;
  } | null;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
  onNotificationUpdate?: () => void; // Add callback for notification updates
}

interface Message {
  id: string;
  type: 'user' | 'system' | 'bill' | 'payment';
  sender?: string;
  senderEmoji?: string;
  text?: string;
  timestamp: Date;
  billData?: any;
  paymentData?: any;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Real menu is now fetched from API

export default function MeetupChatBilling({ user, meetupData, onNavigate, onBack, onNotificationUpdate }: MeetupChatBillingProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [showOrderSection, setShowOrderSection] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [splitBill, setSplitBill] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [commissionAmount, setCommissionAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(meetupData?.members?.length || 1);
  const [membersList, setMembersList] = useState<any[]>(meetupData?.members || []);
  const [tokenPaid, setTokenPaid] = useState(false);
  const [splitMembers, setSplitMembers] = useState<string[]>([]);
  const [perPersonAmount, setPerPersonAmount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || user?._id || (meetupData as any)?.user?.id || (meetupData as any)?.user?._id || null;
  const meetupAdminId = meetupData?.organizerId || meetupData?.adminId || null;

  // Add safety check for meetupData
  if (!meetupData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#be9d80]/20 rounded-full flex items-center justify-center mb-4">
          <Coffee className="w-10 h-10 text-[#be9d80]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Meetup session loading...</h2>
        <p className="text-gray-600 mb-6 max-w-xs">We're getting your chat ready. If it doesn't load soon, try going back and opening it again.</p>
        <Button 
          onClick={() => onNavigate('home')}
          className="bg-[#be9d80] text-white hover:bg-[#a88968]"
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  // Ensure _id exists if meetupId was passed instead
  const meetupId = meetupData._id || (meetupData as any).meetupId;
  const isAdmin = meetupData?.isAdmin === false || (meetupData as any)?.joinedViaCode === true
    ? false
    : !!((currentUserId && meetupAdminId && currentUserId === meetupAdminId) || meetupData?.isAdmin === true);
  const selectedCafe = meetupData?.selectedCafe || meetupData?.selectedCafes?.[0];

  // Get storage key for this meetup
  const getStorageKey = () => {
    const code = meetupData?.meetupCode || meetupData?.joinCode;
    if (!code) return null;
    return `meetup_chat_${code}`;
  };

  // Load saved chat data from localStorage (Local states for orders)
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey || isDataLoaded) return;

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        setOrderItems(parsed.orderItems || []);
        setOrderConfirmed(parsed.orderConfirmed || false);
        setOrderId(parsed.orderId || '');
        setSplitBill(parsed.splitBill || false);
        setPaymentCompleted(parsed.paymentCompleted || false);
        setCommissionAmount(parsed.commissionAmount || 0);
        setCgstAmount(parsed.cgstAmount || 0);
        setSgstAmount(parsed.sgstAmount || 0);
        setNumberOfPeople(parsed.numberOfPeople || meetupData?.members?.length || 1);
        setTokenPaid(parsed.tokenPaid || false);
        setSplitMembers(parsed.splitMembers || []);
        setPerPersonAmount(parsed.perPersonAmount || 0);
        console.log('💾 Loaded saved order data for meetup:', meetupData?.joinCode);
        
        // Check backend if the order was already token_paid recently
        if (parsed.orderId && !parsed.tokenPaid) {
          fetch(`${BASE_URL}/api/meetup-orders/${parsed.orderId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.order && data.order.status === 'token_paid') {
                setTokenPaid(true);
              }
            }).catch(e => console.error("Error fetching order status", e));
        }

      } catch (error) {
        console.error('Error loading saved order data:', error);
      }
    }
  }, [meetupData?.joinCode, isDataLoaded]);

  // Fetch real menu items
  useEffect(() => {
    if (!meetupData || !meetupData._id) return;

    const fetchMenu = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/meetups/${meetupData._id}/cafe-menu`);
        const data = await res.json();
        if (data.success && data.menuItems) {
          const mappedMenu = data.menuItems.map((item: any) => {
            let finalImage = item.image || item.image_url;
            if (finalImage && finalImage.startsWith('/uploads/')) {
              finalImage = `${BASE_URL}${finalImage}`;
            }

            return {
              id: item.id || item._id || Math.random().toString(),
              name: item.name || item.item_name || 'Unknown Item',
              price: item.price || 0,
              image: finalImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
              category: item.category || item.Category || 'Other',
              type: item.foodType || item.food_type || 'Unknown',
              isVeg: item.isVeg !== undefined ? item.isVeg : true,
              rating: 4.5,
              reviews: 0
            };
          });
          setMenuItems(mappedMenu);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setMenuItems([]);
      }
    };

    fetchMenu();
  }, [meetupData?._id]);

  // Fetch members from backend — runs once on mount AND polls every 8 seconds
  // so the member list and bill split count stay current as friends join
  useEffect(() => {
    if (!meetupData || !meetupData._id) return;

    const fetchMembers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/meetups/${meetupData._id}`);
        const data = await res.json();
        if (data.success) {
          const fetchedMembers = data.members || (data.meetup && data.meetup.members) || [];
          const fetchedCount = data.membersCount ?? fetchedMembers.length;
          if (fetchedMembers.length > 0) {
            setMembersList(fetchedMembers);
            setNumberOfPeople(fetchedCount);
            console.log('✅ Members polled:', fetchedCount, '-', fetchedMembers.map((m: any) => m.name || m.firstName).join(', '));
          }
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    // Fetch immediately
    fetchMembers();

    // Poll every 8 seconds so the list updates when friends join
    const interval = setInterval(fetchMembers, 8000);
    return () => clearInterval(interval);
  }, [meetupData?._id]);

  // Socket and Chat API Integration
  useEffect(() => {
    if (!meetupData || !meetupData._id) return;

    // Join Socket Room
    socketService.connect();
    socketService.joinMeetupRoom(meetupData._id);

    // Fetch initial chat history
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/meetups/messages/${meetupData._id}`);
        const data = await res.json();
        if (data.success && data.messages) {
          const apiMsgs = data.messages.map((m: any) => ({
            id: m._id,
            type: m.type || 'user',
            sender: m.userName,
            senderEmoji: '👤',
            text: m.message,
            billData: m.billData,
            paymentData: m.paymentData,
            timestamp: new Date(m.createdAt),
          }));

          if (apiMsgs.length === 0) {
            // Add welcome message if empty
            setMessages([{
              id: 'welcome',
              type: 'system',
              text: `Welcome to ${meetupData.adminName}'s meetup! 🎉`,
              timestamp: new Date(),
            }]);
          } else {
            setMessages(apiMsgs);
          }
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    fetchChatHistory();

    // Listen for new messages
    const handleMessage = (data: any) => {
      setMessages((prev: Message[]) => {
        // If it's our own message, we might have added it optimistically
        const isFromMe = data.userId === user?.id || data.userName === (user?.firstName || user?.name);

        if (isFromMe) {
          // Find matching temporary message
          const tempMsg = prev.find(m => {
            if (!m.id || typeof m.id !== 'string') return false;
            if (data.type === 'bill' && m.type === 'bill') {
              return m.billData?.orderId === data.billData?.orderId;
            }
            if (data.type === 'payment' && m.type === 'payment') {
              return m.paymentData?.orderId === data.paymentData?.orderId;
            }
            if (data.type === 'system' && m.type === 'system' && data.billData?.isSplitMessage) {
              return m.billData?.orderId === data.billData?.orderId;
            }
            return m.id.startsWith('temp-') && m.text === data.message;
          });

          if (tempMsg) {
            // Replace temporary message with the real one, updating ID and timestamp
            return prev.map(m => m.id === tempMsg.id ? {
              ...m,
              id: data._id || `msg-${Date.now()}-${Math.random()}`,
              timestamp: new Date(data.createdAt || Date.now())
            } : m);
          }
        }

        // Skip if we already have it
        if (data._id && prev.some(m => m.id === data._id)) return prev;

        // If the incoming message has an order tied to it, remove older duplicates
        let filtered = prev;
        if (data.billData?.orderId) {
          filtered = prev.filter(m => !(m.billData && m.billData.orderId === data.billData.orderId && m.type === data.type));
        }

        return [...filtered, {
            id: data._id || `msg-${Date.now()}-${Math.random()}`,
            type: data.type || 'user',
            sender: data.userName,
            senderEmoji: data.senderEmoji || '👤',
            text: data.message,
          billData: data.billData,
          paymentData: data.paymentData,
          timestamp: new Date(data.createdAt || Date.now()),
        }];
      });
    };

    const handleOrder = (data: any) => {
      // Refresh local order based on server if we integrated server orders
      toast.success(`${data.userName} updated the order!`);
    };

    const handleMemberJoined = (data: any) => {
      // Get member name from multiple possible locations
      const joinedName = data.name || data.userName || 'Someone';
      const joinMsg = data.message || `${joinedName} joined the meetup! 👋`;

      toast.success(joinMsg);

      // Update members list — check all possible data shapes
      const updatedMembers = data.members || data.meetup?.members || null;
      if (updatedMembers && Array.isArray(updatedMembers) && updatedMembers.length > 0) {
        setMembersList(updatedMembers);
        setNumberOfPeople(updatedMembers.length);
        console.log('🔔 member_joined socket: updated members to', updatedMembers.length, '-', updatedMembers.map((m: any) => m.name || m.firstName).join(', '));
      }
      
      const systemMessage = {
        id: `sys-${Date.now()}`,
        type: 'system' as const,
        text: joinMsg,
        timestamp: new Date()
      };
      setMessages((prev: Message[]) => [...prev, systemMessage]);
    };

    socketService.socket?.on('receive_message', handleMessage);
    socketService.socket?.on('order_update', handleOrder);
    socketService.socket?.on('member_joined', handleMemberJoined);

    return () => {
      socketService.socket?.off('receive_message', handleMessage);
      socketService.socket?.off('order_update', handleOrder);
      socketService.socket?.off('member_joined', handleMemberJoined);
      // Wait to disconnect as they might stay in the app, but could leave room
    };
  }, [meetupData]);

  // Check if returning from payment with tokenPaid status
  useEffect(() => {
    if (meetupData && (meetupData as any).tokenPaid) {
      setTokenPaid(true);
      setOrderConfirmed(true);

      // Call Token API here to persist standard order token payment
      if (orderId) {
        fetch(`${BASE_URL}/api/meetup-orders/${orderId}/token-paid`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenAmount: 20 })
        }).catch(err => console.error("Failed to update token payment:", err));
      }

      // Removed system message for token payment from chat to declutter.
      // Bill is now available in the Notifications panel on User Home.
    }
  }, [meetupData]);

  // Save order data to localStorage whenever it changes
  useEffect(() => {
    const storageKey = getStorageKey();
    if (!storageKey || !isDataLoaded) return;

    const dataToSave = {
      orderItems,
      orderConfirmed,
      orderId,
      splitBill,
      paymentCompleted,
      commissionAmount,
      cgstAmount,
      sgstAmount,
      numberOfPeople,
      tokenPaid,
      splitMembers,
      perPersonAmount,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [orderItems, orderConfirmed, orderId, splitBill, paymentCompleted, commissionAmount, cgstAmount, sgstAmount, numberOfPeople, tokenPaid, splitMembers, perPersonAmount, isDataLoaded]);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save meetup to Active Meetups when component loads
  useEffect(() => {
    if (!meetupData || !user) return;

    const groupId = meetupData.joinCode || `meetup-${Date.now()}`;

    // Save this meetup to the user's active meetups
    saveGroupState(user.id, {
      groupId: groupId,
      groupName: `${selectedCafe?.name || 'Café'} Meetup`,
      groupCode: meetupData.joinCode,
      meetupDate: meetupData.date,
      meetupTime: meetupData.time,
      cafeName: selectedCafe?.name,
      currentStage: 'chat',
      status: 'Active',
      userRole: isAdmin ? 'creator' : 'member',
      lastActive: new Date().toISOString(),
      isApproved: true,
      memberCount: meetupData.members?.length || 0,
      cafeImage: selectedCafe?.image,
      lastNavigationPage: 'meetup-chat-billing',
      navigationData: meetupData,
    });

    console.log('✅ Meetup saved to Active Meetups');
  }, [meetupData, user, selectedCafe, isAdmin]);

  // Initialize chat with welcome message is now handled in fetchChatHistory

  const handleSendMessage = async () => {
    if (!inputText.trim() || !meetupData?._id) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      type: 'user',
      sender: user?.firstName || user?.name,
      senderEmoji: (user?.avatarId ? getAvatarById(user.avatarId)?.emoji : null) || user?.avatarEmoji || '👤',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    const textToSend = inputText;
    setInputText('');

    try {
      const fallbackId = `guest-${Date.now()}`;
      const payloadUserId = user?.id || user?._id || currentUserId || fallbackId;
      const payloadUserName = user?.firstName || user?.name || 'Guest User';

      const res = await fetch(`${BASE_URL}/api/meetups/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupId: meetupData._id,
          userId: payloadUserId,
          userName: payloadUserName,
          message: textToSend
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      if (data.success && data.message) {
        // Broadcast via socketio so other users get it
        socketService.sendMessage({
          _id: data.message._id,
          meetupId: meetupData._id,
          userId: payloadUserId,
          userName: payloadUserName,
          senderEmoji: (user?.avatarId ? getAvatarById(user.avatarId)?.emoji : null) || user?.avatarEmoji || '👤',
          message: textToSend,
          createdAt: data.message.createdAt
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setMessages((prev: Message[]) => prev.filter(m => m.id !== tempId));
      setInputText(textToSend);
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setOrderItems((prev: OrderItem[]) => {
      const existingItem = prev.find((i: any) => i.id === itemId);
      const menuItem = menuItems.find((i: any) => i.id === itemId);

      if (!menuItem) return prev;

      if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(i => i.id !== itemId);
        }
        return prev.map(i =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        );
      } else if (change > 0) {
        return [...prev, { ...menuItem, quantity: 1 }];
      }
      return prev;
    });
  };

  const getItemQuantity = (itemId: string) => {
    return orderItems.find((i: any) => i.id === itemId)?.quantity || 0;
  };

  const calculateBill = () => {
    const itemTotal = orderItems.reduce((sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
    const discount = Number(couponDiscount || 0);
    const subtotalAfterCoupon = itemTotal - discount;
    const cgst = Number(cgstAmount || 0) || parseFloat((subtotalAfterCoupon * 0.025).toFixed(2));
    const sgst = Number(sgstAmount || 0) || parseFloat((subtotalAfterCoupon * 0.025).toFixed(2));
    const total = parseFloat((subtotalAfterCoupon + cgst + sgst).toFixed(2));

    return { itemTotal: Number(itemTotal || 0), couponCode, couponDiscount: discount, cgst: Number(cgst || 0), sgst: Number(sgst || 0), commission: 0, total: Number(total || 0) };
  };

  const handleConfirmOrder = async () => {
    if (orderItems.length === 0) return;

    const currentOrderId = orderId || Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(currentOrderId);
    setOrderConfirmed(true);
    setShowOrderSection(false);

    const itemTotal = orderItems.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
    const commission = parseFloat((itemTotal * 0.06).toFixed(2));
    const cgst = parseFloat((itemTotal * 0.025).toFixed(2));
    const sgst = parseFloat((itemTotal * 0.025).toFixed(2));
    const total = parseFloat((itemTotal + cgst + sgst - commission).toFixed(2));

    const billData = {
      orderId: currentOrderId,
      items: orderItems,
      itemTotal,
      cgst,
      sgst,
      commission,
      total,
      splitEnabled: splitBill,
      members: splitMembers,
      perPersonAmount: splitBill && splitMembers.length > 0 ? parseFloat((total / splitMembers.length).toFixed(2)) : total,
    };

    // Add local first for instant UI response
    const tempId = `bill-${Date.now()}`;
    setMessages((prevItems: any[]) => {
      const filtered = prevItems.filter((m: any) => !(m.billData && m.billData.orderId === currentOrderId && m.type === 'bill'));
      return [...filtered, {
        id: tempId,
        type: 'bill' as const,
        timestamp: new Date(),
        billData,
      }];
    });

    try {
      const res = await fetch(`${BASE_URL}/api/meetups/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupId: meetupData?._id,
          userId: user?.id,
          userName: user?.firstName || user?.name,
          type: 'bill',
          billData
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        socketService.sendMessage({
          _id: data.message._id,
          meetupId: meetupData?._id || '',
          userId: user?.id || '',
          userName: user?.firstName || user?.name || '',
          message: '',
          type: 'bill',
          billData,
          createdAt: data.message.createdAt
        });
      }
    } catch (err) {
      console.error('Failed to broadcast bill:', err);
    }

    toast.success('Order confirmed! Review bill below.');
  };

  const emitOrderToCafe = (currentOrderId: string, billData: any) => {
    const cafeIdToEmit = selectedCafe?.cafeId || selectedCafe?.id || selectedCafe?._id || '';
    if (!cafeIdToEmit) return;

    socketService.emitOrderCreated({
      orderNumber: currentOrderId,
      orderId: currentOrderId,
      meetupName: `Meetup ${meetupData?.meetupCode || meetupData?.joinCode || ''}`,
      groupName: user?.firstName || user?.name || 'Group',
      meetupId: meetupData?._id || meetupData?.id,
      cafeId: cafeIdToEmit,
      memberCount: meetupData?.members?.length || 1,
      items: orderItems.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      totalAmount: billData.total,
      subtotal: billData.itemTotal,
      cgst: billData.cgst,
      sgst: billData.sgst,
      orderDate: new Date().toLocaleDateString('en-IN'),
      orderTime: new Date().toLocaleTimeString('en-IN'),
      status: 'pending',
      adminName: user?.firstName || user?.name || '',
      adminPhone: '',
      createdAt: new Date().toISOString(),
      splitEnabled: billData.splitEnabled,
      perPersonAmount: billData.perPersonAmount,
      members: billData.members,
    });
    console.log('📦 Order-created emitted for cafe:', cafeIdToEmit);

    // Save to localStorage for cafe dashboard fallback (polling)
    try {
      const existingOrders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
      const newOrder = {
        orderNumber: currentOrderId,
        meetupName: `Meetup ${meetupData?.meetupCode || meetupData?.joinCode || ''}`,
        groupName: user?.firstName || user?.name || 'Group',
        meetupId: meetupData?._id || meetupData?.id,
        memberCount: meetupData?.members?.length || 1,
        items: orderItems.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        totalAmount: billData.total,
        orderDate: new Date().toLocaleDateString('en-IN'),
        orderTime: new Date().toLocaleTimeString('en-IN'),
        status: 'pending',
        adminName: user?.firstName || user?.name || '',
        adminPhone: '',
        createdAt: new Date().toISOString(),
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem('cafeOrders', JSON.stringify(existingOrders));
    } catch (e) { /* ignore */ }
  };

  const handlePOSConfirmOrder = async (posData: POSConfirmData) => {
    setOrderItems(posData.items);
    setCommissionAmount(posData.commission);
    setCgstAmount(posData.cgst);
    setSgstAmount(posData.sgst);
    setCouponCode(posData.couponCode || '');
    setCouponDiscount(posData.couponDiscount || 0);
    setSplitBill(posData.splitEnabled);
    setSplitMembers(posData.members);
    setPerPersonAmount(posData.perPersonAmount);
    setNumberOfPeople(posData.members.length || 1);

    const currentOrderId = orderId || Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(currentOrderId);
    setOrderConfirmed(true);
    setShowOrderSection(false);

    const billData = {
      orderId: currentOrderId,
      items: posData.items,
      itemTotal: posData.subtotal,
      couponCode: posData.couponCode || '',
      couponDiscount: posData.couponDiscount || 0,
      cgst: posData.cgst,
      sgst: posData.sgst,
      total: posData.total,
      commission: posData.commission,
      splitEnabled: posData.splitEnabled,
      perPersonAmount: posData.perPersonAmount,
      members: posData.members
    };

    // 🚀 SAVE ORDER TO BACKEND
    try {
      const cafeId = meetupData?.cafeFinalized?.id || meetupData?.cafeFinalized?._id || meetupData?.cafeFinalized?.cafeId || selectedCafe?.id || selectedCafe?._id || selectedCafe?.cafeId || (meetupData as any)?.winnerCafe?.id || '';
      const orderPayload = {
        meetupId: meetupData?._id || meetupData?.id,
        userId: currentUserId || 'guest',
        userName: user?.firstName || user?.name || 'Guest',
        cafeId: cafeId,
        items: posData.items.map((i: any) => ({
          menuItemId: i.id || i._id || '',
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1
        })),
        subtotal: posData.subtotal,
        cgst: posData.cgst,
        sgst: posData.sgst,
        commission: posData.commission,
        total: posData.total,
        totalAmount: posData.total,
        orderId: currentOrderId,
        status: 'pending',
        orderStatus: 'PLACED',
        splitEnabled: posData.splitEnabled,
        perPersonAmount: posData.perPersonAmount,
        members: posData.members.map((m: any) => ({
          userId: m.id || m.userId || '',
          name: m.name || m.firstName || '',
          avatar: m.avatar || ''
        }))
      };

      console.log('💾 Saving order to backend...', orderPayload);
      const res = await fetch(`${BASE_URL}/api/meetup-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        console.log('✅ Order saved to backend:', data.order?._id);
      } else {
        console.error('❌ Failed to save order to backend:', data.message);
      }
    } catch (err) {
      console.error('❌ Error saving order to backend:', err);
    }

    // If token is already paid (e.g. editing an order), emit to cafe immediately
    if (tokenPaid) {
      emitOrderToCafe(currentOrderId, billData);
    }

    // Add bill message locally for instant UI
    const tempId = `bill-${Date.now()}`;
    setMessages((prev: any[]) => {
      const filtered = prev.filter(m => !(m.billData && m.billData.orderId === currentOrderId && m.type === 'bill'));
      return [...filtered, {
        id: tempId,
        type: 'bill' as const,
        timestamp: new Date(),
        billData,
      }];
    });

    // Broadcast bill message
    try {
      const res = await fetch(`${BASE_URL}/api/meetups/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupId: meetupData?._id || meetupData?.id,
          userId: user?.id,
          userName: user?.firstName || user?.name,
          type: 'bill',
          billData
        })
      });
      const data = await res.json();
      if (data.success && data.message) {
        socketService.sendMessage({
          _id: data.message._id,
          meetupId: meetupData?._id || '',
          userId: user?.id || '',
          userName: user?.firstName || user?.name || '',
          message: '',
          type: 'bill',
          billData,
          createdAt: data.message.createdAt
        });
      }
    } catch (err) {
      console.error('Failed to broadcast bill:', err);
    }

    // If split bill is enabled, also send split message in chat
    if (posData.splitEnabled && posData.members.length > 0) {
      let splitText = `🍽 Group Bill Split\n\nTotal Bill: ₹${posData.total}\n₹${posData.perPersonAmount} each`;

      const splitTempId = `split-${Date.now()}`;
      setMessages((prev: any[]) => [...prev, {
        id: splitTempId,
        type: 'system' as const,
        text: splitText,
        timestamp: new Date(),
      }]);

      try {
        const res2 = await fetch(`${BASE_URL}/api/meetups/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetupId: meetupData?._id || meetupData?.id,
            userId: user?.id,
            userName: user?.firstName || user?.name,
            type: 'system',
            message: splitText,
          })
        });
        const data2 = await res2.json();
        if (data2.success && data2.message) {
          socketService.sendMessage({
            _id: data2.message._id,
            meetupId: meetupData?._id || '',
            userId: user?.id || '',
            userName: user?.firstName || user?.name || '',
            message: splitText,
            type: 'system',
            createdAt: data2.message.createdAt
          });
        }
      } catch (err) {
        console.error('Failed to broadcast split message:', err);
      }
    }

    toast.success('Order confirmed! Review bill below.');
  };

  const handlePaymentChoice = async (method: 'cash' | 'online') => {
    if (method === 'cash') {
      setPaymentCompleted(true);

      const paymentData = {
        method: 'cash',
        status: 'completed',
        orderId,
      };

      const tempId = `payment-${Date.now()}`;
      setMessages((prev: Message[]) => [...prev, {
        id: tempId,
        type: 'payment',
        timestamp: new Date(),
        paymentData
      }]);
      toast.success('Payment marked as Cash Done! ✅');

      try {
        const res = await fetch(`${BASE_URL}/api/meetups/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetupId: meetupData?._id,
            userId: user?.id,
            userName: user?.firstName || user?.name,
            type: 'payment',
            paymentData
          })
        });
        const data = await res.json();
        if (data.success && data.message) {
          socketService.sendMessage({
            _id: data.message._id,
            meetupId: meetupData?._id || '',
            userId: user?.id || '',
            userName: user?.firstName || user?.name || '',
            message: '',
            type: 'payment',
            paymentData,
            createdAt: data.message.createdAt || new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Failed to broadcast payment:', err);
      }

      // Add notification for cash payment
      const bill = calculateBill();
      const amountPaid = splitBill ? bill.total / (numberOfPeople > 0 ? numberOfPeople : 1) : bill.total;

      // Prepare order items for notification
      const orderItemsForNotification = orderItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity
      }));

      notifyPaymentSuccess({
        amount: amountPaid,
        transactionId: orderId,
        paymentMethod: 'Cash',
        groupName: `${selectedCafe?.name || 'Café'} Meetup`,
        cafeName: selectedCafe?.name,
        orderNumber: orderId,
        orderItems: orderItemsForNotification,
      });

      // Trigger notification update in App.tsx
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } else {
      // Navigate to payment page
      const bill = calculateBill();
      const amountPerPerson = splitBill ? bill.total / (numberOfPeople > 0 ? numberOfPeople : 1) : bill.total;

      // Prepare order items for payment page
      const orderItemsForNotification = orderItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity
      }));

      onNavigate('payment-online', {
        ...meetupData,
        orderId,
        amount: amountPerPerson,
        splitBill,
        billData: calculateBill(),
        orderItems: orderItemsForNotification,
      });
    }
  };

  const handleEditOrder = () => {
    // Reopen POS interface for editing — preserves orderItems
    setOrderConfirmed(false);
    setShowOrderSection(true);
    setPaymentCompleted(false);
    // We intentionally do not reset tokenPaid so that if it was paid, it stays paid.
    // Remove the last bill and split messages
    setMessages((prev: Message[]) => prev.filter((m: Message) => m.type !== 'bill' && !(m.type === 'system' && m.text?.includes('Group Bill Split'))));
    toast.info('Edit your order in POS and confirm again');
  };

  // Split bill is now managed in POS — no separate dialog needed

  const handleTokenPayment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetupId: meetupData?._id || meetupData?.id,
          userId: currentUserId || 'guest',
          orderId: orderId // Link it to the current order if available
        })
      });
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server returned invalid response (Status: ${res.status}). Verify your backend is running.`);
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || `Server error (${res.status})`);
      }
      
      if (data.success && data.orderId) {
        const options = {
          key: 'rzp_live_STzO1DnRlqY3vN',
          amount: data.amount,
          currency: data.currency,
          name: 'Caffélino',
          description: '₹20 Token Confirmation',
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch(`${BASE_URL}/api/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  meetupId: meetupData?._id || meetupData?.id,
                  userId: currentUserId || 'guest'
                })
              });
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                // IMPORTANT: Update the meetup order status to 'token_paid' in our DB
                if (orderId) {
                  try {
                    await fetch(`${BASE_URL}/api/meetup-orders/${orderId}/token-paid`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ tokenAmount: 20 })
                    });
                  } catch (orderUpdateErr) {
                    console.error('Failed to update order status on backend:', orderUpdateErr);
                  }
                }

                setTokenPaid(true);
                setOrderConfirmed(true);
                
                // Emit order to cafe now that token is paid
                const billData = calculateBill();
                emitOrderToCafe(orderId, billData);

                toast.success('Order Confirmed. ₹20 token received.');
                
                // Add notification for token payment
                const amountPaid = 20;
                const orderItemsForNotification = orderItems.map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price * item.quantity
                }));

                notifyPaymentSuccess({
                  amount: amountPaid,
                  transactionId: orderId,
                  paymentMethod: 'Online',
                  groupName: `${selectedCafe?.name || 'Café'} Meetup`,
                  cafeName: selectedCafe?.name,
                  orderNumber: orderId,
                  totalBill: billData.total,
                  orderItems: orderItemsForNotification,
                });

                if (onNotificationUpdate) {
                  onNotificationUpdate();
                }

                const msgText = `✅ ₹20 token received. Bill details are available in your notifications.`;
                setMessages((prev: any[]) => [...prev, {
                  id: `token-${Date.now()}`,
                  type: 'system',
                  text: msgText,
                  timestamp: new Date()
                }]);
                
                await fetch(`${BASE_URL}/api/meetups/message`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    meetupId: meetupData?._id || meetupData?.id,
                    userId: currentUserId || 'system',
                    userName: 'System',
                    type: 'system',
                    message: msgText
                  })
                });
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
               console.error('Verify error:', err);
               toast.error('Error verifying payment.');
            }
          },
          prefill: {
            name: user?.firstName || user?.name || 'Guest',
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: {
            color: '#be9d80'
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error(`Payment failed: ${response.error.description}. Please try again.`);
        });
        rzp.open();
      } else {
         toast.error(data?.message || 'Could not initiate payment. Missing order details.');
      }
    } catch (err: any) {
      console.error('Razorpay init error:', err);
      toast.error(err.message || 'Error creating payment order.');
    }
  };

  const bill = orderConfirmed ? calculateBill() : null;
  const amountPerPerson = splitBill && perPersonAmount > 0 ? perPersonAmount : bill?.total || 0;

  // Show POS Interface when ordering
  if (showOrderSection && !orderConfirmed) {
    return (
      <POSMenuInterface
        user={user}
        meetupData={meetupData}
        menuItems={menuItems}
        membersList={membersList}
        onBack={() => setShowOrderSection(false)}
        onConfirmOrder={handlePOSConfirmOrder}
        isAdmin={isAdmin}
        initialOrderItems={orderItems.length > 0 ? orderItems : undefined}
        initialSplitEnabled={splitBill}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            {isAdmin && !orderConfirmed && (
              <Button
                onClick={() => setShowOrderSection(!showOrderSection)}
                className="bg-[#be9d80] text-white hover:bg-[#a88968] flex items-center gap-2 shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {showOrderSection ? 'Close Menu' : 'Order Food'}
              </Button>
            )}
            {!isAdmin && !orderConfirmed && (
              <Button
                onClick={() => setShowOrderSection(!showOrderSection)}
                className="bg-[#be9d80] text-white hover:bg-[#a88968] flex items-center gap-2 shadow-sm"
              >
                <Coffee className="w-4 h-4" />
                {showOrderSection ? 'Close Menu' : 'View Menu'}
              </Button>
            )}
          </div>

          {/* Meetup Info Card */}
          <div className="bg-gradient-to-br from-[#f5ebe0] to-[#e3d5ca] rounded-xl p-4 border border-[#be9d80]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 text-lg font-bold flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#be9d80]" />
                  {selectedCafe?.name || selectedCafe?.cafeName || 'Café'}
                </h1>
                <p className="text-gray-700 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#be9d80]" />
                  {(() => {
                    const loc = selectedCafe?.location || selectedCafe?.cafe_location || '';
                    const isCoordLike = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(loc);
                    return (!loc || isCoordLike)
                      ? (selectedCafe?.Cafe_Address || selectedCafe?.cafeAddress || 'Location not available')
                      : loc;
                  })()}
                </p>
                <p className="text-gray-700 text-sm mt-1">
                  Code: <span className="font-mono font-bold text-[#be9d80]">{meetupData?.meetupCode || meetupData?.joinCode || 'N/A'}</span>
                </p>
                {tokenPaid && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Token Paid (₹20)
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <p className="text-gray-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#be9d80]" />
                  <span className="font-bold">{membersList.length}</span> members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Menu Section */}
      {isAdmin && showOrderSection && !orderConfirmed && (
        <div className="bg-white border-b border-gray-200 shadow-lg flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Scrollable Menu */}
          <div className="flex-1 overflow-y-auto pb-4">
            <div className="max-w-3xl mx-auto px-4 py-4 pb-32">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-[#be9d80]" />
                Café Menu
              </h2>

              {Array.from(new Set(menuItems.map((item: any) => item.category))).map(category => (
                <div key={category as string} className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">🍽️</span>
                    {category as string}
                  </h3>
                  <div className="space-y-3">
                    {menuItems.filter((item: any) => item.category === category).map((item: any) => {
                      const quantity = getItemQuantity(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 bg-gradient-to-r ${item.isVeg ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-orange-50 border-red-200'} rounded-xl p-3 border-2 hover:border-[#be9d80] transition-all`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover shadow-md"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">{item.name}</h3>
                              <span className={`text-xs px-2 py-1 ${item.isVeg ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'} rounded-full border font-bold`}>
                                {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{item.foodType}</p>
                            <p className="text-lg font-bold text-[#be9d80] mt-1">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                              disabled={quantity === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-800 text-lg">{quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Order Summary at Bottom */}
          {orderItems.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-emerald-500 shadow-2xl max-h-[180px] overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    Order Summary ({orderItems.length} items)
                  </h3>
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}
                  </span>
                </div>

                {/* Scrollable Items List */}
                <div className="max-h-[60px] overflow-y-auto mb-3 space-y-1">
                  {orderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                      <span className="truncate flex-1">{item.name} x{item.quantity}</span>
                      <span className="font-medium ml-2">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Confirm Order • ₹{orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View-Only Menu Section (Join Users) */}
      {!isAdmin && showOrderSection && !orderConfirmed && (
        <div className="bg-white border-b border-gray-200 shadow-lg flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-4">
              {/* Info Banner */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👀</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">View-Only Menu</h3>
                    <p className="text-sm text-gray-600">
                      You can view the menu, but only the admin can place orders for the group.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-[#be9d80]" />
                Café Menu
              </h2>

              {Array.from(new Set(menuItems.map((item: any) => item.category))).map(category => (
                <div key={category as string} className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">🍽️</span>
                    {category as string}
                  </h3>
                  <div className="space-y-3">
                    {menuItems.filter((item: any) => item.category === category).map((item: any) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 bg-gradient-to-r ${item.isVeg ? 'from-green-50 to-emerald-50 border-green-200' : 'from-red-50 to-orange-50 border-red-200'} rounded-xl p-3 border-2 hover:border-[#be9d80] transition-all`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            <span className={`text-xs px-2 py-1 ${item.isVeg ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'} rounded-full border font-bold`}>
                              {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{item.foodType}</p>
                          <p className="text-lg font-bold text-[#be9d80] mt-1">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full"
        style={{
          backgroundImage: "linear-gradient(243.359deg, rgb(139, 89, 67) 1.444%, rgb(217, 191, 157) 50.058%, rgb(139, 89, 67) 99.616%)"
        }}
      >
        <div className="space-y-3">
          {messages.map(message => {
            if (message.type === 'system') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                    {message.text}
                  </div>
                </div>
              );
            }

            if (message.type === 'bill') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-4 max-w-md w-full shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-blue-600" />
                        Bill Generated
                      </h3>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 mb-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Order ID:</span>
                        <span className="font-mono font-bold text-blue-600">{message.billData.orderId}</span>
                      </div>

                      <div className="border-t border-gray-200 pt-2 space-y-1">
                        <p className="text-xs font-bold text-gray-600 mb-1">Item List:</p>
                        {Array.isArray(message.billData?.items) && message.billData.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 mt-2 pt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{Number(message.billData?.itemTotal || 0).toFixed(2)}</span>
                        </div>
                        {Number(message.billData?.couponDiscount || 0) > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Coupon ({message.billData?.couponCode}):</span>
                            <span className="font-bold">-₹{Number(message.billData?.couponDiscount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {Number(message.billData?.cgst || 0) > 0 && (
                          <div className="flex justify-between">
                            <span>CGST (2.5%):</span>
                            <span>₹{Number(message.billData?.cgst || 0).toFixed(2)}</span>
                          </div>
                        )}
                        {Number(message.billData?.sgst || 0) > 0 && (
                          <div className="flex justify-between">
                            <span>SGST (2.5%):</span>
                            <span>₹{Number(message.billData?.sgst || 0).toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1">
                          <span>Total Payable:</span>
                          <span className="text-blue-600">₹{Number(message.billData?.total || 0).toFixed(2)}</span>
                        </div>
                        {message.billData?.splitEnabled && message.billData?.members?.length > 0 && (
                          <div className="bg-indigo-50 rounded-lg p-2 mt-2">
                            <p className="text-xs font-bold text-indigo-700 text-center">
                              👥 Split among {message.billData.members.length} people — ₹{Number(message.billData?.perPersonAmount || 0).toFixed(2)} each
                            </p>
                            <div className="mt-1 space-y-0.5">
                              {Array.isArray(message.billData?.members) && message.billData.members.map((name: string, idx: number) => (
                                <p key={idx} className="text-xs text-indigo-600 text-center">
                                  {name} → ₹{Number(message.billData?.perPersonAmount || 0).toFixed(2)}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (message.type === 'payment') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-400 rounded-2xl p-4 max-w-md w-full shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">Payment Completed</h3>
                          <p className="text-sm text-gray-600">
                            Method: {message.paymentData.method === 'cash' ? 'Cash' : 'Online'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Regular user message
            const isCurrentUser = message.sender === (user?.firstName || user?.name);
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isCurrentUser ? 'bg-[#be9d80] text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-2 shadow-sm`}>
                  {!isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{message.senderEmoji}</span>
                      <span className="text-xs font-bold">{message.sender}</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500'} mt-1 block`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">Members ({membersList.length})</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {membersList.map((member, idx) => (
            <div key={member.userId || member.id || idx} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
              <span className="text-lg">
                {member.avatarEmoji || (member.avatarId ? getAvatarById(member.avatarId)?.emoji : '👤')}
              </span>
              <span className="text-sm">{member.name || member.firstName || 'Member'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Section (shown after order confirmed) */}
      {orderConfirmed && bill && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-t-4 border-orange-400 px-4 py-4 max-w-3xl mx-auto w-full shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4 text-xl">📋 Billing Summary</h3>

          {/* 1. Edit Order Items Button — reopens POS */}
          {isAdmin && (
            <Button
              onClick={handleEditOrder}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl flex items-center justify-center gap-2 mb-3"
            >
              <Edit2 className="w-5 h-5" />
              Edit Order Items
            </Button>
          )}

          {/* Item List + Bill Breakdown */}
          <div className="bg-white rounded-xl p-4 mb-3 border-2 border-orange-300 shadow-md">
            <div className="mb-3">
              <h4 className="text-sm font-bold text-gray-700 mb-2">📝 Item List</h4>
              <div className="space-y-1">
                {orderItems.map((item: OrderItem) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">₹{Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-3 space-y-2">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">₹{Number(bill.itemTotal || 0).toFixed(2)}</span>
              </div>

              {/* Coupon Discount */}
              {Number(bill.couponDiscount || 0) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({bill.couponCode})</span>
                  <span className="font-bold">-₹{Number(bill.couponDiscount || 0).toFixed(2)}</span>
                </div>
              )}

              {/* CGST (2.5%) */}
              <div className="flex justify-between text-sm">
                <span>CGST (2.5%)</span>
                <span>₹{Number(bill.cgst || 0).toFixed(2)}</span>
              </div>

              {/* SGST (2.5%) */}
              <div className="flex justify-between text-sm">
                <span>SGST (2.5%)</span>
                <span>₹{Number(bill.sgst || 0).toFixed(2)}</span>
              </div>



              {/* Total */}
              <div className="flex justify-between font-bold text-lg border-t-2 border-orange-400 pt-3 mt-3">
                <span className="text-gray-900">Total Payable</span>
                <span className="text-orange-600">₹{Number(bill.total || 0).toFixed(2)}</span>
              </div>

              {/* Split info if enabled */}
              {splitBill && (
                <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-3 mt-2">
                  <p className="text-sm text-indigo-700 text-center font-bold">
                    👥 Split among {numberOfPeople} people — ₹{Number(amountPerPerson || 0).toFixed(2)} each
                  </p>
                  <div className="mt-2 space-y-1">
                    {splitMembers.map((name: string, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm text-indigo-600 px-2">
                        <span>{name}</span>
                        <span className="font-bold">₹{Number(amountPerPerson || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Show split confirmed badge */}
          {splitBill && (
            <div className="bg-emerald-100 border-2 border-emerald-400 rounded-xl p-3 mb-3">
              <p className="font-bold text-emerald-800 text-center">
                ✅ Bill Split Among {numberOfPeople} People — Message Sent!
              </p>
            </div>
          )}

          {/* Confirm Table Token or Output Status */}
          <div className="bg-white rounded-xl p-4 border-2 border-emerald-400 mb-3">
            {tokenPaid ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-emerald-700 text-lg mb-1">₹20 Token Paid ✅</h3>
                {splitBill ? (
                  <p className="text-sm text-indigo-600 font-medium">
                    Your share: ₹{Number(amountPerPerson || 0).toFixed(2)} at counter
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 font-medium">
                    Remaining to pay: ₹{Number((bill.total || 0) - 20).toFixed(2)} at counter
                  </p>
                )}
              </div>
            ) : isAdmin ? (
              <>
                <Button
                  onClick={handleTokenPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg"
                >
                  <CreditCard className="w-6 h-6" />
                  Confirm Table Token — Pay ₹20
                </Button>

                <p className="text-sm text-gray-600 text-center mt-3">
                  ℹ️ Remaining amount to be paid at the café counter
                </p>

                {splitBill ? (
                  <p className="text-xs text-indigo-600 text-center mt-1 font-medium">
                    Each person pays ₹{Number(amountPerPerson || 0).toFixed(2)} at the counter
                  </p>
                ) : (
                  <p className="text-xs text-orange-600 text-center mt-1 font-medium">
                    Remaining: ₹{Number((bill.total || 0) - 20).toFixed(2)} at counter
                  </p>
                )}
              </>
            ) : (
              <div className="text-center bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 font-medium">Waiting for admin to confirm table token...</p>
                {splitBill ? (
                  <p className="text-xs text-indigo-600 text-center mt-2 font-medium">
                    Your share: ₹{Number(amountPerPerson || 0).toFixed(2)} at counter
                  </p>
                ) : (
                  <p className="text-xs text-orange-600 text-center mt-2 font-medium">
                    Total remaining at counter: ₹{Number((bill.total || 0) - 20).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Removed standalone Token Paid section because it is now combined into the Bill Summary */}

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#be9d80] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            className="w-12 h-12 bg-[#be9d80] text-white rounded-full flex items-center justify-center hover:bg-[#a88968] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
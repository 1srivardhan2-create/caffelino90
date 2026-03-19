import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, UtensilsCrossed, ShoppingCart, Send, Plus, Minus, Check, Users, MapPin, Calendar, Clock, Crown, Share2, Copy, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import GenderAvatar from './GenderAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard } from '../utils/clipboard';

interface GroupInteractionScreenProps {
  user: any;
  groupData: any;
  onNavigate: (page: string, data?: any) => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  foodType: 'veg' | 'non-veg';
  image?: string;
  description?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userGender?: string;
  userPhoto?: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

// Mock menu items
const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Cappuccino',
    price: 180,
    category: 'Coffee',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200',
    description: 'Classic Italian coffee with steamed milk'
  },
  {
    id: '2',
    name: 'Latte',
    price: 200,
    category: 'Coffee',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=200',
    description: 'Espresso with steamed milk and foam'
  },
  {
    id: '3',
    name: 'Americano',
    price: 150,
    category: 'Coffee',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200',
    description: 'Espresso with hot water'
  },
  {
    id: '4',
    name: 'Club Sandwich',
    price: 280,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200',
    description: 'Triple-decker with chicken, bacon, lettuce'
  },
  {
    id: '5',
    name: 'Caesar Salad',
    price: 250,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200',
    description: 'Fresh romaine with parmesan and croutons'
  },
  {
    id: '6',
    name: 'Chocolate Brownie',
    price: 180,
    category: 'Desserts',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=200',
    description: 'Warm brownie with vanilla ice cream'
  },
  {
    id: '7',
    name: 'Cold Coffee',
    price: 220,
    category: 'Coffee',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200',
    description: 'Chilled coffee with ice cream'
  },
  {
    id: '8',
    name: 'Pasta Alfredo',
    price: 320,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=200',
    description: 'Creamy fettuccine pasta'
  },
  {
    id: '9',
    name: 'Paneer Tikka',
    price: 280,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200',
    description: 'Grilled cottage cheese with spices'
  },
  {
    id: '10',
    name: 'Chicken Burger',
    price: 250,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
    description: 'Juicy grilled chicken patty with veggies'
  },
  {
    id: '11',
    name: 'Margherita Pizza',
    price: 350,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200',
    description: 'Classic tomato, mozzarella, and basil'
  },
  {
    id: '12',
    name: 'Chicken Tikka Pizza',
    price: 420,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200',
    description: 'Spicy chicken tikka with cheese'
  },
  {
    id: '13',
    name: 'Grilled Chicken Sandwich',
    price: 260,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=200',
    description: 'Grilled chicken with mayo and lettuce'
  },
  {
    id: '14',
    name: 'Veg Spring Rolls',
    price: 180,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1545589590-1e8df940a82d?w=200',
    description: 'Crispy vegetable spring rolls'
  },
  {
    id: '15',
    name: 'Chicken Wings',
    price: 320,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=200',
    description: 'Spicy buffalo chicken wings'
  },
  {
    id: '16',
    name: 'Masala Chai',
    price: 80,
    category: 'Beverages',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=200',
    description: 'Traditional Indian spiced tea'
  },
  {
    id: '17',
    name: 'Fresh Lime Soda',
    price: 100,
    category: 'Beverages',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200',
    description: 'Refreshing lime soda with mint'
  },
  {
    id: '18',
    name: 'Cheesecake',
    price: 220,
    category: 'Desserts',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=200',
    description: 'Classic New York style cheesecake'
  },
  {
    id: '19',
    name: 'Biryani (Chicken)',
    price: 380,
    category: 'Food',
    foodType: 'non-veg',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200',
    description: 'Aromatic basmati rice with chicken'
  },
  {
    id: '20',
    name: 'Veg Biryani',
    price: 280,
    category: 'Food',
    foodType: 'veg',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=200',
    description: 'Aromatic basmati rice with vegetables'
  }
];

export default function GroupInteractionScreen({ user, groupData, onNavigate }: GroupInteractionScreenProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [members, setMembers] = useState(groupData?.members || []);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const isAdmin = groupData?.isAdmin || user?.id === groupData?.creatorId;
  const categories = ['All', ...Array.from(new Set(MENU_ITEMS.map(item => item.category)))];

  // Handle new member joining
  useEffect(() => {
    if (groupData?.isNewJoin && groupData?.newMember) {
      // Add system message for new member
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        userId: 'system',
        userName: 'System',
        message: `${groupData.newMember.name} joined the group`,
        timestamp: new Date(),
        isSystem: true
      };

      setChatMessages(prev => [...prev, systemMessage]);

      // Add new member to members list
      setMembers(prev => {
        // Check if member already exists
        if (prev.some(m => m.id === groupData.newMember.id)) {
          return prev;
        }
        return [...prev, groupData.newMember];
      });

      // Show toast notification
      toast.success(`${groupData.newMember.name} joined the group!`);

      // If voting is active, redirect to voting screen
      if (groupData.votingActive) {
        setTimeout(() => {
          toast.info('Redirecting to voting screen...');
          setTimeout(() => {
            onNavigate('cafe-voting', groupData);
          }, 1000);
        }, 2000);
      }
    }
  }, [groupData?.isNewJoin]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userGender: user.gender,
      userPhoto: user.photo,
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const handleAddToOrder = (item: MenuItem) => {
    if (!isAdmin) {
      toast.error('Only the admin can add items to the order');
      return;
    }

    // Open quantity dialog
    setSelectedItem(item);
    setItemQuantity(1);
    setQuantityDialogOpen(true);
  };

  const handleConfirmAddToOrder = () => {
    if (!selectedItem) return;

    const existingItem = orderItems.find(orderItem => orderItem.id === selectedItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.id === selectedItem.id
          ? { ...orderItem, quantity: orderItem.quantity + itemQuantity }
          : orderItem
      ));
      toast.success(`Added ${itemQuantity} more ${selectedItem.name} to order`);
    } else {
      setOrderItems([...orderItems, { ...selectedItem, quantity: itemQuantity }]);
      toast.success(`${selectedItem.name} (x${itemQuantity}) added to order`);
    }
    
    setQuantityDialogOpen(false);
    setSelectedItem(null);
    setItemQuantity(1);
  };

  const handleIncreaseQuantity = (itemId: string) => {
    if (!isAdmin) {
      toast.error('Only the admin can modify the order');
      return;
    }

    setOrderItems(orderItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const handleDecreaseQuantity = (itemId: string) => {
    if (!isAdmin) {
      toast.error('Only the admin can modify the order');
      return;
    }

    setOrderItems(orderItems.map(item =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (itemId: string) => {
    if (!isAdmin) {
      toast.error('Only the admin can modify the order');
      return;
    }

    setOrderItems(orderItems.filter(item => item.id !== itemId));
    toast.success('Item removed from order');
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const perPersonAmount = groupData?.maxMembers ? totalAmount / parseInt(groupData.maxMembers) : 0;

  const filteredMenuItems = selectedCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const filteredMenuItemsByFoodType = foodTypeFilter === 'all'
    ? filteredMenuItems
    : filteredMenuItems.filter(item => item.foodType === foodTypeFilter);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-4 py-4 sticky top-14 z-40">
          <button 
            onClick={() => window.history.back()}
            className="caffelino-back-btn mb-3"
          >
            ← Back
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl mb-1">{groupData?.title || 'Group Meetup'}</h1>
              
              {/* Group Code Display */}
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[10px] text-slate-500 font-mono">
                  Group Code: <span className="font-bold text-slate-700">{groupData?.groupCode || 'AB47KT'}</span>
                </p>
                <button
                  onClick={async () => {
                    const groupCode = groupData?.groupCode || 'AB47KT';
                    const shareUrl = `https://caffelino.in/join/${groupCode}`;
                    const shareText = `Join my meetup "${groupData?.title}" on Caffélino!\n\n🔗 ${shareUrl}\n\nOr use code: ${groupCode}`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: `Join ${groupData?.title}`,
                        text: shareText,
                        url: shareUrl,
                      }).catch(async () => {
                        await copyToClipboard(shareText);
                        toast.success('Invite link copied!');
                      });
                    } else {
                      await copyToClipboard(shareText);
                      toast.success('Invite link copied!');
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  title="Share invite"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{groupData?.cafe?.name || 'Café Milano'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{groupData?.date || 'Today'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{groupData?.time || '5:00 PM'}</span>
                </div>
              </div>
            </div>
            <Badge variant={isAdmin ? 'default' : 'secondary'} className="flex items-center gap-1">
              {isAdmin && <Crown className="w-3 h-3" />}
              {isAdmin ? 'Admin' : 'Member'}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white border-b sticky top-[120px] z-30">
            <TabsList className="w-full grid grid-cols-4 h-14 rounded-none bg-transparent">
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-[#8b5943] rounded-none"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="menu" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-[#8b5943] rounded-none"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Menu
              </TabsTrigger>
              <TabsTrigger 
                value="order" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-[#8b5943] rounded-none relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order
                {orderItems.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white px-1.5 py-0 h-5 min-w-5 flex items-center justify-center">
                    {orderItems.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-[#8b5943] rounded-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Members
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Chat Tab */}
          <TabsContent value="chat" className="p-4 mt-0">
            <Card className="h-[calc(100vh-320px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => {
                  // System messages (new member joined, order confirmed, etc.)
                  if (msg.isSystem) {
                    return (
                      <motion.div 
                        key={msg.id} 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, type: 'spring' }}
                        className="flex justify-center my-3"
                      >
                        <div className="bg-amber-50 border border-amber-200 rounded-full px-4 py-2 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-amber-600" />
                          <p className="text-xs text-amber-800 font-medium">{msg.message}</p>
                        </div>
                      </motion.div>
                    );
                  }

                  // Regular chat messages
                  return (
                    <div key={msg.id} className={`flex gap-3 ${msg.userId === user.id ? 'flex-row-reverse' : ''}`}>
                      <GenderAvatar 
                        photo={msg.userPhoto}
                        gender={msg.userGender}
                        name={msg.userName}
                        size="sm"
                      />
                      <div className={`flex-1 max-w-[70%] ${msg.userId === user.id ? 'items-end' : ''}`}>
                        <p className="text-xs text-slate-600 mb-1">{msg.userName}</p>
                        <div className={`rounded-lg p-3 ${
                          msg.userId === user.id 
                            ? 'bg-[#8b5943] text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-[#8b5943] hover:bg-[#6d4433]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="p-4 mt-0">
            {!isAdmin && (
              <Card className="p-4 mb-4 bg-amber-50 border-amber-200">
                <p className="text-sm text-amber-800">
                  ℹ️ You can view the menu, but only the admin can add items to the order.
                </p>
              </Card>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-[#8b5943] hover:bg-[#6d4433]' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Food Type Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button
                variant={foodTypeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFoodTypeFilter('all')}
                className={`${foodTypeFilter === 'all' ? 'bg-[#8b5943] hover:bg-[#6d4433]' : ''}`}
              >
                All Items
              </Button>
              <Button
                variant={foodTypeFilter === 'veg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFoodTypeFilter('veg')}
                className={`${
                  foodTypeFilter === 'veg' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'border-green-600 text-green-700 hover:bg-green-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  </span>
                  Veg Only
                </span>
              </Button>
              <Button
                variant={foodTypeFilter === 'non-veg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFoodTypeFilter('non-veg')}
                className={`${
                  foodTypeFilter === 'non-veg' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'border-red-600 text-red-700 hover:bg-red-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  </span>
                  Non-Veg Only
                </span>
              </Button>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItemsByFoodType.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    {item.image && (
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        {/* Veg/Non-Veg Indicator on Image */}
                        <div className={`absolute top-1 right-1 w-5 h-5 rounded-sm flex items-center justify-center border-2 ${
                          item.foodType === 'veg' ? 'bg-white border-green-600' : 'bg-white border-red-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                          }`}></div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {/* Veg/Non-Veg Badge next to name */}
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 ${
                          item.foodType === 'veg' ? 'border-green-600' : 'border-red-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                          }`}></div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-[#8b5943]">₹{item.price}</p>
                        <Button
                          size="sm"
                          onClick={() => handleAddToOrder(item)}
                          disabled={!isAdmin}
                          className="bg-[#8b5943] hover:bg-[#6d4433]"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Order Tab */}
          <TabsContent value="order" className="p-4 mt-0">
            {orderItems.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-2">No items in order yet</p>
                <p className="text-sm text-slate-500">
                  {isAdmin ? 'Go to Menu tab to add items' : 'Admin will add items to the order'}
                </p>
              </Card>
            ) : (
              <>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {orderItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <div className="relative">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            {/* Veg/Non-Veg Indicator on Image */}
                            <div className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-sm flex items-center justify-center border-2 ${
                              item.foodType === 'veg' ? 'bg-white border-green-600' : 'bg-white border-red-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                              }`}></div>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{item.name}</h3>
                            {/* Veg/Non-Veg Badge next to name */}
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 ${
                              item.foodType === 'veg' ? 'border-green-600' : 'border-red-600'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                              }`}></div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecreaseQuantity(item.id)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIncreaseQuantity(item.id)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <p className="font-semibold text-[#8b5943] min-w-[80px] text-right">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Bill Summary */}
                <Card className="p-6 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Bill Summary
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Amount:</span>
                      <span className="font-semibold">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Members:</span>
                      <span className="font-semibold">{groupData?.maxMembers || 1}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Per Person:</span>
                      <span className="text-xl font-bold text-[#8b5943]">₹{Math.ceil(perPersonAmount)}</span>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <Button 
                      className="w-full bg-[#030213] hover:bg-[#030213]/90"
                      onClick={() => toast.success('Order placed! Payment details shared with all members.')}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Order & Split Bill
                    </Button>
                  )}
                </Card>
              </>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="p-4 mt-0">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Group Members</h2>
                <Badge variant="secondary" className="text-sm">
                  {members.length} / {groupData?.maxMembers || 6}
                </Badge>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <GenderAvatar 
                        gender={member.gender}
                        name={member.name}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">{member.name}</h3>
                          {member.isAdmin && (
                            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-xs px-2 py-0 h-5 flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              Admin
                            </Badge>
                          )}
                          {member.id === user.id && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {member.isAdmin ? 'Group Creator' : 'Member'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Invite More Members */}
              <div className="mt-6 pt-6 border-t">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-indigo-900 mb-1">Invite More Friends</h3>
                      <p className="text-sm text-indigo-700 mb-3">
                        Share the group code with your friends and family
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white border border-indigo-300 rounded-lg px-4 py-2">
                          <p className="text-xs text-slate-500 mb-1">Group Code</p>
                          <p className="font-mono font-bold text-slate-900 tracking-widest">
                            {groupData?.groupCode || 'AB47KT'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            copyToClipboard(groupData?.groupCode || 'AB47KT');
                            toast.success('Code copied!');
                          }}
                          className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <Button
                        className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                        onClick={async () => {
                          const groupCode = groupData?.groupCode || 'AB47KT';
                          const shareUrl = `https://caffelino.in/join/${groupCode}`;
                          const shareText = `Join my meetup "${groupData?.title}" on Caffélino!\n\n🔗 ${shareUrl}\n\nOr use code: ${groupCode}`;
                          
                          if (navigator.share) {
                            navigator.share({
                              title: `Join ${groupData?.title}`,
                              text: shareText,
                              url: shareUrl,
                            }).catch(async () => {
                              await copyToClipboard(shareText);
                              toast.success('Invite link copied!');
                            });
                          } else {
                            await copyToClipboard(shareText);
                            toast.success('Invite link copied!');
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Invite Link
                      </Button>
                      
                      {/* Demo: Simulate New Member Joining */}
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-2 border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
                        onClick={() => {
                          const demoMembers = [
                            { id: `demo-${Date.now()}`, name: 'Rohit Kumar', gender: 'male', isAdmin: false },
                            { id: `demo-${Date.now()}`, name: 'Priya Sharma', gender: 'female', isAdmin: false },
                            { id: `demo-${Date.now()}`, name: 'Amit Patel', gender: 'male', isAdmin: false },
                          ];
                          
                          const randomMember = demoMembers[Math.floor(Math.random() * demoMembers.length)];
                          
                          // Add system message
                          const systemMessage: ChatMessage = {
                            id: `system-${Date.now()}`,
                            userId: 'system',
                            userName: 'System',
                            message: `${randomMember.name} joined the group`,
                            timestamp: new Date(),
                            isSystem: true
                          };
                          
                          setChatMessages(prev => [...prev, systemMessage]);
                          
                          // Add new member
                          setMembers(prev => {
                            if (prev.some(m => m.name === randomMember.name)) {
                              return prev;
                            }
                            return [...prev, randomMember];
                          });
                          
                          toast.success(`${randomMember.name} joined the group!`);
                          
                          // Auto-switch to chat tab to see the system message
                          setTimeout(() => {
                            setActiveTab('chat');
                          }, 1000);
                        }}
                      >
                        🧪 Demo: Simulate Member Join
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quantity Selection Dialog */}
      <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Order</DialogTitle>
            <DialogDescription>
              Select quantity for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Item Preview */}
              <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                {selectedItem.image && (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{selectedItem.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{selectedItem.description}</p>
                  <p className="text-lg font-semibold text-[#8b5943]">₹{selectedItem.price}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Quantity</label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-12 h-12 rounded-full"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-bold text-[#8b5943]">{itemQuantity}</span>
                    <span className="text-xs text-slate-500">items</span>
                  </div>
                  
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-12 h-12 rounded-full"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="p-4 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Price:</span>
                  <span className="text-2xl font-bold text-[#8b5943]">
                    ₹{selectedItem.price * itemQuantity}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuantityDialogOpen(false);
                    setSelectedItem(null);
                    setItemQuantity(1);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmAddToOrder}
                  className="flex-1 bg-[#8b5943] hover:bg-[#6d4433]"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add to Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Receipt({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  );
}

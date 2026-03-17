import { useState } from 'react';
import { ArrowLeft, MessageCircle, Coffee, ShoppingCart, Send, Plus, Check, CheckSquare, Square, Crown, Users, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { generateOrderId } from '../utils/orderIdGenerator';
import { 
  notifyOrderConfirmed, 
  notifyMenuItemAdded,
  notifyNewMessage
} from '../utils/notificationManager';

interface GroupHomeProps {
  onNavigate: (page: string, data?: any) => void;
  groupData: any;
  isAdmin?: boolean;
  user?: any;
  readOnlyMenu?: boolean;
  viewOnly?: boolean;
}

// Mock menu items
const MOCK_MENU: any[] = [];

// Mock messages
const MOCK_MESSAGES: any[] = [];

export default function GroupHome({ onNavigate, groupData, isAdmin = true, user, readOnlyMenu = false, viewOnly = false }: GroupHomeProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: 'current-user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photo: '',
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent');
    
    // Send notification to other group members
    notifyNewMessage(
      groupData?.groupName || 'Group',
      user?.name || 'You',
      isAdmin
    );
  };

  const handleToggleItem = (itemId: string) => {
    if (!isAdmin) {
      toast.error('Only admin can manage the order');
      return;
    }

    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddToOrder = () => {
    if (!isAdmin) {
      toast.error('Only admin can manage the order');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const newItems = selectedItems.map(id => {
      const menuItem = MOCK_MENU.find(item => item.id === id);
      return {
        ...menuItem,
        quantity: 1,
        orderedBy: 'Admin'
      };
    });

    setOrderList([...orderList, ...newItems]);
    
    // Add system messages for each item added
    const itemMessages = newItems.map((item, index) => ({
      id: (Date.now() + index).toString(),
      sender: 'System',
      senderId: 'system',
      message: `added ${item.name} to the order`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photo: '',
      isSystem: true,
      adminName: user?.name || groupData?.adminName || 'Admin'
    }));
    
    setMessages([...messages, ...itemMessages]);
    setSelectedItems([]);
    setIsSelectMode(false);
    toast.success(`${newItems.length} item${newItems.length > 1 ? 's' : ''} added to order`);
    
    // Send notification for each item added
    newItems.forEach(item => {
      notifyMenuItemAdded(
        item.name, 
        groupData?.groupName || 'Group',
        user?.name || 'Admin'
      );
    });
  };

  const getTotalAmount = () => {
    return orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return orderList.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleConfirmOrder = () => {
    const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    // Calculate bill breakdown with GST
    const subtotal = getTotalAmount();
    const cgst = subtotal * 0.05; // 5% CGST
    const sgst = subtotal * 0.05; // 5% SGST
    const totalWithTax = subtotal + cgst + sgst;
    const memberCount = groupData?.members?.length || 1;
    const perPerson = totalWithTax / memberCount;

    // Create cafe order object for cafe owner
    const cafeOrder = {
      orderNumber,
      meetupName: groupData?.meetupName || 'Group Meetup',
      groupName: groupData?.groupName || 'My Group',
      groupCode: groupData?.code || '',
      memberCount: memberCount,
      items: orderList,
      subtotal: subtotal,
      cgst: cgst,
      sgst: sgst,
      totalAmount: totalWithTax,
      billBreakdown: {
        subtotal: subtotal,
        cgst: cgst,
        sgst: sgst,
        total: totalWithTax,
        splitAmong: memberCount,
        perPerson: perPerson
      },
      orderDate: now.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      orderTime: now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'pending',
      adminName: groupData?.adminName || 'Admin',
      adminPhone: user?.mobileNumber || '+91 XXXXXXXXXX',
      createdAt: now.toISOString()
    };

    // Save to cafe orders (simulate real-time sync)
    const existingOrders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
    existingOrders.push(cafeOrder);
    localStorage.setItem('cafeOrders', JSON.stringify(existingOrders));

    // Create system message for order confirmation
    const systemMessage = {
      id: Date.now().toString(),
      sender: 'System',
      senderId: 'system',
      message: `placed the order. Order #${orderNumber}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photo: '',
      isSystem: true,
      adminName: user?.name || groupData?.adminName || 'Admin'
    };

    // Create order summary card message
    const orderSummaryMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'System',
      senderId: 'system',
      message: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photo: '',
      isOrderSummary: true,
      orderData: {
        orderNumber,
        items: orderList,
        total: totalWithTax,
        memberCount: memberCount,
        perPerson: Math.ceil(perPerson)
      }
    };

    setMessages([...messages, systemMessage, orderSummaryMessage]);
    setIsOrderConfirmed(true);
    setActiveTab('chat'); // Switch to chat tab to show confirmation
    toast.success(`Order confirmed! 🎉 Order #${orderNumber}`);
    
    // Send order confirmation notification
    notifyOrderConfirmed(orderNumber, groupData?.meetupName || 'Group Meetup');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-[#be9d80] text-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] leading-[28px]">
                {groupData?.name || 'Group Meetup'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3 h-3" />
                <p className="text-sm text-white/90">
                  {groupData?.cafe?.name || 'Café Milano'}
                </p>
              </div>
            </div>
            <Badge className={`${isAdmin ? 'bg-amber-500 hover:bg-amber-600' : 'bg-white/20'} text-white`}>
              {isAdmin ? (
                <span className="flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  You (Admin)
                </span>
              ) : 'Member'}
            </Badge>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-white/10 backdrop-blur-sm border-0">
              <TabsTrigger 
                value="chat" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#be9d80]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="menu" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#be9d80]"
              >
                <Coffee className="w-4 h-4 mr-2" />
                Menu
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#be9d80]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order List
                {orderList.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white h-5 px-1.5 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} className="w-full">
          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="flex flex-col h-[calc(100vh-240px)]">
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((msg) => {
                  // System message for order confirmation
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-4">
                        <div className="bg-green-50 border border-green-200 rounded-[12px] px-4 py-2 max-w-md">
                          <p className="text-sm text-green-800 text-center">
                            ✅ <span className="font-medium">{msg.adminName}</span> {msg.message}
                          </p>
                          <p className="text-xs text-green-600 text-center mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    );
                  }

                  // Order summary card
                  if (msg.isOrderSummary) {
                    return (
                      <div key={msg.id} className="my-4">
                        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                          <div className="bg-green-600 text-white px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                <h3 className="font-medium">Order Summary</h3>
                              </div>
                              <Badge className="bg-white text-green-700 hover:bg-white">
                                Confirmed
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            {/* Items List */}
                            <div className="space-y-2 mb-4">
                              {msg.orderData.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-600">{item.quantity}x</span>
                                    <span className="text-neutral-950">{item.name}</span>
                                  </div>
                                  <span className="font-medium text-neutral-950">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-green-200 my-3"></div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-medium text-neutral-950">Total Amount</span>
                              <span className="text-lg font-medium text-neutral-950">₹{msg.orderData.total}</span>
                            </div>

                            {/* Split Bill */}
                            <div className="bg-white rounded-[8px] p-3 border border-green-200">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-slate-600">Split among {msg.orderData.memberCount} members</span>
                                </div>
                                <span className="font-medium text-green-700">₹{msg.orderData.perPerson}/person</span>
                              </div>
                            </div>

                            <p className="text-xs text-green-600 text-center mt-3">{msg.timestamp}</p>
                          </div>
                        </Card>
                      </div>
                    );
                  }

                  // Regular messages
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                    >
                      {!msg.isCurrentUser && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={msg.photo} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                            {msg.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${msg.isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {!msg.isCurrentUser && (
                          <span className="text-xs text-slate-500 mb-1">{msg.sender}</span>
                        )}
                        <div className={`rounded-[16px] px-4 py-2 ${
                          msg.isCurrentUser 
                            ? 'bg-[#030213] text-white' 
                            : 'bg-white border border-slate-200'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <span className="text-xs text-slate-400 mt-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Box */}
              <div className="p-4 bg-white border-t sticky bottom-0">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 h-[44px] rounded-[8px]"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="h-[44px] w-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px] p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-0">
            <div className="px-4 py-4">
              {/* Info Note - Always visible at top */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[8px]">
                <p className="text-sm text-blue-900">
                  ℹ️ Only admin can choose and confirm items for the group order.
                </p>
              </div>

              {/* Admin Controls Banner */}
              {isAdmin ? (
                <Card className="p-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-neutral-950">Admin Menu Controls</span>
                    </div>
                    <Button
                      onClick={() => setIsSelectMode(!isSelectMode)}
                      variant={isSelectMode ? "default" : "outline"}
                      className={`h-[36px] rounded-[8px] ${isSelectMode ? 'bg-[#030213]' : ''}`}
                    >
                      {isSelectMode ? (
                        <>
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Select Mode ON
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Select Items
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Add Item Button and Selected Count */}
                  <div className="flex items-center gap-3">
                    {isSelectMode && selectedItems.length > 0 && (
                      <div className="flex-1">
                        <Button
                          onClick={handleAddToOrder}
                          className="w-full h-[44px] bg-green-600 hover:bg-green-700 text-white rounded-[8px]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item ({selectedItems.length} selected)
                        </Button>
                      </div>
                    )}
                    {!isSelectMode && (
                      <p className="text-sm text-amber-900">
                        Toggle "Select Items" to choose menu items for the group.
                      </p>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="p-4 mb-4 bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      Menu items can be viewed. Admin will add items to the order.
                    </span>
                  </div>
                </Card>
              )}

              {/* Veg/Non-Veg Filter */}
              <div className="mb-4 flex gap-2">
                <Button
                  onClick={() => setFoodTypeFilter('all')}
                  variant={foodTypeFilter === 'all' ? 'default' : 'outline'}
                  className={`h-[40px] rounded-[8px] ${foodTypeFilter === 'all' ? 'bg-[#030213]' : ''}`}
                  size="sm"
                >
                  All Items
                </Button>
                <Button
                  onClick={() => setFoodTypeFilter('veg')}
                  variant={foodTypeFilter === 'veg' ? 'default' : 'outline'}
                  className={`h-[40px] rounded-[8px] ${foodTypeFilter === 'veg' ? 'bg-green-600 hover:bg-green-700' : 'border-green-600 text-green-700 hover:bg-green-50'}`}
                  size="sm"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    </span>
                    Veg Only
                  </span>
                </Button>
                <Button
                  onClick={() => setFoodTypeFilter('non-veg')}
                  variant={foodTypeFilter === 'non-veg' ? 'default' : 'outline'}
                  className={`h-[40px] rounded-[8px] ${foodTypeFilter === 'non-veg' ? 'bg-red-600 hover:bg-red-700' : 'border-red-600 text-red-700 hover:bg-red-50'}`}
                  size="sm"
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
                {MOCK_MENU.filter(item => foodTypeFilter === 'all' || item.foodType === foodTypeFilter).map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  const canSelect = isAdmin && isSelectMode;
                  
                  return (
                    <Card 
                      key={item.id} 
                      className={`overflow-hidden transition-all ${
                        canSelect ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                      } ${
                        isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                      } ${!isAdmin ? 'opacity-90' : ''}`}
                      onClick={() => canSelect && handleToggleItem(item.id)}
                    >
                      <div className="flex gap-3 p-3">
                        {/* Checkbox - Always visible when in select mode */}
                        {isSelectMode && (
                          <div className="flex items-center justify-center pt-1">
                            <div 
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-green-500 border-green-500' 
                                  : isAdmin 
                                    ? 'bg-white border-slate-300 hover:border-green-400'
                                    : 'bg-slate-100 border-slate-300 cursor-not-allowed'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        )}

                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-[8px] overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Veg/Non-Veg Badge on Image */}
                          <div className={`absolute top-1 right-1 w-5 h-5 rounded-sm flex items-center justify-center ${
                            item.foodType === 'veg' ? 'bg-white border-2 border-green-600' : 'bg-white border-2 border-red-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                            }`}></div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] leading-[24px] text-neutral-950">
                                {item.name}
                              </h3>
                              {/* Veg/Non-Veg Indicator */}
                              <div className={`w-4 h-4 rounded-sm flex items-center justify-center border-2 ${
                                item.foodType === 'veg' ? 'border-green-600' : 'border-red-600'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                                }`}></div>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {item.category}
                          </Badge>
                          <p className="text-[16px] font-medium text-neutral-950">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Order List Tab */}
          <TabsContent value="orders" className="mt-0">
            <div className="px-4 py-4">
              {orderList.length === 0 ? (
                /* Empty State */
                <Card className="p-12">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-slate-400" />
                      </div>
                    </div>
                    <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-2">
                      No items ordered yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {isAdmin 
                        ? 'Go to Menu tab to add items for the group'
                        : 'Waiting for admin to add items'}
                    </p>
                    {isAdmin && (
                      <Button
                        onClick={() => setActiveTab('menu')}
                        className="h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        Browse Menu
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                /* Order Summary */
                <div>
                  <Card className="mb-4">
                    {/* Table Header */}
                    <div className="border-b bg-slate-50 px-4 py-3">
                      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-slate-600">
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-3 text-right">Total</div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {orderList.map((item, index) => (
                        <div key={index} className="px-4 py-3">
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-10 h-10 rounded-[6px] object-cover"
                                />
                                <div>
                                  <p className="text-sm text-neutral-950">{item.name}</p>
                                  <p className="text-xs text-slate-500">{item.category}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 text-center">
                              <Badge variant="outline">{item.quantity}</Badge>
                            </div>
                            <div className="col-span-2 text-right text-sm text-slate-600">
                              ₹{item.price}
                            </div>
                            <div className="col-span-3 text-right font-medium text-neutral-950">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Table Footer */}
                    <div className="border-t bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">Total Items: {getTotalItems()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 mb-1">Total Amount</p>
                          <p className="text-[24px] font-medium text-neutral-950">
                            ₹{getTotalAmount()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Split Bill Info */}
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-950 mb-1">
                          Bill will be split equally
                        </p>
                        <p className="text-sm text-green-900">
                          Each member pays: ₹{Math.ceil(getTotalAmount() / (groupData?.members || 4))} 
                          <span className="text-green-700 ml-1">
                            ({groupData?.members || 4} members)
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Confirm Order Button */}
                  {isAdmin && (
                    <div>
                      <Button
                        className={`w-full h-[52px] rounded-[8px] mt-4 transition-all ${
                          isOrderConfirmed 
                            ? 'bg-green-600 hover:bg-green-600 opacity-80 cursor-not-allowed' 
                            : 'bg-[#030213] hover:bg-[#030213]/90'
                        }`}
                        onClick={handleConfirmOrder}
                        disabled={isOrderConfirmed}
                      >
                        {isOrderConfirmed ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Order Confirmed ✓
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Confirm Order
                          </>
                        )}
                      </Button>
                      {isOrderConfirmed && (
                        <p className="text-sm text-green-700 text-center mt-2">
                          ✓ Order details sent to chat
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Member View - Wait for Admin */}
                  {!isAdmin && orderList.length > 0 && (
                    <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-blue-900">
                          Waiting for admin to confirm the order
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

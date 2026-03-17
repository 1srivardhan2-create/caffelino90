import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Search, ShoppingCart, Eye, Coffee, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI, groupAPI } from '../utils/api';
import { generateId } from '../utils/database';

interface MenuSelectionProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// Mock menu data
const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Cappuccino', price: 150, category: 'Coffee', description: 'Classic Italian coffee with steamed milk' },
  { id: '2', name: 'Latte', price: 160, category: 'Coffee', description: 'Espresso with steamed milk and foam' },
  { id: '3', name: 'Espresso', price: 120, category: 'Coffee', description: 'Strong black coffee' },
  { id: '4', name: 'Americano', price: 130, category: 'Coffee', description: 'Espresso with hot water' },
  { id: '5', name: 'Cold Coffee', price: 180, category: 'Coffee', description: 'Iced coffee with milk' },
  { id: '6', name: 'Mocha', price: 190, category: 'Coffee', description: 'Espresso with chocolate and milk' },
  { id: '7', name: 'Sandwich', price: 120, category: 'Food', description: 'Grilled vegetable sandwich' },
  { id: '8', name: 'Pasta', price: 250, category: 'Food', description: 'Italian pasta with marinara sauce' },
  { id: '9', name: 'Pizza Slice', price: 150, category: 'Food', description: 'Cheese pizza slice' },
  { id: '10', name: 'Croissant', price: 100, category: 'Food', description: 'Buttery French pastry' },
  { id: '11', name: 'Muffin', price: 90, category: 'Food', description: 'Chocolate chip muffin' },
  { id: '12', name: 'Brownie', price: 110, category: 'Food', description: 'Rich chocolate brownie' },
  { id: '13', name: 'Green Tea', price: 80, category: 'Beverages', description: 'Organic green tea' },
  { id: '14', name: 'Fresh Juice', price: 120, category: 'Beverages', description: 'Seasonal fruit juice' },
  { id: '15', name: 'Smoothie', price: 150, category: 'Beverages', description: 'Mixed fruit smoothie' },
];

export default function MenuSelection({ user, meetupData, onNavigate, onBack }: MenuSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Check if user is admin
  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;
  
  // Check if user is a late joiner (view-only mode)
  const isLateJoin = meetupData?.isLateJoin || meetupData?.votingClosed;
  const isViewOnly = !isAdmin; // Non-admin users can only view

  // Admin orders for the entire group (not individual orders)
  const existingOrder = meetupData?.adminOrder;
  const isEditingOrder = existingOrder !== undefined;
  
  // Initialize cart with existing admin order if exists
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (existingOrder && existingOrder.items) {
      return existingOrder.items;
    }
    return [];
  });

  const categories = ['All', 'Coffee', 'Food', 'Beverages'];

  // Filter menu items
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    if (!isAdmin) {
      toast.error('Only the admin can add items to the order');
      return;
    }
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    if (!isAdmin) {
      toast.error('Only the admin can modify the order');
      return;
    }
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const handleConfirmOrder = async () => {
    if (!isAdmin) {
      toast.error('Only the admin can confirm orders');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Please add items to your order');
      return;
    }

    // Use existing order ID if editing, otherwise generate new one
    const orderId = isEditingOrder && existingOrder?.orderId 
      ? existingOrder.orderId 
      : `ORD-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();
    const now = new Date();

    // Calculate bill breakdown with GST
    const subtotal = cartTotal; // Items total
    const cgstRate = 2.5; // 2.5% CGST
    const sgstRate = 2.5; // 2.5% SGST
    const cgst = Math.round((subtotal * cgstRate / 100) * 100) / 100;
    const sgst = Math.round((subtotal * sgstRate / 100) * 100) / 100;
    const totalWithGST = subtotal + cgst + sgst;

    // Add emojis to cart items based on category
    const cartWithEmojis = cart.map(item => ({
      ...item,
      emoji: item.category === 'Coffee' ? '☕' : item.category === 'Food' ? '🍽️' : '🥤'
    }));

    // Save admin order for the entire group
    meetupData.adminOrder = {
      orderId,
      userId: user.id,
      userName: user.name,
      items: cartWithEmojis,
      subtotal: subtotal, // Items total without GST
      cgst: cgst,
      sgst: sgst,
      total: totalWithGST, // Total with GST
      timestamp: isEditingOrder ? existingOrder?.timestamp : timestamp,
      status: 'pending',
      groupCode: meetupData.code,
      cafeName: meetupData.winnerCafe?.name || meetupData.cafeName
    };

    // Create cafe order object for cafe owner
    const cafeOrder = {
      orderId, // Add orderId field for database
      orderNumber: orderId, // Use same ID (existing or new)
      meetupName: meetupData?.meetupName || 'Group Meetup',
      groupName: meetupData?.groupName || meetupData?.name || 'My Group',
      groupCode: meetupData?.code || '',
      memberCount: meetupData?.members?.length || 1,
      items: cartWithEmojis,
      subtotal: subtotal, // Items total
      cgst: cgst, // CGST amount
      sgst: sgst, // SGST amount
      totalAmount: totalWithGST, // Total with GST
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
      adminName: user.name,
      adminPhone: user.mobileNumber || '+91 XXXXXXXXXX',
      createdAt: isEditingOrder ? existingOrder?.timestamp : timestamp,
      billBreakdown: {
        cgst: cgst,
        sgst: sgst,
        splitAmong: meetupData?.members?.length || 1,
        perPerson: Math.round((totalWithGST / (meetupData?.members?.length || 1)) * 100) / 100
      }
    };

    try {
      // Save order to Supabase
      await orderAPI.saveOrder(cafeOrder);
      
      // Also save group data with the order
      await groupAPI.saveGroup(meetupData);
      
      console.log('Order saved to Supabase:', orderId);
    } catch (error) {
      console.error('Error saving order to Supabase:', error);
      toast.error('Failed to save order. Using local storage as backup.');
    }

    // FALLBACK: Also save to localStorage for backward compatibility
    const existingOrders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
    
    if (isEditingOrder && existingOrder?.orderId) {
      // Update existing order instead of creating a new one
      const orderIndex = existingOrders.findIndex((o: any) => o.orderNumber === existingOrder.orderId);
      if (orderIndex !== -1) {
        // Update the existing order with new items and total
        existingOrders[orderIndex] = {
          ...existingOrders[orderIndex],
          items: cartWithEmojis,
          subtotal: subtotal,
          cgst: cgst,
          sgst: sgst,
          totalAmount: totalWithGST,
          memberCount: meetupData?.members?.length || 1,
          billBreakdown: {
            cgst: cgst,
            sgst: sgst,
            splitAmong: meetupData?.members?.length || 1,
            perPerson: Math.round((totalWithGST / (meetupData?.members?.length || 1)) * 100) / 100
          }
        };
      } else {
        // Order not found, add as new
        existingOrders.push(cafeOrder);
      }
    } else {
      // New order - add to array
      existingOrders.push(cafeOrder);
    }
    
    localStorage.setItem('cafeOrders', JSON.stringify(existingOrders));

    // Mark that payment message should be sent in chat
    meetupData.orderConfirmed = true;
    meetupData.paymentRequired = true;

    toast.success(isEditingOrder ? `Order updated! Order ID: ${orderId}` : `Order confirmed! Order ID: ${orderId}`);
    
    // Navigate back to group chat where payment message will appear
    onNavigate('meetup-group-page', meetupData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Select Menu</h1>
                <p className="text-white/80 text-[12px]">{meetupData?.winnerCafe?.name || 'Café Menu'}</p>
              </div>
            </div>
            {/* Cart Icon */}
            {cartItemCount > 0 && (
              <div className="relative p-2 bg-white/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-[240px]">
        {/* Member Read-Only Banner */}
        {!isAdmin && (
          <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-amber-900 font-bold">
                Menu View Only
              </p>
              <p className="text-[12px] text-amber-700">
                Only the admin can place orders for the group. You can browse the menu and view the current order.
              </p>
            </div>
          </div>
        )}

        {/* Admin Editing Order Banner */}
        {isAdmin && isEditingOrder && (
          <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-blue-900 font-bold">
                Editing Group Order
              </p>
              <p className="text-[12px] text-blue-700">
                Previous order loaded. Add or remove items and click Confirm to update.
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full border border-neutral-300 rounded-lg pl-12 pr-4 py-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#8b5943] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item) => {
            const cartItem = cart.find(c => c.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-neutral-200 rounded-lg p-4 hover:border-[#8b5943] transition-all"
              >
                {/* Item Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-lg flex items-center justify-center mb-3">
                  {item.category === 'Coffee' ? (
                    <Coffee className="w-8 h-8 text-[#8b5943]" />
                  ) : (
                    <UtensilsCrossed className="w-8 h-8 text-[#8b5943]" />
                  )}
                </div>

                {/* Item Info */}
                <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-1">
                  {item.name}
                </h3>
                <p className="text-[12px] text-neutral-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                    ₹{item.price}
                  </span>
                  
                  {isAdmin ? (
                    // Admin can add/remove items
                    quantity === 0 ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#8b5943] text-white px-4 py-2 rounded-lg hover:bg-[#8b5943]/90 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-[#8b5943]/10 rounded-lg p-1">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="bg-white text-[#8b5943] w-8 h-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-white text-[#8b5943] w-8 h-8 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  ) : (
                    // Members see quantity or "Not ordered"
                    quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-green-100 rounded-lg px-3 py-2">
                        <span className="text-[14px] font-['Arial:Regular',_sans-serif] text-green-700 font-bold">
                          Qty: {quantity}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-neutral-100 rounded-lg px-3 py-2">
                        <span className="text-[12px] text-neutral-500">
                          Not ordered
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-[16px] text-neutral-600">No items found</p>
          </div>
        )}
      </div>

      {/* Cart Section - Fixed at Bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#8b5943] shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-30">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-4">
              {/* Collapsible Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                  {isAdmin ? 'Group Order' : 'Current Order'} ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
                </h3>
                <span className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                  ₹{cartTotal}
                </span>
              </div>
              
              {/* Cart Items - Max 3 visible, scrollable */}
              <div className="space-y-2 mb-3 max-h-[120px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                    <div className="flex-1">
                      <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                        {item.name} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-[13px] font-['Arial:Regular',_sans-serif] text-[#8b5943] font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {isAdmin ? (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-[#8b5943] text-white h-[44px] rounded-lg text-[15px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isEditingOrder ? 'Update Order' : 'Confirm Order'} • ₹{cartTotal}
                </button>
              ) : (
                <div className="bg-amber-100 text-amber-800 h-[44px] rounded-lg text-[14px] font-['Arial:Regular',_sans-serif] flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View Only - Admin will confirm the order
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

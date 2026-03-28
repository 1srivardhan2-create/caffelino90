import { useState, useRef } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, X, Check, Users, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

interface POSMenuInterfaceProps {
  user: any;
  meetupData: any;
  onBack: () => void;
  onConfirmOrder: (data: POSConfirmData) => void;
  isAdmin: boolean;
  menuItems: any[];
  membersList: any[];
  initialOrderItems?: OrderItem[];
  initialSplitEnabled?: boolean;
}

export interface POSConfirmData {
  items: OrderItem[];
  subtotal: number;
  couponCode: string;
  couponDiscount: number;
  cgst: number;
  sgst: number;
  commission: number;
  total: number;
  splitEnabled: boolean;
  members: string[];
  perPersonAmount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  type: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  isVeg: boolean;
}

// Single valid coupon
const VALID_COUPON = { code: 'LINO9', discountPercent: 6 };

const DEFAULT_ITEM_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';

export default function POSMenuInterface({
  user,
  meetupData,
  menuItems,
  onBack,
  onConfirmOrder,
  isAdmin,
  membersList,
  initialOrderItems,
  initialSplitEnabled,
}: POSMenuInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Show All');
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems || []);
  const [isConfirming, setIsConfirming] = useState(false);
  const [splitEnabled, setSplitEnabled] = useState(initialSplitEnabled || false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const cartSectionRef = useRef<HTMLDivElement>(null);

  const scrollToCart = () => {
    cartSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Get member names from live membersList with proper fallbacks
  const members: string[] = (membersList || []).map((m: any) => {
    // Handle both string IDs/names and user objects
    if (typeof m === 'string') return m;
    
    // Check various name fields
    const name = m.firstName || m.name || m.userName || 
                (m.userId && (m.userId.firstName || m.userId.name || m.userId.userName)) ||
                'Member';
    return name;
  });

  // Ensure current user is included in the split if not already in membersList
  const currentUserName = user?.firstName || user?.name || 'User';
  let effectiveMembers = [...members];
  if (effectiveMembers.length === 0) {
    effectiveMembers = [currentUserName];
  } else if (!effectiveMembers.includes(currentUserName) && !effectiveMembers.some(m => m.toLowerCase() === currentUserName.toLowerCase())) {
     // Optional: If we want to be sure the current user is always included in the POS split list 
     // even if the backend list hasn't updated yet.
     // effectiveMembers.push(currentUserName);
  }

  // Map incoming DB items to the expected structure
  const mappedMenuItems: MenuItem[] = (menuItems || []).map((item: any, index: number) => {
    let finalImage = item.image_url || item.image;
    if (finalImage && finalImage.startsWith('/uploads/')) {
      finalImage = `${BASE_URL}${finalImage}`;
    }

    return {
      id: item._id || item.id || `item-${index}`,
      name: item.item_name || item.name || 'Unnamed Item',
      price: item.price !== undefined ? item.price : 0,
      image: finalImage || DEFAULT_ITEM_IMAGE,
      category: item.Category || item.category || 'Other',
      type: item.food_type || item.type || 'Other',
      isVeg: item.food_type === 'Veg' || item.isVeg === true,
    };
  });

  const CATEGORIES = ['Show All', ...Array.from(new Set(mappedMenuItems.map(item => item.category)))];

  const filteredItems = mappedMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Show All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (menuItem: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: 1,
          category: menuItem.category,
          type: menuItem.type,
        }];
      }
    });
    toast.success(`${menuItem.name} added to cart`);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setOrderItems(prev =>
      prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
    toast.info('Item removed from cart');
  };

  // ─── COUPON LOGIC (single coupon: CAFFELINO6 = ₹50 off) ──────────
  const handleApplyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (code === VALID_COUPON.code) {
      setAppliedCoupon(true);
      setCouponInput('');
      toast.success('Coupon LINO9 applied! 6% off 🎉');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(false);
    toast.info('Coupon removed');
  };

  // ─── TOTALS: Subtotal → Coupon (6%) → CGST → SGST → Total ──
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const couponDiscount = appliedCoupon ? parseFloat((subtotal * VALID_COUPON.discountPercent / 100).toFixed(2)) : 0;
  const subtotalAfterCoupon = subtotal - couponDiscount;
  const cgst = parseFloat((subtotalAfterCoupon * 0.025).toFixed(2));
  const sgst = parseFloat((subtotalAfterCoupon * 0.025).toFixed(2));
  const total = parseFloat((subtotalAfterCoupon + cgst + sgst).toFixed(2));
  const memberCount = effectiveMembers.length;
  const perPersonAmount = splitEnabled ? parseFloat((total / memberCount).toFixed(2)) : total;

  const handleConfirmOrder = () => {
    if (orderItems.length === 0) {
      toast.error('Please add items to your order');
      return;
    }

    setIsConfirming(true);
    setTimeout(() => {
      onConfirmOrder({
        items: orderItems,
        subtotal,
        couponCode: appliedCoupon ? VALID_COUPON.code : '',
        couponDiscount,
        cgst,
        sgst,
        commission: 0, // No platform fee
        total,
        splitEnabled,
        members: effectiveMembers,
        perPersonAmount,
      });
      toast.success('Bill confirmed! Pay ₹20 to send to café ☕');
      setIsConfirming(false);
    }, 1000);
  };

  const getItemQuantityInOrder = (itemId: string) => {
    return orderItems.find(i => i.id === itemId)?.quantity || 0;
  };

  const totalCartItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Point of Sale (POS)</h1>
            {isAdmin && (
              <button
                onClick={scrollToCart}
                className="flex items-center gap-2 bg-[#ff6b35]/10 hover:bg-[#ff6b35]/20 px-3 py-1.5 rounded-full transition-colors"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#ff6b35]" />
                <span className="bg-[#ff6b35] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {totalCartItems}
                </span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#be9d80] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Left Side - Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium ${selectedCategory === category
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map(item => {
              const quantityInOrder = getItemQuantityInOrder(item.id);
              return (
                <div
                  key={item.id}
                  onClick={isAdmin ? () => handleAddItem(item) : undefined}
                  className={`bg-white rounded-xl p-3 transition-all border-2 relative ${
                    isAdmin ? 'cursor-pointer hover:shadow-lg ' + (quantityInOrder > 0 ? 'border-[#ff6b35]' : 'border-gray-200 hover:border-[#be9d80]') 
                    : 'cursor-default border-gray-200'
                  }`}
                >
                  {quantityInOrder > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff6b35] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                      {quantityInOrder}
                    </div>
                  )}
                  <div className="w-full h-32 mb-2 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-[#ff6b35] font-bold text-base">₹{item.price}</p>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found matching your search</p>
            </div>
          )}
        </div>

        {/* Right Side - Cart / Order Summary (Admin Only) */}
        {isAdmin && (
          <div ref={cartSectionRef} id="pos-cart-section" className="lg:w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
          {/* Order Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
              {orderItems.length > 0 && (
                <span className="bg-[#ff6b35] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {totalCartItems} items
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {meetupData?.selectedCafe?.name || meetupData?.selectedCafe?.cafeName || 'Café Order'}
            </p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No items added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click items from the menu to add</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                        <p className="text-[#ff6b35] font-bold text-sm">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-lg p-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, -1); }}
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-800 text-lg">{item.quantity}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(item.id, 1); }}
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary & Actions */}
          {orderItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* Coupon Section — Simple input only */}
              <div className="mb-4 bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-sm font-medium text-gray-700">Apply Coupon</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-3 py-2">
                    <div>
                      <span className="font-bold text-green-700 text-sm">{VALID_COUPON.code}</span>
                      <p className="text-xs text-green-600">-₹{couponDiscount.toFixed(2)} off</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white text-sm px-4"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Totals: Subtotal → Coupon → CGST → SGST → Total */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount:</span>
                    <span className="font-bold">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST (2.5%):</span>
                  <span className="font-medium text-gray-800">₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST (2.5%):</span>
                  <span className="font-medium text-gray-800">₹{sgst.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Total Payable:</span>
                  <span className="font-bold text-xl text-[#ff6b35]">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Split Bill Toggle */}
              {isAdmin && (
                <div className="mb-4 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#8b5943]" />
                      <span className="text-sm font-medium text-gray-700">Split Bill</span>
                    </div>
                    <button onClick={() => setSplitEnabled(!splitEnabled)} className="flex items-center gap-1">
                      {splitEnabled ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {splitEnabled && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Split among {memberCount} members:
                      </p>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {effectiveMembers.map((name, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">{name}</span>
                            <span className="font-bold text-[#ff6b35]">₹{perPersonAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm">
                        <span className="font-medium text-gray-600">Per person:</span>
                        <span className="font-bold text-[#ff6b35]">₹{perPersonAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmOrder}
                disabled={isConfirming || !isAdmin}
                className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Done — ₹{total.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          )}
          </div>
        )}
      </div>

      {/* Floating Cart FAB for mobile — scrolls to cart section */}
      {isAdmin && orderItems.length > 0 && (
        <button
          onClick={scrollToCart}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#ff6b35] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#e55a2b] transition-all active:scale-95"
          style={{ boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)' }}
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute -top-2 -right-3 bg-white text-[#ff6b35] w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shadow">
              {totalCartItems}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
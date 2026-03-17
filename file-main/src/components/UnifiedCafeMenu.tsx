import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Lock, Info, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface UnifiedCafeMenuProps {
  meetupData: any;
  user: any;
  isAdmin: boolean;
  readOnly?: boolean;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Simulated menu API
const fetchCafeMenu = async (cafeId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mock menu data based on café ID
  const CAFE_MENUS: Record<string, any> = {
    '1': {
      cafeName: 'Brew & Beans Café',
      cafeRating: 4.5,
      cafeReviews: 234,
      categories: {
        coffee: [
          { id: 'c1', name: 'Espresso', price: 120, veg: true, popular: true, description: 'Rich, bold espresso shot', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' },
          { id: 'c2', name: 'Cappuccino', price: 150, veg: true, popular: true, description: 'Classic Italian cappuccino', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
          { id: 'c3', name: 'Latte', price: 160, veg: true, description: 'Smooth and creamy latte', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
          { id: 'c4', name: 'Americano', price: 130, veg: true, description: 'Bold Americano coffee', image: 'https://images.unsplash.com/photo-1521302200778-33500795e128?w=400&h=300&fit=crop' },
        ],
        snacks: [
          { id: 's1', name: 'Croissant', price: 80, veg: true, popular: true, description: 'Buttery, flaky croissant', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' },
          { id: 's2', name: 'Blueberry Muffin', price: 90, veg: true, description: 'Fresh blueberry muffin', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop' },
          { id: 's3', name: 'Club Sandwich', price: 180, veg: false, description: 'Triple-decker club sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
          { id: 's4', name: 'Veggie Wrap', price: 150, veg: true, description: 'Fresh vegetable wrap', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop' },
        ],
        desserts: [
          { id: 'd1', name: 'Chocolate Cake', price: 180, veg: true, popular: true, description: 'Rich chocolate layer cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop' },
          { id: 'd2', name: 'Cheesecake', price: 200, veg: true, description: 'Creamy New York cheesecake', image: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop' },
          { id: 'd3', name: 'Tiramisu', price: 220, veg: true, description: 'Classic Italian tiramisu', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
        ],
        beverages: [
          { id: 'b1', name: 'Fresh Orange Juice', price: 120, veg: true, description: 'Freshly squeezed orange juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
          { id: 'b2', name: 'Iced Tea', price: 100, veg: true, description: 'Refreshing iced tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
          { id: 'b3', name: 'Smoothie', price: 150, veg: true, popular: true, description: 'Mixed berry smoothie', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop' },
        ]
      }
    },
    '2': {
      cafeName: 'Coffee Corner',
      cafeRating: 4.2,
      cafeReviews: 189,
      categories: {
        coffee: [
          { id: 'c1', name: 'House Blend', price: 110, veg: true, popular: true, description: 'Our signature blend', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop' },
          { id: 'c2', name: 'Mocha', price: 170, veg: true, description: 'Chocolate mocha delight', image: 'https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop' },
        ],
        snacks: [
          { id: 's1', name: 'Bagel', price: 70, veg: true, description: 'Toasted bagel with cream cheese', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' },
          { id: 's2', name: 'Danish Pastry', price: 95, veg: true, popular: true, description: 'Flaky Danish pastry', image: 'https://images.unsplash.com/photo-1509365390695-33aad2a3f1e8?w=400&h=300&fit=crop' },
        ]
      }
    },
    '3': {
      cafeName: 'Urban Grind',
      cafeRating: 4.7,
      cafeReviews: 312,
      categories: {
        coffee: [
          { id: 'c1', name: 'Cold Brew', price: 140, veg: true, popular: true, description: 'Smooth cold brew coffee', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop' },
          { id: 'c2', name: 'Flat White', price: 155, veg: true, description: 'Velvety flat white', image: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400&h=300&fit=crop' },
        ],
        snacks: [
          { id: 's1', name: 'Avocado Toast', price: 190, veg: true, popular: true, description: 'Smashed avocado on sourdough', image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&h=300&fit=crop' },
        ]
      }
    }
  };

  return CAFE_MENUS[cafeId] || null;
};

export default function UnifiedCafeMenu({ 
  meetupData, 
  user, 
  isAdmin, 
  readOnly = false,
  onNavigate,
  onBack 
}: UnifiedCafeMenuProps) {
  const [menuData, setMenuData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('');

  // Extract selected café ID from meetup data
  const selectedCafeId = meetupData?.winnerCafe?.id || meetupData?.selectedCafeId || null;
  
  // Storage key for this meetup's cart
  const cartStorageKey = `caffelino_cart_${meetupData?.meetupId || meetupData?.code || 'default'}`;

  useEffect(() => {
    loadMenu();
    loadSavedCart();
  }, [selectedCafeId]);

  // Load saved cart from localStorage
  const loadSavedCart = () => {
    try {
      const savedCart = localStorage.getItem(cartStorageKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        console.log('✅ Loaded saved cart:', parsedCart.length, 'items');
      }
    } catch (error) {
      console.error('Error loading saved cart:', error);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      console.log('💾 Cart saved to localStorage');
    }
  }, [cart]);

  const loadMenu = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate café selection
      if (!selectedCafeId) {
        setError('No café selected for this meetup');
        setIsLoading(false);
        return;
      }

      console.log('🍽️ Loading menu for café:', selectedCafeId);

      // Fetch menu from API
      const menu = await fetchCafeMenu(selectedCafeId);

      if (!menu) {
        setError('Failed to load menu. Café not found.');
        setIsLoading(false);
        return;
      }

      setMenuData(menu);
      
      // Set first category as active
      const categories = Object.keys(menu.categories);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }

      console.log('✅ Menu loaded successfully:', menu.cafeName);
    } catch (err) {
      console.error('❌ Error loading menu:', err);
      setError('Failed to load menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: any) => {
    if (readOnly || !isAdmin) {
      toast.error('Only admin can manage the order');
      return;
    }

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i));
      toast.success(`${item.name} quantity increased`);
    } else {
      setCart([...cart, {...item, quantity: 1}]);
      toast.success(`${item.name} added to order`);
    }
  };

  const removeFromCart = (itemId: string) => {
    if (readOnly || !isAdmin) {
      toast.error('Only admin can manage the order');
      return;
    }

    const existing = cart.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i => i.id === itemId ? {...i, quantity: i.quantity - 1} : i));
      toast.success('Quantity decreased');
    } else {
      setCart(cart.filter(i => i.id !== itemId));
      toast.success('Item removed from order');
    }
  };

  const handlePlaceOrder = () => {
    if (readOnly || !isAdmin) {
      toast.error('Only admin can place the order');
      return;
    }

    if (cart.length === 0) {
      toast.error('Please add items to order');
      return;
    }

    // Navigate to order summary
    onNavigate('unified-order-summary', {
      ...meetupData,
      orderItems: cart,
      cafe: {
        id: selectedCafeId,
        name: menuData.cafeName,
        rating: menuData.cafeRating
      },
      isAdmin,
      viewOnly: false
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-[#be9d80] px-4 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Loading Menu...</h1>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-24">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#8b5943]/20 to-[#d9bf9d]/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#8b5943] animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-[22px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
                Loading Menu
              </h2>
              <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Fetching delicious items from the café...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-[#be9d80] px-4 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Menu</h1>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-[600px] mx-auto px-4 py-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-red-900 mb-2">
              Unable to Load Menu
            </h2>
            <p className="text-[14px] text-red-700 font-['Arial:Regular',_sans-serif] mb-6">
              {error || 'No café selected for this meetup'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadMenu}
                className="bg-[#030213] text-white px-6 py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] hover:bg-[#030213]/90 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={onBack}
                className="bg-white border-2 border-neutral-300 text-neutral-950 px-6 py-3 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] hover:bg-neutral-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Menu UI
  const categories = Object.keys(menuData.categories);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-[#be9d80] text-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] leading-[28px] font-['Arial:Regular',_sans-serif]">
                {menuData.cafeName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-[13px] text-white/90">
                  {menuData.cafeRating} ({menuData.cafeReviews} reviews)
                </span>
              </div>
            </div>
            {!isAdmin && (
              <Badge className="bg-white/20 text-white border-0">
                Member
              </Badge>
            )}
          </div>

          {/* Read-Only Banner */}
          {(readOnly || !isAdmin) && (
            <div className="bg-blue-500/20 border border-blue-300/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white" />
                <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-white">
                  View only – Only admin can place the order
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[136px] z-40 bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-['Arial:Regular',_sans-serif] text-[14px] whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#030213] text-white'
                    : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Empty Cart Message for Members */}
        {!isAdmin && cart.length === 0 && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[15px] font-medium text-amber-900 font-['Arial:Regular',_sans-serif] mb-1">
                  No items added yet
                </p>
                <p className="text-[13px] text-amber-700 font-['Arial:Regular',_sans-serif]">
                  The admin hasn't added any items to the order yet. You can browse the menu while waiting.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Admin's Cart for Members */}
        {!isAdmin && cart.length > 0 && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShoppingCart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[15px] font-medium text-green-900 font-['Arial:Regular',_sans-serif] mb-2">
                  Admin's Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </p>
                <div className="space-y-1">
                  {cart.map((item) => (
                    <p key={item.id} className="text-[13px] text-green-700 font-['Arial:Regular',_sans-serif]">
                      {item.quantity}x {item.name} – ₹{item.price * item.quantity}
                    </p>
                  ))}
                  <p className="text-[14px] font-medium text-green-900 pt-2 border-t border-green-200">
                    Total: ₹{totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuData.categories[activeCategory]?.map((item: any) => {
            const cartItem = cart.find(i => i.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Item Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image?.startsWith('/uploads/') ? `http://localhost:5000${item.image}` : item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.popular && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white border-0">
                      Popular
                    </Badge>
                  )}
                  {/* Veg/Non-Veg Indicator */}
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-sm flex items-center justify-center border-2 ${
                    item.veg ? 'bg-white border-green-600' : 'bg-white border-red-600'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      item.veg ? 'bg-green-600' : 'bg-red-600'
                    }`}></div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif] line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[18px] font-medium text-neutral-950">
                      ₹{item.price}
                    </span>

                    {/* Add/Quantity Controls */}
                    {isAdmin && !readOnly ? (
                      quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-green-50 border-2 border-green-500 rounded-lg px-2 py-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded hover:bg-green-100 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-green-700" />
                          </button>
                          <span className="text-[15px] font-medium text-green-700 min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded hover:bg-green-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-green-700" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(item)}
                          className="h-[36px] bg-[#030213] hover:bg-[#030213]/90 rounded-lg"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-[13px] text-neutral-500 font-['Arial:Regular',_sans-serif]">
                        <Lock className="w-4 h-4" />
                        View Only
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty Category State */}
        {(!menuData.categories[activeCategory] || menuData.categories[activeCategory].length === 0) && (
          <div className="text-center py-16">
            <Info className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              No items available in this category
            </p>
          </div>
        )}
      </div>

      {/* Cart Footer - Only for Admin */}
      {isAdmin && !readOnly && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
                <p className="text-[20px] font-medium text-neutral-950">
                  ₹{totalAmount}
                </p>
              </div>
              <Button
                onClick={handlePlaceOrder}
                className="h-[48px] bg-green-600 hover:bg-green-700 rounded-lg px-8"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Place Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card for Members */}
      {!isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t-2 border-blue-200 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                You can browse the menu. The admin will place the order for the group.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

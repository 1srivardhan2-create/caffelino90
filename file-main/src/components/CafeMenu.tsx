import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface CafeMenuProps {
  cafe: any;
  onNavigate: (page: string) => void;
}

const MENU_ITEMS = {
  snacks: [
    { id: '1', name: 'French Fries', price: 120, veg: true, popular: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400' },
    { id: '2', name: 'Chicken Wings', price: 280, veg: false, popular: true, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400' },
    { id: '3', name: 'Nachos', price: 180, veg: true, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400' },
  ],
  pizza: [
    { id: '4', name: 'Margherita Pizza', price: 350, veg: true, popular: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
    { id: '5', name: 'Pepperoni Pizza', price: 420, veg: false, popular: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { id: '6', name: 'Veggie Supreme', price: 380, veg: true, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96c47?w=400' },
  ],
  drinks: [
    { id: '7', name: 'Cappuccino', price: 150, veg: true, popular: true, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
    { id: '8', name: 'Cold Coffee', price: 180, veg: true, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400' },
    { id: '9', name: 'Fresh Juice', price: 120, veg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
  ],
  desserts: [
    { id: '10', name: 'Chocolate Cake', price: 180, veg: true, popular: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
    { id: '11', name: 'Ice Cream', price: 120, veg: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
    { id: '12', name: 'Brownie', price: 150, veg: true, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400' },
  ]
};

export default function CafeMenu({ cafe, onNavigate }: CafeMenuProps) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i => i.id === itemId ? {...i, quantity: i.quantity - 1} : i));
    } else {
      setCart(cart.filter(i => i.id !== itemId));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-14 z-40 px-4 py-4">
          <button 
            onClick={() => onNavigate('group-detail')}
            className="caffelino-back-btn mb-3"
          >
            ← Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-1">Café Milano</h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>4.5 (234 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4">
          <Tabs defaultValue="snacks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="snacks">Snacks</TabsTrigger>
              <TabsTrigger value="pizza">Pizza</TabsTrigger>
              <TabsTrigger value="drinks">Drinks</TabsTrigger>
              <TabsTrigger value="desserts">Desserts</TabsTrigger>
            </TabsList>

            {Object.entries(MENU_ITEMS).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-0 overflow-hidden">
                      <div className="flex items-center gap-4">
                        {/* Food Image */}
                        {item.image && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 flex items-center justify-between py-4 pr-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={item.veg ? 'text-green-600' : 'text-red-600'}>
                                {item.veg ? '🟢' : '🔴'}
                              </span>
                              <span>{item.name}</span>
                              {item.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                            </div>
                            <div className="text-slate-600">₹{item.price}</div>
                          </div>
                          
                          {cart.find(i => i.id === item.id) ? (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">
                                {cart.find(i => i.id === item.id)?.quantity}
                              </span>
                              <Button 
                                size="sm"
                                onClick={() => addToCart(item)}
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                              + Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span>{totalItems} items</span>
                </div>
                <div className="text-2xl">₹{totalAmount}</div>
              </div>
              <Button size="lg" onClick={() => onNavigate('payment')}>
                View Cart & Pay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

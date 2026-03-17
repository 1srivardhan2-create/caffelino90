import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';
import { orderDB, meetupMemberDB, OrderItem } from '../utils/database';

interface MenuSelectionMemberProps {
  onNavigate: (page: string, data?: any) => void;
  meetupData: any;
  user: any;
}

// Mock menu items - in production, fetch from cafe's menu
const MOCK_MENU: any[] = [];

export default function MenuSelectionMember({ onNavigate, meetupData, user }: MenuSelectionMemberProps) {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Add null safety check
  if (!meetupData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-['Arial:Regular',_sans-serif] text-[20px] text-neutral-950 mb-2">
            No Meetup Data
          </h2>
          <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600 mb-4">
            Unable to load meetup information
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#be9d80] text-white px-6 py-3 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-[#a88a6f] transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const filteredMenu = MOCK_MENU.filter(item => {
    if (foodTypeFilter === 'all') return true;
    return item.foodType === foodTypeFilter;
  });

  const handleIncrement = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleDecrement = (itemId: string) => {
    setSelectedItems(prev => {
      const newQty = (prev[itemId] || 0) - 1;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [itemId]: newQty
      };
    });
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
      const item = MOCK_MENU.find(m => m.id === itemId);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const getBillDetails = () => {
    const subtotal = getTotalPrice();
    const cgst = Math.round((subtotal * 5 / 100) * 100) / 100;
    const sgst = Math.round((subtotal * 5 / 100) * 100) / 100;
    const total = subtotal + cgst + sgst;
    return { subtotal, cgst, sgst, total };
  };

  const handleConfirmSelection = async () => {
    if (getTotalItems() === 0) {
      toast.error('Please select at least one item');
      return;
    }

    setIsLoading(true);

    try {
      // Convert selectedItems to order format
      const orders: OrderItem[] = Object.entries(selectedItems).map(([itemId, quantity]) => {
        const menuItem = MOCK_MENU.find(m => m.id === itemId);
        return {
          id: `order-${meetupData.meetupId}-${user.id}-${itemId}-${Date.now()}`,
          name: menuItem?.name || '',
          price: menuItem?.price || 0,
          quantity,
          category: menuItem?.category,
          orderedBy: user.id,
          orderedByName: user.name,
        };
      });

      // Save orders to local database
      const orderData = {
        id: `order-${Date.now()}`,
        meetup_id: meetupData.meetupId,
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        items: orders,
        subtotal: getTotalPrice(),
        cgst: Math.round((getTotalPrice() * 5 / 100) * 100) / 100,
        sgst: Math.round((getTotalPrice() * 5 / 100) * 100) / 100,
        totalAmount: getTotalPrice() + (getTotalPrice() * 10 / 100),
        status: 'pending' as const,
        adminName: '',
        adminPhone: '',
        memberCount: 1,
        createdAt: new Date().toISOString(),
      };
      
      await orderDB.save(orderData);

      // Update member's menu selection status
      await meetupMemberDB.updateMenuSelection(meetupData.meetupId, user.id, orders);

      const billDetails = getBillDetails();

      const orderDataForPayment = {
        orderId: orderData.orderNumber,
        userName: user.name,
        items: orders,
        subtotal: billDetails.subtotal,
        cgst: billDetails.cgst,
        sgst: billDetails.sgst,
        total: billDetails.total,
        timestamp: Date.now()
      };

      // Navigate to payment method selection
      onNavigate('payment-method-selection', {
        orderData: orderDataForPayment,
        meetupData: meetupData,
        user: user
      });

    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Arial:Regular',_sans-serif] text-[16px]">Back</span>
          </button>
          <h1 className="font-['Arial:Regular',_sans-serif] text-[18px] text-white">
            Select Your Order
          </h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Meetup Info */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
        <h2 className="font-['Arial:Regular',_sans-serif] text-[20px] text-neutral-950 mb-1">
          {meetupData.meetupName}
        </h2>
        <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600">
          📍 {meetupData.cafeName}
        </p>
      </div>

      {/* Food Type Filter */}
      <div className="p-4 flex gap-2">
        <button
          onClick={() => setFoodTypeFilter('all')}
          className={`px-4 py-2 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[14px] transition-all ${
            foodTypeFilter === 'all'
              ? 'bg-[#be9d80] text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFoodTypeFilter('veg')}
          className={`px-4 py-2 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[14px] transition-all ${
            foodTypeFilter === 'veg'
              ? 'bg-[#be9d80] text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          🟢 Veg
        </button>
        <button
          onClick={() => setFoodTypeFilter('non-veg')}
          className={`px-4 py-2 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[14px] transition-all ${
            foodTypeFilter === 'non-veg'
              ? 'bg-[#be9d80] text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          🔴 Non-Veg
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3 pb-32">
        {filteredMenu.map((item) => {
          const quantity = selectedItems[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-[12px] p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <img
                  src={item.image?.startsWith('/uploads/') ? `http://localhost:5000${item.image}` : item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-[8px] object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950">
                      {item.name}
                    </h3>
                    <span className="text-[14px] ml-2">
                      {item.foodType === 'veg' ? '🟢' : '🔴'}
                    </span>
                  </div>
                  <p className="font-['Arial:Regular',_sans-serif] text-[14px] text-neutral-600 mb-2">
                    {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-2">
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="bg-[#be9d80] text-white px-4 py-1 rounded-[6px] font-['Arial:Regular',_sans-serif] text-[14px] hover:bg-[#a88a6f] transition-colors"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-neutral-700" />
                          </button>
                          <span className="font-['Arial:Regular',_sans-serif] text-[16px] text-neutral-950 w-8 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="w-8 h-8 rounded-full bg-[#be9d80] flex items-center justify-center hover:bg-[#a88a6f] transition-colors"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Cart Summary */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#be9d80] shadow-2xl">
          <div className="max-w-4xl mx-auto p-4">
            {/* Selected Items Summary */}
            <div className="mb-3 max-h-[120px] overflow-y-auto">
              {Object.entries(selectedItems).map(([itemId, qty]) => {
                const item = MOCK_MENU.find(m => m.id === itemId);
                if (!item) return null;
                return (
                  <div key={itemId} className="flex items-center justify-between mb-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      <img src={item.image?.startsWith('/uploads/') ? `http://localhost:5000${item.image}` : item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                      <span className="font-['Arial:Regular',_sans-serif] text-neutral-700">
                        {item.name} x {qty}
                      </span>
                    </div>
                    <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">
                      ₹{item.price * qty}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Bill Breakdown */}
            <div className="border-t border-neutral-200 pt-3 mb-3 space-y-1">
              <div className="flex justify-between text-[13px]">
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">Subtotal</span>
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{getBillDetails().subtotal}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">CGST (5%)</span>
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{getBillDetails().cgst}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-600">SGST (5%)</span>
                <span className="font-['Arial:Regular',_sans-serif] text-neutral-950">₹{getBillDetails().sgst}</span>
              </div>
              <div className="flex justify-between text-[16px] font-['Arial:Bold',_sans-serif] pt-2 border-t border-neutral-300">
                <span className="text-neutral-950">Total</span>
                <span className="text-[#be9d80]">₹{getBillDetails().total}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmSelection}
              disabled={isLoading}
              className="w-full bg-[#030213] text-white py-3 rounded-[8px] font-['Arial:Regular',_sans-serif] text-[15px] hover:bg-[#030213]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirm Order (₹{getBillDetails().total})
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, Search, Coffee, UtensilsCrossed } from 'lucide-react';

interface MenuPreviewProps {
  onBack: () => void;
  meetupData?: any;
}

// Sample menu data (same as MenuSelection)
const MENU_ITEMS = [
  // Coffee
  { id: 1, name: 'Espresso', category: 'Coffee', price: 80, emoji: '☕', description: 'Strong and bold' },
  { id: 2, name: 'Cappuccino', category: 'Coffee', price: 120, emoji: '☕', description: 'Classic Italian coffee' },
  { id: 3, name: 'Latte', category: 'Coffee', price: 130, emoji: '☕', description: 'Smooth and creamy' },
  { id: 4, name: 'Americano', category: 'Coffee', price: 90, emoji: '☕', description: 'Light and refreshing' },
  { id: 5, name: 'Mocha', category: 'Coffee', price: 150, emoji: '☕', description: 'Chocolate delight' },
  { id: 6, name: 'Cold Brew', category: 'Coffee', price: 140, emoji: '☕', description: 'Smooth cold coffee' },
  
  // Food
  { id: 7, name: 'Croissant', category: 'Food', price: 80, emoji: '🥐', description: 'Buttery and flaky' },
  { id: 8, name: 'Sandwich', category: 'Food', price: 150, emoji: '🥪', description: 'Fresh and filling' },
  { id: 9, name: 'Bagel', category: 'Food', price: 100, emoji: '🥯', description: 'With cream cheese' },
  { id: 10, name: 'Muffin', category: 'Food', price: 90, emoji: '🧁', description: 'Freshly baked' },
  { id: 11, name: 'Cookies', category: 'Food', price: 60, emoji: '🍪', description: 'Chocolate chip' },
  { id: 12, name: 'Cake Slice', category: 'Food', price: 120, emoji: '🍰', description: 'Various flavors' },
];

export default function MenuPreview({ onBack, meetupData }: MenuPreviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Coffee' | 'Food'>('All');

  const categories: ('All' | 'Coffee' | 'Food')[] = ['All', 'Coffee', 'Food'];

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Café Menu</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
            <span className="font-bold">Preview Mode:</span> Browse the menu. {meetupData ? 'Only admin can place orders.' : 'Join the meetup to place your order!'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-neutral-200 rounded-lg pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#8b5943] focus:border-transparent"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-lg text-[14px] font-['Arial:Regular',_sans-serif] whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-[#8b5943] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {category === 'Coffee' && <Coffee className="w-4 h-4" />}
              {category === 'Food' && <UtensilsCrossed className="w-4 h-4" />}
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-neutral-200 rounded-lg p-4 hover:border-[#8b5943] transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Emoji Icon */}
                <div className="text-4xl">{item.emoji}</div>
                
                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-['Arial:Regular',_sans-serif] text-[#8b5943]">
                      ₹{item.price}
                    </span>
                    <span className="text-[12px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
              No items found
            </p>
            <p className="text-[14px] text-neutral-500 font-['Arial:Regular',_sans-serif] mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
          <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
            Menu Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Total Items
              </p>
              <p className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                {MENU_ITEMS.length}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                Price Range
              </p>
              <p className="text-[24px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                ₹{Math.min(...MENU_ITEMS.map(i => i.price))} - ₹{Math.max(...MENU_ITEMS.map(i => i.price))}
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={onBack}
            className="w-full h-[48px] rounded-lg font-['Arial:Regular',_sans-serif] text-[15px] text-white transition-all bg-[#030213] hover:bg-[#030213]/90 cursor-pointer"
          >
            {meetupData ? 'Back to Chat' : 'Back to Join Meetup'}
          </button>
        </div>
      </div>
    </div>
  );
}

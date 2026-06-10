import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';

interface FoodMenuCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    type: string;
    isVeg: boolean;
    rating: number;
    reviews: number;
  };
  quantity: number;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isAdmin?: boolean;
}

export default function FoodMenuCard({ 
  item, 
  quantity, 
  onAddToCart, 
  onIncrement, 
  onDecrement,
  isAdmin = true 
}: FoodMenuCardProps) {
  // Generate category badge color
  const getCategoryColor = () => {
    switch (item.category) {
      case 'Beverages':
        return item.type === 'Hot' ? 'bg-orange-500' : 'bg-blue-500';
      case 'Food':
        return item.isVeg ? 'bg-green-600' : 'bg-red-600';
      case 'Desserts':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Render stars based on rating
  const renderStars = () => {
    const fullStars = Math.floor(item.rating);
    const hasHalfStar = item.rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-orange-200 text-orange-400" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 relative group">
      {/* Food Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 ${getCategoryColor()} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
          {item.type}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Food Name */}
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
          <span className="text-sm text-gray-500">— {item.reviews}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-gray-800">₹{item.price}</span>
        </div>

        {/* Actions */}
        {isAdmin ? (
          quantity > 0 ? (
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-500 rounded-xl p-2">
              <button
                onClick={onDecrement}
                className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-bold text-gray-800 px-4">{quantity}</span>
              <button
                onClick={onIncrement}
                className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Button
              onClick={onAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </Button>
          )
        ) : (
          <div className="bg-gray-100 text-gray-600 py-3 rounded-xl text-center text-sm font-medium">
            Admin Only
          </div>
        )}
      </div>
    </div>
  );
}

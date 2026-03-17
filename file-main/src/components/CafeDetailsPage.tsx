import { ArrowLeft, Star, MapPin, Clock, DollarSign, Phone, Share2, Store, BadgeCheck, Coffee, Utensils, Leaf, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { Cafe } from '../utils/cafesData';
import POSMenuInterface from './POSMenuInterface';

// Helper to resolve image URLs (prepend server base for /uploads/ paths)
const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `http://localhost:5000${url}`;
  return url;
};

interface CafeDetailsPageProps {
  cafe: any; // Can be either hardcoded Cafe or DB cafe object
  user: any;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

const DEFAULT_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800';

export default function CafeDetailsPage({ cafe, user, onBack, onNavigate }: CafeDetailsPageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'photos' | 'menu'>('photos');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleOrderUpdate = (items: any[]) => {
    setOrderItems(items);
  };

  // Detect if this is a DB cafe (from MongoDB) or hardcoded cafe
  const isDbCafe = !!(cafe?.Name || cafe?._id || cafe?.Cafe_photos);

  // Normalize data for consistent rendering
  const cafeName = isDbCafe ? (cafe.Name || 'Unnamed Cafe') : cafe?.name;
  const cafeImage = isDbCafe
    ? (cafe.profilePicture 
        ? (cafe.profilePicture.startsWith('/uploads/') ? `http://localhost:5000${cafe.profilePicture}` : cafe.profilePicture)
        : ((cafe.Cafe_photos && cafe.Cafe_photos.length > 0) 
            ? (cafe.Cafe_photos[0].startsWith('/uploads/') ? `http://localhost:5000${cafe.Cafe_photos[0]}` : cafe.Cafe_photos[0]) 
            : DEFAULT_CAFE_IMAGE))
    : cafe?.image;
  const cafePhotos = isDbCafe ? (cafe.Cafe_photos || []).map((p: string) => resolveImageUrl(p)) : (cafe?.photos || []);
  const cafeAddress = isDbCafe ? (cafe.Cafe_Address || cafe.cafe_location || '') : (cafe?.location || '');
  const cafeCost = isDbCafe ? (cafe.Average_Cost || 0) : (cafe?.priceForTwo || 0);
  const cafeType = isDbCafe ? (cafe.establishmentType || 'Cafe') : (cafe?.cuisine || '');
  const cafeAbout = isDbCafe ? (cafe.AboutCafe || '') : '';
  const cafeManager = isDbCafe ? (cafe.managerName || '') : '';
  const cafePhone = isDbCafe ? (cafe.Phonenumber || '') : '';
  const cafeTables = isDbCafe ? (cafe.tables || 0) : 0;
  const cafeMenuItems = isDbCafe ? (cafe.menuItems || []) : [];
  const cafeRating = isDbCafe ? 0 : (cafe?.rating || 0);
  const cafeReviews = isDbCafe ? 0 : (cafe?.reviews || 0);
  const cafeTags = isDbCafe ? [cafeType, 'Verified Partner'].filter(Boolean) : (cafe?.tags || []);
  const isOpen = isDbCafe ? true : (cafe?.isOpen || false);

  // Group menu items by category dynamically
  const groupedMenu = cafeMenuItems.reduce((acc: any, item: any) => {
    const category = item.Category || item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fffbf5] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#be9d80] border-b border-black shadow-md">
        <div className="flex items-center justify-between px-4 py-3 h-[56px]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[15px] font-medium">Back</span>
          </button>
          <h1 className="text-white text-[16px] font-medium">Cafe Details</h1>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Cafe Hero Image */}
      <div className="relative h-[240px] md:h-[300px] bg-[#fdfaf7] flex items-center justify-center border-b border-[#e8d5c4]">
        <img
          src={cafeImage}
          alt={cafeName}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e: any) => { e.target.src = DEFAULT_CAFE_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        {isDbCafe && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-lg flex items-center gap-1 z-10">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified Partner
          </div>
        )}
        {isOpen ? (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-[12px] font-medium">
            Open Now
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-[12px] font-medium">
            Closed
          </div>
        )}

        {/* Photo count badge */}
        {cafePhotos.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-[12px] flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            {cafePhotos.length} photos
          </div>
        )}
      </div>

      {/* Cafe Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <div className="flex items-start gap-3 mb-2">
            <Store className="w-6 h-6 text-[#8b5943] flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] text-[#0a0a0a] mb-1">
                {cafeName}
              </h2>
              <p className="text-[14px] text-gray-600 mb-2">{cafeType}</p>
            </div>
          </div>

          {/* Rating (for hardcoded cafes) */}
          {cafeRating > 0 && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-[14px] font-medium text-[#0a0a0a]">{cafeRating}</span>
                <span className="text-[12px] text-gray-500">({cafeReviews} reviews)</span>
              </div>
            </div>
          )}

          {/* Address */}
          {cafeAddress && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
              <span className="text-[13px]">{cafeAddress}</span>
            </div>
          )}

          {/* Cost */}
          {cafeCost > 0 && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <DollarSign className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
              <span className="text-[13px]">₹{cafeCost} for one</span>
            </div>
          )}

          {/* Manager & Phone (for DB cafes) */}
          {isDbCafe && cafeManager && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Coffee className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
              <span className="text-[13px]">Managed by <strong>{cafeManager}</strong></span>
            </div>
          )}
          {isDbCafe && cafePhone && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Phone className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
              <span className="text-[13px]">{cafePhone}</span>
            </div>
          )}
          {isDbCafe && cafeTables > 0 && (
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Utensils className="w-4 h-4 flex-shrink-0 text-[#be9d80]" />
              <span className="text-[13px]">{cafeTables} tables available</span>
            </div>
          )}

          {/* About */}
          {cafeAbout && (
            <div className="mt-4 p-4 bg-[#f9f5f0] rounded-xl">
              <p className="text-[13px] text-neutral-700 italic">"{cafeAbout}"</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {cafeTags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-[rgba(139,89,67,0.1)] text-[#8b5943] text-[12px] rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation: Photos | Menu */}
      {isDbCafe && (
        <div className="bg-white border-b border-gray-200 sticky top-[56px] z-40">
          <div className="flex">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-3 text-center text-[15px] font-medium transition-colors border-b-3 ${activeTab === 'photos'
                ? 'text-[#8b5943] border-b-[3px] border-[#8b5943]'
                : 'text-gray-500 border-b-[3px] border-transparent hover:text-gray-700'
                }`}
            >
              📸 Photos ({cafePhotos.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-3 text-center text-[15px] font-medium transition-colors border-b-3 ${activeTab === 'menu'
                ? 'text-[#8b5943] border-b-[3px] border-[#8b5943]'
                : 'text-gray-500 border-b-[3px] border-transparent hover:text-gray-700'
                }`}
            >
              🍽️ Menu ({cafeMenuItems.length})
            </button>
          </div>
        </div>
      )}

      {/* ─── DB CAFE: Photos Tab ─── */}
      {isDbCafe && activeTab === 'photos' && (
        <div className="px-4 py-6">
          {cafePhotos.length > 0 ? (
            <>
              <h3 className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#0a0a0a] mb-4">
                Cafe Photos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {cafePhotos.map((photo: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative aspect-square rounded-xl bg-[#fdfaf7] border border-[#e8d5c4] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-center"
                  >
                    <img
                      src={photo}
                      alt={`${cafeName} photo ${index + 1}`}
                      className="w-full h-full object-contain transition-transform duration-300"
                      loading="lazy"
                      onError={(e: any) => { e.target.src = DEFAULT_CAFE_IMAGE; }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {index + 1} / {cafePhotos.length}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-[14px] text-gray-500">No photos uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {/* ─── DB CAFE: Menu Tab ─── */}
      {isDbCafe && activeTab === 'menu' && (
        <div className="px-4 py-8">
          {cafeMenuItems.length > 0 ? (
            <div className="space-y-[30px]">
              {Object.entries(groupedMenu).map(([category, items]: [string, any]) => (
                <div key={category} className="section mt-[30px]">
                  <h2 className="text-[22px] font-semibold text-[#0a0a0a] mb-4 border-b pb-2">
                    {category}
                  </h2>
                  <div className="space-y-4 shadow-sm">
                    {items.map((item: any, index: number) => (
                      <div
                        key={item._id || index}
                        className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                      >
                        {/* Fixed Image Container */}
                        <div
                          style={{ minWidth: '120px', maxWidth: '120px', height: '120px' }}
                          className="rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center border border-gray-100"
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url?.startsWith('/uploads/') ? `http://localhost:5000${item.image_url}` : item.image_url}
                              alt={item.item_name}
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.onerror = null; // Prevent infinite loop
                                // Replace with default Category placeholder
                                if (item.Category === 'Beverages') e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
                                else if (item.Category === 'Food') e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                                else if (item.Category === 'Desserts' || item.Category === 'Pizzas') e.target.src = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop';
                                else e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop';
                              }}
                            />
                          ) : (
                            <Utensils className="w-8 h-8 text-gray-300" />
                          )}
                        </div>

                        {/* Content on the right */}
                        <div className="flex-1 flex justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              {/* Veg/Non-veg indicator */}
                              <div className={`w-4 h-4 border-[1.5px] rounded-sm flex items-center justify-center ${item.food_type === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${item.food_type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                              </div>
                              <h4 className="text-[17px] font-semibold text-[#0a0a0a]">
                                {item.item_name}
                              </h4>
                            </div>
                            <div className="mt-1">
                              <span className="inline-block text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                {item.Category || item.category || 'Other'}
                              </span>
                            </div>
                            {item.description_food && (
                              <p className="text-[13px] text-gray-500 mt-2 line-clamp-2 pr-2 leading-relaxed">
                                {item.description_food}
                              </p>
                            )}
                          </div>

                          <div className="text-right pl-2">
                            <span className="text-[17px] font-bold text-[#8b5943] whitespace-nowrap">
                              ₹{item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[16px] font-medium text-gray-600">Menu not available yet</p>
              <p className="text-[14px] text-gray-400 mt-1">The cafe owner hasn't added menu items</p>
            </div>
          )}
        </div>
      )}

      {/* ─── HARDCODED CAFE: View Menu Button ─── */}
      {!isDbCafe && !showMenu && (
        <div className="px-4 py-6">
          <button
            onClick={() => setShowMenu(true)}
            className="w-full bg-[#0a0a0a] text-white h-[52px] rounded-[16px] font-bold text-[16px] hover:bg-[#1a1a1a] transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
          >
            View Full Menu & Order
          </button>
        </div>
      )}

      {/* ─── HARDCODED CAFE: Ambiance Photos ─── */}
      {!isDbCafe && !showMenu && cafePhotos.length > 0 && (
        <div className="px-4 py-6 bg-white border-t border-gray-200">
          <h3 className="text-[20px] font-['Arial:Regular',_sans-serif] text-[#0a0a0a] mb-4">
            Ambiance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {cafePhotos.map((photo: string, index: number) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={photo}
                  alt={`${cafeName} ambiance ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── HARDCODED CAFE: Menu Section ─── */}
      {!isDbCafe && showMenu && (
        <div className="bg-white">
          <div className="sticky top-[56px] z-40 bg-[#8b5943] px-4 py-3 border-b border-[#7a4a35]">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-[18px] font-medium">Menu & Order</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="text-white text-[14px] hover:text-gray-200"
              >
                Close Menu
              </button>
            </div>
          </div>

          <POSMenuInterface
            menuItems={isDbCafe ? cafeMenuItems : (cafe?.menu || [])}
            orderItems={orderItems}
            onOrderUpdate={handleOrderUpdate}
            isAdmin={false}
            onConfirmOrder={() => { }}
            orderConfirmed={false}
          />
        </div>
      )}

      {/* Full-screen Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[15px] font-medium">Back</span>
          </button>
          <img
            src={resolveImageUrl(selectedPhoto)}
            alt="Full size photo"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
// Mock cafes data - Like Swiggy/Zomato
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Beverages' | 'Food' | 'Desserts';
  type: string;
  isVeg: boolean;
  rating: number;
  reviews: number;
  description?: string;
}

export interface Cafe {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string;
  deliveryTime: string;
  priceForTwo: number;
  location: string;
  distance: string;
  isOpen: boolean;
  tags: string[];
  menu: MenuItem[];
  photos?: string[]; // Cafe ambiance photos uploaded by owner
}

export const CAFES: Cafe[] = [];

export function getCafeById(cafeId: string): Cafe | undefined {
  return CAFES.find(cafe => cafe.id === cafeId);
}

export function getMenuItemById(cafeId: string, itemId: string): MenuItem | undefined {
  const cafe = getCafeById(cafeId);
  return cafe?.menu.find(item => item.id === itemId);
}
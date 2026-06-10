/**
 * Generates a unique 6-digit order ID
 * Format: 123456 (pure 6-digit number)
 * 
 * This ensures consistency between customer view and cafe owner view
 */
export function generateOrderId(): string {
  // Generate a random 6-digit number
  const randomId = Math.floor(100000 + Math.random() * 900000);
  return randomId.toString();
}

/**
 * Alias for generateOrderId for backwards compatibility
 */
export function generateUniqueOrderId(): string {
  return generateOrderId();
}

/**
 * Creates order number with prefix for display
 * Format: ORD123456
 */
export function formatOrderNumber(orderId: string): string {
  return `ORD${orderId}`;
}

/**
 * Extracts the 6-digit ID from a formatted order number
 * ORD123456 → 123456
 */
export function extractOrderId(orderNumber: string): string {
  return orderNumber.replace('ORD', '');
}

/**
 * Stores a completed order to localStorage
 */
export function storeCompletedOrder(orderData: {
  orderId: string;
  cafeOrderNumber: string;
  groupId: string;
  groupName: string;
  meetupName: string;
  userId: string;
  userName: string;
  totalAmount: number;
  userAmount: number;
  paymentMethod: string;
  cafeName: string;
  orderDate: string;
  completedAt: string;
  items: any[];
}): void {
  const completedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
  completedOrders.push(orderData);
  localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
}
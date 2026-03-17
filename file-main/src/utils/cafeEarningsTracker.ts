// Cafe Earnings Tracker - Single source of truth for today's earnings

import { safeStorage } from './safeStorage';

export interface DailyEarnings {
  date: string; // YYYY-MM-DD format
  totalEarnings: number;
  onlineEarnings: number;
  cashEarnings: number;
  completedOrders: string[]; // Order numbers that contributed to earnings
  lastUpdated: string; // ISO timestamp
  orderEarningsMap: { [orderNumber: string]: { total: number; online: number; cash: number } }; // Track per-order earnings
}

const EARNINGS_STORAGE_KEY = 'cafe_daily_earnings';

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Load today's earnings from safeStorage
export function loadTodayEarnings(): DailyEarnings {
  const stored = safeStorage.getItem(EARNINGS_STORAGE_KEY);
  const todayDate = getTodayDate();
  
  if (stored) {
    const earnings: DailyEarnings = JSON.parse(stored);
    
    // If the stored date matches today, return it
    if (earnings.date === todayDate) {
      // Ensure orderEarningsMap exists for backwards compatibility
      if (!earnings.orderEarningsMap) {
        earnings.orderEarningsMap = {};
      }
      return earnings;
    }
  }
  
  // Return fresh earnings for today
  return {
    date: todayDate,
    totalEarnings: 0,
    onlineEarnings: 0,
    cashEarnings: 0,
    completedOrders: [],
    lastUpdated: new Date().toISOString(),
    orderEarningsMap: {},
  };
}

// Add earnings from a completed order (supports incremental cash collection)
export function addOrderEarnings(
  orderNumber: string,
  totalBill: number,
  onlinePaid: number,
  cashCollected: number
): void {
  const earnings = loadTodayEarnings();
  
  console.log('📊 EARNINGS TRACKER - Adding Order:', {
    orderNumber,
    totalBill,
    onlinePaid,
    cashCollected,
    currentTotal: earnings.totalEarnings,
    currentCash: earnings.cashEarnings
  });
  
  // Check if this order has already been tracked
  const existingOrderEarnings = earnings.orderEarningsMap[orderNumber];
  
  if (existingOrderEarnings) {
    // Order already tracked - add incremental cash earnings only
    const cashDifference = cashCollected - existingOrderEarnings.cash;
    
    console.log('📈 INCREMENTAL UPDATE:', {
      existingCash: existingOrderEarnings.cash,
      newCash: cashCollected,
      difference: cashDifference
    });
    
    if (cashDifference > 0) {
      // Add the new cash amount
      earnings.cashEarnings += cashDifference;
      earnings.totalEarnings += cashDifference;
      
      // Update the order's earnings map
      earnings.orderEarningsMap[orderNumber] = {
        total: existingOrderEarnings.total,
        online: existingOrderEarnings.online,
        cash: cashCollected, // Update to new total cash
      };
      
      earnings.lastUpdated = new Date().toISOString();
      safeStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(earnings));
      
      console.log('✅ EARNINGS UPDATED (Incremental):', {
        newTotal: earnings.totalEarnings,
        newCash: earnings.cashEarnings,
        addedCash: cashDifference
      });
    }
    
    return; // Already tracked, updated if needed
  }
  
  // New order - add full earnings
  // Only add cash collected (no totalBill if it's 0)
  const amountToAdd = totalBill > 0 ? totalBill : cashCollected;
  
  earnings.totalEarnings += amountToAdd;
  earnings.onlineEarnings += onlinePaid;
  earnings.cashEarnings += cashCollected;
  
  if (!earnings.completedOrders.includes(orderNumber)) {
    earnings.completedOrders.push(orderNumber);
  }
  
  // Track this order's earnings
  earnings.orderEarningsMap[orderNumber] = {
    total: totalBill > 0 ? totalBill : cashCollected,
    online: onlinePaid,
    cash: cashCollected,
  };
  
  earnings.lastUpdated = new Date().toISOString();
  
  // Save to safeStorage
  safeStorage.setItem(EARNINGS_STORAGE_KEY, JSON.stringify(earnings));
  
  console.log('✅ EARNINGS ADDED (New Order):', {
    orderNumber,
    amountAdded: amountToAdd,
    newTotal: earnings.totalEarnings,
    newCash: earnings.cashEarnings
  });
}

// Get earnings summary
export function getTodayEarningsSummary() {
  const earnings = loadTodayEarnings();
  return {
    total: earnings.totalEarnings,
    online: earnings.onlineEarnings,
    cash: earnings.cashEarnings,
    ordersCount: earnings.completedOrders.length,
    lastUpdated: earnings.lastUpdated,
  };
}
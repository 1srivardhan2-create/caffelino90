// Admin earnings data structure and mock data

export interface MeetupEarning {
  id: string;
  meetupName: string;
  cafeName: string;
  totalBill: number;
  commission: number;
  commissionRate: number; // percentage
  date: Date;
  orderCode: string;
  members: number;
  paymentMethod: 'online' | 'cash'; // Track payment method
  onlinePayments: number; // Count of online payments
  cashPayments: number; // Count of cash payments
}

export interface RevenueSource {
  type: 'commission' | 'sponsored' | 'premium' | 'ads';
  amount: number;
  description: string;
  date: Date;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
  method: 'bank' | 'upi';
  accountDetails: string;
  transactionId?: string;
}

export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface UPIAccount {
  upiId: string;
  name: string;
}

// Mock meetup earnings data
export const MEETUP_EARNINGS: MeetupEarning[] = [
  {
    id: 'ME001',
    meetupName: 'Weekend Brunch',
    cafeName: 'Café Mocha',
    totalBill: 2850,
    commission: 71.25,
    commissionRate: 2.5,
    date: new Date('2024-12-06T11:30:00'),
    orderCode: 'CAFE2024',
    members: 3,
    paymentMethod: 'online',
    onlinePayments: 2,
    cashPayments: 1
  },
  {
    id: 'ME002',
    meetupName: 'Team Lunch',
    cafeName: 'The Coffee House',
    totalBill: 4200,
    commission: 105,
    commissionRate: 2.5,
    date: new Date('2024-12-05T13:00:00'),
    orderCode: 'CAFE2023',
    members: 3,
    paymentMethod: 'cash',
    onlinePayments: 0,
    cashPayments: 3
  },
  {
    id: 'ME003',
    meetupName: 'Client Meeting',
    cafeName: 'Starbucks Reserve',
    totalBill: 3600,
    commission: 90,
    commissionRate: 2.5,
    date: new Date('2024-12-04T15:30:00'),
    orderCode: 'CAFE2022',
    members: 4,
    paymentMethod: 'online',
    onlinePayments: 4,
    cashPayments: 0
  },
  {
    id: 'ME004',
    meetupName: 'Study Session',
    cafeName: 'Blue Tokai Coffee',
    totalBill: 1800,
    commission: 45,
    commissionRate: 2.5,
    date: new Date('2024-12-03T10:00:00'),
    orderCode: 'CAFE2021',
    members: 3,
    paymentMethod: 'cash',
    onlinePayments: 0,
    cashPayments: 3
  },
  {
    id: 'ME005',
    meetupName: 'Birthday Party',
    cafeName: 'Café Delhi Heights',
    totalBill: 5600,
    commission: 140,
    commissionRate: 2.5,
    date: new Date('2024-12-02T16:00:00'),
    orderCode: 'CAFE2020',
    members: 5,
    paymentMethod: 'online',
    onlinePayments: 5,
    cashPayments: 0
  },
  {
    id: 'ME006',
    meetupName: 'Coffee Chat',
    cafeName: 'Third Wave Coffee',
    totalBill: 980,
    commission: 24.5,
    commissionRate: 2.5,
    date: new Date('2024-11-30T14:00:00'),
    orderCode: 'CAFE2019',
    members: 2,
    paymentMethod: 'cash',
    onlinePayments: 0,
    cashPayments: 2
  },
  {
    id: 'ME007',
    meetupName: 'Business Breakfast',
    cafeName: 'Café Mondegar',
    totalBill: 3200,
    commission: 80,
    commissionRate: 2.5,
    date: new Date('2024-11-28T09:00:00'),
    orderCode: 'CAFE2018',
    members: 4,
    paymentMethod: 'online',
    onlinePayments: 4,
    cashPayments: 0
  },
  {
    id: 'ME008',
    meetupName: 'Weekend Meetup',
    cafeName: 'Brew & Grind',
    totalBill: 4500,
    commission: 112.5,
    commissionRate: 2.5,
    date: new Date('2024-11-25T12:00:00'),
    orderCode: 'CAFE2017',
    members: 4,
    paymentMethod: 'cash',
    onlinePayments: 0,
    cashPayments: 4
  }
];

// Mock revenue sources
export const REVENUE_SOURCES: RevenueSource[] = [
  ...MEETUP_EARNINGS.map(m => ({
    type: 'commission' as const,
    amount: m.commission,
    description: `Commission from ${m.meetupName}`,
    date: m.date
  })),
  {
    type: 'sponsored',
    amount: 5000,
    description: 'Sponsored listing - Starbucks Reserve',
    date: new Date('2024-12-01T00:00:00')
  },
  {
    type: 'sponsored',
    amount: 3000,
    description: 'Sponsored listing - Café Coffee Day',
    date: new Date('2024-11-15T00:00:00')
  },
  {
    type: 'premium',
    amount: 299,
    description: 'Premium subscription - Rahul Sharma',
    date: new Date('2024-12-05T10:00:00')
  },
  {
    type: 'premium',
    amount: 299,
    description: 'Premium subscription - Priya Patel',
    date: new Date('2024-12-03T15:00:00')
  },
  {
    type: 'premium',
    amount: 299,
    description: 'Premium subscription - Amit Kumar',
    date: new Date('2024-11-28T12:00:00')
  },
  {
    type: 'ads',
    amount: 2500,
    description: 'Banner ads revenue',
    date: new Date('2024-12-01T00:00:00')
  },
  {
    type: 'ads',
    amount: 2200,
    description: 'Banner ads revenue',
    date: new Date('2024-11-01T00:00:00')
  }
];

// Mock payout history
export const PAYOUT_HISTORY: Payout[] = [
  {
    id: 'PY001',
    amount: 15000,
    status: 'completed',
    requestedAt: new Date('2024-11-01T10:00:00'),
    completedAt: new Date('2024-11-03T14:30:00'),
    method: 'bank',
    accountDetails: 'HDFC Bank ****1234',
    transactionId: 'UTR202411031234567'
  },
  {
    id: 'PY002',
    amount: 8500,
    status: 'completed',
    requestedAt: new Date('2024-10-01T10:00:00'),
    completedAt: new Date('2024-10-02T16:45:00'),
    method: 'upi',
    accountDetails: 'admin@paytm',
    transactionId: 'TXN202410021645123'
  },
  {
    id: 'PY003',
    amount: 3500,
    status: 'processing',
    requestedAt: new Date('2024-12-05T09:00:00'),
    method: 'bank',
    accountDetails: 'HDFC Bank ****1234'
  }
];

// Calculate earnings
export function getTodayEarnings(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return REVENUE_SOURCES
    .filter(r => {
      const date = new Date(r.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    })
    .reduce((sum, r) => sum + r.amount, 0);
}

export function getMonthEarnings(): number {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return REVENUE_SOURCES
    .filter(r => {
      const date = new Date(r.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + r.amount, 0);
}

export function getLifetimeEarnings(): number {
  return REVENUE_SOURCES.reduce((sum, r) => sum + r.amount, 0);
}

export function getRevenueByType(type: RevenueSource['type']): number {
  return REVENUE_SOURCES
    .filter(r => r.type === type)
    .reduce((sum, r) => sum + r.amount, 0);
}

export function getPendingPayoutAmount(): number {
  return PAYOUT_HISTORY
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);
}

export function getAvailableBalance(): number {
  const totalEarnings = getLifetimeEarnings();
  const totalPayouts = PAYOUT_HISTORY
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = getPendingPayoutAmount();
  
  return totalEarnings - totalPayouts - pendingPayouts;
}

// Calculate online payment earnings
export function getOnlinePaymentEarnings(): number {
  return MEETUP_EARNINGS
    .filter(m => m.onlinePayments > 0)
    .reduce((sum, m) => {
      // Calculate the portion of commission from online payments
      const onlineRatio = m.onlinePayments / m.members;
      return sum + (m.commission * onlineRatio);
    }, 0);
}

// Calculate cash payment earnings
export function getCashPaymentEarnings(): number {
  return MEETUP_EARNINGS
    .filter(m => m.cashPayments > 0)
    .reduce((sum, m) => {
      // Calculate the portion of commission from cash payments
      const cashRatio = m.cashPayments / m.members;
      return sum + (m.commission * cashRatio);
    }, 0);
}

// Calculate total online payments count
export function getTotalOnlinePayments(): number {
  return MEETUP_EARNINGS.reduce((sum, m) => sum + m.onlinePayments, 0);
}

// Calculate total cash payments count
export function getTotalCashPayments(): number {
  return MEETUP_EARNINGS.reduce((sum, m) => sum + m.cashPayments, 0);
}
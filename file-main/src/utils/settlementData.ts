// Global settlement history storage
export interface SettlementRecord {
  id: string;
  meetupName: string;
  cafeName: string;
  date: Date;
  totalBill: number;
  members: {
    userId: string;
    userName: string;
    share: number;
    status: 'paid' | 'pending';
    paidAt?: Date;
    transactionId?: string;
    paymentMethod?: string;
  }[];
  adminId: string;
  adminName: string;
  orderCode: string;
}

// Mock settlement history data
export const SETTLEMENT_HISTORY: SettlementRecord[] = [
  {
    id: 'STL001',
    meetupName: 'Weekend Brunch',
    cafeName: 'Café Mocha',
    date: new Date('2024-11-15T11:30:00'),
    totalBill: 2850,
    adminId: 'user1',
    adminName: 'Rahul Sharma',
    orderCode: 'CAFE2024',
    members: [
      {
        userId: 'user1',
        userName: 'Rahul Sharma',
        share: 950,
        status: 'paid',
        paidAt: new Date('2024-11-15T12:45:00'),
        transactionId: 'TXN1731668700123',
        paymentMethod: 'UPI - Google Pay'
      },
      {
        userId: 'user2',
        userName: 'Priya Patel',
        share: 850,
        status: 'paid',
        paidAt: new Date('2024-11-15T12:50:00'),
        transactionId: 'TXN1731668800456',
        paymentMethod: 'Card - Visa ending 4532'
      },
      {
        userId: 'user3',
        userName: 'Amit Kumar',
        share: 1050,
        status: 'paid',
        paidAt: new Date('2024-11-15T13:00:00'),
        transactionId: 'WLT1731669000789',
        paymentMethod: 'Wallet - Paytm Wallet'
      }
    ]
  },
  {
    id: 'STL002',
    meetupName: 'Team Lunch',
    cafeName: 'The Coffee House',
    date: new Date('2024-11-10T13:00:00'),
    totalBill: 4200,
    adminId: 'user1',
    adminName: 'Rahul Sharma',
    orderCode: 'CAFE2023',
    members: [
      {
        userId: 'user1',
        userName: 'Rahul Sharma',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-10T14:15:00'),
        transactionId: 'TXN1731236100123',
        paymentMethod: 'UPI - PhonePe'
      },
      {
        userId: 'user2',
        userName: 'Priya Patel',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-10T14:20:00'),
        transactionId: 'CRD1731236400456',
        paymentMethod: 'Card - Mastercard ending 8821'
      },
      {
        userId: 'user4',
        userName: 'Sneha Desai',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-10T14:25:00'),
        transactionId: 'TXN1731236700789',
        paymentMethod: 'UPI - Paytm'
      }
    ]
  },
  {
    id: 'STL003',
    meetupName: 'Birthday Celebration',
    cafeName: 'Starbucks Reserve',
    date: new Date('2024-11-05T16:00:00'),
    totalBill: 5600,
    adminId: 'user2',
    adminName: 'Priya Patel',
    orderCode: 'CAFE2022',
    members: [
      {
        userId: 'user1',
        userName: 'Rahul Sharma',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-05T17:30:00'),
        transactionId: 'TXN1730822400123',
        paymentMethod: 'UPI - Google Pay'
      },
      {
        userId: 'user2',
        userName: 'Priya Patel',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-05T17:35:00'),
        transactionId: 'WLT1730822700456',
        paymentMethod: 'Wallet - Amazon Pay'
      },
      {
        userId: 'user3',
        userName: 'Amit Kumar',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-05T17:40:00'),
        transactionId: 'CRD1730823000789',
        paymentMethod: 'Card - Rupay ending 6743'
      },
      {
        userId: 'user4',
        userName: 'Sneha Desai',
        share: 1400,
        status: 'paid',
        paidAt: new Date('2024-11-05T17:45:00'),
        transactionId: 'TXN1730823300012',
        paymentMethod: 'UPI - PhonePe'
      }
    ]
  },
  {
    id: 'STL004',
    meetupName: 'Study Session',
    cafeName: 'Blue Tokai Coffee',
    date: new Date('2024-10-28T10:00:00'),
    totalBill: 1800,
    adminId: 'user1',
    adminName: 'Rahul Sharma',
    orderCode: 'CAFE2021',
    members: [
      {
        userId: 'user1',
        userName: 'Rahul Sharma',
        share: 600,
        status: 'paid',
        paidAt: new Date('2024-10-28T11:30:00'),
        transactionId: 'TXN1730109000123',
        paymentMethod: 'UPI - Google Pay'
      },
      {
        userId: 'user3',
        userName: 'Amit Kumar',
        share: 600,
        status: 'paid',
        paidAt: new Date('2024-10-28T11:35:00'),
        transactionId: 'TXN1730109300456',
        paymentMethod: 'UPI - Paytm'
      },
      {
        userId: 'user4',
        userName: 'Sneha Desai',
        share: 600,
        status: 'paid',
        paidAt: new Date('2024-10-28T11:40:00'),
        transactionId: 'WLT1730109600789',
        paymentMethod: 'Wallet - Mobikwik'
      }
    ]
  },
  {
    id: 'STL005',
    meetupName: 'Client Meeting',
    cafeName: 'Café Delhi Heights',
    date: new Date('2024-10-20T15:30:00'),
    totalBill: 3200,
    adminId: 'user2',
    adminName: 'Priya Patel',
    orderCode: 'CAFE2020',
    members: [
      {
        userId: 'user1',
        userName: 'Rahul Sharma',
        share: 1600,
        status: 'paid',
        paidAt: new Date('2024-10-20T16:45:00'),
        transactionId: 'CRD1729437900123',
        paymentMethod: 'Card - Visa ending 2341'
      },
      {
        userId: 'user2',
        userName: 'Priya Patel',
        share: 1600,
        status: 'paid',
        paidAt: new Date('2024-10-20T16:50:00'),
        transactionId: 'TXN1729438200456',
        paymentMethod: 'UPI - PhonePe'
      }
    ]
  }
];

// Add new settlement record
export function addSettlementRecord(record: SettlementRecord) {
  SETTLEMENT_HISTORY.unshift(record);
}

// Get user's settlement history
export function getUserSettlementHistory(userId: string): SettlementRecord[] {
  return SETTLEMENT_HISTORY.filter(record => 
    record.members.some(member => member.userId === userId)
  );
}

// Get admin's managed settlements
export function getAdminSettlementHistory(adminId: string): SettlementRecord[] {
  return SETTLEMENT_HISTORY.filter(record => record.adminId === adminId);
}

// Get specific settlement by ID
export function getSettlementById(id: string): SettlementRecord | undefined {
  return SETTLEMENT_HISTORY.find(record => record.id === id);
}

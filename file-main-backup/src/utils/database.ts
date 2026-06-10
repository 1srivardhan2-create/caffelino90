// LOCAL STORAGE IMPLEMENTATION - NO BACKEND
// All data stored in browser localStorage

// Helper function to get data from localStorage
function getLocalData(key: string) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Helper function to save data to localStorage
function saveLocalData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ==================== TYPES (Your Database Schema) ====================

export interface User {
  id: string;
  name: string;
  email: string;
  mobileNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meetup {
  id: string;
  host_id: string; // User ID of the host
  cafe_id?: string;
  meetupName: string;
  groupName?: string;
  code: string; // Unique group code
  date: string;
  time?: string;
  status: 'planning' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  cafeName?: string;
  cafeLocation?: string;
  winnerCafe?: any;
  members: MeetupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetupMember {
  id: string;
  meetup_id: string;
  user_id: string;
  userName: string;
  userAvatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  hasSelectedMenu?: boolean;
  selectedItems?: OrderItem[];
}

export interface Order {
  id: string; // orderId
  meetup_id: string; // Group code
  orderNumber: string;
  meetupName?: string;
  groupName?: string;
  items: OrderItem[];
  subtotal: number;
  cgst: number; // 2.5%
  sgst: number; // 2.5%
  totalAmount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
  adminName: string;
  adminPhone: string;
  memberCount: number;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  billBreakdown?: {
    cgst: number;
    sgst: number;
    splitAmong: number;
    perPerson: number;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  emoji?: string;
  orderedBy?: string; // User ID
  orderedByName?: string; // User name
}

export interface MeetupPayment {
  id: string;
  meetup_id: string; // Group code
  payment_type: 'split' | 'individual' | 'single';
  payer_user_id: string;
  payer_name: string;
  total_bill: number;
  amount_per_person?: number;
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'paid' | 'pending-cash' | 'cash-collected' | 'pending';
  transactionId?: string;
  paidAt?: string;
  cashCollectedAt?: string;
  createdAt: string;
}

// ==================== USER DATABASE ====================

export const userDB = {
  // Create or update user
  async save(user: User) {
    const users = getLocalData('db_users') || {};
    users[user.id] = user;
    saveLocalData('db_users', users);
    return { success: true, data: user };
  },

  // Get user by ID
  async get(userId: string) {
    const users = getLocalData('db_users') || {};
    return { success: true, data: users[userId] || null };
  },

  // Get user by email
  async getByEmail(email: string) {
    const users = getLocalData('db_users') || {};
    const user = Object.values(users).find((u: any) => u.email === email);
    return { success: true, data: user || null };
  },

  // Get all users
  async getAll() {
    const users = getLocalData('db_users') || {};
    return { success: true, data: Object.values(users) };
  },

  // Delete user
  async delete(userId: string) {
    const users = getLocalData('db_users') || {};
    delete users[userId];
    saveLocalData('db_users', users);
    return { success: true };
  },
};

// ==================== MEETUP DATABASE ====================

export const meetupDB = {
  // Create or update meetup
  async save(meetup: Meetup) {
    const meetups = getLocalData('db_meetups') || {};
    meetups[meetup.id] = meetup;
    saveLocalData('db_meetups', meetups);
    return { success: true, data: meetup };
  },

  // Get meetup by ID
  async get(meetupId: string) {
    const meetups = getLocalData('db_meetups') || {};
    return { success: true, data: meetups[meetupId] || null };
  },

  // Get meetup by code
  async getByCode(code: string) {
    const meetups = getLocalData('db_meetups') || {};
    const meetup = Object.values(meetups).find((m: any) => m.code === code);
    return { success: true, data: meetup || null };
  },

  // Get all meetups for a user (as host or member)
  async getByUser(userId: string) {
    const meetups = getLocalData('db_meetups') || {};
    const userMeetups = Object.values(meetups).filter((m: any) => 
      m.host_id === userId || m.members?.some((member: any) => member.user_id === userId)
    );
    return { success: true, data: userMeetups };
  },

  // Get all meetups
  async getAll() {
    const meetups = getLocalData('db_meetups') || {};
    return { success: true, data: Object.values(meetups) };
  },

  // Update meetup status
  async updateStatus(meetupId: string, status: Meetup['status']) {
    const meetups = getLocalData('db_meetups') || {};
    if (meetups[meetupId]) {
      meetups[meetupId].status = status;
      meetups[meetupId].updatedAt = new Date().toISOString();
      saveLocalData('db_meetups', meetups);
    }
    return { success: true, data: meetups[meetupId] };
  },

  // Delete meetup
  async delete(meetupId: string) {
    const meetups = getLocalData('db_meetups') || {};
    delete meetups[meetupId];
    saveLocalData('db_meetups', meetups);
    return { success: true };
  },
};

// ==================== MEETUP MEMBERS DATABASE ====================

export const meetupMemberDB = {
  // Add member to meetup
  async add(member: MeetupMember) {
    const members = getLocalData('db_meetup_members') || {};
    const key = `${member.meetup_id}_${member.user_id}`;
    members[key] = member;
    saveLocalData('db_meetup_members', members);
    return { success: true, data: member };
  },

  // Get all members for a meetup
  async getByMeetup(meetupId: string) {
    const members = getLocalData('db_meetup_members') || {};
    const meetupMembers = Object.values(members).filter((m: any) => m.meetup_id === meetupId);
    return { success: true, data: meetupMembers };
  },

  // Remove member from meetup
  async remove(meetupId: string, userId: string) {
    const members = getLocalData('db_meetup_members') || {};
    const key = `${meetupId}_${userId}`;
    delete members[key];
    saveLocalData('db_meetup_members', members);
    return { success: true };
  },

  // Update member menu selection
  async updateMenuSelection(meetupId: string, userId: string, items: OrderItem[]) {
    const members = getLocalData('db_meetup_members') || {};
    const key = `${meetupId}_${userId}`;
    if (members[key]) {
      members[key].hasSelectedMenu = true;
      members[key].selectedItems = items;
      saveLocalData('db_meetup_members', members);
    }
    return { success: true, data: members[key] };
  },
};

// ==================== ORDER DATABASE ====================

export const orderDB = {
  // Create or update order
  async save(order: Order) {
    const orders = getLocalData('db_orders') || {};
    orders[order.id] = order;
    saveLocalData('db_orders', orders);
    return { success: true, data: order };
  },

  // Get order by ID
  async get(orderId: string) {
    const orders = getLocalData('db_orders') || {};
    return { success: true, data: orders[orderId] || null };
  },

  // Get all orders for a meetup
  async getByMeetup(meetupId: string) {
    const orders = getLocalData('db_orders') || {};
    const meetupOrders = Object.values(orders).filter((o: any) => o.meetup_id === meetupId);
    return { success: true, data: meetupOrders };
  },

  // Get all orders (for cafe owner)
  async getAll() {
    const orders = getLocalData('db_orders') || {};
    return { success: true, data: Object.values(orders) };
  },

  // Update order status
  async updateStatus(orderId: string, status: Order['status']) {
    const orders = getLocalData('db_orders') || {};
    if (orders[orderId]) {
      orders[orderId].status = status;
      orders[orderId].updatedAt = new Date().toISOString();
      if (status === 'completed') {
        orders[orderId].completedAt = new Date().toISOString();
      }
      saveLocalData('db_orders', orders);
    }
    return { success: true, data: orders[orderId] };
  },

  // Delete order
  async delete(orderId: string) {
    const orders = getLocalData('db_orders') || {};
    delete orders[orderId];
    saveLocalData('db_orders', orders);
    return { success: true };
  },
};

// ==================== PAYMENT DATABASE ====================

export const paymentDB = {
  // Create or update payment
  async save(payment: MeetupPayment) {
    const payments = getLocalData('db_payments') || {};
    payments[payment.id] = payment;
    saveLocalData('db_payments', payments);
    return { success: true, data: payment };
  },

  // Get payment by ID
  async get(paymentId: string) {
    const payments = getLocalData('db_payments') || {};
    return { success: true, data: payments[paymentId] || null };
  },

  // Get all payments for a meetup
  async getByMeetup(meetupId: string) {
    const payments = getLocalData('db_payments') || {};
    const meetupPayments = Object.values(payments).filter((p: any) => p.meetup_id === meetupId);
    return { success: true, data: meetupPayments };
  },

  // Get all payments by a user
  async getByUser(userId: string) {
    const payments = getLocalData('db_payments') || {};
    const userPayments = Object.values(payments).filter((p: any) => p.payer_user_id === userId);
    return { success: true, data: userPayments };
  },

  // Update payment status
  async updateStatus(paymentId: string, status: MeetupPayment['paymentStatus']) {
    const payments = getLocalData('db_payments') || {};
    if (payments[paymentId]) {
      payments[paymentId].paymentStatus = status;
      if (status === 'paid') {
        payments[paymentId].paidAt = new Date().toISOString();
      } else if (status === 'cash-collected') {
        payments[paymentId].cashCollectedAt = new Date().toISOString();
      }
      saveLocalData('db_payments', payments);
    }
    return { success: true, data: payments[paymentId] };
  },

  // Get payment summary for a meetup
  async getSummary(meetupId: string) {
    const payments = getLocalData('db_payments') || {};
    const meetupPayments = Object.values(payments).filter((p: any) => p.meetup_id === meetupId);
    
    const summary = {
      totalAmount: meetupPayments.reduce((sum: number, p: any) => sum + p.total_bill, 0),
      paidCount: meetupPayments.filter((p: any) => p.paymentStatus === 'paid').length,
      pendingCount: meetupPayments.filter((p: any) => ['pending', 'pending-cash'].includes(p.paymentStatus)).length,
      totalPaid: meetupPayments
        .filter((p: any) => p.paymentStatus === 'paid')
        .reduce((sum: number, p: any) => sum + p.total_bill, 0),
      totalPending: meetupPayments
        .filter((p: any) => ['pending', 'pending-cash'].includes(p.paymentStatus))
        .reduce((sum: number, p: any) => sum + p.total_bill, 0),
    };
    
    return { success: true, data: summary };
  },
};

// ==================== HELPER FUNCTIONS ====================

// Generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new user
export async function createUser(name: string, email: string, mobileNumber?: string): Promise<User> {
  const user: User = {
    id: generateId('user'),
    name,
    email,
    mobileNumber,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=be9d80&color=fff`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await userDB.save(user);
  return user;
}

// Create a new meetup
export async function createMeetup(
  hostId: string,
  meetupName: string,
  groupName: string,
  date: string
): Promise<Meetup> {
  const meetup: Meetup = {
    id: generateId('meetup'),
    host_id: hostId,
    meetupName,
    groupName,
    code: Math.random().toString(36).substr(2, 6).toUpperCase(),
    date,
    status: 'planning',
    members: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await meetupDB.save(meetup);
  return meetup;
}

// Add member to meetup
export async function addMemberToMeetup(
  meetupId: string,
  userId: string,
  userName: string,
  role: 'admin' | 'member' = 'member'
): Promise<MeetupMember> {
  const member: MeetupMember = {
    id: generateId('member'),
    meetup_id: meetupId,
    user_id: userId,
    userName,
    role,
    joinedAt: new Date().toISOString(),
  };
  
  await meetupMemberDB.add(member);
  return member;
}

// Create order for meetup
export async function createOrder(
  meetupId: string,
  items: OrderItem[],
  adminName: string,
  adminPhone: string,
  memberCount: number
): Promise<Order> {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cgst = Math.round((subtotal * 5 / 100) * 100) / 100; // CGST 5%
  const sgst = Math.round((subtotal * 5 / 100) * 100) / 100; // SGST 5%
  const totalAmount = subtotal + cgst + sgst;
  
  const order: Order = {
    id: generateId('order'),
    meetup_id: meetupId,
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    items,
    subtotal,
    cgst,
    sgst,
    totalAmount,
    status: 'pending',
    adminName,
    adminPhone,
    memberCount,
    createdAt: new Date().toISOString(),
    billBreakdown: {
      cgst,
      sgst,
      splitAmong: memberCount,
      perPerson: Math.round((totalAmount / memberCount) * 100) / 100,
    },
  };
  
  await orderDB.save(order);
  return order;
}

// Create payment for meetup
export async function createPayment(
  meetupId: string,
  payerUserId: string,
  payerName: string,
  amount: number,
  paymentMethod: 'online' | 'cash',
  payment_type: 'split' | 'individual' | 'single' = 'individual'
): Promise<MeetupPayment> {
  const payment: MeetupPayment = {
    id: generateId('payment'),
    meetup_id: meetupId,
    payment_type,
    payer_user_id: payerUserId,
    payer_name: payerName,
    total_bill: amount,
    paymentMethod,
    paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending-cash',
    paidAt: paymentMethod === 'online' ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
  };
  
  await paymentDB.save(payment);
  return payment;
}

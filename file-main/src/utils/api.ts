// LOCAL STORAGE IMPLEMENTATION - NO BACKEND
// All data stored in browser localStorage

const getBaseUrl = () => {
  if (typeof window === 'undefined') return "http://localhost:4000";
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.endsWith('.local')) {
    return `http://${hostname}:4000`;
  }
  return 'https://caffelino90-9v4a.onrender.com';
};

export const BASE_URL = getBaseUrl();

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

// ==================== GROUP API ====================

export const groupAPI = {
  async saveGroup(groupData: any) {
    const groups = getLocalData('groups') || {};
    groups[groupData.groupCode] = groupData;
    saveLocalData('groups', groups);
    return { success: true, data: groupData };
  },

  async getGroup(groupCode: string) {
    const groups = getLocalData('groups') || {};
    return { success: true, data: groups[groupCode] || null };
  },

  async getAllGroups() {
    const groups = getLocalData('groups') || {};
    return { success: true, data: Object.values(groups) };
  },
};

// ==================== ORDER API ====================

export const orderAPI = {
  async saveOrder(orderData: any) {
    const orders = getLocalData('orders') || {};
    orders[orderData.orderId] = orderData;
    saveLocalData('orders', orders);
    return { success: true, data: orderData };
  },

  async getOrder(orderId: string) {
    const orders = getLocalData('orders') || {};
    return { success: true, data: orders[orderId] || null };
  },

  // Get all orders (for cafe owner) - connected to Render backend
  async getAllOrders() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/cafe/orders/cafe`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        const mappedOrders = data.map((order: any) => ({
          orderNumber: order._id.toString().slice(-6).toUpperCase(),
          meetupName: "Meetup Order",
          groupName: order.user?.name || "Group",
          meetupId: order.meetupId,
          memberCount: 1,
          items: order.items.map((item: any) => ({
            name: item.menuItem?.item_name || "Item",
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: order.totalAmount,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          orderTime: new Date(order.createdAt).toLocaleTimeString(),
          status: order.orderStatus.toLowerCase(),
          adminName: order.user?.name || "",
          adminPhone: order.user?.phone || "",
          createdAt: order.createdAt
        }));
        return { success: true, orders: mappedOrders };
      }
      return { success: true, orders: [] };
    } catch (error) {
      console.error('Error fetching backend orders:', error);
      const orders = getLocalData('orders') || {};
      return { success: true, data: Object.values(orders), orders: Object.values(orders) };
    }
  },

  async updateOrderStatus(orderId: string, status: string) {
    const orders = getLocalData('orders') || {};
    if (orders[orderId]) {
      orders[orderId].status = status;
      saveLocalData('orders', orders);
    }
    return { success: true, data: orders[orderId] };
  },
};

// ==================== PAYMENT API ====================

export const paymentAPI = {
  async savePayment(groupCode: string, memberId: string, paymentInfo: any) {
    const payments = getLocalData('payments') || {};
    if (!payments[groupCode]) {
      payments[groupCode] = {};
    }
    payments[groupCode][memberId] = paymentInfo;
    saveLocalData('payments', payments);
    return { success: true, data: paymentInfo };
  },

  async getPayments(groupCode: string) {
    const payments = getLocalData('payments') || {};
    return { success: true, data: payments[groupCode] || {} };
  },

  async updatePaymentStatus(groupCode: string, memberId: string, updates: any) {
    const payments = getLocalData('payments') || {};
    if (!payments[groupCode]) {
      payments[groupCode] = {};
    }
    payments[groupCode][memberId] = {
      ...(payments[groupCode][memberId] || {}),
      ...updates
    };
    saveLocalData('payments', payments);
    return { success: true, data: payments[groupCode][memberId] };
  },
};

// ==================== CAFE EARNINGS API ====================

export const earningsAPI = {
  async saveEarnings(earningsData: {
    date?: string;
    orderNumber: string;
    totalAmount: number;
    onlineAmount: number;
    cashAmount: number;
  }) {
    const earnings = getLocalData('cafe_earnings') || {};
    const date = earningsData.date || new Date().toISOString().split('T')[0];
    if (!earnings[date]) {
      earnings[date] = [];
    }
    earnings[date].push(earningsData);
    saveLocalData('cafe_earnings', earnings);
    return { success: true, data: earningsData };
  },

  async getEarnings(date: string) {
    const earnings = getLocalData('cafe_earnings') || {};
    return { success: true, data: earnings[date] || [] };
  },

  async getTodayEarnings() {
    const today = new Date().toISOString().split('T')[0];
    return this.getEarnings(today);
  },
};

// ==================== CHAT API ====================

export const chatAPI = {
  async saveMessage(groupCode: string, message: any) {
    const chats = getLocalData('chats') || {};
    if (!chats[groupCode]) {
      chats[groupCode] = [];
    }
    chats[groupCode].push(message);
    saveLocalData('chats', chats);
    return { success: true, data: message };
  },

  async getMessages(groupCode: string) {
    const chats = getLocalData('chats') || {};
    return { success: true, data: chats[groupCode] || [] };
  },
};
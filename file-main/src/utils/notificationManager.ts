// Notification Manager - Real-time notification system

export interface Notification {
  id: string;
  type: 'group' | 'payment' | 'vote' | 'system';
  title: string;
  message: string;
  time: string;
  timestamp: number;
  isRead: boolean;
  actionLabel?: string;
  actionData?: any;
  icon?: string; // Icon name as string
  iconColor?: string;
  // Payment specific fields
  paymentDetails?: {
    amount: number;
    transactionId: string;
    paymentMethod: string;
    paidAt: string;
    groupName: string;
    cafeName?: string;
    orderNumber?: string;
    receiptUrl?: string;
    totalBill?: number;
    orderItems?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

// Initialize clean notification state (no userId parameter needed for localStorage)
export function initializeNotifications() {
  // Clear all old test/mock notifications
  localStorage.removeItem('userNotifications');
  localStorage.setItem('userNotifications', JSON.stringify([]));
}

// Add a new notification
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
  };

  notifications.unshift(newNotification); // Add to beginning
  localStorage.setItem('userNotifications', JSON.stringify(notifications));
  
  return newNotification;
}

// Get all notifications
export function getNotifications(): Notification[] {
  const stored = localStorage.getItem('userNotifications');
  if (!stored) {
    return [];
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing notifications:', error);
    return [];
  }
}

// Get unread count (no userId parameter needed)
export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter(n => !n.isRead).length;
}

// Mark notification as read
export function markAsRead(notificationId: string) {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  localStorage.setItem('userNotifications', JSON.stringify(updated));
}

// Mark all as read
export function markAllAsRead() {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem('userNotifications', JSON.stringify(updated));
}

// Delete notification
export function deleteNotification(notificationId: string) {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  localStorage.setItem('userNotifications', JSON.stringify(filtered));
}

// Clear all notifications
export function clearAllNotifications() {
  localStorage.setItem('userNotifications', JSON.stringify([]));
}

// Helper function to format time ago
export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Example notification creators for different events
export function notifyMemberJoined(memberName: string, groupName: string) {
  return addNotification({
    type: 'group',
    title: 'New Member Joined',
    message: `${memberName} joined "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Group',
    iconColor: 'text-blue-600 bg-blue-100',
  });
}

export function notifyPaymentReceived(memberName: string, amount: number, meetupName: string) {
  return addNotification({
    type: 'payment',
    title: 'Payment Received',
    message: `${memberName} paid ₹${amount} for "${meetupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Receipt',
    iconColor: 'text-green-600 bg-green-100',
    paymentDetails: {
      amount: amount,
      transactionId: 'TXN123456789',
      paymentMethod: 'Credit Card',
      paidAt: new Date().toISOString(),
      groupName: groupName,
      cafeName: 'Cafe XYZ',
      orderNumber: 'ORD123456789',
      receiptUrl: 'https://example.com/receipt.pdf'
    }
  });
}

export function notifyVotingComplete(result: string, votes: number) {
  return addNotification({
    type: 'vote',
    title: 'Voting Ended',
    message: `${result} won with ${votes} votes`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Results',
    iconColor: 'text-purple-600 bg-purple-100',
  });
}

export function notifyOrderConfirmed(orderNumber: string, meetupName: string) {
  return addNotification({
    type: 'system',
    title: 'Order Confirmed',
    message: `Order ${orderNumber} confirmed for "${meetupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Order',
    iconColor: 'text-green-600 bg-green-100',
  });
}

export function notifyBillUploaded(meetupName: string, amount: number) {
  return addNotification({
    type: 'payment',
    title: 'Bill Uploaded',
    message: `Bill of ₹${amount} uploaded for "${meetupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Bill',
    iconColor: 'text-orange-600 bg-orange-100',
  });
}

// Group-specific notifications
export function notifyGroupCreated(groupName: string, meetupName: string) {
  return addNotification({
    type: 'group',
    title: 'Group Created Successfully',
    message: `You created "${groupName}" for ${meetupName}`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Group',
    iconColor: 'text-green-600 bg-green-100',
  });
}

export function notifyJoinedGroup(groupName: string, memberCount: number) {
  return addNotification({
    type: 'group',
    title: 'Joined Group',
    message: `You joined "${groupName}" with ${memberCount} member${memberCount > 1 ? 's' : ''}`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Group',
    iconColor: 'text-blue-600 bg-blue-100',
  });
}

export function notifyNewMessage(groupName: string, senderName: string, isAdmin: boolean) {
  return addNotification({
    type: 'group',
    title: `New message in ${groupName}`,
    message: `${senderName} sent a message${isAdmin ? ' (Admin)' : ''}`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'Open Chat',
    iconColor: 'text-indigo-600 bg-indigo-100',
  });
}

export function notifyMenuItemAdded(itemName: string, groupName: string, addedBy: string) {
  return addNotification({
    type: 'group',
    title: 'Menu Item Added',
    message: `${addedBy} added ${itemName} to the order in "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Order',
    iconColor: 'text-amber-600 bg-amber-100',
  });
}

export function notifyPaymentRequested(groupName: string, amount: number, adminName: string) {
  return addNotification({
    type: 'payment',
    title: 'Payment Requested',
    message: `${adminName} requested payment of ₹${amount} for "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'Pay Now',
    iconColor: 'text-red-600 bg-red-100',
  });
}

export function notifyMemberPaid(memberName: string, groupName: string, amount: number) {
  return addNotification({
    type: 'payment',
    title: 'Member Payment Received',
    message: `${memberName} paid ₹${amount} in "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Status',
    iconColor: 'text-green-600 bg-green-100',
  });
}

export function notifyAllMembersPaid(groupName: string, totalAmount: number) {
  return addNotification({
    type: 'payment',
    title: 'All Payments Complete! 🎉',
    message: `All members paid ₹${totalAmount} total in "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Summary',
    iconColor: 'text-emerald-600 bg-emerald-100',
  });
}

export function notifyOrderAccepted(groupName: string, orderNumber: string, cafeName: string) {
  return addNotification({
    type: 'system',
    title: 'Order Accepted by Cafe',
    message: `${cafeName} accepted order #${orderNumber} for "${groupName}"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Order',
    iconColor: 'text-green-600 bg-green-100',
  });
}

export function notifyOrderReady(groupName: string, orderNumber: string) {
  return addNotification({
    type: 'system',
    title: 'Order Ready for Pickup! 📦',
    message: `Order #${orderNumber} is ready for \"${groupName}\"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Details',
    iconColor: 'text-blue-600 bg-blue-100',
  });
}

// Payment Success with Bill Details
export function notifyPaymentSuccess(data: {
  amount: number;
  transactionId: string;
  paymentMethod: string;
  groupName: string;
  cafeName?: string;
  orderNumber?: string;
  totalBill?: number;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}) {
  return addNotification({
    type: 'payment',
    title: 'Payment Successful ✅',
    message: `You paid ₹${data.amount} for \"${data.groupName}\"`,
    time: 'Just now',
    isRead: false,
    actionLabel: 'View Receipt',
    iconColor: 'text-green-600 bg-green-100',
    paymentDetails: {
      amount: data.amount,
      transactionId: data.transactionId,
      paymentMethod: data.paymentMethod,
      paidAt: new Date().toISOString(),
      groupName: data.groupName,
      cafeName: data.cafeName,
      orderNumber: data.orderNumber,
      totalBill: data.totalBill,
      orderItems: data.orderItems,
    },
  });
}
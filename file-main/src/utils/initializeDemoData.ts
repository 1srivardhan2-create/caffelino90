import { PAYMENT_STATUS } from '../components/PaymentStatusTracker';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Initialize demo data for cafe orders with live payment tracking
export function initializeDemoData() {
  if (!isBrowser) {
    return; // Skip if not in browser
  }

  const existingOrders = localStorage.getItem('cafeOrders');
  
  if (!existingOrders || JSON.parse(existingOrders).length === 0) {
    const groupCode1 = 'GRP-DEMO-001';
    const groupCode2 = 'GRP-DEMO-002';
    const groupCode3 = 'GRP-DEMO-003';
    
    // Calculate bill with 2.5% CGST and 2.5% SGST
    const calculateBill = (subtotal: number) => {
      const cgst = subtotal * 0.025;
      const sgst = subtotal * 0.025;
      const total = subtotal + cgst + sgst;
      return { subtotal, cgst, sgst, total };
    };
    
    // Order 1: Mixed Payments (Online + Cash Pending) - Exact match to image
    const subtotal1 = 870; // Espresso(150) + Latte(200) + Cappuccino(180) + Fresh Lime Soda(120) + Cold Coffee(220)
    const bill1 = calculateBill(subtotal1);
    
    // Order 2: All Cash Pending
    const subtotal2 = 750; // 3x Espresso(150) + 3x Muffin(100)
    const bill2 = calculateBill(subtotal2);
    
    // Order 3: All Online Paid (Fully Complete)
    const subtotal3 = 600; // 2x Cappuccino(180) + 2x Croissant(120) + 1x Sandwich(250)
    const bill3 = calculateBill(subtotal3);
    
    const demoOrders = [
      // ORDER 1: Mixed Payments (2 Online Paid, 2 Cash Pending) - EXACT MATCH TO IMAGE
      {
        orderNumber: '869983',
        meetupName: 'Weekend Coffee Meetup',
        groupName: 'Coffee Lovers',
        groupCode: groupCode1,
        memberCount: 4,
        items: [
          { id: '1', name: 'Espresso', quantity: 1, emoji: '☕', price: 150, category: 'Coffee' },
          { id: '2', name: 'Latte', quantity: 1, emoji: '☕', price: 200, category: 'Coffee' },
          { id: '3', name: 'Cappuccino', quantity: 1, emoji: '☕', price: 180, category: 'Coffee' },
          { id: '4', name: 'Fresh Lime Soda', quantity: 1, emoji: '🍋', price: 120, category: 'Beverages' },
          { id: '5', name: 'Cold Coffee', quantity: 1, emoji: '☕', price: 220, category: 'Coffee' },
        ],
        subtotal: bill1.subtotal,
        cgst: bill1.cgst,
        sgst: bill1.sgst,
        totalAmount: bill1.total,
        orderDate: new Date().toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        orderTime: new Date().toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'accepted',
        adminName: 'Rahul Sharma',
        adminPhone: '+91 98765 43210',
        createdAt: new Date().toISOString()
      },
      
      // ORDER 2: All Cash Pending
      {
        orderNumber: '754289',
        meetupName: 'Morning Coffee Session',
        groupName: 'Tech Enthusiasts',
        groupCode: groupCode2,
        memberCount: 3,
        items: [
          { id: '1', name: 'Espresso', quantity: 3, emoji: '☕', price: 150, category: 'Coffee' },
          { id: '6', name: 'Muffin', quantity: 3, emoji: '🧁', price: 100, category: 'Bakery' },
        ],
        subtotal: bill2.subtotal,
        cgst: bill2.cgst,
        sgst: bill2.sgst,
        totalAmount: bill2.total,
        orderDate: new Date().toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        orderTime: new Date(Date.now() - 15 * 60000).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'preparing',
        adminName: 'Priya Patel',
        adminPhone: '+91 87654 32109',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString()
      },
      
      // ORDER 3: All Online Paid (Ready to Complete)
      {
        orderNumber: '621547',
        meetupName: 'Breakfast Meet',
        groupName: 'Foodie Friends',
        groupCode: groupCode3,
        memberCount: 3,
        items: [
          { id: '3', name: 'Cappuccino', quantity: 2, emoji: '☕', price: 180, category: 'Coffee' },
          { id: '7', name: 'Croissant', quantity: 2, emoji: '🥐', price: 120, category: 'Bakery' },
          { id: '8', name: 'Sandwich', quantity: 1, emoji: '🥪', price: 250, category: 'Food' },
        ],
        subtotal: bill3.subtotal,
        cgst: bill3.cgst,
        sgst: bill3.sgst,
        totalAmount: bill3.total,
        orderDate: new Date().toLocaleDateString('en-IN', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        orderTime: new Date(Date.now() - 25 * 60000).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'ready',
        adminName: 'Arjun Mehta',
        adminPhone: '+91 98123 45678',
        createdAt: new Date(Date.now() - 25 * 60000).toISOString()
      }
    ];
    
    localStorage.setItem('cafeOrders', JSON.stringify(demoOrders));
    
    // PAYMENT TRACKING - ORDER 1: Mixed Payments (2 Online Paid, 2 Cash Pending)
    const perPerson1 = bill1.total / 4;
    PAYMENT_STATUS[groupCode1] = {
      'member-1': {
        memberId: 'member-1',
        memberName: 'Member 1: Rahul',
        amount: perPerson1,
        paymentType: 'online',
        status: 'paid',
        paidAt: new Date(Date.now() - 20 * 60000).toISOString()
      },
      'member-2': {
        memberId: 'member-2',
        memberName: 'Member 2: Sneha',
        amount: perPerson1,
        paymentType: 'online',
        status: 'paid',
        paidAt: new Date(Date.now() - 18 * 60000).toISOString()
      },
      'member-3': {
        memberId: 'member-3',
        memberName: 'Member 3: Arjun',
        amount: perPerson1,
        paymentType: 'cash',
        status: 'pending-cash'
      },
      'member-4': {
        memberId: 'member-4',
        memberName: 'Member 4: Kavya',
        amount: perPerson1,
        paymentType: 'cash',
        status: 'pending-cash'
      }
    };
    
    // PAYMENT TRACKING - ORDER 2: All Cash Pending
    const perPerson2 = bill2.total / 3;
    PAYMENT_STATUS[groupCode2] = {
      'member-5': {
        memberId: 'member-5',
        memberName: 'Member 1: Priya',
        amount: perPerson2,
        paymentType: 'cash',
        status: 'pending-cash'
      },
      'member-6': {
        memberId: 'member-6',
        memberName: 'Member 2: Vikram',
        amount: perPerson2,
        paymentType: 'cash',
        status: 'pending-cash'
      },
      'member-7': {
        memberId: 'member-7',
        memberName: 'Member 3: Riya',
        amount: perPerson2,
        paymentType: 'cash',
        status: 'pending-cash'
      }
    };
    
    // PAYMENT TRACKING - ORDER 3: All Online Paid (Fully Complete)
    const perPerson3 = bill3.total / 3;
    PAYMENT_STATUS[groupCode3] = {
      'member-8': {
        memberId: 'member-8',
        memberName: 'Member 1: Arjun',
        amount: perPerson3,
        paymentType: 'online',
        status: 'paid',
        paidAt: new Date(Date.now() - 25 * 60000).toISOString()
      },
      'member-9': {
        memberId: 'member-9',
        memberName: 'Member 2: Neha',
        amount: perPerson3,
        paymentType: 'online',
        status: 'paid',
        paidAt: new Date(Date.now() - 23 * 60000).toISOString()
      },
      'member-10': {
        memberId: 'member-10',
        memberName: 'Member 3: Rohan',
        amount: perPerson3,
        paymentType: 'online',
        status: 'paid',
        paidAt: new Date(Date.now() - 20 * 60000).toISOString()
      }
    };
    
    console.log('✅ Professional demo data initialized!');
    console.log('Order 1 (869983): Mixed - 2 Online Paid ✅ + 2 Cash Pending 💰');
    console.log('Order 2 (754289): All Cash Pending 💰💰💰');
    console.log('Order 3 (621547): All Online Paid ✅✅✅ (Ready to Complete)');
  }
}
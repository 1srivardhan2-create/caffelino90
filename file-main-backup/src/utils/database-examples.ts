/**
 * DATABASE USAGE EXAMPLES
 * 
 * This file demonstrates how to use the structured database API
 * with the Supabase KV store backend.
 */

import {
  userDB,
  meetupDB,
  meetupMemberDB,
  orderDB,
  paymentDB,
  createUser,
  createMeetup,
  addMemberToMeetup,
  createOrder,
  createPayment,
  generateId,
  type User,
  type Meetup,
  type Order,
  type MeetupPayment,
} from './database';

// ==================== EXAMPLE 1: Create User and Meetup ====================

export async function exampleCreateUserAndMeetup() {
  // Step 1: Create a user
  const user = await createUser(
    'John Doe',
    'john@example.com',
    '+91 9876543210'
  );
  
  console.log('User created:', user);
  // Output: { id: 'user-123...', name: 'John Doe', email: 'john@example.com', ... }

  // Step 2: Create a meetup
  const meetup = await createMeetup(
    user.id,
    'Coffee Meetup',
    'Tech Friends',
    '2025-12-15'
  );
  
  console.log('Meetup created:', meetup);
  // Output: { id: 'meetup-456...', host_id: 'user-123...', code: 'ABC123', ... }

  // Step 3: Add members to the meetup
  const member1 = await addMemberToMeetup(
    meetup.id,
    user.id,
    user.name,
    'admin'
  );
  
  console.log('Member added:', member1);

  return { user, meetup };
}

// ==================== EXAMPLE 2: Create Order with Items ====================

export async function exampleCreateOrder(meetupId: string) {
  const orderItems = [
    {
      id: generateId('item'),
      name: 'Cappuccino',
      price: 120,
      quantity: 2,
      category: 'Coffee',
      emoji: '☕',
      orderedBy: 'user-123',
      orderedByName: 'John Doe',
    },
    {
      id: generateId('item'),
      name: 'Sandwich',
      price: 150,
      quantity: 1,
      category: 'Food',
      emoji: '🥪',
      orderedBy: 'user-456',
      orderedByName: 'Jane Smith',
    },
  ];

  const order = await createOrder(
    meetupId,
    orderItems,
    'John Doe',
    '+91 9876543210',
    2 // member count
  );

  console.log('Order created:', order);
  // Output includes: subtotal, cgst (2.5%), sgst (2.5%), totalAmount, billBreakdown

  return order;
}

// ==================== EXAMPLE 3: Handle Payments ====================

export async function exampleHandlePayments(meetupId: string, orderId: string) {
  // Get the order first
  const orderResponse = await orderDB.get(orderId);
  const order = orderResponse.order;

  // Calculate per-person amount
  const perPersonAmount = order.billBreakdown?.perPerson || 0;

  // Member 1 pays online
  const payment1 = await createPayment(
    meetupId,
    'user-123',
    'John Doe',
    perPersonAmount,
    'online', // Payment method
    'individual' // Payment type
  );

  console.log('Payment 1 (Online):', payment1);
  // Output: { paymentStatus: 'paid', paidAt: '2025-12-12T...', ... }

  // Member 2 pays cash
  const payment2 = await createPayment(
    meetupId,
    'user-456',
    'Jane Smith',
    perPersonAmount,
    'cash',
    'individual'
  );

  console.log('Payment 2 (Cash - Pending):', payment2);
  // Output: { paymentStatus: 'pending-cash', ... }

  // Later: Mark cash as collected
  await paymentDB.updateStatus(payment2.id, 'cash-collected');

  console.log('Cash payment collected!');

  // Get payment summary
  const summary = await paymentDB.getSummary(meetupId);
  console.log('Payment Summary:', summary);
  // Output: { totalBill: 390, onlinePaid: 195, cashCollected: 195, remainingBalance: 0, ... }

  return { payment1, payment2 };
}

// ==================== EXAMPLE 4: Query User's Data ====================

export async function exampleQueryUserData(userId: string) {
  // Get user profile
  const userResponse = await userDB.get(userId);
  const user = userResponse.user;
  console.log('User:', user);

  // Get all meetups for this user
  const meetupsResponse = await meetupDB.getByUser(userId);
  const meetups = meetupsResponse.meetups;
  console.log('User meetups:', meetups);

  // Get user's payment history
  const paymentsResponse = await paymentDB.getByUser(userId);
  const payments = paymentsResponse.payments;
  console.log('User payments:', payments);

  return { user, meetups, payments };
}

// ==================== EXAMPLE 5: Update Order Status (Cafe Owner) ====================

export async function exampleCafeWorkflow(orderId: string) {
  // Step 1: Cafe accepts order
  await orderDB.updateStatus(orderId, 'accepted');
  console.log('Order accepted');

  // Step 2: Cafe starts preparing
  await orderDB.updateStatus(orderId, 'preparing');
  console.log('Order preparing');

  // Step 3: Order is ready
  await orderDB.updateStatus(orderId, 'ready');
  console.log('Order ready for pickup');

  // Step 4: Order completed
  await orderDB.updateStatus(orderId, 'completed');
  console.log('Order completed');

  // Get final order state
  const orderResponse = await orderDB.get(orderId);
  return orderResponse.order;
}

// ==================== EXAMPLE 6: Full Flow ====================

export async function exampleFullFlow() {
  console.log('=== Starting Full Caffelino Flow ===\n');

  // 1. Create users
  const host = await createUser('Alice', 'alice@example.com', '+91 9876543210');
  const member1 = await createUser('Bob', 'bob@example.com', '+91 9876543211');
  const member2 = await createUser('Charlie', 'charlie@example.com', '+91 9876543212');
  
  console.log('✅ Users created');

  // 2. Create meetup
  const meetup = await createMeetup(
    host.id,
    'Weekend Brunch',
    'Friends Group',
    '2025-12-14'
  );
  
  console.log('✅ Meetup created with code:', meetup.code);

  // 3. Add members
  await addMemberToMeetup(meetup.id, host.id, host.name, 'admin');
  await addMemberToMeetup(meetup.id, member1.id, member1.name, 'member');
  await addMemberToMeetup(meetup.id, member2.id, member2.name, 'member');
  
  console.log('✅ Members added');

  // 4. Update meetup details
  meetup.cafeName = 'The Coffee House';
  meetup.cafeLocation = 'MG Road';
  meetup.status = 'confirmed';
  await meetupDB.save(meetup);
  
  console.log('✅ Meetup updated');

  // 5. Create order
  const orderItems = [
    { id: generateId('item'), name: 'Cappuccino', price: 120, quantity: 3, category: 'Coffee', emoji: '☕' },
    { id: generateId('item'), name: 'Croissant', price: 80, quantity: 3, category: 'Food', emoji: '🥐' },
  ];

  const order = await createOrder(
    meetup.id,
    orderItems,
    host.name,
    host.mobileNumber || '',
    3
  );
  
  console.log('✅ Order created:', order.orderNumber);
  console.log('   Subtotal: ₹' + order.subtotal);
  console.log('   CGST (2.5%): ₹' + order.cgst);
  console.log('   SGST (2.5%): ₹' + order.sgst);
  console.log('   Total: ₹' + order.totalAmount);
  console.log('   Per Person: ₹' + order.billBreakdown?.perPerson);

  // 6. Cafe accepts order
  await orderDB.updateStatus(order.id, 'accepted');
  console.log('✅ Cafe accepted order');

  // 7. Members make payments
  const perPerson = order.billBreakdown?.perPerson || 0;
  
  await createPayment(meetup.id, host.id, host.name, perPerson, 'online');
  await createPayment(meetup.id, member1.id, member1.name, perPerson, 'online');
  await createPayment(meetup.id, member2.id, member2.name, perPerson, 'cash');
  
  console.log('✅ Payments created');

  // 8. Check payment status
  const summary = await paymentDB.getSummary(meetup.id);
  console.log('✅ Payment Summary:');
  console.log('   Total Bill: ₹' + summary.summary.totalBill);
  console.log('   Online Paid: ₹' + summary.summary.onlinePaid);
  console.log('   Cash Pending: ₹' + summary.summary.cashPending);
  console.log('   Status:', summary.summary.settlementStatus);

  // 9. Complete order
  await orderDB.updateStatus(order.id, 'completed');
  await meetupDB.updateStatus(meetup.id, 'completed');
  
  console.log('✅ Order and meetup completed!');
  console.log('\n=== Flow Complete ===');

  return {
    users: [host, member1, member2],
    meetup,
    order,
    summary,
  };
}

// ==================== USAGE ====================

// Call this function to test the full flow:
// exampleFullFlow();

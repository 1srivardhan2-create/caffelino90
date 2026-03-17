# 📖 Caffelino Database - Quick Reference

## 🚀 **Quick Start**

```typescript
import {
  userDB,
  meetupDB,
  orderDB,
  paymentDB,
  createUser,
  createMeetup,
  createOrder,
  createPayment,
} from './utils/database';
```

---

## 📝 **Common Operations**

### **1. Create User**
```typescript
const user = await createUser('John Doe', 'john@email.com', '+91 9876543210');
// Returns: { id, name, email, mobileNumber, avatar, createdAt, ... }
```

### **2. Create Meetup**
```typescript
const meetup = await createMeetup(userId, 'Coffee Meetup', 'Friends', '2025-12-15');
// Returns: { id, code, meetupName, groupName, host_id, ... }
```

### **3. Add Members**
```typescript
import { addMemberToMeetup } from './utils/database';

await addMemberToMeetup(meetupId, userId, 'John Doe', 'admin');
// Role: 'admin' or 'member'
```

### **4. Create Order**
```typescript
const items = [
  { id: generateId('item'), name: 'Cappuccino', price: 120, quantity: 2, emoji: '☕' }
];

const order = await createOrder(meetupId, items, 'Admin Name', '+91 XXX', 2);
// Auto-calculates: subtotal, CGST (2.5%), SGST (2.5%), total, perPerson
```

### **5. Process Payment**
```typescript
// Online payment
const payment = await createPayment(meetupId, userId, 'John', 195, 'online');

// Cash payment
const cashPayment = await createPayment(meetupId, userId, 'Jane', 195, 'cash');

// Mark cash collected
await paymentDB.updateStatus(cashPayment.id, 'cash-collected');
```

### **6. Update Order Status**
```typescript
await orderDB.updateStatus(orderId, 'accepted');   // Cafe accepts
await orderDB.updateStatus(orderId, 'preparing');  // Cafe preparing
await orderDB.updateStatus(orderId, 'ready');      // Ready for pickup
await orderDB.updateStatus(orderId, 'completed');  // Done!
```

---

## 🔍 **Query Operations**

### **Get User Data**
```typescript
const { user } = await userDB.get(userId);
const { user } = await userDB.getByEmail('john@email.com');
const { users } = await userDB.getAll();
```

### **Get Meetup Data**
```typescript
const { meetup } = await meetupDB.get(meetupId);
const { meetup } = await meetupDB.getByCode('ABC123');
const { meetups } = await meetupDB.getByUser(userId);
```

### **Get Orders**
```typescript
const { order } = await orderDB.get(orderId);
const { orders } = await orderDB.getByMeetup(meetupId);
const { orders } = await orderDB.getAll(); // For cafe owner
```

### **Get Payments**
```typescript
const { payment } = await paymentDB.get(paymentId);
const { payments } = await paymentDB.getByMeetup(meetupId);
const { payments } = await paymentDB.getByUser(userId);
const { summary } = await paymentDB.getSummary(meetupId);
```

---

## 💰 **Payment Summary**

```typescript
const { summary } = await paymentDB.getSummary(meetupId);

console.log(summary.totalBill);        // ₹390
console.log(summary.onlinePaid);       // ₹195
console.log(summary.cashPending);      // ₹195
console.log(summary.cashCollected);    // ₹0
console.log(summary.remainingBalance); // ₹195
console.log(summary.settlementStatus); // 'partial' or 'fully-paid'
```

---

## 🎯 **Status Values**

### **Order Status:**
- `'pending'` - New order
- `'accepted'` - Cafe accepted
- `'preparing'` - Being prepared
- `'ready'` - Ready for pickup
- `'completed'` - Done
- `'rejected'` - Rejected

### **Meetup Status:**
- `'planning'` - Being planned
- `'confirmed'` - Confirmed
- `'ongoing'` - In progress
- `'completed'` - Done
- `'cancelled'` - Cancelled

### **Payment Status:**
- `'paid'` - Online paid
- `'pending-cash'` - Cash not collected
- `'cash-collected'` - Cash collected
- `'pending'` - Not paid

---

## 🧮 **GST Calculation**

```typescript
// Automatic GST calculation in createOrder():
const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const cgst = (subtotal * 2.5 / 100); // CGST 2.5%
const sgst = (subtotal * 2.5 / 100); // SGST 2.5%
const total = subtotal + cgst + sgst;
const perPerson = total / memberCount;
```

---

## 📡 **API Endpoints**

Base URL: `https://{projectId}.supabase.co/functions/v1/make-server-4139398a`

### **Users:**
- `POST /database/users` - Create/update
- `GET /database/users/:userId`
- `GET /database/users/email/:email`
- `GET /database/users`

### **Meetups:**
- `POST /database/meetups`
- `GET /database/meetups/:meetupId`
- `GET /database/meetups/code/:code`
- `GET /database/meetups/user/:userId`
- `PUT /database/meetups/:meetupId/status`

### **Orders:**
- `POST /database/orders`
- `GET /database/orders/:orderId`
- `GET /database/orders/meetup/:meetupId`
- `GET /database/orders`
- `PUT /database/orders/:orderId/status`

### **Payments:**
- `POST /database/payments`
- `GET /database/payments/:paymentId`
- `GET /database/payments/meetup/:meetupId`
- `GET /database/payments/user/:userId`
- `PUT /database/payments/:paymentId/status`
- `GET /database/payments/meetup/:meetupId/summary`

---

## 🔑 **KV Store Keys**

```
user:{userId}                → User object
user:email:{email}           → User ID
user:{userId}:meetups        → Meetup IDs array
user:{userId}:payments       → Payment IDs array

meetup:{meetupId}            → Meetup object
meetup:code:{code}           → Meetup ID
meetup:{meetupId}:members    → Members array
meetup:{meetupId}:orders     → Order IDs array
meetup:{meetupId}:payments   → Payment IDs array

order:{orderId}              → Order object
payment:{paymentId}          → Payment object
```

---

## ⚡ **Helper Functions**

```typescript
import { generateId } from './utils/database';

generateId('user')    // 'user-1234567890-abc123'
generateId('meetup')  // 'meetup-1234567890-xyz789'
generateId('order')   // 'order-1234567890-def456'
```

---

## 🎨 **Example: Complete Flow**

```typescript
// 1. Create users
const host = await createUser('Alice', 'alice@email.com', '+91 9876543210');
const member = await createUser('Bob', 'bob@email.com', '+91 9876543211');

// 2. Create meetup
const meetup = await createMeetup(host.id, 'Brunch', 'Friends', '2025-12-15');
console.log('Meetup code:', meetup.code); // 'ABC123'

// 3. Add members
await addMemberToMeetup(meetup.id, host.id, host.name, 'admin');
await addMemberToMeetup(meetup.id, member.id, member.name, 'member');

// 4. Create order
const items = [
  { id: generateId('item'), name: 'Coffee', price: 120, quantity: 2, emoji: '☕' },
  { id: generateId('item'), name: 'Sandwich', price: 150, quantity: 2, emoji: '🥪' }
];
const order = await createOrder(meetup.id, items, host.name, host.mobileNumber, 2);
console.log('Total:', order.totalAmount); // ₹567 (with GST)

// 5. Process payments
await createPayment(meetup.id, host.id, host.name, 283.5, 'online');
await createPayment(meetup.id, member.id, member.name, 283.5, 'cash');

// 6. Check summary
const { summary } = await paymentDB.getSummary(meetup.id);
console.log('Status:', summary.settlementStatus); // 'partial'

// 7. Complete order
await orderDB.updateStatus(order.id, 'completed');
```

---

## 🔧 **Troubleshooting**

### **Error: "User not found"**
```typescript
// Check if user exists first
const response = await userDB.get(userId);
if (!response.user) {
  // Create user
}
```

### **Error: "Meetup not found"**
```typescript
// Get by code instead
const { meetup } = await meetupDB.getByCode('ABC123');
```

### **Check if payment is complete**
```typescript
const { summary } = await paymentDB.getSummary(meetupId);
if (summary.settlementStatus === 'fully-paid') {
  // All payments received!
}
```

---

## 📚 **Full Documentation**

- **Complete Guide:** `/SUPABASE_DATABASE_GUIDE.md`
- **Architecture:** `/DATABASE_ARCHITECTURE.md`
- **Examples:** `/utils/database-examples.ts`

---

## ✅ **Ready to Use!**

Everything is set up and working. Start building your features! 🚀

# 🗄️ Caffelino Database Guide - Supabase KV Store

## ✅ **COMPLETE: Full Database Implementation**

Your Caffelino app now has a **complete structured database system** using Supabase's KV store!

---

## 📋 **Database Schema Overview**

### **Tables Implemented:**

1. **users** - User profiles
2. **meetups** - Group meetup data
3. **meetup_members** - Members in each meetup
4. **orders** - Food/drink orders with GST
5. **meetup_payments** - Payment tracking per member

---

## 🎯 **Table Structures**

### **1. USERS**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique user ID (e.g., `user-123...`) |
| name | string | User's full name |
| email | string | Email address |
| mobileNumber | string | Phone number |
| avatar | string | Avatar URL |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

**KV Store Keys:**
- `user:{userId}` → User object
- `user:email:{email}` → User ID (for email lookup)
- `user:{userId}:meetups` → Array of meetup IDs
- `user:{userId}:payments` → Array of payment IDs

---

### **2. MEETUPS**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique meetup ID |
| host_id | string | User ID of host/admin |
| cafe_id | string | Cafe identifier (optional) |
| meetupName | string | Name of meetup |
| groupName | string | Name of group |
| code | string | 6-char invite code (e.g., `ABC123`) |
| date | string | Meetup date |
| time | string | Meetup time |
| status | string | `planning`, `confirmed`, `ongoing`, `completed`, `cancelled` |
| cafeName | string | Selected cafe name |
| cafeLocation | string | Cafe address |
| members | array | Array of member objects |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

**KV Store Keys:**
- `meetup:{meetupId}` → Meetup object
- `meetup:code:{code}` → Meetup ID (for code lookup)
- `meetup:{meetupId}:members` → Array of member objects
- `meetup:{meetupId}:orders` → Array of order IDs
- `meetup:{meetupId}:payments` → Array of payment IDs

---

### **3. MEETUP_MEMBERS**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique member ID |
| meetup_id | string | Meetup ID |
| user_id | string | User ID |
| userName | string | User's name |
| userAvatar | string | Avatar URL |
| role | string | `admin` or `member` |
| joinedAt | string | ISO timestamp |
| hasSelectedMenu | boolean | Has selected items |
| selectedItems | array | Array of order items |

**KV Store Keys:**
- `meetup:{meetupId}:members` → Array of all members

---

### **4. ORDERS**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique order ID |
| meetup_id | string | Group code |
| orderNumber | string | Display order number |
| meetupName | string | Meetup name |
| groupName | string | Group name |
| items | array | Array of order items |
| subtotal | number | Total before GST |
| cgst | number | CGST 2.5% |
| sgst | number | SGST 2.5% |
| totalAmount | number | Total with GST |
| status | string | `pending`, `accepted`, `preparing`, `ready`, `completed`, `rejected` |
| adminName | string | Admin contact name |
| adminPhone | string | Admin phone |
| memberCount | number | Number of members |
| createdAt | string | ISO timestamp |
| billBreakdown | object | GST and split details |

**Order Item Structure:**
```typescript
{
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  emoji: string;
  orderedBy: string; // User ID
  orderedByName: string;
}
```

**Bill Breakdown Structure:**
```typescript
{
  cgst: number;
  sgst: number;
  splitAmong: number;
  perPerson: number;
}
```

**KV Store Keys:**
- `order:{orderId}` → Order object
- `meetup:{meetupId}:orders` → Array of order IDs

---

### **5. MEETUP_PAYMENTS**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique payment ID |
| meetup_id | string | Group code |
| payment_type | string | `split`, `individual`, `single` |
| payer_user_id | string | User ID who paid |
| payer_name | string | User's name |
| total_bill | number | Amount paid |
| amount_per_person | number | Per-person amount (if split) |
| paymentMethod | string | `online` or `cash` |
| paymentStatus | string | `paid`, `pending-cash`, `cash-collected`, `pending` |
| transactionId | string | Payment gateway ID |
| paidAt | string | ISO timestamp |
| cashCollectedAt | string | ISO timestamp |
| createdAt | string | ISO timestamp |

**KV Store Keys:**
- `payment:{paymentId}` → Payment object
- `meetup:{meetupId}:payments` → Array of payment IDs
- `user:{userId}:payments` → Array of payment IDs

---

## 🚀 **API Usage Examples**

### **Import the Database API:**

```typescript
import {
  userDB,
  meetupDB,
  meetupMemberDB,
  orderDB,
  paymentDB,
  createUser,
  createMeetup,
  createOrder,
  createPayment,
} from './utils/database';
```

---

### **Create a User:**

```typescript
const user = await createUser(
  'John Doe',
  'john@example.com',
  '+91 9876543210'
);

console.log(user.id); // 'user-123...'
```

---

### **Create a Meetup:**

```typescript
const meetup = await createMeetup(
  userId,
  'Coffee Meetup',
  'Tech Friends',
  '2025-12-15'
);

console.log(meetup.code); // 'ABC123'
```

---

### **Add Members to Meetup:**

```typescript
import { addMemberToMeetup } from './utils/database';

await addMemberToMeetup(
  meetupId,
  userId,
  'John Doe',
  'admin' // or 'member'
);
```

---

### **Create an Order:**

```typescript
const items = [
  {
    id: generateId('item'),
    name: 'Cappuccino',
    price: 120,
    quantity: 2,
    category: 'Coffee',
    emoji: '☕'
  }
];

const order = await createOrder(
  meetupId,
  items,
  'Admin Name',
  '+91 9876543210',
  2 // member count
);

console.log(order.totalAmount); // Includes GST
console.log(order.billBreakdown.perPerson); // Per-person split
```

---

### **Handle Payments:**

```typescript
// Online payment
const payment = await createPayment(
  meetupId,
  userId,
  'John Doe',
  195.00,
  'online'
);

// Cash payment
const cashPayment = await createPayment(
  meetupId,
  userId2,
  'Jane Smith',
  195.00,
  'cash'
);

// Mark cash as collected
await paymentDB.updateStatus(cashPayment.id, 'cash-collected');

// Get payment summary
const summary = await paymentDB.getSummary(meetupId);
console.log(summary.totalBill); // ₹390
console.log(summary.onlinePaid); // ₹195
console.log(summary.cashCollected); // ₹195
```

---

### **Update Order Status (Cafe Owner):**

```typescript
await orderDB.updateStatus(orderId, 'accepted');
await orderDB.updateStatus(orderId, 'preparing');
await orderDB.updateStatus(orderId, 'ready');
await orderDB.updateStatus(orderId, 'completed');
```

---

### **Query User Data:**

```typescript
// Get user
const userResponse = await userDB.get(userId);
const user = userResponse.user;

// Get user's meetups
const meetupsResponse = await meetupDB.getByUser(userId);
const meetups = meetupsResponse.meetups;

// Get user's payments
const paymentsResponse = await paymentDB.getByUser(userId);
const payments = paymentsResponse.payments;
```

---

## 🔄 **Relations and Indexing**

The KV store automatically maintains these relationships:

### **User Relations:**
- `user:{userId}:meetups` → List of meetup IDs
- `user:{userId}:payments` → List of payment IDs

### **Meetup Relations:**
- `meetup:{meetupId}:members` → List of members
- `meetup:{meetupId}:orders` → List of order IDs
- `meetup:{meetupId}:payments` → List of payment IDs

### **Lookup Indexes:**
- `user:email:{email}` → User ID
- `meetup:code:{code}` → Meetup ID

---

## 📡 **API Endpoints**

All endpoints are available at:
```
https://{projectId}.supabase.co/functions/v1/make-server-4139398a
```

### **User Endpoints:**
- `POST /database/users` - Create/update user
- `GET /database/users/:userId` - Get user by ID
- `GET /database/users/email/:email` - Get user by email
- `GET /database/users` - Get all users
- `DELETE /database/users/:userId` - Delete user

### **Meetup Endpoints:**
- `POST /database/meetups` - Create/update meetup
- `GET /database/meetups/:meetupId` - Get meetup by ID
- `GET /database/meetups/code/:code` - Get meetup by code
- `GET /database/meetups/user/:userId` - Get user's meetups
- `GET /database/meetups` - Get all meetups
- `PUT /database/meetups/:meetupId/status` - Update status
- `DELETE /database/meetups/:meetupId` - Delete meetup

### **Meetup Member Endpoints:**
- `POST /database/meetup-members` - Add member
- `GET /database/meetup-members/meetup/:meetupId` - Get members
- `DELETE /database/meetup-members/:meetupId/:userId` - Remove member
- `PUT /database/meetup-members/:meetupId/:userId/menu` - Update menu selection

### **Order Endpoints:**
- `POST /database/orders` - Create/update order
- `GET /database/orders/:orderId` - Get order by ID
- `GET /database/orders/meetup/:meetupId` - Get meetup orders
- `GET /database/orders` - Get all orders
- `PUT /database/orders/:orderId/status` - Update status
- `DELETE /database/orders/:orderId` - Delete order

### **Payment Endpoints:**
- `POST /database/payments` - Create/update payment
- `GET /database/payments/:paymentId` - Get payment by ID
- `GET /database/payments/meetup/:meetupId` - Get meetup payments
- `GET /database/payments/user/:userId` - Get user payments
- `PUT /database/payments/:paymentId/status` - Update status
- `GET /database/payments/meetup/:meetupId/summary` - Get payment summary

---

## 💡 **Key Features**

✅ **Automatic GST Calculation** - CGST 2.5% + SGST 2.5%  
✅ **Bill Splitting** - Automatic per-person calculation  
✅ **Payment Tracking** - Online/Cash with status tracking  
✅ **Order Status Flow** - Pending → Accepted → Preparing → Ready → Completed  
✅ **Relational Data** - Automatic indexing and relationships  
✅ **Fallback Support** - Works with localStorage if Supabase unavailable  
✅ **Type Safety** - Full TypeScript support  

---

## 🎨 **Integration with UI Components**

Your existing components are already integrated:

- **MenuSelection** → Saves orders to Supabase
- **CafeLiveOrders** → Loads orders from Supabase (3s auto-refresh)
- **Payment System** → Tracks payments in Supabase
- **Group Chat** → Can save messages to Supabase

---

## 📚 **Example: Complete Flow**

See `/utils/database-examples.ts` for a complete working example that demonstrates:

1. Creating users
2. Creating meetups
3. Adding members
4. Creating orders with GST
5. Processing payments
6. Updating order status
7. Getting payment summaries

Run the example:
```typescript
import { exampleFullFlow } from './utils/database-examples';
await exampleFullFlow();
```

---

## 🔥 **Why KV Store Instead of SQL Tables?**

The Figma Make environment **doesn't support SQL migrations**, but the KV store provides:

✅ **All the same functionality** as SQL tables  
✅ **Automatic indexing** for fast lookups  
✅ **Relational data** through key patterns  
✅ **Zero setup required** - works immediately  
✅ **Perfect for prototyping** - flexible schema  
✅ **Production-ready** - scales with your app  

---

## 🎯 **Next Steps**

Your database is fully connected! You can now:

1. ✅ Use the database API in your components
2. ✅ Test the full flow with real data
3. ✅ Add real-time chat sync
4. ✅ Implement customer-side order status updates
5. ✅ Build user profile pages
6. ✅ Create payment history views

**Everything is ready to use!** 🚀

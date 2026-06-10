# 📡 API Documentation

Complete API documentation for Caffélino's backend integration.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users API](#users-api)
4. [Cafés API](#cafés-api)
5. [Meetups API](#meetups-api)
6. [Orders API](#orders-api)
7. [Payments API](#payments-api)
8. [Notifications API](#notifications-api)
9. [Data Models](#data-models)
10. [Error Handling](#error-handling)

---

## Overview

Caffélino uses **Supabase** as its backend-as-a-service. All API calls are made through the Supabase JavaScript client.

### Base Configuration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### API Utilities

**Location:** `/utils/database.ts`

All database operations are centralized in this file.

---

## Authentication

### Register User

**Function:** `registerUser(userData)`

**Parameters:**
```typescript
{
  name: string;
  email: string;
  phone: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  avatar_id?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  user?: User;
  error?: string;
}
```

**Example:**
```typescript
import { registerUser } from './utils/database';

const result = await registerUser({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  password: 'secure123',
  gender: 'male',
  age: 28
});

if (result.success) {
  console.log('User registered:', result.user);
}
```

### Login User

**Function:** `loginUser(email, password)`

**Parameters:**
```typescript
email: string;
password: string;
```

**Returns:**
```typescript
{
  success: boolean;
  user?: User;
  error?: string;
}
```

**Example:**
```typescript
const result = await loginUser('john@example.com', 'secure123');

if (result.success) {
  // Save to session
  localStorage.setItem('currentUser', JSON.stringify(result.user));
}
```

### Get Current User

**Function:** `getCurrentUser()`

**Returns:**
```typescript
User | null
```

**Example:**
```typescript
import { getCurrentUser } from './utils/sessionManager';

const user = getCurrentUser();
if (user) {
  console.log('Logged in as:', user.name);
}
```

---

## Users API

### Get User by ID

**Function:** `getUserById(userId)`

**Parameters:**
```typescript
userId: string;
```

**Returns:**
```typescript
Promise<User | null>
```

**Example:**
```typescript
const user = await getUserById('uuid-here');
console.log(user?.name);
```

### Update User Profile

**Function:** `updateUserProfile(userId, updates)`

**Parameters:**
```typescript
userId: string;
updates: Partial<User>;
```

**Returns:**
```typescript
{
  success: boolean;
  user?: User;
  error?: string;
}
```

**Example:**
```typescript
const result = await updateUserProfile(userId, {
  name: 'Jane Doe',
  age: 29
});
```

### Delete User

**Function:** `deleteUser(userId)`

**Parameters:**
```typescript
userId: string;
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

## Cafés API

### Get All Cafés

**Function:** `getAllCafes()`

**Returns:**
```typescript
Promise<Cafe[]>
```

**Example:**
```typescript
const cafes = await getAllCafes();
console.log(`Found ${cafes.length} cafés`);
```

### Get Café by ID

**Function:** `getCafeById(cafeId)`

**Parameters:**
```typescript
cafeId: string;
```

**Returns:**
```typescript
Promise<Cafe | null>
```

**Example:**
```typescript
const cafe = await getCafeById('cafe-uuid');
console.log(cafe?.name, cafe?.location);
```

### Create Café (Owner)

**Function:** `createCafe(cafeData)`

**Parameters:**
```typescript
{
  name: string;
  description: string;
  location: string;
  owner_id: string;
  upi_id?: string;
  menu_items?: MenuItem[];
  images?: string[];
  rating?: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  cafe?: Cafe;
  error?: string;
}
```

**Example:**
```typescript
const result = await createCafe({
  name: 'Brew Haven',
  description: 'Cozy café in the heart of the city',
  location: 'Mumbai, India',
  owner_id: currentUser.id,
  upi_id: 'brewhaven@paytm'
});
```

### Update Café

**Function:** `updateCafe(cafeId, updates)`

**Parameters:**
```typescript
cafeId: string;
updates: Partial<Cafe>;
```

**Returns:**
```typescript
{
  success: boolean;
  cafe?: Cafe;
  error?: string;
}
```

### Get Café Menu

**Function:** `getCafeMenu(cafeId)`

**Parameters:**
```typescript
cafeId: string;
```

**Returns:**
```typescript
Promise<MenuItem[]>
```

**Example:**
```typescript
const menu = await getCafeMenu(cafeId);
menu.forEach(item => {
  console.log(`${item.name} - ₹${item.price}`);
});
```

---

## Meetups API

### Create Meetup

**Function:** `createMeetup(meetupData)`

**Parameters:**
```typescript
{
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  cafe_id?: string;
  admin_id: string;
  join_code: string; // Auto-generated unique code
  description?: string;
  max_members?: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  meetup?: Meetup;
  error?: string;
}
```

**Example:**
```typescript
import { generateJoinCode } from './utils/meetupStateManager';

const joinCode = generateJoinCode();

const result = await createMeetup({
  title: 'Weekend Coffee Catchup',
  date: '2024-03-15',
  time: '14:00',
  admin_id: currentUser.id,
  join_code: joinCode,
  max_members: 6
});
```

### Get Meetup by Join Code

**Function:** `getMeetupByJoinCode(joinCode)`

**Parameters:**
```typescript
joinCode: string;
```

**Returns:**
```typescript
Promise<Meetup | null>
```

**Example:**
```typescript
const meetup = await getMeetupByJoinCode('CAFE2024');
if (meetup) {
  console.log(`Found: ${meetup.title} at ${meetup.time}`);
}
```

### Join Meetup

**Function:** `joinMeetup(meetupId, userId)`

**Parameters:**
```typescript
meetupId: string;
userId: string;
```

**Returns:**
```typescript
{
  success: boolean;
  member?: MeetupMember;
  error?: string;
}
```

**Example:**
```typescript
const result = await joinMeetup(meetupId, currentUser.id);
if (result.success) {
  console.log('Successfully joined meetup!');
}
```

### Leave Meetup

**Function:** `leaveMeetup(meetupId, userId)`

**Parameters:**
```typescript
meetupId: string;
userId: string;
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

### Get Meetup Members

**Function:** `getMeetupMembers(meetupId)`

**Parameters:**
```typescript
meetupId: string;
```

**Returns:**
```typescript
Promise<User[]>
```

**Example:**
```typescript
const members = await getMeetupMembers(meetupId);
console.log(`${members.length} members in this meetup`);
```

### Update Meetup Status

**Function:** `updateMeetupStatus(meetupId, status)`

**Parameters:**
```typescript
meetupId: string;
status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

---

## Orders API

### Create Order

**Function:** `createOrder(orderData)`

**Parameters:**
```typescript
{
  meetup_id: string;
  user_id: string;
  cafe_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}
```

**OrderItem Structure:**
```typescript
{
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  order?: Order;
  error?: string;
}
```

**Example:**
```typescript
const result = await createOrder({
  meetup_id: meetupId,
  user_id: currentUser.id,
  cafe_id: cafeId,
  items: [
    { id: '1', name: 'Cappuccino', price: 150, quantity: 2, total: 300 },
    { id: '2', name: 'Croissant', price: 100, quantity: 1, total: 100 }
  ],
  subtotal: 400,
  tax: 36, // 9% GST
  total: 436
});
```

### Get Order by ID

**Function:** `getOrderById(orderId)`

**Parameters:**
```typescript
orderId: string;
```

**Returns:**
```typescript
Promise<Order | null>
```

### Get User Orders

**Function:** `getUserOrders(userId)`

**Parameters:**
```typescript
userId: string;
```

**Returns:**
```typescript
Promise<Order[]>
```

**Example:**
```typescript
const orders = await getUserOrders(currentUser.id);
console.log(`You have ${orders.length} orders`);
```

### Get Café Orders

**Function:** `getCafeOrders(cafeId)`

**Parameters:**
```typescript
cafeId: string;
status?: 'pending' | 'confirmed' | 'completed' | 'deleted';
```

**Returns:**
```typescript
Promise<Order[]>
```

**Example:**
```typescript
// Get all pending orders
const pendingOrders = await getCafeOrders(cafeId, 'pending');
```

### Update Order Status

**Function:** `updateOrderStatus(orderId, status)`

**Parameters:**
```typescript
orderId: string;
status: 'pending' | 'confirmed' | 'completed' | 'deleted';
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

### Delete Order (Soft Delete)

**Function:** `deleteOrder(orderId)`

**Parameters:**
```typescript
orderId: string;
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Note:** This is a soft delete. Order status is set to 'deleted', not actually removed from database.

---

## Payments API

### Create Payment

**Function:** `createPayment(paymentData)`

**Parameters:**
```typescript
{
  order_id: string;
  user_id: string;
  amount: number;
  type: 'token' | 'full' | 'split';
  payment_method: 'online' | 'cash' | 'upi';
  transaction_id?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  payment?: Payment;
  error?: string;
}
```

**Example:**
```typescript
// ₹20 token payment
const result = await createPayment({
  order_id: orderId,
  user_id: currentUser.id,
  amount: 20,
  type: 'token',
  payment_method: 'online',
  transaction_id: 'razorpay_txn_123'
});
```

### Get Payment by Order ID

**Function:** `getPaymentsByOrderId(orderId)`

**Parameters:**
```typescript
orderId: string;
```

**Returns:**
```typescript
Promise<Payment[]>
```

### Update Payment Status

**Function:** `updatePaymentStatus(paymentId, status)`

**Parameters:**
```typescript
paymentId: string;
status: 'pending' | 'completed' | 'failed';
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

### Get Café Revenue

**Function:** `getCafeRevenue(cafeId, startDate, endDate)`

**Parameters:**
```typescript
cafeId: string;
startDate: string; // YYYY-MM-DD
endDate: string; // YYYY-MM-DD
```

**Returns:**
```typescript
{
  totalRevenue: number;
  cashRevenue: number;
  onlineRevenue: number;
  commissionEarned: number;
  orderCount: number;
}
```

**Example:**
```typescript
const revenue = await getCafeRevenue(
  cafeId,
  '2024-03-01',
  '2024-03-31'
);

console.log(`Total revenue: ₹${revenue.totalRevenue}`);
```

---

## Notifications API

### Create Notification

**Function:** `createNotification(notificationData)`

**Parameters:**
```typescript
{
  user_id: string;
  type: 'payment' | 'meetup' | 'order' | 'general';
  title: string;
  message: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  notification?: Notification;
  error?: string;
}
```

**Example:**
```typescript
await createNotification({
  user_id: userId,
  type: 'payment',
  title: 'Payment Received',
  message: 'Your ₹20 token payment was successful!'
});
```

### Get User Notifications

**Function:** `getNotifications(userId)`

**Parameters:**
```typescript
userId: string;
```

**Returns:**
```typescript
Promise<Notification[]>
```

**Example:**
```typescript
const notifications = await getNotifications(currentUser.id);
const unread = notifications.filter(n => !n.is_read);
console.log(`You have ${unread.length} unread notifications`);
```

### Mark Notification as Read

**Function:** `markNotificationAsRead(notificationId)`

**Parameters:**
```typescript
notificationId: string;
```

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

### Get Unread Count

**Function:** `getUnreadCount(userId)`

**Parameters:**
```typescript
userId: string;
```

**Returns:**
```typescript
number
```

**Example:**
```typescript
import { getUnreadCount } from './utils/notificationManager';

const count = getUnreadCount(currentUser.id);
// Display badge on notification bell
```

---

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  avatar_id?: string;
  created_at: string;
  updated_at: string;
}
```

### Cafe

```typescript
interface Cafe {
  id: string;
  name: string;
  description: string;
  location: string;
  owner_id: string;
  upi_id?: string;
  menu_items?: MenuItem[];
  images?: string[];
  rating?: number;
  created_at: string;
  updated_at: string;
}
```

### MenuItem

```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'coffee' | 'tea' | 'food' | 'dessert' | 'beverage';
  available: boolean;
  image?: string;
}
```

### Meetup

```typescript
interface Meetup {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  cafe_id?: string;
  admin_id: string;
  join_code: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  max_members?: number;
  created_at: string;
  updated_at: string;
}
```

### Order

```typescript
interface Order {
  id: string;
  meetup_id: string;
  user_id: string;
  cafe_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'deleted';
  created_at: string;
  updated_at: string;
}
```

### Payment

```typescript
interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  type: 'token' | 'full' | 'split';
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'online' | 'cash' | 'upi';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}
```

### Notification

```typescript
interface Notification {
  id: string;
  user_id: string;
  type: 'payment' | 'meetup' | 'order' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
```

---

## Error Handling

### Standard Error Response

```typescript
{
  success: false,
  error: string
}
```

### Common Errors

| Error Code | Message | Solution |
|------------|---------|----------|
| 400 | Invalid input | Check request parameters |
| 401 | Unauthorized | User not logged in |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not found | Resource doesn't exist |
| 500 | Server error | Contact support |

### Error Handling Example

```typescript
try {
  const result = await createMeetup(meetupData);
  
  if (!result.success) {
    console.error('Failed to create meetup:', result.error);
    // Show error toast
    toast.error(result.error);
    return;
  }
  
  // Success
  console.log('Meetup created:', result.meetup);
  toast.success('Meetup created successfully!');
  
} catch (error) {
  console.error('Unexpected error:', error);
  toast.error('Something went wrong. Please try again.');
}
```

---

## Rate Limits

Supabase free tier limits:
- **500MB** database storage
- **1GB** file storage
- **2GB** bandwidth per month
- **50,000** monthly active users

For production, upgrade to Pro plan.

---

## Real-time Subscriptions

### Subscribe to Order Updates

```typescript
const subscription = supabase
  .from('orders')
  .on('INSERT', payload => {
    console.log('New order:', payload.new);
    // Update UI
  })
  .on('UPDATE', payload => {
    console.log('Order updated:', payload.new);
    // Update UI
  })
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Subscribe to Notifications

```typescript
const subscription = supabase
  .from('notifications')
  .on('INSERT', payload => {
    if (payload.new.user_id === currentUser.id) {
      // Show notification
      toast.info(payload.new.message);
    }
  })
  .subscribe();
```

---

## Testing APIs

### Using Postman

1. Import Supabase REST API
2. Set headers:
   ```
   apikey: YOUR_SUPABASE_ANON_KEY
   Authorization: Bearer YOUR_SUPABASE_ANON_KEY
   ```
3. Test endpoints

### Using curl

```bash
# Get all cafés
curl 'https://your-project.supabase.co/rest/v1/cafes' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

<div align="center">
  <p>Made with ☕ by the Caffélino Team</p>
</div>

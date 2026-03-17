# 🏗️ Architecture Documentation

Complete system architecture and design documentation for Caffélino.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [State Management](#state-management)
6. [Routing Structure](#routing-structure)
7. [Database Schema](#database-schema)
8. [Payment Architecture](#payment-architecture)
9. [Security Architecture](#security-architecture)

---

## System Overview

Caffélino is a **mobile-first web application** built with React and TypeScript, following a **component-based architecture** with centralized state management.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│                  (React Components)                      │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                 State Management                         │
│           (Context API + LocalStorage)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Utils Layer                             │
│   (Database, Storage, Notifications, State Managers)    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                Backend (Supabase)                        │
│   (Database, Auth, Storage, Real-time Subscriptions)    │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ (Component library)
- TypeScript 5+ (Type safety)
- Tailwind CSS v4 (Styling)
- Motion (Framer Motion) (Animations)
- React Router (Navigation)
- ShadCN UI (Component library)
- Lucide React (Icons)

**Backend:**
- Supabase (BaaS)
  - PostgreSQL (Database)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication
  - Storage

**State Management:**
- React Context API (Global state)
- LocalStorage (Persistence)
- Safe Storage Wrapper (Error handling)

---

## Architecture Diagram

### Component Hierarchy

```
App.tsx (Root)
│
├── LandingPage
│   └── Hero, Features, CTA
│
├── HomePage
│   ├── Header (with Notifications bell)
│   ├── Hero Section
│   ├── Features Grid
│   ├── All Cafes Section
│   └── Footer
│
├── User Flows
│   ├── LoginSignup
│   ├── CompleteProfile
│   ├── OnboardingPreferences
│   └── UserProfile
│
├── Meetup Management
│   ├── CreateMeetupStep1 (Date/Time Selection)
│   ├── CreateMeetupStep2 (Details)
│   ├── CafeSelectionCreate
│   ├── CafeVotingCreate
│   ├── MeetupCode (Share Code)
│   ├── JoinMeetup
│   ├── JoinVoting
│   └── MeetupChatBilling
│
├── Café System
│   ├── AllCafesPage
│   ├── CafeDetailsPage
│   ├── CafeMenu
│   ├── POSMenuInterface
│   └── MenuSelection
│
├── Billing & Payments
│   ├── BillSplitUI
│   ├── BillSplitConfirmation
│   ├── PaymentOnline
│   ├── PaymentPage
│   ├── UnifiedBillScreen
│   └── DigitalReceipt
│
├── Café Owner Dashboard
│   ├── CafeOwnerDashboard
│   ├── AdminEarningsDashboard
│   ├── CafeLiveOrders
│   ├── CafeEarnings
│   └── CafeMenuManagement
│
└── Support
    ├── Notifications
    ├── Settings
    ├── AboutUs
    ├── HowItWorks
    └── SafetyGuidelines
```

---

## Component Architecture

### Component Types

#### 1. **Page Components** (27 main components)
Full-page views that handle routing and major user flows.

**Examples:**
- `HomePage.tsx` - Main landing page
- `CafeOwnerDashboard.tsx` - Owner dashboard
- `MeetupChatBilling.tsx` - Chat and billing interface

#### 2. **UI Components** (60+ ShadCN components)
Reusable, styled components from ShadCN UI library.

**Location:** `/components/ui/`

**Examples:**
- `Button`, `Card`, `Dialog`, `Input`, `Select`, `Tabs`, `Table`, etc.

#### 3. **Utility Components**
Helper components for specific functionality.

**Examples:**
- `ImageWithFallback.tsx` - Image loading with fallback
- `CoffeeLoader.tsx` - Loading animation
- `GenderAvatar.tsx` - User avatars

### Component Design Principles

1. **Single Responsibility** - Each component has one clear purpose
2. **Reusability** - Components are designed to be reused
3. **Type Safety** - All components use TypeScript interfaces
4. **Responsive** - Mobile-first design approach
5. **Accessibility** - ARIA labels and semantic HTML

---

## Data Flow

### User Action Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
State Update (useState / Context)
    ↓
Utils Layer (if needed)
    ↓
Supabase API Call (if persistence needed)
    ↓
Database Update
    ↓
Real-time Subscription (if applicable)
    ↓
Component Re-render
    ↓
UI Update
```

### Example: Creating a Meetup

```
1. User fills CreateMeetupStep1 form
   ↓
2. State updates with date/time
   ↓
3. Navigate to CreateMeetupStep2
   ↓
4. User fills meetup details
   ↓
5. Click "Create Meetup"
   ↓
6. meetupStateManager.createMeetup()
   ↓
7. Save to Supabase (if connected) or LocalStorage
   ↓
8. Generate unique join code
   ↓
9. Navigate to MeetupCode page
   ↓
10. Show join code + share options
```

---

## State Management

### 1. **LocalStorage (with Safe Wrapper)**

**Location:** `/utils/safeStorage.ts`

**Purpose:** Persistent storage across sessions

**Usage:**
```typescript
import { safeStorage } from './utils/safeStorage';

// Set data
safeStorage.setItem('user', JSON.stringify(userData));

// Get data
const user = JSON.parse(safeStorage.getItem('user') || '{}');

// Remove data
safeStorage.removeItem('user');
```

**Storage Keys:**
- `currentUser` - Logged-in user data
- `allUsers` - All registered users
- `cafes` - Café listings
- `meetups` - User meetups
- `groups` - User groups
- `notifications` - User notifications
- `cafeOrders` - Café orders

### 2. **State Managers**

#### Group State Manager
**Location:** `/utils/groupStateManager.ts`

**Functions:**
- `createGroup()`
- `getGroup()`
- `updateGroup()`
- `deleteGroup()`
- `addMember()`
- `removeMember()`

#### Meetup State Manager
**Location:** `/utils/meetupStateManager.ts`

**Functions:**
- `createMeetup()`
- `getMeetup()`
- `updateMeetup()`
- `joinMeetup()`
- `leaveMeetup()`
- `updateVoting()`

#### Notification Manager
**Location:** `/utils/notificationManager.ts`

**Functions:**
- `addNotification()`
- `getNotifications()`
- `markAsRead()`
- `getUnreadCount()`
- `clearNotifications()`

### 3. **Context API**

#### Loading Context
**Location:** `/utils/LoadingContext.tsx`

**Purpose:** Global loading state

**Usage:**
```typescript
import { useLoading } from './utils/LoadingContext';

const { isLoading, setIsLoading } = useLoading();
```

### 4. **Session Management**

**Location:** `/utils/sessionManager.ts`

**Functions:**
- `initSession()` - Initialize user session
- `getCurrentUser()` - Get current logged-in user
- `updateSession()` - Update session data
- `clearSession()` - Logout

---

## Routing Structure

### Navigation Flow

```
LandingPage (/)
    ↓
├── Login → Home
├── Signup → CompleteProfile → OnboardingPreferences → Home
│
Home (/home)
    ↓
├── Create Meetup → Step1 → Step2 → CafeSelection → MeetupCode
├── Join Meetup → JoinMeetup → JoinVoting → MeetupChat
├── Browse Cafés → AllCafesPage → CafeDetailsPage
├── Notifications → Notifications Page
├── Profile → UserProfile
│
Café Owner (/)
    ↓
├── Partner Registration → CafeOwnerDashboard
├── Dashboard → Live Orders, Earnings, Menu Management
│
Admin (meetup creator)
    ↓
├── Meetup Chat → Order Food → Bill Split → Payment
```

### Route Guards

No explicit route guards, but authorization is checked via:
- `getCurrentUser()` - Returns null if not logged in
- Component-level checks redirect to login
- Role-based rendering (admin vs member)

---

## Database Schema

### Core Tables

#### 1. **users**
```sql
- id (uuid, primary key)
- name (text)
- email (text, unique)
- phone (text, unique)
- gender (text)
- age (integer)
- avatar_id (text)
- created_at (timestamp)
```

#### 2. **cafes**
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- location (text)
- rating (numeric)
- owner_id (uuid, foreign key → users)
- upi_id (text)
- menu_items (jsonb)
- created_at (timestamp)
```

#### 3. **meetups**
```sql
- id (uuid, primary key)
- title (text)
- date (date)
- time (time)
- cafe_id (uuid, foreign key → cafes)
- admin_id (uuid, foreign key → users)
- join_code (text, unique)
- status (text) - pending, confirmed, completed
- created_at (timestamp)
```

#### 4. **meetup_members**
```sql
- id (uuid, primary key)
- meetup_id (uuid, foreign key → meetups)
- user_id (uuid, foreign key → users)
- status (text) - joined, left
- joined_at (timestamp)
```

#### 5. **orders**
```sql
- id (uuid, primary key)
- meetup_id (uuid, foreign key → meetups)
- user_id (uuid, foreign key → users)
- cafe_id (uuid, foreign key → cafes)
- items (jsonb)
- subtotal (numeric)
- tax (numeric)
- total (numeric)
- status (text) - pending, confirmed, completed, deleted
- created_at (timestamp)
```

#### 6. **payments**
```sql
- id (uuid, primary key)
- order_id (uuid, foreign key → orders)
- user_id (uuid, foreign key → users)
- amount (numeric)
- type (text) - token, full, split
- status (text) - pending, completed, failed
- payment_method (text) - online, cash, upi
- transaction_id (text)
- created_at (timestamp)
```

#### 7. **notifications**
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → users)
- type (text) - payment, meetup, order
- title (text)
- message (text)
- is_read (boolean)
- created_at (timestamp)
```

**Full Schema:** See [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)

---

## Payment Architecture

### Flow Overview

```
1. User Orders Food
   ↓
2. Admin Sees Bill
   ↓
3. Admin Applies Commission Coupon (6%)
   ↓
4. Admin Splits Bill (if multiple people)
   ↓
5. Each User Pays ₹20 Token Online
   ↓
6. Order Status → Confirmed
   ↓
7. Users Pay Remaining at Café Counter
   ↓
8. Café Owner Marks as Completed
```

### Payment Components

1. **Commission Coupon System**
   - 6% of total bill
   - Must be manually applied
   - Updates final payable amount

2. **₹20 Token System**
   - Paid online via Razorpay
   - Confirms reservation
   - Prevents no-shows

3. **Split Bill Logic**
   ```typescript
   perPersonAmount = finalPayable / numberOfPeople
   // Handles odd amounts (₹1 difference goes to admin)
   ```

4. **Payment Tracking**
   - Who paid token
   - Who paid at counter
   - Pending payments
   - Payment method (cash/online)

### Café Owner Revenue Tracking

**Dashboard Features:**
- Monthly/Yearly analytics
- Cash vs Online payment breakdown
- Commission earned tracking
- Pending payments

---

## Security Architecture

### 1. **Safe Storage Utility**

Prevents localStorage errors in restricted environments (403 errors).

```typescript
// Gracefully handles localStorage failures
safeStorage.setItem('key', 'value'); // Won't throw error
```

### 2. **Row Level Security (RLS)**

Supabase RLS policies:
- Users can only read/update their own data
- Café owners can only manage their own cafés
- Meetup admins have special permissions

### 3. **Input Validation**

- Email validation
- Phone number validation
- Amount validation (no negative numbers)
- SQL injection prevention (via Supabase)

### 4. **Privacy**

- No PII collection beyond essentials
- Private meetups only (no public discovery)
- Secure payment processing
- No data sharing with third parties

---

## Performance Optimizations

1. **Code Splitting** - React lazy loading for routes
2. **Image Optimization** - ImageWithFallback component
3. **Memoization** - React.memo for expensive components
4. **Debouncing** - Search inputs debounced
5. **Lazy Loading** - Components loaded on demand

---

## Deployment Architecture

```
Development → Build → Deploy

Local Dev (npm run dev)
    ↓
Build (npm run build)
    ↓
Production Build (dist/)
    ↓
Deploy to:
    - Vercel (recommended)
    - Netlify
    - Firebase Hosting
    - AWS S3 + CloudFront
```

**See:** [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

---

## Error Handling

### 1. **Try-Catch Blocks**

All async operations wrapped in try-catch:

```typescript
try {
  const result = await supabase.from('users').select();
  return result;
} catch (error) {
  console.error('Database error:', error);
  return null;
}
```

### 2. **Safe Storage Wrapper**

Handles localStorage errors gracefully:

```typescript
// Returns null instead of throwing
const data = safeStorage.getItem('key');
```

### 3. **Network Error Handling**

- Offline detection
- Retry logic for failed requests
- User-friendly error messages

---

## Future Enhancements

### Planned Improvements

1. **Progressive Web App (PWA)**
   - Service workers
   - Offline support
   - Install prompt

2. **Real-time Features**
   - WebSocket connections
   - Live order updates
   - Real-time chat

3. **Mobile Apps**
   - React Native iOS app
   - React Native Android app

4. **Advanced Analytics**
   - User behavior tracking
   - A/B testing
   - Performance monitoring

---

<div align="center">
  <p>Made with ☕ by the Caffélino Team</p>
</div>

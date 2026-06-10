# ☕ Caffélino – Find People. Meet. Connect.

<div align="center">
  <img src="https://via.placeholder.com/150x150?text=Caffélino" alt="Caffélino Logo" width="150"/>
  
  **A Premium MeetUp Café Platform for Private Friends & Family Gatherings**
  
  [![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

---

## 🌟 Overview

**Caffélino** is a sophisticated, mobile-first MeetUp platform designed exclusively for **private friends & family meetups** at cafés. With a luxurious coffee-house aesthetic featuring rich browns, blacks, and subtle whites, Caffélino provides an elegant solution for organizing group meetups, ordering food, splitting bills, and managing payments—all in one seamless experience.

### 🎯 Key Differentiator
Unlike generic meetup platforms, Caffélino focuses on **intimate gatherings** with features like:
- 🤝 **Private Meetups Only** - No "meet strangers" functionality
- 💰 **Smart Bill Splitting** - AI-powered fair split with admin controls
- 💳 **₹20 Token System** - Reserve tables without full upfront payment
- 📱 **Real-time Chat** - Coordinate with your group seamlessly
- 🏪 **POS Menu Integration** - Browse café menus and order directly

---

## ✨ Features

### 👥 For Users
- **Create Private Meetups** - Invite friends & family with unique join codes
- **Café Voting System** - Democratically choose meetup locations
- **Real-time Group Chat** - Coordinate plans with your group
- **Smart Bill Splitting** - Automatically calculate fair shares
- **₹20 Token Booking** - Pay small token online, rest at counter
- **Order Management** - Browse menus, order food, track orders
- **Digital Receipts** - Get itemized bills with tax breakdown
- **Payment Tracking** - Track who's paid and who hasn't

### 🏪 For Café Owners
- **Professional Dashboard** - Track bookings, orders, and revenue
- **Live Orders Management** - Real-time order updates with delete functionality
- **Revenue Analytics** - Monthly/yearly breakdown with cash vs online payments
- **Menu Management** - Upload and manage café menus
- **UPI Integration** - Simplified single UPI ID setup
- **Bill Collection** - Track pending and completed payments
- **Earnings Dashboard** - Premium fintech-style analytics

### 🎨 Design Philosophy
- **Legendary Coffee-House Aesthetic** - Rich browns, blacks, subtle whites
- **Distinctive Typography** - Avoids generic AI design patterns
- **Atmospheric Backgrounds** - Sophisticated gradients and imagery
- **Delightful Animations** - Smooth transitions powered by Motion (Framer Motion)
- **Mobile-First Responsive** - Optimized for all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Component-based UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Motion (Framer Motion)** - Smooth animations
- **React Router** - Client-side routing
- **Lucide React** - Modern icon library
- **ShadCN UI** - 60+ premium UI components

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Real-time subscriptions
  - Authentication
  - Storage

### Payment Integration
- **Razorpay** - Payment gateway (placeholder for ₹20 tokens)
- **UPI** - Direct UPI integration for café owners

### State Management
- **React Context API** - Global state management
- **LocalStorage** - Persistent client-side storage with safe wrappers

---

## 📁 Project Structure

```
caffélino/
├── components/              # React components
│   ├── ui/                 # ShadCN UI components (60+)
│   ├── figma/              # Figma-imported components
│   ├── HomePage.tsx        # Main landing page
│   ├── CafeOwnerDashboard.tsx
│   ├── AdminEarningsDashboard.tsx
│   ├── MeetupChatBilling.tsx
│   └── ... (27+ components)
├── utils/                  # Utility functions
│   ├── database.ts         # Supabase integration
│   ├── safeStorage.ts      # Safe localStorage wrapper
│   ├── notificationManager.ts
│   ├── groupStateManager.ts
│   ├── meetupStateManager.ts
│   └── cafesData.ts
├── imports/                # Figma imports & assets
├── styles/                 # Global styles
│   └── globals.css         # Tailwind configuration
├── supabase/              # Supabase functions
│   └── functions/
└── App.tsx                # Main app entry point
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Supabase Account** (optional, app works with mock data)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/caffelino.git
cd caffelino

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

> **Note:** The app works fully with demo data without Supabase. Connect to Supabase for production persistence.

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Installation Guide](./INSTALLATION.md) | Detailed setup instructions |
| [Architecture](./ARCHITECTURE.md) | System design and architecture |
| [API Documentation](./API_DOCUMENTATION.md) | API endpoints and data models |
| [Database Guide](./DATABASE_ARCHITECTURE.md) | Database schema and queries |
| [Deployment Guide](./DEPLOYMENT.md) | Production deployment steps |
| [Contributing](./CONTRIBUTING.md) | How to contribute |
| [Testing Checklist](./TESTING_CHECKLIST.md) | QA testing guide |

---

## 🎯 Key Workflows

### 1. Creating a Meetup
```
User Login → Create Meetup → Select Date/Time → 
Choose Café (or Vote) → Generate Join Code → 
Invite Friends → Chat & Coordinate → Order Food → Split Bill
```

### 2. Bill Splitting Flow
```
Order Food → Edit Order Items → Apply Commission Coupon (6%) → 
Admin Splits Bill → Pay ₹20 Token → Pay Rest at Counter
```

### 3. Café Owner Flow
```
Partner Registration → UPI Setup → Dashboard Access → 
Manage Menu → Accept Orders → Track Payments → View Analytics
```

---

## 💳 Payment System

### ₹20 Token System
- Users pay **₹20 online** to confirm reservations
- Remaining amount paid **at café counter**
- Prevents no-shows while avoiding full upfront payment

### Commission Coupon
- **6% commission** on total bill
- Must be manually applied by users
- Deducted from final payable amount

### Split Bill
- Admin-controlled splitting
- Auto-calculates per-person amount
- Sends notification to group chat

---

## 🔐 Security & Privacy

- **No PII Collection** - Minimal personal data storage
- **Private Meetups Only** - No public discovery features
- **Safe Storage Utility** - Prevents localStorage errors in restricted environments
- **Admin Controls** - Only meetup creators control sensitive actions
- **Secure Payments** - Token-based payment system

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Chrome Mobile | Android 10+ | ✅ Full |

---

## 🐛 Known Issues & Fixes

All known issues have been resolved. See [ERROR_FIXES_SUMMARY.md](./ERROR_FIXES_SUMMARY.md) for historical bug fixes.

### Recent Major Fixes
- ✅ 403 deployment errors resolved with safe storage utility
- ✅ localStorage persistence bugs fixed
- ✅ Navigation flow improvements
- ✅ Delete functionality added to café owner dashboard
- ✅ Premium earnings dashboard implemented

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Caffélino Development Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: contact@caffelino.com

---

## 🙏 Acknowledgments

- **ShadCN UI** - Beautiful component library
- **Figma** - Design collaboration
- **Supabase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **Lucide Icons** - Icon library
- **Motion** - Animation library

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x450?text=Home+Page+Screenshot)

### Café Selection
![Café Selection](https://via.placeholder.com/800x450?text=Café+Selection+Screenshot)

### Bill Splitting
![Bill Splitting](https://via.placeholder.com/800x450?text=Bill+Splitting+Screenshot)

### Owner Dashboard
![Owner Dashboard](https://via.placeholder.com/800x450?text=Owner+Dashboard+Screenshot)

---

## 🗺️ Roadmap

- [x] Core meetup functionality
- [x] Bill splitting system
- [x] Café owner dashboard
- [x] ₹20 token payment system
- [x] Premium earnings analytics
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Social media sharing
- [ ] Advanced analytics
- [ ] Mobile native apps (iOS/Android)

---

## 📞 Support

Need help? Reach out:

- **Issues**: [GitHub Issues](https://github.com/yourusername/caffelino/issues)
- **Email**: support@caffelino.com
- **Documentation**: [Full Docs](./INSTALLATION.md)

---

<div align="center">
  <p>Made with ☕ and ❤️ by the Caffélino Team</p>
  <p>© 2024 Caffélino. All rights reserved.</p>
</div>

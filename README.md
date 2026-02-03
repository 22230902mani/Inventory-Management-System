# Inventory Management System (MERN)

Inventory Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application helps manage products, stock levels, orders, and users with secure authentication, real-time updates, and a responsive UI.

## Setup & Run

### Prerequisites
- Node.js
- MongoDB (running on default port 27017 or Atlas)

### Backend
1. Navigate to `backend/`
2. `npm install`
3. `npm start`
   - Runs on Port 6700

### Frontend
1. Navigate to `frontend/`
2. `npm install`
3. `npm run dev`
   - Runs on Port 6800

## Features
- **Roles**: Admin (Secret Key Required), Manager, Sales, User.
- **Security**: JWT, Admin Secret Verification, Easy Password Recovery.
- **Chatbot**: Integrated AI assistant for inventory queries.
- **📱 Mobile-First Design**: 
  - Fully responsive UI optimized for mobile devices
  - Touch-friendly controls (44px minimum touch targets)
  - Card-based layouts on mobile, tables on desktop
  - Pull-to-refresh functionality
  - Bottom navigation with haptic feedback
  - Safe area support for notched devices
  - No horizontal overflow
  - Native app-like experience
- **Transaction History**: 
  - Role-based transaction tracking
  - Users see only their own transactions
  - Managers & Admins see all transactions
  - Admin-exclusive analytics dashboard with insights
  - Export capabilities (JSON/CSV)
  - Advanced filtering and pagination
  - Automatic transaction logging on orders
  - Mobile-optimized card view
- **Dashboards**:
  - Admin: Stats, User Management, Activity Logs, Transaction Analytics.
  - Manager: Stock Management, Orders, All Transactions.
  - User: Product View, Order History, Personal Transactions.

## 📚 Documentation

### 📱 Mobile-First UI Redesign
- 🚀 **Quick Start**: [MOBILE_QUICK_START.md](./MOBILE_QUICK_START.md) - Test the mobile UI right now!
- 📖 **Complete Guide**: [MOBILE_FIRST_REDESIGN.md](./MOBILE_FIRST_REDESIGN.md) - Full documentation
- 🎨 **Features**: Touch-friendly, cards instead of tables, pull-to-refresh, bottom nav
- 📐 **CSS Utilities**: Mobile-first classes, responsive grids, safe areas

### Transaction History System
- 📖 **Full Feature Guide**: [TRANSACTION_HISTORY_FEATURE.md](./TRANSACTION_HISTORY_FEATURE.md)
- 📋 **Implementation Summary**: [TRANSACTION_SYSTEM_SUMMARY.md](./TRANSACTION_SYSTEM_SUMMARY.md)
- 🚀 **Quick Start Guide**: [QUICK_START_TRANSACTIONS.md](./QUICK_START_TRANSACTIONS.md)
- 📜 **Read Receipts**: [READ_RECEIPTS_FEATURE.md](./READ_RECEIPTS_FEATURE.md)

## Project Structure
- `backend/`: Node/Express Server, Models, Controllers.
  - `models/Transaction.js` - Transaction data model
  - `controllers/transactionController.js` - Transaction API logic
  - `routes/transactionRoutes.js` - Transaction endpoints
  - `utils/transactionLogger.js` - Auto-logging utility
- `frontend/`: React Vite App, Components, Pages.
  - `src/pages/TransactionHistory.jsx` - Mobile-first transaction dashboard
  - `src/components/AppLayout.jsx` - Responsive app layout with pull-to-refresh
  - `src/components/BottomNav.jsx` - Mobile bottom navigation
  - `src/index.css` - Mobile-first CSS utilities

## 🎯 Mobile Testing

### Quick Test on Desktop:
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` to toggle device toolbar
3. Select a mobile device (iPhone 14 Pro, Pixel 7, etc.)
4. Enjoy the mobile experience!

### Test on Your Phone:
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone
http://YOUR_IP:5173
```

### Key Mobile Features:
- ✅ Pull down to refresh
- ✅ Tap bottom nav (haptic feedback!)
- ✅ Swipe through cards
- ✅ No horizontal scrolling
- ✅ Safe area support
- ✅ Touch-friendly everything

## 🚀 Recent Updates

### Mobile-First UI Redesign (Latest)
- ✨ Complete mobile-first redesign
- 📱 Touch-friendly controls throughout
- 🗂️ Card layouts instead of tables on mobile
- 🔄 Pull-to-refresh on all pages
- 📲 Enhanced bottom navigation
- 🎯 44px minimum touch targets
- 📐 Safe area support for notched devices
- ⚡ Improved performance and animations
- 🎨 Premium mobile app feel


# Neural Inventory Protocol (IMS)

## Overview

Neural Inventory Protocol is an advanced Inventory Management System (IMS) engineered with the MERN stack (MongoDB, Express.js, React.js, Node.js). It facilitates real-time asset tracking, order processing, and user hierarchy management through a secure, high-performance interface. The system features a "Premium Cyber" aesthetic with glassmorphic UI elements and neural network-inspired visuals.

## Key Features

- **Role-Based Access Control**:
  - **Admin**: Full system control with analytics dashboard and user management.
  - **Manager**: Stock oversight, order verification, and logistics protocols.
  - **Sales**: Commission tracking and order initiation.
  - **User**: Product browsing, shopping cart, and order history.

- **Advanced Security**:
  - JWT Authentication protocols.
  - Admin Secret Key verification for elevated access.
  - Secure bcrypt hashing for passwords and OTPs.

- **Mobile-First Experience**:
  - Responsive, touch-optimized interface.
  - Haptic feedback simulations and fluid animations.
  - Card-based mobile layouts ensuring zero horizontal overflow.

- **Real-Time Analytics**:
  - Live stock depletion alerts.
  - Transaction history logging with automated receipts.
  - Commission and revenue tracking charts.

## Technology Stack

- **Frontend**: React.js (Vite), TailwindCSS, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Utilities**: Axios, bcryptjs, jsonwebtoken.

## Architecture & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Instance (Local or Atlas)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/22230902mani/Inventory-Management-System.git
   cd Inventory-Management-System
   ```

2. **Backend Configuration**
   ```bash
   cd backend
   npm install
   # Create a .env file with your mongoURI and JWT_SECRET
   npm start
   # Server initializes on Port 6700
   ```

3. **Frontend Initialization**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Client accessible via Port 6800 (or default Vite port)
   ```

## Usage Protocols

1. **Authentication**: Users must register and log in. Admins require a specific secret key.
2. **Inventory**: items are tracked in real-time. Falling below the threshold (20 units) triggers low-stock alerts.
3. **Orders**: Users place orders -> Admin/Manager verifies payment -> OTP generated -> Delivery confirmed.
4. **Transactions**: All financial movements are logged in an immutable ledger viewable by authorized personnel.

---
*System maintained by Neural Systems Admin.*

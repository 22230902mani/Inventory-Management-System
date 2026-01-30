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
- **Roles**: Admin (Secret Key Required), Manager (Requires Approval), Sales (Requires Approval), User (Auto-verified).
- **Security**: JWT, Admin Secret Verification, Admin Approval Workflow.
- **Chatbot**: Integrated AI assistant for inventory queries.
- **Dashboards**:
  - Admin: Stats, User Management, Activity Logs.
  - Manager: Stock Management, Orders.
  - User: Product View, Order History.

## Project Structure
- `backend/`: Node/Express Server, Models, Controllers.
- `frontend/`: React Vite App, Components, Pages.

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/UserDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import LandingPage from './pages/LandingPage';

import Users from './pages/Users';
import Reports from './pages/Reports';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import ForgotPassword from './pages/ForgotPassword';
import VerifyReset from './pages/VerifyReset';
import ResetPassword from './pages/ResetPassword';
import SalesMessages from './pages/SalesMessages';
import ManagerMessages from './pages/ManagerMessages';
import AdminComms from './pages/AdminComms';
import SalesComms from './pages/SalesComms';

const DashboardLayout = () => {
    const { user } = useAuth();
    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans">
            <Sidebar role={user.role} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                    <Outlet />
                </main>
                <Chatbot />
            </div>
        </div>
    );
};

function App() {
    const { user, loading } = useAuth();
    console.log("App Render - User:", user, "Loading:", loading);

    if (loading) return (
        <div className="flex items-center justify-center h-screen w-screen bg-[#161616] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse text-sm font-bold tracking-widest uppercase">Initializing Core...</p>
            </div>
        </div>
    );

    return (
        <Routes>
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset" element={<VerifyReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />


            <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
                <Route index element={
                    user?.role === 'admin' ? <AdminDashboard /> :
                        user?.role === 'manager' ? <ManagerDashboard /> :
                            user?.role === 'sales' ? <SalesDashboard /> :
                                <UserDashboard />
                } />

                {/* Protected Routes */}
                <Route path="users" element={user?.role === 'admin' || user?.role === 'manager' ? <Users /> : <Navigate to="/" />} />
                <Route path="reports" element={user?.role === 'admin' ? <Reports /> : <Navigate to="/" />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Inventory />} />
                <Route path="sales-messages" element={user?.role === 'admin' ? <SalesMessages /> : <Navigate to="/" />} />
                <Route path="manager-messages" element={user?.role === 'admin' ? <ManagerMessages /> : <Navigate to="/" />} />
                <Route path="admin-comms" element={user?.role === 'manager' ? <AdminComms /> : <Navigate to="/" />} />
                <Route path="sales-comms" element={user?.role === 'sales' ? <SalesComms /> : <Navigate to="/" />} />

            </Route>
        </Routes>
    );
}

export default App;

import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
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
import FeatureDetails from './pages/FeatureDetails';
import AboutPage from './pages/AboutPage';
import InfoPages from './pages/InfoPages';

import Users from './pages/Users';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import ForgotPassword from './pages/ForgotPassword';
import SalesMessages from './pages/SalesMessages';
import ManagerMessages from './pages/ManagerMessages';
import AdminComms from './pages/AdminComms';
import SalesComms from './pages/SalesComms';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';
import Platform from './pages/Platform';
import Intelligence from './pages/Intelligence';
import PrivacyProtocol from './pages/PrivacyProtocol';
import NeuralTerms from './pages/NeuralTerms';
import HubSupport from './pages/HubSupport';
import TechnicalDocs from './pages/TechnicalDocs';
import NeuralChatInfo from './pages/NeuralChatInfo';
import CoreStatusInfo from './pages/CoreStatusInfo';

import BottomNav from './components/BottomNav';

const DashboardLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const isChatPage = location.pathname.includes('comms') || location.pathname.includes('messages');
    return (
        <div className="flex h-[100dvh] w-full font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
            {/* Desktop Sidebar - Slim Version */}
            <div className="hidden lg:flex shrink-0">
                <Sidebar role={user.role} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                <Header user={user} />

                <main className={`flex-1 bg-[var(--bg-primary)] relative ${isChatPage ? 'flex flex-col overflow-hidden p-0' : 'block overflow-y-auto custom-scrollbar px-4 sm:px-8 lg:px-10 pb-32 lg:pb-10'}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className={`w-full ${isChatPage ? 'h-full flex-1' : 'min-h-full py-6 sm:py-8'}`}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                {!isChatPage && <Chatbot />}

                {/* Mobile Bottom Navigation */}
                <BottomNav role={user.role} />
            </div>
        </div>
    );
};

function App() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="flex items-center justify-center h-screen w-screen bg-[#050507] text-white font-sans relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Multi-layered Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-t-2 border-pink-500 rounded-full animate-spin-slow rotate-45 opacity-50" />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic">
                        Mani<span className="text-blue-500">Sync</span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30 animate-pulse">Initializing Neural Core</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen selection:bg-blue-500/30 overflow-x-hidden">
            <div className="noise-overlay" />

            <Routes location={location}>
                <Route path="/home" element={<Navigate to="/" />} />
                <Route path="/dashboard" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/feature/:featureId" element={<FeatureDetails />} />
                <Route path="/about/:section" element={<AboutPage />} />
                <Route path="/privacy" element={<InfoPages />} />
                <Route path="/terms" element={<InfoPages />} />
                <Route path="/support" element={<InfoPages />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/intelligence" element={<Intelligence />} />
                <Route path="/privacy-protocol" element={<PrivacyProtocol />} />
                <Route path="/neural-terms" element={<NeuralTerms />} />
                <Route path="/hub-support" element={<HubSupport />} />
                <Route path="/tech-docs" element={<TechnicalDocs />} />
                <Route path="/neural-chat-info" element={<NeuralChatInfo />} />
                <Route path="/core-status-info" element={<CoreStatusInfo />} />

                <Route path="/" element={user ? <DashboardLayout /> : <LandingPage />}>
                    <Route index element={
                        user?.role === 'admin' ? <AdminDashboard /> :
                            user?.role === 'manager' ? <ManagerDashboard /> :
                                user?.role === 'sales' ? <SalesDashboard /> :
                                    <UserDashboard />
                    } />

                    {/* Protected Routes */}
                    <Route path="users" element={user?.role === 'admin' || user?.role === 'manager' ? <Users /> : <Navigate to="/" />} />
                    <Route path="reports" element={user?.role === 'admin' ? <Reports /> : <Navigate to="/" />} />
                    <Route path="analytics" element={user?.role === 'admin' || user?.role === 'manager' ? <Analytics /> : <Navigate to="/" />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<Inventory />} />
                    <Route path="sales-messages" element={user?.role === 'admin' ? <SalesMessages /> : <Navigate to="/" />} />
                    <Route path="manager-messages" element={user?.role === 'admin' ? <ManagerMessages /> : <Navigate to="/" />} />
                    <Route path="admin-comms" element={user?.role === 'manager' ? <AdminComms /> : <Navigate to="/" />} />
                    <Route path="sales-comms" element={user?.role === 'sales' ? <SalesComms /> : <Navigate to="/" />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="transactions" element={<TransactionHistory />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

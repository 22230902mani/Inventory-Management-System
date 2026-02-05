import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Boxes,
    ShoppingCart,
    MessageSquare,
    Bell,
    User,
    History,
    FileText,
    Database,
    TrendingUp,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ role }) => {
    const navItems = [
        { to: "/", label: "Core", icon: <LayoutDashboard size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/products", label: "Assets", icon: <Boxes size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/transactions", label: "Logs", icon: <History size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/analytics", label: "Intel", icon: <FileText size={22} />, roles: ['admin', 'manager'] },
        { to: "/users", label: "Ops", icon: <Users size={22} />, roles: ['admin'] },
        // For sales/manager, message hub is important
        ...(role === 'sales' ? [{ to: "/sales-comms", label: "Comms", icon: <MessageSquare size={22} />, roles: ['sales'] }] : []),
        ...(role === 'manager' ? [{ to: "/admin-comms", label: "Comms", icon: <MessageSquare size={22} />, roles: ['manager'] }] : []),
        ...(role === 'admin' ? [
            { to: "/manager-messages", label: "Mgrs", icon: <Database size={22} />, roles: ['admin'] },
            { to: "/sales-messages", label: "Sales", icon: <TrendingUp size={22} />, roles: ['admin'] }
        ] : []),
        { to: "/profile", label: "User", icon: <User size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
    ];

    // Haptic feedback simulation (works on supported devices)
    const handleTap = () => {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden safe-area-bottom">
            {/* Backdrop gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pointer-events-none" />

            <nav className="relative mx-auto max-w-screen-sm h-16 bg-white/90 dark:bg-[#0a0c18]/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 flex items-center justify-around px-2 shadow-xl dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                {/* Background texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                </div>

                {navItems.filter(item => item.roles.includes(role)).map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={handleTap}
                        className={({ isActive }) => `
                            relative flex flex-col items-center justify-center w-14 touch-target gap-0.5 transition-all duration-300 rounded-2xl
                            ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/40'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <motion.div
                                    animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative z-10"
                                >
                                    {isActive ? React.cloneElement(item.icon, { className: "text-brand-blue drop-shadow-[0_0_8px_#3b82f6]" }) : item.icon}
                                </motion.div>

                                <span className={`text-[9px] font-black uppercase tracking-tight z-10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.label}
                                </span>


                            </>
                        )}
                    </NavLink>
                ))}
            </nav >
        </div >
    );
};

export default BottomNav;


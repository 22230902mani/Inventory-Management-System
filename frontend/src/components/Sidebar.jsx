import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    LayoutDashboard,
    Users,
    FileText,
    Package,
    ShoppingCart,
    LogOut,
    Cpu,
    Boxes,
    Activity,
    MessageSquare,
    History,
    Database,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role }) => {
    const { logout } = useAuth();

    const navItems = [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/products", label: "Inventory", icon: <Boxes size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/orders", label: "Acquisitions", icon: <ShoppingCart size={22} />, roles: ['admin', 'manager', 'user'] },
        { to: "/transactions", label: "Transactions", icon: <History size={22} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/users", label: "Operatives", icon: <Users size={22} />, roles: ['admin'] },
        { to: "/analytics", label: "Intel", icon: <FileText size={22} />, roles: ['admin', 'manager'] },
        { to: "/sales-comms", label: "Comms", icon: <MessageSquare size={22} />, roles: ['sales'] },
        { to: "/admin-comms", label: "Comms", icon: <MessageSquare size={22} />, roles: ['manager'] },
        { to: "/manager-messages", label: "Managers", icon: <Database size={22} />, roles: ['admin'] },
        { to: "/sales-messages", label: "Sales", icon: <TrendingUp size={22} />, roles: ['admin'] },
    ];

    return (
        <aside className="w-24 lg:w-28 bg-[var(--bg-secondary)] flex flex-col h-screen relative z-50 border-r border-[var(--card-border)] transition-all duration-500">
            <div className="py-10 flex flex-col items-center gap-12 h-full">
                {/* Brand Logo */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f472b6] to-[#a78bfa] flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,114,182,0.3)] cursor-pointer hover:scale-110 transition-transform">
                    <Cpu size={24} />
                </div>

                {/* Primary Nav */}
                <nav className="flex-1 w-full flex flex-col items-center gap-6">
                    {navItems.filter(item => item.roles.includes(role)).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            title={item.label}
                            className={({ isActive }) => `
                                relative group flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300
                                ${isActive
                                    ? 'bg-[var(--btn-secondary-bg)] text-[var(--text-primary)] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="relative z-10">{item.icon}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 rounded-2xl -z-0"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {/* Tooltip on hover */}
                                    <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col items-center gap-6 mb-4 w-full">
                    <button
                        onClick={logout}
                        title="Logout"
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </aside>
    );
};


export default Sidebar;

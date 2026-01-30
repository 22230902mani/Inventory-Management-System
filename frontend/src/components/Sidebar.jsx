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
    MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role }) => {
    const { logout } = useAuth();
    // Removed mini-feed logic as per user request to move to separate page

    const navItems = [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager', 'sales', 'user'] },

        // Message Hub (Dynamic based on role)
        { to: "/sales-messages", label: "Message Hub", icon: <MessageSquare size={20} />, roles: ['admin'] }, // Admin -> Sales
        { to: "/admin-comms", label: "Message Hub", icon: <MessageSquare size={20} />, roles: ['manager'] },  // Manager -> Admin
        { to: "/sales-comms", label: "Message Hub", icon: <MessageSquare size={20} />, roles: ['sales'] },    // Sales -> Admin

        // Secondary / Specific Links
        { to: "/manager-messages", label: "Manager Network", icon: <Users size={20} />, roles: ['admin'] },
        { to: "/products", label: "Inventory", icon: <Boxes size={20} />, roles: ['admin', 'manager', 'sales', 'user'] },
        { to: "/orders", label: "Acquisitions", icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'user'] },
        { to: "/users", label: "Operatives", icon: <Users size={20} />, roles: ['admin'] },
        { to: "/reports", label: "Intel Reports", icon: <FileText size={20} />, roles: ['admin', 'manager'] },
    ];

    return (
        <aside className="w-72 bg-[var(--bg-secondary)] border-r border-[var(--card-border)] flex flex-col h-screen h-full relative z-50 transition-colors duration-300">
            <div className="p-8 pb-12">
                <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tighter text-[var(--text-primary)]">CORE<span className="text-brand-blue">IMS</span></h2>
                        <span className="text-[9px] font-extrabold tracking-[0.3em] uppercase text-[var(--text-secondary)]">Neural Hub v3.0</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="mb-4 px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={10} />
                    Mission Control
                </div>
                {navItems.filter(item => item.roles.includes(role)).map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-brand-blue/10 text-[var(--text-primary)] border border-brand-blue/20'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`${isActive ? 'text-brand-blue' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-6 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-secondary)] leading-relaxed font-medium">All neural nodes operational. Syncing with central command...</p>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all group font-bold text-sm"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    Terminate Session
                </button>
            </div>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-blue/5 to-transparent pointer-events-none -z-10" />
        </aside>
    );
};

export default Sidebar;

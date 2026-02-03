import React, { useState, useEffect } from 'react';
import { Sun, Moon, Search, Calendar, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralNotifications from './NeuralNotifications';
import axios from 'axios';

const Header = ({ user }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [activeView, setActiveView] = useState('Day');
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const { data } = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(data)) {
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const mainElement = document.querySelector('main');
        const handleScroll = () => {
            if (mainElement) {
                setScrolled(mainElement.scrollTop > 40);
            }
        };

        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
        }

        const interval = setInterval(fetchUnreadCount, 30000);
        return () => {
            clearInterval(interval);
            if (mainElement) {
                mainElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/notifications/read', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleToggleNotifications = () => {
        if (!showNotifications) {
            markAllRead();
        }
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const isChatPage = location.pathname.includes('comms') || location.pathname.includes('messages');
    const showSwitcher = location.pathname === '/analytics';

    return (
        <>
            <header className="flex flex-col bg-[var(--bg-primary)] backdrop-blur-md border-b border-[var(--card-border)] relative z-40 transition-colors duration-300">
                <div className="px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
                    {/* Left Section: Logo & Breadcrumb */}
                    <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
                        <div
                            onClick={() => navigate('/')}
                            className="flex lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center font-black text-white cursor-pointer shadow-lg shadow-blue-500/20"
                        >
                            M
                        </div>
                        <div className="hidden lg:flex flex-col">
                            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic leading-none mb-1">
                                Mani <span className="text-blue-400">Hub</span>
                            </h2>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Management / {location.pathname.substring(1) || 'Core'}</p>
                        </div>

                        {/* Search - Visible only on Desktop/Tablet */}
                        <div className="hidden sm:flex relative group w-48 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-blue-400 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search data..."
                                className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-[var(--text-secondary)]"
                            />
                        </div>
                    </div>

                    {/* Middle Section: View Switcher (Desktop Only) */}
                    {showSwitcher && (
                        <div className="hidden xl:flex items-center bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--card-border)] shadow-inner">
                            <div className="flex items-center gap-2 px-4 py-1.5 border-r border-[var(--card-border)] text-[var(--text-secondary)]">
                                <Calendar size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{formattedDate}</span>
                            </div>
                            <div className="flex gap-1 px-2">
                                {['Day', 'Week', 'Month'].map(view => (
                                    <button
                                        key={view}
                                        onClick={() => setActiveView(view)}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === view ? 'bg-[var(--btn-secondary-bg)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        {view}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Right Section: Actions & Profile */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        <div className="flex items-center gap-2">
                            {/* Desktop Search Toggle (Hidden on XL where date is shown) */}
                            <div className="hidden lg:flex xl:hidden relative group w-48">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-[var(--text-primary)] focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="p-2.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-sm"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            <button
                                onClick={handleToggleNotifications}
                                className={`flex p-2.5 rounded-2xl border transition-all shadow-sm relative ${showNotifications ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-[var(--bg-secondary)] border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border border-[var(--bg-primary)] animate-pulse" />
                                )}
                            </button>
                        </div>

                        <div
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-3 sm:pl-6 sm:border-l sm:border-slate-200 dark:border-white/10 cursor-pointer group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-[var(--text-primary)] group-hover:text-blue-400 transition-colors uppercase tracking-tight">{user.name}</p>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">{user.role}</p>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border-2 border-[var(--card-border)] p-[2.5px] bg-gradient-to-br from-blue-400 to-indigo-500 group-hover:scale-105 transition-transform">
                                    <div className="w-full h-full rounded-[14px] bg-[var(--bg-secondary)] flex items-center justify-center text-sm font-black text-[var(--text-primary)]">
                                        {user.name[0]}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] flex items-center justify-center">
                                    <ChevronDown size={10} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Sub-Header Row */}
                <AnimatePresence>
                    {showSwitcher && !scrolled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="xl:hidden px-4 pb-4 overflow-hidden"
                        >
                            <div className="flex items-center bg-[var(--bg-secondary)] rounded-2xl p-1.5 border border-[var(--card-border)] shadow-inner">
                                <div className="flex items-center gap-2 px-3 h-8 border-r border-[var(--card-border)] text-[var(--text-secondary)] shrink-0 min-w-[100px]">
                                    <Calendar size={12} className="text-blue-400" />
                                    <span className="text-[9px] font-black uppercase tracking-tight">{formattedDate}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 px-1 flex-1">
                                    {['Day', 'Week', 'Month'].map(view => (
                                        <button
                                            key={view}
                                            onClick={() => setActiveView(view)}
                                            className={`h-8 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all flex items-center justify-center ${activeView === view ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-md border border-[var(--card-border)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Notification Sidebar Overlay */}
            <AnimatePresence>
                {showNotifications && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNotifications(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[var(--bg-primary)] border-l border-[var(--card-border)] z-[9999] flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-transparent">
                                <div className="flex items-center gap-3">
                                    <Bell className="text-blue-400" size={20} />
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Neural Center</h3>
                                </div>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-[var(--text-secondary)]"
                                >
                                    <ChevronDown className="rotate-90" size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                <NeuralNotifications />
                            </div>

                            <div className="p-6 border-t border-[var(--card-border)] bg-[var(--bg-secondary)]/50">
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-center">
                                    End of secure transmission buffer
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>

    );
};


export default Header;

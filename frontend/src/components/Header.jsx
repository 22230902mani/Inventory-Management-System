import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, ShieldCheck, User, LogOut, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, title = "System Ready", subtitle = "CoreIMS Neural Management Hub" }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleNotificationClick = () => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById('neural-feed')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            document.getElementById('neural-feed')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="px-8 pt-8 pb-4 flex items-end justify-between">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-1"
            >
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-brand-blue" />
                    <h1 className="text-4xl font-extrabold tracking-widest uppercase text-[var(--text-primary)]">
                        {title}
                    </h1>
                </div>
                <p className="text-[var(--text-secondary)] font-medium tracking-[0.3em] text-[10px] uppercase ml-11">
                    {subtitle}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6"
            >
                {/* System State Badge */}
                <div className="hidden md:flex flex-col items-end px-4 border-r border-[var(--card-border)]">
                    <span className="text-[9px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">Encryption Status</span>
                    <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Level-03 Protocol Active
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--btn-secondary-bg)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <button
                        onClick={handleNotificationClick}
                        className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--btn-secondary-bg)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] relative"
                    >
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-brand-pink rounded-full border-2 border-[var(--bg-primary)]" />
                    </button>

                    <div className="h-10 w-px bg-[var(--card-border)] mx-2" />

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-[var(--text-primary)] tracking-wide">{user.name}</p>
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-pink p-[1px]">
                            <div className="w-full h-full rounded-[11px] bg-[var(--bg-primary)] flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">
                                {user.name[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </header>
    );
};

export default Header;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    MessageSquare,
    Clock,
    CheckCircle2,
    Info,
    AlertCircle,
    ChevronDown,
    User
} from 'lucide-react';
import NeuralCard from './ui/NeuralCard';
import NeuralBadge from './ui/NeuralBadge';

const NeuralNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:6700/api/dashboard/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    const sendTestSignal = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:6700/api/dashboard/test-notification', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Test signal failed:', error);
        }
    };

    if (loading) return (
        <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                        <Bell className="text-brand-blue" size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)] tracking-tight uppercase text-sm italic">Neural Feed</h4>
                        <p className="text-[10px] font-extrabold text-[var(--text-secondary)] tracking-[0.2em] uppercase">Incoming Directives</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={sendTestSignal}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-lg hover:bg-brand-blue/20 transition-colors"
                    >
                        Test Signal
                    </button>
                    <NeuralBadge variant={notifications.length > 0 ? 'success' : 'pending'}>
                        {notifications.length} Active Signal{notifications.length !== 1 ? 's' : ''}
                    </NeuralBadge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {notifications.length > 0 ? notifications.map((notif, idx) => (
                        <motion.div
                            key={notif._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <NeuralCard
                                className={`p-0 overflow-hidden border-[var(--card-border)] transition-all duration-300 ${expandedId === notif._id ? 'border-brand-blue/30 bg-[var(--card-bg)] shadow-brand-blue/20 shadow-lg' : 'bg-[var(--card-bg)] hover:bg-opacity-80'}`}
                                variant="default"
                            >
                                <div
                                    className="p-5 cursor-pointer flex items-center gap-4"
                                    onClick={() => setExpandedId(expandedId === notif._id ? null : notif._id)}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                        <MessageSquare size={18} className={expandedId === notif._id ? 'text-brand-blue' : 'text-white/40'} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h5 className="font-bold text-sm text-[var(--text-primary)] truncate pr-4 uppercase tracking-wide">
                                                {notif.title}
                                            </h5>
                                            <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                                                <Clock size={10} />
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--btn-secondary-bg)] rounded-md border border-[var(--card-border)]">
                                                <User size={10} className="text-[var(--text-secondary)]" />
                                                <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest leading-none">
                                                    {notif.from?.name || 'Central Command'}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] italic">
                                                [{notif.from?.role || 'SYSTEM'}]
                                            </span>
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: expandedId === notif._id ? 180 : 0 }}
                                        className="text-[var(--text-secondary)]"
                                    >
                                        <ChevronDown size={16} />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === notif._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        >
                                            <div className="px-5 pb-5 pt-0">
                                                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--card-border)] text-sm text-[var(--text-primary)] leading-relaxed font-medium">
                                                    {notif.message}
                                                    <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex justify-end">
                                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Signal Verified // Secure Link</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </NeuralCard>
                        </motion.div>
                    )) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center space-y-4 rounded-3xl border-2 border-dashed border-[var(--card-border)]"
                        >
                            <div className="w-16 h-16 bg-[var(--card-bg)] rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Bell size={32} className="text-[var(--text-secondary)]" />
                            </div>
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.4em]">Zero incoming signals detected</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NeuralNotifications;

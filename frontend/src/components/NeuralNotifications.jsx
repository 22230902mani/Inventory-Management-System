import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, LayoutPanelTop, Activity, Zap } from 'lucide-react';
import config from '../config';

const NeuralNotifications = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    token = JSON.parse(userInfo).token;
                }
            }

            if (!token) {
                console.log('NeuralNotifications: No token found');
                setLoading(false);
                return;
            }

            const response = await fetch(`${config.API_BASE_URL}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                const formattedEvents = data.map(notif => ({
                    id: notif._id,
                    type: notif.title.toLowerCase().includes('approved') || notif.title.toLowerCase().includes('verified') ? 'success' :
                        notif.title.toLowerCase().includes('alert') || notif.title.toLowerCase().includes('reject') ? 'danger' : 'info',
                    title: notif.title,
                    desc: notif.message,
                    time: new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setEvents(formattedEvents);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Optionally set items to show error in UI
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Polling every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <LayoutPanelTop className="text-brand-blue" size={24} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-black"></span>
                        </span>
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Live Neural Feed</h4>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--input-bg)] rounded-full border border-[var(--card-border)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Encrypted Stream</span>
                </div>
            </div>

            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="text-center py-8 text-[var(--text-secondary)] animate-pulse">
                            Initializing Neural Stream...
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-secondary)] font-medium text-sm">
                            No active signals in neural buffer.
                        </div>
                    ) : (
                        events.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                layout
                                className={`group relative p-4 rounded-2xl border transition-all ${event.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                                    event.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' :
                                        event.type === 'danger' ? 'bg-rose-500/5 border-rose-500/10' :
                                            'bg-brand-blue/5 border-brand-blue/10'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 p-2 rounded-xl border ${event.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' :
                                        event.type === 'warning' ? 'bg-amber-500/20 border-amber-500/20 text-amber-400' :
                                            event.type === 'danger' ? 'bg-rose-500/20 border-rose-500/20 text-rose-400' :
                                                'bg-brand-white/10 border-white/20 text-brand-blue'
                                        }`}>
                                        {event.type === 'success' ? <CheckCircle2 size={16} /> :
                                            event.type === 'warning' ? <AlertCircle size={16} /> :
                                                event.type === 'danger' ? <Activity size={16} /> :
                                                    <Clock size={16} />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-bold text-sm tracking-tight text-[var(--text-primary)]">{event.title}</h5>
                                            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-60">{event.time}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{event.desc}</p>
                                    </div>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${event.type === 'success' ? 'bg-emerald-500' : 'bg-brand-blue'
                                        }`} />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] space-y-1">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Live Traffic</p>
                    <div className="flex items-end gap-2">
                        <TrendingUp className="text-emerald-400 mb-1" size={16} />
                        <span className="text-xl font-black italic text-[var(--text-primary)]">1,402</span>
                        <span className="text-[10px] text-emerald-400 font-bold ml-1 mb-1">+12%</span>
                    </div>
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] space-y-1">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Signal Latency</p>
                    <div className="flex items-end gap-2">
                        <TrendingDown className="text-blue-400 mb-1" size={16} />
                        <span className="text-xl font-black italic text-[var(--text-primary)]">24<span className="text-[var(--text-secondary)] text-xs italic opacity-40">ms</span></span>
                        <span className="text-[10px] text-blue-400 font-bold ml-1 mb-1">-4ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralNotifications;

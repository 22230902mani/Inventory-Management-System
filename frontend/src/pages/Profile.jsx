import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Shield, ShieldCheck,
    Settings, LogOut, Key, Fingerprint,
    Cpu, Globe, Zap, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralButton from '../components/ui/NeuralButton';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('identity');

    const statusLevels = [
        { label: 'Neural Sync', value: 94, color: 'bg-brand-blue' },
        { label: 'Security Clearance', value: 100, color: 'bg-emerald-500' },
        { label: 'Data Hub Access', value: 78, color: 'bg-pink-500' }
    ];

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 mt-10 sm:p-4">
            {/* Top Identity Segment */}
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Left: Tactical Card */}
                <NeuralCard className="w-full lg:w-[400px] p-0 overflow-hidden border-white/5 shadow-2xl group" gradient="blue">
                    <div className="relative h-64 bg-[#0a0f1a] overflow-hidden">
                        {/* Animated Neural Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 via-transparent to-brand-pink/20" />
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                        {/* Decorative HUD Rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-brand-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-brand-pink/20 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative"
                            >
                                {/* Scanner Line Overlay */}
                                <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden z-20 pointer-events-none">
                                    <motion.div
                                        animate={{ y: [-130, 130] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="h-1 w-full bg-brand-blue/40 blur-sm"
                                    />
                                </div>

                                <div className="w-32 h-32 rounded-3xl bg-black/80 backdrop-blur-xl border-4 border-white/10 flex items-center justify-center text-4xl font-black text-white relative z-10 shadow-[0_0_50px_rgba(91,153,247,0.3)]">
                                    {user.name[0].toUpperCase()}

                                    {/* Identity Pulse Badge */}
                                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-[#0a0f1a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-2xl animate-ping opacity-20" />
                                        <ShieldCheck className="text-black relative z-10" size={24} />
                                    </div>
                                </div>

                                {/* Orbiting Data Nodes */}
                                <div className="absolute -top-4 -left-4 w-4 h-4 bg-brand-blue rounded-full border-2 border-black animate-bounce" />
                                <div className="absolute -bottom-4 -right-20 w-[120px] h-[1px] bg-gradient-to-r from-brand-pink/50 to-transparent" />
                            </motion.div>
                        </div>

                        {/* Tactical Corner Info */}
                        <div className="absolute top-6 left-6 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Neural Link: Secure</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-10 text-center space-y-8 bg-[var(--card-bg)] backdrop-blur-3xl relative overflow-hidden transition-colors duration-500">
                        {/* Decorative background mesh for light mode pop */}
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-50 pointer-events-none" />

                        <div className="space-y-2 relative z-10">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-secondary)]/20 to-transparent" />
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[var(--text-primary)] drop-shadow-sm">{user.name}</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--card-border)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Designation: {user.role}</p>
                            </div>
                        </div>

                        <div className="flex justify-center flex-wrap gap-3 z-10 relative">
                            {[
                                { label: 'Class A', color: 'text-brand-blue border-brand-blue/20 bg-brand-blue/5' },
                                { label: 'Verified', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' },
                                { label: 'Secure', color: 'text-brand-pink border-brand-pink/20 bg-brand-pink/5' }
                            ].map(tag => (
                                <motion.span
                                    whileHover={{ y: -2 }}
                                    key={tag.label}
                                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md cursor-default transition-all ${tag.color}`}
                                >
                                    {tag.label}
                                </motion.span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 z-10 relative">
                            <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] shadow-sm group hover:border-brand-blue/30 transition-all flex flex-col items-center gap-2">
                                <div className="p-2 rounded-full bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <Activity size={16} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-80">System Status</p>
                                    <p className="text-sm font-black text-[var(--text-primary)] italic">Neural Active</p>
                                </div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] shadow-sm group hover:border-brand-pink/30 transition-all flex flex-col items-center gap-2">
                                <div className="p-2 rounded-full bg-brand-pink/10 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                    <Globe size={16} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-80">Network</p>
                                    <p className="text-sm font-black text-[var(--text-primary)] italic">Main Grid</p>
                                </div>
                            </motion.div>
                        </div>

                        <NeuralButton onClick={logout} className="w-full h-14 bg-[var(--card-bg)] border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-lg shadow-rose-500/5 group/btn relative overflow-hidden z-10">
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <LogOut size={18} className="translate-x-0 group-hover/btn:-translate-x-1 transition-transform" />
                                <span className="font-black italic tracking-widest text-xs">TERMINATE PROTOCOL</span>
                            </div>
                        </NeuralButton>
                    </div>
                </NeuralCard>

                {/* Right: Detailed HUD */}
                <div className="flex-1 space-y-8 w-full">
                    {/* Navigation HUD */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--input-bg)] -mx-4 sm:mx-0 rounded-none sm:rounded-2xl border-x-0 sm:border-x border-y border-[var(--card-border)] w-[calc(100%+2rem)] sm:w-fit sm:flex sm:gap-4 sm:p-2 overflow-hidden">
                        {['identity', 'protocols', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-1 sm:px-6 py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'identity' && (
                            <motion.div
                                key="identity"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <NeuralCard className="bg-[var(--card-bg)] border-[var(--card-border)]">
                                    <h4 className="text-lg font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 text-[var(--text-primary)]">
                                        <Fingerprint className="text-brand-blue" /> Identification Bio-Data
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <User size={12} /> Legal Alias
                                            </label>
                                            <p className="text-lg font-bold text-[var(--text-primary)] bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--card-border)] uppercase tracking-tight">{user.name}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Mail size={12} /> Communication Node
                                            </label>
                                            <p className="text-sm font-bold text-[var(--text-primary)] bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--card-border)] lowercase tracking-tight break-all">{user.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Shield size={12} /> Access Protocol
                                            </label>
                                            <div className="flex items-center gap-3 bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--card-border)]">
                                                <span className="text-lg font-black text-brand-blue uppercase italic tracking-tighter">{user.role}</span>
                                                <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-black rounded border border-brand-blue/20">LEVEL 4</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Key size={12} /> Encryption Key
                                            </label>
                                            <p className="text-lg font-mono font-bold text-[var(--text-secondary)] bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--card-border)] italic">SHA-128 Enabled</p>
                                        </div>
                                    </div>
                                </NeuralCard>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <NeuralCard className="p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-[var(--card-border)]">
                                        <Cpu className="text-indigo-400 mb-4" />
                                        <h5 className="font-black italic text-sm uppercase text-[var(--text-primary)]">Neural Engine</h5>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mt-1">Uptime: 242:12:04</p>
                                    </NeuralCard>
                                    <NeuralCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-[var(--card-border)]">
                                        <Globe className="text-emerald-400 mb-4" />
                                        <h5 className="font-black italic text-sm uppercase text-[var(--text-primary)]">Global Ledger</h5>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mt-1">Verified Nodes: 14</p>
                                    </NeuralCard>
                                    <NeuralCard className="p-6 bg-gradient-to-br from-pink-500/10 to-transparent border-[var(--card-border)]">
                                        <Zap className="text-pink-400 mb-4" />
                                        <h5 className="font-black italic text-sm uppercase text-[var(--text-primary)]">Sync Latency</h5>
                                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mt-1">Status: 12ms</p>
                                    </NeuralCard>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'protocols' && (
                            <motion.div
                                key="protocols"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <NeuralCard className="bg-[var(--card-bg)] border-[var(--card-border)]">
                                    <h4 className="text-lg font-black uppercase italic tracking-tighter mb-10 flex items-center gap-3 text-[var(--text-primary)]">
                                        <Settings className="text-brand-pink" /> System Permission Sync
                                    </h4>
                                    <div className="space-y-8">
                                        {statusLevels.map((s, idx) => (
                                            <div key={idx} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">{s.label}</span>
                                                    <span className="text-sm font-black italic text-[var(--text-primary)]">{s.value}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--card-border)] p-0.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${s.value}%` }}
                                                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                                                        className={`h-full ${s.color} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-12 p-6 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-3xl flex items-start gap-5">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                                            <ShieldCheck />
                                        </div>
                                        <div>
                                            <h5 className="font-black italic uppercase text-sm text-[var(--text-primary)]">Integrity Shield Active</h5>
                                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">Your account is fortified with neural fingerprinting and multi-node validation protocols.</p>
                                        </div>
                                    </div>
                                </NeuralCard>
                            </motion.div>
                        )}

                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <NeuralCard className="bg-[var(--card-bg)] border-[var(--card-border)]">
                                    <h4 className="text-lg font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3 text-[var(--text-primary)]">
                                        <Activity className="text-brand-blue" /> Operational History
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'Protocol Sync', time: '2 mins ago', status: 'Finalized' },
                                            { action: 'Node Handshake', time: '1 hour ago', status: 'Verified' },
                                            { action: 'Data Manifest Export', time: '5 hours ago', status: 'Completed' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)]">
                                                <div>
                                                    <p className="font-bold text-[var(--text-primary)] text-sm">{item.action}</p>
                                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">{item.time}</p>
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </NeuralCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;

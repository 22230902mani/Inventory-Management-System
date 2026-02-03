import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, ArrowLeft, ChevronRight, Activity } from 'lucide-react';

const VerifyReset = () => {
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:6700/api/auth/verify-reset-code', { email, otp });
            setMsg('Protocol Verified');
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp } });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'CRITICAL_NODE_ERROR: Invalid Signal Code');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050507] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-500">
            {/* Premium Navigation Header */}
            <nav className="fixed top-0 inset-x-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl group-hover:border-emerald-500/50 transition-colors" />
                        <span className="relative text-xl font-black text-white italic tracking-tighter">M</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 group-hover:text-emerald-500 transition-colors">Smart</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">IMS</p>
                    </div>
                </Link>
            </nav>

            {/* Neural Background Ambiance */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-[280px] lg:max-w-[400px] relative z-10 pt-24 lg:pt-0"
            >
                {/* Premium Glass Container */}
                <div className="bg-white/80 dark:bg-white/[0.05] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[28px] lg:rounded-[40px] p-6 lg:p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6 lg:mb-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 lg:gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Verification Pending</span>
                            </div>
                            <h2 className="text-xl lg:text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                                Verify<br /><span className="text-emerald-600 dark:text-emerald-500/80">Account</span>
                            </h2>
                        </div>
                        <div className="p-2.5 lg:p-3 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl">
                            <Fingerprint className="text-white/20" size={18} lg={26} />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {(error || msg) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className={`p-3 border rounded-xl flex items-center gap-3 ${msg ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                    }`}>
                                    <Activity size={14} />
                                    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-widest leading-tight">
                                        {msg || error}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                        <div className="space-y-4">
                            <p className="px-1 text-[8px] lg:text-[10px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest text-center leading-relaxed">
                                Code sent to <span className="text-emerald-500">{email}</span>.<br />Enter 6-digit verification code.
                            </p>

                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    maxLength={6}
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl py-4 lg:py-5 text-center text-xl lg:text-3xl font-black tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-emerald-500 transition-all placeholder:text-slate-300 dark:placeholder:text-white/5 placeholder:tracking-normal font-mono"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full group relative py-3 lg:py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.3)] dark:hover:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-center gap-2">
                                    {loading ? 'Verifying...' : (
                                        <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                                            Verify Account <ShieldCheck size={16} lg={20} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 lg:mt-10 pt-6 border-t border-white/5 flex justify-center">
                        <Link to="/login" className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-all">
                            <ArrowLeft size={12} /> Cancel Recovery
                        </Link>
                    </div>
                </div>

                {/* Aesthetic Detail */}
                <div className="mt-8 text-center">
                    <p className="text-[7px] font-medium uppercase tracking-[1em] text-white/5">Handshake.v2.Neural.Sync</p>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyReset;

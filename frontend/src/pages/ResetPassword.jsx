import React, { useState } from 'react';
import config from '../config';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, ChevronRight, Activity, RefreshCw } from 'lucide-react';

const ResetPassword = () => {
    const location = useLocation();
    const [email] = useState(location.state?.email || '');
    const [otp] = useState(location.state?.otp || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('CRITICAL_ERROR: Access Keys do not match');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${config.API_BASE_URL}/api/auth/reset-password`, {
                email,
                otp,
                newPassword
            });
            setMsg('Identity Re-secured Successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'CRITICAL_PROTOCOL_FAILURE: Override Protocol Failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050507] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-500">
            {/* Premium Navigation Header */}
            <nav className="fixed top-0 inset-x-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600 to-pink-600 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl group-hover:border-rose-500/50 transition-colors" />
                        <span className="relative text-xl font-black text-white italic tracking-tighter">M</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 group-hover:text-rose-400 transition-colors">Smart</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">IMS</p>
                    </div>
                </Link>
            </nav>

            {/* Neural Background Ambiance */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
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
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Identity Security</span>
                            </div>
                            <h2 className="text-xl lg:text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                                Reset<br /><span className="text-rose-600 dark:text-rose-500/80">Password</span>
                            </h2>
                        </div>
                        <div className="p-2.5 lg:p-3 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl">
                            <RefreshCw className="text-white/20 animate-spin-slow" size={18} lg={26} />
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

                    {!msg && (
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            {/* New Password */}
                            <div className="space-y-1 lg:space-y-1.5">
                                <label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20 group-focus-within:text-rose-400 transition-colors" size={16} lg={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl lg:rounded-2xl py-2.5 lg:py-4 pl-12 lg:pl-14 pr-12 text-[10px] lg:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/10 focus:outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-rose-500 transition-all font-sans"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} lg={18} /> : <Eye size={16} lg={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1 lg:space-y-1.5">
                                <label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20 group-focus-within:text-emerald-400 transition-colors" size={16} lg={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl lg:rounded-2xl py-2.5 lg:py-4 pl-12 lg:pl-14 pr-4 text-[10px] lg:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/10 focus:outline-none focus:bg-white dark:focus:bg-white/[0.05] focus:border-emerald-500 transition-all font-sans"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative py-3 lg:py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_8px_32px_-8px_rgba(225,29,72,0.3)] dark:hover:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-50"
                                >
                                    <div className="absolute inset-0 bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center justify-center gap-2">
                                        {loading ? 'Updating...' : (
                                            <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                                                Update Password <ChevronRight size={16} lg={20} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </form>
                    )}

                    {msg && (
                        <div className="py-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                                <ShieldCheck className="text-emerald-500 scale-125" size={32} />
                            </div>
                            <p className="text-[10px] lg:text-xs font-bold text-white/40 uppercase tracking-widest">
                                Identity Secured. Returning to Access...
                            </p>
                        </div>
                    )}
                </div>

                {/* Aesthetic Detail */}
                <div className="mt-8 text-center">
                    <p className="text-[7px] font-medium uppercase tracking-[1em] text-white/5">Secured.by.Neural.ManiSync</p>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;

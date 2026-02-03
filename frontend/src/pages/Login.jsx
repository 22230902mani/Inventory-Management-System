import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Key, Activity, Shield, ChevronRight, Zap, CheckCircle2, Sun, Moon } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        try {
            const result = await login({ email, password, adminCode });
            if (result.success) {
                setMsg('Access Granted. Redirecting...');
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setMsg(result.message || 'Authentication Failed');
                setLoading(false);
            }
        } catch (err) {
            setMsg('Critical Error: Access Denied');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 font-sans relative overflow-y-auto transition-colors duration-300">
            {/* Premium Gradient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-pink-500/20 via-violet-500/10 to-transparent blur-[150px] rounded-full pointer-events-none" />

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Navigation Header */}
            <nav className="fixed top-0 inset-x-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-purple-500/10">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-purple-500/5 border border-purple-500/20 backdrop-blur-md rounded-xl group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all" />
                        <span className="relative text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">M</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/40 group-hover:text-purple-400 transition-colors">Mammu</p>
                        <p className="text-sm font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">IMS</p>
                    </div>
                </Link>

                <div className="flex items-center gap-3 lg:gap-6">
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-sm"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                    <Link to="/" className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-purple-400/40 hover:text-purple-400 transition-all px-4 py-2 rounded-lg hover:bg-purple-500/5">
                        Home
                    </Link>
                    <Link to="/register" className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                        <div className="relative px-5 py-2.5 rounded-lg border border-purple-500/20 backdrop-blur-md text-[10px] lg:text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all">
                            Sign Up
                        </div>
                    </Link>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10 pt-24 lg:pt-0"
            >
                {/* Premium Glass Container */}
                <div className="relative bg-[var(--card-bg)] backdrop-blur-3xl border border-purple-500/20 rounded-[32px] p-6 lg:p-8 shadow-[0_0_80px_-12px_rgba(139,92,246,0.2)]">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-purple-500/5 via-blue-500/5 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Secure Access</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent leading-none">
                                Login
                            </h2>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                            <Shield className="text-purple-400" size={24} />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {msg && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className={`p-4 border rounded-2xl flex items-center gap-3 ${msg.includes('Granted')
                                    ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                    : "bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.1)]"
                                    }`}>
                                    <Activity size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wide">{msg}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-purple-400/60">Email Address</label>
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/30 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-[var(--input-bg)] border border-purple-500/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-purple-400/20 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-purple-400/60">Password</label>
                                <Link to="/forgot-password" className="text-[9px] font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 uppercase tracking-widest transition-all">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/30 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[var(--input-bg)] border border-purple-500/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-purple-400/20 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all"
                                />
                            </div>
                        </div>

                        {/* Admin Code Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-purple-400/60">Admin Code <span className="text-purple-400/30">(Optional)</span></label>
                            </div>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/30 group-focus-within:text-purple-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={adminCode}
                                    onChange={(e) => setAdminCode(e.target.value)}
                                    placeholder="Enter Code"
                                    className="w-full bg-[var(--input-bg)] border border-purple-500/20 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-purple-400/20 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all text-center tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-center gap-2 text-white">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Authenticating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Zap size={16} className="group-hover:scale-110 transition-transform" />
                                            Login Now
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 flex flex-col gap-3 items-center pt-4 border-t border-purple-500/10">
                        <Link to="/register" className="group flex items-center gap-2 text-sm font-bold text-purple-400/60 hover:text-purple-400 transition-all">
                            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                            <span>Create New Account</span>
                        </Link>
                    </div>
                </div>

                {/* Aesthetic Detail */}
                <div className="mt-6 text-center">
                    <p className="text-[8px] font-medium uppercase tracking-[0.5em] text-purple-400/10">Secured.by.SmartIMS</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

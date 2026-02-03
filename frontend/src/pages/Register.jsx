import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Activity, Shield, ChevronRight, Zap, CheckCircle2, Sparkles, Sun, Moon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();
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

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setMsg('');
        try {
            const result = await register(formData);
            if (result.success) {
                setMsg('Account Created! Redirecting...');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setMsg(result.message || 'Registration Failed');
                setLoading(false);
            }
        } catch (err) {
            setMsg('Critical Error: Registration Failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 font-sans relative overflow-y-auto transition-colors duration-300">
            {/* Premium Gradient Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-bl from-blue-500/20 via-purple-500/10 to-transparent blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-pink-500/20 via-violet-500/10 to-transparent blur-[150px] rounded-full pointer-events-none" />

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Navigation Header */}
            <nav className="fixed top-0 inset-x-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-blue-500/10">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-blue-500/5 border border-blue-500/20 backdrop-blur-md rounded-xl group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all" />
                        <span className="relative text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter">M</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/40 group-hover:text-blue-400 transition-colors">Mammu</p>
                        <p className="text-sm font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-none">IMS</p>
                    </div>
                </Link>

                <div className="flex items-center gap-3 lg:gap-6">
                    <button
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-sm"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                    <Link to="/" className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-blue-400/40 hover:text-blue-400 transition-all px-4 py-2 rounded-lg hover:bg-blue-500/5">
                        Home
                    </Link>
                    <Link to="/login" className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                        <div className="relative px-5 py-2.5 rounded-lg border border-blue-500/20 backdrop-blur-md text-[10px] lg:text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
                            Login
                        </div>
                    </Link>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px] relative z-10 pt-24 lg:pt-0"
            >
                {/* Premium Glass Container */}
                <div className="relative bg-[var(--card-bg)] backdrop-blur-3xl border border-blue-500/20 rounded-[32px] p-6 lg:p-8 shadow-[0_0_80px_-12px_rgba(59,130,246,0.2)]">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">New Account</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
                                Sign Up
                            </h2>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <Shield className="text-blue-400" size={24} />
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
                                <div className={`p-4 border rounded-2xl flex items-center gap-3 ${msg.includes('Created')
                                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                    : "bg-gradient-to-r from-pink-500/10 to-rose-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.1)]"
                                    }`}>
                                    <Activity size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wide">{msg}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Name Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-blue-400/60">Full Name</label>
                                {errors.name && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.name}</span>}
                            </div>
                            <div className="relative group">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-pink-500' : 'text-blue-400/30 group-focus-within:text-blue-400'}`} size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    placeholder="Enter your name"
                                    className={`w-full bg-[var(--input-bg)] border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-blue-400/20 focus:outline-none transition-all ${errors.name
                                        ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500'
                                        : 'border-blue-500/20 focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-blue-400/60">Email Address</label>
                                {errors.email && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.email}</span>}
                            </div>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-pink-500' : 'text-blue-400/30 group-focus-within:text-blue-400'}`} size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    placeholder="your@email.com"
                                    className={`w-full bg-[var(--input-bg)] border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-blue-400/20 focus:outline-none transition-all ${errors.email
                                        ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500'
                                        : 'border-blue-500/20 focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-blue-400/60">Password</label>
                                {errors.password && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.password}</span>}
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-pink-500' : 'text-blue-400/30 group-focus-within:text-blue-400'}`} size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full bg-[var(--input-bg)] border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-blue-400/20 focus:outline-none transition-all ${errors.password
                                        ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500'
                                        : 'border-blue-500/20 focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-blue-400/60 ml-1">Role / Designation</label>
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/30 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-[var(--input-bg)] border border-blue-500/20 rounded-2xl py-3 pl-12 pr-10 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="user" className="bg-[var(--card-bg)] text-[var(--text-primary)]">Regular User</option>
                                    <option value="manager" className="bg-[var(--card-bg)] text-[var(--text-primary)]">Manager</option>
                                    <option value="sales" className="bg-[var(--card-bg)] text-[var(--text-primary)]">Sales Associate</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400/30">▼</div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:scale-[0.98] disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center justify-center gap-2 text-white">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Zap size={16} className="group-hover:scale-110 transition-transform" />
                                            Create Account
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 flex flex-col items-center pt-4 border-t border-blue-500/10">
                        <Link to="/login" className="group flex items-center gap-2 text-sm font-bold text-blue-400/60 hover:text-blue-400 transition-all">
                            <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                            <span>Already have an account? <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Login</span></span>
                        </Link>
                    </div>
                </div>

                {/* Aesthetic Detail */}
                <div className="mt-6 text-center">
                    <p className="text-[8px] font-medium uppercase tracking-[0.5em] text-blue-400/10">Secured.by.SmartIMS</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

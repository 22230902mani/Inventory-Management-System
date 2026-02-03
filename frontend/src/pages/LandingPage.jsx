import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Zap, Shield, Globe, Activity, ChevronRight, BarChart3, Box, Users, Sparkles, CheckCircle2, Rocket, Moon, Sun } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        // Check localStorage for theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const features = [
        "AI-Powered Inventory Intelligence",
        "Real-Time Stock Synchronization",
        "Advanced Analytics Dashboard",
        "Multi-User Role Management",
        "Secure Authentication System",
        "Mobile-Responsive Design"
    ];

    const featureCards = [
        {
            icon: Box,
            title: "SMART INVENTORY",
            desc: "AI-powered stock predictions and automated reordering",
            details: "Leverage machine learning to predict stock depletion and automatically trigger reorders before you run out.",
            link: "inventory"
        },
        {
            icon: Globe,
            title: "GLOBAL SYNC",
            desc: "Real-time synchronization across all your locations",
            details: "Sync inventory data across multiple warehouses and stores in real-time with sub-second latency.",
            link: "sync"
        },
        {
            icon: Shield,
            title: "SECURE ACCESS",
            desc: "Military-grade encryption and role-based permissions",
            details: "Bank-level security with AES-256 encryption and granular role-based access control for your team.",
            link: "security"
        },
        {
            icon: BarChart3,
            title: "ANALYTICS",
            desc: "Deep insights into your inventory performance",
            details: "Advanced analytics dashboard with predictive insights, trends analysis, and customizable reports.",
            link: "analytics"
        },
        {
            icon: Activity,
            title: "LIVE UPDATES",
            desc: "Monitor stock movements in real-time",
            details: "Track every inventory movement as it happens with live notifications and activity feeds.",
            link: "live"
        },
        {
            icon: Users,
            title: "TEAM MANAGEMENT",
            desc: "Collaborate with your team seamlessly",
            details: "Invite team members, assign roles, and collaborate with built-in messaging and task management.",
            link: "team"
        },
    ];

    const handleLearnMore = (featureLink) => {
        navigate(`/feature/${featureLink}`);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0F] text-white' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 text-gray-900'} selection:bg-purple-500/30 font-sans overflow-x-hidden transition-colors duration-300`}>
            {/* Massive Gradient Background Glows */}
            <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br ${darkMode ? 'from-purple-500/20 via-blue-500/10' : 'from-purple-200/40 via-blue-200/20'} to-transparent blur-[180px] pointer-events-none animate-pulse`} style={{ animationDuration: '4s' }} />
            <div className={`fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl ${darkMode ? 'from-pink-500/20 via-violet-500/10' : 'from-pink-200/40 via-violet-200/20'} to-transparent blur-[180px] pointer-events-none animate-pulse`} style={{ animationDuration: '6s' }} />

            {/* Animated Grid Pattern */}
            <div className="fixed inset-0 opacity-[0.02]"
                style={{ backgroundImage: `linear-gradient(${darkMode ? '#8B5CF6' : '#A78BFA'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#8B5CF6' : '#A78BFA'} 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

            {/* Navbar */}
            <nav className={`fixed top-0 w-full px-6 sm:px-12 py-6 flex justify-between items-center z-50 backdrop-blur-xl ${darkMode ? 'bg-[#0A0A0F]/60 border-b border-purple-500/10' : 'bg-white/80 border-b border-purple-200/50 shadow-lg shadow-purple-500/5'}`}>
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className={`absolute inset-0 ${darkMode ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-100/50 border-purple-300/30'} border backdrop-blur-md rounded-xl group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all`} />
                        <span className="relative text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">M</span>
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400/40 group-hover:text-purple-400' : 'text-purple-600/60 group-hover:text-purple-600'} transition-colors`}>Mammu</p>
                        <p className="text-lg font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent leading-none">IMS</p>
                    </div>
                </Link>
                <div className="flex items-center gap-8">
                    <div className={`hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400/40' : 'text-purple-600/60'}`}>
                        <a href="#features" className={`${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-all transform hover:translate-y-[-1px]`}>Features</a>
                        <a href="#about" className={`${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-all transform hover:translate-y-[-1px]`}>About</a>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-white border-purple-300/50 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg'} border hover:scale-110 transition-all`}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <Link to="/login" className="group relative px-5 py-2 overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-100 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                        <span className="relative font-black text-[10px] uppercase tracking-[0.15em] text-white flex items-center gap-1.5">
                            Enter System
                            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-32 px-6 sm:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-300/30'} border shadow-[0_0_20px_rgba(139,92,246,0.1)]`}
                        >
                            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Next-Gen Inventory Platform</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                            Manage<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-600">Smarter.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-xl ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} max-w-xl leading-relaxed font-medium`}
                        >
                            The world's most advanced inventory management system. Powered by AI, synchronized in real-time, secured by design.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-6"
                        >
                            <Link to="/register" className="group relative px-10 py-5 overflow-hidden rounded-2xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                <span className="relative font-black text-sm uppercase tracking-[0.2em] text-white flex items-center gap-3">
                                    <Rocket size={18} />
                                    Get Started
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/login" className={`px-10 py-5 ${darkMode ? 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10' : 'bg-white border-purple-300/50 hover:bg-purple-50 shadow-lg hover:shadow-xl'} border rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                Sign In
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <div className={`grid grid-cols-3 gap-8 pt-10 border-t ${darkMode ? 'border-purple-500/10' : 'border-purple-200/30'}`}>
                            {[
                                { label: 'Users', value: '2.4K+' },
                                { label: 'Uptime', value: '99.9%' },
                                { label: 'Items', value: '100K+' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <p className={`text-[9px] font-black ${darkMode ? 'text-purple-400/40' : 'text-purple-600/60'} uppercase tracking-widest mb-1`}>{stat.label}</p>
                                    <p className={`text-3xl font-black italic ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Feature Checklist */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className={`relative ${darkMode ? 'bg-[#0F0F14] border-purple-500/20' : 'bg-white/90 border-purple-200/60 shadow-2xl shadow-purple-500/10'} rounded-[40px] border overflow-hidden p-10`}>
                            {/* Inner Glow */}
                            <div className={`absolute top-0 right-0 w-80 h-80 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/30'} blur-[100px] -mr-40 -mt-40 pointer-events-none`} />
                            <div className={`absolute bottom-0 left-0 w-80 h-80 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-200/30'} blur-[100px] -ml-40 -mb-40 pointer-events-none`} />

                            <div className="relative space-y-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-300/30'} border flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.1)]`}>
                                        <Shield className="text-purple-400" size={24} />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'}`}>Premium Features</p>
                                        <p className={`text-2xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>Included</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className={`flex items-center gap-4 p-4 rounded-2xl ${darkMode ? 'bg-[#0A0A0F] border-purple-500/10 hover:bg-purple-500/5 hover:border-purple-500/20' : 'bg-purple-50 border-purple-200/30 hover:bg-purple-100 hover:border-purple-300/40'} border hover:shadow-[0_0_20px_rgba(139,92,246,0.05)] transition-all group`}
                                        >
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg ${darkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-200 border-purple-400/40'} border flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all`}>
                                                <CheckCircle2 className="text-purple-400" size={14} />
                                            </div>
                                            <span className={`text-sm font-bold ${darkMode ? 'text-purple-400/80 group-hover:text-purple-400' : 'text-purple-600/80 group-hover:text-purple-600'} transition-colors`}>{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className={`pt-6 border-t ${darkMode ? 'border-purple-500/10' : 'border-purple-200/30'}`}>
                                    <Link to="/register" className="group flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all">
                                        <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                        Start Free Trial
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Features Section with 3D Interactive Cards */}
            <section id="features" className={`py-32 px-8 max-w-7xl mx-auto border-t ${darkMode ? 'border-purple-500/10' : 'border-purple-200/30'}`}>
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">Powerful</span> Features
                    </h2>
                    <p className={`${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} text-lg max-w-2xl mx-auto`}>
                        Everything you need to manage your inventory like a pro
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureCards.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            className={`group relative rounded-[24px] bg-gradient-to-b ${darkMode ? 'from-[#0F0F14] to-[#0A0A0F] border-purple-500/10 hover:border-purple-500/30' : 'from-white to-purple-50/80 border-purple-200/60 hover:border-purple-400/60 shadow-lg hover:shadow-2xl shadow-purple-500/10'} border overflow-hidden transition-all duration-300`}
                        >
                            {/* 3D Depth Layers */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${darkMode ? 'from-purple-500/0 via-purple-500/5 to-purple-500/10' : 'from-purple-100/0 via-purple-100/30 to-purple-200/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className={`absolute inset-0 shadow-[inset_0_0_60px_rgba(139,92,246,0)] group-hover:shadow-[inset_0_0_60px_rgba(139,92,246,${darkMode ? '0.08' : '0.12'})] transition-all duration-500`} />

                            {/* Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-[24px] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />

                            <div className="relative p-6 space-y-5">
                                {/* Icon Container with 3D Effect */}
                                <div className="relative w-fit">
                                    <div className={`absolute inset-0 ${darkMode ? 'bg-purple-500/20' : 'bg-purple-300/40'} rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${darkMode ? 'from-purple-500/10 to-purple-500/5 border-purple-500/20 group-hover:border-purple-500/40' : 'from-purple-200 to-purple-100 border-purple-300/40 group-hover:border-purple-400/60'} border flex items-center justify-center text-purple-400 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300`}>
                                        <feat.icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-black uppercase tracking-tight ${darkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'} transition-colors duration-300`}>
                                    {feat.title}
                                </h3>

                                {/* Description */}
                                <p className={`text-sm ${darkMode ? 'text-purple-400/60 group-hover:text-purple-400/80' : 'text-purple-600/70 group-hover:text-purple-600'} leading-relaxed font-medium transition-colors duration-300`}>
                                    {feat.desc}
                                </p>

                                {/* Expandable Details - Shows on Hover */}
                                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 overflow-hidden transition-all duration-500">
                                    <p className={`text-sm ${darkMode ? 'text-purple-400/50 border-t border-purple-500/10' : 'text-purple-600/60 border-t border-purple-200/30'} leading-relaxed pt-3`}>
                                        {feat.details}
                                    </p>
                                </div>

                                {/* Learn More Button - Always Visible and Clickable */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => handleLearnMore(feat.link)}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl ${darkMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50' : 'bg-purple-100 border-purple-300/40 text-purple-600 hover:bg-purple-200 hover:border-purple-400/60'} border text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] active:scale-95 transition-all duration-300 cursor-pointer`}
                                    >
                                        Learn More
                                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Glow */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className={`py-32 px-8 max-w-6xl mx-auto border-t ${darkMode ? 'border-purple-500/10' : 'border-purple-200/30'}`}>
                <div className="text-center space-y-8">
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">About</span> Mammu IMS
                    </h2>
                    <p className={`text-xl ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} max-w-3xl mx-auto leading-relaxed`}>
                        Mammu IMS is a next-generation inventory management platform designed for modern businesses.
                        We combine artificial intelligence, real-time synchronization, and enterprise-grade security
                        to deliver the most powerful inventory management solution on the market.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                        {[
                            { title: "Our Mission", desc: "Simplify inventory management for businesses of all sizes with cutting-edge technology.", link: "/about/mission" },
                            { title: "Our Vision", desc: "Become the world's most trusted and innovative inventory management platform.", link: "/about/vision" },
                            { title: "Our Values", desc: "Innovation, security, reliability, and customer success drive everything we do.", link: "/about/values" }
                        ].map((item, i) => (
                            <Link key={i} to={item.link} className="block">
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className={`p-6 rounded-2xl ${darkMode ? 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40' : 'bg-white border-purple-200/60 shadow-lg hover:shadow-2xl hover:border-purple-400/80'} border transition-all duration-300 cursor-pointer group`}
                                >
                                    <h3 className={`text-xl font-black uppercase mb-3 ${darkMode ? 'text-purple-400 group-hover:text-purple-300' : 'text-purple-600 group-hover:text-purple-700'} transition-colors`}>{item.title}</h3>
                                    <p className={`${darkMode ? 'text-purple-400/60 group-hover:text-purple-400/80' : 'text-purple-600/70 group-hover:text-purple-600/90'} transition-colors mb-4`}>{item.desc}</p>
                                    <div className={`flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-purple-400/40 group-hover:text-purple-400' : 'text-purple-600/50 group-hover:text-purple-600'} transition-all`}>
                                        <span>Learn More</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-20 px-8 border-t ${darkMode ? 'border-purple-500/10' : 'border-purple-200/30'} text-center space-y-8 relative overflow-hidden`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 ${darkMode ? 'bg-purple-500/5' : 'bg-purple-200/20'} blur-[120px] pointer-events-none`} />
                <div className={`flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-purple-400/30' : 'text-purple-600/50'}`}>
                    <Link to="/privacy" className={`${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-colors`}>Privacy</Link>
                    <Link to="/terms" className={`${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-colors`}>Terms</Link>
                    <Link to="/support" className={`${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'} transition-colors`}>Support</Link>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${darkMode ? 'text-purple-400/10' : 'text-purple-600/20'}`}>© 2026 MAMMU IMS. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

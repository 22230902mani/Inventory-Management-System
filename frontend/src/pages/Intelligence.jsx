import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Activity, Brain, BarChart3, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';

const Intelligence = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const springConfig = { damping: 25, stiffness: 700 };
    const spotlightX = useSpring(mousePos.x, springConfig);
    const spotlightY = useSpring(mousePos.y, springConfig);

    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Dynamic Spotlight */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236, 72, 153, 0.08), transparent 80%)`
                }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full p-6 sm:p-8 flex justify-between items-center z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-black text-lg">M</div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tighter">MAMMU<span className="text-pink-500">IMS</span></div>
                </Link>
                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-white/70">
                    <Link to="/platform" className="hover:text-white transition-colors hidden sm:block">Platform</Link>
                    <Link to="/intelligence" className="text-white transition-colors hidden sm:block">Intelligence</Link>
                    <Link to="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all font-bold">Login</Link>
                    <Link to="/register" className="px-5 py-2.5 bg-pink-600 rounded-xl hover:bg-pink-700 text-white transition-all font-bold hidden sm:block">Start Free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-40 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-pink-500 mb-8"
                >
                    Neural Engine v2.0
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic mb-8"
                >
                    Predictive <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-red-500">Cognition</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-white/50 max-w-2xl font-medium leading-relaxed"
                >
                    Harness the power of neural networks to anticipate market shifts,
                    automate replenishment, and eliminate stockouts before they happen.
                </motion.p>
            </div>

            {/* Intelligence Showcase */}
            <div className="max-w-7xl mx-auto px-4 py-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-12 rounded-[40px] bg-white/5 border border-white/5 hover:border-pink-500/30 transition-all flex flex-col justify-between group">
                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-pink-500/20 flex items-center justify-center">
                                <Brain className="text-pink-500" size={32} />
                            </div>
                            <h3 className="text-3xl font-black uppercase italic">Neural Demand Forecasting</h3>
                            <p className="text-white/40 leading-relaxed font-medium">
                                Our proprietary LLM-integrated forecasting engine analyzes over 1.2M data points daily to predict your next inventory move with 99.7% accuracy.
                            </p>
                        </div>
                        <div className="mt-12 p-8 bg-black/40 rounded-3xl border border-white/10">
                            <div className="flex justify-between items-end mb-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase text-pink-500 tracking-widest">Prediction Confidence</div>
                                    <div className="text-3xl font-black italic">HIGH</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Next-Gen Accuracy</div>
                                    <div className="text-xl font-bold text-emerald-400">99.7%</div>
                                </div>
                            </div>
                            <div className="flex gap-2 h-16 items-end">
                                {[40, 60, 45, 80, 55, 90, 75, 40, 60, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex-1 bg-pink-500/30 rounded-t-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-12 rounded-[40px] bg-gradient-to-br from-pink-600/20 to-purple-800/20 border border-white/10 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 flex items-center justify-center">
                                <Sparkles className="text-purple-500" size={32} />
                            </div>
                            <h3 className="text-3xl font-black uppercase italic">Autonomous Logistics</h3>
                            <p className="text-white/60 leading-relaxed font-medium">
                                Let Mammu IMS handle the heavy lifting. Automate reorders, optimize transit routes, and synchronize multi-warehouse stock levels without lifting a finger.
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            {[
                                { label: 'Route Optimization', status: 'Optimal' },
                                { label: 'Stock Replenishment', status: 'Active' },
                                { label: 'Dynamic Pricing', status: 'Synced' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-white/10 rounded-md text-emerald-400">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversational AI */}
            <div className="max-w-7xl mx-auto px-4 py-32 relative z-10 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <MessageSquare className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter leading-tight">
                        Talk to your <br />
                        <span className="text-pink-500">Inventory</span>
                    </h2>
                    <p className="text-xl text-white/50 leading-relaxed">
                        Query your entire supply chain using natural language.
                        "What is our stock levels in sector 7?" or "Predict demand for Q3."
                    </p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-3xl font-mono text-left max-w-xl mx-auto">
                        <div className="text-white/40 mb-2">{'>'} User</div>
                        <div className="text-white mb-6">"How much stock should I order for the spring sale?"</div>
                        <div className="text-pink-500 mb-2">{'>'} Intelligence Core</div>
                        <div className="text-white/80 italic">"Analysis complete. Based on historic growth and current market trends, I suggest increasing orders for 'Sector B' by 14.5% to avoid stockouts."</div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto px-4 py-40 mb-20 text-center relative z-10 border-t border-white/5">
                <h2 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter mb-10">
                    Experience the <br />
                    <span className="text-pink-500">Singularity</span>
                </h2>
                <Link to="/register" className="inline-block h-20 px-16 bg-pink-600 text-white font-black uppercase text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(236,72,153,0.3)] flex items-center justify-center">
                    Initialize Engine
                </Link>
            </div>

            <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-black text-white text-xs">M</div>
                    <div className="text-sm font-bold tracking-tighter uppercase">Mammu IMS Neural Management</div>
                </div>
                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-white/30">
                    <Link to="/privacy-protocol" className="hover:text-white transition-colors">Privacy protocol</Link>
                    <Link to="/neural-terms" className="hover:text-white transition-colors">Neural Terms</Link>
                    <Link to="/hub-support" className="hover:text-white transition-colors">Hub Support</Link>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                    © 2026 NEXT-GEN LOGISTICS CORP.
                </div>
            </footer>
        </div>
    );
};

export default Intelligence;

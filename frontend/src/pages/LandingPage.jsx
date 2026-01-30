import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';
import NeuralButton from '../components/ui/NeuralButton';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#161616] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Navbar */}
            <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
                <div className="text-2xl font-bold tracking-tight">Smart IMS</div>
                <div className="flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link to="/home" className="text-white transition-colors">Home</Link>
                    <Link to="/login" className="px-6 py-2 border border-white/20 rounded-full hover:bg-white text-white hover:text-black transition-all">Login</Link>
                </div>
            </nav>

            {/* Background Ambiance */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-pink-900/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Main Hero Content */}
            <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-10 relative z-10">

                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-pink-500">
                            <Zap size={12} /> Next Gen System
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
                            Control Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Inventory</span>
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed max-w-md">
                            Smart IMS provides a unified platform to track, manage, and analyze your stock in real-time.
                            Experience seamless logistics with our advanced neural architecture.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <Link to="/register">
                                <NeuralButton className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-pink-600/20">
                                    Get Started <ArrowRight size={18} />
                                </NeuralButton>
                            </Link>
                            <Link to="/login">
                                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all">
                                    Live Demo
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Visual Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center"
                    >
                        <div className="relative z-10 bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 border border-white/10 shadow-2xl max-w-md w-full transform rotate-[-5deg] hover:rotate-0 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <ShieldCheck className="text-pink-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">Secure Data</h3>
                                    <p className="text-xs text-white/40">Enterprise Grade Encryption</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                                </div>
                                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="text-xs font-mono text-white/50">STATUS: ONLINE</div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#161616]" />
                                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#161616]" />
                                    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#161616] flex items-center justify-center text-[10px] font-bold">+4</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600 rounded-2xl rotate-12 -z-10 blur-xl opacity-50" />
                        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-pink-600 rounded-full -z-10 blur-2xl opacity-40" />
                    </motion.div>
                </div>

                {/* Features Footer */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <Database className="text-blue-400 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Centralized Hub</h3>
                        <p className="text-sm text-white/50">Manage all your warehouses and stock from a single, unified control center.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <Zap className="text-yellow-400 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Real-time Sync</h3>
                        <p className="text-sm text-white/50">Instant updates across all devices. Never lose track of a single unit again.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <ShieldCheck className="text-green-400 mb-4" size={32} />
                        <h3 className="font-bold text-lg mb-2">Role Management</h3>
                        <p className="text-sm text-white/50">Advanced permission controls for Admins, Managers, Sales, and Staff.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;

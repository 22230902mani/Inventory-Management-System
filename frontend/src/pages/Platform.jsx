import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Zap, Globe, Cpu, Layers, Activity, Server, Box, Terminal } from 'lucide-react';
import NeuralButton from '../components/ui/NeuralButton';

const Platform = () => {
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
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
                }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full p-6 sm:p-8 flex justify-between items-center z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-black text-lg">S</div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tighter">SMART<span className="text-pink-500">IMS</span></div>
                </Link>
                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-white/70">
                    <Link to="/platform" className="text-white transition-colors hidden sm:block">Platform</Link>
                    <Link to="/intelligence" className="hover:text-white transition-colors hidden sm:block">Intelligence</Link>
                    <Link to="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all font-bold">Login</Link>
                    <Link to="/register" className="px-5 py-2.5 bg-pink-600 rounded-xl hover:bg-pink-700 text-white transition-all font-bold hidden sm:block">Start Free</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-40 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-blue-400 mb-8"
                >
                    Infrastructure v3.4
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic mb-8"
                >
                    The Core <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Architecture</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-white/50 max-w-2xl font-medium leading-relaxed"
                >
                    A decentralized, high-availability platform designed for global-scale inventory management.
                    Zero downtime, infinite scalability, and military-grade encryption.
                </motion.p>
            </div>

            {/* Platform Stats */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-32 relative z-10">
                {[
                    { label: 'Uptime', value: '99.99%', sub: 'Global Reliability' },
                    { label: 'Latency', value: '< 12ms', sub: 'Neural Mesh' },
                    { label: 'Security', value: 'AES-1024', sub: 'Post-Quantum' },
                    { label: 'Nodes', value: '14.5k', sub: 'Decentralized' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center space-y-2 hover:bg-white/[0.08] transition-all"
                    >
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                        <div className="text-4xl font-black italic tracking-tighter text-blue-400">{stat.value}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase">{stat.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Core Features */}
            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 border-t border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter">Unified Operations</h2>
                            <p className="text-white/40 font-medium leading-relaxed">
                                Our platform consolidates all your warehouse, logistics, and supply chain data into a single source of truth.
                                Accessible from anywhere, managed by everyone.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Server, title: 'Edge Computing', desc: 'Processing data closer to the source for instantaneous response.' },
                                { icon: Box, title: 'Smart Inventory', desc: 'IoT-enabled tracking for real-time stock visualization.' },
                                { icon: Terminal, title: 'Open API', desc: 'Seamlessly integrate with your existing tech stack.' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <feature.icon className="text-blue-500" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold uppercase italic tracking-tight mb-2">{feature.title}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full" />
                        <div className="relative z-10 p-2 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl">
                            <div className="bg-black/40 rounded-[38px] p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-30">terminal_output</div>
                                </div>
                                <div className="font-mono text-sm space-y-2 text-blue-400/80">
                                    <p className="text-white/40">{'>'} initializing.system.mesh()</p>
                                    <p className="pl-4">checking nodes... [OK]</p>
                                    <p className="pl-4">syncing global ledger... [OK]</p>
                                    <p className="pl-4">establishing neural link... [OK]</p>
                                    <p className="text-emerald-400">{'>'} connection established</p>
                                    <p className="text-white/40">{'>'} awaiting directives_</p>
                                </div>
                                <div className="pt-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black uppercase text-white/30">system load</span>
                                        <span className="text-[10px] font-black text-blue-500">22%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[22%] bg-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-4xl mx-auto px-4 py-40 mb-20 text-center relative z-10 border-t border-white/5">
                <h2 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter mb-10">
                    Built for the <br />
                    <span className="text-blue-500">Unstoppable</span>
                </h2>
                <Link to="/register">
                    <NeuralButton className="h-20 px-16 bg-blue-600 text-white font-black uppercase text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                        Get Started
                    </NeuralButton>
                </Link>
            </div>

            <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-black text-white text-xs">S</div>
                    <div className="text-sm font-bold tracking-tighter uppercase">SmartIMS Neural Management</div>
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

export default Platform;

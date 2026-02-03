import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageSquare, Terminal, LifeBuoy, Zap, ChevronRight, Search } from 'lucide-react';

const HubSupport = () => {
    const [isProtocolActive, setIsProtocolActive] = useState(false);
    const [terminalLines, setTerminalLines] = useState([]);

    const runProtocol = () => {
        setIsProtocolActive(true);
        const lines = [
            "INITIALIZING LEVEL-01 OVERRIDE...",
            "AUTHENTICATING BIOMETRIC HASH...",
            "ESTABLISHING SECURE NEURAL LINK...",
            "BYPASSING STANDARD LOGISTICS LATENCY...",
            "SCANNING GLOBAL WAREHOUSE NODES...",
            "SECTOR 07: OPERATIONAL",
            "SECTOR 12: CRITICAL DOWNTIME DETECTED",
            "REROUTING CORE INTELLIGENCE...",
            "EMERGENCY RESCUE CORE ONLINE.",
            "AWAITING DIRECTIVE FROM COMMAND..."
        ];

        lines.forEach((line, i) => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, line]);
            }, (i + 1) * 600);
        });
    };

    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            <div className="absolute top-0 left-0 w-full h-[600px] bg-blue-600/5 blur-[120px] pointer-events-none" />

            {/* Terminal Overlay */}
            {isProtocolActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-20"
                >
                    <div className="w-full max-w-4xl aspect-video bg-black border border-blue-500/30 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(59,130,246,0.2)]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Emergency Core Active</div>
                        </div>
                        <div className="flex-1 p-8 font-mono text-sm sm:text-lg overflow-y-auto space-y-4 custom-scrollbar">
                            {terminalLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={line.includes('CRITICAL') ? 'text-red-500' : line.includes('ONLINE') ? 'text-emerald-400' : 'text-blue-400/80'}
                                >
                                    <span className="text-white/20 mr-4">[{new Date().toLocaleTimeString()}]</span>
                                    {line}
                                </motion.div>
                            ))}
                            {terminalLines.length < 10 && (
                                <div className="w-2 h-5 bg-blue-500 animate-pulse inline-block" />
                            )}
                        </div>
                        <div className="p-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Emergency Uplink</span>
                                <span className="text-sm font-bold text-blue-400">manilukka143@gmail.com</span>
                            </div>
                            <button
                                onClick={() => { setIsProtocolActive(false); setTerminalLines([]); }}
                                className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all w-full sm:w-auto"
                            >
                                Close Terminal
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Navbar */}
            <nav className="fixed top-0 w-full p-6 sm:p-8 flex justify-between items-center z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-black text-lg">S</div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tighter">SMART<span className="text-pink-500">IMS</span></div>
                </Link>
                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-white/70">
                    <Link to="/platform" className="hover:text-white transition-colors hidden sm:block">Platform</Link>
                    <Link to="/intelligence" className="hover:text-white transition-colors hidden sm:block">Intelligence</Link>
                    <Link to="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all font-bold">Login</Link>
                </div>
            </nav>

            <div className="pt-40 pb-32 px-4 max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-blue-400"
                    >
                        System Knowledge Base
                    </motion.div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-tighter uppercase italic leading-none">
                        Hub <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Support</span>
                    </h1>
                    <div className="max-w-2xl mx-auto relative mt-10">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
                        <input
                            type="text"
                            placeholder="QUERY THE KNOWLEDGE MESH..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-8 text-white font-bold tracking-widest text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 italic"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                    {[
                        { icon: Terminal, title: "Technical Docs", desc: "API endpoints, integration guides, and neural sync protocols.", href: "/tech-docs" },
                        { icon: MessageSquare, title: "Neural Chat", desc: "Talk to our AI specialist for immediate system assistance.", href: "/neural-chat-info" },
                        { icon: Zap, title: "Core Status", desc: "Real-time monitoring of global node operational status.", href: "/core-status-info" }
                    ].map((card, i) => (
                        <Link to={card.href} key={i}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer h-full"
                            >
                                <card.icon className="text-blue-500 mb-8" size={40} />
                                <h3 className="text-2xl font-black uppercase italic mb-4">{card.title}</h3>
                                <p className="text-white/40 font-medium leading-relaxed mb-8">{card.desc}</p>
                                <div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all mt-auto">
                                    Open Resource <ChevronRight size={14} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">Frequent Inquiries</h2>
                    {[
                        "How do I initialize a new warehouse node?",
                        "What is the average neural sync latency?",
                        "How is forecasting confidence calculated?",
                        "Integrating with Legacy ERP systems",
                    ].map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <HelpCircle className="text-white/20 group-hover:text-blue-500 transition-colors" size={20} />
                                <span className="font-bold tracking-tight text-white/70 group-hover:text-white transition-colors">{q}</span>
                            </div>
                            <ChevronRight size={18} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-1 relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-500 to-cyan-500">
                    <div className="bg-black rounded-[38px] p-12 text-center space-y-8">
                        <LifeBuoy className="mx-auto text-blue-500" size={48} />
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Priority Emergency Node</h2>
                        <p className="text-white/50 max-w-lg mx-auto leading-relaxed">System-wide catastrophic failures require Level-01 intervention. Access this protocol only if global supply chains are at risk.</p>
                        <button
                            onClick={runProtocol}
                            className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all"
                        >
                            INITIALIZE RESCUE PROTOCOL
                        </button>
                    </div>
                </div>
            </div>

            <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-black text-white text-xs">S</div>
                    <div className="text-sm font-bold tracking-tighter uppercase">SmartIMS Neural Management</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                    © 2026 NEXT-GEN LOGISTICS CORP.
                </div>
            </footer>
        </div>
    );
};

export default HubSupport;

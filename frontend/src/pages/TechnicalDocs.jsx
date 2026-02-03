import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Terminal, Code, Cpu, Globe, Database } from 'lucide-react';

const TechnicalDocs = () => {
    return (
        <div className="min-h-screen bg-[#050507] font-sans text-white relative overflow-hidden selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full px-6 sm:px-12 h-20 flex justify-between items-center z-50 backdrop-blur-xl bg-[#050507]/40 border-b border-white/5">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl group-hover:border-blue-500/50 transition-colors" />
                        <span className="relative text-xl font-black text-white italic tracking-tighter">M</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-blue-400 transition-colors">Neural</p>
                        <p className="text-base font-black text-white leading-none">Security</p>
                    </div>
                </Link>
                <Link to="/" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all font-bold text-[10px] uppercase tracking-widest">Back to Core</Link>
            </nav>

            <div className="pt-40 pb-32 px-4 max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">
                        Version 4.2.0-stable
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Technical <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Documentation</span>
                    </h1>
                </motion.div>

                <div className="space-y-16">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Code className="text-blue-500" size={32} />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">API Integration</h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 font-mono text-sm text-blue-400/80 space-y-4">
                            <p className="text-white/40">// Initialize SmartIMS client</p>
                            <p>const core = new SmartIMS.Core({'{'} apiKey: 'YOUR_NEURAL_HASH' {'}'});</p>
                            <p className="text-white/40 mt-4">// Sync inventory with global mesh</p>
                            <p>await core.sync('WAREHOUSE_ALPHA_07');</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Database className="text-blue-500" size={32} />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Neural Sync Protocol</h2>
                        </div>
                        <p className="text-white/50 leading-relaxed font-medium">
                            SmartIMS uses a proprietary synchronization protocol that ensures sub-12ms latency across all global nodes.
                            The protocol handles geometric sharding of inventory data to optimize for regional demand spikes.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: "Geometric Sharding", desc: "Data is distributed based on physical warehouse proximity." },
                                { title: "Conflict Resolution", desc: "Neural-based weighting for concurrent stock modifications." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <h4 className="font-black uppercase italic text-sm mb-2 text-blue-400">{item.title}</h4>
                                    <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Globe className="text-blue-500" size={32} />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Global Endpoints</h2>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black">All Active</span>
                        </div>
                        <div className="space-y-2">
                            {['api.na.smartims.core', 'api.eu.smartims.core', 'api.asia.smartims.core'].map((ep, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 font-mono text-xs">
                                    <span className="text-white/60">{ep}</span>
                                    <span className="text-blue-500 font-bold">12ms</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-black text-white text-xs">S</div>
                    <div className="text-sm font-bold tracking-tighter uppercase">SmartIMS Neural Management</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                    Contact for access: manilukka143@gmail.com
                </div>
            </footer>
        </div>
    );
};

export default TechnicalDocs;

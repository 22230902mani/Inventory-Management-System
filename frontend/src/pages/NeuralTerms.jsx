import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scale, Gavel, ShieldAlert, Cpu, Globe } from 'lucide-react';

const NeuralTerms = () => {
    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none" />

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

            <div className="pt-40 pb-32 px-4 max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-purple-400">
                        Legal Framework v2.6.0
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Neural <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Terms of Use</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {[
                        { icon: Scale, title: "Operational Compliance", text: "By initializing the SmartIMS core, you agree to distribute inventory data across our neural mesh in compliance with international logistics standards." },
                        { icon: Gavel, title: "Algorithmic Integrity", text: "Users are prohibited from reverse-engineering the Intelligence Core forecasting models or attempting to induce synthetic demand spikes." },
                        { icon: ShieldAlert, title: "Liability Node", text: "SmartIMS is not liable for fluctuations in supply chain latency caused by external planetary data disruptions or solar interference." },
                        { icon: Globe, title: "Cross-Border Logic", text: "Automated replenishment logic follows the legal codes of the originating and destination territories simultaneously." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all"
                        >
                            <item.icon className="text-purple-400 mb-6" size={32} />
                            <h3 className="text-xl font-black uppercase italic mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-12 prose prose-invert max-w-none font-medium text-white/60">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic text-white mb-6">1. Neural Service Activation</h2>
                        <p className="leading-relaxed">Access to the SmartIMS platform requires the generation of a unique biometric-signed neural hash. This hash serves as your immutable identifier across the decentralized ledger. Sharing hash-keys is strictly prohibited and will result in immediate system suspension.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-black uppercase italic text-white mb-6">2. Data Contribution & Mesh Rights</h2>
                        <p className="leading-relaxed">Operational data ingested by the platform is utilized for training the global forecasting engine. While specific values are obfuscated, the statistical patterns contribute to the collective intelligence of the SmartIMS ecosystem for the benefit of all nodes.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-black uppercase italic text-white mb-6">3. Automated Execution Bound</h2>
                        <p className="leading-relaxed">By activating 'Autonomous Mode', users grant authority to the core engine to execute purchase orders and logistics re-routing within predefined budgetary parameters. Users assume full responsibility for secondary effects of these automated decisions.</p>
                    </section>
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

export default NeuralTerms;

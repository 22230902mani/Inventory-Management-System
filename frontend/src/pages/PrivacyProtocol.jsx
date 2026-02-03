import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

const PrivacyProtocol = () => {
    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

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
                    className="space-y-4 mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400">
                        Security Clearance: Level 4
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Privacy <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Protocols</span>
                    </h1>
                    <p className="text-white/40 font-medium max-w-xl mx-auto">
                        Your data is encrypted using post-quantum cryptographic standards. We don't just protect data; we eliminate its vulnerability.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {[
                        {
                            icon: Shield,
                            title: "Data Sovereignty",
                            content: "All operational data remains within your specified jurisdictional nodes. SmartIMS utilizes a decentralized storage mesh ensuring no single point of failure or unauthorized access."
                        },
                        {
                            icon: Lock,
                            title: "Zero-Knowledge Encryption",
                            content: "We implement ZK-proofs for all transaction validations. Your sensitive inventory values and partner details are never visible to the core engine in plaintext."
                        },
                        {
                            icon: Eye,
                            title: "Neural Anonymization",
                            content: "Our Intelligence Core processes patterns, not identities. Individual user behaviors are masked through differential privacy layers before reaching the forecasting models."
                        },
                        {
                            icon: FileText,
                            title: "Access Transparency",
                            content: "Every byte of data accessed is logged on an immutable ledger. You have full visibility into who, when, and why system resources were utilized."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-8 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                                <item.icon className="text-emerald-400" size={28} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.title}</h3>
                                <p className="text-white/50 leading-relaxed font-medium">
                                    {item.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32 p-10 rounded-[40px] bg-white/5 border border-white/5 text-center">
                    <h2 className="text-2xl font-black uppercase italic mb-4">Request Data Audit</h2>
                    <p className="text-white/40 mb-8 max-w-sm mx-auto">Need a full compliance report? Our automated audit system can generate a L-03 security summary in seconds.</p>
                    <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        Generate Audit Report
                    </button>
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

export default PrivacyProtocol;

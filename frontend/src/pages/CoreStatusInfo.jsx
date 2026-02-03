import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Globe, Shield, Cpu, Server } from 'lucide-react';

const CoreStatusInfo = () => {
    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full p-6 sm:p-8 flex justify-between items-center z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-black text-black text-lg">S</div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tighter">SMART<span className="text-pink-500">IMS</span></div>
                </Link>
                <Link to="/hub-support" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white text-white hover:text-black transition-all font-bold text-xs uppercase tracking-widest">Back to Hub</Link>
            </nav>

            <div className="pt-40 pb-32 px-4 max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400">
                        Global Mesh Status: Nominal
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Core <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">System Status</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {[
                        { label: 'Uptime', value: '99.998%', color: 'text-emerald-400' },
                        { label: 'Latency', value: '8.4ms', color: 'text-emerald-400' },
                        { label: 'Load', value: '24%', color: 'text-emerald-400' },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{stat.label}</span>
                            <span className={`text-3xl font-black italic ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-12">
                    <section className="space-y-8">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Node Distribution</h2>
                        <div className="space-y-4">
                            {[
                                { node: 'North America Mesh (NA-01)', status: 'OPERATIONAL', load: '32%' },
                                { node: 'European Grid (EU-04)', status: 'OPERATIONAL', load: '18%' },
                                { node: 'Asia-Pacific Node (AP-07)', status: 'OPERATIONAL', load: '22%' },
                                { node: 'Oceanic Relay (OC-02)', status: 'MAINTENANCE', load: '0%' },
                            ].map((node, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${node.status === 'OPERATIONAL' ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-500'}`} />
                                        <span className="font-bold tracking-tight text-white/70">{node.node}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest hidden sm:block">LOAD: {node.load}</span>
                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md ${node.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {node.status}
                                        </span>
                                    </div>
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
                    Support: manilukka143@gmail.com
                </div>
            </footer>
        </div>
    );
};

export default CoreStatusInfo;

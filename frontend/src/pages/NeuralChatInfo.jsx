import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Sparkles, Zap, Cpu } from 'lucide-react';

const NeuralChatInfo = () => {
    return (
        <div className="min-h-screen bg-[#000000] font-sans text-white relative overflow-hidden selection:bg-pink-500/30">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/5 blur-[120px] pointer-events-none" />

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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-pink-500">
                        Cognitive Core v2.4
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        Neural <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Chat Engine</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 space-y-6">
                        <Brain className="text-pink-500" size={40} />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Natural Language Interface</h3>
                        <p className="text-white/40 leading-relaxed font-medium text-sm">
                            Interact with your inventory management system through sophisticated natural language queries.
                            The Neural Chat Engine interprets complex multi-step logistics questions and provides actionable intelligence.
                        </p>
                    </div>

                    <div className="p-10 rounded-[40px] bg-gradient-to-br from-pink-600/10 to-transparent border border-white/5 space-y-6">
                        <Sparkles className="text-purple-400" size={40} />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Real-time Insights</h3>
                        <p className="text-white/40 leading-relaxed font-medium text-sm">
                            Get immediate answers regarding stock levels, shipping delays, or demand forecasts.
                            The engine is directly connected to the SmartIMS global ledger for 100% data accuracy.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-pink-500 pl-6">Core Capabilities</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Semantic Query Processing", desc: "Understand user intent beyond simple keyword matching." },
                            { title: "Predictive Question Answering", desc: "Suggest follow-up questions based on current logistics trends." },
                            { title: "Multi-Warehouse Data Aggregation", desc: "Instantly compile reports across different geographical nodes." },
                            { title: "Emergency Re-routing Logic", desc: "Request the AI to suggest alternative transit routes during outages." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5"
                            >
                                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                                    <Zap className="text-pink-500" size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold uppercase tracking-tight text-white/80">{item.title}</h4>
                                    <p className="text-xs text-white/30">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="p-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-black text-white text-xs">S</div>
                    <div className="text-sm font-bold tracking-tighter uppercase">SmartIMS Neural Management</div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                    Emergency Email: manilukka143@gmail.com
                </div>
            </footer>
        </div>
    );
};

export default NeuralChatInfo;

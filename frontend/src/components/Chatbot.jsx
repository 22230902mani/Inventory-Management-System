import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Send,
    X,
    Minus,
    MessageSquare,
    Zap,
    Cpu,
    User as UserIcon
} from 'lucide-react';
import NeuralButton from './ui/NeuralButton';
import NeuralCard from './ui/NeuralCard';
import NeuralInput from './ui/NeuralInput';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Neural Link established. I am CoreAI v4.0. How can I assist with your logistics manifest?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:6700/api/chatbot',
                { query: userMsg.content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const botMsg = { role: 'assistant', content: data.response };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chatbot Error:', error);
            const errorMsg = error.response?.data?.response || 'Neural interference detected. Connection unstable.';
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        }
        setLoading(false);
    };

    return (
        <div className="chatbot-container fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[10000] font-sans flex flex-col items-end">
            {/* Pulsing Trigger Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-pink p-[2px] shadow-lg shadow-brand-blue/30 group overflow-hidden"
                    >
                        <div className="w-full h-full bg-[var(--bg-primary)] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                            <Bot className="text-[var(--text-primary)] relative z-10 group-hover:scale-110 transition-transform" size={28} />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-pink/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 left-0 w-full h-full animate-[pulse_3s_infinite] bg-brand-blue/10 rounded-full" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="w-[calc(100vw-32px)] sm:w-[400px] h-[550px] sm:h-[600px] max-h-[75vh] flex flex-col"
                    >
                        <NeuralCard className="flex-1 flex flex-col p-0 overflow-hidden border-brand-blue/20" variant="default">
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-r from-brand-blue/20 via-brand-pink/10 to-transparent border-b border-white/10 flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue to-transparent" />

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center relative group">
                                        <Cpu className="text-brand-blue animate-pulse" size={20} />
                                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--bg-primary)]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-black text-[var(--text-primary)] italic tracking-widest uppercase">CoreAI Protocol</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Neural Link Established</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button onClick={toggleChat} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)]">
                                        <Minus size={14} />
                                    </button>
                                    <button onClick={toggleChat} className="p-2 text-[var(--text-secondary)] hover:text-rose-400 transition-colors bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)]">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--bg-secondary)]">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-5 h-5 rounded-md bg-[var(--card-bg)] flex items-center justify-center border border-[var(--card-border)]">
                                                {msg.role === 'user' ? <UserIcon size={10} className="text-brand-pink" /> : <Bot size={10} className="text-brand-blue" />}
                                            </div>
                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">
                                                {msg.role === 'user' ? 'Field Operative' : 'Neural Entity'}
                                            </span>
                                        </div>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-brand-blue to-indigo-600 text-white rounded-tr-none shadow-lg shadow-brand-blue/10 border border-white/10'
                                            : 'bg-[var(--card-bg)] text-[var(--text-primary)] rounded-tl-none border border-[var(--card-border)] backdrop-blur-md'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-start"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-5 h-5 rounded-md bg-[var(--card-bg)] flex items-center justify-center border border-[var(--card-border)]">
                                                <Zap size={10} className="text-brand-blue animate-pulse" />
                                            </div>
                                            <span className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Processing Signal...</span>
                                        </div>
                                        <div className="bg-[var(--card-bg)] p-4 rounded-2xl rounded-tl-none border border-[var(--card-border)] flex gap-1.5">
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={sendMessage} className="p-6 border-t border-[var(--card-border)] bg-[var(--bg-primary)] relative">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />
                                <div className="flex gap-3 items-center">
                                    <div className="flex-1 relative group">
                                        <NeuralInput
                                            className="pr-12 bg-[var(--input-bg)] border-[var(--card-border)] h-12 focus:ring-brand-blue/20"
                                            placeholder="Transmit command..."
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-brand-blue/30 transition-colors pointer-events-none">
                                            <MessageSquare size={16} />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                                        disabled={!input.trim() || loading}
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                                        <Send size={18} className="text-white relative z-10" />
                                    </motion.button>
                                </div>
                            </form>
                        </NeuralCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;

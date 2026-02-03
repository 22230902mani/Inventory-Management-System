import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Eye, Award, CheckCircle2, Sparkles, Zap, ChevronRight, Sun, Moon } from 'lucide-react';

const AboutPage = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const content = {
        mission: {
            icon: Target,
            title: "Our Mission",
            subtitle: "Empowering Businesses Through Innovation",
            description: "At Smart IMS, our mission is to simplify inventory management for businesses of all sizes through cutting-edge technology. We believe that every business, regardless of size, deserves access to enterprise-grade inventory management tools.",
            points: [
                {
                    title: "Democratize Technology",
                    desc: "Make advanced inventory management accessible to businesses of all sizes, from startups to enterprises."
                },
                {
                    title: "Drive Innovation",
                    desc: "Continuously push the boundaries of what's possible with AI, automation, and real-time data."
                },
                {
                    title: "Empower Growth",
                    desc: "Provide tools that scale with your business, enabling sustainable growth and operational efficiency."
                },
                {
                    title: "Simplify Complexity",
                    desc: "Transform complex inventory challenges into simple, intuitive solutions that anyone can use."
                }
            ],
            commitment: "We're committed to being more than just software—we're your partner in success, constantly evolving to meet your changing needs."
        },
        vision: {
            icon: Eye,
            title: "Our Vision",
            subtitle: "Shaping the Future of Inventory Management",
            description: "We envision a world where inventory management is seamless, intelligent, and effortless. Our goal is to become the world's most trusted and innovative inventory management platform, setting new standards for excellence.",
            points: [
                {
                    title: "Global Leadership",
                    desc: "Become the #1 choice for businesses worldwide seeking intelligent inventory solutions."
                },
                {
                    title: "AI-First Approach",
                    desc: "Lead the industry in AI-powered predictive analytics and automated decision-making."
                },
                {
                    title: "Ecosystem Integration",
                    desc: "Create a unified platform that seamlessly integrates with every tool in your business ecosystem."
                },
                {
                    title: "Sustainable Innovation",
                    desc: "Drive sustainable business practices through optimized inventory management and waste reduction."
                }
            ],
            commitment: "By 2030, we aim to power inventory operations for over 1 million businesses globally, saving them billions in operational costs."
        },
        values: {
            icon: Award,
            title: "Our Values",
            subtitle: "The Principles That Guide Us",
            description: "Our values are the foundation of everything we do. They guide our decisions, shape our culture, and define how we serve our customers. These aren't just words—they're commitments we live by every day.",
            points: [
                {
                    title: "Innovation First",
                    desc: "We constantly challenge the status quo, embracing new technologies and methodologies to deliver cutting-edge solutions."
                },
                {
                    title: "Security Always",
                    desc: "Your data security is non-negotiable. We implement military-grade encryption and follow the highest security standards."
                },
                {
                    title: "Reliability Guaranteed",
                    desc: "99.9% uptime isn't just a promise—it's our commitment. Your business depends on us, and we take that seriously."
                },
                {
                    title: "Customer Success",
                    desc: "Your success is our success. We're dedicated to ensuring you achieve your business goals with our platform."
                },
                {
                    title: "Transparency",
                    desc: "We believe in open communication, honest pricing, and clear documentation. No hidden fees, no surprises."
                },
                {
                    title: "Continuous Improvement",
                    desc: "We're never done improving. Every day, we work to make Smart IMS better, faster, and more powerful."
                }
            ],
            commitment: "These values aren't negotiable—they're the DNA of Mammu IMS and the promise we make to every customer."
        }
    };

    const currentContent = content[section] || content.mission;
    const IconComponent = currentContent.icon;

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0F] text-white' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 text-gray-900'} font-sans overflow-y-auto`}>
            {/* Background Effects */}
            <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br ${darkMode ? 'from-purple-500/20 via-blue-500/10' : 'from-purple-200/40 via-blue-200/20'} to-transparent blur-[180px] pointer-events-none`} />
            <div className={`fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl ${darkMode ? 'from-pink-500/20 via-violet-500/10' : 'from-pink-200/40 via-violet-200/20'} to-transparent blur-[180px] pointer-events-none`} />
            <div className="fixed inset-0 opacity-[0.02]"
                style={{ backgroundImage: `linear-gradient(${darkMode ? '#8B5CF6' : '#A78BFA'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#8B5CF6' : '#A78BFA'} 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

            {/* Navigation */}
            <nav className={`fixed top-0 w-full px-6 sm:px-12 py-6 flex justify-between items-center z-50 backdrop-blur-xl ${darkMode ? 'bg-[#0A0A0F]/80 border-b border-purple-500/10' : 'bg-white/80 border-b border-purple-200/50 shadow-lg shadow-purple-500/5'}`}>
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className={`absolute inset-0 ${darkMode ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-100/50 border-purple-300/30'} border backdrop-blur-md rounded-xl group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all`} />
                        <span className="relative text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">M</span>
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400/40 group-hover:text-purple-400' : 'text-purple-600/60 group-hover:text-purple-600'} transition-colors`}>Mammu</p>
                        <p className="text-lg font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent leading-none">IMS</p>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-white border-purple-300/50 text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg'} border hover:scale-110 transition-all`}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 ${darkMode ? 'text-purple-400/60 hover:text-purple-400' : 'text-purple-600/70 hover:text-purple-600'} text-sm font-bold uppercase tracking-wider transition-all`}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <Link to="/register" className="group relative px-6 py-2.5 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
                        <span className="relative font-black text-xs uppercase tracking-[0.2em] text-white">Get Started</span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 sm:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                >
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${darkMode ? 'from-purple-500/20 to-purple-500/5 border-purple-500/30' : 'from-purple-200 to-purple-100 border-purple-300/60 shadow-xl'} border flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.3)]`}>
                            <IconComponent size={48} className="text-purple-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <p className={`text-sm font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{currentContent.subtitle}</p>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">{currentContent.title}</span>
                        </h1>
                        <p className={`text-xl ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} max-w-3xl mx-auto leading-relaxed`}>{currentContent.description}</p>
                    </div>
                </motion.div>
            </div>

            {/* Points Section */}
            <div className="relative py-20 px-6 sm:px-8 max-w-5xl mx-auto space-y-6">
                {currentContent.points.map((point, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className={`group p-8 rounded-3xl ${darkMode ? 'bg-[#0F0F14] border-purple-500/10 hover:border-purple-500/30 hover:bg-purple-500/5' : 'bg-white border-purple-200/60 hover:border-purple-400/60 shadow-lg hover:shadow-2xl'} border transition-all`}
                    >
                        <div className="flex items-start gap-6">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-300/40'} border flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all`}>
                                <CheckCircle2 className="text-purple-400" size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className={`text-2xl font-black uppercase tracking-tight ${darkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'} transition-colors`}>{point.title}</h3>
                                <p className={`${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} leading-relaxed`}>{point.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Commitment Section */}
            <div className="relative py-20 px-6 sm:px-8 max-w-4xl mx-auto">
                <div className={`relative p-12 rounded-[40px] ${darkMode ? 'bg-gradient-to-b from-[#0F0F14] to-[#0A0A0F] border-purple-500/20' : 'bg-white border-purple-200/60 shadow-2xl'} border overflow-hidden`}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-purple-500/5 to-blue-500/5' : 'bg-gradient-to-r from-purple-100/30 to-blue-100/30'}`} />
                    <div className="relative text-center space-y-6">
                        <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
                        <h2 className={`text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>Our Commitment</h2>
                        <p className={`text-lg ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} max-w-2xl mx-auto leading-relaxed`}>
                            {currentContent.commitment}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Link to="/register" className="group relative px-10 py-5 overflow-hidden rounded-2xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                <span className="relative font-black text-sm uppercase tracking-[0.2em] text-white flex items-center gap-3">
                                    <Zap size={18} />
                                    Join Us Today
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/" className={`px-10 py-5 ${darkMode ? 'bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10' : 'bg-white border-purple-300/50 hover:bg-purple-50 shadow-lg hover:shadow-xl'} border rounded-2xl font-black text-sm uppercase tracking-[0.2em] ${darkMode ? 'text-purple-400' : 'text-purple-600'} transition-all`}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

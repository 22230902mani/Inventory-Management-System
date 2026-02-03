import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, HelpCircle, CheckCircle2, Mail, Phone, MapPin, Sun, Moon } from 'lucide-react';

const InfoPages = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    // Extract page from pathname (e.g., "/privacy" -> "privacy")
    const page = location.pathname.split('/')[1] || 'privacy';

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
        privacy: {
            icon: Shield,
            title: "Privacy Policy",
            subtitle: "Your Privacy Matters to Us",
            lastUpdated: "January 31, 2026",
            sections: [
                {
                    heading: "Information We Collect",
                    points: [
                        "Account information (name, email, company details)",
                        "Inventory data and transaction records",
                        "Usage analytics and performance metrics",
                        "Device information and IP addresses"
                    ]
                },
                {
                    heading: "How We Use Your Information",
                    points: [
                        "To provide and improve our inventory management services",
                        "To send important updates and notifications",
                        "To analyze usage patterns and optimize performance",
                        "To ensure security and prevent fraud"
                    ]
                },
                {
                    heading: "Data Security",
                    points: [
                        "AES-256 encryption for data at rest and in transit",
                        "Regular security audits and penetration testing",
                        "Strict access controls and authentication protocols",
                        "Compliance with GDPR, CCPA, and SOC 2 standards"
                    ]
                },
                {
                    heading: "Your Rights",
                    points: [
                        "Access and download your data at any time",
                        "Request data deletion or account closure",
                        "Opt-out of marketing communications",
                        "Control cookie preferences and tracking"
                    ]
                },
                {
                    heading: "Data Retention",
                    points: [
                        "Active account data retained as long as account is active",
                        "Deleted data permanently removed within 30 days",
                        "Backup data retained for disaster recovery purposes",
                        "Legal compliance data retained as required by law"
                    ]
                }
            ]
        },
        terms: {
            icon: FileText,
            title: "Terms of Service",
            subtitle: "Clear Terms, Fair Agreement",
            lastUpdated: "January 31, 2026",
            sections: [
                {
                    heading: "Service Agreement",
                    points: [
                        "Mammu IMS provides cloud-based inventory management software",
                        "Service availability guaranteed at 99.9% uptime",
                        "Regular updates and feature enhancements included",
                        "24/7 technical support for all paid plans"
                    ]
                },
                {
                    heading: "User Responsibilities",
                    points: [
                        "Maintain confidentiality of your account credentials",
                        "Use the service in compliance with applicable laws",
                        "Ensure accuracy of inventory data you input",
                        "Notify us immediately of any security breaches"
                    ]
                },
                {
                    heading: "Acceptable Use",
                    points: [
                        "Use the service for legitimate business purposes only",
                        "Do not attempt to hack, disrupt, or abuse the system",
                        "Respect intellectual property and copyright laws",
                        "Follow our community guidelines and code of conduct"
                    ]
                },
                {
                    heading: "Billing and Payments",
                    points: [
                        "Subscription fees billed monthly or annually",
                        "14-day free trial for new users (no credit card required)",
                        "Pro-rated refunds for annual plan cancellations",
                        "Automatic renewal unless canceled 48 hours before billing"
                    ]
                },
                {
                    heading: "Termination",
                    points: [
                        "You may cancel your account at any time",
                        "We may suspend accounts for terms violations",
                        "Data export available for 30 days after cancellation",
                        "Refunds processed within 7-10 business days"
                    ]
                }
            ]
        },
        support: {
            icon: HelpCircle,
            title: "Support Center",
            subtitle: "We're Here to Help",
            lastUpdated: "24/7 Support Available",
            sections: [
                {
                    heading: "Contact Methods",
                    points: [
                        "Email: support@mammuims.com (Response within 24 hours)",
                        "Live Chat: Available 24/7 on our dashboard",
                        "Phone: +1 (555) 123-4567 (Mon-Fri, 9AM-6PM EST)",
                        "Support Portal: help.mammuims.com"
                    ]
                },
                {
                    heading: "Getting Started",
                    points: [
                        "Complete onboarding tutorial in your dashboard",
                        "Watch our video tutorials on YouTube",
                        "Read our comprehensive documentation",
                        "Join our community forum for peer support"
                    ]
                },
                {
                    heading: "Common Issues",
                    points: [
                        "Password reset: Use 'Forgot Password' on login page",
                        "Data import: Supports CSV, Excel, and JSON formats",
                        "Integration: Connect with 50+ business tools",
                        "Performance: Clear cache or try incognito mode"
                    ]
                },
                {
                    heading: "Enterprise Support",
                    points: [
                        "Dedicated account manager for enterprise clients",
                        "Priority support with 2-hour response time",
                        "Custom training sessions for your team",
                        "Direct access to engineering team for critical issues"
                    ]
                },
                {
                    heading: "Resources",
                    points: [
                        "Knowledge Base: 500+ articles and guides",
                        "API Documentation: For developers and integrations",
                        "Webinars: Monthly training sessions",
                        "Blog: Tips, best practices, and industry news"
                    ]
                }
            ]
        }
    };

    const currentContent = content[page] || content.privacy;
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
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-16 px-6 sm:px-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="flex justify-center">
                        <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${darkMode ? 'from-purple-500/20 to-purple-500/5 border-purple-500/30' : 'from-purple-200 to-purple-100 border-purple-300/60 shadow-xl'} border flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.3)]`}>
                            <IconComponent size={40} className="text-purple-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className={`text-sm font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{currentContent.subtitle}</p>
                        <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">{currentContent.title}</span>
                        </h1>
                        <p className={`text-sm ${darkMode ? 'text-purple-400/40' : 'text-purple-600/50'}`}>Last Updated: {currentContent.lastUpdated}</p>
                    </div>
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="relative py-12 px-6 sm:px-8 max-w-4xl mx-auto space-y-12">
                {currentContent.sections.map((section, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className={`p-8 rounded-3xl ${darkMode ? 'bg-[#0F0F14] border-purple-500/10' : 'bg-white border-purple-200/60 shadow-lg'} border`}
                    >
                        <h2 className={`text-2xl font-black uppercase tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{section.heading}</h2>
                        <div className="space-y-4">
                            {section.points.map((point, j) => (
                                <div key={j} className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg ${darkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-300/40'} border flex items-center justify-center mt-0.5`}>
                                        <CheckCircle2 className="text-purple-400" size={14} />
                                    </div>
                                    <p className={`${darkMode ? 'text-purple-400/70' : 'text-purple-600/80'} leading-relaxed`}>{point}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Contact CTA (for Support page) */}
            {page === 'support' && (
                <div className="relative py-20 px-6 sm:px-8 max-w-4xl mx-auto">
                    <div className={`relative p-12 rounded-[40px] ${darkMode ? 'bg-gradient-to-b from-[#0F0F14] to-[#0A0A0F] border-purple-500/20' : 'bg-white border-purple-200/60 shadow-2xl'} border overflow-hidden`}>
                        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-purple-500/5 to-blue-500/5' : 'bg-gradient-to-r from-purple-100/30 to-blue-100/30'}`} />
                        <div className="relative text-center space-y-8">
                            <h2 className={`text-3xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>Still Need Help?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200/40'} border`}>
                                    <Mail className="text-purple-400 mx-auto mb-3" size={32} />
                                    <p className={`text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Email Us</p>
                                    <p className={`text-xs ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} mt-2`}>support@mammuims.com</p>
                                </div>
                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200/40'} border`}>
                                    <Phone className="text-purple-400 mx-auto mb-3" size={32} />
                                    <p className={`text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Call Us</p>
                                    <p className={`text-xs ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} mt-2`}>+1 (555) 123-4567</p>
                                </div>
                                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200/40'} border`}>
                                    <MapPin className="text-purple-400 mx-auto mb-3" size={32} />
                                    <p className={`text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Visit Us</p>
                                    <p className={`text-xs ${darkMode ? 'text-purple-400/60' : 'text-purple-600/70'} mt-2`}>123 Tech Street, SF, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoPages;

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Globe, Shield, BarChart3, Activity, Users, ArrowLeft, CheckCircle2, Zap, ChevronRight } from 'lucide-react';

const FeatureDetails = () => {
    const { featureId } = useParams();
    const navigate = useNavigate();

    const featureData = {
        inventory: {
            icon: Box,
            title: "Smart Inventory",
            subtitle: "AI-Powered Stock Management",
            description: "Leverage cutting-edge machine learning algorithms to predict stock depletion patterns and automatically trigger reorders before you run out.",
            benefits: [
                "Predictive analytics for stock levels",
                "Automated reordering based on AI predictions",
                "Real-time inventory monitoring",
                "Historical trend analysis",
                "Smart alerts and notifications",
                "Integration with suppliers"
            ],
            features: [
                {
                    title: "Machine Learning Predictions",
                    desc: "Advanced AI algorithms analyze your historical data to predict future stock requirements with 95%+ accuracy."
                },
                {
                    title: "Automated Reordering",
                    desc: "Set rules and let the system automatically place orders with your suppliers when stock reaches optimal reorder points."
                },
                {
                    title: "Demand Forecasting",
                    desc: "Understand seasonal trends and predict demand spikes before they happen."
                }
            ]
        },
        sync: {
            icon: Globe,
            title: "Global Sync",
            subtitle: "Real-Time Multi-Location Synchronization",
            description: "Sync inventory data across multiple warehouses, stores, and locations in real-time with sub-second latency. Never lose track of stock across your entire network.",
            benefits: [
                "Sub-second synchronization speed",
                "Multi-location inventory tracking",
                "Automatic conflict resolution",
                "Offline mode support",
                "Cross-location transfers",
                "Global visibility dashboard"
            ],
            features: [
                {
                    title: "Real-Time Updates",
                    desc: "Every stock movement is instantly reflected across all connected locations worldwide."
                },
                {
                    title: "Multi-Store Management",
                    desc: "Manage inventory across hundreds of locations from a single unified dashboard."
                },
                {
                    title: "Smart Transfer System",
                    desc: "Automatically suggest stock transfers between locations to optimize inventory distribution."
                }
            ]
        },
        security: {
            icon: Shield,
            title: "Secure Access",
            subtitle: "Military-Grade Security & Permissions",
            description: "Bank-level security with AES-256 encryption and granular role-based access control. Keep your inventory data safe with enterprise-grade protection.",
            benefits: [
                "AES-256 bit encryption",
                "Role-based access control (RBAC)",
                "Two-factor authentication (2FA)",
                "Audit logs and activity tracking",
                "IP whitelisting",
                "Secure API access"
            ],
            features: [
                {
                    title: "Advanced Encryption",
                    desc: "All data is encrypted at rest and in transit using military-grade AES-256 encryption standards."
                },
                {
                    title: "Granular Permissions",
                    desc: "Define exactly what each team member can see and do with customizable role-based permissions."
                },
                {
                    title: "Complete Audit Trail",
                    desc: "Track every action taken in the system with detailed logs for compliance and security."
                }
            ]
        },
        analytics: {
            icon: BarChart3,
            title: "Advanced Analytics",
            subtitle: "Deep Insights & Predictive Intelligence",
            description: "Transform your inventory data into actionable insights with advanced analytics, customizable reports, and predictive forecasting.",
            benefits: [
                "Real-time analytics dashboard",
                "Customizable reports",
                "Predictive insights",
                "Export to multiple formats",
                "Automated report scheduling",
                "Visual data representations"
            ],
            features: [
                {
                    title: "Interactive Dashboards",
                    desc: "Beautiful, real-time dashboards that give you instant visibility into your inventory performance."
                },
                {
                    title: "Custom Reports",
                    desc: "Build custom reports tailored to your business needs with our drag-and-drop report builder."
                },
                {
                    title: "Trend Analysis",
                    desc: "Identify patterns and trends in your inventory data to make informed business decisions."
                }
            ]
        },
        live: {
            icon: Activity,
            title: "Live Updates",
            subtitle: "Real-Time Stock Movement Monitoring",
            description: "Track every inventory movement as it happens with live notifications, activity feeds, and instant alerts for critical events.",
            benefits: [
                "Real-time activity feed",
                "Instant push notifications",
                "Custom alert rules",
                "Movement history tracking",
                "Live dashboard updates",
                "Mobile notifications"
            ],
            features: [
                {
                    title: "Live Activity Stream",
                    desc: "See every stock movement, order, and transaction as it happens in a real-time activity feed."
                },
                {
                    title: "Smart Notifications",
                    desc: "Get notified instantly about low stock, completed orders, shipments, and custom events."
                },
                {
                    title: "Event Tracking",
                    desc: "Track and analyze all inventory events with detailed timestamps and user attribution."
                }
            ]
        },
        team: {
            icon: Users,
            title: "Team Management",
            subtitle: "Seamless Collaboration & Communication",
            description: "Invite team members, assign roles, collaborate with built-in messaging, and manage tasks across your entire organization.",
            benefits: [
                "Unlimited team members",
                "Role-based permissions",
                "Built-in messaging",
                "Task management",
                "Activity tracking",
                "Team performance analytics"
            ],
            features: [
                {
                    title: "Team Collaboration",
                    desc: "Work together seamlessly with real-time collaboration tools and shared workspaces."
                },
                {
                    title: "Task Assignment",
                    desc: "Assign inventory tasks to team members and track completion status in real-time."
                },
                {
                    title: "Internal Messaging",
                    desc: "Communicate with your team directly within the platform without switching apps."
                }
            ]
        }
    };

    const feature = featureData[featureId] || featureData.inventory;
    const FeatureIcon = feature.icon;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
            {/* Background Effects */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[180px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[180px] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            {/* Navigation */}
            <nav className="fixed top-0 w-full px-6 sm:px-12 py-6 flex justify-between items-center z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-emerald-500/10">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500 opacity-20 blur-sm" />
                        <div className="absolute inset-0 bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md rounded-xl group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all" />
                        <span className="relative text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent italic tracking-tighter">M</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/40">Smart</p>
                        <p className="text-lg font-black text-emerald-400 leading-none">IMS</p>
                    </div>
                </Link>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 text-sm font-bold uppercase tracking-wider transition-all"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <Link to="/register" className="group relative px-6 py-2.5 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                        <span className="relative font-black text-xs uppercase tracking-[0.2em] text-black">Get Started</span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 sm:px-8 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8"
                >
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                            <FeatureIcon size={48} className="text-emerald-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">{feature.subtitle}</p>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{feature.title}</span>
                        </h1>
                        <p className="text-xl text-emerald-400/60 max-w-3xl mx-auto leading-relaxed">{feature.description}</p>
                    </div>
                </motion.div>
            </div>

            {/* Benefits Section */}
            <div className="relative py-20 px-6 sm:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feature.benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group flex items-center gap-3 p-4 rounded-2xl bg-[#0F0F0F] border border-emerald-500/10 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all"
                        >
                            <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="text-emerald-400" size={14} />
                            </div>
                            <span className="text-sm font-bold text-emerald-400/80">{benefit}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Features Details */}
            <div className="relative py-20 px-6 sm:px-8 max-w-6xl mx-auto space-y-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-12">
                    <span className="text-white">Key </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Features</span>
                </h2>

                <div className="space-y-6">
                    {feature.features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="group p-8 rounded-3xl bg-[#0F0F0F] border border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all"
                        >
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all">
                                    <Zap className="text-emerald-400" size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">{feat.title}</h3>
                                    <p className="text-emerald-400/60 leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-32 px-6 sm:px-8 max-w-4xl mx-auto">
                <div className="relative p-12 rounded-[40px] bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.2)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
                    <div className="relative text-center space-y-8">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">
                            <span className="text-white">Ready to get </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">started?</span>
                        </h2>
                        <p className="text-emerald-400/60 text-lg max-w-2xl mx-auto">
                            Join thousands of businesses already using Smart IMS to revolutionize their inventory management.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/register" className="group relative px-10 py-5 overflow-hidden rounded-2xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                <span className="relative font-black text-sm uppercase tracking-[0.2em] text-black flex items-center gap-3">
                                    Start Free Trial
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/" className="px-10 py-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/10 transition-all">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureDetails;

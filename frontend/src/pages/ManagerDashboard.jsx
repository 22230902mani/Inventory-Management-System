import React, { useEffect, useState } from 'react';
import config from '../config';
import {
    Package,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Scan,
    Camera,
    Search,
    ShieldCheck,
    Zap,
    ChevronRight,
    Send,
    Plus,
    Minus,
    Key,
    Boxes,
    Activity,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from '../components/Scanner';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralNotifications from '../components/NeuralNotifications';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ManagerDashboard = () => {
    const { addToast } = useToast();
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
        outOfStockCount: 0
    });

    const [scanCode, setScanCode] = useState('');
    const [scannedProduct, setScannedProduct] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showDeliveryScanner, setShowDeliveryScanner] = useState(false);
    const [verifyOrderId, setVerifyOrderId] = useState('');
    const [verifyOtp, setVerifyOtp] = useState('');

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyPayment = async (orderId, action) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${config.API_BASE_URL}/api/orders/verify-payment`, { orderId, action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast(action === 'approve' ? 'Payment Verified. OTP sent to user.' : 'Payment Rejected. Order Cancelled.', action === 'approve' ? 'success' : 'warning');
            fetchOrders();
        } catch (error) {
            addToast('Action failed: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleScan = async (e) => {
        if (e) e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/inventory/barcode/${scanCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScannedProduct(data);
            setScanCode('');
            addToast(`Identified: ${data.name}`, 'info');
        } catch (error) {
            addToast('Product not found or error scanning', 'error');
        }
    };

    const handleCamScan = (code) => {
        setScanCode(code);
        setShowScanner(false);
    };

    const updateStock = async (delta) => {
        if (!scannedProduct) return;
        try {
            const token = localStorage.getItem('token');
            const newQty = scannedProduct.quantity + delta;
            await axios.put(`${config.API_BASE_URL}/api/inventory/${scannedProduct._id}`, { quantity: newQty }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScannedProduct({ ...scannedProduct, quantity: newQty });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeliveryScan = (code) => {
        setVerifyOrderId(code);
        setShowDeliveryScanner(false);
    };

    const handleCompleteDelivery = async () => {
        if (!verifyOrderId || !verifyOtp) return alert('Enter ID and OTP');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${config.API_BASE_URL}/api/orders/${verifyOrderId}/verify-delivery`, { otp: verifyOtp }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('OTP Match! Order Marked as Received.', 'success');
            setVerifyOrderId('');
            setVerifyOtp('');
            fetchOrders();
        } catch (e) {
            addToast('Verification Failed: ' + (e.response?.data?.message || 'Invalid OTP'), 'error');
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${config.API_BASE_URL}/api/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats({
                    totalProducts: data.totalProducts,
                    lowStockProducts: data.lowStockCount,
                    pendingOrders: data.totalOrders,
                    outOfStockCount: data.outOfStockCount
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
        fetchOrders();
    }, []);

    const pendingVerifications = orders.filter(o => o.status === 'Pending Verification');

    return (
        <div className="space-y-8 pb-12">
            {showScanner && <Scanner onScan={handleCamScan} onClose={() => setShowScanner(false)} />}
            {showDeliveryScanner && <Scanner onScan={handleDeliveryScan} onClose={() => setShowDeliveryScanner(false)} />}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Live Assets', mobileLabel: 'ASSETS', value: stats.totalProducts, icon: Boxes, color: 'dark:from-[#172554] dark:to-[#1e3a8a] dark:border-blue-500/20', lightColor: 'bg-blue-100 border-blue-200', iconColor: 'text-blue-600 dark:text-blue-400', trend: 12 },
                    { label: 'Pending Auth', mobileLabel: 'PENDING', value: pendingVerifications.length, icon: ShieldCheck, color: 'dark:from-[#2e1065] dark:to-[#4c1d95] dark:border-violet-500/20', lightColor: 'bg-violet-100 border-violet-200', iconColor: 'text-violet-600 dark:text-violet-400', trend: -5 },
                    { label: 'Low Stock Alert', mobileLabel: 'LOW STOCK', value: stats.lowStockProducts, icon: AlertTriangle, color: 'dark:from-[#701a75] dark:to-[#a21caf] dark:border-fuchsia-500/20', lightColor: 'bg-fuchsia-100 border-fuchsia-200', iconColor: 'text-fuchsia-600 dark:text-fuchsia-400', trend: 8 },
                    { label: 'Depleted Units', mobileLabel: 'DEPLETED', value: stats.outOfStockCount || 0, icon: Zap, color: 'dark:from-[#4c0519] dark:to-[#831843] dark:border-rose-500/20', lightColor: 'bg-rose-100 border-rose-200', iconColor: 'text-rose-600 dark:text-rose-400', trend: 2 }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative p-4 sm:p-6 rounded-[28px] border overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${stat.color} ${stat.lightColor}`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 dark:bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
                        <div className="relative flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1 truncate sm:hidden">{stat.mobileLabel}</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-1 truncate hidden sm:block">{stat.label}</p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate">{stat.value.toLocaleString()}</h3>
                                {stat.trend && (
                                    <div className={`flex items-center gap-1 text-[10px] font-black mt-1 ${stat.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {stat.trend > 0 ? <TrendingUp size={10} /> : <Activity size={10} />}
                                        <span>{Math.abs(stat.trend)}%</span>
                                    </div>
                                )}
                            </div>
                            <div className={`flex-shrink-0 p-3 sm:p-4 bg-white shadow-sm dark:bg-black/20 rounded-2xl border dark:border-white/10 dark:backdrop-blur-xl dark:shadow-inner ${stat.iconColor}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Verification HUD */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Payment Verification TABLE */}
                    <NeuralCard className="overflow-hidden p-0" delay={0.5}>
                        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-brand-blue/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="text-brand-blue" size={20} />
                                <h4 className="text-lg font-bold">Capital Authorization Hub</h4>
                            </div>
                            <NeuralBadge variant="pending">{pendingVerifications.length} Awaiting</NeuralBadge>
                        </div>
                        <div className="md:hidden space-y-3 p-4">
                            {pendingVerifications.map((o) => (
                                <div key={o._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ID: {o._id.slice(-8)}</p>
                                            <p className="font-bold text-white tracking-widest">₹{o.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <NeuralButton
                                                variant="secondary"
                                                className="w-10 h-10 border-rose-500/30 text-rose-400"
                                                onClick={() => verifyPayment(o._id, 'reject')}
                                            >
                                                <XCircle size={14} />
                                            </NeuralButton>
                                            <NeuralButton
                                                variant="primary"
                                                className="w-10 h-10 bg-emerald-500 text-black hover:bg-emerald-400"
                                                onClick={() => verifyPayment(o._id, 'approve')}
                                            >
                                                <CheckCircle size={14} />
                                            </NeuralButton>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[9px] font-extrabold text-white/20 uppercase tracking-widest mb-1">UTR Protocol</p>
                                        <p className="text-xs font-mono text-brand-blue/60">{o.paymentUTR}</p>
                                    </div>
                                </div>
                            ))}
                            {pendingVerifications.length === 0 && (
                                <p className="text-center py-8 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">All protocols cleared</p>
                            )}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="neural-table">
                                <thead>
                                    <tr>
                                        <th>Manifest ID</th>
                                        <th>Credit Value</th>
                                        <th>UTR Protocol</th>
                                        <th className="text-right pr-12">Authorization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingVerifications.map((o) => (
                                        <tr key={o._id}>
                                            <td className="font-bold text-brand-blue">#{o._id.slice(-8)}</td>
                                            <td className="font-black text-[var(--text-primary)]">₹{o.totalAmount.toLocaleString()}</td>
                                            <td className="font-mono text-[var(--text-secondary)] tracking-wider text-xs">{o.paymentUTR}</td>
                                            <td className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <NeuralButton
                                                        variant="secondary"
                                                        className="h-9 px-3 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                                        onClick={() => verifyPayment(o._id, 'reject')}
                                                    >
                                                        <XCircle size={14} />
                                                    </NeuralButton>
                                                    <NeuralButton
                                                        variant="primary"
                                                        className="h-9 px-4 bg-emerald-500 text-black hover:bg-emerald-400"
                                                        onClick={() => verifyPayment(o._id, 'approve')}
                                                    >
                                                        <CheckCircle size={14} className="mr-2" /> Approve
                                                    </NeuralButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingVerifications.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">
                                                All financial protocols cleared
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </NeuralCard>

                    {/* Delivery Verification HUD */}
                    <NeuralCard className="bg-emerald-500/5 border-emerald-500/10" delay={0.6}>
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck className="text-emerald-400" size={24} />
                            <h4 className="text-lg font-bold">Logistics Handover Protocol</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div className="relative">
                                <NeuralInput
                                    label="Manifest ID"
                                    placeholder="Scan or enter ID..."
                                    value={verifyOrderId}
                                    onChange={(e) => setVerifyOrderId(e.target.value)}
                                />
                                <button
                                    onClick={() => setShowDeliveryScanner(true)}
                                    className="absolute right-4 top-[38px] text-[var(--text-secondary)] hover:text-emerald-400 transition-colors"
                                >
                                    <Camera size={18} />
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row items-end gap-4">
                                <div className="w-full sm:flex-1">
                                    <NeuralInput
                                        label="Authorization OTP"
                                        placeholder="6-digit protocol..."
                                        value={verifyOtp}
                                        onChange={(e) => setVerifyOtp(e.target.value)}
                                        icon={Key}
                                    />
                                </div>
                                <NeuralButton
                                    onClick={handleCompleteDelivery}
                                    className="w-full sm:w-auto h-[46px] bg-emerald-500 text-black hover:bg-emerald-400 whitespace-nowrap"
                                >
                                    Seal Handover
                                </NeuralButton>
                            </div>
                        </div>
                    </NeuralCard>
                </div>

                {/* Right Column: Scanner & Tools */}
                <div className="space-y-8">
                    <NeuralCard className="bg-brand-blue/5 border-brand-blue/20" delay={0.7}>
                        <div className="flex items-center gap-3 mb-6">
                            <Scan className="text-brand-blue" size={20} />
                            <h4 className="text-sm font-bold uppercase tracking-widest">Neural Scanner</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                                <input
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-blue/30 transition-all placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
                                    placeholder="Identify Asset SKU..."
                                    value={scanCode}
                                    onChange={e => setScanCode(e.target.value)}
                                />
                            </div>
                            <NeuralButton variant="secondary" className="w-full text-[10px]" onClick={() => setShowScanner(true)}>
                                <Camera size={14} className="mr-2" /> Activate HUD Scanner
                            </NeuralButton>

                            <AnimatePresence>
                                {scannedProduct && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-4 space-y-4"
                                    >
                                        <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--card-border)] border-l-4 border-l-brand-blue">
                                            <p className="font-bold text-sm text-[var(--text-primary)] mb-1">{scannedProduct.name}</p>
                                            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-4">Stock Level: {scannedProduct.quantity}</p>
                                            <div className="flex gap-2">
                                                <NeuralButton variant="secondary" className="flex-1 h-10" onClick={() => updateStock(-1)}>
                                                    <Minus size={14} />
                                                </NeuralButton>
                                                <NeuralButton variant="secondary" className="flex-1 h-10 border-emerald-500/30 text-emerald-400" onClick={() => updateStock(1)}>
                                                    <Plus size={14} />
                                                </NeuralButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </NeuralCard>

                    <div className="grid grid-cols-1 gap-4">
                        <NeuralButton
                            variant="secondary"
                            className="justify-between group h-14"
                            onClick={() => window.location.href = '/products'}
                        >
                            <span className="flex items-center gap-3">
                                <Boxes size={18} className="text-brand-blue" /> Asset Management
                            </span>
                            <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                        </NeuralButton>
                        <NeuralButton
                            variant="secondary"
                            className="justify-between group h-14"
                            onClick={() => window.location.href = '/orders'}
                        >
                            <span className="flex items-center gap-3">
                                <Clock size={18} className="text-brand-pink" /> Acquisition Flow
                            </span>
                            <ChevronRight size={16} className="text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
                        </NeuralButton>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div id="neural-feed">
                    <NeuralNotifications />
                </div>
                <CommunicationsHub />
            </div>
        </div>
    );
};

const CommunicationsHub = () => {
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [targetEmail, setTargetEmail] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminMessages, setAdminMessages] = useState([]);

    // Fetch Admin Messages
    const fetchAdminMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdminMessages(data);
        } catch (error) { console.error("Msg Error", error); }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${config.API_BASE_URL}/api/dashboard/users-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(data.filter(u => u.role === 'user' || u.role === 'admin' || u.role === 'manager'));
            } catch (error) { console.error(error); }
        };
        fetchUsers();
        fetchAdminMessages();
        const interval = setInterval(fetchAdminMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!targetEmail || !title || !message) {
            addToast("Fill all directive parameters", "warning");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${config.API_BASE_URL}/api/dashboard/send-message`,
                { toEmail: targetEmail, title, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            addToast("✨ Message sent successfully!", "success");
            setTitle(''); setMessage('');
        } catch (error) {
            addToast(error.response?.data?.message || "Failed to send", "error");
        }
        setLoading(false);
    };

    const { user } = useAuth();

    // Filter messages
    const incomingMessages = adminMessages.filter(m => m.sender && m.sender.role && m.sender.role.toLowerCase() === 'admin');
    const myLastMessage = adminMessages.find(m => m.sender && m.sender._id === user?._id);

    return (
        <NeuralCard className="bg-brand-pink/5 border-brand-pink/20 space-y-8" delay={0.9}>
            {/* INCOMING HQ DIRECTIVES */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-blue rounded-lg">
                        <MessageSquare className="text-white" size={20} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">HQ Inbound</h4>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Directives from Central Command</p>
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-3 bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--card-border)] mb-6">
                    {incomingMessages.length === 0 && <p className="text-xs text-center py-4 opacity-50">No active directives.</p>}
                    {incomingMessages.map(msg => (
                        <div key={msg._id} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-brand-blue/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-brand-blue">{msg.sender.name} [HQ]</span>
                                <span className="text-[10px] opacity-50 font-mono">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{msg.content}</p>
                        </div>
                    ))}
                </div>

                {/* LATEST OUTGOING STATUS */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Last Uplink Status</p>
                </div>
                <div className="bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--card-border)] opacity-80">
                    {!myLastMessage ? (
                        <p className="text-[10px] text-center opacity-50">No recent transmissions.</p>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-emerald-400">YOU SENT</span>
                                <span className="text-[9px] opacity-40 font-mono">{new Date(myLastMessage.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-xs text-[var(--text-primary)] truncate">{myLastMessage.content}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* SEND MESSAGE FORM */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Send className="text-brand-pink" size={20} />
                    <div>
                        <h4 className="text-lg font-bold">Field Operative Comms</h4>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Issue Orders to Staff</p>
                    </div>
                </div>
                <form onSubmit={sendMessage} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Target Operative</label>
                            <select
                                className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-all text-sm appearance-none"
                                value={targetEmail}
                                onChange={e => setTargetEmail(e.target.value)}
                                required
                            >
                                <option value="" className="bg-[var(--bg-primary)]">Identify User...</option>
                                {users.map(u => (
                                    <option key={u.email} value={u.email} className="bg-[var(--bg-primary)]">{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <NeuralInput
                            label="Transmission Subject"
                            placeholder="Directive title..."
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Directive content</label>
                        <textarea
                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-all min-h-[100px] text-sm"
                            placeholder="Package mission instructions..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <NeuralButton type="submit" disabled={loading} className="px-12 bg-brand-pink hover:bg-brand-pink/90">
                            {loading ? 'Transmitting...' : 'Initiate Broadcast'}
                        </NeuralButton>
                    </div>
                </form>
            </div>
        </NeuralCard>
    );
};

export default ManagerDashboard;

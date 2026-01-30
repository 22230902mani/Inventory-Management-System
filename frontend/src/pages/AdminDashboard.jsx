import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar as RechartsBar, Legend
} from 'recharts';
import {
    Users,
    Package,
    AlertTriangle,
    ShoppingCart,
    DollarSign,
    Scan,
    Camera,
    Search,
    Activity,
    Database,
    ShieldCheck,
    Send,
    Plus,
    CheckCircle,
    Minus,
    TrendingUp,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from '../components/Scanner';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralNotifications from '../components/NeuralNotifications';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        lowStockProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        outOfStockCount: 0
    });
    const [pendingProducts, setPendingProducts] = useState([]);

    const [scanCode, setScanCode] = useState('');
    const [scannedProduct, setScannedProduct] = useState(null);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:6700/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchPending = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:6700/api/inventory/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingProducts(data);
            } catch (error) { console.error(error); }
        };
        fetchStats();
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:6700/api/inventory/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Asset Authorized & Deployed to Main Grid.");
            setPendingProducts(pendingProducts.filter(p => p._id !== id));
        } catch (error) {
            alert("Authorization Failed");
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:6700/api/inventory/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Protocol Violation: Asset Rejected.");
            setPendingProducts(pendingProducts.filter(p => p._id !== id));
        } catch (error) {
            alert("Rejection Failed");
        }
    };

    const handleScan = async (e) => {
        if (e) e.preventDefault();
        if (!scanCode) return;
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:6700/api/inventory/barcode/${scanCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScannedProduct(data);
            setScanCode('');
        } catch (error) {
            alert('Product not found or error scanning');
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
            await axios.put(`http://localhost:6700/api/inventory/${scannedProduct._id}`, { quantity: newQty }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScannedProduct({ ...scannedProduct, quantity: newQty });
        } catch (error) {
            console.error(error);
        }
    };

    // Prepare data for Recharts
    const performanceData = [
        { name: 'Revenue', value: stats.totalRevenue },
        { name: 'Target', value: stats.totalRevenue * 1.2 }, // Dummy target
    ];

    const distributionData = [
        { name: 'Functional', value: stats.totalProducts - (stats.lowStockProducts || 0) - (stats.outOfStockCount || 0) },
        { name: 'Low Stock', value: stats.lowStockProducts || 0 },
        { name: 'Depleted', value: stats.outOfStockCount || 0 },
    ];

    const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 pb-12">
            {showScanner && (
                <Scanner onScan={handleCamScan} onClose={() => setShowScanner(false)} />
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NeuralCard gradient="blue" delay={0.1}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Total Capital</p>
                            <h3 className="text-2xl font-black text-[var(--text-primary)]">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <DollarSign className="text-blue-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>

                <NeuralCard gradient="pink" delay={0.2}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Active Orders</p>
                            <h3 className="text-2xl font-black text-[var(--text-primary)]">{stats.totalOrders}</h3>
                        </div>
                        <div className="p-3 bg-pink-500/20 rounded-xl">
                            <ShoppingCart className="text-pink-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>

                <NeuralCard gradient="green" delay={0.3}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Total Inventory</p>
                            <h3 className="text-2xl font-black text-[var(--text-primary)]">{stats.totalProducts}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Package className="text-emerald-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>

                <NeuralCard className="bg-rose-500/5 border-rose-500/20" delay={0.4}>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Depleted Units</p>
                            <h3 className="text-2xl font-black text-rose-400">{stats.outOfStockCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-rose-500/20 rounded-xl">
                            <AlertTriangle className="text-rose-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>
            </div>

            {/* Approvals Section */}
            {pendingProducts.length > 0 && (
                <NeuralCard className="bg-brand-pink/5 border-brand-pink/20" delay={0.45}>
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="text-brand-pink" size={24} />
                        <h4 className="text-lg font-bold">Inbox: Innovation Approvals</h4>
                        <NeuralBadge variant="pending">{pendingProducts.length} Awaiting Protocol</NeuralBadge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingProducts.map(p => (
                            <div key={p._id} className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] hover:border-brand-pink/50 transition-all flex flex-col justify-between gap-4">
                                {p.images && p.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto mb-2 custom-scrollbar pb-2">
                                        {p.images.map((img, idx) => (
                                            <img key={idx} src={`http://localhost:6700${img}`} className="w-16 h-16 object-cover rounded-lg border border-white/10" alt="evidence" />
                                        ))}
                                    </div>
                                )}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h5 className="font-bold text-[var(--text-primary)]">{p.name}</h5>
                                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">{p.sku}</span>
                                    </div>
                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                                        Company: <span className="text-white">{p.companyName || 'N/A'}</span>
                                    </p>
                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                                        Prop: <span className="text-brand-blue">{p.addedBy?.name || 'Unknown Agent'}</span>
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{p.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
                                    <p className="font-black text-[var(--text-primary)]">₹{p.price}</p>
                                    <div className="flex gap-2">
                                        <NeuralButton
                                            onClick={() => handleReject(p._id)}
                                            className="h-8 px-4 text-[10px] bg-rose-500 hover:bg-rose-400 text-black"
                                        >
                                            REJECT
                                        </NeuralButton>
                                        <NeuralButton
                                            onClick={() => handleApprove(p._id)}
                                            className="h-8 px-4 text-[10px] bg-emerald-500 hover:bg-emerald-400 text-black"
                                        >
                                            AUTHORIZE
                                        </NeuralButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </NeuralCard>
            )}

            {/* Scanner HUD */}
            <NeuralCard className="bg-brand-blue/5 border-brand-blue/20 overflow-visible" delay={0.5}>
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center gap-3">
                            <Scan className="text-brand-blue" size={24} />
                            <h4 className="text-lg font-bold tracking-tight">Neural Scanner Interface</h4>
                        </div>
                        <form onSubmit={handleScan} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
                                    placeholder="Awaiting SKU/Barcode signal..."
                                    value={scanCode}
                                    onChange={e => setScanCode(e.target.value)}
                                />
                            </div>
                            <NeuralButton type="button" variant="secondary" onClick={() => setShowScanner(true)}>
                                <Camera size={18} />
                            </NeuralButton>
                            <NeuralButton type="submit">Verify</NeuralButton>
                        </form>
                    </div>

                    <AnimatePresence mode="wait">
                        {scannedProduct ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 w-full bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between"
                            >
                                <div className="space-y-1">
                                    <h5 className="font-bold text-brand-blue">{scannedProduct.name}</h5>
                                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest">
                                        ID: {scannedProduct._id.slice(-8)} • QTY: {scannedProduct.quantity}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <NeuralButton variant="secondary" onClick={() => updateStock(-1)} className="w-10 h-10 p-0 rounded-full">
                                        <Minus size={16} />
                                    </NeuralButton>
                                    <NeuralButton variant="secondary" onClick={() => updateStock(1)} className="w-10 h-10 p-0 rounded-full border-brand-green/30 text-emerald-400">
                                        <Plus size={16} />
                                    </NeuralButton>
                                    <NeuralButton variant="danger" onClick={() => setScannedProduct(null)} className="w-10 h-10 p-0 rounded-full">
                                        <X size={16} />
                                    </NeuralButton>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex-1 w-full flex items-center justify-center border-2 border-dashed border-[var(--card-border)] rounded-2xl h-[72px]">
                                <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Scanner Offline</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </NeuralCard>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NeuralCard className="h-[450px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-blue/10 rounded-lg">
                                <TrendingUp className="text-brand-blue" size={20} />
                            </div>
                            <h4 className="text-lg font-bold">Revenue Manifest</h4>
                        </div>
                        <NeuralBadge variant="success">Real-time sync</NeuralBadge>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[{ x: 'Start', y: 0 }, { x: 'Current', y: stats.totalRevenue }]}>
                                <defs>
                                    <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="x" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <RechartsTooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorY)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </NeuralCard>

                <NeuralCard className="h-[450px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-pink/10 rounded-lg">
                                <Activity className="text-brand-pink" size={20} />
                            </div>
                            <h4 className="text-lg font-bold">Inventory Flow</h4>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </NeuralCard>
            </div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <NeuralCard className="lg:col-span-2 overflow-hidden" delay={0.6}>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Clock className="text-brand-blue" size={20} />
                            <h4 className="text-lg font-bold">Recent Operative Logs</h4>
                        </div>
                        <button className="text-[10px] font-extrabold text-brand-blue uppercase tracking-widest hover:underline">
                            View Archive
                        </button>
                    </div>

                    <div className="space-y-4">
                        {stats.recentOrders.length > 0 ? stats.recentOrders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                key={order._id}
                                className="flex items-center justify-between p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--card-border)] hover:bg-[var(--btn-secondary-bg)] transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-pink/20 flex items-center justify-center text-brand-blue font-bold">
                                        <ShoppingCart size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-[var(--text-primary)]">Order #{order._id.slice(-6)}</p>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                                            By <span className="text-brand-blue">{order.user?.name || 'Unknown'}</span> • {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-emerald-400">+₹{order.totalAmount.toLocaleString()}</p>
                                    <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Completed</p>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="text-center py-12 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">No Recent Logs</p>
                        )}
                    </div>
                </NeuralCard>

                <div className="space-y-8">
                    <NeuralCard className="bg-emerald-500/5 border-emerald-500/10" delay={0.7}>
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-emerald-400" size={20} />
                            <h4 className="text-sm font-bold uppercase tracking-widest">System Integrity</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
                                    <Database size={12} /> Neural Core
                                </span>
                                <span className="text-emerald-400">OPTIMAL</span>
                            </div>
                            <div className="w-full bg-[var(--input-bg)] h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full w-[85%] animate-pulse" />
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold pt-2">
                                <span className="text-[var(--text-secondary)] uppercase tracking-widest">Uptime Protcol</span>
                                <span className="text-[var(--text-primary)]">99.98%</span>
                            </div>
                        </div>
                    </NeuralCard>

                    <NeuralCard gradient="pink" className="p-0 overflow-hidden" delay={0.8}>
                        <div className="p-6 bg-white/5 space-y-2">
                            <h4 className="font-black tracking-tighter text-lg italic uppercase text-[var(--text-primary)]">Mission Objective</h4>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Maintaining zero-latency inventory flow. Monitor low-stock assets to prevent supply-chain degradation.
                            </p>
                        </div>
                    </NeuralCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div id="neural-feed">
                    <NeuralNotifications />
                </div>
                <MessagingSection />
            </div>
        </div>
    );
};

const MessagingSection = () => {
    const [users, setUsers] = useState([]);
    const [targetEmail, setTargetEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:6700/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(data);
        } catch (error) { console.error("Msg Error", error); }
    };



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:6700/api/dashboard/users-list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(data);
            } catch (error) { console.error(error); }
        };
        fetchUsers();
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!targetEmail || !message) return alert("Fill all fields");
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const targetUser = users.find(u => u.email === targetEmail);
            if (!targetUser) { alert("User not found"); setLoading(false); return; }

            await axios.post('http://localhost:6700/api/messages',
                { receiverId: targetUser._id, content: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Message dispatched successfully.");
            setMessage('');
            fetchMessages();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send");
        }
        setLoading(false);
    };

    return (
        <NeuralCard className="p-0 overflow-hidden border-none" delay={0.9} id="neural-feed">
            <div className="relative group p-10 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <div className="relative z-10 flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3 space-y-6 flex flex-col">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <Send className="text-white animate-bounce" size={28} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black tracking-tight text-white uppercase italic">Neural Sync</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Encrypted link to field operatives.
                            </p>
                        </div>
                        <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-y-auto custom-scrollbar min-h-[300px] max-h-[400px]">
                            {messages.filter(msg => msg.sender.role !== 'sales' && msg.sender.role !== 'admin' && msg.sender.role !== 'manager').length === 0 && <p className="text-white/40 text-xs text-center flex items-center justify-center h-full">No incoming signals.</p>}
                            {messages.filter(msg => msg.sender.role !== 'sales' && msg.sender.role !== 'admin' && msg.sender.role !== 'manager').map(msg => (
                                <div key={msg._id} className="mb-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-[11px] font-bold text-emerald-400">
                                            {msg.sender.name} <span className="text-white/40">[{msg.sender.role.toUpperCase()}]</span>
                                        </p>
                                        <p className="text-[9px] text-white/30">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <p className="text-sm text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{msg.content}</p>
                                </div>
                            ))}

                        </div>


                    </div>

                    <form onSubmit={sendMessage} className="flex-1 space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Operative</label>
                            <select
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm appearance-none"
                                value={targetEmail}
                                onChange={e => setTargetEmail(e.target.value)}
                                required
                            >
                                <option value="" className="bg-[#1e1b4b]">Identify Target...</option>
                                {users.map(u => (
                                    <option key={u.email} value={u.email} className="bg-[#1e1b4b]">
                                        {u.name} [{u.role.toUpperCase()}]
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Encypted Content</label>
                            <textarea
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all min-h-[120px] text-sm"
                                placeholder="Enter directive parameters..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <NeuralButton
                                type="submit"
                                disabled={loading}
                                className="min-w-[200px] h-14 bg-white text-[#1e1b4b] hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? 'Transmitting...' : (
                                    <span className="flex items-center gap-3">
                                        INITIALIZE SYNC <Send size={18} />
                                    </span>
                                )}
                            </NeuralButton>
                        </div>
                    </form>
                </div>
            </div>
        </NeuralCard >
    );
};

export default AdminDashboard;

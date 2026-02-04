import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar as RechartsBar, Legend
} from 'recharts';
import {
    Users,
    Package,
    AlertTriangle,
    ShoppingCart,
    IndianRupee,
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
import NeuralCamera from '../components/NeuralCamera';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralNotifications from '../components/NeuralNotifications';
import SystemMetricsChart from '../components/SystemMetricsChart';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        lowStockProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalPayouts: 0,
        netBalance: 0,
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
                const { data } = await axios.get(`${config.API_BASE_URL}/api/dashboard/stats`, {
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
                const { data } = await axios.get(`${config.API_BASE_URL}/api/inventory/pending`, {
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
            await axios.put(`${config.API_BASE_URL}/api/inventory/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast("Asset Authorized & Deployed to Main Grid.", "success");
            setPendingProducts(pendingProducts.filter(p => p._id !== id));
        } catch (error) {
            addToast("Authorization Failed", "error");
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${config.API_BASE_URL}/api/inventory/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast("Protocol Violation: Asset Rejected.", "warning");
            setPendingProducts(pendingProducts.filter(p => p._id !== id));
        } catch (error) {
            addToast("Rejection Failed", "error");
        }
    };

    const handleScan = async (e) => {
        if (e) e.preventDefault();
        if (!scanCode) return;
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/inventory/barcode/${scanCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setScannedProduct(data);
            setScanCode('');
            addToast(`Verrified: ${data.name}`, "info");
        } catch (error) {
            addToast(error.response?.data?.message || 'Verification Error', "error");
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Total Order Revenue', mobileLabel: 'REVENUE', value: `₹${stats.totalRevenue?.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'dark:from-[#022c22] dark:to-[#064e3b] dark:border-emerald-500/20', lightColor: 'bg-emerald-100 border-emerald-200', iconColor: 'text-emerald-600 dark:text-emerald-400', trend: 12.5 },
                    { label: 'Sales Payouts', mobileLabel: 'COMMISSION', value: `₹${stats.totalPayouts?.toLocaleString('en-IN')}`, icon: Send, color: 'dark:from-[#451a03] dark:to-[#78350f] dark:border-amber-500/20', lightColor: 'bg-amber-100 border-amber-200', iconColor: 'text-amber-600 dark:text-amber-400', trend: null },
                    { label: 'Company Net Profit', mobileLabel: 'PROFIT', value: `₹${stats.netBalance?.toLocaleString('en-IN')}`, icon: ShieldCheck, color: 'dark:from-[#172554] dark:to-[#1e3a8a] dark:border-blue-500/20', lightColor: 'bg-blue-100 border-blue-200', iconColor: 'text-blue-600 dark:text-blue-400', trend: 12 },
                    { label: 'Critical Alerts', mobileLabel: 'ALERTS', value: stats.outOfStockCount || 0, icon: AlertTriangle, color: 'dark:from-[#4c0519] dark:to-[#831843] dark:border-rose-500/20', lightColor: 'bg-rose-100 border-rose-200', iconColor: 'text-rose-600 dark:text-rose-400', trend: -5 }
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
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{stat.value}</h3>
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


            {/* Proposal Manifest Section */}
            {pendingProducts.length > 0 && (
                <NeuralCard className="bg-brand-pink/5 border-brand-pink/20" delay={0.45}>
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle className="text-brand-pink" size={24} />
                        <h4 className="text-lg font-black uppercase italic italic tracking-tighter text-[var(--text-primary)]">Central Protocol Manifest</h4>
                        <span className="h-6 px-3 bg-brand-pink/20 text-brand-pink text-[10px] font-black uppercase flex items-center rounded-full border border-brand-pink/30">
                            {pendingProducts.filter(p => p.status === 'pending').length} Pending Protocols
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingProducts.map(p => (
                            <div key={p._id} className="p-5 rounded-[30px] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-brand-pink/50 transition-all flex flex-col justify-between gap-4">
                                {p.images && p.images.length > 0 && (
                                    <div className="flex gap-2 mb-2">
                                        {p.images.slice(0, 3).map((img, idx) => (
                                            <img key={idx} src={`${config.API_BASE_URL}${img}`} className="w-14 h-14 object-cover rounded-xl border border-[var(--card-border)]" alt="evidence" />
                                        ))}
                                    </div>
                                )}
                                <div>
                                    <h5 className="font-black text-[var(--text-primary)] uppercase italic tracking-tight text-lg leading-tight mb-1">{p.name}</h5>
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">#SKU-{p.sku?.toUpperCase()}</p>
                                        <NeuralBadge variant={p.status === 'active' ? 'success' : p.status === 'rejected' ? 'danger' : 'pending'}>
                                            {p.status.toUpperCase()}
                                        </NeuralBadge>
                                    </div>
                                    <div className="space-y-1.5 mb-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                                            <div className="w-1 h-1 bg-pink-500 rounded-full" /> Agent: <span className="text-[var(--text-primary)]">{p.addedBy?.name || 'Ghost'}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">"{p.description}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                                    <p className="font-black text-xl italic tracking-tighter text-[var(--text-primary)]">₹{p.price}</p>
                                    {p.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleReject(p._id)} className="h-10 px-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-black font-black text-[10px] uppercase transition-all rounded-xl">REJECT</button>
                                            <button onClick={() => handleApprove(p._id)} className="h-10 px-6 bg-white text-black hover:bg-white/90 font-black text-[10px] uppercase transition-all rounded-xl">AUTHORIZE</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">PROTOCOL</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {p.status === 'active' ? 'ACTIVE' : 'TERMINATED'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </NeuralCard>
            )}



            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <NeuralCard className="lg:col-span-2 h-[450px] flex flex-col relative overflow-hidden bg-[var(--bg-secondary)] border-[var(--card-border)]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Economic Trajectory</h4>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1">Growth Forecast v5.0</p>
                            </div>
                        </div>
                        <div className="flex bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--card-border)]">
                            {['7D', '30D', '90D'].map(d => (
                                <button key={d} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${d === '30D' ? 'bg-[var(--btn-secondary-bg)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { x: 'MAR', y: stats.totalRevenue * 0.4 },
                                { x: 'APR', y: stats.totalRevenue * 0.7 },
                                { x: 'MAY', y: stats.totalRevenue * 0.8 },
                                { x: 'JUN', y: stats.totalRevenue * 1.1 },
                                { x: 'JUL', y: stats.totalRevenue }
                            ]}>
                                <defs>
                                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                                <XAxis
                                    dataKey="x"
                                    stroke="transparent"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="transparent"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                    tick={{ fill: 'var(--text-secondary)', fontWeight: 900 }}
                                />
                                <RechartsTooltip
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[var(--tooltip-bg)] border border-[var(--card-border)] p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                                                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{payload[0].payload.x} METRIC</p>
                                                    <p className="text-lg font-black text-[var(--tooltip-text)] italic tracking-tighter">₹{payload[0].value.toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="y"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMain)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </NeuralCard>

                <NeuralCard className="h-[450px] flex flex-col bg-[var(--bg-secondary)] border-[var(--card-border)]">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center text-pink-400 border border-[var(--card-border)] shadow-inner">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Asset Spread</h4>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1">Category Distribution</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#ec4899', '#10b981', '#f59e0b'][index % 4]} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">{value}</span>}
                                />
                                <RechartsTooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[var(--tooltip-bg)] border border-[var(--card-border)] p-4 rounded-2xl shadow-2xl">
                                                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">{payload[0].name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                                        <p className="text-sm font-black text-[var(--tooltip-text)]">{payload[0].value} Units</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text for Pie */}
                        <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">TOTAL</span>
                            <span className="text-3xl font-black text-[var(--text-primary)] italic tracking-tighter leading-none">{stats.totalProducts}</span>
                        </div>
                    </div>
                </NeuralCard>
            </div>

            {/* Recent Activity & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <NeuralCard className="lg:col-span-2 overflow-hidden" delay={0.6}>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Clock className="text-brand-blue" size={20} />
                            <h4 className="text-lg font-black uppercase italic tracking-tighter text-[var(--text-primary)]">Neural Operative Logs</h4>
                        </div>
                        <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest border border-brand-blue/20 px-4 py-2 rounded-xl hover:bg-brand-blue hover:text-white transition-all">
                            Archive Access
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {stats.recentOrders.length > 0 ? stats.recentOrders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * idx }}
                                key={order._id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/20 transition-all gap-4"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-[var(--card-border)] flex items-center justify-center text-brand-blue">
                                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <p className="font-black text-[var(--text-primary)] uppercase italic tracking-tight truncate text-xs sm:text-sm leading-snug">Sync Vector #{order._id.slice(-6).toUpperCase()}</p>
                                        <div className="flex items-center gap-1.5 pt-1">
                                            <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest shrink-0">Operative:</span>
                                            <span className="text-[9px] text-brand-blue font-black uppercase tracking-widest truncate">{order.user?.name || 'ROOT'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 pl-0 sm:pl-4">
                                    <p className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest sm:hidden">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                    <div className="text-right">
                                        <p className="font-black text-emerald-500 text-base sm:text-lg italic tracking-tighter text-right">+₹{order.totalAmount.toLocaleString()}</p>
                                        <div className="flex items-center justify-end gap-1.5 text-[8px] sm:text-[9px] text-emerald-500/60 font-black uppercase tracking-[0.2em]">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Finalized
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="text-center py-20 text-white/20 font-black uppercase tracking-[0.4em] text-xs">Awaiting Synchronization...</p>
                        )}
                    </div>
                </NeuralCard>

                <div className="space-y-8">
                    <NeuralCard className="bg-emerald-500/5 border-emerald-500/10 relative overflow-hidden" delay={0.7}>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px]" />
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldCheck className="text-emerald-400" size={24} />
                            <h4 className="text-sm font-black uppercase italic tracking-tighter text-[var(--text-primary)]">System Integrity</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] leading-none">
                                    <span className="flex items-center gap-2">
                                        Neural Core <span className="text-emerald-400">NOMINAL</span>
                                    </span>
                                    <span>98%</span>
                                </div>
                                <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ duration: 2 }} className="bg-emerald-400 h-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] leading-none">
                                    <span className="flex items-center gap-2">
                                        Sync Hub <span className="text-blue-400">ACTIVE</span>
                                    </span>
                                    <span>24ms</span>
                                </div>
                                <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 2, delay: 0.5 }} className="bg-blue-400 h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <div className="p-3 bg-[var(--input-bg)] rounded-2xl border border-[var(--card-border)]">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Uptime</p>
                                    <p className="text-sm font-black text-[var(--text-primary)] italic">99.99%</p>
                                </div>
                                <div className="p-3 bg-[var(--input-bg)] rounded-2xl border border-[var(--card-border)]">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Nodes</p>
                                    <p className="text-sm font-black text-[var(--text-primary)] italic">14 Alive</p>
                                </div>
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
                <div id="neural-feed" className="w-full">
                    <NeuralNotifications />
                </div>
                <SystemMetricsChart stats={stats} />
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, IndianRupee, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInventory: 0,
        totalSales: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    // Sample data for charts (replace with real API data)
    const salesData = [
        { month: 'Jan', sales: 4000, revenue: 24000 },
        { month: 'Feb', sales: 3000, revenue: 18000 },
        { month: 'Mar', sales: 5000, revenue: 30000 },
        { month: 'Apr', sales: 4500, revenue: 27000 },
        { month: 'May', sales: 6000, revenue: 36000 },
        { month: 'Jun', sales: 7500, revenue: 45000 },
    ];

    const inventoryData = [
        { category: 'Elec', count: 450 },
        { category: 'Cloth', count: 320 },
        { category: 'Food', count: 280 },
        { category: 'Furn', count: 150 },
        { category: 'Books', count: 200 },
    ];

    const userGrowthData = [
        { month: 'Jan', users: 120 },
        { month: 'Feb', users: 145 },
        { month: 'Mar', users: 180 },
        { month: 'Apr', users: 210 },
        { month: 'May', users: 250 },
        { month: 'Jun', users: 300 },
    ];

    const userRoleData = [
        { name: 'Admin', value: 5, color: '#8B5CF6' },
        { name: 'Manager', value: 15, color: '#3B82F6' },
        { name: 'Sales', value: 45, color: '#EC4899' },
        { name: 'User', value: 235, color: '#10B981' },
    ];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch users count
            const usersRes = await axios.get('http://localhost:6700/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch inventory count
            const inventoryRes = await axios.get('http://localhost:6700/api/inventory', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch orders/sales count
            const ordersRes = await axios.get('http://localhost:6700/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            setStats({
                totalUsers: usersRes.data.length || 0,
                totalInventory: inventoryRes.data.length || 0,
                totalSales: ordersRes.data.length || 0,
                totalRevenue: totalRevenue || 0
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-4 sm:p-6 rounded-[28px] bg-gradient-to-br border overflow-hidden group hover:shadow-2xl transition-all duration-500 ${color}`}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="relative flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1 truncate">{title}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white truncate">{value.toLocaleString()}</h3>
                    {trend && (
                        <div className={`flex items-center gap-1 text-[10px] font-black mt-1 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trend > 0 ? <TrendingUp size={10} /> : <Activity size={10} />}
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 p-2.5 sm:p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
                    <Icon className="text-white" size={20} />
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white p-4 sm:p-8 overflow-y-auto">
            {/* Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 space-y-2"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60">Live Intelligence</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">Core</span> Metrics
                </h1>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                <StatCard
                    title="Operatives"
                    value={stats.totalUsers}
                    icon={Users}
                    color="from-purple-600/10 to-purple-900/10 border-purple-500/20"
                    trend={12}
                />
                <StatCard
                    title="Stock"
                    value={stats.totalInventory}
                    icon={Package}
                    color="from-blue-600/10 to-blue-900/10 border-blue-500/20"
                    trend={-5}
                />
                <StatCard
                    title="Orders"
                    value={stats.totalSales}
                    icon={TrendingUp}
                    color="from-pink-600/10 to-pink-900/10 border-pink-500/20"
                    trend={24}
                />
                <StatCard
                    title="Revenue"
                    value={`₹${stats.totalRevenue > 1000 ? (stats.totalRevenue / 1000).toFixed(1) + 'k' : stats.totalRevenue}`}
                    icon={IndianRupee}
                    color="from-emerald-600/10 to-emerald-900/10 border-emerald-500/20"
                    trend={18}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
                {/* Sales & Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-8 bg-[#0F0F14]/80 backdrop-blur-xl border border-white/5 rounded-[32px] group"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <BarChart3 className="text-purple-400" size={18} />
                            </div>
                            <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight">Financial Flow</h2>
                        </div>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#ffffff20"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#ffffff20"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#16161D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '900' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} fill="url(#salesGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 sm:p-8 bg-[#0F0F14]/80 backdrop-blur-xl border border-white/5 rounded-[32px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Users className="text-blue-400" size={18} />
                            </div>
                            <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight">User Expansion</h2>
                        </div>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="month" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#16161D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '900' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={4} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Inventory Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 sm:p-8 bg-[#0F0F14]/80 backdrop-blur-xl border border-white/5 rounded-[32px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                                <Package className="text-pink-400" size={18} />
                            </div>
                            <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight">Stock Density</h2>
                        </div>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={inventoryData} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="category"
                                    stroke="#ffffff20"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#16161D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: '900' }}
                                />
                                <Bar dataKey="count" fill="#EC4899" radius={[6, 6, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Roles Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 sm:p-8 bg-[#0F0F14]/80 backdrop-blur-xl border border-white/5 rounded-[32px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <PieChart className="text-emerald-400" size={18} />
                            </div>
                            <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight">Role Division</h2>
                        </div>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={userRoleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {userRoleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: 'var(--tooltip-text)', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--tooltip-text)', marginBottom: '4px' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;

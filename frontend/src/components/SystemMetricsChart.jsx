import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import axios from 'axios';
import NeuralCard from './ui/NeuralCard';
import { Activity } from 'lucide-react';
import config from '../config';

const SystemMetricsChart = ({ stats }) => {
    const [userCounts, setUserCounts] = useState({ admins: 0, managers: 0, users: 0, total: 0 });
    const [totalStock, setTotalStock] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Users to count roles
                const usersRes = await axios.get(`${config.API_BASE_URL}/api/dashboard/users-list`, config);
                const users = usersRes.data;
                const counts = users.reduce((acc, user) => {
                    const role = (user.role || 'user').toLowerCase();
                    acc[role] = (acc[role] || 0) + 1;
                    acc.total += 1;
                    return acc;
                }, { admins: 0, managers: 0, sales: 0, users: 0, total: 0 });
                // Map 'admin' usually isn't in users-list if it's the root, but let's assume it catches everyone or we just show what we have
                // Adjusting keys based on expected roles
                setUserCounts({
                    admins: counts.admin || 0,
                    managers: counts.manager || 0,
                    sales: counts.sales || 0,
                    users: counts.user || 0
                });

                // Fetch Products to sum stock
                // Assuming /api/inventory/products exists or similar. 
                // Using /api/dashboard/stats usually gives counts but not sum quantity
                // Let's try to fetch full list or maybe dashboard stats has it hidden?
                // Safest is to calculate if we can, or just display 0 if unavailable.
                // Assuming /api/products returns all products
                const prodRes = await axios.get(`${config.API_BASE_URL}/api/inventory`, config); // Adjust endpoint if needed
                if (Array.isArray(prodRes.data)) {
                    const stock = prodRes.data.reduce((sum, p) => sum + (p.quantity || 0), 0);
                    setTotalStock(stock);
                }

            } catch (error) {
                console.error("Error fetching detailed metrics", error);
            }
        };

        fetchData();
    }, []);

    // Prepare chart data
    // To handle scale issues (Revenue vs Users), we can use a custom scale or just let it be.
    // For a requested 'graph', a horizontal bar chart often works best for categorical comparison with labels.

    const chartData = [
        { name: 'Products', value: stats.totalProducts || 0, fill: '#3b82f6' }, // Blue
        { name: 'Total Stock', value: totalStock, fill: '#8b5cf6' }, // Violet
        { name: 'Low Stock', value: stats.lowStockProducts || 0, fill: '#f59e0b' }, // Amber
        { name: 'Out of Stock', value: stats.outOfStockCount || 0, fill: '#ef4444' }, // Red
        { name: 'Orders', value: stats.totalOrders || 0, fill: '#10b981' }, // Emerald
        // { name: 'Revenue', value: stats.totalRevenue || 0, fill: '#d946ef' }, // Pink - Removed from bar due to scale, shown as KPI
        { name: 'Admins', value: userCounts.admins, fill: '#6366f1' }, // Indigo
        { name: 'Managers', value: userCounts.managers, fill: '#0ea5e9' }, // Sky
        { name: 'Sales', value: userCounts.sales, fill: '#a855f7' }, // Purple
        { name: 'Users', value: userCounts.users, fill: '#14b8a6' }, // Teal
    ];

    // Formatter for large numbers
    const formatValue = (val) => {
        if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
        return val;
    };

    return (
        <NeuralCard className="h-full min-h-[400px] flex flex-col bg-[var(--bg-primary)] border-[var(--card-border)] relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue border border-brand-blue/20">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter text-[var(--text-primary)]">System Overview</h4>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Live Metrics</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Total Revenue</p>
                    <p className="text-xl font-black text-brand-pink italic tracking-tighter">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 relative z-10 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        barSize={24}
                    >
                        <defs>
                            {chartData.map((entry, index) => (
                                <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={entry.fill} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={entry.fill} stopOpacity={1} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" horizontal={false} strokeOpacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--bg-secondary)', opacity: 0.3 }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-[var(--tooltip-bg)] border border-[var(--card-border)] p-3 rounded-2xl shadow-xl backdrop-blur-xl ring-1 ring-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }} />
                                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{data.name}</p>
                                            </div>
                                            <p className="text-xl font-black text-white italic tracking-tighter" style={{ color: data.fill }}>
                                                {data.value.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]} animationDuration={1500}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} stroke={entry.fill} strokeWidth={1} />
                            ))}
                            <LabelList dataKey="value" position="right" formatter={formatValue} style={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </NeuralCard>
    );
};

export default SystemMetricsChart;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Search,
    Calendar,
    User as UserIcon,
    DollarSign,
    Activity,
    History,
    TrendingUp,
    Package
} from 'lucide-react';
import StatusDropdown from '../components/StatusDropdown';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('user');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const userRole = JSON.parse(localStorage.getItem('userInfo'))?.role || 'user';
        setRole(userRole);

        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const endpoint = userRole === 'user'
                ? 'http://localhost:6700/api/orders/my-orders'
                : 'http://localhost:6700/api/orders';

            try {
                const { data } = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error(error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:6700/api/orders/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
        } catch (error) {
            console.error(error);
            alert('Error updating status: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Received': return 'success';
            case 'Cancelled': return 'danger';
            case 'Pending Verification': return 'pending';
            default: return 'pending';
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <History className="text-brand-pink" size={24} />
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
                            {role === 'user' ? 'Personal Acquisitions' : 'Operational Flow'}
                        </h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase ml-9">
                        {role === 'user' ? 'Secure Order Registry' : 'Global Logistics Manifest'}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Identify Flow ID / Operative..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all placeholder:text-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <NeuralCard className="p-0 overflow-hidden" delay={0.2}>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="neural-table">
                        <thead>
                            <tr>
                                <th>Manifest ID</th>
                                <th>Target Operative</th>
                                <th>Credit Value</th>
                                <th>Timeline Date</th>
                                <th>Current Protocol</th>
                                {role !== 'user' && <th className="text-right pr-12">Authorization</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredOrders.map((order, idx) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <td className="font-mono text-[11px] text-white/60 tracking-wider font-bold">#{order._id.slice(-8)}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 border border-white/10">
                                                    {(order.user?.name || 'M')[0].toUpperCase()}
                                                </div>
                                                <span className="font-bold text-sm text-white">{order.user?.name || 'Identify Masked'}</span>
                                            </div>
                                        </td>
                                        <td className="font-black text-white italic">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {role === 'user' ? (
                                                <NeuralBadge variant={getStatusVariant(order.status)}>
                                                    {order.status}
                                                </NeuralBadge>
                                            ) : (
                                                <StatusDropdown
                                                    currentStatus={order.status}
                                                    onUpdate={(status) => updateStatus(order._id, status)}
                                                />
                                            )}
                                        </td>
                                        {role !== 'user' && (
                                            <td className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <div className="p-2 bg-brand-blue/10 rounded-lg group hover:bg-brand-blue/20 transition-colors cursor-pointer">
                                                        <Activity className="text-brand-blue" size={14} />
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                <ShoppingCart size={32} />
                            </div>
                            <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.4em]">No transaction manifests detected</p>
                        </div>
                    )}
                </div>
            </NeuralCard>
        </div>
    );
};

export default Orders;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import {
    Users as UsersIcon,
    Trash2,
    ShieldCheck,
    UserPlus,
    Search,
    Fingerprint,
    Database,
    TrendingUp,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import { twMerge } from 'tailwind-merge';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Terminate operative access permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${config.API_BASE_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            alert('Termination failed');
        }
    }

    const verifyUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${config.API_BASE_URL}/api/users/${id}/verify`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('✨ Operative verified successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to verify: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const managers = filteredUsers.filter(u => u.role === 'manager');
    const sales = filteredUsers.filter(u => u.role === 'sales');

    const UserGroup = ({ title, groupUsers, icon: Icon, theme = 'blue', delay = 0 }) => (
        <NeuralCard className="p-0 overflow-hidden flex flex-col h-full bg-[var(--card-bg)]" delay={delay}>
            <div className={`px-6 py-4 border-b border-[var(--card-border)] bg-${theme === 'pink' ? 'pink' : theme === 'purple' ? 'purple' : 'blue'}-500/5 flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${theme === 'pink' ? 'pink' : theme === 'purple' ? 'purple' : 'blue'}-500/10 text-${theme === 'pink' ? 'pink' : theme === 'purple' ? 'purple' : 'blue'}-500`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase italic tracking-wider text-[var(--text-primary)]">{title}</h3>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">{groupUsers.length} Active Nodes</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="neural-table w-full">
                    <thead>
                        <tr>
                            <th className="whitespace-nowrap">Operative ID</th>
                            <th className="whitespace-nowrap">Status</th>
                            <th className="text-right pr-6 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {groupUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-12 text-[var(--text-secondary)] opacity-50">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold">No Agents Found</p>
                                    </td>
                                </tr>
                            ) : (
                                groupUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-xs font-black">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-primary)] text-xs leading-tight">{user.name}</p>
                                                    <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wide truncate max-w-[120px]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <NeuralBadge variant={user.isVerified ? 'success' : 'danger'}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </NeuralBadge>
                                        </td>
                                        <td className="text-right pr-4">
                                            <div className="flex justify-end gap-1">
                                                {!user.isVerified && (
                                                    <button
                                                        onClick={() => verifyUser(user._id)}
                                                        className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                                                        title="Authorize"
                                                    >
                                                        <ShieldCheck size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
                                                    title="Terminate"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </NeuralCard>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <UsersIcon className="text-brand-blue" size={24} />
                        <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">Operative Registry</h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] tracking-[0.4em] uppercase ml-9">Authorized Personnel List</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Identify Operative / Signal..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all font-medium text-[var(--text-primary)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Split Layout for Managers & Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
                <UserGroup
                    title="Grid Managers"
                    groupUsers={managers}
                    icon={Database}
                    theme="blue"
                    delay={0.1}
                />
                <UserGroup
                    title="Sales Force"
                    groupUsers={sales}
                    icon={TrendingUp}
                    theme="purple"
                    delay={0.2}
                />
            </div>
        </div>
    );
};

export default Users;

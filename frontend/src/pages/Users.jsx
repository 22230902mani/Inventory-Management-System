import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users as UsersIcon,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    UserPlus,
    Search,
    Activity,
    Fingerprint
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
            const { data } = await axios.get('http://localhost:6700/api/users', {
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
            await axios.delete(`http://localhost:6700/api/users/${id}`, {
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
            await axios.put(`http://localhost:6700/api/users/${id}/verify`, {}, {
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
                        <UsersIcon className="text-brand-blue" size={24} />
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Operative Registry</h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase ml-9">Authorized Personnel List</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Identify Operative / Signal..."
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
                                <th>Operative Identification</th>
                                <th>Communication Link</th>
                                <th>Security Clearence</th>
                                <th>Verification Status</th>
                                <th className="text-right pr-12">Protocols</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-sm font-black border border-white/10">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-white leading-tight">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">{user._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="font-medium text-white/60 text-xs">{user.email}</td>
                                        <td>
                                            <span className={twMerge(
                                                "px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-widest uppercase border",
                                                user.role === 'admin' ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                                                    user.role === 'manager' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                                        "bg-brand-blue/10 text-brand-blue border-brand-blue/30"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <NeuralBadge variant={user.isVerified ? 'success' : 'danger'}>
                                                {user.isVerified ? 'Verified' : 'Unauthorized'}
                                            </NeuralBadge>
                                        </td>
                                        <td className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                {!user.isVerified && (
                                                    <NeuralButton
                                                        variant="secondary"
                                                        className="h-9 px-4 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                        onClick={() => verifyUser(user._id)}
                                                    >
                                                        <ShieldCheck size={14} className="mr-2" /> Authorize
                                                    </NeuralButton>
                                                )}
                                                <NeuralButton
                                                    variant="secondary"
                                                    className="h-9 px-3 border-white/5 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 transition-all"
                                                    onClick={() => deleteUser(user._id)}
                                                >
                                                    <Trash2 size={14} />
                                                </NeuralButton>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Fingerprint size={32} />
                            </div>
                            <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.4em]">No operative signals detected</p>
                        </div>
                    )}
                </div>
            </NeuralCard>
        </div>
    );
};

export default Users;

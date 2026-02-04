import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    History,
    RefreshCcw,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
    Clock,
    AlertCircle,
    Download,
    Search,
    CreditCard,
    IndianRupee,
    X
} from 'lucide-react';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';

const TransactionHistory = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        let token = localStorage.getItem('token');
        if (!token) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                token = JSON.parse(userInfo).token;
            }
        }

        if (!token) {
            navigate('/login');
            return;
        }

        setRefreshing(true);
        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched transactions:', res.data);
            setTransactions(res.data.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handlePayout = (payout) => {
        setSelectedPayout(payout);
        setShowPayoutModal(true);
    };

    const confirmPayout = async () => {
        if (!selectedPayout) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${config.API_BASE_URL}/api/orders/${selectedPayout._id}/payout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast("Commission Transferred Successfully", "success");
            // Refresh data to reflect status change
            fetchData();
            setShowPayoutModal(false);
            setSelectedPayout(null);
        } catch (error) {
            addToast(error.response?.data?.message || "Transfer Failed", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.metadata?.paymentUTR && t.metadata.paymentUTR.includes(searchQuery))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
                <p className="text-sm font-black uppercase tracking-[0.3em] text-brand-blue animate-pulse">Synchronizing Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-blue/10 rounded-lg border border-brand-blue/20 text-brand-blue">
                            <History size={24} />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">
                            Transaction <span className="text-brand-blue">Archive</span>
                        </h1>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                        Encryption Status: <span className="text-emerald-400">Level-03 Active</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                        <input
                            type="text"
                            placeholder="Search Logs..."
                            className="bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className={`p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-brand-blue transition-all ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeuralCard gradient="blue">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Active Records</p>
                        <h3 className="text-2xl font-black text-[var(--text-primary)]">{transactions.length}</h3>
                    </div>
                </NeuralCard>
                <NeuralCard gradient="pink">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Last Activity</p>
                        <h3 className="text-2xl font-black text-[var(--text-primary)]">
                            {transactions.length > 0 ? new Date(transactions[0].createdAt).toLocaleDateString() : 'N/A'}
                        </h3>
                    </div>
                </NeuralCard>
                <NeuralCard>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Live Sync Status</p>
                        <h3 className="text-2xl font-black text-emerald-400">NOMINAL</h3>
                    </div>
                </NeuralCard>
            </div>

            {/* Main Ledger */}
            <NeuralCard className="overflow-hidden p-0 border-[var(--card-border)]">
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-[var(--text-primary)]">Secure Ledger Streams</h4>
                </div>

                <div className="space-y-4 px-2">
                    <AnimatePresence mode="popLayout">
                        {filteredTransactions.length > 0 ? filteredTransactions.map((t, idx) => (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`relative p-5 rounded-[30px] border transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${t.type === 'order'
                                    ? 'bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/10 hover:border-cyan-500/30 hover:shadow-cyan-500/10'
                                    : t.type === 'payout'
                                        ? 'bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/10 hover:border-violet-500/30 hover:shadow-violet-500/10'
                                        : 'bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-emerald-500/10'
                                    }`}
                            >
                                {/* macOS-style window control dots */}
                                <div className="absolute top-4 left-5 flex gap-2 z-20">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 group-hover:bg-red-500 transition-colors duration-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 group-hover:bg-yellow-500 transition-colors duration-300" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors duration-300" />
                                </div>

                                {/* Decorative Blur */}
                                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${t.type === 'order' ? 'bg-cyan-500/10' : t.type === 'payout' ? 'bg-violet-500/10' : 'bg-emerald-500/10'
                                    }`} />

                                <div className="relative z-10 flex flex-col gap-6">
                                    {/* Top Row: Icon + Main Info + Amount */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 sm:gap-5">
                                            {/* Icon Box */}
                                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-500 shrink-0 ${t.type === 'order'
                                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                                : t.type === 'payout'
                                                    ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {t.type === 'order' ? <ArrowUpRight size={24} className="sm:w-7 sm:h-7" /> : t.type === 'payout' ? <CreditCard size={24} className="sm:w-7 sm:h-7" /> : <ArrowDownLeft size={24} className="sm:w-7 sm:h-7" />}
                                            </div>

                                            {/* Text Info */}
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                    <h5 className="font-black text-base sm:text-lg text-[var(--text-primary)] tracking-tight leading-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all break-words">
                                                        {t.description}
                                                    </h5>
                                                    <NeuralBadge variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'pending' : 'danger'}>
                                                        {t.status}
                                                    </NeuralBadge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-blue" /> {new Date(t.createdAt).toLocaleString()}</span>
                                                    <span className="hidden sm:inline opacity-50">|</span>
                                                    <span className="font-mono text-[var(--text-primary)] whitespace-nowrap">ID: {t._id.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount Box */}
                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 mt-2 md:mt-0 md:pl-0 w-full md:w-auto">
                                            {t.metadata?.paymentUTR && (
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-1 max-w-[50%] sm:max-w-none">
                                                    <CreditCard size={10} className="text-[var(--text-secondary)] shrink-0" />
                                                    <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] tracking-widest truncate">{t.metadata.paymentUTR}</span>
                                                </div>
                                            )}
                                            <div className="text-right flex-1 md:flex-none">
                                                <p className={`text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter ${t.type === 'order' ? 'text-cyan-400' : t.type === 'payout' ? 'text-violet-400' : 'text-emerald-400'
                                                    }`}>
                                                    {t.type === 'payout' ? '+' : '+'}₹{t.amount?.toLocaleString() || 0}
                                                </p>
                                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-60">
                                                    {t.type === 'payout' ? 'Credited' : 'Recorded'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Module (Commission) */}
                                    {((user?.role === 'admin' || user?.role === 'manager') || (user?.role === 'sales' && t.relatedOrder?.payoutStatus === 'Paid')) && (t.relatedOrder?.payoutStatus === 'Eligible' || t.relatedOrder?.payoutStatus === 'Paid') && (
                                        <div className={`mt-4 relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all group/action ${t.relatedOrder.payoutStatus === 'Paid'
                                            ? 'bg-violet-500/5 border-violet-500/20 hover:border-violet-500/40'
                                            : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                                            }`}>

                                            {/* Ambient Glow */}
                                            <div className={`absolute -left-10 top-0 w-32 h-full bg-gradient-to-r ${t.relatedOrder.payoutStatus === 'Paid' ? 'from-violet-500/10' : 'from-emerald-500/10'} to-transparent blur-2xl pointer-events-none`} />

                                            <div className="relative p-1.5 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                                                {/* Status Indicator */}
                                                <div className="flex-1 w-full flex items-center gap-3 p-2 pl-3">
                                                    <div className={`p-2 rounded-xl border shadow-lg ${t.relatedOrder.payoutStatus === 'Paid' ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                                                        <IndianRupee size={16} strokeWidth={2.5} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <span className={`text-[10px] uppercase font-black tracking-[0.2em] block ${t.relatedOrder.payoutStatus === 'Paid' ? 'text-violet-300' : 'text-emerald-300'}`}>
                                                            {t.relatedOrder.payoutStatus === 'Paid' ? 'Commission Settled' : 'Payout Eligible'}
                                                        </span>
                                                        <div className="flex flex-wrap gap-x-3 text-[11px] font-medium text-[var(--text-secondary)]">
                                                            <span className="flex items-center gap-1">For: <strong className="text-white">{t.relatedOrder.salesTeam?.name?.split(' ')[0] || 'Agent'}</strong></span>
                                                            <span className="opacity-20 hidden sm:inline">|</span>
                                                            <span className={`flex items-center gap-1 ${t.relatedOrder.payoutStatus === 'Paid' ? 'text-violet-400' : 'text-emerald-400'}`}>
                                                                Amount: <strong>₹{t.relatedOrder.payoutAmount?.toLocaleString()}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="w-full sm:w-auto p-1">
                                                    {t.relatedOrder.payoutStatus === 'Eligible' && (user?.role === 'admin' || user?.role === 'manager') ? (
                                                        <button
                                                            onClick={() => handlePayout(t.relatedOrder)}
                                                            className="w-full sm:w-auto group relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                            <span className="relative flex items-center justify-center gap-2">
                                                                Transfer
                                                                <ArrowUpRight size={12} strokeWidth={3} />
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handlePayout(t.relatedOrder)}
                                                            className="w-full sm:w-auto group relative px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                            <span className="relative flex items-center justify-center gap-2">
                                                                Receipt
                                                                <CreditCard size={12} strokeWidth={3} />
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 text-[var(--text-secondary)]">
                                    <AlertCircle size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-[var(--text-primary)]">No Records Found</p>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-black">
                                        {searchQuery ? `No signals matching "${searchQuery}"` : 'Transactions will appear after protocol engagement'}
                                    </p>
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                                    >
                                        Clear Search Buffer
                                    </button>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </NeuralCard>

            {/* Payout Modal */}
            <AnimatePresence>
                {showPayoutModal && selectedPayout && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPayoutModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0a0a0a] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl"
                        >
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-20"
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                                    <IndianRupee size={24} />
                                </div>

                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
                                    {selectedPayout.payoutStatus === 'Paid' ? 'Commission Transfer Receipt' : 'Confirm Commission Transfer'}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-6 font-medium">
                                    {selectedPayout.payoutStatus === 'Paid' ? 'Funds have been securely transferred. Transaction finalized.' : 'Initiating secure fund transfer protocol. Please verify beneficiary details.'}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="px-4 py-2 bg-white/90 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Beneficiary Agent</p>
                                        <p className="text-base font-bold text-zinc-900">{selectedPayout.salesTeam?.name || 'Unknown Agent'}</p>
                                    </div>
                                    <div className="px-4 py-2 bg-white/90 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Product</p>
                                        <p className="text-base font-bold text-zinc-900 truncate">
                                            {selectedPayout.items?.length > 1
                                                ? `${selectedPayout.items[0]?.product?.name || 'Unknown Product'} (+${selectedPayout.items.length - 1} more)`
                                                : selectedPayout.items?.[0]?.product?.name || 'Unknown Product'}
                                        </p>
                                    </div>
                                    <div className="px-4 py-2 bg-white/90 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Transfer Amount (90%)</p>
                                        <p className="text-xl font-black text-violet-600">₹{selectedPayout.payoutAmount?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                {selectedPayout.payoutStatus === 'Paid' ? (
                                    <button
                                        onClick={() => setShowPayoutModal(false)}
                                        className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all"
                                    >
                                        Close Receipt
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setShowPayoutModal(false)}
                                            className="flex-1 py-3 rounded-xl border border-[var(--card-border)] text-[var(--text-secondary)] font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                                        >
                                            Cancel Protocol
                                        </button>
                                        <button
                                            onClick={confirmPayout}
                                            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
                                        >
                                            Execute Transfer
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TransactionHistory;

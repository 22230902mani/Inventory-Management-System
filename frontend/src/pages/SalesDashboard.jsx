import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Package, Search, DollarSign, Tag, Barcode,
    Send, Clock, CheckCircle, XCircle
} from 'lucide-react';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralBadge from '../components/ui/NeuralBadge';

const SalesDashboard = () => {
    const { user } = useAuth();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [images, setImages] = useState([]);
    const fileInputRef = React.useRef(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: '',
        sku: '', barcode: '', description: '', companyName: ''
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const fetchProposals = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:6700/api/inventory/my-proposals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProposals(data);
        } catch (error) {
            console.error("Failed to fetch proposals", error);
        }
    };

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
        fetchProposals();
        fetchMessages();
        const interval = setInterval(() => {
            fetchProposals();
            fetchMessages();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(e.target.files);

        // Generate Previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };



    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:6700/api/messages', { content: newMessage, receiverId: null }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            alert('Failed to send message');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            let imagePaths = [];

            if (images.length > 0) {
                setUploading(true);
                const uploadData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    uploadData.append('images', images[i]);
                }
                const uploadRes = await axios.post('http://localhost:6700/api/upload', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                imagePaths = uploadRes.data.filePaths;
                setUploading(false);
            }

            if (imagePaths.length < 3) {
                alert("Please upload at least 3 images.");
                setLoading(false);
                setUploading(false);
                return;
            }

            const payload = {
                ...formData,
                sku: formData.sku || `SKU-${Date.now()}`,
                images: imagePaths
            };

            // Remove barcode if empty to avoid duplicate key error (sparse index needs missing field, not empty string)
            if (!payload.barcode) {
                delete payload.barcode;
            }

            await axios.post('http://localhost:6700/api/inventory', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ name: '', category: '', price: '', quantity: '', sku: '', barcode: '', description: '', companyName: '' });
            setImages([]);
            setImagePreviews([]);
            setIsCustomCategory(false);
            if (fileInputRef.current) fileInputRef.current.value = '';

            fetchProposals(); // Refresh list
        } catch (error) {
            console.error("Submission Error:", error);
            alert(error.response?.data?.message || "Proposal Failed");
        }
        setLoading(false);
        setUploading(false);
    };

    const stats = {
        total: proposals.length,
        approved: proposals.filter(p => p.status === 'active').length,
        pending: proposals.filter(p => p.status === 'pending').length,
        rejected: proposals.filter(p => p.status === 'rejected').length
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <NeuralCard gradient="blue" delay={0.1}>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Active Inventions</p>
                    <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.approved}</h3>
                </NeuralCard>
                <NeuralCard gradient="pink" delay={0.2}>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Pending Review</p>
                    <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.pending}</h3>
                </NeuralCard>
                <NeuralCard gradient="green" delay={0.3}>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Total Proposals</p>
                    <h3 className="text-3xl font-black text-[var(--text-primary)]">{stats.total}</h3>
                </NeuralCard>
                <NeuralCard className="bg-rose-500/5 border-rose-500/20" delay={0.4}>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Rejected</p>
                    <h3 className="text-3xl font-black text-rose-400">{stats.rejected}</h3>
                </NeuralCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Proposal Form */}
                <NeuralCard className="bg-brand-blue/5 border-brand-blue/20" delay={0.5}>
                    <div className="flex items-center gap-3 mb-8">
                        <Package className="text-brand-blue" size={24} />
                        <h4 className="text-lg font-bold text-[var(--text-primary)]">Submit Innovation Proposal</h4>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Sales Person</label>
                                <input disabled value={user?.name || 'Loading...'} className="w-full bg-[var(--input-bg)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] opacity-70 cursor-not-allowed" />
                            </div>
                            <NeuralInput
                                label="Company Name" placeholder="Supplier Company"
                                value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <NeuralInput
                                label="Product Name" placeholder="e.g. Quantum Chip"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                            />
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Category</label>
                                {isCustomCategory ? (
                                    <div className="flex gap-2">
                                        <input
                                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all text-sm"
                                            placeholder="Enter new category..."
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            autoFocus
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => { setIsCustomCategory(false); setFormData({ ...formData, category: '' }); }}
                                            className="px-4 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl hover:bg-white/5 text-[var(--text-secondary)] transition-colors text-xl font-bold"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all text-sm appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={e => {
                                            if (e.target.value === 'custom') {
                                                setIsCustomCategory(true);
                                                setFormData({ ...formData, category: '' });
                                            } else {
                                                setFormData({ ...formData, category: e.target.value });
                                            }
                                        }}
                                        required
                                    >
                                        <option value="" className="bg-[#161616] text-white">Select Category</option>
                                        <option value="Electronic Gadgets" className="bg-[#161616] text-white">Electronic Gadgets</option>
                                        <option value="Mobile Phones" className="bg-[#161616] text-white">Mobile Phones</option>
                                        <option value="Accessories" className="bg-[#161616] text-white">Accessories</option>
                                        <option value="Components" className="bg-[#161616] text-white">Components</option>
                                        <option value="custom" className="bg-[#161616] text-pink-500 font-bold">+ Add New Category</option>
                                    </select>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <NeuralInput
                                label="Demand Price/Unit" type="number" icon={DollarSign} placeholder="0.00"
                                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required
                            />
                            <NeuralInput
                                label="Quantity Offers" type="number" icon={Tag} placeholder="0"
                                value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Product Images (Min 3)</label>
                            <div className="relative group">
                                <input
                                    ref={fileInputRef}
                                    type="file" multiple accept="image/*" onChange={handleFileChange}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
                                />
                            </div>
                            <p className="text-[9px] text-[var(--text-secondary)]">Front, Back, Side/Box view required.</p>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-2 p-2 bg-[var(--input-bg)] rounded-xl border border-[var(--card-border)]">
                                    {imagePreviews.map((src, i) => (
                                        <div key={i} className="relative aspect-square group">
                                            <img src={src} className="w-full h-full object-cover rounded-lg border border-white/10" alt={`Preview ${i}`} />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[10px] font-bold text-white">
                                                Image {i + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Short Description</label>
                            <textarea
                                className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all min-h-[80px] text-sm"
                                placeholder="Details..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <NeuralButton type="submit" disabled={loading || uploading} className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90">
                            {uploading ? 'Uploading Evidence...' : loading ? 'Transmitting...' : 'Submit to Command Center'}
                        </NeuralButton>
                    </form>
                </NeuralCard>

                <div className="space-y-8">
                    {/* Status List */}
                    <NeuralCard className="p-0 overflow-hidden" delay={0.6}>
                        <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-brand-pink/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="text-brand-pink" size={20} />
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Proposal Manifest</h4>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-6 space-y-4">
                            <AnimatePresence>
                                {proposals.length > 0 ? proposals.map((p, idx) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-between group hover:border-brand-pink/30 transition-all"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-bold text-[var(--text-primary)]">{p.name}</h5>
                                                <NeuralBadge variant={p.status === 'active' ? 'success' : p.status === 'rejected' ? 'danger' : 'pending'}>
                                                    {p.status === 'active' ? 'APPROVED' : p.status.toUpperCase()}
                                                </NeuralBadge>
                                            </div>
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                                {p.companyName} • PRICE: ₹{p.price}
                                            </p>
                                        </div>
                                        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                            {p.status === 'active' ? <CheckCircle className="text-emerald-400" size={20} /> :
                                                p.status === 'rejected' ? <XCircle className="text-rose-400" size={20} /> :
                                                    <Clock className="text-amber-400" size={20} />}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <p className="text-center py-12 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">No Proposals Logged</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </NeuralCard>

                    {/* Messages */}
                    <NeuralCard className="flex flex-col h-[400px]" delay={0.7} id="neural-feed">
                        <div className="flex items-center gap-3 mb-4">
                            <Send className="text-brand-blue" size={20} />
                            <h4 className="text-lg font-bold">Admin Uplink</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 p-2 bg-[var(--input-bg)]/30 rounded-xl border border-[var(--card-border)]">
                            {messages.length === 0 && <p className="text-center text-xs text-[var(--text-secondary)] mt-10">Secure Channel Established. No history.</p>}
                            {messages.map(msg => (
                                <div key={msg._id} className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl border ${msg.sender._id === user?._id ? 'bg-brand-blue/20 border-brand-blue/30' : 'bg-[var(--input-bg)] border-[var(--card-border)]'}`}>
                                        <p className="text-xs text-[var(--text-secondary)] mb-1 font-bold">{msg.sender.name}</p>
                                        <p className="text-sm text-[var(--text-primary)]">{msg.content}</p>
                                        <p className="text-[9px] text-[var(--text-secondary)] text-right mt-1 opacity-50">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                className="flex-1 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                placeholder="Type message to HQ..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <NeuralButton type="submit" className="p-2 aspect-square flex items-center justify-center">
                                <Send size={16} />
                            </NeuralButton>
                        </form>
                    </NeuralCard>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;

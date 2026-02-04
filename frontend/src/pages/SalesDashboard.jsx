import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Package, Search, IndianRupee, Tag, Barcode,
    Send, Clock, CheckCircle, XCircle, X, Camera, Image as ImageIcon, CheckCircle2, Upload,
    TrendingUp, MessageSquare, User, ChevronRight, FileText
} from 'lucide-react';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralNotifications from '../components/NeuralNotifications';
import NeuralCamera from '../components/NeuralCamera';
import { useToast } from '../context/ToastContext';

const SalesDashboard = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const [proposals, setProposals] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [images, setImages] = useState([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const fileInputRef = React.useRef(null);
    const chatContainerRef = React.useRef(null);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: '',
        sku: '', barcode: '', description: '', companyName: ''
    });
    const [errors, setErrors] = useState({});
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company is required';
        if (!formData.name.trim()) newErrors.name = 'Product Name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (Number(formData.price) <= 0) newErrors.price = 'Price must be positive';
        if (!formData.quantity) newErrors.quantity = 'Quantity is required';
        else if (Number(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be positive';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchProposals = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/inventory/my-proposals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProposals(data);
        } catch (error) {
            console.error("Failed to fetch proposals", error);
        }
    };

    const fetchPayouts = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/orders/payouts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayouts(data);
        } catch (error) {
            console.error("Failed to fetch payouts", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(data);
        } catch (error) { console.error("Msg Error", error); }
    };

    useEffect(() => {
        fetchProposals();
        fetchMessages();
        fetchPayouts();
        const interval = setInterval(() => {
            fetchProposals();
            fetchMessages();
            fetchPayouts();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setImages(prev => [...prev, ...files]);

        // Generate Previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);

        // Clear inputs so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCameraCapture = (file) => {
        setImages(prev => [...prev, file]);
        const previewUrl = URL.createObjectURL(file);
        setImagePreviews(prev => [...prev, previewUrl]);
        addToast("Evidence Captured Successfully", "success");
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };



    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${config.API_BASE_URL}/api/messages`, { content: newMessage, receiverId: null }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            addToast('Failed to send message', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        if (images.length < 3) {
            addToast("Critical Protocol Error: At least 3 asset images are required for submission.", "warning");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            let imagePaths = [];

            if (images.length > 0) {
                setUploading(true);
                const uploadData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    uploadData.append('images', images[i]);
                }
                const uploadRes = await axios.post(`${config.API_BASE_URL}/api/upload`, uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                imagePaths = uploadRes.data.filePaths;
                setUploading(false);
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

            await axios.post(`${config.API_BASE_URL}/api/inventory`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ name: '', category: '', price: '', quantity: '', sku: '', barcode: '', description: '', companyName: '' });
            setImages([]);
            setImagePreviews(prev => {
                prev.forEach(url => URL.revokeObjectURL(url));
                return [];
            });
            setIsCustomCategory(false);
            if (fileInputRef.current) fileInputRef.current.value = '';

            addToast("Proposal Transmission Successful", "success");
            fetchProposals(); // Refresh list
        } catch (error) {
            console.error("Submission Error:", error);
            addToast(error.response?.data?.message || "Proposal Failed", "error");
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Active Stats */}
                <NeuralCard
                    className="h-40 flex flex-col justify-between p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)]"
                    delay={0.1}
                >
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-brand-blue/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl group-hover:bg-brand-blue/10 transition-colors duration-500" />

                    <div className="relative w-fit">
                        <div className="absolute inset-0 bg-brand-blue blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative p-3.5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl text-brand-blue group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg backdrop-blur-md">
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] tracking-tighter mb-2 mt-4 transition-all group-hover:from-brand-blue group-hover:to-blue-400">
                            {stats.approved}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.3em] leading-tight group-hover:text-brand-blue transition-colors">Active</p>
                        </div>
                    </div>
                </NeuralCard>

                {/* Pending Stats */}
                <NeuralCard
                    className="h-40 flex flex-col justify-between p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.3)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)]"
                    delay={0.2}
                >
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-brand-pink/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl group-hover:bg-brand-pink/10 transition-colors duration-500" />

                    <div className="relative w-fit">
                        <div className="absolute inset-0 bg-brand-pink blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative p-3.5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl text-brand-pink group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-lg backdrop-blur-md">
                            <Clock size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] tracking-tighter mb-2 mt-4 transition-all group-hover:from-brand-pink group-hover:to-pink-400">
                            {stats.pending}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                            <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.3em] leading-tight group-hover:text-brand-pink transition-colors">Pending</p>
                        </div>
                    </div>
                </NeuralCard>

                {/* Total Stats */}
                <NeuralCard
                    className="h-40 flex flex-col justify-between p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)]"
                    delay={0.3}
                >
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />

                    <div className="relative w-fit">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative p-3.5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl text-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg backdrop-blur-md">
                            <TrendingUp size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] tracking-tighter mb-2 mt-4 transition-all group-hover:from-emerald-500 group-hover:to-emerald-400">
                            {stats.total}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.3em] leading-tight group-hover:text-emerald-500 transition-colors">Total</p>
                        </div>
                    </div>
                </NeuralCard>

                {/* Rejected Stats */}
                <NeuralCard
                    className="h-40 flex flex-col justify-between p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)] bg-gradient-to-br from-rose-500/5 to-rose-950/20 border-rose-500/20"
                    delay={0.4}
                >
                    <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500" />

                    <div className="relative w-fit">
                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative p-3.5 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl text-rose-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-lg backdrop-blur-md">
                            <XCircle size={24} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 tracking-tighter mb-2 mt-4 transition-all group-hover:text-rose-500">
                            {stats.rejected}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                            <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.3em] leading-tight group-hover:text-rose-400 transition-colors">Rejected</p>
                        </div>
                    </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Sales Person</label>
                                <input disabled value={user?.name || 'Loading...'} className="w-full bg-[var(--input-bg)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] opacity-70 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Company Name</label>
                                    {errors.companyName && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.companyName}</span>}
                                </div>
                                <input
                                    placeholder="Supplier Company"
                                    value={formData.companyName}
                                    onChange={e => {
                                        setFormData({ ...formData, companyName: e.target.value });
                                        if (errors.companyName) setErrors({ ...errors, companyName: '' });
                                    }}
                                    className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none transition-all text-sm font-medium ${errors.companyName ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Product Name</label>
                                    {errors.name && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.name}</span>}
                                </div>
                                <input
                                    placeholder="e.g. Quantum Chip"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none transition-all text-sm font-medium ${errors.name ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Category</label>
                                    {errors.category && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.category}</span>}
                                </div>
                                {isCustomCategory ? (
                                    <div className="flex gap-2">
                                        <input
                                            className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3.5 text-[var(--text-primary)] focus:outline-none transition-all text-sm ${errors.category ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                            placeholder="Enter new category..."
                                            value={formData.category}
                                            onChange={e => {
                                                setFormData({ ...formData, category: e.target.value });
                                                if (errors.category) setErrors({ ...errors, category: '' });
                                            }}
                                            autoFocus
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
                                        value={formData.category}
                                        className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3.5 text-[var(--text-primary)] focus:outline-none transition-all text-sm appearance-none cursor-pointer ${errors.category ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                        onChange={e => {
                                            if (e.target.value === 'custom') {
                                                setIsCustomCategory(true);
                                                setFormData({ ...formData, category: '' });
                                            } else {
                                                setFormData({ ...formData, category: e.target.value });
                                                if (errors.category) setErrors({ ...errors, category: '' });
                                            }
                                        }}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Demand Price/Unit</label>
                                    {errors.price && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.price}</span>}
                                </div>
                                <div className="relative group">
                                    <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.price ? 'text-pink-500' : 'text-[var(--text-secondary)] group-focus-within:text-brand-blue'}`} size={16} />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => {
                                            setFormData({ ...formData, price: e.target.value });
                                            if (errors.price) setErrors({ ...errors, price: '' });
                                        }}
                                        className={`w-full bg-[var(--input-bg)] border rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none transition-all text-sm font-medium ${errors.price ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">Quantity Offers</label>
                                    {errors.quantity && <span className="text-[9px] font-bold text-pink-500 animate-pulse">{errors.quantity}</span>}
                                </div>
                                <div className="relative group">
                                    <Tag className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.quantity ? 'text-pink-500' : 'text-[var(--text-secondary)] group-focus-within:text-brand-blue'}`} size={16} />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={e => {
                                            setFormData({ ...formData, quantity: e.target.value });
                                            if (errors.quantity) setErrors({ ...errors, quantity: '' });
                                        }}
                                        className={`w-full bg-[var(--input-bg)] border rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none transition-all text-sm font-medium ${errors.quantity ? 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)] focus:border-pink-500' : 'border-[var(--card-border)] focus:ring-2 focus:ring-brand-blue/30'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-1">
                                Product Evidence (Min 3 Assets Required)
                            </label>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex-1 flex items-center justify-center gap-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-brand-blue hover:border-brand-blue/50 transition-all group"
                                >
                                    <ImageIcon className="text-brand-blue group-hover:scale-110 transition-transform" size={20} />
                                    Gallery
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsCameraOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-3 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-brand-pink hover:border-brand-pink/50 transition-all group"
                                >
                                    <Camera className="text-brand-pink group-hover:scale-110 transition-transform" size={20} />
                                    Camera
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file" multiple accept="image/*" onChange={handleFileChange}
                                className="hidden"
                            />

                            <p className="text-[10px] text-[var(--text-secondary)] font-medium italic">
                                Support Protocol: Front, Back, Side/Box view recommended for verification.
                            </p>

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4 p-4 bg-[var(--bg-secondary)]/50 rounded-2xl border border-[var(--card-border)] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

                                    {imagePreviews.map((src, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative aspect-square group"
                                        >
                                            <img src={src} className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" alt={`Preview ${i}`} />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors z-10"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-white uppercase tracking-tighter">
                                                Shot {i + 1}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {imagePreviews.length < 3 && (
                                        <div className="aspect-square rounded-xl border-2 border-dashed border-[var(--card-border)] flex flex-col items-center justify-center gap-1 text-[var(--text-secondary)]">
                                            <Upload size={16} className="opacity-30" />
                                            <span className="text-[8px] font-black uppercase tracking-tighter">Need {3 - imagePreviews.length} More</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 px-3 py-2 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                                <CheckCircle2 size={12} className={imagePreviews.length >= 3 ? "text-emerald-500" : "text-[var(--text-secondary)] opacity-30"} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${imagePreviews.length >= 3 ? "text-emerald-500" : "text-[var(--text-secondary)]"}`}>
                                    {imagePreviews.length >= 3 ? "Evidence Requirement Met" : `Evidence Status: ${imagePreviews.length}/3 Received`}
                                </span>
                            </div>
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
                                {proposals.filter(p => p.status !== 'rejected').length > 0 ? proposals.filter(p => p.status !== 'rejected').map((p, idx) => (
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
                                                <NeuralBadge variant={p.status === 'active' ? 'success' : 'pending'}>
                                                    {p.status === 'active' ? 'APPROVED' : p.status.toUpperCase()}
                                                </NeuralBadge>
                                            </div>
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                                {p.companyName} • PRICE: ₹{p.price}
                                            </p>
                                        </div>
                                        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                            {p.status === 'active' ? <CheckCircle className="text-emerald-400" size={20} /> :
                                                <Clock className="text-amber-400" size={20} />}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <p className="text-center py-12 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">No Active Proposals</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </NeuralCard>

                    {/* Commission Ledger / Payouts History */}
                    <NeuralCard className="p-0 overflow-hidden" delay={0.65}>
                        <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-emerald-500/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <IndianRupee className="text-emerald-500" size={20} />
                                <h4 className="text-lg font-bold text-[var(--text-primary)]">Commission Ledger</h4>
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-6 space-y-4">
                            {payouts.filter(p => p.payoutStatus !== 'Pending').length > 0 ? payouts.filter(p => p.payoutStatus !== 'Pending').map((p, idx) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-bold text-[var(--text-primary)] text-sm">{p.items[0]?.product?.name || 'Asset Sold'}</h5>
                                            <NeuralBadge variant={p.payoutStatus === 'Paid' ? 'success' : 'warning'}>
                                                {p.payoutStatus === 'Paid' ? 'RECEIVED' : 'PENDING'}
                                            </NeuralBadge>
                                        </div>
                                        <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                            REF: #{p._id.slice(-6).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-emerald-500 text-lg">₹{p.payoutAmount ? p.payoutAmount.toLocaleString() : '0'}</p>
                                        <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest">Payout</p>
                                    </div>
                                </motion.div>
                            )) : (
                                <p className="text-center py-8 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">No Commissions Logged</p>
                            )}
                        </div>
                    </NeuralCard>

                    {/* Messages */}
                    <NeuralCard className="flex flex-col h-[400px]" delay={0.7} id="neural-feed">
                        <div className="flex items-center gap-3 mb-4">
                            <Send className="text-brand-blue" size={20} />
                            <h4 className="text-lg font-bold">Admin Uplink</h4>
                        </div>
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 pr-2">
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
                        <form onSubmit={handleSendMessage} className="relative group">
                            <input
                                className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all"
                                placeholder="Type message to HQ..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </NeuralCard>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div id="notification-section">
                    <NeuralNotifications />
                </div>
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--card-border)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-[60px]" />
                    <h4 className="text-lg font-black uppercase italic tracking-tighter text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Package className="text-brand-blue" size={20} />
                        Sales Protocol Hub
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                        Monitor your proposal lifecycle in real-time. Approved assets are automatically integrated into the primary inventory matrix.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--card-border)]">
                            <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">Status</p>
                            <p className="text-sm font-black text-[var(--text-primary)] uppercase">Nominal</p>
                        </div>
                        <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--card-border)]">
                            <p className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-1">Priority</p>
                            <p className="text-sm font-black text-[var(--text-primary)] uppercase">Standard</p>
                        </div>
                    </div>
                </div>
            </div>
            <NeuralCamera
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
};

export default SalesDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import {
    Package,
    Plus,
    Search,
    Edit3,
    Trash2,
    Camera,
    RefreshCw,
    X,
    Boxes,
    Activity,
    BarChart3,
    Dna,
    ShoppingCart,
    Zap,
    History,
    CreditCard,
    MapPin,
    Phone,
    User as UserIcon,
    Eye,
    ChevronRight,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from '../components/Scanner';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import { useToast } from '../context/ToastContext';

const Inventory = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newItem, setNewItem] = useState({
        name: '', sku: '', category: '', price: 0, quantity: 0, lowStockThreshold: 10, description: '', barcode: ''
    });

    // View Details State
    const [viewProduct, setViewProduct] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Shopping States
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [isPaymentStep, setIsPaymentStep] = useState(false);

    // ... (rest of state items are fine, we just injected above) ...
    const [utrNumber, setUtrNumber] = useState('');
    const [shipName, setShipName] = useState('');
    const [shipPhone, setShipPhone] = useState('');
    const [shipAddress, setShipAddress] = useState('');
    const [shipPincode, setShipPincode] = useState('');

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) return prev.map(item => item._id === product._id ? { ...item, cartQty: item.cartQty + 1 } : item);
            return [...prev, { ...product, cartQty: 1 }];
        });
        addToast(`${product.name} added to acquisition queue`, 'info', 2000);
    };

    const openOrderModal = (product) => {
        setSelectedProduct(product);
        setIsPaymentStep(false);
        setUtrNumber('');
        setShipName(''); setShipPhone(''); setShipAddress(''); setShipPincode('');
        setShowOrderModal(true);
    };

    const handleConfirmOrder = async () => {
        if (utrNumber.length !== 12) return addToast("Invalid protocol: 12-digit UTR required", "warning", 3000);
        const fullShippingAddress = `To: ${shipName}, Ph: ${shipPhone}, \nAddr: ${shipAddress}, \nPin: ${shipPincode}`;
        try {
            const token = localStorage.getItem('token');
            const totalAmount = selectedProduct.price;
            const items = [{ product: selectedProduct._id, quantity: 1, priceAtPurchase: selectedProduct.price }];

            await axios.post(`${config.API_BASE_URL}/api/orders`, { items, totalAmount, paymentUTR: utrNumber, shippingAddress: fullShippingAddress }, { headers: { Authorization: `Bearer ${token}` } });
            setShowOrderModal(false);
            addToast("Order Placed Successfully!", 'success', 5000);
            fetchProducts();
        } catch (error) {
            addToast(error.response?.data?.message || error.message, 'error', 5000);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${config.API_BASE_URL}/api/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setNewItem({ name: '', sku: '', category: '', price: 0, quantity: 0, lowStockThreshold: 10, description: '', barcode: '' });
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(false);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`${config.API_BASE_URL}/api/inventory/${currentId}`, newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${config.API_BASE_URL}/api/inventory`, newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            addToast(`Asset ${newItem.name} successfully ${isEditing ? 'updated' : 'initialized'}`, 'success', 3000);
            resetForm();
            fetchProducts();
        } catch (error) {
            addToast(error.response?.data?.message || 'Sequence protocol error', 'error', 5000);
        }
    };

    const handleEditClick = (product) => {
        setNewItem(product);
        setCurrentId(product._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${config.API_BASE_URL}/api/inventory/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addToast('Asset decommissioned successfully', 'success', 3000);
            fetchProducts();
        } catch (error) {
            addToast('Decommission failure: ' + (error.response?.data?.message || 'Unknown signal error'), 'error', 5000);
        }
    };

    const handleScanSuccess = (decodedText) => {
        setNewItem(prev => ({ ...prev, barcode: decodedText }));
        setShowScanner(false);
    };

    const canAddEdit = user.role === 'admin' || user.role === 'manager';
    const canDelete = user.role === 'admin';

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {showScanner && <Scanner onScan={handleScanSuccess} onClose={() => setShowScanner(false)} />}

            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Boxes className="text-brand-blue" size={24} />
                        <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase italic">Global Manifest</h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-[var(--text-secondary)] tracking-[0.4em] uppercase ml-9">Unified Inventory Registry</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-50 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Query by Name / SKU..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all placeholder:text-[var(--text-secondary)] placeholder:opacity-50 text-[var(--text-primary)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {canAddEdit && (
                        <NeuralButton onClick={() => { resetForm(); setShowModal(true); }} className="h-[46px] px-8 bg-brand-blue text-white hover:bg-brand-blue/90 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <Plus size={18} className="mr-2" /> Initialze Asset
                        </NeuralButton>
                    )}
                </div>
            </div>

            {/* Main Manifest - Responsive View */}
            <div className="md:hidden space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((p, idx) => (
                        <motion.div
                            key={p._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <NeuralCard className="p-5 border-[var(--card-border)]">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)] uppercase tracking-tight">{p.name}</h4>
                                        <p className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest mt-0.5">#{p.sku}</p>
                                    </div>
                                    <NeuralBadge variant={p.quantity < p.lowStockThreshold ? 'danger' : 'success'}>
                                        {p.quantity < p.lowStockThreshold ? 'Critical' : 'Nominal'}
                                    </NeuralBadge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Credits</p>
                                        <p className="text-sm font-black text-[var(--text-primary)]">₹{p.price.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Units</p>
                                        <p className="text-sm font-black text-brand-blue">{p.quantity}</p>
                                    </div>
                                </div>

                                {user.role === 'user' && (
                                    <div className="flex gap-2 mb-4">
                                        <NeuralButton
                                            variant="secondary"
                                            className="flex-1 h-11 border-brand-blue/20 text-brand-blue px-2 min-w-0"
                                            onClick={() => addToCart(p)}
                                        >
                                            <ShoppingCart size={16} className="mr-2" /> Queue
                                        </NeuralButton>
                                        <NeuralButton
                                            className="flex-1 h-11 bg-brand-blue text-white px-2 min-w-0"
                                            onClick={() => openOrderModal(p)}
                                        >
                                            <Zap size={16} className="mr-2" /> Engage
                                        </NeuralButton>
                                    </div>
                                )}

                                {(canAddEdit || canDelete) && (
                                    <div className="flex gap-2 pt-3 border-t border-white/5">
                                        {canAddEdit && (
                                            <>
                                                <NeuralButton
                                                    variant="secondary"
                                                    className="flex-1 h-10 border-white/10 hover:border-brand-blue px-2 min-w-0"
                                                    onClick={() => { setViewProduct(p); setShowDetailsModal(true); }}
                                                >
                                                    <Eye size={14} className="mr-2" /> View
                                                </NeuralButton>
                                                <NeuralButton
                                                    variant="secondary"
                                                    className="flex-1 h-10 border-white/10 hover:border-brand-blue px-2 min-w-0"
                                                    onClick={() => handleEditClick(p)}
                                                >
                                                    <Edit3 size={14} className="mr-2" /> Modify
                                                </NeuralButton>
                                            </>
                                        )}
                                        {canDelete && (
                                            <NeuralButton
                                                variant="secondary"
                                                className="px-4 h-10 border-white/10 hover:border-rose-500 text-rose-500/50 hover:text-rose-400"
                                                onClick={() => handleDeleteClick(p._id)}
                                            >
                                                <Trash2 size={14} />
                                            </NeuralButton>
                                        )}
                                    </div>
                                )}
                            </NeuralCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop Manifest Table */}
            <NeuralCard className="hidden md:block p-0 overflow-hidden border-white/5 shadow-2xl relative" delay={0.2}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent" />
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--card-border)]">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Manifest SKU</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Asset Designation</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Sector</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Units</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Valuation</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] pr-10">Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((p, idx) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-brand-blue font-bold"># {p.sku?.toUpperCase()}</span>
                                                <span className="text-[9px] text-[var(--text-secondary)] font-black tracking-widest uppercase opacity-40">ID: {p._id.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--input-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                                    <Package size={14} />
                                                </div>
                                                <span className="font-black text-[var(--text-primary)] uppercase italic tracking-tight text-sm">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-[var(--input-bg)] border border-[var(--card-border)] rounded-md text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.quantity < p.lowStockThreshold ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.quantity < p.lowStockThreshold ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                    {p.quantity < p.lowStockThreshold ? 'Critical' : 'Nominal'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-[var(--text-primary)] text-base italic tracking-tighter">{p.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-emerald-400 text-sm italic tracking-tighter">₹{p.price.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 pr-6">
                                            <div className="flex justify-end gap-2 opacity-100">
                                                {user.role === 'user' && (
                                                    <>
                                                        <button
                                                            onClick={() => addToCart(p)}
                                                            className="p-2.5 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-lg shadow-brand-blue/20"
                                                            title="Add to Acquisition Queue"
                                                        >
                                                            <ShoppingCart size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => openOrderModal(p)}
                                                            className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/20"
                                                            title="Engage Immediate Acquisition"
                                                        >
                                                            <Zap size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {canAddEdit && (
                                                    <>
                                                        <button
                                                            onClick={() => { setViewProduct(p); setShowDetailsModal(true); }}
                                                            className="p-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-brand-blue hover:bg-brand-blue/10 hover:border-brand-blue/30 transition-all"
                                                            title="View Asset Details"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(p)}
                                                            className="p-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-blue/20 hover:border-brand-blue/30 transition-all"
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDeleteClick(p._id)}
                                                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-32 text-center flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] opacity-10">
                                <Search size={40} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tighter">No Assets Detected</p>
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Neural scan yielded zero matches</p>
                            </div>
                        </div>
                    )}
                </div>
            </NeuralCard>

            {/* Modal HUD */}
            <AnimatePresence>
                {/* Initialize Asset Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl neural-glass bg-[#050505] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] max-h-[90vh] flex flex-col"
                        >
                            <div className="p-4 border-b border-[var(--card-border)] bg-gradient-to-r from-brand-blue/20 to-transparent flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-blue/20 rounded-lg">
                                        <Dna className="text-brand-blue" size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black tracking-tight italic uppercase text-[var(--text-primary)]">
                                            {isEditing ? 'Modify Asset Sequence' : 'Initialize New Asset'}
                                        </h3>
                                        <p className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Protocol Version v3.4.2</p>
                                    </div>
                                </div>
                                <button onClick={resetForm} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                                <NeuralInput className="py-2.5 h-[42px] text-sm" label="Asset Designation" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required placeholder="Enter designation..." />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <NeuralInput className="py-2.5 h-[42px] text-sm" label="Manifest SKU" value={newItem.sku} onChange={e => setNewItem({ ...newItem, sku: e.target.value })} required placeholder="SKU-XXXX-XX" />
                                    <NeuralInput className="py-2.5 h-[42px] text-sm" label="Sector Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} required placeholder="Asset classification..." />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] ml-1">Biosignature / Barcode</label>
                                    <div className="flex gap-3">
                                        <input
                                            className="input-neural flex-1 h-[42px] py-2.5 text-sm"
                                            value={newItem.barcode || ''}
                                            onChange={e => setNewItem({ ...newItem, barcode: e.target.value })}
                                            placeholder="Awaiting signal..."
                                        />
                                        <NeuralButton type="button" variant="secondary" onClick={() => setShowScanner(true)} className="px-4 h-[42px]">
                                            <Camera size={18} />
                                        </NeuralButton>
                                        <NeuralButton
                                            type="button"
                                            variant="secondary"
                                            className="px-4 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 h-[42px]"
                                            onClick={() => setNewItem({ ...newItem, barcode: Date.now().toString().slice(-10) })}
                                        >
                                            <RefreshCw size={18} />
                                        </NeuralButton>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <NeuralInput className="py-2.5 h-[42px] text-sm" label="Credit Value (₹)" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                                    <NeuralInput className="py-2.5 h-[42px] text-sm" label="Unit Quantity" type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Asset Description</label>
                                    <textarea className="input-neural min-h-[80px] py-2.5 text-sm" rows="3" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} placeholder="Mission parameters and specifications..." />
                                </div>

                                <div className="pt-4 flex gap-3 sticky bottom-0 bg-[#050505] py-2">
                                    <NeuralButton type="button" variant="secondary" onClick={resetForm} className="flex-1 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-12">
                                        Abort
                                    </NeuralButton>
                                    <NeuralButton type="submit" className="flex-1 bg-white text-black hover:bg-white/90 font-black h-12">
                                        Authorize & Seal
                                    </NeuralButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Modal HUD */}
                {/* Order/Payment Modal */}
                {showOrderModal && selectedProduct && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOrderModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            layout
                            className="relative w-full max-w-md neural-glass bg-[var(--bg-primary)] border-[var(--card-border)] overflow-hidden rounded-3xl max-h-[85vh] flex flex-col scale-[0.95] sm:scale-100"
                        >
                            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-blue/20 rounded-lg">
                                        {isPaymentStep ? <CreditCard className="text-brand-blue" size={20} /> : <MapPin className="text-brand-blue" size={20} />}
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">
                                        {isPaymentStep ? 'Secure Authorization' : 'Logistics Manifest'}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                                {!isPaymentStep ? (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <NeuralInput label="Target Operative" icon={UserIcon} placeholder="Full legal name" value={shipName} onChange={e => setShipName(e.target.value)} />
                                        <NeuralInput label="Comm Link" icon={Phone} placeholder="Phone number" value={shipPhone} onChange={e => setShipPhone(e.target.value)} />
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Drop Zone Address</label>
                                            <textarea className="input-neural min-h-[100px] py-4" placeholder="Full logistics intersection" value={shipAddress} onChange={e => setShipAddress(e.target.value)} />
                                        </div>
                                        <NeuralInput label="Grid Sector (Pincode)" placeholder="6-digit sector" value={shipPincode} onChange={e => setShipPincode(e.target.value)} />
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-6">
                                        <div className="relative inline-block group">
                                            <div className="absolute -inset-4 bg-brand-blue/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                                            <div className="relative bg-white p-4 rounded-3xl group-hover:rotate-1 transition-all">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9390952649-2@ybl%26am=${selectedProduct.price}`} alt="Secure Passcode" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em]">Required Credits</p>
                                            <h2 className="text-4xl font-black text-white tracking-tighter text-brand-blue">₹{selectedProduct.price.toLocaleString()}</h2>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                            <NeuralInput label="Transmission ID (UTR/TXN)" className="text-center text-sm font-black tracking-[0.2em]" placeholder="0000 0000 0000" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} />
                                            <p className="text-[9px] text-white/30 mt-3 font-bold uppercase tracking-widest">Validate 12-digit protocol from bank manifest</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-4">
                                {!isPaymentStep ? (
                                    <>
                                        <NeuralButton variant="secondary" onClick={() => setShowOrderModal(false)}>Abort</NeuralButton>
                                        <NeuralButton onClick={() => setIsPaymentStep(true)}>
                                            Next Phase <ChevronRight size={16} />
                                        </NeuralButton>
                                    </>
                                ) : (
                                    <>
                                        <NeuralButton variant="secondary" onClick={() => setIsPaymentStep(false)}>Back</NeuralButton>
                                        <NeuralButton variant="primary" onClick={handleConfirmOrder} className="bg-brand-blue hover:bg-brand-blue/90">
                                            Confirm Acquisition
                                        </NeuralButton>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
                {/* View Details Modal for Admin/Manager */}
                {showDetailsModal && viewProduct && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-[#0a0a0a] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Asset Intelligence</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Deep Scan Protocol</p>
                                </div>
                                <button onClick={() => setShowDetailsModal(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <X size={16} className="text-white/50" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            <Users size={16} />
                                        </div>
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] flex-1">Sales Operative</p>
                                    </div>
                                    <p className="text-lg font-black text-white pl-11">{viewProduct.addedBy?.name || 'Unassigned / Root'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Asset Depth</p>
                                        <p className={`text-2xl font-black ${viewProduct.quantity < viewProduct.lowStockThreshold ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {viewProduct.quantity}
                                        </p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Units Available</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Status</p>
                                        <NeuralBadge variant={viewProduct.quantity < viewProduct.lowStockThreshold ? 'danger' : 'success'}>
                                            {viewProduct.quantity < viewProduct.lowStockThreshold ? 'CRITICAL' : 'NOMINAL'}
                                        </NeuralBadge>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Asset</p>
                                        <p className="text-[10px] font-mono text-brand-blue">#{viewProduct.sku}</p>
                                    </div>
                                    <p className="font-bold text-white text-sm">{viewProduct.name}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="w-full mt-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all"
                            >
                                Close Manifest
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;

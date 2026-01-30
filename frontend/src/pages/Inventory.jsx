import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    Dna
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from '../components/Scanner';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';

const Inventory = () => {
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:6700/api/inventory', {
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
                await axios.put(`http://localhost:6700/api/inventory/${currentId}`, newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:6700/api/inventory', newItem, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
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
            await axios.delete(`http://localhost:6700/api/inventory/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (error) {
            alert('Failed to delete: ' + (error.response?.data?.message || 'Unknown error'));
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
                        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Global Manifest</h2>
                    </div>
                    <p className="text-[10px] font-extrabold text-white/30 tracking-[0.4em] uppercase ml-9">Unified Inventory Registry</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Query by Name / SKU..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all placeholder:text-white/20"
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

            {/* Main Table HUD */}
            <NeuralCard className="p-0 overflow-hidden border-white/5 shadow-2xl" delay={0.2}>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="neural-table">
                        <thead>
                            <tr>
                                <th>Identification SKU</th>
                                <th>Protocol SKU</th>
                                <th>Asset Designation</th>
                                <th>Classification</th>
                                <th>Credit Value</th>
                                <th>Current Units</th>
                                <th>Operational Status</th>
                                {(canAddEdit || canDelete) && <th className="text-right pr-12">Protocols</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((p, idx) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <td className="font-mono text-[11px] text-white/60 tracking-wider">#{p.sku}</td>
                                        <td className="font-mono text-[11px] text-brand-blue/60 tracking-wider">{p.barcode || 'N/A'}</td>
                                        <td className="font-bold text-white text-sm">{p.name}</td>
                                        <td className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">{p.category}</td>
                                        <td className="font-black text-white">₹{p.price.toLocaleString()}</td>
                                        <td className="font-bold text-brand-blue">{p.quantity}</td>
                                        <td>
                                            <NeuralBadge variant={p.quantity < p.lowStockThreshold ? 'danger' : 'success'}>
                                                {p.quantity < p.lowStockThreshold ? 'Critical' : 'Nominal'}
                                            </NeuralBadge>
                                        </td>
                                        {(canAddEdit || canDelete) && (
                                            <td className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    {canAddEdit && (
                                                        <NeuralButton
                                                            variant="secondary"
                                                            className="h-9 px-3 border-gray-500/20 hover:border-brand-blue text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            <Edit3 size={16} />
                                                        </NeuralButton>
                                                    )}
                                                    {canDelete && (
                                                        <NeuralButton
                                                            variant="secondary"
                                                            className="h-9 px-3 border-gray-500/20 hover:border-rose-500 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                                            onClick={() => handleDeleteClick(p._id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </NeuralButton>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                                <Search size={32} />
                            </div>
                            <p className="text-[10px] font-extrabold text-white/20 uppercase tracking-[0.4em]">No matching assets found in network</p>
                        </div>
                    )}
                </div>
            </NeuralCard>

            {/* Modal HUD */}
            <AnimatePresence>
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
                            className="relative w-full max-w-2xl neural-glass bg-[#050505] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
                        >
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-brand-blue/20 to-transparent flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-brand-blue/20 rounded-xl">
                                        <Dna className="text-brand-blue" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight italic uppercase">
                                            {isEditing ? 'Modify Asset Sequence' : 'Initialize New Asset'}
                                        </h3>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Protocol Version v3.4.2</p>
                                    </div>
                                </div>
                                <button onClick={resetForm} className="text-white/20 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="p-8 space-y-6">
                                <NeuralInput label="Asset Designation" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required placeholder="Enter designation..." />

                                <div className="grid grid-cols-2 gap-6">
                                    <NeuralInput label="Manifest SKU" value={newItem.sku} onChange={e => setNewItem({ ...newItem, sku: e.target.value })} required placeholder="SKU-XXXX-XX" />
                                    <NeuralInput label="Sector Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} required placeholder="Asset classification..." />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] ml-1">Biosignature / Barcode</label>
                                    <div className="flex gap-3">
                                        <input
                                            className="input-neural flex-1 h-[46px]"
                                            value={newItem.barcode || ''}
                                            onChange={e => setNewItem({ ...newItem, barcode: e.target.value })}
                                            placeholder="Awaiting signal..."
                                        />
                                        <NeuralButton type="button" variant="secondary" onClick={() => setShowScanner(true)} className="px-4">
                                            <Camera size={18} />
                                        </NeuralButton>
                                        <NeuralButton
                                            type="button"
                                            variant="secondary"
                                            className="px-4 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10"
                                            onClick={() => setNewItem({ ...newItem, barcode: Date.now().toString().slice(-10) })}
                                        >
                                            <RefreshCw size={18} />
                                        </NeuralButton>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <NeuralInput label="Credit Value (₹)" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                                    <NeuralInput label="Unit Quantity" type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] ml-1">Asset Description</label>
                                    <textarea className="input-neural min-h-[100px] py-4" rows="3" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} placeholder="Mission parameters and specifications..." />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <NeuralButton type="button" variant="secondary" onClick={resetForm} className="px-8 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-12">
                                        Abort
                                    </NeuralButton>
                                    <NeuralButton type="submit" className="px-12 bg-white text-black hover:bg-white/90 font-black h-12">
                                        Authorize & Seal
                                    </NeuralButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;

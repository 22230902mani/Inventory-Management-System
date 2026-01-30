import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ShoppingCart,
    Package,
    History,
    TrendingUp,
    CreditCard,
    MapPin,
    Phone,
    User as UserIcon,
    ChevronRight,
    Plus,
    Trash2,
    X,
    Zap
} from 'lucide-react';
import NeuralCard from '../components/ui/NeuralCard';
import NeuralBadge from '../components/ui/NeuralBadge';
import NeuralButton from '../components/ui/NeuralButton';
import NeuralInput from '../components/ui/NeuralInput';
import NeuralNotifications from '../components/NeuralNotifications';

const UserDashboard = () => {
    const [products, setProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderQty, setOrderQty] = useState(1);
    const [isPaymentStep, setIsPaymentStep] = useState(false);
    const [utrNumber, setUtrNumber] = useState('');
    const [shipName, setShipName] = useState('');
    const [shipPhone, setShipPhone] = useState('');
    const [shipAddress, setShipAddress] = useState('');
    const [shipPincode, setShipPincode] = useState('');
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [showCartModal, setShowCartModal] = useState(false);
    const [isCartCheckout, setIsCartCheckout] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const pRes = await axios.get('http://localhost:6700/api/inventory', { headers: { Authorization: `Bearer ${token}` } });
            setProducts(pRes.data);
            const oRes = await axios.get('http://localhost:6700/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } });
            setMyOrders(oRes.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) return prev.map(item => item._id === product._id ? { ...item, cartQty: item.cartQty + 1 } : item);
            return [...prev, { ...product, cartQty: 1 }];
        });
    };

    const openOrderModal = (product) => {
        setSelectedProduct(product);
        setOrderQty(1);
        setIsPaymentStep(false);
        setIsCartCheckout(false);
        setUtrNumber('');
        setShipName(''); setShipPhone(''); setShipAddress(''); setShipPincode('');
        setShowOrderModal(true);
    };

    const handleConfirmOrder = async () => {
        if (utrNumber.length !== 12) return alert("Please enter a valid 12-digit UTR number.");
        const fullShippingAddress = `To: ${shipName}, Ph: ${shipPhone}, \nAddr: ${shipAddress}, \nPin: ${shipPincode}`;
        try {
            const token = localStorage.getItem('token');
            let items, totalAmount;
            if (isCartCheckout) {
                items = cart.map(item => ({ product: item._id, quantity: item.cartQty, priceAtPurchase: item.price }));
                totalAmount = cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0);
            } else {
                totalAmount = selectedProduct.price * orderQty;
                items = [{ product: selectedProduct._id, quantity: parseInt(orderQty), priceAtPurchase: selectedProduct.price }];
            }
            await axios.post('http://localhost:6700/api/orders', { items, totalAmount, paymentUTR: utrNumber, shippingAddress: fullShippingAddress }, { headers: { Authorization: `Bearer ${token}` } });
            setShowOrderModal(false);
            if (isCartCheckout) setCart([]);
            alert("Order Placed Successfully!");
            fetchData();
        } catch (error) { alert(error.message); }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeuralCard gradient="blue" delay={0.1}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Secured Assets</p>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{myOrders.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <History className="text-blue-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>

                <NeuralCard gradient="pink" delay={0.2} className="cursor-pointer" onClick={() => setShowCartModal(true)}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Acquisition Queue</p>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{cart.reduce((acc, item) => acc + item.cartQty, 0)}</h3>
                        </div>
                        <div className="p-3 bg-pink-500/20 rounded-xl relative">
                            <ShoppingCart className="text-pink-400" size={20} />
                            {cart.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" />}
                        </div>
                    </div>
                </NeuralCard>

                <NeuralCard gradient="green" delay={0.3}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Global Inventory</p>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{products.length}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Package className="text-emerald-400" size={20} />
                        </div>
                    </div>
                </NeuralCard>
            </div>

            {/* Catalog Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-brand-blue/10 border border-brand-blue/20 rounded-lg">
                            <TrendingUp size={20} className="text-brand-blue" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Active Manifests</h2>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Assets..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((p, idx) => (
                            <NeuralCard key={p._id} delay={idx * 0.05} className="group flex flex-col h-full bg-white/[0.02]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg leading-tight group-hover:text-brand-blue transition-colors cursor-pointer text-[var(--text-primary)]" onClick={() => { setSelectedProduct(p); setShowDetailModal(true); }}>
                                            {p.name}
                                        </h4>
                                        <p className="text-[var(--text-secondary)] text-xs font-bold tracking-widest uppercase">CAT-{p._id.substring(0, 8)}</p>
                                    </div>
                                    <NeuralBadge variant={p.quantity > 0 ? 'success' : 'danger'}>
                                        {p.quantity > 0 ? 'Functional' : 'Depleted'}
                                    </NeuralBadge>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] mb-6 flex-1 line-clamp-2 leading-relaxed">
                                    {p.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)] mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Acquisition Cost</span>
                                        <span className="text-xl font-black text-[var(--text-primary)]">₹{p.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <NeuralButton
                                            variant="secondary"
                                            icon={Plus}
                                            onClick={() => addToCart(p)}
                                            className="px-3"
                                        />
                                        <NeuralButton
                                            onClick={() => openOrderModal(p)}
                                            className="px-6"
                                        >
                                            Engage
                                        </NeuralButton>
                                    </div>
                                </div>
                            </NeuralCard>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Cart Modal Overhaul */}
            <AnimatePresence>
                {showCartModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCartModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg neural-glass bg-[var(--bg-primary)] border-[var(--card-border)] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)]"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <ShoppingCart className="text-emerald-400" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">Acquisition Queue</h3>
                                </div>
                                <button onClick={() => setShowCartModal(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                                {cart.length > 0 ? cart.map((item) => (
                                    <div key={item._id} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                                        <div className="space-y-1">
                                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{item.name}</p>
                                            <p className="text-xs font-bold text-white/40 tracking-widest uppercase">
                                                ₹{item.price.toLocaleString()} × {item.cartQty} UNIT(S)
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-black tracking-tight">₹{(item.price * item.cartQty).toLocaleString()}</span>
                                            <button
                                                onClick={() => setCart(cart.filter(c => c._id !== item._id))}
                                                className="p-2 text-rose-500/40 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                            <ShoppingCart className="text-white/10" size={32} />
                                        </div>
                                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Queue Empty</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Transaction Value</span>
                                    <span className="text-2xl font-black text-emerald-400 tracking-tighter">
                                        ₹{cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <NeuralButton variant="secondary" onClick={() => setShowCartModal(false)}>Close</NeuralButton>
                                    <NeuralButton
                                        disabled={cart.length === 0}
                                        onClick={() => {
                                            setIsCartCheckout(true);
                                            setShowCartModal(false);
                                            setShowOrderModal(true);
                                            setSelectedProduct({ name: 'Bulk Acquisition', price: cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0) });
                                        }}
                                    >
                                        Authorize Checkout
                                    </NeuralButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Order/Payment Modal Overhaul */}
            <AnimatePresence>
                {showOrderModal && selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowOrderModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            layout
                            className="relative w-full max-w-md neural-glass bg-black border-white/10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-blue/20 rounded-lg">
                                        {isPaymentStep ? <CreditCard className="text-brand-blue" size={20} /> : <MapPin className="text-brand-blue" size={20} />}
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">
                                        {isPaymentStep ? 'Secure Authorization' : 'Logistics Manifest'}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {!isPaymentStep ? (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <NeuralInput label="Target Operative" icon={UserIcon} placeholder="Full legal name" value={shipName} onChange={e => setShipName(e.target.value)} />
                                        <NeuralInput label="Comm Link" icon={Phone} placeholder="Phone number" value={shipPhone} onChange={e => setShipPhone(e.target.value)} />
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] ml-1">Drop Zone Address</label>
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
                                            <NeuralInput label="Transmission ID (UTR/TXN)" className="text-center text-lg font-black tracking-[0.2em]" placeholder="0000 0000 0000" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} />
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
            </AnimatePresence>

            <div className="mt-12 pt-12 border-t border-white/5" id="neural-feed">
                <div className="max-w-4xl mx-auto">
                    <NeuralNotifications />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

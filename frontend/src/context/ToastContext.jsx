import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle2 className="text-brand-green" size={18} />,
        error: <AlertCircle className="text-rose-400" size={18} />,
        info: <Info className="text-brand-blue" size={18} />,
        warning: <Zap className="text-amber-400" size={18} />
    };

    const variants = {
        success: "border-brand-green/30 bg-brand-green/5 shadow-brand-green/10",
        error: "border-rose-500/30 bg-rose-500/5 shadow-rose-500/10",
        info: "border-brand-blue/30 bg-brand-blue/5 shadow-brand-blue/10",
        warning: "border-amber-500/30 bg-amber-500/5 shadow-amber-500/10"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto min-w-[320px] max-w-md neural-glass p-1 rounded-2xl border ${variants[toast.type]} shadow-2xl relative group overflow-hidden`}
        >
            <div className="flex items-center gap-4 p-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {icons[toast.type]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-extrabold text-white/30 uppercase tracking-[0.2em] mb-0.5">System Signal</p>
                    <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/20 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Animated Progress Bar */}
            {toast.duration !== Infinity && (
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: toast.duration / 1000, ease: "linear" }}
                    className={`h-[2px] absolute bottom-0 left-0 bg-gradient-to-r opacity-50 ${toast.type === 'success' ? 'from-brand-green to-emerald-400' :
                            toast.type === 'error' ? 'from-rose-500 to-pink-500' :
                                'from-brand-blue to-teal-400'
                        }`}
                />
            )}
        </motion.div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const StatusDropdown = ({ currentStatus, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const statuses = [
        'Pending Verification',
        'Processing',
        'Shipped',
        'Received',
        'Cancelled'
    ];

    const handleSelect = (status) => {
        onUpdate(status);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Received': return 'neural-badge-success';
            case 'Cancelled': return 'neural-badge-danger';
            case 'Pending Verification': return 'neural-badge-pending';
            case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            case 'Shipped': return 'bg-brand-pink/10 text-brand-pink border-brand-pink/30';
            default: return 'neural-badge-pending';
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    "neural-badge cursor-pointer pr-8 relative transition-all active:scale-95 min-w-[140px] justify-start",
                    getStatusStyle(currentStatus)
                )}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
                {currentStatus}
                <ChevronDown className={twMerge("absolute right-2 top-1/2 -translate-y-1/2 transition-transform", isOpen ? "rotate-180" : "")} size={12} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden p-1.5"
                    >
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={() => handleSelect(status)}
                                className={twMerge(
                                    "w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-between group",
                                    status === currentStatus
                                        ? "bg-white/10 text-white"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {status}
                                {status === currentStatus && <Check size={14} className="text-brand-blue" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatusDropdown;

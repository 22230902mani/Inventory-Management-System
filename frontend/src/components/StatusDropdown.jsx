import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const StatusDropdown = ({ currentStatus, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
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

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Calculate left position (default to aligned with button left)
            let left = rect.left;
            // distinct mobile check or bounds check: if dropdown (assume ~250px) would overflow right, align to right
            if (left + 260 > window.innerWidth) {
                left = window.innerWidth - 270; // 260px width + 10px padding
            }
            if (left < 10) left = 10; // min left margin

            // Vertical Check
            const dropdownHeight = 240; // Approximate height of menu
            let top = rect.bottom + 8;

            // If dropping down goes off screen, go UP instead
            if (top + dropdownHeight > window.innerHeight) {
                top = rect.top - dropdownHeight - 8;
            }

            setCoords({
                top: top,
                left: left,
                originY: top > rect.top ? 0 : 1 // Transformation origin (0=top, 1=bottom) for animation from correct side
            });
        }
    };

    const toggleOpen = () => {
        if (!isOpen) {
            updatePosition();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const handleClose = () => setIsOpen(false);
            window.addEventListener('resize', handleClose);
            // Removed scroll listener to prevent immediate closing on mobile touch

            return () => {
                window.removeEventListener('resize', handleClose);
            };
        }
    }, [isOpen]);

    // Remove the complex window event listeners for click outside
    // We will use a backdrop approach instead

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
        <>
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen();
                }}
                className={twMerge(
                    "neural-badge cursor-pointer pr-8 relative transition-all active:scale-95 min-w-[140px] justify-start",
                    getStatusStyle(currentStatus)
                )}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
                {currentStatus}
                <ChevronDown className={twMerge("absolute right-2 top-1/2 -translate-y-1/2 transition-transform", isOpen ? "rotate-180" : "")} size={12} />
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-start justify-start">
                    {/* Invisible Backdrop to handle closing */}
                    <div
                        className="fixed inset-0 bg-black/10 backdrop-blur-[1px]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    />

                    {/* The Dropdown Menu */}
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95, scaleY: 0.8, transformOrigin: `50% ${coords.originY * 100}%` }}
                        animate={{ opacity: 1, scale: 1, scaleY: 1 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: coords.top,
                            left: coords.left,
                            width: '250px'
                        }}
                        className="relative bg-[#0a0a0a] border border-[var(--card-border)] rounded-2xl shadow-2xl overflow-hidden p-1.5 z-50"
                    >
                        {statuses.map(status => (
                            <button
                                key={status}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(status);
                                }}
                                className={twMerge(
                                    "w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-between group whitespace-nowrap",
                                    status === currentStatus
                                        ? "bg-brand-blue/10 text-[var(--text-primary)]"
                                        : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                                )}
                            >
                                {status}
                                {status === currentStatus && <Check size={14} className="text-brand-blue" />}
                            </button>
                        ))}
                    </motion.div>
                </div>,
                document.body
            )}
        </>
    );
};

export default StatusDropdown;

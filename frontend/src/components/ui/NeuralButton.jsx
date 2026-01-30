import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const NeuralButton = ({ children, onClick, variant = 'primary', className, icon: Icon }) => {
    const variants = {
        primary: 'btn-neural-primary',
        secondary: 'btn-neural-secondary',
        danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={twMerge(
                "btn-neural",
                variants[variant],
                className
            )}
        >
            {Icon && <Icon size={16} />}
            {children}
        </motion.button>
    );
};

export default NeuralButton;

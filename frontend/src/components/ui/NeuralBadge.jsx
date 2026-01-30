import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const NeuralBadge = ({ children, variant = 'pending', className }) => {
    const variants = {
        success: 'neural-badge-success',
        pending: 'neural-badge-pending',
        danger: 'neural-badge-danger',
    };

    return (
        <span className={twMerge(
            "neural-badge",
            variants[variant] || variants.pending,
            className
        )}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {children}
        </span>
    );
};

export default NeuralBadge;

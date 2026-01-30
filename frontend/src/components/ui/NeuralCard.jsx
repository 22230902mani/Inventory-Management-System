import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const NeuralCard = ({ children, className, gradient, delay = 0, ...props }) => {
    const gradientClass = gradient === 'blue' ? 'card-gradient-blue' :
        gradient === 'pink' ? 'card-gradient-pink' :
            gradient === 'green' ? 'card-gradient-green' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
            className={twMerge(
                "neural-glass p-6 magnetic-hover",
                gradientClass,
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default NeuralCard;

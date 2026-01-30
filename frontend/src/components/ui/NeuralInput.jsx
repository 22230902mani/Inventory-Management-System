import React from 'react';
import { twMerge } from 'tailwind-merge';

const NeuralInput = ({ label, className, ...props }) => {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "input-neural",
                    className
                )}
                {...props}
            />
        </div>
    );
};

export default NeuralInput;

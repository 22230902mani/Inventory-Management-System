import React from 'react';
import { motion } from 'framer-motion';

const ChatStories = ({ users, onSelect, selectedUserId }) => {
    return (
        <div className="w-full flex gap-5 overflow-x-auto py-2 px-1 scrollbar-hide select-none mb-1 shadow-inner bg-black/10 rounded-xl">
            {/* Add Story / Your Story (Optional mock, or just list users) */}
            <div className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group ml-1">
                <div className="w-[58px] h-[58px] rounded-full p-[2px] border-2 border-[#333] border-dashed flex items-center justify-center hover:border-white/40 transition-colors">
                    <div className="w-full h-full rounded-full bg-[#202020] flex items-center justify-center">
                        <span className="text-xl text-white/50 group-hover:text-white transition-colors font-light">+</span>
                    </div>
                </div>
                <span className="text-[10px] text-[#888] font-medium group-hover:text-[#ccc] transition-colors">Internal</span>
            </div>

            {users.map((user) => {
                const isSelected = selectedUserId === user._id;

                return (
                    <motion.div
                        key={user._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(user)}
                        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
                    >
                        {/* Instagram-style Gradient Ring */}
                        <div className={`w-[60px] h-[60px] rounded-full p-[2px] shadow-lg transition-all duration-300 ${isSelected ? 'bg-green-500 scale-105' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90'}`}>
                            {/* Inner Border to separate ring from image */}
                            <div className="bg-[#0f0f12] p-[2px] rounded-full w-full h-full">
                                {/* Avatar/Image */}
                                <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden relative ${isSelected ? 'bg-[#1a1a1a]' : 'bg-[#2a2a2a]'}`}>
                                    {/* Fallback Initial */}
                                    <span className={`text-lg font-bold z-10 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <span className={`text-[11px] font-medium truncate w-[70px] text-center tracking-wide ${isSelected ? 'text-white' : 'text-[#888] group-hover:text-[#ccc] transition-colors'}`}>
                            {user.name?.split(' ')[0]} {/* First Name Only for Stories look */}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ChatStories;

import React, { useState, useEffect, useRef } from 'react';
import { Send, Leaf, Phone, Video, Mic, Paperclip, CheckCheck, Check, Smile, MoreVertical, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EcoChat = ({
    currentUser,
    contacts,
    messages,
    onSendMessage,
    onSelectContact,
    selectedContact,
    loading,
    singleContactMode = false,
    chatTitle = "Secure Chat"
}) => {
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesContainerRef = useRef(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = (smooth = true) => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    // 1. Force scroll to bottom when changing contacts
    useEffect(() => {
        // Use auto (instant) scroll to prevent jumpiness on load
        scrollToBottom(false);
    }, [selectedContact]);

    // 2. Smart auto-scroll for new messages
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Check if user is near the bottom (within 200px)
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;

        if (isNearBottom || messages.length < 5) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;
        onSendMessage(input, selectedFile);
        setInput('');
        setSelectedFile(null);
        // Always scroll to bottom when WE send a message
        setTimeout(() => scrollToBottom(true), 50);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImageLoad = () => {
        // Only scroll on image load if we are already at the bottom
        const container = messagesContainerRef.current;
        if (container && container.scrollHeight - container.scrollTop - container.clientHeight < 200) {
            scrollToBottom();
        }
    };

    const getDateLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (date > oneWeekAgo) {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex h-[85vh] w-full bg-[#1e1b4b] rounded-2xl overflow-hidden border border-[#4c1d95] shadow-2xl relative font-sans">

            {/* LEFT SIDEBAR: Contact List (Bg: Deep Indigo) */}
            {!singleContactMode && (
                <div className={`w-full md:w-[350px] bg-[#1a1625] border-r border-[#4c1d95] flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'} z-20`}>
                    {/* Sidebar Header */}
                    <div className="h-16 px-4 bg-[#110e1b] flex items-center justify-between border-b border-[#4c1d95] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center shadow-lg">
                                <Leaf className="text-white" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-[#eaeaea] tracking-tight">{chatTitle}</h2>
                        </div>
                        <div className="flex gap-3 text-[#c4b5fd]">
                            <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-3 bg-[#1a1625] border-b border-[#4c1d95]">
                        <div className="bg-[#2e2640] rounded-lg flex items-center px-4 py-2 border border-[#4c1d95]/50">
                            <Search size={18} className="text-[#c4b5fd]" />
                            <input
                                type="text"
                                placeholder="Search or start new chat"
                                className="bg-transparent border-none focus:ring-0 text-[#eaeaea] text-sm w-full ml-3 placeholder-[#c4b5fd]"
                            />
                        </div>
                    </div>

                    {/* Contacts List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {contacts.map(contact => {
                            const isSelected = selectedContact?._id === contact._id;
                            return (
                                <button
                                    key={contact._id}
                                    onClick={() => onSelectContact(contact)}
                                    className={`w-full p-4 flex items-center gap-3 transition-all duration-200 border-b border-[#4c1d95]/30 hover:bg-[#2e2640] ${isSelected ? 'bg-[#2e2640]' : ''}`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-[#4c1d95] flex items-center justify-center text-white font-bold text-lg">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-[#eaeaea] font-medium text-[16px] truncate">{contact.name}</h3>
                                            <span className="text-xs text-[#c4b5fd]">10:42 AM</span>
                                        </div>
                                        <p className="text-[#a78bfa] text-sm truncate mt-0.5">{contact.role}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* RIGHT SIDE: Chat Area (Bg: Dark Purple) */}
            <div className={`flex-1 flex flex-col bg-[#1e1b4b] relative ${(!selectedContact && !singleContactMode) ? 'hidden md:flex' : 'flex'} z-10`}>

                {(selectedContact || singleContactMode) ? (
                    <>
                        {/* Chat Header (Bg: Deepest Purple) */}
                        <div className="h-16 px-4 bg-[#110e1b] flex items-center justify-between border-b border-[#4c1d95] shadow-sm z-20 shrink-0">
                            <div className="flex items-center gap-3">
                                {!singleContactMode && (
                                    <button onClick={() => onSelectContact(null)} className="md:hidden text-[#c4b5fd]">
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <div className="w-10 h-10 rounded-full bg-[#4c1d95] flex items-center justify-center text-white font-bold">
                                    {selectedContact?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-[#eaeaea] font-medium leading-tight cursor-pointer hover:underline">
                                        {selectedContact?.name || (singleContactMode ? 'Admin Headquarters' : 'Select Contact')}
                                    </h3>
                                    <span className="text-xs text-[#10b981] font-medium truncate">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-[#c4b5fd]">
                                <Video size={20} className="hover:text-white cursor-pointer" />
                                <Phone size={20} className="hover:text-white cursor-pointer" />
                                <div className="w-[1px] h-6 bg-[#4c1d95] hidden md:block"></div>
                                <Search size={20} className="hover:text-white cursor-pointer hidden md:block" />
                                <MoreVertical size={20} className="hover:text-white cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3 relative z-10">
                            {messages.map((msg, idx) => {
                                const currentDateLabel = getDateLabel(msg.createdAt);
                                const prevDateLabel = idx > 0 ? getDateLabel(messages[idx - 1].createdAt) : null;
                                const showDateHeader = currentDateLabel !== prevDateLabel;

                                const senderId = (msg.sender && typeof msg.sender === 'object') ? (msg.sender._id || msg.sender.id) : msg.sender;
                                const currentUserId = currentUser?._id || currentUser?.id;
                                const isMe = (senderId && currentUserId) && (String(senderId) === String(currentUserId));
                                const isSystem = !senderId;

                                // Dynamic Theme Logic
                                const userRole = currentUser?.role?.toLowerCase() || 'admin';
                                const isSalesView = userRole === 'sales' || userRole === 'salesperson';

                                const theme = isSalesView
                                    ? {
                                        me: { bg: 'bg-[#7c3aed]', tail: 'text-[#7c3aed]', text: 'text-white' },   // Purple (Keep)
                                        them: { bg: 'bg-[#ea580c]', tail: 'text-[#ea580c]', text: 'text-white' }  // Orange (Keep)
                                    }
                                    : {
                                        me: { bg: 'bg-[#000080]', tail: 'text-[#000080]', text: 'text-white' },   // Navy Blue
                                        them: { bg: 'bg-[#dc2626]', tail: 'text-[#dc2626]', text: 'text-white' }  // Red (New, fulfilling request)
                                    };

                                const currentStyle = isMe ? theme.me : theme.them;

                                return (
                                    <React.Fragment key={msg._id || idx}>
                                        {showDateHeader && (
                                            <div className="flex justify-center my-5">
                                                <span className="bg-[#2e2640]/80 backdrop-blur-sm text-[#c4b5fd] text-[11px] font-medium px-4 py-1 rounded-full shadow-sm border border-[#4c1d95]/50 select-none">
                                                    {currentDateLabel}
                                                </span>
                                            </div>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`
                                                relative w-fit max-w-[85%] md:max-w-[60%] p-3.5 shadow-md
                                                ${isMe
                                                    ? `${currentStyle.bg} rounded-2xl rounded-tr-sm ${currentStyle.text}`
                                                    : `${currentStyle.bg} rounded-2xl rounded-tl-sm ${currentStyle.text}`
                                                }
                                            `}>
                                                {/* TAIL SVG */}
                                                {isMe ? (
                                                    <svg className={`absolute -right-2 top-0 ${currentStyle.tail}`} width="8" height="13" viewBox="0 0 8 13"><path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor"></path></svg>
                                                ) : (
                                                    <svg className={`absolute -left-2 top-0 ${currentStyle.tail}`} width="8" height="13" viewBox="0 0 8 13"><path d="M-2.188 1H3v11.193l-6.467-8.625C-4.526 2.156 -3.958 1 -2.188 1z" fill="currentColor" transform="scale(-1, 1) translate(-8, 0)"></path></svg>
                                                )}

                                                <div className="px-1">
                                                    {/* Sender Name */}
                                                    {!isSystem && !isMe && (
                                                        <span className="block text-[13px] font-bold text-white/80 mb-1 leading-tight">
                                                            {msg.sender?.name || 'Unknown'}
                                                        </span>
                                                    )}

                                                    {/* Attachment */}
                                                    {msg.attachment && (
                                                        <div className="mb-2 mt-1 rounded-md overflow-hidden bg-black/20">
                                                            {msg.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                                <img
                                                                    src={`http://localhost:6700${msg.attachment}`}
                                                                    alt="attachment"
                                                                    className="w-full h-auto object-cover max-h-[300px]"
                                                                    onLoad={handleImageLoad}
                                                                />
                                                            ) : (
                                                                <a href={`http://localhost:6700${msg.attachment}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                                                                    <div className="p-2 bg-neutral-800 rounded-lg">
                                                                        <Paperclip size={20} className="text-gray-300" />
                                                                    </div>
                                                                    <span className="text-sm underline truncate">{msg.attachment.split('/').pop()}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Text Content */}
                                                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                        {/* Time & Read Status */}
                                                        <span className="inline-block w-12 align-bottom"></span> {/* Spacer */}
                                                        <span className="float-right flex items-center gap-1 ml-2 mt-1 relative top-1">
                                                            <span className={`text-[11px] font-medium ${isMe ? 'text-white/70' : 'text-white/80'}`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                                                            </span>
                                                            {isMe && (
                                                                msg.status === 'seen' ? (
                                                                    <CheckCheck size={14} className="text-[#3b82f6]" /> // Double Blue
                                                                ) : msg.status === 'delivered' ? (
                                                                    <CheckCheck size={14} className="text-gray-300" /> // Double Gray
                                                                ) : (
                                                                    <Check size={14} className="text-gray-300" /> // Single Gray
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </React.Fragment>
                                );
                            })}
                            <div ref={bottomRef} className="h-2" />
                        </div>

                        {/* Input Area (Bg: Dark Indigo) */}
                        <div className="min-h-[76px] px-6 py-4 bg-[#2e2640] flex items-center gap-4 border-t border-[#4c1d95] z-20 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
                            <div className="flex gap-3 text-[#c4b5fd]">
                                <button className="p-2.5 hover:bg-[#4c1d95]/50 rounded-full transition-all active:scale-95"><Smile size={22} /></button>
                                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-[#4c1d95]/50 rounded-full transition-all active:scale-95 relative">
                                    <Paperclip size={22} />
                                    {selectedFile && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#2e2640]"></span>}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                            </div>

                            <form onSubmit={handleSend} className="flex-1">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={selectedFile ? `File: ${selectedFile.name} (Add caption...)` : "Type a message"}
                                    className="w-full bg-[#1e1b4b] text-[#eaeaea] placeholder-[#8b80b6] rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7c3aed]/50 text-[15px] border border-[#4c1d95] shadow-inner transition-all"
                                />
                            </form>

                            <button onClick={handleSend} className={`p-3 rounded-full transition-colors shadow-lg flex items-center justify-center ${input.trim() || selectedFile ? 'bg-[#7c3aed] text-white' : 'text-[#c4b5fd] hover:bg-[#4c1d95]/50'}`}>
                                {input.trim() || selectedFile ? <Send size={24} className="ml-0.5" /> : <Mic size={24} />}
                            </button>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1b4b] h-full">
                        <div className="max-w-[400px] text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#2e2640] mb-4 shadow-lg border border-[#4c1d95]">
                                <Leaf size={40} className="text-[#10b981]" />
                            </div>
                            <h1 className="text-[#eaeaea] text-3xl font-light">IMS Secure Chat</h1>
                            <p className="text-[#c4b5fd] text-sm leading-6">
                                Select a contact to start communication.<br />
                                Encrypted and secure for enterprise use.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EcoChat;

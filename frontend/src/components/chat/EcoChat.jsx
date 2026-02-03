import React, { useState, useEffect, useRef } from 'react';
import { Send, Leaf, Phone, Video, Mic, Paperclip, CheckCheck, Check, Smile, MoreVertical, Search, ArrowLeft, Trash2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
    const [markedAsRead, setMarkedAsRead] = useState(new Set());
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerIntervalRef = useRef(null);
    const isCancelledRef = useRef(false);

    const handleEmojiClick = () => {
        setInput(prev => prev + "😊 ");
    };

    const startTimer = () => {
        setRecordingTime(0);
        timerIntervalRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const cancelRecording = () => {
        isCancelledRef.current = true;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        stopTimer();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleRecording = async () => {
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            alert("Recording not supported in this browser.");
            return;
        }

        if (isRecording) {
            isCancelledRef.current = false;
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
            stopTimer();
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunksRef.current.push(e.data);
                };

                recorder.onstop = () => {
                    if (isCancelledRef.current) {
                        console.log("Recording cancelled/discarded.");
                    } else {
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
                        onSendMessage("🎤 Voice Message", audioFile);
                    }

                    stream.getTracks().forEach(track => track.stop());
                };

                recorder.start();
                setIsRecording(true);
                startTimer();
                if (navigator.vibrate) navigator.vibrate(50);
            } catch (err) {
                console.error("Mic access error:", err);
                alert("Microphone access is required for voice notes.");
            }
        }
    };

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
        scrollToBottom(false);
    }, [selectedContact]);

    // 2. Smart auto-scroll for new messages
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            scrollToBottom();
        }
    }, [messages, selectedContact]);

    // 3. Auto-mark messages as read when displayed
    useEffect(() => {
        const markMessagesAsRead = async () => {
            const token = localStorage.getItem('token');
            if (!token || !currentUser) return;

            // Find messages sent TO me that I haven't marked as read yet
            const unreadMessages = messages.filter(msg => {
                const receiverId = msg.receiver?._id || msg.receiver;
                const senderId = msg.sender?._id || msg.sender;
                const myId = currentUser._id || currentUser.id;

                return (
                    String(receiverId) === String(myId) &&
                    String(senderId) !== String(myId) &&
                    msg.status !== 'seen' &&
                    !markedAsRead.has(msg._id)
                );
            });

            for (const msg of unreadMessages) {
                try {
                    await axios.put(
                        `http://localhost:6700/api/messages/${msg._id}/read`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setMarkedAsRead(prev => new Set([...prev, msg._id]));
                } catch (error) {
                    console.error('Error marking message as read:', error);
                }
            }
        };

        markMessagesAsRead();
    }, [messages, currentUser, markedAsRead]);

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
        <div className="flex h-full w-full bg-[#1e1b4b] overflow-hidden relative font-sans">

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
                        <div className="h-14 sm:h-16 px-4 bg-[#110e1b] flex items-center justify-between border-b border-[#4c1d95] shadow-sm z-20 shrink-0">
                            <div className="flex items-center gap-3">
                                {!singleContactMode && (
                                    <button onClick={() => onSelectContact(null)} className="md:hidden text-[#c4b5fd]">
                                        <ArrowLeft size={22} />
                                    </button>
                                )}
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#4c1d95] flex items-center justify-center text-white font-bold">
                                    {selectedContact?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-[#eaeaea] text-sm sm:text-base font-medium leading-tight cursor-pointer hover:underline">
                                        {selectedContact?.name || (singleContactMode ? 'Admin Headquarters' : 'Select Contact')}
                                    </h3>
                                    <span className="text-[10px] sm:text-xs text-[#10b981] font-medium truncate">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6 text-[#c4b5fd]">
                                <Video size={18} className="hover:text-white cursor-pointer" />
                                <Phone size={18} className="hover:text-white cursor-pointer" />
                                <div className="w-[1px] h-5 bg-[#4c1d95] hidden md:block"></div>
                                <Search size={18} className="hover:text-white cursor-pointer hidden md:block" />
                                <MoreVertical size={18} className="hover:text-white cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5 space-y-2 relative z-10">
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
                                                relative w-fit max-w-[75%] md:max-w-[45%] px-3 py-1.5 shadow-sm
                                                ${isMe
                                                    ? `${currentStyle.bg} rounded-xl rounded-tr-sm ${currentStyle.text}`
                                                    : `${currentStyle.bg} rounded-xl rounded-tl-sm ${currentStyle.text}`
                                                }
                                            `}>
                                                {/* TAIL SVG */}
                                                {isMe ? (
                                                    <svg className={`absolute -right-2 top-0 ${currentStyle.tail}`} width="8" height="13" viewBox="0 0 8 13"><path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" fill="currentColor"></path></svg>
                                                ) : (
                                                    <svg className={`absolute -left-2 top-0 ${currentStyle.tail}`} width="8" height="13" viewBox="0 0 8 13"><path d="M-2.188 1H3v11.193l-6.467-8.625C-4.526 2.156 -3.958 1 -2.188 1z" fill="currentColor" transform="scale(-1, 1) translate(-8, 0)"></path></svg>
                                                )}

                                                <div className="px-0.5">
                                                    {/* Sender Name */}
                                                    {!isSystem && !isMe && (
                                                        <span className="block text-[11px] font-black text-white/50 mb-0.5 uppercase tracking-wider leading-tight">
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
                                                            ) : msg.attachment.match(/\.(mp3|wav|webm|m4a|ogg)$/i) ? (
                                                                <audio controls className="w-full h-10 filter invert brightness-150">
                                                                    <source src={`http://localhost:6700${msg.attachment}`} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
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
                                                    <div className="text-[14px] leading-tight whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                        {/* Time & Read Status */}
                                                        <span className="inline-block w-8 align-bottom"></span> {/* Reduced Spacer */}
                                                        <span className="float-right flex items-center gap-0.5 ml-1.5 mt-1 relative top-1">
                                                            <span className={`text-[9px] font-bold ${isMe ? 'text-white/60' : 'text-white/70'} uppercase`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
                                                            </span>
                                                            {isMe && (
                                                                msg.status === 'seen' ? (
                                                                    <CheckCheck size={12} className="text-[#3b82f6]" /> // Double Blue
                                                                ) : msg.status === 'delivered' ? (
                                                                    <CheckCheck size={12} className="text-gray-300/50" /> // Double Gray
                                                                ) : (
                                                                    <Check size={12} className="text-gray-300/50" /> // Single Gray
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
                        <div className="min-h-[64px] sm:min-h-[76px] px-3 sm:px-6 py-3 sm:py-4 bg-[#2e2640] flex items-center gap-2 sm:gap-4 border-t border-[#4c1d95] z-20 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
                            {isRecording ? (
                                <div className="flex-1 flex items-center justify-between bg-[#1e1b4b] rounded-xl px-4 py-2 border border-red-500/30 animate-pulse">
                                    <button
                                        type="button"
                                        onClick={cancelRecording}
                                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-all"
                                        title="Cancel"
                                    >
                                        <Trash2 size={22} />
                                    </button>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                        <span className="text-[15px] font-black text-white italic tracking-tighter">
                                            {formatTime(recordingTime)}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={toggleRecording}
                                        className="p-2.5 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95 transition-all"
                                        title="Stop & Send"
                                    >
                                        <Send size={20} className="ml-0.5" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-1 sm:gap-3 text-[#c4b5fd]">
                                        <button
                                            type="button"
                                            onClick={handleEmojiClick}
                                            className="p-2 hover:bg-[#4c1d95]/50 rounded-full transition-all active:scale-95"
                                        >
                                            <Smile size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2 hover:bg-[#4c1d95]/50 rounded-full transition-all active:scale-95 relative"
                                        >
                                            <Paperclip size={20} />
                                            {selectedFile && <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-[#2e2640]"></span>}
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                                    </div>

                                    <form onSubmit={handleSend} className="flex-1">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={selectedFile ? `File: ${selectedFile.name}` : "Message"}
                                            className="w-full bg-[#1e1b4b] text-[#eaeaea] placeholder-[#8b80b6] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#7c3aed]/50 text-[14px] border border-[#4c1d95] shadow-inner transition-all"
                                        />
                                    </form>

                                    <button
                                        type="button"
                                        onClick={(input.trim() || selectedFile) ? handleSend : toggleRecording}
                                        className={`p-2.5 sm:p-3 rounded-full transition-colors shadow-lg flex items-center justify-center ${input.trim() || selectedFile ? 'bg-[#7c3aed] text-white' : 'text-[#c4b5fd] hover:bg-[#4c1d95]/50'}`}
                                    >
                                        {input.trim() || selectedFile ? <Send size={22} className="ml-0.5" /> : <Mic size={22} />}
                                    </button>
                                </>
                            )}
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

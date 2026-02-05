import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import EcoChat from '../components/chat/EcoChat';
import { Leaf } from 'lucide-react';

const AdminComms = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch messages for the current user (Manager)
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
            // Retrieve my messages. The backend filters for relevant messages.
            const res = await axios.get(`${config.API_BASE_URL}/api/messages`, axiosConfig);
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds for real-time feel
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async (content, file) => {
        try {
            const token = localStorage.getItem('token');
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

            let attachmentPath = null;

            // 1. Upload File if present
            if (file) {
                const formData = new FormData();
                formData.append('images', file);

                const uploadRes = await axios.post(`${config.API_BASE_URL}/api/upload`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (uploadRes.data.filePaths && uploadRes.data.filePaths.length > 0) {
                    attachmentPath = uploadRes.data.filePaths[0];
                }
            }

            // 2. Send message to Admin (receiverId: null represents Admin)
            await axios.post(`${config.API_BASE_URL}/api/messages`,
                {
                    receiverId: null,
                    content: content || (file ? "Sent an attachment" : ""),
                    attachment: attachmentPath
                },
                axiosConfig
            );

            // Refresh messages immediately to show updated status
            fetchMessages();
        } catch (error) {
            console.error("Error sending message", error);
            alert(`Transmission Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--bg-primary)] pb-20 lg:pb-6">
            {/* Header (Hidden on Mobile for immersive chat) */}
            <div className="shrink-0 px-4 md:px-6 pt-4 space-y-4 hidden md:block">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">HEADQUARTERS LINK</h1>
                        <p className="text-[var(--text-secondary)] font-medium tracking-wide">Direct secure line to Admin Command.</p>
                    </div>
                    <div className="hidden md:block p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse">
                        <Leaf className="text-emerald-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Chat Area - Full width/height on Mobile */}
            <div className="flex-1 min-h-0 px-0 pt-0 md:px-6 md:pt-4 transition-all duration-300">
                <div className="h-full w-full overflow-hidden border-0 md:border md:rounded-2xl shadow-none md:shadow-2xl md:shadow-black/50 bg-[var(--card-bg)] border-[var(--card-border)]">
                    <EcoChat
                        currentUser={user}
                        contacts={[]}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onSelectContact={() => { }}
                        selectedContact={null}
                        loading={loading}
                        singleContactMode={true}
                        chatTitle="Admin Uplink"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminComms;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Retrieve my messages. The backend filters for relevant messages.
            const res = await axios.get('http://localhost:6700/api/messages', config);
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
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let attachmentPath = null;

            // 1. Upload File if present
            if (file) {
                const formData = new FormData();
                formData.append('images', file);

                const uploadRes = await axios.post('http://localhost:6700/api/upload', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (uploadRes.data.filePaths && uploadRes.data.filePaths.length > 0) {
                    attachmentPath = uploadRes.data.filePaths[0];
                }
            }

            // 2. Send message to Admin (receiverId: null represents Admin)
            await axios.post('http://localhost:6700/api/messages',
                {
                    receiverId: null,
                    content: content || (file ? "Sent an attachment" : ""),
                    attachment: attachmentPath
                },
                config
            );

            // Refresh messages immediately to show updated status
            fetchMessages();
        } catch (error) {
            console.error("Error sending message", error);
            alert(`Transmission Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">HEADQUARTERS LINK</h1>
                    <p className="text-[var(--text-secondary)] font-medium tracking-wide">Direct secure line to Admin Command.</p>
                </div>
                <div className="hidden md:block p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse">
                    <Leaf className="text-emerald-500" size={24} />
                </div>
            </div>

            <EcoChat
                currentUser={user}
                contacts={[]} // No contacts needed for Single Mode
                messages={messages}
                onSendMessage={handleSendMessage}
                onSelectContact={() => { }}
                selectedContact={null} // Important: Leave null to test Single Mode visuals, or pass dummy if needed
                loading={loading}
                singleContactMode={true}
                chatTitle="Admin Uplink"
            />
        </div>
    );
};

export default AdminComms;

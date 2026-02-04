import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import EcoChat from '../components/chat/EcoChat';
import { Leaf } from 'lucide-react';

const SalesComms = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch messages for the current user (Sales)
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
            // Retrieve my messages. The backend filters for relevant messages.
            const res = await axios.get(`${config.API_BASE_URL}/api/messages`, axiosConfig);
            setMessages(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages", error);
            setMessages([]);
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
        <div className="flex flex-col h-full w-full overflow-hidden">
            <EcoChat
                currentUser={user}
                contacts={[]} // No contacts needed for Single Mode
                messages={messages}
                onSendMessage={handleSendMessage}
                onSelectContact={() => { }}
                selectedContact={null}
                loading={loading}
                singleContactMode={true}
                chatTitle="Admin Uplink"
            />
        </div>
    );
};

export default SalesComms;

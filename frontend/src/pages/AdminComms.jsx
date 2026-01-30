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

    const handleSendMessage = async (content) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Send to Admin (receiverId: null represents System/Admin in our simplified backend logic)
            // Or if we want to be explicit, we could fetch admin ID, but 'null' works for general 'Admin' box often.
            // Let's assume sending to 'null' for now as per previous patterns or use known Admin ID convention.
            // Actually, best to fetch Admin ID once if needed, but `receiverId: null` is often used for "Support/Admin".
            // Let's verify backend handling of null receiver... 
            // `sendMessage`: `receiver: receiverId`.
            // `getManagerMessages` (Admin) fetches `receiver: req.user._id` OR `receiver: null`.
            // So sending to `null` puts it in the Admin's "Global/System" inbox view.
            // This is perfect.

            await axios.post('http://localhost:6700/api/messages',
                { receiverId: null, content },
                config
            );

            fetchMessages();
        } catch (error) {
            console.error("Error sending message", error);
            alert("Failed to transmit. Secure link unstable.");
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

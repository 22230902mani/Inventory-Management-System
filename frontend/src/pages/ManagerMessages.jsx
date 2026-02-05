import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../context/AuthContext';
import EcoChat from '../components/chat/EcoChat';
import { Leaf } from 'lucide-react';
import ChatStories from '../components/chat/ChatStories';

const ManagerMessages = () => {
    const { user } = useAuth();
    const [allMessages, setAllMessages] = useState([]); // Store ALL fetched messages
    const [filteredMessages, setFilteredMessages] = useState([]); // Messages for selected contact
    const [managers, setManagers] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch Managers (Contacts)
            const usersRes = await axios.get(`${config.API_BASE_URL}/api/dashboard/users-list`, axiosConfig);
            // Robust case-insensitive check for managers
            const activeManagers = Array.isArray(usersRes.data) ? usersRes.data.filter(u =>
                u.role && u.role.toLowerCase() === 'manager'
            ) : [];

            // 2. Fetch All Manager Messages
            const msgsRes = await axios.get(`${config.API_BASE_URL}/api/messages/managers`, axiosConfig);
            const rawMessages = Array.isArray(msgsRes.data) ? msgsRes.data : [];

            setManagers(activeManagers);
            setAllMessages(rawMessages);
            setLoading(false);

            // If a contact is already selected, update their messages live
            // Note: We need to use the functional update or ref to direct this properly if relying on interval
            // But since 'selectedContact' is state, we can't capture it easily in interval closure without ref.
            // However, the Effect below handles updating 'filteredMessages' when 'allMessages' changes.
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    // Effect to fetch data periodically
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000); // Poll frequently for chat feel
        return () => clearInterval(interval);
    }, []);

    // Effect to filtering messages when data or selection changes
    useEffect(() => {
        if (selectedContact) {
            // Filter messages between Me (Admin) and Contact (Manager)
            // OR Messages sent by Contact to 'null' (Broadcast/Admin system)
            const chat = allMessages.filter(msg => {
                const senderId = (msg.sender && typeof msg.sender === 'object') ? msg.sender._id : msg.sender;
                const receiverId = (msg.receiver && typeof msg.receiver === 'object') ? msg.receiver._id : msg.receiver;

                // Match conversation: 
                // 1. Sender is Contact (Manager) AND Receiver is Me/Null
                // 2. Sender is Me (Admin) AND Receiver is Contact (Manager)

                const isFromContact = senderId === selectedContact._id;
                const isToContact = receiverId === selectedContact._id;

                return isFromContact || isToContact;
            });

            // Sort by Time Ascending for Chat
            chat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setFilteredMessages(chat);
        } else {
            setFilteredMessages([]);
        }
    }, [allMessages, selectedContact]);

    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
    };

    const handleSendMessage = async (content) => {
        if (!selectedContact) return;
        try {
            const token = localStorage.getItem('token');
            const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${config.API_BASE_URL}/api/messages`,
                { receiverId: selectedContact._id, content },
                axiosConfig
            );

            // Trigger immediate fetch
            fetchData();
        } catch (error) {
            console.error("Error sending message", error);
            alert("Transmission Error");
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--bg-primary)] pb-20 lg:pb-6">
            {/* Header & Stories (Hidden on Mobile when Chat is Open) */}
            <div className={`shrink-0 px-4 md:px-6 pt-4 space-y-4 ${selectedContact ? 'hidden md:block' : ''}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">MANAGER COMMUNICATIONS</h1>
                        <p className="text-[var(--text-secondary)] font-medium tracking-wide">Direct secure line to Field Operatives.</p>
                    </div>
                    <div className="hidden md:block p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse">
                        <Leaf className="text-emerald-500" size={24} />
                    </div>
                </div>

                <ChatStories
                    users={managers}
                    onSelect={handleContactSelect}
                    selectedUserId={selectedContact?._id}
                />
            </div>

            {/* Chat Area - Full width/height on Mobile when Selected */}
            <div className={`flex-1 min-h-0 ${selectedContact ? 'px-0 pt-0' : 'px-4 pt-4'} md:px-6 md:pt-4 transition-all duration-300`}>
                <div className={`h-full w-full overflow-hidden border shadow-2xl shadow-black/50 bg-[var(--card-bg)] ${selectedContact ? 'rounded-none border-x-0 border-t-0' : 'rounded-2xl border-[var(--card-border)]'}`}>
                    <EcoChat
                        currentUser={user}
                        contacts={managers}
                        messages={filteredMessages}
                        onSendMessage={handleSendMessage}
                        onSelectContact={handleContactSelect}
                        selectedContact={selectedContact}
                        loading={loading}
                        singleContactMode={false} // Sidebar enabled for Admin so they can pick which manager to talk to
                        chatTitle="Manager Network"
                    />
                </div>
            </div>
        </div>
    );
};

export default ManagerMessages;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch Managers (Contacts)
            const usersRes = await axios.get('http://localhost:6700/api/dashboard/users-list', config);
            // Robust case-insensitive check for managers
            const activeManagers = usersRes.data.filter(u =>
                u.role && u.role.toLowerCase() === 'manager'
            );

            // 2. Fetch All Manager Messages
            const msgsRes = await axios.get('http://localhost:6700/api/messages/managers', config);
            const rawMessages = msgsRes.data;

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
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:6700/api/messages',
                { receiverId: selectedContact._id, content },
                config
            );

            // Trigger immediate fetch
            fetchData();
        } catch (error) {
            console.error("Error sending message", error);
            alert("Transmission Error");
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
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

            <div className="h-[calc(100dvh-140px)] lg:h-[calc(100vh-220px)] lg:min-h-[600px] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-2xl shadow-black/50">
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
        </div >
    );
};

export default ManagerMessages;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EcoChat from '../components/chat/EcoChat';
import { Leaf } from 'lucide-react';
import ChatStories from '../components/chat/ChatStories';

const SalesMessages = () => {
    const { user } = useAuth();
    const [allMessages, setAllMessages] = useState([]); // Store ALL fetched messages
    const [filteredMessages, setFilteredMessages] = useState([]); // Messages for selected contact
    const [salesUsers, setSalesUsers] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch Users (User List) then filter for Sales
            const usersRes = await axios.get(`http://localhost:6700/api/dashboard/users-list?t=${Date.now()}`, config);

            // Filter for 'sales' role
            const activeSales = usersRes.data.filter(u =>
                u.role && u.role.toLowerCase() === 'sales'
            );

            // 2. Fetch All My Messages (Admin View)
            // Using standard getMessages guarantees we see anything we sent or received
            const msgsRes = await axios.get(`http://localhost:6700/api/messages?t=${Date.now()}`, config);
            const rawMessages = msgsRes.data;

            setSalesUsers(activeSales);
            setAllMessages(rawMessages);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    // Effect to fetch data periodically
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000); // Poll frequently
        return () => clearInterval(interval);
    }, []);

    // Effect to filtering messages when data or selection changes
    useEffect(() => {
        if (selectedContact) {
            // Filter messages between Me (Admin) and Contact (Sales)
            const chat = allMessages.filter(msg => {
                // Robust ID extraction and comparison
                const getIds = (obj) => {
                    if (!obj) return '';
                    const id = typeof obj === 'object' ? (obj._id || obj.id) : obj;
                    return String(id || '').trim();
                };

                const msgSenderId = getIds(msg.sender);
                const msgReceiverId = getIds(msg.receiver);
                const contactId = getIds(selectedContact);

                // Check if message involves the selected contact
                return msgSenderId === contactId || msgReceiverId === contactId;
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

    const handleSendMessage = async (content, file) => {
        if (!selectedContact) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let attachmentPath = null;

            // 1. Upload File if present
            if (file) {
                const formData = new FormData();
                formData.append('images', file); // Backend expects 'images' array

                const uploadRes = await axios.post('http://localhost:6700/api/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (uploadRes.data.filePaths && uploadRes.data.filePaths.length > 0) {
                    attachmentPath = uploadRes.data.filePaths[0];
                }
            }

            // 2. Send Message (Optimistic UI Update)
            const tempId = Date.now().toString();
            const newMessage = {
                _id: tempId,
                sender: user, // Current Admin User
                receiver: selectedContact,
                content: content || (file ? "Sent an attachment" : ""),
                attachment: attachmentPath,
                createdAt: new Date().toISOString()
            };

            // Immediately show in chat
            setAllMessages(prev => [...prev, newMessage]);

            await axios.post('http://localhost:6700/api/messages',
                {
                    receiverId: selectedContact._id,
                    content: content || (file ? "Sent an attachment" : ""),
                    attachment: attachmentPath
                },
                config
            );

            // Trigger fetch to sync real ID
            fetchData();
        } catch (error) {
            console.error("Error sending message", error);
            alert(`Transmission Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">


            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">
                        SALES COMMAND <span className="text-sm opacity-50 font-normal">({allMessages.length}/{filteredMessages.length})</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] font-medium tracking-wide">Secure channel for Field Sales Operatives.</p>
                </div>
                <div className="hidden md:block p-3 bg-orange-500/10 rounded-full border border-orange-500/20 animate-pulse">
                    <Leaf className="text-orange-500" size={24} />
                </div>
            </div>

            <ChatStories
                users={salesUsers}
                onSelect={handleContactSelect}
                selectedUserId={selectedContact?._id}
            />

            <div className="h-[calc(100dvh-140px)] lg:h-[calc(100vh-220px)] lg:min-h-[600px] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-2xl shadow-black/50">
                <EcoChat
                    currentUser={user}
                    contacts={salesUsers}
                    messages={filteredMessages}
                    onSendMessage={handleSendMessage}
                    onSelectContact={handleContactSelect}
                    selectedContact={selectedContact}
                    loading={loading}
                    singleContactMode={false} // Sidebar enabled for Admin
                    chatTitle="Sales Grid"
                />
            </div>
        </div>
    );
};

export default SalesMessages;

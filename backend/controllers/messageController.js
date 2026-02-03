const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, relatedProductId, attachment } = req.body;
        console.log(`[sendMessage] Sender: ${req.user._id} To: ${receiverId} Content: ${content}`);
        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            content,
            relatedProduct: relatedProductId,
            attachment,
            status: 'delivered' // Message is delivered once created
        });
        res.status(201).json(message);
    } catch (error) {
        console.error("[sendMessage] Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = { $or: [{ sender: req.user._id }, { receiver: req.user._id }, { receiver: null }] };
        } else {
            query = { $or: [{ sender: req.user._id }, { receiver: req.user._id }] };
        }

        const messages = await Message.find(query)
            .populate('sender', 'name email role')
            .populate('receiver', 'name email')
            .populate('relatedProduct', 'name')
            .sort({ createdAt: 1 });

        // Auto-mark messages as delivered when receiver fetches them
        const messagesToUpdate = messages.filter(m =>
            m.receiver &&
            String(m.receiver._id) === String(req.user._id) &&
            m.status === 'sent'
        );

        for (let msg of messagesToUpdate) {
            msg.status = 'delivered';
            await msg.save();
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const User = require('../models/User');

exports.markAsRead = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message.receiver && message.receiver.toString() === req.user._id.toString()) {
            message.isRead = true;
            message.status = 'seen'; // Blue tick
            message.readAt = new Date();
            await message.save();
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSalesMessages = async (req, res) => {
    try {
        console.log("Fetching sales messages (Robust Mode)");

        // 1. Get IDs of all sales users
        // The role might be 'sales' or 'Sales' or 'salesperson' - checking regex just in case, or strict 'sales'
        const salesUsers = await User.find({ role: { $regex: /^sales$/i } }).select('_id');
        const salesIds = salesUsers.map(u => u._id);

        console.log(`[getSalesMessages] Found ${salesIds.length} sales users:`, salesIds);

        // 2. Query Messages
        const query = {
            $or: [
                { sender: { $in: salesIds } },
                { receiver: { $in: salesIds } }
            ]
        };
        console.log("[getSalesMessages] Query:", JSON.stringify(query));

        const messages = await Message.find(query)
            .populate('sender', 'name email role')
            .populate('receiver', 'name email')
            .populate('relatedProduct', 'name')
            .sort({ createdAt: -1 }); // Newest first

        console.log(`Found ${messages.length} sales-related messages.`);

        res.json(messages);
    } catch (error) {
        console.error("Error in getSalesMessages:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getManagerMessages = async (req, res) => {
    try {
        console.log("Fetching manager messages (Robust Mode)");

        // 1. Get IDs of all managers to find messages FROM them
        const managers = await User.find({ role: { $regex: /^manager$/i } }).select('_id');
        const managerIds = managers.map(u => u._id);

        // 2. Query Messages
        // We want to see:
        // - Messages SENT by Managers (to anyone, but typically to Admin/NULL)
        // - Messages RECEIVED by Managers (from Admin)
        // - Messages containing Manager-specific directives (legacy)

        // Since Admins view this, they want to see conversations WITH managers.
        // So: (Sender IN managerIds) OR (Receiver IN managerIds)

        const messages = await Message.find({
            $or: [
                { sender: { $in: managerIds } },
                { receiver: { $in: managerIds } },
                { content: { $regex: /^\s*\[/ } }, // Legacy: Starts with [
                { content: { $regex: /\[PURPOSE:/i } } // Legacy: Contains [PURPOSE:
            ]
        })
            .populate('sender', 'name email role')
            .populate('receiver', 'name email')
            .populate('relatedProduct', 'name')
            .sort({ createdAt: -1 }); // Newest first

        console.log(`Found ${messages.length} manager-related messages.`);

        if (messages.length === 0) {
            console.log("No messages found. Injecting diagnostic.");
            // Optional: Inject diagnostic if needed, but let's keep it clean for now unless debugging
        }

        res.json(messages);
    } catch (error) {
        console.error("Error in getManagerMessages:", error);
        res.status(500).json({ message: error.message });
    }
};

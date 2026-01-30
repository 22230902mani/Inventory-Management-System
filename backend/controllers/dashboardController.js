const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        // Only count 'user' role, exclude 'admin' and 'manager'
        const totalUsers = await User.countDocuments({ role: 'user' });
        const lowStockCount = await Product.countDocuments({ $expr: { $lt: ["$quantity", "$lowStockThreshold"] } });
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({ status: { $ne: 'Cancelled' } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Recent orders
        const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

        const outOfStockCount = await Product.countDocuments({ quantity: 0 });
        const inStockCount = await Product.countDocuments({ quantity: { $gt: 0 } });

        res.json({
            totalProducts,
            totalUsers,
            lowStockCount,
            outOfStockCount,
            inStockCount,
            totalOrders,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user.id })
            .sort({ createdAt: -1 })
            .populate('from', 'name role');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sendInternalMessage = async (req, res) => {
    const { toEmail, title, message } = req.body;
    try {
        const recipient = await User.findOne({ email: toEmail });
        if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

        // Basic permission check
        // Manager can message User OR Admin
        if (req.user.role === 'manager' && (recipient.role !== 'user' && recipient.role !== 'admin')) {
            return res.status(403).json({ message: 'Managers can only message users or admins' });
        }

        const notification = new Notification({
            to: recipient._id,
            from: req.user.id,
            title,
            message
        });

        await notification.save();

        // Also create a Message record for chat history/persistence in the Message system
        const Message = require('../models/Message');
        const internalMsg = new Message({
            sender: req.user.id,
            receiver: recipient._id,
            content: `[${title.toUpperCase()}] ${message}`,
            isRead: false
        });
        await internalMsg.save();

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsersList = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTestNotification = async (req, res) => {
    try {
        const notification = new Notification({
            to: req.user.id,
            from: req.user.id,
            title: 'Test Signal Received',
            message: `This is a test notification created at ${new Date().toLocaleTimeString()}. The notification system is functioning correctly.`
        });
        await notification.save();
        res.status(201).json({ message: 'Test notification created', notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

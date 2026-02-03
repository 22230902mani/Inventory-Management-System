const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        console.log('Fetching notifications for user:', req.user._id);
        const notifications = await Notification.find({ to: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        console.log(`Found ${notifications.length} notifications`);
        res.json(notifications);
    } catch (error) {
        console.error('Fetch notifications error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { to: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
    const { items, totalAmount, paymentUTR, shippingAddress } = req.body;

    if (!paymentUTR || paymentUTR.length !== 12) {
        return res.status(400).json({ message: 'Invalid UTR. Must be 12 digits.' });
    }

    if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required.' });
    }

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        // Check stock first
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product not found` });
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }
        }

        // Generate 6-digit OTP (stored but NOT sent yet)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Create Order
        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            deliveryOtp: hashedOtp,
            paymentUTR,
            shippingAddress,
            status: 'Pending Verification'
        });

        const createdOrder = await order.save();

        // Deduct stock immediately (or reserve it)
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            await product.save();
        }

        // Notify Admin/Manager
        try {
            const highLevelOps = await User.find({ role: { $in: ['admin', 'manager'] } });
            const notifications = highLevelOps.map(op => ({
                to: op._id,
                from: req.user._id,
                title: 'New Acquisition Staged',
                message: `Operative ${req.user.name} has staged a new acquisition manifest (#${createdOrder._id.toString().slice(-6)}) for ₹${totalAmount.toLocaleString()}. Verification required.`
            }));
            await Notification.insertMany(notifications);
        } catch (notifierErr) {
            console.error('Signal Broadcast Failed:', notifierErr);
        }

        res.status(201).json({
            _id: createdOrder._id,
            totalAmount: createdOrder.totalAmount,
            status: createdOrder.status,
            message: "Order placed. Waiting for Payment Verification."
        });
    }
};

// New: Manager verifies payment
exports.verifyPayment = async (req, res) => {
    const { orderId, action } = req.body; // action: 'approve' | 'reject'
    try {
        const order = await Order.findById(orderId).populate('user');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (action === 'approve') {
            order.paymentVerified = true;
            order.status = 'Processing'; // Ready for delivery
            await order.save();

            // NOW send the OTP to the User via Email
            // We need the original OTP? We hashed it. We cannot retrieve it.
            // SOLUTION: Regenerate OTP or just assume we can't show it?
            // Actually, we can generate a new OTP now and save it if we want to be secure,
            // OR we rely on the fact that we can't email the hashed one.
            // BUG FIX: We hashed it at creation. We can't email it now.
            // BETTER APPROACH: Generate OTP *HERE* when verifying.

            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = await bcrypt.genSalt(10);
            order.deliveryOtp = await bcrypt.hash(newOtp, salt);
            await order.save();

            // Create Notification with plain OTP for User
            const notification = new Notification({
                to: order.user._id,
                from: req.user._id, // The manager/admin who approved
                title: 'Order Approved!',
                message: `Order #${order._id.toString().slice(-6)} is approved. Your delivery OTP is: ${newOtp}`
            });
            await notification.save();

            // Broadcoast approval signal to Admins and the Approver
            try {
                // Determine who to notify: All Admins + The Manager who did it (if they are not an admin)
                // If req.user is admin, they are included in 'admins'. If manager, we explicitly add them.
                const admins = await User.find({ role: 'admin' });
                const adminIds = admins.map(a => a._id.toString());

                const recipients = [...adminIds];
                if (!recipients.includes(req.user._id.toString())) {
                    recipients.push(req.user._id.toString());
                }

                const adminNotifications = recipients.map(recipientId => ({
                    to: recipientId,
                    from: req.user._id,
                    title: 'Order Verified & OTP Generated',
                    message: `Order #${order._id.toString().slice(-6)} for ${order.user.name} has been verified. OTP ${newOtp} dispatched to user.`
                }));

                await Notification.insertMany(adminNotifications);
            } catch (err) { console.error('Admin Signal Failed', err); }

            try {
                await sendEmail({
                    email: order.user.email,
                    subject: 'Payment Verified & Order OTP',
                    message: `Your payment (UTR: ${order.paymentUTR}) for Order #${order._id} is VERIFIED.\n\nYour Delivery OTP is: ${newOtp}\n\nShow this to the delivery agent.`
                });
            } catch (e) { console.log("Email failed", e); }

            res.json({ message: 'Payment Verified. OTP sent to user dashboard and email.', order });

        } else if (action === 'reject') {
            order.status = 'Cancelled';
            order.paymentVerified = false;

            // Restock items since we deducted them?
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.quantity += item.quantity;
                    await product.save();
                }
            }
            await order.save();

            try {
                await sendEmail({
                    email: order.user.email,
                    subject: 'Order Cancelled - Payment Failed',
                    message: `Your order #${order._id} has been CANCELLED.\nReason: Payment UTR ${order.paymentUTR} matched no record or was invalid.`
                });
            } catch (e) { console.log("Email failed"); }

            res.json({ message: 'Order Cancelled and Stock Reverted', order });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyDelivery = async (req, res) => {
    const { otp } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status === 'Received') {
            return res.status(400).json({ message: 'Order already delivered' });
        }

        // Compare OTP
        const isMatch = await bcrypt.compare(otp, order.deliveryOtp);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        order.status = 'Received';
        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

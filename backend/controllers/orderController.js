const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const { logTransaction } = require('../utils/transactionLogger');

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

            // Check for Low Stock Signal
            if (product.quantity < product.lowStockThreshold) {
                try {
                    const highLevelOps = await User.find({ role: { $in: ['admin', 'manager'] } });
                    const notifications = highLevelOps.map(op => ({
                        to: op._id,
                        from: req.user._id, // System alert triggered by this user's order
                        title: 'Critical Asset Depletion',
                        message: `Strategic Warning: Asset "${product.name}" is running low (${product.quantity} remaining). Threshold: ${product.lowStockThreshold}. Immediate resupply urged.`
                    }));
                    await Notification.insertMany(notifications);
                } catch (err) { console.error('Low Stock Signal Failure:', err); }
            }
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

        // Log transaction
        await logTransaction({
            userId: req.user._id,
            type: 'order',
            relatedOrder: createdOrder._id,
            amount: totalAmount,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            status: 'pending',
            description: `New order #${createdOrder._id.toString().slice(-6)} - ${items.length} item(s)`,
            metadata: {
                paymentUTR,
                shippingAddress,
                notes: 'Order placed, awaiting payment verification'
            },
            createdBy: req.user._id
        });

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
        const order = await Order.findById(orderId).populate('user').populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (action === 'approve') {
            order.paymentVerified = true;
            order.status = 'Processing'; // Ready for delivery

            // Payout Logic linked to Sales Team
            if (order.items && order.items.length > 0) {
                // Determine Sales Team from the first product (assuming bundled order belongs to one team logic for now or primary product)
                // In a complex multi-vendor system, we'd split orders, but here we link the order to the sales team of the first item.
                const primaryProduct = order.items[0].product;
                if (primaryProduct && primaryProduct.addedBy) {
                    order.salesTeam = primaryProduct.addedBy;
                    // 10% Discount/Platform Fee -> 90% Payout
                    order.payoutAmount = order.totalAmount * 0.90;
                    order.payoutStatus = 'Eligible';
                }
            }

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
            console.log('Creating notification for user:', order.user._id);
            const notification = new Notification({
                to: order.user._id,
                from: req.user._id, // The manager/admin who approved
                title: 'Order Approved!',
                message: `Order #${order._id.toString().slice(-6)} is approved. Your delivery OTP is: ${newOtp}`
            });
            await notification.save();
            console.log('Notification saved successfully for user');

            // Broadcast approval signal to Admins and the Approver (WITHOUT showing OTP)
            try {
                const admins = await User.find({ role: 'admin' });
                const adminIds = admins.map(a => a._id.toString());

                const recipients = [...adminIds];
                if (!recipients.includes(req.user._id.toString())) {
                    recipients.push(req.user._id.toString());
                }

                const adminNotifications = recipients.map(recipientId => ({
                    to: recipientId,
                    from: req.user._id,
                    title: 'Order Verified',
                    message: `Order #${order._id.toString().slice(-6)} for ${order.user.name} has been verified. OTP sent to user.`
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

            // Update transaction to completed
            try {
                const Transaction = require('../models/Transaction');
                const transactionUpdate = await Transaction.findOneAndUpdate(
                    { relatedOrder: order._id, type: 'order' },
                    {
                        status: 'completed',
                        description: `Order #${order._id.toString().slice(-6)} payment verified and approved`,
                        updatedBy: req.user._id,
                        'metadata.approvalDate': new Date(),
                        'metadata.approvedBy': req.user.name
                    },
                    { new: true }
                );
                console.log('Transaction status updated to completed:', transactionUpdate ? 'Success' : 'NotFound');
            } catch (transErr) {
                console.error('Failed to update transaction status:', transErr);
            }

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

            // Update transaction to cancelled
            const Transaction = require('../models/Transaction');
            await Transaction.findOneAndUpdate(
                { relatedOrder: order._id, type: 'order' },
                {
                    status: 'cancelled',
                    description: `Order #${order._id.toString().slice(-6)} payment rejected and cancelled`,
                    updatedBy: req.user._id
                }
            );

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

exports.getPayouts = async (req, res) => {
    try {
        // Admins see all eligible/paid payouts. Sales see only theirs.
        let query = { payoutStatus: { $in: ['Eligible', 'Paid'] } };
        if (req.user.role === 'sales') {
            query.salesTeam = req.user._id;
        }

        const orders = await Order.find(query)
            .populate('user', 'name')
            .populate('items.product', 'name price addedBy')
            .populate('salesTeam', 'name email')
            .sort({ updatedAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.processPayout = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.payoutStatus !== 'Eligible') {
            return res.status(400).json({ message: 'Order not eligible for payout or already paid' });
        }

        order.payoutStatus = 'Paid';
        await order.save();

        // Log Payout Transaction
        const { logTransaction } = require('../utils/transactionLogger');
        await logTransaction({
            userId: order.salesTeam, // The beneficiary of the payout
            type: 'payout',
            relatedOrder: order._id,
            amount: order.payoutAmount,
            quantity: 1, // Conceptually 1 payout
            status: 'completed',
            description: `Commission Payout for Order #${order._id.toString().slice(-6)}`,
            metadata: {
                salesTeamId: order.salesTeam,
                notes: '10% Platform Fee deducted',
                processedBy: req.user.name // Add info about who processed it
            },
            createdBy: req.user._id
        });

        // Notify Sales Team
        await Notification.create({
            to: order.salesTeam,
            from: req.user._id,
            title: 'Payout Received',
            message: `Payout of ₹${order.payoutAmount?.toLocaleString()} for Order #${order._id.toString().slice(-6)} has been credited.`
        });

        res.json({ message: 'Payout Processed Successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

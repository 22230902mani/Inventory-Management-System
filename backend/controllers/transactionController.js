const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get transactions with role-based filtering
exports.getTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status, startDate, endDate, search } = req.query;
        const userRole = req.user.role;
        const userId = req.user._id;

        // Build query based on role
        let query = {};

        // Users see only their own transactions
        if (userRole === 'user' || userRole === 'sales') {
            query.user = userId;
        }
        // Managers and Admins see all transactions (no user filter)

        // Apply filters
        if (type) query.type = type;
        if (status) query.status = status;

        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Search by description or amount
        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { 'metadata.paymentUTR': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const transactions = await Transaction.find(query)
            .populate('user', 'name email role')
            .populate({
                path: 'relatedOrder',
                populate: [
                    { path: 'salesTeam', select: 'name email' },
                    { path: 'items.product', select: 'name' }
                ]
            })
            .populate('relatedProduct', 'name sku')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Transaction.countDocuments(query);

        res.json({
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalTransactions: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

// Get single transaction
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('relatedOrder')
            .populate('relatedProduct', 'name sku')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Users can only view their own transactions
        if ((req.user.role === 'user' || req.user.role === 'sales') &&
            transaction.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction', error: error.message });
    }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { type, relatedOrder, relatedProduct, amount, quantity, status, description, metadata } = req.body;

        const transaction = await Transaction.create({
            user: req.body.user || req.user._id,
            type,
            relatedOrder,
            relatedProduct,
            amount,
            quantity,
            status: status || 'pending',
            description,
            metadata,
            createdBy: req.user._id
        });

        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('user', 'name email role')
            .populate('relatedOrder')
            .populate('relatedProduct', 'name sku');

        res.status(201).json(populatedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

// Update transaction (Admin/Manager only)
exports.updateTransaction = async (req, res) => {
    try {
        const { status, description, metadata } = req.body;

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (status) transaction.status = status;
        if (description) transaction.description = description;
        if (metadata) transaction.metadata = { ...transaction.metadata, ...metadata };
        transaction.updatedBy = req.user._id;

        await transaction.save();

        const updatedTransaction = await Transaction.findById(transaction._id)
            .populate('user', 'name email role')
            .populate('relatedOrder')
            .populate('relatedProduct', 'name sku')
            .populate('updatedBy', 'name');

        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error: error.message });
    }
};

// Get analytics (Admin only)
exports.getAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Total transactions
        const totalTransactions = await Transaction.countDocuments(dateFilter);

        // Transactions by type
        const transactionsByType = await Transaction.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
        ]);

        // Transactions by status
        const transactionsByStatus = await Transaction.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
        ]);

        // Total revenue
        const revenueData = await Transaction.aggregate([
            { $match: { ...dateFilter, status: 'completed', type: { $in: ['order', 'sale'] } } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);

        // Recent transactions trend (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactionsTrend = await Transaction.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top users by transaction volume
        const topUsers = await Transaction.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$user',
                    transactionCount: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 1,
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    transactionCount: 1,
                    totalAmount: 1
                }
            }
        ]);

        // Total Payouts
        const payoutData = await Transaction.aggregate([
            { $match: { ...dateFilter, status: 'completed', type: 'payout' } },
            { $group: { _id: null, totalPayouts: { $sum: '$amount' } } }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;
        const totalPayouts = payoutData[0]?.totalPayouts || 0;
        const netBalance = totalRevenue - totalPayouts;

        res.json({
            totalTransactions,
            transactionsByType,
            transactionsByStatus,
            totalRevenue,
            totalPayouts,
            netBalance,
            transactionsTrend,
            topUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

// Export transactions (Admin only)
exports.exportTransactions = async (req, res) => {
    try {
        const { type, status, startDate, endDate, format = 'json' } = req.query;

        let query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .populate('user', 'name email role')
            .populate('relatedOrder')
            .populate('relatedProduct', 'name sku')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Convert to CSV
            const csv = [
                ['Date', 'Type', 'User', 'Amount', 'Status', 'Description', 'Payment UTR'].join(','),
                ...transactions.map(t => [
                    new Date(t.createdAt).toISOString(),
                    t.type,
                    t.user?.name || 'N/A',
                    t.amount,
                    t.status,
                    `"${t.description}"`,
                    t.metadata?.paymentUTR || ''
                ].join(','))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
            return res.send(csv);
        }

        // Default to JSON
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting transactions', error: error.message });
    }
};

// Delete transaction (Admin only)
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error: error.message });
    }
};

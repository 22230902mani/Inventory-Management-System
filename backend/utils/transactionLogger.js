const Transaction = require('../models/Transaction');

/**
 * Log a transaction automatically
 * @param {Object} data - Transaction data
 * @param {String} data.userId - User ID
 * @param {String} data.type - Transaction type (order, refund, purchase, sale, inventory_adjustment)
 * @param {Number} data.amount - Transaction amount
 * @param {String} data.description - Transaction description
 * @param {Object} data.metadata - Additional metadata
 * @param {String} data.relatedOrder - Related Order ID (optional)
 * @param {String} data.relatedProduct - Related Product ID (optional)
 * @param {Number} data.quantity - Quantity (optional)
 * @param {String} data.status - Transaction status (pending, completed, failed, cancelled)
 * @param {String} data.createdBy - Creator user ID (optional)
 */
const logTransaction = async (data) => {
    try {
        const transaction = await Transaction.create({
            user: data.userId,
            type: data.type,
            relatedOrder: data.relatedOrder,
            relatedProduct: data.relatedProduct,
            amount: data.amount,
            quantity: data.quantity,
            status: data.status || 'pending',
            description: data.description,
            metadata: data.metadata || {},
            createdBy: data.createdBy || data.userId
        });

        console.log('Transaction logged successfully:', transaction._id);
        return transaction;
    } catch (error) {
        console.error('Error logging transaction:', error);
        // Don't throw error to prevent disrupting the main operation
        return null;
    }
};

module.exports = { logTransaction };

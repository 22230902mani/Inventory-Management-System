const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentUTR: { type: String, required: true }, // UPI Transaction ID
    paymentVerified: { type: Boolean, default: false },
    status: { type: String, default: 'Pending Verification', enum: ['Pending Verification', 'Processing', 'Shipped', 'Received', 'Cancelled'] },
    deliveryOtp: { type: String }, // Hashed OTP
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

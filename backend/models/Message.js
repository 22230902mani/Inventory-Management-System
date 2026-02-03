const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, if null maybe broadcast to all admins
    content: { type: String, required: true },
    relatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    attachment: { type: String }, // Path to uploaded file
    isRead: { type: Boolean, default: false },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' }, // WhatsApp-style status
    readAt: { type: Date } // When the message was seen
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

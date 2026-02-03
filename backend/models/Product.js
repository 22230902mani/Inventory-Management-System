const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    barcode: { type: String, unique: true, sparse: true }, // Barcode field
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    lowStockThreshold: { type: Number, default: 20 },
    description: { type: String },
    companyName: { type: String, required: true },
    images: { type: [String], validate: [val => val.length >= 3, 'Must have at least 3 images'] },
    status: { type: String, enum: ['active', 'pending', 'rejected', 'paid'], default: 'pending' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
